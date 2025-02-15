import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    nonce: {
        type: String,
        required: false,
    },
    file: {
        type: {
            fileName: String,
            mimeType: String,
            path: String,
            size: Number,
        },
        required: false,
    }
    },
    {timestamps: true}
);

export default mongoose.model("Message", messageSchema);