/*Profile 관련 데이터베이스, Query가 작성되어 있는 곳*/

export const selectUserbyId = async (connetion, user_id) => {
    const selectUserbyIdQuery = `
  SELECT * FROM user WHERE user_id = ?;`;

    const userRows = await connetion.query(selectUserbyIdQuery, user_id);
    return userRows;
};


export const selectUserDefaultProfilebyId = async (connection, user_id) => {
    const selectUserDefaultProfilebyIdquery = `
        SELECT nickname, profile_img, major, class_of, 
               participant_num, reported_num FROM user WHERE user_id = ?;`;

    const DefaultprofileRows = await connection.query(selectUserDefaultProfilebyIdquery, user_id);
    return DefaultprofileRows;

};

export const selectUserIntroProfilebyId = async (connection, user_id) => {
    const selectUserIntroProfilebyIdquery = `
    SELECT nickname, gender, profile_img, interest, introduce FROM user WHERE user_id = ?;`;

    const IntroprofileRows = await connection.query(selectUserIntroProfilebyIdquery, user_id);
    return IntroprofileRows;

};

export const modifyProfilebyId = async (connection, params) => {
    const modifyProfileQuery = `
UPDATE user
SET nickname = ?, gender = ?, profile_img = ?, interest = ?, introduce = ?
WHERE user_id = ? ;`;

    const modifyProfileRows = await connection.query(modifyProfileQuery, params);
    return modifyProfileRows;
};

export const selectUserMyUnivebyId = async (connection, user_id)=> {
    const selectUserMyUniveQuery = `
    SELECT post_id, user.profile_img, user.nickname, user.gender, user.class_of,
       main_img, title, limit_gender, location,
       current_people, limit_people, meeting_date
    FROM post
    INNER JOIN user
    ON post.user_id = user.user_id
    WHERE post.user_id = ?
    ORDER BY post.created_at DESC
    ;`;
    const selectUserMyUniveRows = await connection.query(selectUserMyUniveQuery, user_id);
    return selectUserMyUniveRows;
};

export const selectUserParticipatebyId = async (connection, user_id) => {
    const selectUserParticipatebyIdQuery = `
    SELECT post_id, user.profile_img, user.nickname, user.gender, user.class_of,
           main_img, title, limit_gender, location,
           current_people, limit_people, meeting_date
    FROM post
    INNER JOIN user
    ON post.user_id = user.user_id
    WHERE post_id IN (SELECT post_id FROM participant_users WHERE user_id = ?)
    ORDER BY post.created_at DESC
    ;`;

    const selectUserParticipatebyIdRows = await connection.query(selectUserParticipatebyIdQuery, user_id);
    return selectUserParticipatebyIdRows;
};

export const selectPostbyId = async (connection, post_id) => {
    const selectPostbyIdQuery = `
    SELECT *
    FROM post
    WHERE post_id = ? ;`;

    const selectPostbyIdRows = await connection.query(selectPostbyIdQuery, post_id);
    return selectPostbyIdRows;
};

export const selectUserProfilebyId = async (connection, user_id) => {
    const selectUserProfilebyIdQuery = `
    SELECT profile_img, nickname, class_of, gender
    FROM user
    WHERE user_id = ? ;`;

    const [row] = await connection.query(selectUserProfilebyIdQuery, user_id);
    return row;
}