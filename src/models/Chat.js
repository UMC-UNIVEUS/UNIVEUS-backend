import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
    chat: String,
    user: {
        id: {
            type: Number,
            ref: "User",
        },
        nickname: String,

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
    room: {
        type: mongoose.Schema.ObjectId,
        ref: "Room",
    },

    },
    {
        timestamps: true,
        versionKey: false // __v 필드 제거
    });
module.exports = mongoose.model("Chat", chatSchema);