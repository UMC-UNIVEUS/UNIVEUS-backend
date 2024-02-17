import {baseResponse, response} from "../../../config/response";
import {createMessage, createRoom, retrieveRooms} from "./ChatService";

/**
 * API name : 채팅방 리스트 조회
 * GET: /chat
 */
export const getRooms = async(req, res) => {

    const userIdFromJWT = req.verifiedToken.userId;

    const getRoomsResult = await retrieveRooms(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, getRoomsResult));

}


/**
 * API name : 채팅방 개별 조회
 * GET: /chat/{room_id}
 */
export const getRoomDetail = async(req, res) => {

    const {room_id} = req.params;
    const userIdFromJWT = req.verifiedToken.userId;

}

/**
 * API name : 채팅방 생성
 * POST: /chat
 */
export const postRoom = async (req,res) => {

    const {usersId, title} = req.body;
    const postRoomResult = await createRoom(usersId, title);

    return res.send(response(baseResponse.SUCCESS, postRoomResult));
}

/**
 * API name : 메시지 생성
 */
export const postMessage = async (message,room_id,user) => {

    const postRoomResult = await createMessage(message, room_id,user);

}