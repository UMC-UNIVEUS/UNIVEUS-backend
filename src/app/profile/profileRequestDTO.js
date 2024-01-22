export const userIntroductionBodyReformattingDTO = async(userId, body) => {
    const {
        q1 : personality, // 나의 MBTI는?
        q2 : food, // 나의 최애 음식은?
        q3: song, //내가 요새 듣는 노래는?
        q4: interest, // 나의 관심사는?
        q5: fit, // 이런 사람이랑 잘 맞아요.
        q6: universityLife // 대학생활동안 제일 해보고 싶은 건
    } = body;

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