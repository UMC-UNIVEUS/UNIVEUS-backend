/*posting 관련 데이터베이스, Query가 작성되어 있는 곳*/
export const selectPost = async(connection, post_id)=>{ // 게시글 조회
    const selectPostQuery = `
        SELECT *
        FROM post
        WHERE id = ?;
    `;
    const [PostRow] = await connection.query(selectPostQuery, post_id);
    return PostRow;
};

export const selectPostImages = async(connection, post_id)=>{ // 게시글 이미지 조회
    const selectPostImagesQuery = `
        SELECT *
        FROM post_img
        WHERE post_id = ?;
    `;
    const [PostImagesRow] = await connection.query(selectPostImagesQuery, post_id);
    return PostImagesRow;
};

export const selectParticipant = async(connection, post_id)=>{ // 참여자 목록 조회 (작성자 제외)
    const selectParticipantQuery = `
        SELECT participant_user.user_id, user.gender, user.nickname, user.student_id, user.major, participant_user.status
        FROM participant_user
        INNER JOIN user
        ON participant_user.user_id = user.id
        WHERE post_id = ?;
    `;
    const [ParticipantRow] = await connection.query(selectParticipantQuery, post_id);
    return ParticipantRow;
};


export const insertPost = async(connection, insertPostParams)=>{ // 게시글 생성
    const postPostQuery = `
        INSERT INTO post(
            user_id, category, limit_gender, limit_people, participation_method, 
            meeting_datetime, location, end_datetime, 
            title, contents, main_img, 
            current_people, created_at, post_status
        )
        VALUES (?,?,?,?,?, ?,?,?, ?,?,?, 1,now(),"RECRUITING");
    `;

    const participateWriterQuery = `
        INSERT INTO participant_user(post_id, user_id, status) 
        VALUES (?,?, 'WRITER');
    `;
    const insertPostRow = await connection.query(postPostQuery,insertPostParams); //insertPostRow[0].insertId는 생성된 post의 post_id
    const participateWriterRow = await connection.query(participateWriterQuery, [insertPostRow[0].insertId, insertPostParams[0]]);
    return insertPostRow[0];
};

export const insertPostImages = async(connection, insertPostImagesParams)=>{// 게시글 이미지 저장

    const postPostImagesQuery = `
        INSERT INTO post_img(image_url, post_id) 
        VALUES (?,?);
    `;
    for(var i =0; i<insertPostImagesParams[0].length ;i++){
        const insertPostImagesRow = await connection.query(postPostImagesQuery, [insertPostImagesParams[0][i],insertPostImagesParams[1]]);
    }
};

export const updatePostImages = async(connection, updatePostImagesParams)=>{// 게시글 이미지 수정
    const deletePostImageQuery = `
        DELETE FROM post_img
        WHERE post_id = ?;
    `;

    const postPostImagesQuery = `
        INSERT INTO post_img(image_url, post_id) 
        VALUES (?,?);
    `;

    const deletePostImageRow = await connection.query(deletePostImageQuery, [updatePostImagesParams[1]]);

    for(var i =0; i<updatePostImagesParams[0].length ;i++){
        const updatePostImagesRow = await connection.query(postPostImagesQuery, [updatePostImagesParams[0][i],updatePostImagesParams[1]]);
    }
};

export const updatePost = async(connection, updatePostParams)=>{// 게시글 수정
    const patchPostQuery = `
        UPDATE post 
        SET category =?,
        limit_gender =?,
        limit_people =?,
        participation_method = ?,
        meeting_datetime =?, 
        location =?, 
        end_datetime =?,
        title =?, 
        contents =?, 
        main_img = ?,
        updated_at = now()
        WHERE id =?;
    `;
    const updatePostRow = await connection.query(patchPostQuery, updatePostParams);
};

export const erasePost = async(connection, post_id)=>{// 게시글 삭제
    const deletePostQuery = `
        DELETE 
        FROM post
        WHERE id = ?;
    `;
    const deletePostRow = await connection.query(deletePostQuery, post_id);
};

export const insertLike = async(connection, post_id)=>{// 게시글 좋아요
    const addLikeQuery = `
        UPDATE post 
        SET likes = likes + 1
        WHERE id = ?;
    `;
    const insertLikeRow = await connection.query(addLikeQuery, post_id);
};

export const deleteLike = async(connection, post_id)=>{
    const deleteLikeQuery = `
        UPDATE post 
        SET likes = likes - 1
        WHERE id = ?;
    `;
    const deleteLikeRow = await connection.query(deleteLikeQuery, post_id);
}

export const insertAlarm = async (connection, sendAlarmParams, type)=>{

    let insertAlarmQuery; // type에 따라 쿼리문이 달라짐

    if(type === 1){ // 참여 신청 알람(to 작성자)
        insertAlarmQuery = `
        INSERT INTO alarm(post_id, receiver_id, type)
        VALUES (?,?,"PARTICIPATION_PROPOSE_ALARM");
    `;
    }else if(type === 2){ // 참여 승인 알람(to 참여자)
        insertAlarmQuery = `
        INSERT INTO alarm(post_id, receiver_id, type)
        VALUES (?,?,"PARTICIPATION_APPROVAL_ALARM");
    `;
    }else if(type ===3){ // 참여 취소 알람(to 작성자)
        insertAlarmQuery = `
        INSERT INTO alarm(post_id, receiver_id, type)
        VALUES (?,?,"PARTICIPATION_CANCEL_ALARM");
    `;
    }
    const insertAlarmRow = await connection.query(insertAlarmQuery, sendAlarmParams);
}

export const askParticipation = async(connection, insertParticipantParams)=>{// 게시글 참여 신청
    const askParticipationQuery = `
        INSERT INTO participant_user(post_id, user_id, status) 
        VALUES (?,?, "WAITING");
    `;
    const askParticipationRow = await connection.query(askParticipationQuery, insertParticipantParams);
};

export const acceptParticipation = async(connection, insertParticipantParams)=>{// 게시글 참여 신청 승인

    const acceptParticipationQuery = `
        UPDATE participant_user
        SET status = 'PARTICIPATING'
        WHERE post_id = ? AND user_id = ?;
    `;

    const addCurrentPeopleQuery = `
        UPDATE post 
        SET current_people = current_people + 1
        WHERE id = ?;
    `;

    const postUniveusRow = await connection.query(acceptParticipationQuery, insertParticipantParams);
    const addCurrentPeopleRow = await connection.query(addCurrentPeopleQuery, insertParticipantParams[0]);
};

export const deleteParticipation = async(connection, removeParticipationParams)=>{ // 게시글 참여 신청 취소
    const deleteParticipationQuery = `
        DELETE FROM participant_user
        WHERE post_id= ? AND user_id =?;
    `;

    const [switchPostStatusRow] = await connection.query(deleteParticipationQuery, removeParticipationParams);
};

export const finishPostStatus = async(connection, post_id)=>{ // 모집 마감
    const finishPostQuery = `
        UPDATE post 
        SET post_status = "END"
        WHERE id = ?;
    `;

    const finishPostRow = await connection.query(finishPostQuery, post_id);
};


export const selectWaiterNum = async(connection, post_id)=>{ //게시글에 참여 신청한 대기자 인원수 조회
    const selectWaiterNumQuery = `
        SELECT COUNT(*) num
        FROM participant_user
        WHERE status = 'WAITING';
    `;
    const [WaiterNumRow] = await connection.query(selectWaiterNumQuery, post_id);
    return WaiterNumRow[0].num;
};

export const selectParticiaptionStatus = async(connection, ParticiaptionStatusParams) =>{
    const selectParticiaptionStatusQuery = `
        SELECT status
        FROM participant_user
        WHERE post_id = ? AND user_id = ?;
    `;
    const [ParticiaptionStatusRow] = await connection.query(selectParticiaptionStatusQuery, ParticiaptionStatusParams);
    return ParticiaptionStatusRow[0].status;
}