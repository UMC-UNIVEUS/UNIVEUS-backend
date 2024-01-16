import { baseResponse, errResponse, response } from "../../../config/response";
import axios from "axios";
import { addUserAffiliation, isKyonggiEmail, createAuthNum, checkAlarms, 
    createUser, addUserPhoneNumber, addAgreementTerms, addUserProfile } from "./userService";
import { isUser, isNicknameDuplicate, retrieveAlarms, getUserIdByEmail, 
    getUserNickNameById, isAuthNumber, isAuthUser, 
    getUserById, getUserPhoneNumber, removeEmojisAndSpace,
    isProfileExist, isUserAgree } from "./userProvider";
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
    let userId 

    const resUserInfo = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
          Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    const userEmail = resUserInfo.data.email;  

    // 경기대 이메일인지 확인
    if (isKyonggiEmail(userEmail) == false) {
        return res.send(errResponse(baseResponse.SIGNUP_EMAIL_KYONGGI));
    }

    // 구글 로그인을 해 본 유저인지 확인
    if (!await isUser(userEmail)) {
        userId = await createUser(userEmail);
        return res.send(response(baseResponse.LOGIN_NOT_USER, { accessToken }));
    }
    
    userId = await getUserIdByEmail(userEmail);

    const accessToken = jwt.sign({ userId : userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '100days', issuer : 'univeus' })    

    if(!accessToken) return res.send(errResponse(baseResponse.VERIFIED_ACCESS_TOKEN_EMPTY));

    if (!await isAuthNumber(userId)) {
        return res.send(response(baseResponse.LOGIN_NOT_AUTH_NUMBER, { accessToken }));
    }

    // TODO 이용약관 동의 여부 확인
    if (!await isUserAgree(userId)) {
        return res.send(response(baseResponse.LOGIN_NOT_USER_AGREE, { accessToken }));
    }

    // 소속인증 한 유저
    if (!await isAuthUser(userId)) {
        return res.send(response(baseResponse.LOGIN_NOT_AUTH_COMPLETE_USER, { accessToken }));
    }

    // 프로필 유무 확인
    if (!await isProfileExist(userId)) {
        return res.send(response(baseResponse.LOGIN_PROFILE_NOT_EXIST, { accessToken }));
    }

    return res.send(response(baseResponse.SUCCESS,{ accessToken }));
}

/** 인증번호 문자 전송 API */
export const sendAuthNumber = async(req, res) => {
    const to = req.body.phoneNumber;

    /** req.body에 phoneNumber가 누락 된 경우 errResponse 전송 */
    if (typeof to == "undefined") {
        return res.send(errResponse(baseResponse.VERIFY_PHONE_EMPTY));
    }
    
    cache.del(to);
    const sendAuth = createAuthNum();
    const content = `[UNIVEUS] 인증번호는 "${sendAuth}"입니다.`;
    const { success } = await sendSMS(naverCloudSensSecret, { to, content });

    // 서버 캐시에 인증번호 및 유저 전화번호 임시 저장, 3분동안 유효
    cache.set(to, sendAuth, 180);

    /** 인증번호 전송 메세지가 성공하지 못한 경우 errResponse 전송 */
    if (!success) {
        return res.send(errResponse(baseResponse.SEND_AUTH_NUMBER_MSG_FAIL));
    } 

    return res.send(response(baseResponse.SUCCESS))
}

/** 인증번호 검증 API */
export const verifyNumber = async(req, res) => {
    
    const phoneNumber = await getUserPhoneNumber(req.verifiedToken.userId);

    /** phoneNumber가 null일 경우 이미 검증된 번호임*/
    if(phoneNumber != null) {
        return res.send(errResponse(baseResponse.ALREADY_AUTH_NUMBER))  
    }

    const userPhone = req.body.phoneNumber;
    const userAuthNumber = req.body.number;

    /** userPhone(전화번호)가 입력되지 않는 경우 errResponse 전송*/
    if (userPhone == "") {
        return res.send(errResponse(baseResponse.VERIFY_PHONE_EMPTY));
    }

    /** userAuthNumber(인증번호)가 입력되지 않는 경우 errResponse 전송*/
    if (userAuthNumber == "") {
        return res.send(errResponse(baseResponse.VERIFY_NUMBER_EMPTY));
    }

    const authNumber = cache.get(userPhone);

    if (authNumber == userAuthNumber) {
        const userId = req.verifiedToken.userId;
        addUserPhoneNumber(userPhone, userId);

        cache.del(userPhone);
        
        return res.send(response(baseResponse.SUCCESS));
    }
    
    return res.send(errResponse(baseResponse.VERIFY_NUMBER_FAIL));
}

/** 게시글 작성 시 문자 알림 (to 작성자, 초대받은 사람들)*/
export const sendCreatePostMessageAlarm = async(user_id, post_id,participants) =>{
    
    const Post = await retrievePost(post_id); 
    const User = await getUserById(user_id); // 작성자 id
    const writerPhone = User.phone;

    const date = dayjs(Post.meeting_date);
    Post.meeting_date = date.month() + 1 + "월 " + date.date() + "일 " + date.hour() + ":" + date.minute();
    if(Post.limit_people == 4){

        const participantPhone = participants.phone
        
        const content = `
[UNIVEUS] 
'${User.nickname}'님의 [${Post.title}] 유니버스가 생성되었습니다.
즐겁고 유익한 행성을 만들어 주세요 :)

- 나의 유니버스 확인하기 : 
- 같이 하는 친구 : 
방장: '${User.nickname}',
'${participants.nickname}'
- 최대 인원 : ${Post.limit_people}
- 모임 장소 : ${Post.location}
- 모임 시간 : ${Post.meeting_date}
- 나의 유니버스 오픈채팅방 : ${Post.openchat}
    
*다른 행성에 참여하고 싶다면 매칭 전 이 행성을 삭제해 주세요!

*매칭 시 유의사항*

- 유니버스는 우리 학교 학우들이 모인 공간입니다. 부적절한 행위 적발 시 서비스 이용에 제약이 있을 수 있습니다. 학우들과 즐거운 추억을 만들어 보아요 :)
- 유니버스는 반 익명성을 지향하고 있습니다. 신뢰성 있는 유익한 소셜링을 진행해 주시길 부탁드립니다.
- 긴급상황 발생 시 [https://www.instagram.com/unive.us] 로 연락주시면 운영자가 달려가 조치하겠습니다.`; 
   const { success1 } = await sendSMS(naverCloudSensSecret, { to: writerPhone, content });
   const { success2 } = await sendSMS(naverCloudSensSecret, { to: participantPhone, content });

    if (!success1 || !success2) {return false}
    else {return true}
    }
    else if(Post.limit_people== 6){

        const participant1Phone = participants[0].phone
        const participant2Phone = participants[1].phone

        const content = `
[UNIVEUS] 
'${User.nickname}'님의 [${Post.title}] 유니버스가 생성되었습니다.
즐겁고 유익한 행성을 만들어 주세요 :)

- 나의 유니버스 확인하기 : 
- 같이 하는 친구 : 
방장: '${User.nickname}',
'${participants[0].nickname}',
'${participants[1].nickname}'
- 최대 인원 : ${Post.limit_people}
- 모임 장소 : ${Post.location}
- 모임 시간 : ${Post.meeting_date}
- 나의 유니버스 오픈채팅방 : ${Post.openchat}
    
*다른 행성에 참여하고 싶다면 매칭 전 이 행성을 삭제해 주세요!

*매칭 시 유의사항*

- 유니버스는 우리 학교 학우들이 모인 공간입니다. 부적절한 행위 적발 시 서비스 이용에 제약이 있을 수 있습니다. 학우들과 즐거운 추억을 만들어 보아요 :)
- 유니버스는 반 익명성을 지향하고 있습니다. 신뢰성 있는 유익한 소셜링을 진행해 주시길 부탁드립니다.
- 긴급상황 발생 시 [https://www.instagram.com/unive.us] 로 연락주시면 운영자가 달려가 조치하겠습니다.`;
    const { success1 } = await sendSMS(naverCloudSensSecret, { to: writerPhone, content });
    const { success2 } = await sendSMS(naverCloudSensSecret, { to: participant1Phone, content });
    const { success3 } = await sendSMS(naverCloudSensSecret, { to: participant2Phone, content });

    if (!success1 || !success2 || !success3) {return false}
    else {return true}
    }
};

/** 게시글 매칭(참여) 시 문자 알림 (to old 참여자, new 참여자)*/
export const sendParticipantMessageAlarm = async(post_id, MessageAlarmList) =>{ // 알림을 보낼 유저, 알림 type
    // const MessageAlarmList = [Writer, [alreadyParticipant], Invitee, [guest]]

    const Post = await retrievePost(post_id);
    const date = dayjs(Post.meeting_date);
    Post.meeting_date = date.month() + 1 + "월 " + date.date() + "일 " + date.hour() + ":" + date.minute();

    if(MessageAlarmList[1].length == 1){ // 제한 인원 == 4
        const content = `
[UNIVEUS] 
'${MessageAlarmList[0].nickname}'님의 [${Post.title}] 유니버스가 매칭 완료되었습니다.
즐겁고 행복한 추억을 만드시기 바랍니다 :)

- 나의 유니버스 확인하기 : 
- 같이 하는 친구 : 
방장: '${MessageAlarmList[0].nickname}', 
'${MessageAlarmList[1][0].nickname}', 
'${MessageAlarmList[2].nickname}', 
'${MessageAlarmList[3][0].nickname}'
- 최대 인원 : ${Post.limit_people}
- 모임 장소 : ${Post.location}
- 모임 시간 : ${Post.meeting_date}
- 나의 유니버스 오픈채팅방 : ${Post.openchat}
    
*오픈채팅방에 아직 입장하지 않으셨다면 꼭 입장해서 소통해 주세요 :)
*모임 시간에 늦지 않게 시간과 장소를 잘 확인해 주세요!

*매칭 시 유의사항*

- 유니버스는 우리 학교 학우들이 모인 공간입니다. 부적절한 행위 적발 시 서비스 이용에 제약이 있을 수 있습니다. 학우들과 즐거운 추억을 만들어 보아요 :)
- 유니버스는 반 익명성을 지향하고 있습니다. 신뢰성 있는 유익한 소셜링을 진행해 주시길 부탁드립니다.
- 긴급상황 발생 시 [https://www.instagram.com/unive.us] 로 연락주시면 운영자가 달려가 조치하겠습니다.

즐거우셨다면 유니버스를 평가해 주세요! 큰 도움이 됩니다!!
[링크]`; 
        const { success1 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[0].phone, content });
        const { success2 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[1][0].phone, content });
        const { success3 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[2].phone, content });   
        const { success4 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[3][0].phone, content });  
        if (!success1 || !success2 || !success3 || !success4) {return false}
        else {return true}
    } 
    else if(MessageAlarmList[1].length == 2){// 제한 인원 == 6
        const content = `
[UNIVEUS] 
'${MessageAlarmList[0].nickname}'님의 [${Post.title}] 유니버스가 매칭 완료되었습니다.
즐겁고 행복한 추억을 만드시기 바랍니다 :)

- 나의 유니버스 확인하기 : 
- 같이 하는 친구 : 
'${MessageAlarmList[0].nickname}', 
'${MessageAlarmList[1][0].nickname}', 
'${MessageAlarmList[1][1].nickname}', 
'${MessageAlarmList[2].nickname}', 
'${MessageAlarmList[3][0].nickname}', 
'${MessageAlarmList[3][1].nickname}'
- 최대 인원 : ${Post.limit_people}
- 모임 장소 : ${Post.location}
- 모임 시간 : ${Post.meeting_date}
- 나의 유니버스 오픈채팅방 : ${Post.openchat}
    
*오픈채팅방에 아직 입장하지 않으셨다면 꼭 입장해서 소통해 주세요 :)
*모임 시간에 늦지 않게 시간과 장소를 잘 확인해 주세요!

*매칭 시 유의사항*

- 유니버스는 우리 학교 학우들이 모인 공간입니다. 부적절한 행위 적발 시 서비스 이용에 제약이 있을 수 있습니다. 학우들과 즐거운 추억을 만들어 보아요 :)
- 유니버스는 반 익명성을 지향하고 있습니다. 신뢰성 있는 유익한 소셜링을 진행해 주시길 부탁드립니다.
- 긴급상황 발생 시 [https://www.instagram.com/unive.us] 로 연락주시면 운영자가 달려가 조치하겠습니다.

즐거우셨다면 유니버스를 평가해 주세요! 큰 도움이 됩니다!!
[링크]`; 
        const { success1 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[0].phone, content });
        const { success2 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[1][0].phone, content });
        const { success3 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[1][1].phone, content });
        const { success4 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[2].phone, content });   
        const { success5 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[3][0].phone, content });  
        const { success6 } = await sendSMS(naverCloudSensSecret, { to: MessageAlarmList[3][1].phone, content });  
        if (!success1 || !success2 || !success3 || !success4 || !success5 || !success6) {return false}
        else {return true}
    } 
};



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

/**소속 등록 API */
export const registerAffiliation = async (req, res) => {

        /** 
         * req.body에서 major가 누락되었을 경우 errResponse return
         * req.body에서 studentId가 누락되었을 경울 errResponse return
         */
        if (typeof req.body.major == "undefined") return res.send(errResponse(baseResponse.SIGNUP_MAJOR_EMPTY));

        if (typeof req.body.studentId == "undefined") return res.send(errResponse(baseResponse.SIGNUP_STUDENTID_EMPTY));   

        const userInfo = {
            userId : req.verifiedToken.userId,
            studentId : req.body.studentId,
            major : req.body.major,
        };
        
        await addUserAffiliation(userInfo);

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
export const agreementTerms = async(req, res) => {

    const userId = req.verifiedToken.userId;
    const userAgreed = req.body.userAgreement

    if (userAgreed[0] != 'checked') return res.send(errResponse(baseResponse.FIRST_AGREEMENT_EMPTY));

    if (userAgreed[1] != 'checked') return res.send(errResponse(baseResponse.SECOND_AGREEMENT_EMPTY));

    await addAgreementTerms(userId, userAgreed);

    return res.send(response(baseResponse.SUCCESS));
}

/** 유저 프로필 등록*/
export const registerUserProfile = async(req, res) => {
    const userId = req.verifiedToken.userId;

    const userProfile = {
        nickname : req.body.nickname,
        gender : req.body.gender
    }

    /**
     * req.body에서 nickname이 비어있을 때
     * req.body에서 gender가 비어있을 때
     */

    if (req.body.nickname == "") return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    if (req.body.gender == "") return res.send(errResponse(baseResponse.USER_GENDER_EMPTY));

    await addUserProfile(userId, userProfile)

    return res.send(response(baseResponse.SUCCESS));
}