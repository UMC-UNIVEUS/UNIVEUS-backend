import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
    chat: String,
    user: {
        id: {
            type: Number,
            ref: "User",
        },
        name: String,
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