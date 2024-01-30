/*Profile 관련 데이터베이스, Query가 작성되어 있는 곳*/

import {connect} from "pm2";


// 여기서부터 새롭게 작성하는 부분

export const createIntroduction = async(connection, params) => {
    const createIntroductionQuery = `
    INSERT into user_introduction(user_id, Q1, Q2, Q3, Q4, Q5, Q6)
    VALUES (?, ?, ?, ?, ?, ?, ?) ;`;

    const [row] = await connection.query(createIntroductionQuery, params);
    return row;
}

export const updateIntroduction = async(connection, params) => {
    const temp = params;

    const updateIntroductionQuery = `
    UPDATE user_introduction
    SET q1 = ? , q2 = ?, q3 = ?, q4 = ?, q5 = ?, q6 = ?
    WHERE user_id = ?;`;

    const [row] = await connection.query(updateIntroductionQuery, params);
    return row;
}

export const deleteIntroduction = async(connection, userId) => {
    const deleteIntroductionQuery = `
    DELETE FROM user_introduction
    WHERE user_id = ?;`;

    const [row] = await connection.query(deleteIntroductionQuery, userId);
    return row;
}

export const selectUserIntroduction = async(connection, userId) => {
    const selectUserIntroductionQuery = `  
    SELECT *
    FROM user_introduction
    WHERE user_id = ?;`;

    const [row] = await connection.query(selectUserIntroductionQuery, userId);
    return row;
}

export const selectUserInfo = async(connection, userId) => {
    const selectUserInfoQuery = `
    SELECT *
    FROM user
    WHERE id = ?;`;

    const [row] = await connection.query(selectUserInfoQuery, userId);
    return row;
}

export const selectUserParticipantInfo = async(connection, userId) => {
    const selectUserParticipantInfoQuery = `
    SELECT COUNT(*) AS value
    FROM participant_user
    WHERE status = "PARTICIPATE_COMPLETE" and user_id = ?;`;

    const [row] = await connection.query(selectUserParticipantInfoQuery, userId);
    return row[0].value;
}

export const selectUserMakingInfo = async(connection, userId) => {
    const selectUserMakingInfoQuery = `
    SELECT COUNT(*) AS value
    FROM participant_user
    WHERE status = "WRITER" and user_id = ?;`;

    const [row] = await connection.query(selectUserMakingInfoQuery, userId);
    return row[0].value;
}

export const selectUserCreateInfo = async(connection, userId) => {
    const selectUserCreateInfoQuery = `
    SELECT id, title, limit_gender, meeting_datetime, location, 
           current_people, limit_people, main_img, post_status
    FROM post
    WHERE user_id = ?
    ORDER BY created_at DESC limit 10
    ;`;

    const [row] = await connection.query(selectUserCreateInfoQuery, userId);
    return row;
}
