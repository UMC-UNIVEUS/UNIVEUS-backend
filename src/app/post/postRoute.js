import express from "express"
import {handleMulterErrors, uploadImage} from '../../../config/imageUploader';
import {getPost, postPost, patchPost, deletePost, patchLike,
    requestParticipation, agreeParticipation, patchPostStatus, postOneDayAlarm,
    postImage, patchLikeCancel, cancelParticipation} from "./postController";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {wrapAsync} from "../../../config/errorhandler";

const postRouter = express.Router();

postRouter.get('/:post_id',jwtMiddleware, wrapAsync(getPost)); // 게시글(+참여자 목록) 조회
postRouter.post('/', jwtMiddleware, wrapAsync(postPost)); // 게시글 작성
postRouter.post('/image/upload',jwtMiddleware, uploadImage.array('image', 4), handleMulterErrors, postImage);
postRouter.patch('/:post_id', jwtMiddleware, wrapAsync(patchPost)); // 게시글 수정
postRouter.delete('/:post_id', jwtMiddleware, wrapAsync(deletePost)); // 게시글 삭제
postRouter.patch('/:post_id/like', jwtMiddleware, wrapAsync(patchLike)); // 게시글 좋아요
postRouter.patch('/:post_id/like/cancel', jwtMiddleware, wrapAsync(patchLikeCancel)); // 게시글 좋아요 취소

postRouter.post('/:post_id/participant/request', jwtMiddleware, wrapAsync(requestParticipation)); // 게시글 참여 신청 + 참여 신청 알람(to 작성자)
postRouter.patch('/:post_id/participant/agree', jwtMiddleware, wrapAsync(agreeParticipation)); // 게시글 참여 승인 + 참여 승인 알람(to 참여자)
postRouter.delete('/:post_id/participant/cancel', jwtMiddleware, wrapAsync(cancelParticipation)); // 게시글 참여 취소 + 참여 신청 취소 알람(to 작성장)

postRouter.patch('/:post_id/end', jwtMiddleware, wrapAsync(patchPostStatus)); // 모집 마감으로 상태 변경 API
postRouter.post('/:post_id/participant/onedayalarm', wrapAsync(postOneDayAlarm)); // 게시글 모임 1일 전 알림 API

export default postRouter;