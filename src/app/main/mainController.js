import {
    retrieveMainPageList,
    retrieveSearchByTitleList
} from "./mainProvider";
import {
    validationDTO
} from "./mainRequestDTO";
import {
    mainPageResponseDTO,
    SearchResponseDTO
} from "./mainResponseDTO";


/** 서비스용 메인 페이지 조회 - 카테고리 별 분류 */
export const getMainPageList = async (req, res) => {
    return res.send(await mainPageResponseDTO(await retrieveMainPageList(await validationDTO("main", req.query), req.verifiedToken.id)));
}

/** 서비스용 게시글 제목 검색 */
export const searchByTitle = async (req, res) => {
    return res.send(await SearchResponseDTO(await retrieveSearchByTitleList(await validationDTO("search", req.query), req.verifiedToken.id)));
}