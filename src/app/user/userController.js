import { baseResponse, errResponse, response } from "../../../config/response";
import axios from "axios";
import { addUserAffiliation, isKyonggiEmail, createAuthNum, checkAlarms,
    createUser, addUserPhoneNumber, addAgreementTerms, addUserProfile, refreshVerify,
    updateRefreshToken, addBlackList, deleteRefreshToken } from "./userService";
import { isUser, isNicknameDuplicate, retrieveAlarms, getUserIdByEmail,
    isAuthNumber, isAuthUser, getUserPhoneNumber, removeEmojisAndSpace,
    isProfileExist, isUserAgree, getRefreshTokenFromCookies, isBlackListToken } from "./userProvider";
import jwt from "jsonwebtoken";
import { sendSMS } from "../../../config/naverCloudClient";
import { naverCloudSensSecret } from "../../../config/configs";
import NodeCache from "node-cache";

const cache = new NodeCache();


/** 구글 로그인 API */
export const login = async(req, res) => {

    const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const googleAccessToken = req.body.token;
    const maxAgeTwoWeeks = 2 * 7 * 24 * 60 * 60 * 1000; // 2주의 밀리초 값

    let userId

    const resUserInfo = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${googleAccessToken}`,
        },
    });

    const userEmail = resUserInfo.data.email;

    // 경기대 이메일인지 확인
    // if (isKyonggiEmail(userEmail) == false) {
    //     return res.send(errResponse(baseResponse.SIGNUP_EMAIL_KYONGGI));
    // }

    // 구글 로그인을 해 본 유저인지 확인
    if (!await isUser(userEmail)) {
        userId = await createUser(userEmail);

        const accessToken = jwt.sign({ userId : userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '1h', issuer : 'univeus' })
        const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn : '14days', issuer : 'univeus' })

        await updateRefreshToken(refreshToken, userId);
        
        return res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true,
        }).send(response(baseResponse.LOGIN_NOT_USER, {accessToken : accessToken}));
    }

    userId = await getUserIdByEmail(userEmail);

    const accessToken = jwt.sign({ userId : userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '1h', issuer : 'univeus' })
    const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn : '14days', issuer : 'univeus' })

    await updateRefreshToken(refreshToken, userId);

    if(!accessToken) return res.send(errResponse(baseResponse.VERIFIED_ACCESS_TOKEN_EMPTY));

    // 번호인증을 한 유저인지 확인
    if (!await isAuthNumber(userId)) {

        return res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: maxAgeTwoWeeks,
            sameSite: 'none',
            secure: true
        }).send(response(baseResponse.LOGIN_NOT_AUTH_NUMBER, {accessToken : accessToken}));
    }
    
    // 약관 동의를 한 유저인지 확인
    if (!await isUserAgree(userId)) {

        return res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: maxAgeTwoWeeks,
            sameSite: 'none',
            secure: true
        }).send(response(baseResponse.LOGIN_NOT_USER_AGREE, {accessToken : accessToken}));
    }

    // 소속인증 한 유저인지 확인
    if (!await isAuthUser(userId)) {

        return res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: maxAgeTwoWeeks,
            sameSite: 'none',
            secure: true
        }).send(response(baseResponse.LOGIN_NOT_AUTH_COMPLETE_USER, {accessToken : accessToken}));
    }

    // 프로필등록을 한 유저인지 확인
    if (!await isProfileExist(userId)) {

        return res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            maxAge: maxAgeTwoWeeks,
            sameSite: 'none',
            secure: true
        }).send(response(baseResponse.LOGIN_PROFILE_NOT_EXIST, {accessToken : accessToken}));
    }

    // 성공 시 response 반환

    return res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        maxAge: maxAgeTwoWeeks,
        sameSite: 'none',
        secure: true
    }).send(response(baseResponse.SUCCESS, {accessToken : accessToken}));
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
        gender : req.body.gender,
        userImage : req.body.profile_img
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

/** refreshToken으로 accessToken 요청 함수 */
export const refreshToken = async(req, res) => {

    const headerCookies = req.headers.cookie;
    const refreshToken = getRefreshTokenFromCookies(headerCookies);

    if (refreshToken == undefined) return res.send(errResponse(baseResponse.REFRESH_TOKEN_VERIFICATION_FAILURE));

    const accessToken = req.headers['x-access-token']

    const { userId } = jwt.decode(accessToken)

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET , (err, verifiedRefreshToken) => {


                if(err) reject(err);
                resolve(verifiedRefreshToken)
            })
        }
    );

    /** 토큰 검증 실패 시 오류 발생*/
    const onError = (error) => {

        return res.send(errResponse(baseResponse.REFRESH_TOKEN_EXPIRED));
        
    };
    /** 토큰 검증 성공 */
    p.then(async(verifiedRefreshToken) => {
        
        const status = await refreshVerify(refreshToken, userId);

        if (status == false) {
            return res.send(errResponse(baseResponse.REFRESH_TOKEN_VERIFICATION_FAILURE));
        }

        const access = jwt.sign({ userId : userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '1h', issuer : 'univeus' })

        return res.send(response(baseResponse.SUCCESS,{ accessToken : access }));
                                
    }).catch(onError);
}


/** 로그아웃 함수 */
export const logout = async (req, res) => {
    const userId = req.verifiedToken.userId;
    const headerCookies = req.headers.cookie;
    
    // 헤더에 쿠키가 존재하지 않을 경우
    if (typeof headerCookies == 'undefined') return res.send(errResponse(baseResponse.REFRESH_TOKEN_NOT_EXIST))

    const refreshToken = getRefreshTokenFromCookies(headerCookies);

    if (typeof refreshToken == 'undefined') return res.send(errResponse(baseResponse.REFRESH_TOKEN_NOT_EXIST))

    // 이미 로그아웃 된 토큰으로 로그아웃을 시도할 경우
    if (await isBlackListToken(refreshToken)) return res.send(errResponse(baseResponse.ALREADY_LOGOUT_REFRESH_TOKEN));

    // 저장된 리프레시 토큰 삭제
    await deleteRefreshToken(userId);

    // 로그아웃 후 블랙리스트에 리프레시 토큰 넣기
    await addBlackList(refreshToken, userId);

    return res.send(response(baseResponse.SUCCESS));
}