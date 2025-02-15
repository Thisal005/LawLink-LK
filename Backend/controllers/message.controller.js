import mongoose from "mongoose";
import sodium from "libsodium-wrappers";
import multer from "multer";
import path from "path";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js"; 
import Message from "../models/message.model.js";
import { json } from "stream/consumers";
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

        // Ensure libsodium is ready
        await sodium.ready;

        // Generate a nonce
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        // Replace this with your actual encryption key (must be 32 bytes)
        const key = sodium.from_hex(sender.privateKey);

        let encryptedMessage; // Declare encryptedMessage in the outer scope

        // Encrypt the message
        try {
            encryptedMessage = sodium.crypto_secretbox_easy(message, nonce, key);
        } catch (err) {
            console.error("Encryption error:", err.message);
            throw err;
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message: sodium.to_hex(encryptedMessage), // Store encrypted message as hex
            nonce: sodium.to_hex(nonce), // Store nonce as hex
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

        // Ensure libsodium is ready
        await sodium.ready;

        // Decrypt messages
        const decryptedMessages = conversation.messages.map((msg) => {
            try {
                // Use the same key used for encryption (sender's private key)
                const key = sodium.from_hex(sender.privateKey);

                // Decrypt the message
                const decryptedMessage = sodium.crypto_secretbox_open_easy(
                    sodium.from_hex(msg.message), // Encrypted message
                    sodium.from_hex(msg.nonce),  // Nonce
                    key                         // Encryption key
                );

                return {
                    ...msg.toObject(),
                    message: sodium.to_string(decryptedMessage), // Convert decrypted message to string
                };
            } catch (decryptErr) {
                console.error("Decryption error for message:", msg._id, decryptErr.message);
                return {
                    ...msg.toObject(),
                    message: "[Decryption failed]", // Handle decryption errors gracefully
                };
            }
        });

        res.status(200).json(decryptedMessages);
    } catch (err) {
        console.error("Error in getMessages controller:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const uploadFile = async (req, res) => {
    try{
        const {id : receiverId} = req.params;
        const senderId = req.user._id;
        const file = req.file;

        if (file){
            return res.status(400).json({error: "No file uploads"});
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
            { participants: { $all: [senderId, receiverId]}},
            { $push: {messages: newMessage._id}},
            { new: true, upsert: true}
        );

        res.status(200).json(newMessage);

    }
    catch{
        console.error("Error in uploadFile controller: ", err.message);
        res.status(500).json({ error: err.message });
        
    }
}

export const downloadFile = async (req, res) => {
    try{
        const {messageId} = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if(!message){
            return res.status(404).json({error: "Message not found"});
        }

        if(message.senderId.toString() !== userId){
            return res.status(401).json({error: "Unauthorized"});
        }

        if(!message.file){
            return res.status(404).json({error: "File not found"});
        }

        const encryptedFile = await promises.readFile(message.file.path);

        if(!encryptedFile){
            return res.status(404).json({error: "File not found"});
        }

        res.setHeader("Content-Type", message.file.mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${message.file.fileName}"`);
        res.send(encryptedFile);
    }
    catch(err){
        console.error("Error in downloadFile controller: ", err.message);
        res.status(500).json({ error: err.message });
    }
    
}