export const postPostResponseDTO = (Post) => {

    return {
        "생성된 post_id": Post.insertId,
        "created_at": Post.created_at
    };
    // 이 부분 아직 테스트 못해봄. Axios 에러 해결 후에 테스트 해봐야 함
}