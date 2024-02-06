import pool from '../../../config/database';
import {
    selectUserCreateInfo,
    selectUserInfo,
    selectUserIntroduction, selectUserMakingInfo, selectuserParticipantInfo, selectUserParticipantInfo
} from './profileDao';
import {baseResponse, response, errResponse} from "../../../config/response";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
import { formatingMeetingDate } from '../post/postProvider'
import {userProfileCheckIdExist} from "./profileRequestDTO";
import {
    createInfoDTO,
    participantInfoDTO,
    userInfoDTO,
    userIntroductionDTO,
    userIntroductionExistDTO
} from "./profileResponseDTO";

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);


//여기서 부터 새로 작성한 부분
export const retrieveUserIntroduction = async(userId, unnecessaryId) => {

    const response1 = await selectUserInfo(connection, userId);
    const response2 = await selectUserIntroduction(connection, userId);
    const userMakingNumInfo = await selectUserMakingInfo(connection, userId);
    const userParticipantNumInfo = await selectUserParticipantInfo(connection, userId);
    connection.release();

    const userInfo = await userInfoDTO(response1, userMakingNumInfo, userParticipantNumInfo, response2);
    const userIntroduction = await userIntroductionDTO(response2);

    return {userInfo, userIntroduction};
}

export const retrieveUserOwnIntroduction = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const response2 = await selectUserIntroduction(connection, userId);
    connection.release();
    const introductionExist = await userIntroductionExistDTO(response2);
    const userIntroduction = await userIntroductionDTO(response2);
    return {introductionExist, userIntroduction};
}

export const retrieveUserProfileAboutUserInfo = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const response1 = await selectUserInfo(connection, userId);
    const userMakingNumInfo = await selectUserMakingInfo(connection, userId);
    const userParticipantNumInfo = await selectUserParticipantInfo(connection, userId);
    const checkIntroductionExist = await selectUserIntroduction(connection, userId);
    connection.release();

    const userInfo = await userInfoDTO(response1, userMakingNumInfo, userParticipantNumInfo, checkIntroductionExist)
    return {userInfo};
}

export const retrieveUserProfileAboutCreateInfo = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const response1 = await selectUserCreateInfo(connection, userId);
    connection.release();
    const userInfo = (await retrieveUserProfileAboutUserInfo(userId)).userInfo; // 어쩌피 내가 생성한 글이라 작성자 정보는 같아 맨 처음 한번만 보내줌.
    const createInfo = await createInfoDTO(response1);
    return {userInfo, createInfo};
}

export const retrieveUserProfileAboutParticipantInfo = async(userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const response1 = await selectuserParticipantInfo(connection, userId);
    connection.release();
    const participantInfo = await participantInfoDTO(response1);
    return {participantInfo};
}