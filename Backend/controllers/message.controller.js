import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const senderObjectId = new mongoose.Types.ObjectId(senderId);
        const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

        let conversation = await Conversation.findOneAndUpdate(
            {
                participants: {
                    $all: [senderObjectId, receiverObjectId],
                },
            },
            {},
            { new: true }
        );

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderObjectId, receiverObjectId],
            });
        }

        

        const newMessage = new Message({
            senderId: senderObjectId,
            receiverId: receiverObjectId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([newMessage.save(), conversation.save()]);

        res.status(200).json(newMessage);
    } catch (err) {
        console.error("Error in sendMessage controller:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params; 
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, id],
            },
        }).populate("messages"); 
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        res.status(200).json(conversation.messages);
    } catch (err) {
        console.error("Error in getMessages controller:", err.message);
        res.status(500).json({ error: err.message });
    }
};

