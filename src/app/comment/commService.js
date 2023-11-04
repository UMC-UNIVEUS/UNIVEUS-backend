import pool from "../../../config/database"
import { baseResponse, response } from "../../../config/response";
import {insertComment, eraseComment} from "./commDao";


export const createComment = async(post_id, userIdFromJWT, contents, user_id) =>{

    const insertPostParams =[post_id, userIdFromJWT, contents, user_id]; 
    const connection = await pool.getConnection(async conn => conn);
    const createCommentResult = await insertComment(connection,insertPostParams);
    connection.release();
    
    return response(baseResponse.SUCCESS);
};

export const removeComment = async(comments_id)=>{
  
    const connection = await pool.getConnection(async conn => conn);
    const removeCommnentResult = await eraseComment(connection,comments_id); 
    connection.release();
    
    return response(baseResponse.SUCCESS);
};