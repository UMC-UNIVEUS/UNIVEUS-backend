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

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);


//여기서 부터 새로 작성한 부분
export const retrieveUserIntroduction = async(userId, unnecessaryId) => {
    // if(await userProfileCheckIdExist(userId) === false)
    //     userId = "exception01";
    //     return userId;
    const connection = await pool.getConnection(async (conn) => conn);
    const userInfo = await selectUserInfo(connection, userId);
    const userMakingNumInfo = await selectUserMakingInfo(connection, userId);
    const userParticipantNumInfo = await selectUserParticipantInfo(connection, userId);
    const userIntroduction = await selectUserIntroduction(connection, userId);
    connection.release();
    return {userInfo, userIntroduction, userMakingNumInfo, userParticipantNumInfo};
}