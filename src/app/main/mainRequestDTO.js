export const validationDTO = async (type, requestValue) => {

    if(type === "main") {
        /* 예외 처리 */
        if (!requestValue.category) // category가 Exist 한지 판별
            return {id: "empty", category: "empty"};
        else if (requestValue.category !== "전체" && // category 값이 Valid 한지 판별
            requestValue.category !== "우주공강" && requestValue.category !== "스펙쌓기" && requestValue.category !== "취미문화" &&
            requestValue.category && "습관형성" && requestValue.category !== "취업활동" && requestValue.category !== "수업친구")
            return {id: "default", category: "empty"};

        /* 정상 처리 */
        if (!requestValue.id) // 페이징 x
            return {id: "default", category: requestValue.category};
        if (requestValue.id) // 페이징 o
            return {id: requestValue.id, category: requestValue.category};
    }

    if(type === "search") {
        /* 예외 처리 */
        if (!requestValue.searchWord)
            return {searchWord: "empty"};

        /* 정상 처리 */
        if(requestValue.searchWord) {
            if(!requestValue.id) // 페이징 x
                return {id: "default", searchWord: '%' + requestValue.searchWord + '%'};
            if(requestValue.id) // 페이징 o
                return {id: requestValue.id, searchWord: '%' + requestValue.searchWord + '%'};
        }
    }

}