import mongoose from "mongoose";
import { type } from "os";

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
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
        required: false,
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
    },
    isRead: {
        type : Date,
    },
    status:{
        type: String,
        enum : ["sent", "delivered", "read"],
        default: "sent",}
},
    {timestamps: true}
);

export default mongoose.model("Message", messageSchema);