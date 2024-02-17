import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
//Schema는 내가 받을 데이터가 이렇게 생겼다~ 라는 정보를 담아둔 설계도라 보면 된다.

    id: {
        type: Number,
        required: true,
    },
    nickname: {
        type: String,
        unique: true,
    },

    gender: {
        type: String,
    },

    student_id: { // 학번
        type: String,
    },

    major: { // 학과
        type: String,
    },

    user_img: {
        type: String,
    },

    },
    {
        timestamps: true,
        versionKey: false // __v 필드 제거
    });
module.exports = mongoose.model("User", userSchema);