import { response, errResponse, baseResponse } from "../../../config/response";

export const userProfileDTO = async(UserProfileResponse, user_id) => {
    const changeClassof = Math.floor(UserProfileResponse.class_of / 100000 % 100);
    UserProfileResponse.class_of = changeClassof + "학번"
    return response(baseResponse.SUCCESS, UserProfileResponse);
}

export const userIntroductionDTO = async(type, userIntroductionResponse) => {

    if(type === "create" && userIntroductionResponse === true) // 생성
        return response(baseResponse.SUCCESS);
    if(type === "modify" && userIntroductionResponse === true) // 수정
        return response(baseResponse.SUCCESS);
    if(type === "retrieve" && userIntroductionResponse != null)  { // 조회시엔 조회 결과를 같이 주도록
        delete userIntroductionResponse.id;
        return response(baseResponse.SUCCESS, userIntroductionResponse);
    }
    return errResponse(baseResponse.SERVER_ERROR); // 여긴 예외처리.
}