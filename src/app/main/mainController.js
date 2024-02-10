import { baseResponse, response, errResponse } from "../../../config/response";
import {getPostList, countPosts, searchPosts, retrieveMainPageList, retrieveSearchByTitleList} from "./mainProvider";
import { getUserIdByEmail, getParticipateAvailable } from "../user/userProvider";
import { getCurrentTime, sliceTime, isMyPost, addDueDate } from "./mainService"
import {validationDTO} from "./mainRequestDTO";
import {mainPageResponseDTO, SearchResponseDTO} from "./mainResponseDTO";


/** 서비스용 메인 페이지 조회 - 카테고리 별 분류 */
export const getMainPageList = async (req, res) => {
    return res.send(await mainPageResponseDTO(await retrieveMainPageList(await validationDTO("main", req.query), req.verifiedToken.id)));
}

/** 서비스용 게시글 제목 검색 */
export const searchByTitle = async (req, res) => {
    return res.send(await SearchResponseDTO(await retrieveSearchByTitleList(await validationDTO("search", req.query), req.verifiedToken.id)));
}


/** 메인페이지 게시글 제목 검색 */
// export const searchTitle = async (req, res) => {
//     const keyword = req.query.keyword;
//     const userEmail = req.verifiedToken.userEmail;
//     const currentUserId = await getUserIdByEmail(userEmail);
//
//     if (keyword == "") {
//         return res.send(errResponse(baseResponse.SEARCH_KEYWORD_NULL));
//     }
//
//     const searchParam = "%" + keyword + "%";
//     const searchResult = await searchPosts(searchParam);
//
//     isMyPost(searchResult, currentUserId);
//
//     if (searchResult.length === 0) {
//         return res.send(errResponse(baseResponse.SEARCH_RESULT_NULL));
//     }
//
//     return res.send(response(baseResponse.SUCCESS, searchResult))
// }
