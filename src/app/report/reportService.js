import { insertUserReport, insertPostReport, updateUserReportStatus, insertUserReportReason } from "./reportDao"
import pool from "../../../config/database"

/** User Report 생성 */
export const createUserReport = async(reportedUser, reporter) => {
    const connection = await pool.getConnection(async conn => conn);
    const insertUserReportParam = [reportedUser, reporter, "UNCONFIRMED"];
    const reportUserResult = await insertUserReport(connection, insertUserReportParam);
    connection.release();
    return reportUserResult;
};

/** User Report Reason 생성*/
export const createUserReportReason = async(userReportId, additionalText, reportReason) => {
    const connection = await pool.getConnection(async conn => conn);
    let insertUserReportReasonParam;

    for (let i = 0; i < reportReason.length; i++) {
        if (reportReason[i] == "checked") {
            insertUserReportReasonParam = [i + 1, userReportId, null];

            // 기타가 체크되어있을 경우
            if (i == 4) {
                insertUserReportReasonParam[2] = additionalText;
                await insertUserReportReason(connection, insertUserReportReasonParam);
            }
            else {
                await insertUserReportReason(connection, insertUserReportReasonParam);
            }
        }
    }
    connection.release();
};

/** Post Report 생성 */
export const createPostReport = async(reportReasonText, reportedBy, reportedPost, reportReasons) => {
    const connection = await pool.getConnection(async conn => conn);
    const insertPostReportParam = [reportedBy, reportReasonText, reportedPost];

    for (let i = 0; i < reportReasons.length; i++) {
        insertPostReportParam.push(reportReasons[i]);
    }

    const reportPostResult = await insertPostReport(connection, insertPostReportParam);
    connection.release();
};

/** User의 Report Satus 변경 */
export const changeUserReportStatus = async(reportId, reportStatus) => {
    const connection = await pool.getConnection(async conn => conn);
    const changeUserReportResult = await updateUserReportStatus(connection, reportId, reportStatus);
    connection.release();
}