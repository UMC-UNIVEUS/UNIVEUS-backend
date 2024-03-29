/* Request를 처리하고 Response 해주는 곳 */

import { response, errResponse, baseResponse } from "../../../config/response";

import {
    retrieveUserIntroduction, retrieveUserOwnIntroduction,
    retrieveUserProfileAboutCreateInfo, retrieveUserProfileAboutParticipantInfo,
    retrieveUserProfileAboutUserInfo
} from './profileProvider';
import {
    createUserIntroduction, modifyUserInformation,
    modifyUserIntroduction
} from "./profileService";
import {
    userInformationModifyDTO,
    userIntroductionProviderDTO, userIntroductionServiceDTO, userProfileDTO
} from "./profileResponseDTO";


/** N문 N답 생성 API */
export const postUserIntroduction = async (req, res) => { //아직 추가는 못했지만, 나중에 이미 생성 데이터가 존재하면 생성하지 않는 예외처리 해줘야함.
    return res.send(await userIntroductionServiceDTO("create", await createUserIntroduction(req.verifiedToken.userId, req.body)));
}

/** N문 N답 수정 API */
export const putUserIntroduction = async (req, res) => {
    return res.send(await userIntroductionServiceDTO("modify", await modifyUserIntroduction(req.verifiedToken.userId, req.body)));
}

/** N문 N답 조회(=남이 보는 프로필) API */
export const getUserIntroduction = async (req, res) => { // N문 N답 조회는 남이 보는 프로필 조회, 내가 보는 프로필 조회에서 클릭시 보이는 화면(남이 보는 프로필 조회랑 같음) 두가지에서 쓰이기 때문에,
    return res.send(await userIntroductionProviderDTO(0, await retrieveUserIntroduction(req.params.id, req.verifiedToken.userId)));
}

export const getUserOwnedIntroduction = async (req, res) => { // N문 N답 조회는 남이 보는 프로필 조회, 내가 보는 프로필 조회에서 클릭시 보이는 화면(남이 보는 프로필 조회랑 같음) 두가지에서 쓰이기 때문에,
    return res.send(await userIntroductionProviderDTO(1, await retrieveUserOwnIntroduction(req.verifiedToken.userId)));
}

/** 본인용 프로필 조회 중 유저 정보 부분 API */
export const getUserProfileAboutUserInfo = async (req, res) => {
    return res.send(await userProfileDTO(1, await retrieveUserProfileAboutUserInfo(req.verifiedToken.userId)));
}

/** 본인용 프로필 조회 중 생성 정보 부분 API */
export const getUserProfileAboutCreateInfo = async (req, res) => {
    return res.send(await userProfileDTO(2, await retrieveUserProfileAboutCreateInfo(req.verifiedToken.userId)));
}

/** 본인용 프로필 조회 중 참여 정보 부분 API */
export const getUserProfileAboutParticipantInfo = async (req, res) => {
    return res.send(await userProfileDTO(3, await retrieveUserProfileAboutParticipantInfo(req.verifiedToken.userId)));
}

/* 유저 정보 수정 API */
export const putUserInformation = async (req, res) => {
    return res.send(await userInformationModifyDTO(await modifyUserInformation(req.verifiedToken.userId, req.body)))
}



// /* 유저 정보 수정 API */
// export const putUserInformation = async (req, res) => {
//     return res.send(await userInformationDTO("modify", await modifyUserInformation(req.verifiedToken.userId, req.body)))
// }


//24.01.08 추가해야 할 부분
/*
1. 프로필 수정 api 추가(사진, 닉네임 수정 가능)
2. 프로필 정보 조회 시 유저 상태(ex. Beta Tester) 데이터 추가
3. N문 N답 조회, 수정 api 추가
4. 유저가 본인 프로필 조회 했을 때 N문 N답을 작성하지 않았는지, 했는지 구분 하는 상태 값 추가로 프론트한테 보내줘야 함.
5. 다른 유저가 특정 유저의 프로필 조회 시 api 추가(기존 조회 데이터 + N문 N답)
+ 기존 유저 프로필에서 모임 생성, 참여 횟수 조회 데이터 보내줬었는지 확인.
 */

