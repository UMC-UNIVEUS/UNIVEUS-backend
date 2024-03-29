import { baseResponse, response } from "../../../config/response";
import { getUserIdByEmail } from "../user/userProvider";
import { createUserReport, createPostReport, createUserReportReason } from "./reportService"
import {sendPostReportAlarm} from "../user/userController"


/** 유저 신고하기 API */
export const reportUser = async(req, res) => {
    const reportReason = req.body.reportReason;
    const reportReasonText = req.body.reportReasonText;
    const reportedUser = req.body.reportedUser;
    const reporter = req.verifiedToken.userId;
    const reportUserResult = await createUserReport(reportedUser, reporter)
    const reportUserReasonResult = await createUserReportReason(reportUserResult, reportReasonText, reportReason);

    res.send(response(baseResponse.SUCCESS));
};

/** post 신고하기 API */
export const reportPost = async(req, res) => {
    const reportReasons = req.body.reportReasons;
    const reportReasonText = req.body.reportReasonText;
    const reportedPost = req.body.reportedPost;
    const reportedBy = await getUserIdByEmail(req.verifiedToken.userEmail);

    const reportPostResult = await createPostReport(reportReasonText, reportedBy, reportedPost, reportReasons);
    await sendPostReportAlarm(reportedBy, reportedPost); // 게시글 신고 알림 (to 관리자)
    res.send(response(baseResponse.REPORT_SUCCESS));
}