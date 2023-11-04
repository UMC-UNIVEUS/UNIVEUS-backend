import express from "express";
import{ getUsersInfo, postPostByAdmin, patchPostByAdmin, 
    deletePostByAdmin, patchStatusByAdmin, patchHiddenByAdmin,
    adminSignUp, userReports, postReports, adminHomePage, userHomePage, 
    adminSignUpPage,adminUserBlockPage, adminUserBlock, adminUserBlockFree, 
    adminLoginPage,
    adminLogin} from "./adminController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import { adminMiddleware } from "../../../config/adminMiddleware";
import {wrapAsync} from "../../../config/errorhandler";


const adminRouter = express.Router();

adminRouter.use(wrapAsync(jwtMiddleware));
adminRouter.use(wrapAsync(adminMiddleware));

// adminRouter.get('/', adminHomePage);
adminRouter.post('/post', wrapAsync(postPostByAdmin)); // 게시글 작성
adminRouter.patch('/post/:post_id', wrapAsync(patchPostByAdmin)); // 게시글 수정
adminRouter.delete('/post/:post_id', wrapAsync(deletePostByAdmin)); // 게시글 삭제
adminRouter.patch('/post/:post_id/status', wrapAsync(patchStatusByAdmin)); // 게시글 상태 변경
adminRouter.patch('/post/:post_id/hidden', wrapAsync(patchHiddenByAdmin)); // 게시글 공개, 비공개 설정

adminRouter.post('/user/signup', wrapAsync(adminSignUp));
// adminRouter.get('/user/signup', adminSignUpPage)

adminRouter.get('/user/info', wrapAsync(getUsersInfo));
adminRouter.get('/user/reports', wrapAsync(userReports)); // 신고 유저 확인
// adminRouter.get('/user', userHomePage); 
adminRouter.get('/post-reports', wrapAsync(postReports));

// adminRouter.get('/user/block/:reportId/:userId', adminUserBlockPage);
adminRouter.put('/user/block/:reportId/:userId', wrapAsync(adminUserBlock)); //유저 제재
adminRouter.patch('/user/block/free/:reportedId/:userId', wrapAsync(adminUserBlockFree)); // 제재 해제

// adminRouter.get('/login', adminLoginPage);
adminRouter.post('/login', wrapAsync(adminLogin));

export default adminRouter;