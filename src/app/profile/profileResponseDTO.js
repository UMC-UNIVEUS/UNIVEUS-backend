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
    if(type === "retrieve" && userIntroductionResponse.userMakingNumInfo != null && userIntroductionResponse.userParticipantNumInfo != null && userIntroductionResponse.userInfo != null)  { // 조회시엔 조회 결과를 같이 주도록
        console.log(userIntroductionResponse.userInfo[0]);

        //생성 횟수, 참여 횟수 userInfo에 합치기
        userIntroductionResponse.userInfo[0].making = userIntroductionResponse.userMakingNumInfo;
        userIntroductionResponse.userInfo[0].participating = userIntroductionResponse.userParticipantNumInfo;

        //합친 후 객체 제거
        delete userIntroductionResponse.userMakingNumInfo;
        delete userIntroductionResponse.userParticipantNumInfo;

        //userInfo에 필요없는 데이터 제거
        delete userIntroductionResponse.userInfo[0].id;
        delete userIntroductionResponse.userInfo[0].phone;
        delete userIntroductionResponse.userInfo[0].email;
        delete userIntroductionResponse.userInfo[0].inactive_date;
        delete userIntroductionResponse.userInfo[0].inactive_status;
        delete userIntroductionResponse.userInfo[0].phone;
        delete userIntroductionResponse.userInfo[0].created_at;
        delete userIntroductionResponse.userInfo[0].updated_at;

        //N문 N답 정보가 있다면, 필요없는 데이터 제거하고 아니면 패스함
        if(userIntroductionResponse.userIntroduction[0]) {
            delete userIntroductionResponse.userIntroduction[0].id;
            delete userIntroductionResponse.userIntroduction[0].user_id;
        } else {
            userIntroductionResponse.userIntroduction[0] = baseResponse.PROFILE_USER_INTRODUCTION_NOT_EXIST;
        }
        return response(baseResponse.SUCCESS, userIntroductionResponse);
    }

    /** 예외 처리. 따로 함수로 빼야 하나 고민중 */
    if(type === "create") // 생성 시 알 수 없는 오류로 N문 N답 데이터 생성이 정상적으로 처리되지 않음.
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_CREATING_DENY_CAUSE_BY_UNKNOWN_ERROR);
    if(type === "modify") // 수정 시 알 수 없는 오류로 N문 N답 데이터 수정이 정상적으로 처리되지 않음.
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_MODIFYING_DENY_CAUSE_BY_UNKNOWN_ERROR);
    if(type === "retrieve" && userIntroductionResponse.userInfo == null || userIntroductionResponse.userParticipantNumInfo == null || userIntroductionResponse.userMakingNumInfo == null) // 조회 시 유저 N문 N답의 유저 정보 누락
        return errResponse(baseResponse.PROFILE_USER_INFORMATION_NOT_EXIST);



    // 알 수 없는 예외
    return errResponse(baseResponse.PROFILE_UNKNOWN_ERROR);
}