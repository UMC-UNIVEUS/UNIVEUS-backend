import {baseResponse, errResponse, response} from "../../../config/response";
import {formatingMeetingDate} from "../post/postProvider";
import {calculateStudentId} from "../profile/profileResponseDTO";

export const mainPageResponseDTO = async (mainPageResponse) => {

    /* provider에서 예외처리를 한 경우를 식별 */
    if(mainPageResponse[0] != null) {
        if (mainPageResponse[0].Exception) {
            if (mainPageResponse[0].Exception === "inValidCategory")
                return errResponse(baseResponse.MAIN_CATEGORY_IS_NOT_INVALID);
            if (mainPageResponse[0].Exception === "inValidIdForPaging")
                return errResponse(baseResponse.MAIN_PAGING_ID_IS_NOT_VALID);
            if (mainPageResponse[0].Exception === "etc")
                return errResponse(baseResponse.MAIN_UNKNOWN_ERROR);
        }
    }

    /* 정상 처리 */
    for(let i = 0; i < mainPageResponse.length; i++) {
        if(mainPageResponse[i].meeting_datetime)
            await formatingMeetingDate(mainPageResponse[i]);
        if(mainPageResponse[i].student_id)
            mainPageResponse[i].student_id = await calculateStudentId(mainPageResponse[i].student_id);
    }
    return response(baseResponse.SUCCESS, mainPageResponse);

}