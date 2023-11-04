import {
    selectPopularPostList,
    selectRecentlyPostList,
    countPostsByCategory,
    findTitle,
    selectRecentlyPostList$,
    selectPopularPostList$,
    findTitle$
} from "./mainDao"
import pool from "../../../config/database";
import { formatingMeetingDate } from "../post/postProvider";

/** postListPage 계산 - 업데이트용 */
// export const getPostList = async (categoryType, sortedType, page, size) => {
//     let start = 0;

//     if (page <=0) {
//         page = 1;
//     } 
//     else {
//         start = (page - 1) * size;
//     }

//     const getPostParams = [categoryType, start, size];
//     const postPage =  await getPostPage( getPostParams, sortedType);

//     return postPage;
// }


/** postListPage 계산 - 축제용 */
export const getPostList = async (categoryType, sortedType) => {
    const getPostParams = [categoryType];
    const postPage =  await getPostPage( getPostParams, sortedType);

    return postPage;
}

/** postListPage 가져오기 */
export const getPostPage = async (getPostParams, sortedType) => {
    const connection = await pool.getConnection(async conn => conn);
    if (sortedType === 0) {
        const getPostResult = await selectPopularPostList$(connection, getPostParams);
        connection.release();
         for(let i  = 0; i < getPostResult.length; i++) {
            if(getPostResult[i].meeting_date) {
                formatingMeetingDate(getPostResult[i]);
            }
        }
        return getPostResult;
    }
    else {
        const getPostResult = await selectRecentlyPostList$(connection, getPostParams);
        connection.release();
        for(let i  = 0; i < getPostResult.length; i++) {
            if(getPostResult[i].meeting_date) {
                formatingMeetingDate(getPostResult[i]);
            }
        }
        return getPostResult;
    }
}

/** postListPage 게시글 수 세기 */
export const countPosts = async (getPostParams) => {
    const connection = await pool.getConnection(async conn => conn);
    const getPostResult = await countPostsByCategory(connection, getPostParams);
    return getPostResult;
}

/** 게시글 제목 검색 */
export const searchPosts = async (keywordParam) => {
    const connection = await pool.getConnection(async conn => conn);
    const getSearchPosts = await findTitle$(connection, keywordParam);
    for(let i  = 0; i < getSearchPosts.length; i++) {
        if(getSearchPosts[i].meeting_date) {
            formatingMeetingDate(getSearchPosts[i]);
        }
    }
    return getSearchPosts;
}
