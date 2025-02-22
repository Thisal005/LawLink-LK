import multer from "multer";
import path from "path";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js"; 
import Message from "../models/message.model.js";
import { promises } from "dns";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads-chat/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
    },
});

const upload = multer({ storage: storage });


export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Validate input
        if (!message || !receiverId || !senderId) {
            return res.status(400).json({ error: "Incomplete input data" });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "User not found" });
        }

        let conversation = await Conversation.findOneAndUpdate(
            {
                participants: {
                    $all: [sender, receiver],
                },
            },
            {},
            { new: true }
        );

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message, // Store plain text message
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

// controllers/message.controller.js
export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Fetch sender and receiver
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
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

export const uploadFile = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            file: {
                fileName: file.originalname,
                mimeType: file.mimetype,
                path: file.path,
                size: file.size,
            }
        });

        await newMessage.save();

        let conversation = await Conversation.findOneAndUpdate(
            { participants: { $all: [senderId, receiverId] } },
            { $push: { messages: newMessage._id } },
            { new: true, upsert: true }
        );

        res.status(200).json(newMessage);
    } catch (err) {
        console.error("Error in uploadFile controller: ", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const downloadFile = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.senderId.toString() !== userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!message.file) {
            return res.status(404).json({ error: "File not found" });
        }

        const filePath = message.file.path;
        res.download(filePath, message.file.fileName);
    } catch (err) {
        console.error("Error in downloadFile controller: ", err.message);
        res.status(500).json({ error: err.message });
    }
};