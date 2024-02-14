import express from "express";
import { jwtMiddleware } from "../../../config/jwtMiddleWare";
import {getRoomDetail, getRooms, postRoom} from "./ChatController";

const chatRouter = express.Router();

chatRouter.get('/',jwtMiddleware, getRooms); // 채팅방 리스트 조회
chatRouter.get('/:room_id',jwtMiddleware, getRoomDetail); // 채팅방 개별 조회
chatRouter.post('/',jwtMiddleware, postRoom ); // 채팅방 생성
// 일단 채팅방 생성은 만들었음 (유저 id도 같이 넣어서 생성 >> 데이터그립 확인해보자.)
// 이제 room,chat의 고유 아이디가 ObjectId인걸 Int형 id로 바꿔야 함.

export default chatRouter;