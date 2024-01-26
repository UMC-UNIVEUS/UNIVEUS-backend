import { updateUserAffiliation, updateAlarms, insertUserEmail,
    updateUserPhoneNumber, insertAgreementTerms, updateAccountStatus,
    updateUserReportedNum,updateNicknameAndGender } from "./userDao"
import pool from "../../../config/database"

/** 유저 생성 - 프로필 등록, 번호인증 전 user */
export const createUser = async(userEmail) => {
    const connection = await pool.getConnection(async conn => conn);
    const createUserResult = await insertUserEmail(connection, userEmail);
    connection.release();
    return createUserResult;
}

/** 경기대 이메일인지 확인 */
export const isKyonggiEmail = (email) => {
    const pattern = /^[a-zA-Z0-9_.+-]+@kyonggi\.ac\.kr$/i;
    return pattern.test(email);
}

/** 랜덤 인증번호 생성 */
export const createAuthNum = () => {
    return Math.floor(Math.random() * 900000) + 100000;
}

/** 소속등록 */
export const addUserAffiliation = async(userInfo) => {
    const connection = await pool.getConnection(async conn => conn);
    const affiliationUserResult = await updateUserAffiliation(connection, userInfo);
    connection.release();
};

export const checkAlarms = async(alarm_id) =>{// 알림 확인 

    const connection = await pool.getConnection(async conn => conn);
    const checkAlarmsResult = await updateAlarms(connection,alarm_id);
    connection.release();
};

/** 유저생성 - 번호 인증 후 번호 등록 */
export const addUserPhoneNumber = async(userPhoneNumber, userId) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        const authUserResult = await updateUserPhoneNumber(connection, userPhoneNumber, userId);
        connection.release();
        return authUserResult;
    } catch(err) {
        console.log(err);
    }
};

/** 약관동의 - 다음 클릭 시 수행 */
export const addAgreementTerms = async(userId, agreementParams) => {
    const connection = await pool.getConnection(async conn => conn);

    for (let i = 0; i < agreementParams.length; i++) {
        if (agreementParams[i] == 'checked') {
            insertAgreementTerms(connection, userId, i + 1);
        }
    }

    connection.release();
};

/** user의 계정 상태 변경 */
export const changeUserStatus = async(userId, userStatus) => {
    const connection = await pool.getConnection(async conn => conn);
    const changeUserStatusResult = await updateAccountStatus(connection, userId, userStatus);

    connection.release();
}

/** user의 reported_num 증가 */
export const increaseUserReportedNum = async(userId) => {
    const connection = await pool.getConnection(async conn => conn);
    const increaseUserReportedNumResult = await updateUserReportedNum(connection , userId);
}

/** 유저 프로필 추가 */
export const addUserProfile = async(userId, userProfile) => {
    const connection = await pool.getConnection(async conn => conn);
    const updateUserProfileResult = await updateNicknameAndGender(connection, userId, userProfile);
    connection.release();
}