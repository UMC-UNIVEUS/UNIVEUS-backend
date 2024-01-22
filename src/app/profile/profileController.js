/* Request를 처리하고 Response 해주는 곳 */

import { response, errResponse, baseResponse } from "../../../config/response";

import {
    showUserDefaultProfile,
    showUserIntroProfile,
    showUserMyUnive,
    showUserParticipate,
    showUserProfile
} from './profileProvider';
import {
    createUserIntroduction,
    ModifyIntroProfile, modifyUserProfile
} from "./profileService";
import {getUserIdByEmail} from "../user/userProvider";
import {userEmailIdCheckDTO} from "./profile_check_dto";
import {userIntroductionDTO, userProfileDTO} from "./profileResponseDTO";


/* N문 N답 생성 API */
export const postUserIntroduction = async (req, res) => {
    return res.send(await userIntroductionDTO(await createUserIntroduction(req.verifiedToken.userId, req.body)));
}

//24.01.08 추가해야 할 부분
/*
1. 프로필 수정 api 추가(사진, 닉네임 수정 가능)
2. 프로필 정보 조회 시 유저 상태(ex. Beta Tester) 데이터 추가
3. N문 N답 조회, 수정 api 추가
4. 유저가 본인 프로필 조회 했을 때 N문 N답을 작성하지 않았는지, 했는지 구분 하는 상태 값 추가로 프론트한테 보내줘야 함.
5. 다른 유저가 특정 유저의 프로필 조회 시 api 추가(기존 조회 데이터 + N문 N답)
+ 기존 유저 프로필에서 모임 생성, 참여 횟수 조회 데이터 보내줬었는지 확인.
 */


/* 1. 프로필 수정 api 추가 */
export const putUserProfile = async (req, res) => {
    const userEmail = req.verifiedToken.userEmail;
    // 빈 아이디 체크 << 이거 dto로 처리해야 하는지?
    //1. 모든 걸 받아서 처리하는 미들웨어 하나 만들기. receivedData라는 객체에 헤더, 쿼리, path variable로 받은 데이터를 정해진 네이밍에 넣고 그걸 하나씩 꺼내서 존재하는지 확인. 존재하면 전달.
    //2. 애초에 특정 값이 존재하는지만 확인하는 미들웨어 여러 개 만들기. 이메일은 이메일, 쿼리에 특정 값이 비어있으면 쿼리 등.
    // if (!userEmail) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userId = await userEmailIdCheckDTO(userEmail);
    if(userId === -1)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    else
        return res.send(response(baseResponse.SUCCESS, await modifyUserProfile(userId)));
}




/* export const getUserProfile = async (req, res) => {
    const {user_id} = req.params;
    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const getDefaultResponse = await showUserDefaultProfile(user_id);
    const getIntroResponse = await showUserIntroProfile(user_id);
    if(!getDefaultResponse[0]) { // default 프로필 정보가 없음을 응답.
        return res.status(404).json(errResponse(baseResponse.PROFILE_DEFAULT_INFO_NOT_EXIST));
    } else if(!getIntroResponse[0]) { // intro 프로필 정보가 없음을 응답.
        return res.status(404).json(errResponse(baseResponse.PROFILE_INTRO_INFO_NOT_EXIST));
    } else { // 프로필 정보 둘 다 존재하는 경우.
        const getAllResponse = {getDefaultResponse, getIntroResponse};
        return res.status(200).json(response(baseResponse.SUCCESS, getAllResponse));
    }
};
*/

/* export const putUserProfile = async (req, res) => {
    //아직은 user_id를 확인할 방법이 없어 파라미터로 받음.
    //나중엔 헤더에 토큰 정보를 담아서 전달하면 굳이 파라미터로 받을 필요 없음.
    const userEmail = req.verifiedToken.userEmail;
    // 빈 아이디 체크
    if (!userEmail) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const user_id = await getUserIdByEmail(userEmail);
    const defaultInfo = {
        nickname: req.body.nickname,
        gender: req.body.gender,
        profile_img: req.body.profile_img
    };
    // 닉네임 길이 체크(일단 db 설계할 땐 30자?로 해놨더라고요. 이게 한글이 3bytes 라서 VARCHAR(90)해놓은건지)
    if (defaultInfo.nickname.length > 90) {
        return res.send(errResponse(baseResponse.USER_USER_NICKNAME_LENGTH));
    };

    const detailInfo = {
        interest: req.body.interest,
        introduce: req.body.introduce
    };
    const putUserProfileResponse = await ModifyIntroProfile(defaultInfo, detailInfo, user_id);
    return res.send(putUserProfileResponse);
};*/

export const getUserMyUnive = async (req, res) => {
    const userEmail = req.verifiedToken.userEmail;
    // 빈 아이디 체크
    if (!userEmail) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const user_id = await getUserIdByEmail(userEmail);
    // const user_profile = await showUserProfile(user_id);
    //const getUserMyUniveResponse = await showUserProfile(user_id);
    const getUserMyUniveResponse = await showUserMyUnive(user_id);
    //const my_unive = await showUserMyUnive(user_id);
    /*const getUserMyUniveResponse = {
        user_profile,
        my_unive
    };*/
    return res.status(200).json(response(baseResponse.SUCCESS, getUserMyUniveResponse));
};


export const getUserParticipate = async (req, res) => {
    const userEmail = req.verifiedToken.userEmail;
    // 빈 아이디 체크
    if (!userEmail) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const user_id = await getUserIdByEmail(userEmail);
    const getUserParticipateResponse = await showUserParticipate(user_id);
    return res.status(200).json(response(baseResponse.SUCCESS, getUserParticipateResponse));
};
// export const getUserProfile = async (req, res) => {
//     const userEmail = req.verifiedToken.userEmail;
//     // 빈 아이디 체크
//     if (!userEmail) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
//     const user_id = await getUserIdByEmail(userEmail);
//     const getUserProfileResponse = await showUserProfile(user_id);
//     return res.status(200).json(response(baseResponse.SUCCESS, getUserProfileResponse));
// };

export const getUserProfile = async (req, res) => {
    const user_id = req.verifiedToken.userId;
    //프로필용 db를 하나 더 만들면 좋지 않을까 하면서 일단 그렇게 짜봤음. 추후 상의 후 수정
    //나중에 임의의 유저가 특정 글에서 작성자 프로필에 접근할 땐, 작성자 id로 프로필 id를 찾거나
    //또는 프로필 id를 user테이블에 저장하는 건..비효율적?
    const profile_id = req.params;
    // 빈 아이디 체크 >> 나중에 미들웨어로 뺄거임 표시만
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    return userProfileDTO(showUserProfile(profile_id), user_id);
}