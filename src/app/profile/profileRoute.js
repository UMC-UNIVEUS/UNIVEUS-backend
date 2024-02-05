/*Request에서 보낸 라우팅 처리*/

import express from 'express';
import {
    getUserIntroduction,
    getUserProfileAboutUserInfo,
    getUserProfileAboutCreateInfo,
    getUserProfileAboutParticipantInfo,
    postUserIntroduction,
    putUserIntroduction,
    putUserInformation,
    getUserOwnedIntroduction
} from "./profileController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {wrapAsync} from "../../../config/errorhandler";
const profileRouter = express.Router();

profileRouter.get('/userInfo',jwtMiddleware , wrapAsync(getUserProfileAboutUserInfo));
profileRouter.get('/createInfo',jwtMiddleware , wrapAsync(getUserProfileAboutCreateInfo));
profileRouter.get('/participantInfo',jwtMiddleware , wrapAsync(getUserProfileAboutParticipantInfo));
profileRouter.get('/introduction/:id',jwtMiddleware , wrapAsync(getUserIntroduction));
profileRouter.get('/mypage/introduction',jwtMiddleware , wrapAsync(getUserOwnedIntroduction));
profileRouter.post('/introduction',jwtMiddleware , wrapAsync(postUserIntroduction));
profileRouter.put('/introduction',jwtMiddleware , wrapAsync(putUserIntroduction));
profileRouter.put('/mypage',jwtMiddleware , wrapAsync(putUserInformation));

export default profileRouter;