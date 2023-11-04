/** 유저 신고 insert */
export const insertUserReport = async(connection, insertUserReportParams) => {
    const insertUserReportQuery =  `INSERT INTO user_reports (reported_by, reason_text, 
        report_user_id, report_status, reported_at, reason_category1, reason_category2
        , reason_category3, reason_category4, reason_category5) VALUES (?, ?, ?, 0, now(), ?, ?, ?, ?, ?);`;
    const [insertUserReportRow] = await connection.query(insertUserReportQuery, insertUserReportParams);
}

/** 유저 신고 사유 insert */
export const insertUserReportReason = async(connection, insertUserReportReasonParams) => {
    const insertUserReportReasonQuery = `INSERT INTO user_report_reasons (report_reason, user_report_id) VALUES (?, ?)`;
    const insertUserReportReasonRow = await connection.query(insertUserReportReasonQuery, insertUserReportReasonParams);
    return insertUserReportReasonRow;
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