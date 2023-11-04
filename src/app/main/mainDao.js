
/** select 인기순 postList */
export const selectPopularPostList = async(connection, getPostParams) => {
    const selectPostListQuery = 
    `SELECT * FROM post WHERE category = ? ORDER BY likes DESC LIMIT ?, ?`;
    const [rows] = await connection.query(selectPostListQuery, getPostParams);

    return rows;
}

/* select 인기순 postList 쿼리문 변경 1안*/
export const selectPopularPostList$ = async(connection, getPostParams) => {
const selectPopularPostQuery =
    `SELECT post.post_id, post.title, post.limit_gender, post.content,
       location, meeting_date, current_people, limit_people,
       main_img, post_status, hidden, post.user_id, user.gender, user.nickname
    FROM post
    INNER JOIN user ON post.user_id = user.user_id
    WHERE post.category = ?
    ORDER BY likes DESC  ;`;
const [rows] = await connection.query(selectPopularPostQuery, getPostParams);
return rows;
};
/** select 최신순 postList - 업데이트용 */
// export const selectRecentlyPostList = async(connection, getPostParams) => {
//     const selectPostListQuery = 
//     `SELECT * FROM post WHERE category = ? ORDER BY created_at DESC LIMIT ?, ?`
//     const [rows] = await connection.query(selectPostListQuery, getPostParams);

//     return rows;
// }

/** select 최신순 postList - 축제용 */
export const selectRecentlyPostList = async(connection, getPostParams) => {
    const selectPostListQuery = 
    `SELECT post.*, user.profile_img, user.profile_img, user.gender, user.nickname, user.class_of
    FROM post
    INNER JOIN user ON post.user_id = user.user_id
    WHERE post.category = ?
    ORDER BY post.created_at DESC;
    `
    const [rows] = await connection.query(selectPostListQuery, getPostParams);

    return rows;
}

/* select 최신순 postList 쿼리문 변경 1안 */
export const selectRecentlyPostList$ = async(connection, getPostParams) => {
    const selectRecentlyPostQuery =
        `SELECT post.post_id, post.title, post.limit_gender, post.content,
       location, meeting_date, current_people, limit_people,
       main_img, post_status, hidden, post.user_id, user.gender, user.nickname
    FROM post
    INNER JOIN user ON post.user_id = user.user_id
    WHERE post.category = ?
    ORDER BY post.created_at DESC ;`;
    const [rows] = await connection.query(selectRecentlyPostQuery, getPostParams);

    return rows;
};

/** 카테고리 별 게시글 개수 세기 */
export const countPostsByCategory = async(connection, categoryParams) => {
    const countPostsQuery = 
    `SELECT COUNT(*) AS post_num FROM post WHERE category = ?;`
    const [rows] = await connection.query(countPostsQuery, categoryParams);

    return rows[0].post_num;
}

/** 게시글 제목 검색 */
export const findTitle = async(connection, keywordParam) => {
    const searchQuery = 
    `SELECT * FROM post WHERE title LIKE ?;`
    const [rows] = await connection.query(searchQuery, keywordParam);

    return rows;
};

/* 게시물 제목 검색 쿼리문 변경 1안 */
export const findTitle$ = async(connection, keywordParam) => {
    const searchQuery =
        `SELECT post.post_id, post.title, post.limit_gender, post.content,
       location, meeting_date, current_people, limit_people,
       main_img, post_status, hidden, post.user_id, user.gender, user.nickname
    FROM post
    INNER JOIN user ON post.user_id = user.user_id 
    WHERE title LIKE ?;`
    const [rows] = await connection.query(searchQuery, keywordParam);

    return rows;
};