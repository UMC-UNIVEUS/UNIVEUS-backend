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
        VALUES (?,?,"PROPOSE_ALARM");
    `;
    }else if(type === 2){ // 참여 승인 알람(to 참여자)
        insertAlarmQuery = `
        INSERT INTO alarm(post_id, receiver_id, type)
        VALUES (?,?,"APPROVAL_ALARM");
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


export const updateParticipant = async(connection, insertParticipantParams)=>{// 게시글 참여자 승인 + 참여 승인 알람(to 참여자)
    const approveParticipantQuery = `
        UPDATE participant_users
        SET status = "approval"
        WHERE participant_id= ?;
    `;
    
    const addCurrentPeopleQuery = `
        UPDATE post 
        SET current_people = current_people + 1
        WHERE post_id = ?;
    `;

    const addParticipantAlarmQuery = `
        INSERT INTO alarm(post_id, user_id, alarm_type) 
        VALUES (?,(SELECT user_id FROM participant_users WHERE participant_id = ?),"approval_alarm");
    `;
    const approveParticipantRow = await connection.query(approveParticipantQuery, insertParticipantParams[1]);
    const addCurrentPeopleRow = await connection.query(addCurrentPeopleQuery, insertParticipantParams[0]);
    const addParticipantAlarmRow = await connection.query(addParticipantAlarmQuery, insertParticipantParams);
};

export const updateStatus = async(connection, post_id)=>{// 게시글 모집 마감으로 벼경
    const updateStatusQuery = `
        UPDATE post 
        SET post_status = 'end'
        WHERE post_id = ?;
    `;
    const updateStatusRow = await connection.query(updateStatusQuery, post_id);
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

    const acceptParticipationAlarmQuery = `
        INSERT INTO alarm(post_id, receiver_id, type) 
        VALUES (?, ?,"PARTICIPATION_COMPLETE_ALARM");
    `;

    const postUniveusRow = await connection.query(acceptParticipationQuery, insertParticipantParams);
    const addCurrentPeopleRow = await connection.query(addCurrentPeopleQuery, insertParticipantParams[0]);
    const applyParticipantAlarmRow = await connection.query(acceptParticipationAlarmQuery, insertParticipantParams);
};

export const addParticipant = async(connection, askParticipantParams)=>{// 유니버스 초대 (언젠간 쓰일 예정...)
    const postParticipantQuery = `
        INSERT INTO participant_users(post_id, user_id, status) 
        VALUES (?,?, "complete(invite)");
    `;

    const addCurrentPeopleQuery = `
        UPDATE post 
        SET current_people = current_people + 1
        WHERE post_id = ?;
    `;

    const inviteParticipantAlarmQuery = `
        INSERT INTO alarm(post_id, participant_id, user_id, alarm_type) 
        VALUES (?,?,?,"invite_alarm");
    `;

    const postParticipantRow = await connection.query(postParticipantQuery, askParticipantParams);
    const addCurrentPeopleRow = await connection.query(addCurrentPeopleQuery, askParticipantParams[0]);
    const inviteParticipantAlarmRow = await connection.query(inviteParticipantAlarmQuery, askParticipantParams);
};

export const blockUniveus = async(connection, closeUniveusParams)=>{ // 모집 마감
    const blockUniveusQuery = `
        UPDATE post 
        SET post_status = "end"
        WHERE post_id = ?;
    `;

    const closeUniveusAlarmQuery = `
        INSERT INTO alarm(post_id, user_id, alarm_type) 
        VALUES (?,?,"end_alarm");
    `;

    const blockUniveusRow = await connection.query(blockUniveusQuery, closeUniveusParams[0]);
    const closeUniveusAlarmRow = await connection.query(closeUniveusAlarmQuery, closeUniveusParams);
};

export const selectUniveUsNameById = async(connection, post_id)=>{ // post_id로 유니버스 제목 가져오기
    const selectUniveUsNameByIdQuery = `
        SELECT title
        FROM post
        WHERE post_id = ?;
    `;
    const [PostRow] = await connection.query(selectUniveUsNameByIdQuery, post_id);
    return PostRow[0].title;
};

export const switchPostStatus = async(connection, post_id)=>{ // 게시글 모집 상태 변경 (모집 마감 >> 모집 중으로 변경) (축제용)
    const switchPostStatusQuery = `
        UPDATE post 
        SET post_status = "recruiting"
        WHERE post_id = ?;
    `;
    const [switchPostStatusRow] = await connection.query(switchPostStatusQuery, post_id);
};

export const eraseParticipant = async(connection, removeParticipantParams)=>{ // 게시글 참여 취소 (언젠간 쓰일 예정...)
    const deleteParticipantQuery = `
        DELETE FROM participant_users
        WHERE post_id= ? AND user_id =?;
    `;

    const deleteCurrentPeopleQuery = `
        UPDATE post 
        SET current_people = current_people - 1
        WHERE post_id = ?;
    `;

    const deleteParticipantAlarmQuery = `
        INSERT INTO alarm(post_id, participant_id, user_id, alarm_type) 
        VALUES (?,?,?,"cancel_alarm");
    `;
    const [switchPostStatusRow] = await connection.query(deleteParticipantQuery, [removeParticipantParams[0],removeParticipantParams[1]]);
    const [deleteParticipantAlarmRow] = await connection.query(deleteParticipantAlarmQuery, removeParticipantParams);
    const [deleteCurrentPeopleRow] = await connection.query(deleteCurrentPeopleQuery, removeParticipantParams[0]);
};

export const updateCurrentPeople = async (connection, current_people, post_id) => {
    const updateCurrentPeopleQuery = `UPDATE post SET current_people = ${current_people} WHERE post_id = ${post_id};`;

    const [updateCurrentPeopleRow] = await connection.query(updateCurrentPeopleQuery);
}

export const selectWaiterNum = async(connection, post_id)=>{ //게시글에 참여 신청한 대기자 인원수 조회
    const selectWaiterNumQuery = `
        SELECT COUNT(*) num
        FROM participant_user
        WHERE status = 'WAITING';
    `;
    const [WaiterNumRow] = await connection.query(selectWaiterNumQuery, post_id);
    return WaiterNumRow;
};