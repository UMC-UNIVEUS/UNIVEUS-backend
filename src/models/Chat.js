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
        type: Number,
        ref: "Room",
    },

    },
    { timestamp: true}
);
module.exports = mongoose.model("Chat", chatSchema);