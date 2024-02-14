import Room from "../../models/Room";
import User from "../../models/User";

export const retrieveRooms = async(userIdFromJWT) =>{


    const user = User.findById(1);
    console.log(user);

    //const roomList = await User.
    //return roomList;
};


export const createRoom = async (users) => { // 채팅방 생성
    await Room.insertMany([
        {
            room: "테스트 단톡방",
            members: users
        }
    ]);
}