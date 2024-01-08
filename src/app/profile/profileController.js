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
    ModifyIntroProfile
} from "./profileService";
import {getUserIdByEmail} from "../user/userProvider";

//24.01.08 추가해야 할 부분
/*
1. 프로필 수정 api 추가(사진, 닉네임 수정 가능)
2. 프로필 정보 조회 시 유저 상태(ex. Beta Tester) 데이터 추가
3. N문 N답 조회, 수정 api 추가
4. 유저가 본인 프로필 조회 했을 때 N문 N답을 작성하지 않았는지, 했는지 구분 하는 상태 값 추가로 프론트한테 보내줘야 함.
5. 다른 유저가 특정 유저의 프로필 조회 시 api 추가(기존 조회 데이터 + N문 N답)
+ 기존 유저 프로필에서 모임 생성, 참여 횟수 조회 데이터 보내줬었는지 확인.
 */


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
export const getUserProfile = async (req, res) => {
    const userEmail = req.verifiedToken.userEmail;
    // 빈 아이디 체크
    if (!userEmail) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const user_id = await getUserIdByEmail(userEmail);
    const getUserProfileResponse = await showUserProfile(user_id);
    return res.status(200).json(response(baseResponse.SUCCESS, getUserProfileResponse));
};