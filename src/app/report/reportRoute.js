import express from "express";
import { reportUser, reportPost } from "./reportController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import { accountStatusMiddleware } from "../../../config/accountStatusMiddleware";
import {wrapAsync} from "../../../config/errorhandler";

const reportRouter = express.Router();

reportRouter.use(jwtMiddleware);

reportRouter.post("/user", reportUser);
reportRouter.post("/post", wrapAsync(reportPost));

export default reportRouter;