import { baseResponse, errResponse, response } from "../../../config/response";
import axios from "axios";
import { addUserProfileInfo, isKyonggiEmail, createAuthNum, checkAlarms, 
    createUser, addUserPhoneNumber, addAgreementTerms } from "./userService";
import { isUser, isNicknameDuplicate, retrieveAlarms, getUserIdByEmail, 
    getUserNickNameById, isAuthNumber, isAuthUser, 
    getUserById, getUserPhoneNumber, removeEmojisAndSpace } from "./userProvider";
import { retrievePost } from "../post/postProvider";
import jwt from "jsonwebtoken";
import { sendSMS } from "../../../config/naverCloudClient";
import { naverCloudSensSecret } from "../../../config/configs";
import NodeCache from "node-cache";
import dayjs from 'dayjs';

const cache = new NodeCache();


/** 구글 로그인 API */
export const login = async(req, res) => {
    const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const googleAccessToken = req.body.accessToken;

    const resUserInfo = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
          Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    const userEmail = resUserInfo.data.email;  

    if (isKyonggiEmail(userEmail) == false) {
        return res.send(errResponse(baseResponse.SIGNUP_EMAIL_KYONGGI));
    }

    const accessToken = jwt.sign({ userEmail : userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '7days', issuer : 'univeus' })    

    if(!accessToken) return res.send(errResponse(baseResponse.VERIFIED_ACCESS_TOKEN_EMPTY));
    
    if (!await isUser(userEmail)) {
        createUser(userEmail);
        return res.send(response(baseResponse.LOGIN_NOT_USER, { accessToken }));
    }

    if (!await isAuthNumber(userEmail)) {
        return res.send(response(baseResponse.LOGIN_NOT_AUTH_NUMBER, { accessToken }));
    }

    if (!await isAuthUser(userEmail)) {
        return res.send(response(baseResponse.LOGIN_NOT_AUTH_COMPLETE_USER, { accessToken }));
    }
    return res.send(response(baseResponse.SUCCESS,{ accessToken }));
}

/** 인증번호 문자 전송 API */
export const sendAuthNumber = async(req, res) => {
    const to = req.body.phoneNumber;

    if (typeof to == "undefined") {
        return res.send(errResponse(baseResponse.VERIFY_PHONE_EMPTY));
    }
    
    cache.del(to);
    const sendAuth = createAuthNum();
    const content = `[UNIVEUS] 인증번호는 "${sendAuth}"입니다.`;
    const { success } = await sendSMS(naverCloudSensSecret, { to, content });

    // 서버 캐시에 인증번호 및 유저 전화번호 임시 저장, 3분동안 유효
    cache.set(to, sendAuth, 180);

    if (!success) {
        return res.send(errResponse(baseResponse.SEND_AUTH_NUMBER_MSG_FAIL));
    } 

    return res.send(response(baseResponse.SEND_AUTH_NUMBER_MSG))
}

/** 인증번호 검증 API */
export const verifyNumber = async(req, res) => {

    const phoneNumber = await getUserPhoneNumber(req.verifiedToken.userEmail);

    if(phoneNumber != null) {
        return res.send(errResponse(baseResponse.ALREADY_AUTH_NUMBER))  
    } 

    const userPhone = req.body.phoneNumber;
    const userAuthNumber = req.body.number;

    if (userPhone == "") {
        return res.send(errResponse(baseResponse.VERIFY_PHONE_EMPTY));
    }

    if (userAuthNumber == "") {
        return res.send(errResponse(baseResponse.VERIFY_NUMBER_EMPTY));
    }


    const authNumber = cache.get(userPhone);

    if (authNumber == userAuthNumber) {
        const userId = await getUserIdByEmail(req.verifiedToken.userEmail);
        addUserPhoneNumber(userPhone, userId);

        cache.del(userPhone);
        
        return res.send(response(baseResponse.VERIFY_NUMBER_SUCCESS));
    }
    
    return res.send(errResponse(baseResponse.VERIFY_NUMBER_FAIL));
}

/** 참여 취소 알림 (to 작성자) >> 축제 때는 안 쓰임*/
export const sendCancelMessageAlarm = async(user_id,userIdFromJWT) =>{ // 알림을 보낼 유저

    const User = await getUserById(user_id); 
    const to = User.phone;

    const userNickName = await getUserNickNameById(userIdFromJWT); // user_id로 닉네임 가져오기
    const content = `[UNIVEUS] 유니버스에 참여했던 '${userNickName}'님이/가 참여 취소하였습니다.`;


    const { success } = await sendSMS(naverCloudSensSecret, { to, content });
    if (!success) { return false} 
    else { return true}
};

/** 유저 신고 관련 알림 (to 관리자) */
export const sendUserReportAlarm = async(reportedBy,reportedUser) =>{ 

    const to = "01092185178"; // 일단 내번호로....
    const content = `[UNIVEUS 유저 신고] user_id = '${reportedBy}' >> user_id = '${reportedUser}'을 신고했습니다.`;

    const { success } = await sendSMS(naverCloudSensSecret, { to, content });
    if (!success) { return false} 
    else { return true}
};

/** 게시글 신고 관련 알림 (to 관리자) */
export const sendPostReportAlarm = async(reportedBy, reportedPost) =>{ 

    const to = "01092185178"; // 일단 내번호로....
    const content = `[UNIVEUS 게시글 신고] user_id = '${reportedBy}' >> post_id = '${reportedPost}'을 신고했습니다.`;

    const { success } = await sendSMS(naverCloudSensSecret, { to, content });
    if (!success) { return false} 
    else { return true}
};



/** 닉네임 중복 체크 API */
export const checkNickNameDuplicate = async (req, res) => {
    const nickname = removeEmojisAndSpace(req.body.nickname);
    console.log(nickname)
        if (await isNicknameDuplicate(nickname)){
             return res.send(errResponse(baseResponse.NICK_NAME_DUPLICATE));
        }
        else {
            return res.send(response(baseResponse.SUCCESS));
        }
}

/**유니버스 시작하기 API */
export const startUniveUs = async (req, res) => {

        if (typeof req.body.nickname == "undefined") return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));

        if (typeof req.body.gender == "undefined") return res.send(errResponse(baseResponse.SIGNUP_GENDER_EMPTY));

        if (typeof req.body.major == "undefined") return res.send(errResponse(baseResponse.SIGNUP_MAJOR_EMPTY));

        if (typeof req.body.studentId == "undefined") return res.send(errResponse(baseResponse.SIGNUP_STUDENTID_EMPTY));   

        const userEmail = req.verifiedToken.userEmail;


        const userInfo = {
            nickname : removeEmojisAndSpace(req.body.nickname),
            gender: req.body.gender,
            major : req.body.major,
            studentId : req.body.studentId,
            userEmail : userEmail
        };


        if (isKyonggiEmail(userEmail) == false)  return res.send(errResponse(baseResponse.SIGNUP_EMAIL_KYONGGI));
        
        await addUserProfileInfo(userInfo);

        const to = await getUserPhoneNumber(userEmail);

        const content = `
[UNIVEUS] 
안녕하세요. ${userInfo.nickname} 학우 님! 유니버스에 오신것을 환영합니다 :)

문의사항 : https://www.instagram.com/unive.us 

**(중요)유니버스 사용 수칙**

- 함께 [생성/참여] 할 친구 또한 회원가입이 되어 있어야 해요.
1인 신청은 불가합니다 :(
    
1. 모임을 생성하셨다면, 생성과 동시에 타 모임 참여는 불가능합니다!
하루에 생성과 참여 둘 중 하나만 가능해요.
*생성 이후 타 모임에 참여로 바꾸고 싶다면 매칭 되기 전 생성된 모임을 삭제하시면 됩니다.
2. 모임을 [생성] 할 시 “카카오톡 오픈채팅”방을 먼저 생성해주세요
[참여]는 상관 없습니다.
3. 모임을 생성/참가한 후 함께하는 친구의 닉네임을 (꼭!) 추가해주세요
- 유니버스 접속링크 : https://univeus.com`;

        // const { success } = await sendSMS(naverCloudSensSecret, { to, content });

        return res.send(response(baseResponse.SUCCESS));
};

/**
 * API name : 알림 내역 조회
 * GET: /uesr/{user_id}/alarm
 */
export const getAlarms = async(req, res) => {
	
    const {user_id} = req.params; // 알림 받은 유저의 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 접속 중인 유저 ID

    if(userIdFromJWT == user_id){
        const getAlarmsResult = await retrieveAlarms(userIdFromJWT); 
        return res.status(200).json(response(baseResponse.SUCCESS, getAlarmsResult));
    }
    else{
        return res.status(400).json(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    }  
};



/**
 * API name : 알림 확인 
 * PATCH: /uesr/{user_id}/alarm
 */
export const patchAlarms = async(req, res) => {

    const {user_id} = req.params; //알림을 확인하려는 유저 ID
    const {alarm_id} = req.body;
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 접속 중인 유저 ID
    
    if(userIdFromJWT == user_id){
        const patchAlarmsResult = await checkAlarms(alarm_id);   
        return res.status(200).json(response(baseResponse.SUCCESS, patchAlarmsResult));
    } 
    else{ 
        return res.status(400).json(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    } 
};

/** 약관 동의 API*/
// TODO: DAO, SERVICE 구현
export const agreementTerms = async(req, res) => {

    const userEmail = req.verifiedToken.userEmail;
    const userId = await getUserIdByEmail(userEmail);
    const userAgreed = req.body.userAgreement

    if (userAgreed[0] == 0) return res.send(errResponse(baseResponse.FIRST_AGREEMENT_EMPTY));

    if (userAgreed[1] == 0) return res.send(errResponse(baseResponse.SECOND_AGREEMENT_EMPTY));

    if (userAgreed[2] == 0) return res.send(errResponse(baseResponse.THIRD_AGREEMENT_EMPTY));

    await addAgreementTerms(userId, userAgreed);

    return res.send(response(baseResponse.SUCCESS));
}
