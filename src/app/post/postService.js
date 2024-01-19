/*데이터베이스와 상호작용하여 사용자 관련 기능을 수행
(CRUD에 해당하는 서버 로직 처리) */

import pool from "../../../config/database";
import {
    insertPost, insertPostImages, updatePost, updatePostImages, erasePost, insertLike,
    askParticipation, updateParticipant, addParticipant, blockUniveus, switchPostStatus,
    eraseParticipant, updateStatus, updateCurrentPeople, deleteLike, insertAlarm, acceptParticipation
} from "./postDao";

export const createPost = async(userIdFromJWT, body) =>{ // 게시글 생성
 
    const insertPostParams =[
        userIdFromJWT, body.category, body.limit_gender, body.limit_people, body.participation_method,
        body.meeting_datetime, body.location, body.end_datetime,
        body.title, body.contents, body.images[0]
    ];

    const connection = await pool.getConnection(async conn => conn);
    const createPostResult = await insertPost(connection,insertPostParams);
    connection.release();
    return createPostResult;
};

export const createPostImage = async(images, post_id) =>{ //게시글 이미지 저장

    const insertPostImagesParams =[
        images, post_id
    ];

    const connection = await pool.getConnection(async conn => conn);
    const createpostImagesResult = await insertPostImages(connection,insertPostImagesParams);
    connection.release();
    return createpostImagesResult;
};

export const patchPostImage = async(images, post_id) =>{ //게시글 이미지 수정

    const updatePostImagesParams =[images, post_id]; 

    const connection = await pool.getConnection(async conn => conn);
    const editPostImagesResult = await updatePostImages(connection,updatePostImagesParams);
    connection.release();
    return editPostImagesResult;
};

export const editPost = async(body)=>{ // 게시글 수정
  
    const updatePostParams =[
        body.category, body.limit_gender, body.limit_people, body.participation_method,
        body.meeting_datetime, body.location, body.end_datetime,
        body.title, body.contents, body.images[0], body.post_id
    ];

    const connection = await pool.getConnection(async conn => conn);
    const updatePostResult = await updatePost(connection,updatePostParams); 
    connection.release();
};


export const removePost = async(post_id)=>{// 게시글 삭제
        
    const connection = await pool.getConnection(async conn => conn);
    const removePostResult = await erasePost(connection,post_id); 
    connection.release();
};

export const addLike = async(post_id)=>{// 게시글 좋아요

    const connection = await pool.getConnection(async conn => conn);
    const insertLikeResult = await insertLike(connection,post_id); 
    connection.release();
};

export const cancelLike = async(post_id) =>{ // 게시글 좋아요 취소

    const connection = await pool.getConnection(async conn => conn);
    const deleteLikeResult = await deleteLike(connection,post_id);
    connection.release();
}

export const sendAlarm = async(post_id,user_id, type)=>{ // 알림 보내기, type(int)은 알람 type을 정해준다.(ex: 참여 신청, 참여 완료)

    const sendAlarmParams =[post_id, user_id];

    const connection = await pool.getConnection(async conn => conn);
    const insertAlarmResult = await insertAlarm(connection,sendAlarmParams,type);
    connection.release();
}


export const proposeParticipation = async(post_id, userIdFromJWT) =>{// 게시글 참여 신청

    const proposeParticipationParams =[post_id, userIdFromJWT];

    const connection = await pool.getConnection(async conn => conn);
    const proposeParticipationResult = await askParticipation(connection,proposeParticipationParams);
    connection.release();
};

export const registerParticipant = async(post_id, participant_id) =>{// 게시글 참여자 등록 + 참여 승인 알람(to 참여자)

    const updateParticipantParams =[post_id, participant_id]; 

    const connection = await pool.getConnection(async conn => conn);
    const registerParticipantResult = await updateParticipant(connection,updateParticipantParams);
    connection.release();
};

export const changeStatus = async(post_id)=>{// 게시글 모집 마감으로 변경

    const connection = await pool.getConnection(async conn => conn);
    const updateStatusResult = await updateStatus(connection,post_id); 
    connection.release();
};

export const approveParticipation = async(postId, userId) =>{// 게시글 참여 신청 승인

    const approveParticipationParams =[postId, userId];

    const connection = await pool.getConnection(async conn => conn);
    const approveParticipationResult = await acceptParticipation(connection,approveParticipationParams);
    connection.release();
};

export const inviteOneParticipant = async(post_id, participant_userID, user_id) =>{// 유니버스 초대 (축제용)

    const askParticipantParams =[post_id,participant_userID, user_id]; 

    const connection = await pool.getConnection(async conn => conn);
    const askParticipantResult = await addParticipant(connection,askParticipantParams);
    connection.release();
}; 

export const closeUniveus = async(post_id,user_id) =>{// 게시글 모집 마감 (축제용)

    const closeUniveusParams =[post_id, user_id]; 

    const connection = await pool.getConnection(async conn => conn);
    const closeUniveusResult = await blockUniveus(connection,closeUniveusParams);
    connection.release();
}; 

export const changePostStatus = async(post_id) =>{// 게시글 모집 상태 변경 (모집 마감 >> 모집 중) (축제용) 

    const connection = await pool.getConnection(async conn => conn);
    const changePostStatusResult = await switchPostStatus(connection,post_id);
    connection.release();
}; 

export const removeParticipant = async(post_id, userIdFromJWT, user_id) =>{// 게시글 참여 취소 (축제용)

    const removeParticipantParams =[post_id, userIdFromJWT, user_id];

    const connection = await pool.getConnection(async conn => conn);
    const eraseParticipantResult = await eraseParticipant(connection,removeParticipantParams);
    connection.release();
}; 

export const changeCurrentPeople = async(current_people, post_id) => {

    const connection = await pool.getConnection(async conn => conn);
    const updateCurrentPeopleResult = await updateCurrentPeople(connection, current_people, post_id);
    connection.release();
}