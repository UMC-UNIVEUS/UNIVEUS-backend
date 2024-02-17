import Room from "../../models/Room";
import User from "../../models/User"
import Chat from "../../models/Chat"
import {getUserById} from "../user/userProvider";

export const retrieveRooms = async(userIdFromJWT) =>{

    const roomList = await Room.find({members: userIdFromJWT});
    // 가장 최신 채팅 내역도 반환해야함 (채팅방 리스트 조회 피그마 참고)

    return roomList;
};


export const createRoom = async (usersId, title) => { // 채팅방 생성 + 유저 정보 저장
    //채팅방 생성하면서 유저도 생성해줘야 함. 이때 채팅방 조회에서 필요한 모든 정보를 몽고DB에도 저장해둠.

    const roomResult = await Room.insertMany([
        {
            room: title,
            members: usersId,
            createdAt: await getCurrentDate(),
            updatedAt: await getCurrentDate(),
        }
    ]);

    for(let i=0; i< usersId.length; i ++){
        const user = await getUserById(usersId[i]);
        console.log(user);

        let id = user.id;
        let nickname = user.nickname;
        let gender = user.gender;
        let student_id = user.student_id;
        let major = user.major;
        let user_img = user.user_img;

        await User.insertMany([
            {
                id: id,
                nickname: nickname,
                gender: gender,
                student_id: student_id,
                major: major,
                user_img: user_img,
                createdAt: await getCurrentDate(),
                updatedAt: await getCurrentDate(),
            }
        ]);
    }

}

export const createMessage = async (message, room_id,user) => { // 채팅 전송

    const newMessage = new Chat({
        chat:message,
        user:{
            id:user.id
        },
        room: room_id, // 메세지에 채팅방 정보도 저장
        createdAt: await getCurrentDate(),
        updatedAt: await getCurrentDate()
    });
}

const getCurrentDate = async()  => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}