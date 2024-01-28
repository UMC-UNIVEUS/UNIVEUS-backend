import pool from '../../../config/database';
import {
    selectUserIntroduction
} from './profileDao';
import {baseResponse, response, errResponse} from "../../../config/response";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
import { formatingMeetingDate } from '../post/postProvider'

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);


//여기서 부터 새로 작성한 부분
export const retrieveUserIntroduction = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveUserInfoResult = await selectUserInfo(connection, userId);
    const retrieveUserIntroductionResult = await selectUserIntroduction(connection, userId);
    connection.release();
    return {retrieveUserInfoResult, retrieveUserIntroductionResult};
}