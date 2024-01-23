import pool from '../../../config/database';
import { response, errResponse, baseResponse } from "../../../config/response";
import {createIntroduction, deleteIntroduction} from "./profileDao";
import {userIntroductionBodyReformattingDTO} from "./profileRequestDTO";

export const modifyUserProfile = async(user_id) => {


}

//여기서부터 새로 작성한 부분

/* N문 N답 생성 */
export const createUserIntroduction = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const createUserIntroductionResult = await createIntroduction(connection,
        await userIntroductionBodyReformattingDTO(userId, body));
    connection.release();
    return true;
}

/* N문 N답 수정 */
export const modifyUserIntroduction = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    await deleteIntroduction(connection, userId);
    const modifyUserIntroductionResult = await createIntroduction(connection,
        await userIntroductionBodyReformattingDTO(userId, body));
    connection.release();
    return true;
}
