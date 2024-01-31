export const userIntroductionBodyReformattingDTO = async(userId, body, type) => {
    const {
        q1 : personality, // 나의 MBTI는?
        q2 : food, // 나의 최애 음식은?
        q3: song, //내가 요새 듣는 노래는?
        q4: interest, // 나의 관심사는?
        q5: fit, // 이런 사람이랑 잘 맞아요.
        q6: universityLife // 대학생활동안 제일 해보고 싶은 건
    } = body;

    //이거 그냥 body.personallity, body.food 이렇게 넘겨줘도 될 거 같긴 함.

    if(type === 1) { // type 1. 생성 시
        return [
            userId,
            personality,
            food,
            song,
            interest,
            fit,
            universityLife
        ];
    }

    return [ // type 2. 수정 시
        personality,
        food,
        song,
        interest,
        fit,
        universityLife,
        userId
    ];
}

export const userProfileCheckIdExist = async(userId) => {
    if(!userId)
        userId = false;
    return userId;
}

export const userInformationBodyReformattingDTO = async(userId, body) => {
    return [
        body.nickname,
        body.user_img,
        userId
    ]
}