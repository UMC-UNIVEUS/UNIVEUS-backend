import dotenv from "dotenv";
dotenv.config();
import {baseResponse, response, errResponse} from "../../../config/response";
import {retrievePost} from "../post/postProvider";
import {retrieveComment, retrieveOneComment} from "./commProvider";
import {createComment, removeComment} from "./commService";
import {getUserIdByEmail} from "../user/userProvider";

/**
 * API name : 댓글 조회 (게시글의 모든 댓글 조회)
 * GET: /comments/{post_id}
 */
export const getComment = async(req, res) => {
	
    const {post_id} = req.params;
    const Post = await retrievePost(post_id); 
    
    if(Post){ // Post가 존재한다면
        const Comment = await retrieveComment(post_id); 
        
        if(Comment[0]){ // post에 Comment가 한 개라도 존재한다면
            return res.status(200).json(response(baseResponse.SUCCESS, Comment));
        }
        else{
            return res.status(404).json(errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST))
        }
    } 
    else{ 
        return res.status(404).json(errResponse(baseResponse.POST_POSTID_NOT_EXIST))
    }
};

/**
 * API name : 댓글 개별 조회 
 * GET: /comments/one_comment/{comments_id}
 */
 export const getOneComment = async(req, res) => {
	
    const {comments_id} = req.params;
    const Comment = await retrieveOneComment(comments_id); 
    
    if(Comment[0]){ // Comment가 존재한다면
        return res.status(200).json(response(baseResponse.SUCCESS, Comment));
    }
    else{
        return res.status(404).json(errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST))
    }
};

/**
 * API name : 댓글 작성
 * POST: /comments/{post_id}
 */
export const postComment = async(req, res) => {

    const {post_id} = req.params; 
    const {contents, user_id} = req.body; //게시글 작성자 id
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); //댓글 작성자의 id 
  
    if(contents == null || contents.length == 0){
        return res.status(400).json(errResponse(baseResponse.COMMENT_COMMENT_EMPTY));
    }
    if(contents.length > 50){
        return res.status(400).json(errResponse(baseResponse.COMMENT_COMMENT_LENGTH));
    }

    const Post = await retrievePost(post_id); 
    if(Post){ // Post가 존재한다면
        const postCommentResult = await createComment(post_id, userIdFromJWT, contents,user_id);
        return res.status(200).json(response(baseResponse.SUCCESS, postCommentResult));
    }
    else{
        return res.status(404).json(errResponse(baseResponse.POST_POSTID_NOT_EXIST))
    }   
};

/**
 * API name : 댓글 삭제
 * DELETE: /comments/{comments_id}
 */
export const deleteComment = async(req, res) => {
    
    const {comments_id} = req.params;
    const {user_id} = req.body;// 댓글 작성자 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); //토큰을 통한 유저 ID
    
    if(user_id == userIdFromJWT){
        const Comment = await retrieveOneComment(comments_id); 
        if(Comment[0]){ // Comment가 존재한다면
            const deleteCommentResult = await removeComment(comments_id);
            return res.status(200).json(response(baseResponse.SUCCESS, deleteCommentResult));
        }
        else{
            return res.status(404).json(errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST));
        }
    }
    else{
        return res.status(400).json(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    }
};