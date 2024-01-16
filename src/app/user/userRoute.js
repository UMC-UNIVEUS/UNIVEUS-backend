import express from "express"
import {sendAuthNumber, login, 
    verifyNumber, checkNickNameDuplicate, registerAffiliation,
    getAlarms, patchAlarms, agreementTerms, registerUserProfile} from "./userController"
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import { accountStatusMiddleware } from "../../../config/accountStatusMiddleware";
import {wrapAsync} from "../../../config/errorhandler";

const userRouter = express.Router();

userRouter.post('/login', wrapAsync(login));
userRouter.post('/send/number', wrapAsync(sendAuthNumber));
userRouter.post('/auth/number', jwtMiddleware, wrapAsync(verifyNumber));
userRouter.post('/nickname/check', wrapAsync(checkNickNameDuplicate));
userRouter.post('/register/affiliation', jwtMiddleware, wrapAsync(registerAffiliation));
userRouter.get('/:user_id/alarm', jwtMiddleware, wrapAsync(accountStatusMiddleware), wrapAsync(getAlarms)); // 알림 내역 조회 API
userRouter.patch('/:user_id/alarm', jwtMiddleware, wrapAsync(accountStatusMiddleware), wrapAsync(patchAlarms)); // 알림 확인 API
userRouter.post('/agreement', jwtMiddleware, agreementTerms);
userRouter.post('/register/profile', jwtMiddleware, registerUserProfile);

export default userRouter;
