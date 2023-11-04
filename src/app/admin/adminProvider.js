import { selectIsAdminByUserEmail, selectUserInfoFromUser,
    selectUserReports } from "./adminDao";
import { selectUserById } from "../user/userDao"
import pool from "../../../config/database";

/** 관리자인지 확인 함수 */
export const isAdmin = async(userEmail) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const isAdminResult = await selectIsAdminByUserEmail(connection, userEmail);
    connection.release();
    if(isAdminResult == 1) return true;
    return false;
}

export const getAllUsersInfo = async() => {
    const connection = await pool.getConnection(async(conn) => conn);
    const getUsersInfoResult = await selectUserInfoFromUser(connection);
    connection.release();
    return getUsersInfoResult;
}

/** 신고 유저 확인 함수 */
export const reportsUser = async() => {
    const connection = await pool.getConnection(async(conn) => conn);
    const reportsUserResult = await selectUserReports(connection);
    
    const reporterValues = reportsUserResult.map(item => item.reported_by);
    const reportUserValues = reportsUserResult.map(item => item.report_user_id);

    const reporter = await Promise.all(
        reporterValues.map(async (item) => {
          return await selectUserById(connection, item);
        })
      );

    const reportedUser = await Promise.all(
      reportUserValues.map(async (item) => {
        return await selectUserById(connection, item);
      })
    );

    const combinedData = reportsUserResult.map((report, index) => ({
      reportsUserResult: report,
      reporter: reporter[index],
      reportedUser: reportedUser[index],
    }));

    connection.release();
    return combinedData;
}