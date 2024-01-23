/*Request에서 보낸 라우팅 처리*/

import express from 'express';
import {
    getUserIntroduction,
    postUserIntroduction, putUserIntroduction
} from "./profileController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {wrapAsync} from "../../../config/errorhandler";
const profileRouter = express.Router();

profileRouter.post('/introduction',jwtMiddleware , postUserIntroduction);
profileRouter.get('/introduction',jwtMiddleware , getUserIntroduction);
profileRouter.put('/introduction',jwtMiddleware , putUserIntroduction);

export default profileRouter;