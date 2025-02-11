import mongoose from "mongoose";
import sodium from "libsodium-wrappers";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js"; // Adjust the path as needed
import Message from "../models/message.model.js";

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

