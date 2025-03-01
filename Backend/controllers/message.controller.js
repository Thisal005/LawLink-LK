import multer from "multer";
import path from "path";
import fs from "fs";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js"; 
import Lawyer from "../models/lawyer.model.js";
import Message from "../models/message.model.js";
import { promises } from "dns";


export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Check if either message or files are provided
        if ((!message || message.trim() === '') && (!req.files || req.files.length === 0)) {
            return res.status(400).json({ error: "Message or documents are required" });
        }

        if (!receiverId || !senderId) {
            return res.status(400).json({ error: "Sender and receiver IDs are required" });
        }

        const sender = await User.findById(senderId) || await Lawyer.findById(senderId);
        const receiver = await User.findById(receiverId) || await Lawyer.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "User not found" });
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Prepare document data if files are uploaded
        const documentData = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        })) : [];

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message: message || "", // Handle empty message case
            documents: documentData
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
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Fetch sender and receiver
        const sender = await User.findById(senderId) || await Lawyer.findById(senderId);
        const receiver = await User.findById(receiverId) || await Lawyer.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate({
            path: "messages",
            options: { sort: { createdAt: 1 } } // Sort messages by creation time
        });

        if (!conversation) {
            return res.status(200).json([]); // Return empty array if no conversation found
        }

        res.status(200).json(conversation.messages);
    } catch (err) {
        console.error("Error in getMessages controller:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const downloadDocument = async (req, res) => {
    try {
        const { messageId, documentIndex } = req.params;
        
        // Verify the user has access to this message
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        
        // Check if the user is either the sender or receiver of the message
        const userId = req.user._id.toString();
        if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }
        
        // Check if the document exists
        if (!message.documents || !message.documents[documentIndex]) {
            return res.status(404).json({ error: "Document not found" });
        }
        
        const document = message.documents[documentIndex];
        const filePath = document.path;
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found on server" });
        }
        
        // Set the appropriate headers
        res.setHeader('Content-Disposition', `attachment; filename="${document.originalname}"`);
        res.setHeader('Content-Type', document.mimetype);
        
        // Create read stream and pipe to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (err) {
        console.error("Error in downloadDocument controller:", err.message);
        res.status(500).json({ error: err.message });
    }
};