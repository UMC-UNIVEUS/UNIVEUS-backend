import { response, errResponse, baseResponse } from "../../../config/response";

export const calculateStudentId = async(value) => {
    return Math.floor(value / 100000 % 100);
}


/** N문 N답 생성과 수정  */
export const userIntroductionServiceDTO = async(type, userIntroductionResponse) => {

    /* 정상 처리 */
    if(type === "create" && userIntroductionResponse === true) // 생성
        return response(baseResponse.SUCCESS);
    if(type === "modify" && userIntroductionResponse === true) // 수정
        return response(baseResponse.SUCCESS);


    /* 예외 처리. */
    if(type === "create" && userIntroductionResponse === false) // N문 N답 생성 시 이미 해당 유저의 N문 N답 데이터가 존재하여 생성할 수 없음.
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_CREATING_DENY_CAUSE_BY_ALREADY_EXIST);
    if(type === "modify" && userIntroductionResponse === false) // N문 N답 수정 시  해당 유저의 N문 N답 데이터가 존재하지 않아 수정할 수 없음.
        return errResponse(baseResponse.PROFILE_USER_INTRODUCTION_MODIFYING_DENY_CAUSE_BY_NOT_EXIST);

    // 알 수 없는 예외
    return errResponse(baseResponse.PROFILE_UNKNOWN_ERROR);
}

/** N문 N답 조회 시 userInfo Response 변환 */
export const userInfoDTO= async(Info, userMakingNumInfo, userParticipantNumInfo) => {
    if(userParticipantNumInfo != null && userMakingNumInfo != null && Info[0] != null) {
        //생성 횟수, 참여 횟수 userInfo에 합치기
        Info[0].making = userMakingNumInfo;
        Info[0].participating = userParticipantNumInfo;
        //필요 없는 정보 삭제
        delete Info[0].id;
        delete Info[0].phone;
        delete Info[0].email;
        delete Info[0].inactive_date;
        delete Info[0].inactive_status;
        delete Info[0].phone;
        delete Info[0].created_at;
        delete Info[0].updated_at;
        //학번 계산
        Info[0].student_id = await calculateStudentId(Info[0].student_id);
    }
    if (Info[0] == null || userParticipantNumInfo == null || userMakingNumInfo == null)
        return false; // 예외 처리용
    return Info[0];
}

/** N문 N답 조회 시 userIntroduction Response 변환 */
export const userIntroductionDTO = async(Introduction) => {
    //N문 N답 정보가 있다면, 필요없는 데이터 제거하고 아니면 패스함
    if(Introduction[0] != null) {
        delete Introduction[0].id;
        delete Introduction[0].user_id;
    } else {
        return false; // 예외 처리용
    }
    return Introduction[0];
}

/** N문 N답 조회 */
export const userIntroductionProviderDTO = async(userIntroductionResponse) => {
    /* 예외 처리 */
    if(userIntroductionResponse.userInfo[0] === false) // userInfo 정보 누락
        userIntroductionResponse.userInfo[0] = errResponse(baseResponse.PROFILE_USER_INFORMATION_NOT_EXIST);
    if(userIntroductionResponse.userIntroduction[0] === false) //userIntroduction 정보 누락
        userIntroductionResponse.userIntroduction[0] = errResponse(baseResponse.PROFILE_USER_INTRODUCTION_NOT_EXIST);

    return response(baseResponse.SUCCESS, userIntroductionResponse);
}