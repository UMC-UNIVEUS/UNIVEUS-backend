import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        room: String,
        members: [ // 이 방안에 들어있는 멤버들 리스트
            {
                type: Number,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false // __v 필드 제거
    });

module.exports = mongoose.model("Room", roomSchema);


// 유저도 내가 어떤 채팅방에 들어있는지 정보를 저장해야하고
// 메세지도 어느채팅방에서 전달되고있는 메세지인지 채팅방 정보를 따로 저장해줘야 하므로
// chat.js와 user.js에 room 필드를 각각 추가해준다.