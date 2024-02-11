import express from "express"
import {getMainPageList, searchByTitle,} from "./mainController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import { accountStatusMiddleware } from "../../../config/accountStatusMiddleware";
import {wrapAsync} from "../../../config/errorhandler";

const mainRouter = express.Router();

// mainRouter.use(jwtMiddleware);
// mainRouter.use(accountStatusMiddleware);

mainRouter.get('/', jwtMiddleware, getMainPageList);
mainRouter.get('/search', jwtMiddleware, searchByTitle);

export default mainRouter;