import pool from "../../../config/database"
import { selectPost, selectParticipant, selectPostImages, selectParticipantList } from "./postDao";
import dayjs from 'dayjs';

export const retrievePost = async(post_id) =>{
    
    const connection = await pool.getConnection(async conn => conn);
    const postResult = await selectPost(connection,post_id);
    connection.release();

    return postResult[0];
};

export const retrievePostImages = async(post_id) =>{
    
    const connection = await pool.getConnection(async conn => conn);
    const selectPostImagesResult = await selectPostImages(connection,post_id);
    connection.release();

    return selectPostImagesResult;
};

export const retrieveParticipant = async(post_id)=>{
  
    const connection = await pool.getConnection(async conn => conn);
    const participantResult = await selectParticipant(connection,post_id);
    connection.release();

    return participantResult;
};

export const retrieveParticipantList = async(post_id)=>{ //게시글 참여자 신청 내역 조회 
  
    const connection = await pool.getConnection(async conn => conn);
    const participantResult = await selectParticipantList(connection,post_id);
    connection.release();

    return participantResult;
};

/** meeting_date 포맷팅 */
export const formatingMeetingDate = (post) => {

    const date = dayjs(post.meeting_date);
    const meeting_year = date.year();
    const meeting_month = date.month() < 9 ?  "0" + (date.month() + 1) : ""+(date.month() + 1);
    const meeting_date = date.date() < 10 ?  "0" + date.date() : ""+date.date();
    const meeting_time = (date.hour() < 10 ?  "0" + date.hour() : ""+date.hour()) + ":" + (date.minute() < 10 ? "0" + date.minute() : ""+date.minute());
    delete post.meeting_date;

    const datetime = {
        "meeting_year": meeting_year,
        "meeting_month":meeting_month,
        "meeting_date":meeting_date,
        "meeting_time":meeting_time,
    }
   
    Object.assign(post, datetime);
}

/** end_date 포맷팅 */
export const formatingEndDate = (post) => {
    const date = dayjs(post.end_date);
    const end_year = date.year();
    const end_month = date.month() < 10 ? "0" + (date.month() + 1)  : ""+(date.month() + 1);
    const end_date = date.date() < 10 ? "0" + date.date() : ""+date.date();
    const end_time = (date.hour() < 10 ? "0" + date.hour() : ""+date.hour()) + ":" + (date.minute() < 10 ? "0" + date.minute() : ""+date.minute());
    delete post.end_date;

    const datetime = {
        "end_year":end_year,
        "end_month":end_month,
        "end_date":end_date,
        "end_time":end_time,
    }
   
    Object.assign(post, datetime);
}

/** kakao 유효성 검사 */
export const isValidOpenChat = (openChaturi) => {
    
    if (openChaturi.startsWith("https://open.kakao.com/")) return true;

    return false;
}