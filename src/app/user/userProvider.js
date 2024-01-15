import { selectUser, selectUserByNickname, selectUserIdByEmail, selectAlarms, 
    selectUserById, selectIsParticipateOtherById,selectUserNickNameById, selectPhoneById, 
    selectAuthInfoByUserId,selectUserByNickName, selectUserReportedNum, selectUserAccountStatus,
    selectParticipateAvailalble, selectUserAgreeById } from "./userDao"

import pool from "../../../config/database"

/** 회원인지 확인 */
export const isUser = async(userEmail) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const isUser = await selectUserIdByEmail(connection, userEmail);
    connection.release();
    return isUser.length;
}

export const isNicknameDuplicate = async(nickname) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const user = await selectUserByNickname(connection, nickname);
    connection.release();
    return user.length;
}

export const getUserNickNameById = async(user_id) => {// id로 유저 닉네임 조회

    const connection = await pool.getConnection(async (conn) => conn);
    const UserNickName = await selectUserNickNameById(connection, user_id);
    connection.release();
    return UserNickName.nickname;
};

export const getUserById = async(user_id) => {// id로 유저 전체 조회

    const connection = await pool.getConnection(async (conn) => conn);
    const User = await selectUserById(connection, user_id);
    connection.release();
    return User;
};

export const getIsParticipateOtherById = async(user_id) => {// id로 게시글 참여했는지 확인

    const connection = await pool.getConnection(async (conn) => conn);
    const isParticipateOther = await selectIsParticipateOtherById(connection, user_id);
    connection.release();
    return isParticipateOther;
};

export const getUserByNickName = async(nickname) => {// 닉네임으로 유저 전체 조회

    const connection = await pool.getConnection(async (conn) => conn);
    const User = await selectUserByNickName(connection, nickname);
    connection.release();
    return User;
};

export const getUserIdByEmail = async(email_id) => {// 이메일로 유저 id 조회

    const connection = await pool.getConnection(async (conn) => conn);
    const [UserId] = await selectUserIdByEmail(connection, email_id);
    connection.release();
    return UserId.user_id;
};

export const retrieveAlarms = async(userIdFromJWT) => {// 알림 내역 조회

    const connection = await pool.getConnection(async (conn) => conn);
    const [alarmsResult] = await selectAlarms(connection, userIdFromJWT);
    connection.release();
    return alarmsResult;
};

/** 번호인증을 마친 user인지 */
export const isAuthNumber = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const authNumberResult = await selectPhoneById(connection, userId);
    connection.release();

    if (authNumberResult[0][0].phone == null) return false;
    return true;
}

/** 소속인증을 마친 user인지 */
export const isAuthUser = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const isAuthUserResult = await selectAuthInfoByUserId(connection, userId);
    connection.release();

    if(isAuthUserResult[0].length == 0) return false;

    return true;
}

/** 유저의 신고 당한 횟수 조회 */
export const getUserReportedNum = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const [getUserReportedNumResult] = await selectUserReportedNum(connection, userId);
    connection.release();
    return getUserReportedNumResult[0].reported_num;
}

/** 유저의 account_status 가져오기 */
export const getUserAccountStatus = async(userEmail) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const [getUserAccountStatusResult] = await selectUserAccountStatus(connection, userEmail);
    connection.release();
    return getUserAccountStatusResult[0].account_status;
}

/** 유저의 phoneNumber 가져오기 */
export const getUserPhoneNumber = async(userEmail) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const [getUserPhoneNumberResult] = await selectPhoneByEmail(connection, userEmail);
    connection.release();
    return getUserPhoneNumberResult[0].phone;
}

/** 유저의 닉네임 이모지 및 공백 삭제 */
export const removeEmojisAndSpace = (nickname) => {
    // 정규식 패턴으로 이모지를 제거
    const regex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FAFF}\u{1FAD0}-\u{1FAFF}\u{2000}-\u{3300}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F251}\u{203C}\u{2049}\u{20E3}\u{2122}\u{2139}\u{2194}-\u{21AA}\u{2328}\u{23E9}-\u{23EC}\u{25AA}\u{25FE}\u{2611}\u{2660}-\u{2668}\u{267B}\u{267F}\u{2693}\u{26A1}\u{26AA}\u{26AB}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}\u{2709}\u{270A}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{1F004}-\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F251}\u{203C}\u{2049}\u{20E3}\u{2122}\u{2139}\u{2194}-\u{21AA}\u{2328}\u{23E9}-\u{23EC}\u{25AA}\u{25FE}\u{2611}\u{2660}-\u{2668}\u{267B}\u{267F}\u{2693}\u{26A1}\u{26AA}\u{26AB}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}\u{2709}\u{270A}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{0020}]/gu;
    return nickname.replace(regex, "");
}

/** 다른 글 참가여부 확인 */
export const getParticipateAvailable = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const isParticipateAvailable = await selectParticipateAvailalble(connection, userId);
    connection.release();

    return isParticipateAvailable;
}

/** 유저의 프로필 확인 */
export const isProfileExist = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const userProfile = await selectUserNickNameById(connection, userId);
    connection.release();
    return userProfile
}

/** 약관동의 유저 확인 */
export const isUserAgree = async (userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAgree = await selectUserAgreeById(connection, userId);
    connection.release();
    return userAgree
}