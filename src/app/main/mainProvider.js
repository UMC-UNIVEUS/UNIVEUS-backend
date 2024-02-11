import {
    selectMainPageNotPaging,
    selectMainPage,
    selectPostByTitle
} from "./mainDao"
import pool from "../../../config/database";
import {
    selectPost
} from "../post/postDao";


/** 메인페이지 글 불러오기 */
export const retrieveMainPageList = async (queryValue, unnecessaryId) => {
    //userId가 unnecessaryId인 이유는 아직 차단 기능 구현 안해서다. 차단하면 글이 보이지 않도록 추가하려면 나중에 쓴다.

    // //0. 페이징 처리를 위한 id가 올바르지 않음.
    // if(queryValue.id === "inValid")
    //     return [{ Exception : "inValidIdForPaging" }];

    //1. 예외처리. 쿼리로 카테고리 못받아옴
    if(queryValue.category === "empty")
        return [{ Exception : "inValidCategory" }];

    //2. 페이징 x
    else if(queryValue.id === "default") {
        const connection = await pool.getConnection(async conn => conn);
        const getMainPageList = await selectMainPageNotPaging(connection, queryValue.category);
        connection.release();
        return getMainPageList;
    }

    //3. 페이징 처리
    else {
        const connection = await pool.getConnection(async conn => conn);
        const IsPostExist = await selectPost(connection, queryValue.id);
        if(IsPostExist[0] == null) {
            connection.release();
            return [{ Exception : "inValidIdForPaging" }];
        }
        const getMainPageList = await selectMainPage(connection, [
            queryValue.category,
            queryValue.id
        ]);
        connection.release();
        if(getMainPageList[0] == null)
            return [{ Exception : "NoLeftPostForPaging"}];
        return getMainPageList;
    }
}

/** 게시글 제목 검색 */
export const retrieveSearchByTitleList = async (queryValue, unnecessaryId) =>  {

    //1. 예외 처리
    if(queryValue.searchWord === "empty")
        return [{ Exception : "SearchWordEmpty" }];

    //2. 페이징 x
    else if(queryValue.id === "default") {
        const connection = await pool.getConnection(async conn => conn);
        const getSearchPost = await selectPostByTitle(connection, [queryValue.searchWord]);
        connection.release();
        return getSearchPost;
    }

    //3. 페이징 처리
    else {
        const connection = await pool.getConnection(async conn => conn);
        const IsPostExist = await selectPost(connection, queryValue.id);
        if(IsPostExist[0] == null) {
            connection.release();
            return [{ Exception : "inValidIdForPaging" }];
        }
        const getSearchPost = await selectPostByTitle(connection, [
            queryValue.searchWord,
            queryValue.id
        ]);
        connection.release();
        if(getSearchPost[0] == null)
            return [{ Exception : "NoLeftPostForPaging"}];
        return getSearchPost;
    }
}
