export const validationDTO = async (requestValue) => {

    /* 예외 처리 */
    if(!requestValue.category) // category가 Exist 한지 판별
        return {id : "empty", category : "empty"};
    else if(requestValue.category !== "전체" && // category 값이 Valid 한지 판별
        requestValue.category !== "우주공강" && requestValue.category !== "스펙쌓기" && requestValue.category !== "취미문화" &&
        requestValue.category && "습관형성" && requestValue.category !== "취업활동" && requestValue.category !== "수업친구")
            return {id: "default", category: "empty"};
    // if(requestValue.id) { // 쿼리로 숫자를 받아오면 String으로 받아와서 숫자 예외 처리가 안됨.
    //     console.log(requestValue.id);
    //     console.log(typeof requestValue.id);
    //     if(typeof requestValue.id !== 'number')
    //         return {id : "inValid", category : requestValue.category};
    // }

    /* 정상 처리 */
    if(!requestValue.id) // 페이징 처리에 필요한 id가 없음(페이징 안함)
        return {id : "default", category : requestValue.category};
    return {id : requestValue.id, category : requestValue.category};
}