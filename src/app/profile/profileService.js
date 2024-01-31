import pool from '../../../config/database';
import { response, errResponse, baseResponse } from "../../../config/response";
import {
    createIntroduction,
    selectUserInfo,
    selectUserIntroduction, updateInformation,
    updateIntroduction
} from "./profileDao";
import {userInformationBodyReformattingDTO, userIntroductionBodyReformattingDTO} from "./profileRequestDTO";


/* N문 N답 생성 */
export const createUserIntroduction = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserIntroductionIsExist = await selectUserIntroduction(connection, userId);
    if(checkUserIntroductionIsExist[0] != null) { // 생성할 대상이 이미 존재하면 생성해선 안된다.
        connection.release();
        return false;
    }
    const createUserIntroductionResult = await createIntroduction(connection,
        await userIntroductionBodyReformattingDTO(userId, body, 1));
    connection.release();
    return true;
}

/* N문 N답 수정 */
export const modifyUserIntroduction = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserIntroductionIsExist = await selectUserIntroduction(connection, userId);
    if(checkUserIntroductionIsExist[0] == null) {// 수정할 대상이 존재하지 않으면 안된다.
        connection.release();
        return false;
    }
    const modifyUserIntroductionResult = await updateIntroduction(connection,
        await userIntroductionBodyReformattingDTO(userId, body, 2));
    connection.release();
    return true;
}

export const modifyUserInformation = async(userId, body) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserInformationIsExist = await selectUserInfo(connection, userId);
    if(checkUserInformationIsExist[0] == null) { // 수정할 대상이 존재하지 않으면 안된다.
        connection.release();
        return false;
    }
    const modifyUserInformationResult = await updateInformation(connection, await userInformationBodyReformattingDTO(userId, body));
    connection.release();
    return true;
}
