import express from "express"
import {getComment,getOneComment,postComment, deleteComment} from "./commController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {wrapAsync} from "../../../config/errorhandler";
const commentRouter = express.Router();

commentRouter.get('/:post_id', jwtMiddleware, wrapAsync(getComment)); // 댓글 조회 API
commentRouter.get('/one_comment/:comments_id',jwtMiddleware, wrapAsync(getOneComment)); // 댓글 개별 조회 API
commentRouter.post('/:post_id', jwtMiddleware, wrapAsync(postComment)); // 댓글 작성 API
commentRouter.delete('/:comments_id',jwtMiddleware, wrapAsync(deleteComment)); // 댓글 삭제 API

export default commentRouter;