/*Request에서 보낸 라우팅 처리*/

import express from 'express';
import {
    getUserIntroduction,
    getUserProfileAboutUserInfo,
    getUserProfileAboutCreateInfo,
    getUserProfileAboutParticipantInfo,
    postUserIntroduction,
    putUserIntroduction
} from "./profileController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {wrapAsync} from "../../../config/errorhandler";
const profileRouter = express.Router();

profileRouter.get('/userInfo',jwtMiddleware , getUserProfileAboutUserInfo);
profileRouter.get('/createInfo',jwtMiddleware , getUserProfileAboutCreateInfo);
profileRouter.get('/participantInfo',jwtMiddleware , getUserProfileAboutParticipantInfo);
profileRouter.get('/introduction/:id',jwtMiddleware , wrapAsync(getUserIntroduction));
profileRouter.post('/introduction',jwtMiddleware , wrapAsync(postUserIntroduction));
profileRouter.put('/introduction',jwtMiddleware , wrapAsync(putUserIntroduction));

export default profileRouter;