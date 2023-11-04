import express from "express";
import { reportUser, reportPost } from "./reportController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import { accountStatusMiddleware } from "../../../config/accountStatusMiddleware";
import {wrapAsync} from "../../../config/errorhandler";

const reportRouter = express.Router();

reportRouter.use(jwtMiddleware);
// reportRouter.use(accountStatusMiddleware);

reportRouter.post("/user", wrapAsync(reportUser));
reportRouter.post("/post", wrapAsync(reportPost));

export default reportRouter;