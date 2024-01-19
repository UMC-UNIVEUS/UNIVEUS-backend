import dotenv from "dotenv";
import {baseResponse, response, errResponse} from "../../../config/response";
import {retrievePost, retrieveParticipant, retrievePostImages, getWaiterNum} from "./postProvider";
import {
    createPost, createPostImage, editPost, patchPostImage, removePost, addLike,
    proposeParticipation, changePostStatus,removeParticipant, cancelLike,
    sendAlarm, closePostStatus, approveParticipation} from "./postService";
import {getUserById,getUserParticipateStatusById} from "../user/userProvider";
import { sendCancelMessageAlarm} from "../user/userController"
import {postPostResponseDTO} from "./postDto";
dotenv.config();

/**
 * API name : 게시글 조회(게시글 + 참여자 목록)
 * GET: /post/{post_id}
 */
export const getPost = async(req, res) => {
	
    const {postId} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;
    const Post = await retrievePost(postId);

    if (typeof Post == "undefined") return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST)); // 게시글이 존재하지 않는다면

        const Participant = await retrieveParticipant(postId);

        const Writer = Participant[0];
        const changeStudentId = Math.floor(Writer.student_id / 100000 % 100);
        Writer.student_id = changeStudentId + "학번";

        const ParticipantList = [];
        for(let i = 1; i < Participant.length; i++){
            ParticipantList.push(Participant[i]);
        }

        const PostImages = await retrievePostImages(postId);
        let connectedUserStatus = await getUserParticipateStatusById(userIdFromJWT, postId);

        if(connectedUserStatus === null){
            connectedUserStatus = "PERSON";
        }
        
        const connectedUser = {
            "user_id": userIdFromJWT,
            "status": connectedUserStatus
        }

        return res.send(response(baseResponse.SUCCESS, {connectedUser, Writer, Post, PostImages, ParticipantList}));
};

/**
 * API name : 게시글 작성
 * POST: /post
 */
export const postPost = async(req, res) => {

    const userIdFromJWT = req.verifiedToken.userId;

    const end_datetime = new Date(req.body.meeting_datetime);
    end_datetime.setHours(end_datetime.getHours() + 9 - 2); // UTC >> KST로 바꿔주고, 2시간 전으로 지정

    const body = {
        "category": req.body.category,
        "limit_gender": req.body.limit_gender,
        "limit_people": req.body.limit_people,
        "participation_method": req.body.participation_method,
        "meeting_datetime": req.body.meeting_datetime,
        "location": req.body.location,
        "end_datetime": end_datetime,
        "title": req.body.title,
        "contents": req.body.contents,
        "images": req.body.images,
    }

    const notUndefined = [body.category, body.limit_gender, body.limit_people, body.participation_method,
        body.meeting_datetime, body.location, body.title, body.contents]; // 빠지면 안될 정보들

    for(let i = 0; i < notUndefined.length; i++){
        if(notUndefined[i] == null){
            return res.send(errResponse(baseResponse.POST_INFORMATION_EMPTY));
        } 
    }

    if(body.location.length > 24){
        return res.send(errResponse(baseResponse.POST_LOCATION_LENGTH));
    }    
    if(body.title.length > 48){
        return res.send(errResponse(baseResponse.POST_TITLE_LENGTH));
    }
    if(body.contents.length > 500){
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const Post = await createPost(userIdFromJWT, body);

    if(typeof body.images != "undefined") await createPostImage(body.images,Post.insertId);

    return res.send(response(baseResponse.SUCCESS, postPostResponseDTO(Post, userIdFromJWT)));
}

/**
 * API name : 게시글 수정
 * PATCH: /post/{post_id} 
 */
export const patchPost =  async(req, res) => {

    const userIdFromJWT = req.verifiedToken.userId;

    const {post_id} = req.params;
    const Post = await retrievePost(post_id);
    if (typeof Post == "undefined") return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));

    const end_datetime = new Date(req.body.meeting_datetime);
    end_datetime.setHours(end_datetime.getHours() + 9 - 2); // UTC >> KST로 바꿔주고, 2시간 전으로 지정

    const body = {
        "post_id": post_id,
        "category": req.body.category,
        "limit_gender": req.body.limit_gender,
        "limit_people": req.body.limit_people,
        "participation_method": req.body.participation_method,
        "meeting_datetime": req.body.meeting_datetime,
        "location": req.body.location,
        "end_datetime": end_datetime,
        "title": req.body.title,
        "contents": req.body.contents,
        "images": req.body.images,
    }

    const notUndefined = [body.category, body.limit_gender, body.limit_people, body.participation_method,
        body.meeting_datetime, body.location, body.title, body.contents]; // 빠지면 안될 정보들

    for(let i = 0; i < notUndefined.length; i++){
        if(notUndefined[i] == null){
            return res.send(errResponse(baseResponse.POST_INFORMATION_EMPTY));
        }
    }
    if (Post.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_JWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면

    const patchPostResult = await editPost(body);

    if(typeof body.images != "undefined") await patchPostImage(body.images,body.post_id);

    return res.send(response(baseResponse.SUCCESS, patchPostResult));
    } 

/**
 * API name : 게시글 삭제
 * DELETE: /post/{post_id}
 */
export const deletePost =  async(req, res) => {

    const {post_id} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;

    const Post = await retrievePost(post_id);
    if (typeof Post == "undefined") return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));

    if (Post.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_JWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면

    const deletePostResult = await removePost(post_id);
   
    return res.send(response(baseResponse.SUCCESS, deletePostResult));
};

/**
 * API name : 게시글 좋아요
 * PATCH: /post/{post_id}/like
 */
export const patchLike = async(req, res) => {

    const {post_id} = req.params;
    const Post = await retrievePost(post_id); 
    
    if(Post){ // Post가 존재한다면
        const addLikeResult = await addLike(post_id);   
        return res.send(response(baseResponse.SUCCESS, addLikeResult));
    } 
    else{ 
        return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
    } 
};

/**
 * API name : 게시글 좋아요 취소
 * PATCH: /post/{post_id}/like/cancel
 */
export const patchLikeCancel = async(req,res)=>{

    const {post_id} = req.params;
    const Post = await retrievePost(post_id);

    if(Post){
        const cancelLikeResult = await cancelLike(post_id);
        return res.send(response(baseResponse.SUCCESS, cancelLikeResult));
    }
    else{
        return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
    }
}
/**
 * API name : 게시글 참여 신청 + 참여 신청 알람(to 작성자)
 * POST: /post/{post_id}/participant/request
 */
export const requestParticipation = async(req, res) => {

    const {post_id} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;

    const Post = await retrievePost(post_id);
    const User = await getUserById(userIdFromJWT);

    if(!Post) return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST)); // Post가 존재하는지
    
    if(Post.limit_gender !== "all" && User.gender !== Post.limit_gender) return res.send(errResponse(baseResponse.POST_GENDER_LIMIT));
    // 성별 제한에 걸리는지

    const participateWaiterNum = await getWaiterNum(post_id);
    if(participateWaiterNum.num >= 10) return res.send(errResponse(baseResponse.POST_WAITER_LIMIT));

    const requestParticipationResult = await proposeParticipation(post_id, userIdFromJWT);
    const sendAlarmToWriter = await sendAlarm(post_id, Post.user_id, 1);

    return res.send(response(baseResponse.SUCCESS, requestParticipationResult));
};

/**
 * API name : 게시글 참여자 승인 + 참여 승인 알람(to 참여자)
 * PATCH: /post/{post_id}/participant/agree
 */
export const agreeParticipation = async(req, res) => {

    const participant_id = req.body.user_id; // 참여 승인을 당한 유저
    const {post_id} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;

    const Post = await retrievePost(post_id);
    if(!Post) return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST)); // Post가 존재하는지
    if(Post.post_status === "END")return res.send(errResponse(baseResponse.POST_PARTICIPATE_ALREADY_CLOSE)); // 이미 마감했는지

    if (Post.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_JWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면
   
    if ( (Post.current_people + 1) === Post.limit_people ) await closePostStatus(post_id); // 참여 인원수 = 제한 인원수 라면

    const approveParticipationResult = await approveParticipation(post_id, participant_id);
    const sendAlarmToParticipant = await sendAlarm(post_id, participant_id, 2);

    return res.send(response(baseResponse.SUCCESS, approveParticipationResult));
};

/**
 * API name : 모집 마감으로 상태 변경
 * PATCH: post/{post_id}/end
 */
export const patchPostStatus = async(req, res) => {

    const {post_id} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;
    
    const Post = await retrievePost(post_id);
    if(!Post) return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST)); // Post가 존재하는지
    if (Post.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_JWT_NOT_MATCH)); //접속한 유저가 작성자인지
    if(Post.post_status === "END")return res.send(errResponse(baseResponse.POST_PARTICIPATE_ALREADY_CLOSE)); // 이미 마감했는지

    const patchPostStatusResult = await closePostStatus(post_id);
    return res.send(response(baseResponse.SUCCESS, patchPostStatusResult));
};7

/**
 * API name : 게시글 모임 1일 전 알림 
 * POST: post/{post_id}/participant/onedayalarm
 */
export const postOneDayAlarm = async(req, res) => {
    
    const {post_id} = req.params;
    const {user_id} = req.body;// 참여자 ID들을 다 받아와야 함 >> 보류
    
    const Post = await retrievePost(post_id); 
    
    if(Post){ 
        const postOneDayAlarmResult = await addOneDayAlarm(post_id, user_id);
        return res.send(response(baseResponse.SUCCESS, postOneDayAlarmResult));
    } 
    else{ 
        return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
    }
};

/**
 * API name : 유니버스 참여 취소 (축제 때는 불가능함)
 * DELETE: /post/{post_id}/participant/cancel
 */
export const cancelParticipant = async(req, res) => {
    
    const {post_id} = req.params;
    const {user_id,participant_userIDsFromDB} = req.body;// 작성자 ID, 참여한 유저 ID들
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (신청자 ID 여야 함)
    
    const Post = await retrievePost(post_id); 
    
    if(Post){ // Post가 존재한다면 
        if(participant_userIDsFromDB.includes(userIdFromJWT)){ // 참여를 했던 유저라면

            if(Post.post_status =="end"){// 모집 마감이라면
                await changePostStatus(post_id);// 모집 중으로 변경
            }
            const removeParticipantResult = await removeParticipant(post_id, userIdFromJWT, user_id);// 유니버스 참여 취소
            await sendCancelMessageAlarm(user_id, userIdFromJWT); // 참여 취소 알림 (to 작성자)
            return res.send(response(baseResponse.SUCCESS, removeParticipantResult));
        }
        else{ // 참여를 하지 않았던 유저라면 
            return res.send(errResponse(baseResponse.POST_PARTICIPATION_NOT_MATCH));
        }
    } 
    else{ 
        return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
    }
};

export const postImage = async(req, res) => {
    if (!req.files) return res.send(errResponse(baseResponse.S3_ERROR));
    const fileResponse = new Array();
    for(let i = 0; i < req.files.length; i++) {
        fileResponse.push({pic_url : req.files[i].location});
    }
    if (!fileResponse) return res.send(errResponse(baseResponse.S3_ERROR));
    return res.send(response(baseResponse.SUCCESS, fileResponse));
};