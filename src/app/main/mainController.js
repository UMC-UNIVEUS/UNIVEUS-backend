import { baseResponse, response, errResponse } from "../../../config/response";
import { getPostList, countPosts, searchPosts } from "./mainProvider";
import { getUserIdByEmail, getParticipateAvailable } from "../user/userProvider";
import { getCurrentTime, sliceTime, isMyPost, addDueDate } from "./mainService"


/**메인페이지 카테고리 & 인기순 & 최신순 조회 - 업데이트용  */
// export const getPostListPage = async (req, res) => {
//     const categoryType = parseInt(req.query.category); // 0: 친구만들기, 1: 스터디, 2: 취미모임, 3: 밥 같이먹기
//     const sortedType = parseInt(req.query.sorted); // 0: 인기순 1: 최신순
//     const page = parseInt(req.query.page);

//     const postPageResult = await getPostList(categoryType, sortedType, page, 9);
//     const postsNum = await countPosts(categoryType);

//     return res.status(200).json(response(baseResponse.SUCCESS, { postPageResult, postsNum }));
// }

/**메인페이지 카테고리 & 인기순 & 최신순 조회 - 축제용 */
export const getPostListPage = async (req, res) => {
    const userEmail = req.verifiedToken.userEmail;
    const currentUserId = await getUserIdByEmail(userEmail);
    const postPageResult = await getPostList(4, 1);
    const currentTime = sliceTime(getCurrentTime());

    isMyPost(postPageResult, currentUserId);
    addDueDate(postPageResult,currentTime);
    const participate_available  = await getParticipateAvailable(currentUserId);

    return res.send(response(baseResponse.SUCCESS, { participate_available, postPageResult },));
}

/** 메인페이지 게시글 제목 검색 */
export const searchTitle = async (req, res) => {
    const keyword = req.query.keyword;
    const userEmail = req.verifiedToken.userEmail;
    const currentUserId = await getUserIdByEmail(userEmail);

    if (keyword == "") {
        return res.send(errResponse(baseResponse.SEARCH_KEYWORD_NULL));
    }

    const searchParam = "%" + keyword + "%";
    const searchResult = await searchPosts(searchParam);

    isMyPost(searchResult, currentUserId);

    if (searchResult.length === 0) {
        return res.send(errResponse(baseResponse.SEARCH_RESULT_NULL));
    }

    return res.send(response(baseResponse.SUCCESS, searchResult))
}
