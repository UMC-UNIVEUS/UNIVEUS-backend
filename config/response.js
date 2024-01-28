//API 응답의 기본 형식들 정의

export const baseResponse = {
    SUCCESS : { "isSuccess": true, "code": "COMMON200", "message":"성공" },

    //유저 관련 response msg
    USER_USERID_JWT_NOT_MATCH : {"isSuccess":false, "code":"USER0000", "message":"로그인한 유저는 작성자가 아닙니다."},
    SIGNUP_MAJOR_EMPTY : {"isSuccess" : false, "code" : "USER0001", "message" : "학과를 입력해주세요."},
    SIGNUP_STUDENTID_EMPTY : {"isSuccess" : false, "code" : "USER0002", "message" : "학번을 입력해주세요."},
    VERIFY_PHONE_EMPTY : {"isSuccess" : false, "code" : "USER0003", "message" : "번호를 입력해주세요"},
    SEND_AUTH_NUMBER_MSG_FAIL : {"isSuccess" : false, "code" : "USER0005", "message" : "인증번호 문자 전송을 실패했습니다."},
    ALREADY_AUTH_NUMBER : {"isSuccess" : false, "code" : "USER0006", "message" : "이미 인증을 완료하였습니다" },
    VERIFY_NUMBER_EMPTY : {"isSuccess" : false, "code" : "USER0007", "message" : "인증번호가 입력되어있지 않습니다." },
    VERIFY_NUMBER_FAIL : {"isSuccess" : false, "code" : "USER0008", "message" : "인증번호가 올바르지 않습니다." },
    USER_NICKNAME_EMPTY : {"isSuccess" : false, "code" : "USER0009", "message" : "닉네임이 비어있습니다." },
    USER_GENDER_EMPTY : {"isSuccess" : false, "code" : "USER0010", "message" : "성별이 비어있습니다." },
    LOGIN_NOT_USER : {"isSuccess" : false, "code" : "USER0011", "message" : "회원이 아닙니다. 본인인증 페이지로 리다이렉트 됩니다." },
    LOGIN_NOT_AUTH_NUMBER : {"isSuccess" : false, "code" : "USER0012", "message" : "번호인증이 필요합니다. 번호인증 페이지로 리다이렉트 됩니다." },
    LOGIN_NOT_USER_AGREE : {"isSuccess" : false, "code" : "USER0013", "message" : "약관동의를 완료한 유저가 아닙니다. 해당 페이지로 리다이렉트 됩니다." },
    LOGIN_NOT_AUTH_COMPLETE_USER : {"isSuccess" : false, "code" : "USER0014", "message" : "소속인증을 완료한 유저가 아닙니다. 해당 페이지로 리다이렉트 됩니다." },
    LOGIN_PROFILE_NOT_EXIST : {"isSuccess" : false, "code" : "USER0015", "message" : "프로필 등록을 완료한 유저가 아닙니다. 해당 페이지로 리다이렉트 됩니다." },

    USER_FIRST_NOT_EXIST : { "isSuccess": false, "code": 2000, "message": "초대한 유저 중 첫 번째 유저가 존재하지 않습니다." },
    USER_SECOND_NOT_EXIST : { "isSuccess": false, "code": 2001, "message": "초대한 유저 중 두 번째 유저가 존재하지 않습니다." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2002, "message": "해당 유저가 존재하지 않습니다." },
    SIGNUP_EMAIL_DUPLICATE : {"isSuccess" : false, "code" : 2003, "message" : "이미 존재하는 이메일입니다."},
    SIGNUP_EMAIL_KYONGGI : {"isSuccess" : false, "code" : 2004, "message" : "경기대학교 이메일만 사용 가능합니다."},
    SIGNUP_NICKNAME_EMPTY : {"isSuccess" : false, "code" : 2005, "message" : "닉네임을 입력해주세요."},
    SIGNUP_GENDER_EMPTY : {"isSuccess" : false, "code" : 2006, "message" : "성별을 입력해주세요."},
    

    NICK_NAME_DUPLICATE : {"isSuccess" : false, "code" : 2014, "message" : "닉네임이 중복됩니다." },
    SIGNUP_PHONE_NUMBER_EMPTY : {"isSuccess" : false, "code" : 2015, "message" : "전화번호를 입력해주세요."},
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2017, "message": "user_Id를 입력해주세요." },
    USER_USER_NICKNAME_LENGTH : { "isSuccess": false, "code": 2018, "message": "닉네임 길이 제한을 초과하였습니다." },
    NOT_ADMIN :{"isSuccess" : false, "code" : 2021, "message" : "축제 때 사용해 보시라우.ᐟ" },
    FIRST_AGREEMENT_EMPTY : {"isSuccess" : false, "code" : 2022, "message" : "첫 번째 약관에 동의하지 않았습니다." },
    SECOND_AGREEMENT_EMPTY : {"isSuccess" : false, "code" : 2023, "message" : "두 번째 약관에 동의하지 않았습니다." },
    THIRD_AGREEMENT_EMPTY : {"isSuccess" : false, "code" : 2024, "message" : "세 번째 약관에 동의하지 않았습니다." },
    USERS_ACCOUNT_WITHDRAW : {"isSuccess" : false, "code" : 2025, "message" : "탈퇴한 회원입니다." },
    USERS_ACCOUNT_BLOCKED : {"isSuccess" : false, "code" : 2026, "message" : "정지된 계정입니다." },

    
    //게시글 관련
    POST_POSTID_NOT_EXIST : { "isSuccess": false, "code": "POST0001", "message": "해당 게시글이 존재하지 않습니다." },
    POST_TITLE_LENGTH : { "isSuccess": false, "code": "POST0002", "message": "제목은 최대 48자리를 입력해주세요." },
    POST_LOCATION_LENGTH : { "isSuccess": false, "code": "POST0003", "message": "모임장소는 최대 24자리를 입력해주세요." },
    POST_INFORMATION_EMPTY : { "isSuccess": false, "code": "POST0004", "message": "미입력된 항목이 있습니다." },
    POST_CONTENT_LENGTH : { "isSuccess": false, "code": "POST0005", "message": "소개글은 최대 500자리를 입력해주세요." },
    POST_PARTICIPATION_AGREE_OR_ALREADY_REQUEST : { "isSuccess": false, "code": "POST0006", "message": "참여 완료이거나 이미 참여 신청을 했으므로 참여 신청을 할 수 없습니다." },
    POST_PARTICIPATION_AGREE_OR_NOT_REQUEST : { "isSuccess": false, "code": "POST0007", "message": "참여 완료이거나 참여 신청을 하지 않았으므로 참여 취소를 할 수 없습니다." },
    POST_PARTICIPATE_ALREADY_CLOSE : { "isSuccess": false, "code": "POST0008", "message": "이미 모집 마감됐습니다." },
    POST_GENDER_LIMIT: { "isSuccess": false, "code": "POST0009", "message": "성별 제한이 있습니다. 확인해 주세요." },
    UPLOADED_FILE_SIZE_EXCEED_LIMIT: { "isSuccess": false, "code": "POST0010", "message": "업로드한 이미지의 용량이 너무 큽니다." },
    POST_WAITER_LIMIT: { "isSuccess": false, "code": "POST0011", "message": "대기 인원이 다 찼습니다." },


    // 토큰 오류
    TOKEN_EMPTY : { "isSuccess": false, "code": 5000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 5001, "message":"JWT 토큰 검증 실패" },
    VERIFIED_ACCESS_TOKEN_EMPTY : { "isSuccess": false, "code": 5002, "message":"검증된 토큰이 존재하지 않습니다." },


    // 프로필 관련 오류 
    PROFILE_INFO_NOT_EXIST : { "isSuccess": false, "code": 2201, "message": "유저 프로필 정보가 존재하지 않습니다." },
    PROFILE_DEFAULT_INFO_NOT_EXIST : { "isSuccess": false, "code": 2202, "message": "유저 기본 프로필 정보가 존재하지 않습니다." },
    PROFILE_INTRO_INFO_NOT_EXIST : { "isSuccess": false, "code": 2203, "message": "유저 자기소개 프로필 정보가 존재하지 않습니다." },
    PROFILE_USER_INTRODUCTION_NOT_EXIST : { "isSuccess": false, "code": "PROFILE0001", "message": "유저 N문 N답 데이터가 존재하지 않습니다." },
    PROFILE_USER_INTRODUCTION_CREATING_DENY_CAUSE_BY_UNKNOWN_ERROR : { "isSuccess": false, "code": "PROFILE0002", "message": "유저 N문 N답 생성 중 알 수 없는 오류가 발생했습니다." },
    PROFILE_USER_INTRODUCTION_MODIFYING_DENY_CAUSE_BY_UNKNOWN_ERROR : { "isSuccess": false, "code": "PROFILE0003", "message": "유저 N문 N답 수정 중 알 수 없는 오류가 발생했습니다." },

    /** 신고 관련 MSG */
    REPORT_FAIL : {"isSuccess" : false, "code" : 6001, "message" : "신고접수를 실패하였습니다."},

    /** 검색 관련 응답 */
    SEARCH_KEYWORD_NULL : {"isSuccess" : false, "code" : 7000, "message" : "검색 키워드를 입력하지 않았습니다."},
    SEARCH_RESULT_NULL : {"isSuccess" : false, "code" : 7001, "message" : "찾으시는 검색 결과가 없습니다."},
};


/*API의 응답을 해준다*/ 
export const response = ({isSuccess, code, message}, result) => {
    return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
    }
};

export const errResponse = ({isSuccess, code, message}) => {
     return {
         isSuccess: isSuccess,
         code: code,
         message: message

       }
     }
