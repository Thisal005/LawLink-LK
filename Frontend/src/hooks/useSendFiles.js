import { useState, useContext } from "react";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

const useSendFiles = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { backendUrl, userData, lawyerData } = useContext(AppContext);

    // Generate a unique ID for optimistic updates
    const generateTempId = () =>
        `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const sendFiles = async (attachments = []) => {
        // Return early if no attachments are provided
        if (!attachments || attachments.length === 0) {
            return null;
        }

        // Determine the current user
        const currentUser = userData || lawyerData;
        if (!currentUser) {
            toast.error("User not authenticated");
            return null;
        }

        // Validate the receiver ID based on the user type
        let receiverId;
        if (userData) {
            // Current user is a client, sending to lawyer
            receiverId = "67c033958471238ebaa4445a";
        } else if (lawyerData) {
            // Current user is a lawyer, sending to client
            receiverId = "67bb15745b40ffa3d45ddd78";
        } else {
            toast.error("Cannot determine message recipient");
            return null;
        }

        // Validate file sizes and types before uploading
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        const validAttachments = [];
        
        for (const file of attachments) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File ${file.name} exceeds 10MB limit`);
                continue;
            }
            
            // Add file type validation if needed
            validAttachments.push(file);
        }
        
        if (validAttachments.length === 0) {
            return null;
        }

        // Create a unique temporary ID for this message
        const tempId = generateTempId();

        // Create an optimistic message
        const optimisticMessage = {
            _id: tempId,
            senderId: currentUser._id,
            receiverId,
            attachments: validAttachments.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                // Create temporary URLs for image previews
                url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
            })),
            createdAt: new Date().toISOString(),
            isPending: true,
        };

        // Add the optimistic message to the state
        setMessages((prevMessages) => [
            ...(Array.isArray(prevMessages) ? prevMessages : []),
            optimisticMessage,
        ]);

        setLoading(true);

        try {
            // Create FormData to handle file uploads
            const formData = new FormData();
            validAttachments.forEach((file) => {
                formData.append("files", file);
            });

            // Configure the request headers
            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                // Add timeout to prevent hanging requests
                timeout: 30000, // 30 seconds
            };

            // Send the files to the server
            const response = await axios.post(
                `${backendUrl}/api/messages/upload/${receiverId}`,
                formData,
                config
            );

            // Replace the optimistic message with the actual message from the server
            setMessages((prevMessages) => {
                const updatedMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];
                
                // Find and replace the optimistic message
                const index = updatedMessages.findIndex(msg => msg._id === tempId);
                if (index !== -1) {
                    updatedMessages[index] = { 
                        ...response.data, 
                        isPending: false,
                        isDelivered: true 
                    };
                } else {
                    // If optimistic message not found, add the new message
                    updatedMessages.push({ 
                        ...response.data, 
                        isPending: false,
                        isDelivered: true 
                    });
                }
                
                return updatedMessages;
            });

            // Clean up temporary object URLs
            if (validAttachments.some(file => file.type.startsWith('image/'))) {
                optimisticMessage.attachments.forEach(attachment => {
                    if (attachment.url && attachment.url.startsWith('blob:')) {
                        URL.revokeObjectURL(attachment.url);
                    }
                });
            }

            return response.data;
        } catch (error) {
            console.error("Error sending files:", error);

            // Keep the message but mark it as failed
            setMessages((prevMessages) => {
                const updatedMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];
                
                // Find and update the optimistic message
                const index = updatedMessages.findIndex(msg => msg._id === tempId);
                if (index !== -1) {
                    updatedMessages[index] = { 
                        ...updatedMessages[index], 
                        isPending: false, 
                        isFailed: true 
                    };
                }
                
                return updatedMessages;
            });

            // Display more specific error messages
            if (error.code === 'ECONNABORTED') {
                toast.error("Request timed out. Please check your connection and try again.");
            } else if (error.response?.status === 413) {
                toast.error("Files too large. Please select smaller files.");
            } else if (error.response?.status === 401) {
                toast.error("You need to be logged in to send files.");
            } else {
                const errorMessage = error.response?.data?.error || "Failed to send files";
                toast.error(errorMessage);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendFiles };
};

export default useSendFiles;