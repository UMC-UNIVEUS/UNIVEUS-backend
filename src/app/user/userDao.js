/** user에 Email insert 후 id 반환 */
export const insertUserEmail = async(connection, userEmail) => {
    const insertUserQuery = `INSERT INTO user (email) VALUES ('${userEmail}');`;
    const insertUserRow = await connection.query(insertUserQuery);
    return insertUserRow.insertId
}

export const selectUser = async(connection, email_id) => {

    const selectUserQuery = `SELECT email_id FROM user WHERE email_id = '${email_id}'`;
    const selectUserRow = await connection.query(selectUserQuery);
    return selectUserRow[0];
}

export const selectUserByNickname = async(connection, nickname) => {

    const selectUserQuery = `SELECT nickname FROM user WHERE nickname = '${nickname}'`;
    const selectUserRow = await connection.query(selectUserQuery);
    return selectUserRow[0];
}

/** 본인인증 후 userInfo update */
export const updateUserProfileInfo = async(connection, updateUserParams) => {
    const userInfo = updateUserParams;

    console.log(updateUserParams)

    const updateUserQuery = 
    `
        UPDATE user
        SET 
        nickname = ?,
        gender = ?,
        major = ?,
        class_of = ?,
        auth_status = 1,
        participate_available = 1

        WHERE email_id = ?;
    `;

    const values = [  
      userInfo.nickname,  
      userInfo.gender,      
      userInfo.major,       
      userInfo.studentId,    
      userInfo.userEmail
    ];
  
    const updateUserRow = await connection.query(updateUserQuery, values);
    return updateUserRow;
  };

export const selectUserIdByEmail = async(connection,email_id) => {// 이메일로 유저 id 조회
    const selectUserIdQuery = `
        SELECT id
        FROM user
        WHERE email = ?;
    `;
    const selectUserIdRow = await connection.query(selectUserIdQuery,email_id);
    return selectUserIdRow[0];
};

export const selectUserNickNameById = async(connection, userId) => {// user_id로 유저 닉네임 조회
    const selectUserNickNameByIdQuery = `
        SELECT nickname
        FROM user
        WHERE id = ?;
    `;
    const [UserNickNameByIdRow] = await connection.query(selectUserNickNameByIdQuery,user_id);
    return UserNickNameByIdRow[0];
};

export const selectUserById = async(connection,user_id) => {// id로 유저 전체 조회
    const selectUserByIdQuery = `
        SELECT *
        FROM user
        WHERE user_id = ?;
    `;
    const [UserByIdRow] = await connection.query(selectUserByIdQuery,user_id);
    return UserByIdRow[0];
};

export const selectIsParticipateOtherById = async(connection,user_id) => {// id로 다른 게시글에 참여했는지 
    const selectIsParticipateOtherByIdQuery = `
        SELECT *
        FROM participant_users
        WHERE user_id = ?;
    `;
    const [IsParticipateOtherByIdRow] = await connection.query(selectIsParticipateOtherByIdQuery,user_id);
    return IsParticipateOtherByIdRow[0];
};

export const selectUserByNickName = async(connection,nickname) => {// 닉네임으로 유저 전체 조회
    const selectUserByNickNameQuery = `
        SELECT *
        FROM user
        WHERE nickname = ?;
    `;
    const [UserByNickNameRow] = await connection.query(selectUserByNickNameQuery,nickname);
    return UserByNickNameRow[0];
};

export const selectAlarms = async(connection, userIdFromJWT) => {// 알림 내역 조회
    const selectAlarmsQuery = `
        SELECT *
        FROM alarm
        WHERE user_id = ?;
    `;
    const selectAlarmsRow = await connection.query(selectAlarmsQuery,userIdFromJWT);
    return selectAlarmsRow;
};

export const updateAlarms = async(connection, alarm_id) => {// 알림 확인 
    const updateAlarmsQuery = `
        UPDATE alarm
        SET ischecked = 1
        WHERE alarm_id= ?;
    `;
    const updateAlarmsRow = await connection.query(updateAlarmsQuery,alarm_id);
    return updateAlarmsRow;
};

/** user의 phone 번호 update */
export const updateUserPhoneNumber = async(connection, userPhoneNumber, userId) => {
    const updateUserQuery = `UPDATE user SET phone = '${userPhoneNumber}' WHERE id = ${userId};`;
    const updateUserRow = await connection.query(updateUserQuery);
    return updateUserRow;
}

/** user의 phone 번호 조회 */
export const selectPhoneById = async(connection, userId) => {
    const selectPhoneByEmailQuery = `SELECT phone FROM user WHERE id = '${ userId }';`;
    const selectPhoneByEmailRow = await connection.query(selectPhoneByEmailQuery);
    return selectPhoneByEmailRow;
}

/**user의 본인인증 정보를 검색 */
export const selectAuthInfoByUserId = async(connection, userId) => {
    const selectAuthInfoByEmailQuery = `SELECT major, student_id FROM user WHERE id = '${userId}';`;
    const selectAuthInfoByEmailRow = await connection.query(selectAuthInfoByEmailQuery);
    return selectAuthInfoByEmailRow;
}

/** 임의 user를 insert */
export const insertUser = async (connection, userInfoParams) => {
    const insertUserQuery = `
        INSERT INTO user(nickname, email_id, gender, major, class_of, auth_status, phone) VALUES (?, ?, ?, ?, ?, 1, ?);`;
    const insertUserRow = await connection.query(insertUserQuery, userInfoParams);
};

/** 약관 동의 insert */
export const insertAgreementTerms = async(connection, userId, agreementParam) => {
    const insertAgreementTermsQuery = `INSERT INTO user_agree(user_id, terms_id, created_at) VALUES(${userId}, ${agreementParam}, now());`;
    const insertAgreementTermsRow = await connection.query(insertAgreementTermsQuery);
}

/** 유저의 계정 상태 변경 */
export const updateAccountStatus = async(connection, userId, userStatus) => {
    const updateAccountStatusQuery = `UPDATE user SET account_status = ${userStatus} WHERE user_id = ${userId};`;
    const updateAccountStatusRow = await connection.query(updateAccountStatusQuery);
}

/** 유저의 reported_num을 증가 */
export const updateUserReportedNum = async(connection, userId) => {
    const updateUserReportedNumQuery = `UPDATE user SET reported_num = reported_num + 1 WHERE user_id = ${userId};`;
    const updateUserReportedNumRow = await connection.query(updateUserReportedNumQuery);
}

/** 유저의 reported_num 조회 */
export const selectUserReportedNum = async(connection, userId) => {
    const selectUserReportedNumQuery = `SELECT reported_num FROM user WHERE user_id = ${userId};`;
    const selectUserReportedNumRow = await connection.query(selectUserReportedNumQuery);
    return selectUserReportedNumRow;
}

/** 유저의 account_status 조회 */
export const selectUserAccountStatus = async(connection, userEmail) => {
    const selectUserAccountStatusQuery = `SELECT account_status FROM user WHERE email_id = '${userEmail}';`;
    const selectUserAccountStatusRow = await connection.query(selectUserAccountStatusQuery);
    return selectUserAccountStatusRow;
}

export const updateParticipateAvailable = async(connection, userId) => {
    const updateParticipateAvailableQuery = `UPDATE user SET participate_available = 0 WHERE user_id = ${userId};`;
    const updateParticipateAvailableRow = await connection.query(updateParticipateAvailableQuery);
}

/** 참여가능 횟수 조회 */
export const selectParticipateAvailalble = async(connection, userId) => {
    const selectParticipateAvailalbleQuery = `SELECT participate_available FROM user WHERE user_id = ${userId};`;
    const [selectParticipateAvailalbleRow] = await connection.query(selectParticipateAvailalbleQuery);
    return selectParticipateAvailalbleRow[0].participate_available;
}

export const updateParticipateAvailableReturn = async(connection, userId) => {
    const updateParticipateAvailableQuery = `UPDATE user SET participate_available = 1 WHERE user_id = ${userId};`;
    const updateParticipateAvailableRow = await connection.query(updateParticipateAvailableQuery);
}

/**user 약관 동의 조회 */
export const selectUserAgreeById = async(connection, userId) => {
    const selectUserAgreeQuery = `SELECT * FROM user_agree WHERE user_id = ${userId}`;
    const [selectUserAgreeRow] = await connection.query(selectUserAgreeQuery);
    return selectUserAgreeRow.length;
}