import mongoose from "mongoose";

// models/conversation.model.js
const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
        required: false,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],
        },
    ],
});

export default mongoose.model("Conversation", conversationSchema);