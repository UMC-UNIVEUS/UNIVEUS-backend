import dotenv from "dotenv";
dotenv.config();
import {baseResponse, response, errResponse} from "../../../config/response";
import { retrievePost, retrieveParticipant, retrievePostImages, retrieveParticipantList, formatingEndDate, formatingMeetingDate, formatingCreatedAt, isValidOpenChat} from "./postProvider";
import { createPost, createPostImage, editPost,patchPostImage, removePost, addScrap, addLike, 
    applyParticipant, registerParticipant, refuseParticipant,
    addOneDayAlarm, applyUniveus,closeUniveus
    ,changePostStatus, removeParticipant,changeStatus, changeCurrentPeople } from "./postService";
import {getUserIdByEmail, getUserByNickName, getUserById, getParticipateAvailable} from "../user/userProvider";
import { sendCreatePostMessageAlarm, sendParticipantMessageAlarm, sendCancelMessageAlarm} from "../user/userController"
import { changeParticipateAvailable, returnParticipateAvailable } from "../user/userService";

/**
 * API name : 게시글 조회(게시글 + 참여자 목록)
 * GET: /post/{post_id}
 */
export const getPost = async(req, res) => {
	
    const {post_id} = req.params;
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (작성자 id) 
    const Post = await retrievePost(post_id); 

    if (typeof Post == "undefined") return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST)); // 게시글이 존재하지 않는다면

        formatingMeetingDate(Post);

        formatingEndDate(Post);

        formatingCreatedAt(Post);
        
        const Participants = await retrieveParticipant(post_id); 
        const Participant = [];
        const Writer = Participants[0];

        const changeClassof = Math.floor(Writer.class_of / 100000 % 100);
        Writer.class_of = changeClassof + "학번";
        for(let i = 1; i < Participants.length; i++){
            Participant.push(Participants[i]);
        }
        const PostImages = await retrievePostImages(post_id); 
        const connectedUser = await getUserById(userIdFromJWT);

        const isParticipateThisPost = Participants.find((item) => item.user_id === userIdFromJWT);

        if(isParticipateThisPost){
            Object.assign(connectedUser,{"isParticipateThisPost":1});
        }
        else{
            Object.assign(connectedUser,{"isParticipateThisPost":0});
        }

        return res.send(response(baseResponse.SUCCESS, {Post, PostImages, connectedUser, Writer, Participant}));
};

/**
 * API name : 게시글 작성 >> 넘어온 데이터 형식에 따라 모임, 마감 시간 저장할 방식 수정해야 함
 * POST: /post
 */
export const postPost = async(req, res) => {
    
    const {category, limit_gender, limit_people, location, meeting_date, 
        confirmation_method, title, content, images } = req.body; // 축제용 >> limit_gender, invited_userNickNames
    const notUndefined = [category, limit_gender, limit_people, location, meeting_date, 
        confirmation_method, title, content]; // 빠지면 안될 정보들
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID (작성자 id) 
    
    for(let i = 0; i < notUndefined.length; i++){
        if(notUndefined[i] == null){
            return res.send(errResponse(baseResponse.POST_INFORMATION_EMPTY));
        } 
    } 
    if(limit_people <  1 || limit_people > 5){
        return res.send(errResponse(baseResponse.POST_PEOPLE_LIMIT));
    }    
    if(location.length > 24){
        return res.send(errResponse(baseResponse.POST_LOCATION_LENGTH));
    }    
    if(title.length > 48){ 
        return res.send(errResponse(baseResponse.POST_TITLE_LENGTH));
    }
    if(content.length > 500){
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }

    const postPostResult = await createPost(userIdFromJWT, category, limit_gender, limit_people + 1, location, meeting_date, 
                    end_date, title,images[0], content, confirmation_method);

    if(typeof images != "undefined") await createPostImage(images,postPostResult.insertId); 
    // await sendCreatePostMessageAlarm(userIdFromJWT, postPostResult.insertId, participant); // 작성 알림 (to 작성자, 초대 받은 사람
    return res.send(response(baseResponse.SUCCESS, `생성된 post_id = ${postPostResult.insertId}`)); // 성공   
}


/**
 * API name : 게시글 수정
 * PATCH: /post/{post_id} 
 */
export const patchPost =  async(req, res) => {

    const {post_id} = req.params;
    const {user_id, category, limit_gender,limit_people, location, meeting_date, openchat, 
        end_date, title,images,content} = req.body;
    const notUndefined = [category, limit_gender, limit_people, location, meeting_date, openchat, 
        end_date, title, content]; // 빠지면 안될 정보들
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID 
    const Post = await retrievePost(post_id); 

    if (user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면

    if (typeof Post == "undefined") return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST));

    for(let i = 0; i < notUndefined.length; i++){
        if(notUndefined[i] == null){ 
            return res.send(errResponse(baseResponse.POST_INFORMATION_EMPTY));
        } 
    }
    if(category != 4){ // 축제용 조건문
        return res.send(errResponse(baseResponse.POST_CATEGORY_LIMIT));
    }    
    if(limit_people != 4 && limit_people != 6){ // 축제용 조건문
        return res.send(errResponse(baseResponse.POST_PEOPLE_LIMIT));
    }    
    if(location.length > 24){
        return res.send(errResponse(baseResponse.POST_LOCATION_LENGTH));
    }    
    if(title.length > 48){ 
        return res.send(errResponse(baseResponse.POST_TITLE_LENGTH));
    }
    if(content.length > 500){ // 축제용 조건문
        return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
    }
    const patchPostResult = await editPost(category, limit_gender,limit_people, location, meeting_date, openchat, 
        end_date, title,images[0], content, post_id); 

    if(typeof images != "undefined") await patchPostImage(images,post_id); 

    return res.send(response(baseResponse.SUCCESS, patchPostResult));
    } 

/**
 * API name : 게시글 삭제
 * DELETE: /post/{post_id}
 */
export const deletePost =  async(req, res) => {

    const {post_id} = req.params;
    // const {user_id} = req.body; // 작성자의 ID
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); // 토큰을 통해 얻은 유저 ID 
    const Post = await retrievePost(post_id);


    if (Post.user_id !== userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_USERIDFROMJWT_NOT_MATCH)); //접속한 유저가 작성자가 아니라면
    
    if (typeof Post == "undefined")return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST))     

    const participants = await retrieveParticipant(post_id);

    /** 참여자 참여권 돌려주기*/
    participants.forEach(async function(participant) {
        await returnParticipateAvailable(participant.user_id);
    });
    
    if (Post.post_status === "end") return res.send(errResponse(baseResponse.POST_MATCHED_CANT_DELETE));
    

    const deletePostResult = await removePost(post_id);
   
    return res.send(response(baseResponse.SUCCESS, deletePostResult));
};

/**
 * API name : 게시글 스크랩 >> 축제 때는 필요 X
 * PATCH: /post/{post_id}/scrap
 */
export const patchScrap = async(req, res) => {

    const {post_id} = req.params;
    const userEmail = req.verifiedToken.userEmail;
    const userIdFromJWT = await getUserIdByEmail(userEmail); //토큰을 통한 이메일로 유저 id 구하기

    const Post = await retrievePost(post_id); 
    
    if(Post){ // Post가 존재한다면
        const addScrapResult = await addScrap(post_id, userIdFromJWT);   
        return res.send(response(baseResponse.SUCCESS, addScrapResult));
    } 
    else{ 
        return res.send(errResponse(baseResponse.POST_POSTID_NOT_EXIST))
    } 
};

/**
 * API name : 게시글 좋아요 >> 축제 때는 필요 X
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
        //await sendParticipantMessageAlarm(post_id, MessageAlarmList); //게시글 참여 시 문자 알림 (to old 참여자, new 참여자)
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
        //await sendParticipantMessageAlarm(post_id, MessageAlarmList); //게시글 참여 시 문자 알림 (to old 참여자, new 참여자)

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
