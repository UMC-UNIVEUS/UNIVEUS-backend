/** 유저 신고 insert */
export const insertUserReport = async(connection, insertUserReportParams) => {
    const insertUserReportQuery =  `INSERT INTO user_report (reported_user, 
        reporter, report_status) VALUES (?, ?, ?);`;
    const [insertUserReportRow] = await connection.query(insertUserReportQuery, insertUserReportParams);
    return insertUserReportRow.insertId;
}

/** 유저 신고 사유 insert */
export const insertUserReportReason = async(connection, insertUserReportReasonParams) => {
    const insertUserReportReasonQuery = `INSERT INTO user_report_reason (reason_id, report_id, additional_text) VALUES (?, ?, ?)`;
    const insertUserReportReasonRow = await connection.query(insertUserReportReasonQuery, insertUserReportReasonParams);
}

/** 게시글 신고 insert */
export const insertPostReport = async(connection, insertPostReportParam) => {
    const insertPostReportQuery =  `INSERT INTO post_reports (reported_by, reason_text, 
        post_id, report_status, reported_at, reason_category1, reason_category2
        , reason_category3, reason_category4, reason_category5) VALUES (?, ?, ?, 0, now(), ?, ?, ?, ?, ?);`;
    const [insertPostReportRow] = await connection.query(insertPostReportQuery, insertPostReportParam);
}

/** User의 report status 변경 */
export const updateUserReportStatus = async(connection, reportId, reportStatus) => {
    const updateUseReportStatusQuery = `UPDATE user_reports SET report_status = ${reportStatus} WHERE user_report_id = ${reportId};`;
    const [updateUserReportRow] = await connection.query(updateUseReportStatusQuery);
};