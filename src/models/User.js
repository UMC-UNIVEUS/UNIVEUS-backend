import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
//Schema는 내가 받을 데이터가 이렇게 생겼다~ 라는 정보를 담아둔 설계도라 보면 된다.

    id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, "User must type name"],
        unique: true,
    },

    gender:{
        type: String,
    },

    student_id:{ // 학번
        type: String,
    },

    major: { // 학과
        type: String,
    },

    room: {
        type: Number,
        ref: "Room",
    },
});
module.exports = mongoose.model("User", userSchema);