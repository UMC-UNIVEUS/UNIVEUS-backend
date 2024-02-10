import express from "express"
import {getMainPageList, searchTitle} from "./mainController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import { accountStatusMiddleware } from "../../../config/accountStatusMiddleware";
import {wrapAsync} from "../../../config/errorhandler";

const mainRouter = express.Router();

// mainRouter.use(jwtMiddleware);
// mainRouter.use(accountStatusMiddleware);

mainRouter.get('/', jwtMiddleware, getMainPageList);
mainRouter.get('/search', wrapAsync(searchTitle));

export default mainRouter;