/*Request에서 보낸 라우팅 처리*/

import express from 'express';
import {
    //getUserProfile,
    //putUserProfile,
    getUserMyUnive,
    getUserParticipate, getUserProfile, postUserIntroduction
} from "./profileController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {wrapAsync} from "../../../config/errorhandler";
const profileRouter = express.Router();

//profileRouter.get('/profile/:user_id', getUserProfile);
//profileRouter.put('/profile/:user_id', putUserProfile);
profileRouter.post('/introduction',jwtMiddleware , postUserIntroduction);
profileRouter.get('/',jwtMiddleware, wrapAsync(getUserProfile));
// profileRouter.get('/myunive', jwtMiddleware, wrapAsync(getUserMyUnive));
// profileRouter.get('/participate', jwtMiddleware, wrapAsync(getUserParticipate));
// profileRouter.get('/myProfile', jwtMiddleware, wrapAsync(getUserMyUnive));
profileRouter.get('/userProfile',jwtMiddleware, wrapAsync(getUserMyUnive));

export default profileRouter;