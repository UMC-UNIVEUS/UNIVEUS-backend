
export const selectComment = async(connection, post_id) => {
    const selectCommentQuery = `
        SELECT user.user_id, user.gender, user.nickname, user.major, user.class_of,
        comments.contents, comments.created_at
        FROM comments
        INNER JOIN user
        ON comments.user_id = user.user_id
        WHERE post_id = ?;
    `;
   
    const [CommentRow] = await connection.query(selectCommentQuery, post_id);
    return CommentRow;
};
export const selectOneComment = async(connection, comments_id) => {
    const selectOneCommentQuery = `
        SELECT user.gender, user.nickname, user.major, user.class_of,
        comments.contents, comments.created_at
        FROM comments
        INNER JOIN user
        ON comments.user_id = user.user_id
        WHERE comments_id = ?;
    `;
   
    const [oneCommentRow] = await connection.query(selectOneCommentQuery, comments_id);
    return oneCommentRow;
};


export const insertComment = async(connection, insertPostParams) => { // 댓글 작성 + 댓글 알람
    const postCommentQuery = `
        INSERT INTO comments(post_id, user_id, contents, created_at) 
        VALUES (?,?,?,now());
    `;

    const addCommentAlarmQuery = `
        INSERT INTO alarm(post_id, user_id, participant_id, alarm_type)
        VALUES (?, ? ,?,"CommentAlarm");
    `;

    const addcommentAlarmParms = [insertPostParams[0],insertPostParams[3],insertPostParams[1]]
    const insertCommentRow = await connection.query(postCommentQuery, insertPostParams);
    const addCommentAlarmRow = await connection.query(addCommentAlarmQuery, addcommentAlarmParms);
    return insertCommentRow;
};

export const eraseComment = async(connection, comments_id)=>{
    const deleteCommentQuery = `
        DELETE 
        FROM comments
        WHERE comments_id = ?;
    `;
    const deleteCommentRow = await connection.query(deleteCommentQuery, comments_id);
    return deleteCommentRow;
};

