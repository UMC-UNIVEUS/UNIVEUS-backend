import dotenv from "dotenv";
import {baseResponse, response, errResponse} from "../../../config/response";
import { retrievePost, retrieveParticipant, retrievePostImages, retrieveParticipantList, formatingEndDate, formatingMeetingDate, formatingCreatedAt, isValidOpenChat} from "./postProvider";
import { createPost, createPostImage, editPost,patchPostImage, removePost, addLike,
    applyParticipant, registerParticipant, refuseParticipant,
    addOneDayAlarm, applyUniveus,closeUniveus, inviteOneParticipant
    ,changePostStatus, removeParticipant,changeStatus, changeCurrentPeople } from "./postService";
import {
    getUserIdByEmail,
    getUserByNickName,
    getUserById,
    getIsParticipateOtherById,
    getParticipateAvailable,
    getUserParticipateStatusById
} from "../user/userProvider";
import { sendCreatePostMessageAlarm, sendParticipantMessageAlarm, sendCancelMessageAlarm} from "../user/userController"
import { changeParticipateAvailable, returnParticipateAvailable } from "../user/userService";
import {postPostResponseDTO} from "./postDto";
dotenv.config();

/**
 * API name : 게시글 조회(게시글 + 참여자 목록)
 * GET: /post/{post_id}
 */
export const getPost = async(req, res) => {
	
    const {post_id} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;
    const Post = await retrievePost(post_id);

    if (typeof Post == "undefined") return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST)); // 게시글이 존재하지 않는다면

        const Participant = await retrieveParticipant(post_id);

        const Writer = Participant[0];
        const changeStudentId = Math.floor(Writer.student_id / 100000 % 100);
        Writer.student_id = changeStudentId + "학번";

        const ParticipantList = [];
        for(let i = 1; i < Participant.length; i++){
            ParticipantList.push(Participant[i]);
        }

        const PostImages = await retrievePostImages(post_id);
        let connectedUserStatus = await getUserParticipateStatusById(userIdFromJWT, post_id);

        if(connectedUserStatus === null){ // 여기 테스트 해봐야 함
            connectedUserStatus = "PERSON";
        }
        
        const connectedUser = { // 여기 테스트 해봐야 함
            "status": connectedUserStatus
        }

        return res.send(response(baseResponse.SUCCESS, {connectedUser, Writer, Post, PostImages, ParticipantList}));
};

/**
 * API name : 게시글 작성
 * POST: /post
 */
export const postPost = async(req, res) => { // 일단 나는 Controller에서 에러 핸들링을 함

    const userIdFromJWT = req.verifiedToken.userId; // 이 부분에서 userId를 못 찾는 에러가 발생함
    console.log(userIdFromJWT);

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
    if(body.contents.length > 500){ // 축제용 조건문
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const Post = await createPost(userIdFromJWT, body);

    if(typeof body.images != "undefined") await createPostImage(body.images,Post.insertId);

    return res.send(response(baseResponse.SUCCESS, postPostResponseDTO(Post)));
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

    const body = {
        "user_id": Post.user_id,
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

    if (body.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면

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
    if (Post.post_status === "END") return res.send(errResponse(baseResponse.POST_MATCHED_CANT_DELETE));

    if (Post.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_JWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면

    const deletePostResult = await removePost(post_id); // post 하나가 지워지면 participant_user 테이블도 따라서 지워지는 cascade 설정해줘야 함.
   
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
 * API name : 게시글 참여 신청 + 참여 신청 알람(to 작성자)
 * POST: /post/{post_id}/participant/apply
 */
export const postParticipant = async(req, res) => {

    
    const {post_id} = req.params;
    const {user_id} = req.body;// 작성자 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (신청자 ID 여야 함)
    
    const Post = await retrievePost(post_id); 
    
    if(Post){ // Post가 존재한다면 
        const postParticipantResult = await applyParticipant(post_id, userIdFromJWT, user_id);
        return res.send(response(baseResponse.SUCCESS, postParticipantResult));
    } 
    else{ 
        return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST))
    }
};

/**
 * API name  게시글 참여자 신청 내역 조회 
 * GET: /post/{post_id}/participant
 */
export const getParticipant = async(req, res) => {
	
    const {post_id} = req.params;
    const {user_id} = req.body; // 작성자 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (작성자 ID 여야 함)
    
    if(user_id == userIdFromJWT){ //접속한 유저가 작성자라면
        const Post = await retrievePost(post_id); 

        if(Post){ 
            const getParticipantList = await retrieveParticipantList(post_id); 
            return res.send(response(baseResponse.SUCCESS, getParticipantList));
        } 
        else{ 
            return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
        }  
    }
    else{
        return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    }
};

/**
 * API name : 게시글 참여자 승인 + 참여 승인 알람(to 참여자)
 * PATCH: /post/{post_id}/participant/register
 */
export const patchParticipant = async(req, res) => {
    
    const {post_id} = req.params;
    const {participant_id, user_id} = req.body;// 참여 테이블 ID, 작성자의 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (작성자 ID 여야 함)
    
    if(user_id == userIdFromJWT){
        const Post = await retrievePost(post_id); 
        if(Post){
            const patchParticipantResult = await registerParticipant(post_id, participant_id);
            return res.send(response(baseResponse.SUCCESS, patchParticipantResult));
        } 
        else{ 
            return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
        }
    }
    else{
        return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    }
};

/**
 * API name : 게시글 참여자 거절 + 참여 거절 알람(to 참여자)
 * DELETE: /{post_id}/participant/refuse
 */
export const deleteParticipant = async(req, res) => {
    
    const {post_id} = req.params;
    const {participant_id, user_id} = req.body;
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (작성자 ID 여야 함)
    
    const Post = await retrievePost(post_id); 
    
    if(user_id == userIdFromJWT){
        if(Post){ 
            const deleteParticipantResult = await refuseParticipant(post_id, participant_id);
            return res.send(response(baseResponse.SUCCESS, deleteParticipantResult));
        } 
        else{ 
            return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));
        }
    }
    else{
        return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    }
};

/**
 * API name : 모집 마감으로 상태 변경
 * PATCH: post/{post_id}/status
 */
export const patchStatus = async(req, res) => {

    const {post_id} = req.params;
    const {user_id} = req.body; // 작성자 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (작성자 ID 여야 함)
    const Post = await retrievePost(post_id); 
   
    if(user_id == userIdFromJWT){
        if(Post){ // Post가 존재한다면
            if(Post.post_status == 'end'){
                return res.status(errResponse(baseResponse.POST_PARTICIPATE_ALREADY_CLOSE))
            }
            else{
                const changeStatusResult = await changeStatus(post_id);   
                return res.send(response(baseResponse.SUCCESS, changeStatusResult));
            }
        } 
        else{ 
            return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST))
        } 
    }
    else{
        return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH));
    }
};

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
 * API name : 유니버스 참여 + 모집 자동 마감 + 알림 >> 축제용 API
 * POST: /post/{post_id}/participant
 */
export const participateUniveus = async(req, res) => {
    
    const {post_id} = req.params;
    const writer_id = req.body.user_id; 
    const {participant_userIDsFromDB, invited_userNickNamesFromAPI} = req.body;
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (신청자 ID)
    
    const Post = await retrievePost(post_id); 
    const Writer = await getUserById(writer_id); 
    const Invitee = await getUserById(userIdFromJWT); 


    if (typeof Post == "undefined")return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));     

    if (invited_userNickNamesFromAPI.length == 0) return res.send(errResponse(baseResponse.POST_INVITE_EMPTY)); 

    if(Post.limit_people == 4){
            
        if (invited_userNickNamesFromAPI[0] == "") return res.send(errResponse(baseResponse.POST_INVITE_EMPTY));

        if (invited_userNickNamesFromAPI[0] == " ") return res.send(errResponse(baseResponse.POST_INVITE_EMPTY)); 

        const guest = await getUserByNickName(invited_userNickNamesFromAPI[0]); 

        if (typeof guest == "undefined") return res.send(errResponse(baseResponse.POST_PARTICIPANT_NOT_EXIST));

        if (Invitee.user_id == guest.user_id) return res.send(errResponse(baseResponse.POST_PARTICIPANT_INVITEE_OVERLAP));

        if(Writer.user_id == guest.user_id) return res.send(errResponse(baseResponse.POST_WRITER_GUEST_DUPLICATE));
               
        const isParticipate = (participant_userIDsFromDB.includes(userIdFromJWT) || participant_userIDsFromDB.includes(guest.user_id));

        if(isParticipate) return res.send(errResponse(baseResponse.POST_PARTICIPATION_OVERLAP)); // 이미 참여한 유저가 있다면

        if(Post.limit_people <= Post.current_people) return res.send(errResponse(baseResponse.POST_PARTICIPATION_CLOSE)); // 모집 마감이라면

        const genderAllowed = Post.limit_gender == 0 || (Post.limit_gender == Invitee.gender && Post.limit_gender == guest.gender);

        if(!genderAllowed) return res.send(errResponse(baseResponse.POST_GENDER_LIMIT));

        if (await getParticipateAvailable(userIdFromJWT) == 0) return res.send(errResponse(baseResponse.USER_ALREADY_PARTICIPATE));

        if (await getParticipateAvailable(guest.user_id) == 0) return res.send(errResponse(baseResponse.USER_ALREADY_PARTICIPATE));

                            
            // 정상적인 참여
        const alreadyParticipant = await getUserById(participant_userIDsFromDB[0]); 

        await applyUniveus(post_id, userIdFromJWT); // 초대자 참여

        await applyUniveus(post_id, guest.user_id); // 초대받은 사람 참여

        await closeUniveus(post_id,writer_id); // 게시글의 상태를 모집 마감으로 업데이트

        await changeCurrentPeople(4, post_id);

        // TODO :  user 테이블의 participate-available 0으로 만들어주기

        await changeParticipateAvailable(guest.user_id);

        await changeParticipateAvailable(userIdFromJWT);

        const MessageAlarmList = [Writer, [alreadyParticipant], Invitee, [guest]];
        await sendParticipantMessageAlarm(post_id, MessageAlarmList); //게시글 참여 시 문자 알림 (to old 참여자, new 참여자)
        return res.send(response(baseResponse.SUCCESS));          
    }  

    else if(Post.limit_people == 6){

        if (invited_userNickNamesFromAPI.length != 2) return res.send(errResponse(baseResponse.POST_INVITE_EMPTY));

        if (invited_userNickNamesFromAPI[0] == "") return res.send(errResponse(baseResponse.POST_INVITE_EMPTY));

        if (invited_userNickNamesFromAPI[1] == "") return res.send(errResponse(baseResponse.POST_INVITE_EMPTY));

        if (invited_userNickNamesFromAPI[0] == " ") return res.send(errResponse(baseResponse.POST_INVITE_EMPTY));

        if (invited_userNickNamesFromAPI[1] == " ") return res.send(errResponse(baseResponse.POST_INVITE_EMPTY));

        const guest1 = await getUserByNickName(invited_userNickNamesFromAPI[0]); 

        if (typeof guest1 == "undefined") return res.send(errResponse(baseResponse.USER_FIRST_NOT_EXIST));
        
        if(Writer.user_id == guest1.user_id) return res.send(errResponse(baseResponse.POST_WRITER_GUEST_DUPLICATE));

        const guest2 = await getUserByNickName(invited_userNickNamesFromAPI[1]); 
                
        if(typeof guest2 == "undefined") return res.send(errResponse(baseResponse.USER_SECOND_NOT_EXIST));

        if(Writer.user_id == guest2.user_id) return res.send(errResponse(baseResponse.POST_WRITER_GUEST_DUPLICATE));

        if(Invitee.user_id == guest1.user_id || Invitee.user_id == guest2.user_id) return res.send(errResponse(baseResponse.POST_PARTICIPANT_INVITEE_OVERLAP));
 
        if(guest1.user_id == guest2.user_id) return res.send(errResponse(baseResponse.POST_PARTICIPANT_NOT_OVERLAP));

        const isParticipate = (participant_userIDsFromDB.includes(userIdFromJWT) || participant_userIDsFromDB.includes(guest1.user_id) || participant_userIDsFromDB.includes(guest2.user_id));
                    
        if(isParticipate) return res.send(errResponse(baseResponse.POST_PARTICIPATION_OVERLAP)); // 이미 참여한 유저가 있다면

        if(Post.limit_people <= Post.current_people) return res.send(errResponse(baseResponse.POST_PARTICIPATION_CLOSE)); // 모집 마감이라면
        
        const genderAllowed = Post.limit_gender == 0 || (Post.limit_gender == Invitee.gender && Post.limit_gender == guest1.gender && Post.limit_gender == guest2.gender);
        
        if(!genderAllowed) return res.send(errResponse(baseResponse.POST_GENDER_LIMIT));

        if (await getParticipateAvailable(userIdFromJWT) == 0) return res.send(errResponse(baseResponse.USER_ALREADY_PARTICIPATE));

        if (await getParticipateAvailable(guest1.user_id) == 0) return res.send(errResponse(baseResponse.USER_ALREADY_PARTICIPATE));

        if (await getParticipateAvailable(guest2.user_id) == 0) return res.send(errResponse(baseResponse.USER_ALREADY_PARTICIPATE));

        // 정상적인 참여
        const alreadyParticipant1 = await getUserById(participant_userIDsFromDB[0]); 

        const alreadyParticipant2 = await getUserById(participant_userIDsFromDB[1]); 

        await applyUniveus(post_id, userIdFromJWT); // 초대자 참여

        await applyUniveus(post_id, guest1.user_id); // 초대받은 사람 참여

        await applyUniveus(post_id, guest2.user_id); // 초대받은 사람 참여

        await changeCurrentPeople(6, post_id);

        await closeUniveus(post_id,writer_id); // 게시글의 상태를 모집 마감으로 업데이트
        
        await changeParticipateAvailable(guest1.user_id);

        await changeParticipateAvailable(guest2.user_id);

        await changeParticipateAvailable(userIdFromJWT);

        const MessageAlarmList = [Writer, [alreadyParticipant1, alreadyParticipant2], Invitee, [guest1, guest2]];
        await sendParticipantMessageAlarm(post_id, MessageAlarmList); //게시글 참여 시 문자 알림 (to old 참여자, new 참여자)

        return res.send(response(baseResponse.SUCCESS));
        }  

        else {
                return res.send(errResponse(baseResponse.SERVER_ERROR));
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

/** kakao 오픈채팅링크 유효성 검사 */
export const validateOpentChatLink =  async(req, res) => {
    const openChaturi = req.body.openChaturi;

    if (isValidOpenChat(openChaturi)) {
        return res.send(response(baseResponse.SUCCESS));
    }
    return res.send(errResponse(baseResponse.OPEN_CHAT_URI_NOT_VALID));
}