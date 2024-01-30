import pool from '../../../config/database';
import { response, errResponse, baseResponse } from "../../../config/response";
import {createIntroduction, deleteIntroduction, selectUserIntroduction, updateIntroduction} from "./profileDao";
import {userIntroductionBodyReformattingDTO} from "./profileRequestDTO";

export const modifyUserProfile = async(user_id) => {


}

//여기서부터 새로 작성한 부분

/* N문 N답 생성 */
export const createUserIntroduction = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserIntroductionIsExist = await selectUserIntroduction(connection, userId);
    if(checkUserIntroductionIsExist[0] != null) // 생성할 대상이 이미 존재하면 생성해선 안된다.
        return false;
    const createUserIntroductionResult = await createIntroduction(connection,
        await userIntroductionBodyReformattingDTO(userId, body, 1));
    connection.release();
    return true;
}

/* N문 N답 수정 */
export const modifyUserIntroduction = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserIntroductionIsExist = await selectUserIntroduction(connection, userId);
    if(checkUserIntroductionIsExist[0] == null) // 수정할 대상이 존재하지 않으면 안된다.
        return false;
    const modifyUserIntroductionResult = await updateIntroduction(connection,
        await userIntroductionBodyReformattingDTO(userId, body, 2));
    connection.release();
    return true;
}
