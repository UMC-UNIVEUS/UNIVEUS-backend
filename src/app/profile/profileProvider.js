import pool from '../../../config/database';
import {
    selectUserInfo,
    selectUserIntroduction, selectUserMakingInfo, selectUserParticipantInfo
} from './profileDao';
import {baseResponse, response, errResponse} from "../../../config/response";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
import { formatingMeetingDate } from '../post/postProvider'
import {userProfileCheckIdExist} from "./profileRequestDTO";
import {userInfoDTO, userIntroductionDTO} from "./profileResponseDTO";

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);


//여기서 부터 새로 작성한 부분
export const retrieveUserIntroduction = async(userId, unnecessaryId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const response1 = await selectUserInfo(connection, userId);
    const response2 = await selectUserIntroduction(connection, userId);
    const userMakingNumInfo = await selectUserMakingInfo(connection, userId);
    const userParticipantNumInfo = await selectUserParticipantInfo(connection, userId);
    connection.release();

    const userInfo = await userInfoDTO(response1, userMakingNumInfo, userParticipantNumInfo);
    const userIntroduction = await userIntroductionDTO(response2);

    return {userInfo, userIntroduction};
}