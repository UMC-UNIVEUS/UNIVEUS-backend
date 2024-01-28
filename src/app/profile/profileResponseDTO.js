import { response, errResponse, baseResponse } from "../../../config/response";

export const userProfileDTO = async(UserProfileResponse, user_id) => {
    const changeClassof = Math.floor(UserProfileResponse.class_of / 100000 % 100);
    UserProfileResponse.class_of = changeClassof + "학번"
    return response(baseResponse.SUCCESS, UserProfileResponse);
}

export const userIntroductionDTO = async(type, userIntroductionResponse) => {

    /** 정상 처리 */
    if(type === "create" && userIntroductionResponse === true) // 생성
        return response(baseResponse.SUCCESS);
    if(type === "modify" && userIntroductionResponse === true) // 수정
        return response(baseResponse.SUCCESS);
    if(type === "retrieve" && userIntroductionResponse != null)  { // 조회시엔 조회 결과를 같이 주도록
        delete userIntroductionResponse.userInfo[0].id
        return response(baseResponse.SUCCESS, userIntroductionResponse);
    }

    /** 예외 처리. 따로 함수로 빼야 하나 고민중 */
    if(type === "create") // 생성 시 알 수 없는 오류로 N문 N답 데이터 생성이 정상적으로 처리되지 않음.
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_CREATING_DENY_CAUSE_BY_UNKNOWN_ERROR);
    if(type === "modify") // 수정 시 알 수 없는 오류로 N문 N답 데이터 수정이 정상적으로 처리되지 않음.
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_MODIFYING_DENY_CAUSE_BY_UNKNOWN_ERROR);
    if(type === "retrieve" && userIntroductionResponse == null) // 조회 시 유저 N문 N답 데이터 누락
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_NOT_EXIST);


    // 알 수 없는 예외
    return errResponse(baseResponse.PROFILE_UNKNOWN_ERROR);
}