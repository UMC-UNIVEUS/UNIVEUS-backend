import pool from '../../../config/database';
import {
    selectPostEndDate,
    selectUserbyId,
    selectUserDefaultProfilebyId,
    selectUserIntroProfilebyId,
    selectUserMyUnivebyId,
    selectUserParticipatebyId,
    selectPostbyId,
    selectUserProfilebyId
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

export const userIdCheck = async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdCheckResult = selectUserbyId(connection, user_id);
    connection.release();
    return userIdCheckResult;
};

export const postIdCheck = async(post_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const postIdCheckResult = selectPostbyId(connection, post_id);
    connection.release();
    return postIdCheckResult;
};

// 프로필 화면에서 상단에 위치하는 유저 기본 정보 프로필 내용을 불러오는 API
/* export const showUserDefaultProfile= async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const showUserDefaultProfileResult = await selectUserDefaultProfilebyId(connection, user_id);
    connection.release();
    if(showUserDefaultProfileResult[0]) {
        return showUserDefaultProfileResult[0];
    } else {
        return errResponse(baseResponse.PROFILE_INFO_NOT_EXIST);
    }
}; */


// 프로필 화면에서 하단에 위치하는 유저 소개 정보 프로필 내용을 불러오는 API
/* export const showUserIntroProfile = async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const showUserIntroProfileResult = await selectUserIntroProfilebyId(connection, user_id);
    connection.release();
    if(showUserIntroProfileResult[0]) {
        return showUserIntroProfileResult[0];
    } else {
        return errResponse(baseResponse.PROFILE_INFO_NOT_EXIST);
    }
};*/

export const showUserMyUnive = async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const showUserMyUniveResult = await selectUserMyUnivebyId(connection, user_id);

    if(showUserMyUniveResult[0][0]) {
        for (let i = 0; i < showUserMyUniveResult[0].length; i++) {
             //학번 변경
             if(showUserMyUniveResult[0][i].class_of) {
                 const changeClassof = Math.floor(showUserMyUniveResult[0][i].class_of / 100000 % 100);
                 showUserMyUniveResult[0][i].class_of = changeClassof + "학번"
             }

             //모임 시간 변경
             if(showUserMyUniveResult[0][i].meeting_date) {
                formatingMeetingDate(showUserMyUniveResult[0][i])
             }

            /*
             //D-day 계산
             if(postInfo[0][0].end_date) {
                 const nowDate = dayjs(); // 현재 시간
                 const endDate = dayjs(postInfo[0][0].end_date); // 마감 시간
                 const diffDate = endDate.diff(nowDate); // 마감 시간 - 현재 시간
                 const d = dayjs.duration(diffDate);
                 const checkminus = d.milliseconds();
                 // 마감 시간 - 현재 시간이 음수 = 이미 종료된 모임
                 if (checkminus <= 0)
                     myunivedata[i].d_day = "종료";
                 else {
                     if (d.days() > 0)
                         myunivedata[i].d_day = "D-" + d.days();
                     else
                         myunivedata[i].d_day = "D-" + "DAY"
                 }
             }*/
         }
        connection.release();
        return showUserMyUniveResult[0];
    } else {
        connection.release();
        return errResponse(baseResponse.PROFILE_INFO_NOT_EXIST);
    }
};

export const showUserParticipate = async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const showUserParticipateResult = await selectUserParticipatebyId(connection, user_id);

    if(showUserParticipateResult[0][0]) {
        for (let i = 0; i < showUserParticipateResult[0].length; i++) {
            //학번 변경
            if (showUserParticipateResult[0][i].class_of) {
                const changeClassof = Math.floor(showUserParticipateResult[0][i].class_of / 100000 % 100);
                showUserParticipateResult[0][i].class_of = changeClassof + "학번"
            }

            //모임 시간 변경
            if (showUserParticipateResult[0][i].meeting_date) {
                formatingMeetingDate(showUserParticipateResult[0][i]);
            }

/*
            //D-day 계산
            if(postInfo[0][0].end_date) {
                const nowDate = dayjs(); // 현재 시간
                const endDate = dayjs(postInfo[0][0].end_date) // 마감 시간
                const diffDate = endDate.diff(nowDate);  // 마감 시간 - 현재 시간
                const d = dayjs.duration(diffDate);
                const checkminus = d.milliseconds();
                // 마감 시간 - 현재 시간이 음수 = 이미 종료된 모임
                if (checkminus <= 0)
                    showUserParticipateResult[0][i].d_day = "종료";
                else {
                    if (d.days() > 0)
                        showUserParticipateResult[0][i].d_day = "D-" + d.days();
                    else
                        showUserParticipateResult[0][i].d_day = "D-" + "DAY"
                }
            }*/
        }
        connection.release();
        return showUserParticipateResult[0];
    } else {
        connection.release();
        return errResponse(baseResponse.PROFILE_INFO_NOT_EXIST);
    }
};


export const showUserProfile = async(user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const showUserProfileResult = await selectUserProfilebyId(connection, user_id);

    const changeClassof = Math.floor(showUserProfileResult[0].class_of / 100000 % 100);
    showUserProfileResult[0].class_of = changeClassof + "학번"
    connection.release();
    return showUserProfileResult[0];
};
