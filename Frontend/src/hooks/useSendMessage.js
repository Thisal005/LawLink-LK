import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useConversation from '../zustand/useConversation';
import { AppContext } from '../Context/AppContext';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { backendUrl, userData, lawyerData } = useContext(AppContext);

    // Generate a unique ID for optimistic updates
    const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const sendMessage = async (messageText, attachments = []) => {
        // Return early if the message is empty or contains only whitespace and no attachments
        if (!messageText.trim() && attachments.length === 0) return null;

        // Determine the current user
        const currentUser = userData || lawyerData;
     
       

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

        // Create a unique temporary ID for this message
        const tempId = generateTempId();

        // Create an optimistic message
        const optimisticMessage = {
            _id: tempId,
            senderId: currentUser._id,
            receiverId,
            message: messageText.trim(),
            createdAt: new Date().toISOString(),
            isPending: true,
        };

        // Add the optimistic message to the state
        setMessages((prevMessages) => [...(Array.isArray(prevMessages) ? prevMessages : []), optimisticMessage]);

        setLoading(true);
        
        try {
            // Configure the request headers
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Send the message to the backend
            const res = await axios.post(
                `${backendUrl}/api/messages/send/${receiverId}`,
                { message: messageText.trim() },
                config
            );

            const data = res.data;

            if (data) {
                // Replace the optimistic message with the actual message from the server
                setMessages((prevMessages) => {
                    const updatedMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];
                    
                    // Find and replace the optimistic message
                    const index = updatedMessages.findIndex(msg => msg._id === tempId);
                    if (index !== -1) {
                        updatedMessages[index] = { ...data, isPending: false };
                    } else {
                        // If optimistic message not found, add the new message
                        updatedMessages.push({ ...data, isPending: false });
                    }
                    
                    return updatedMessages;
                });

                return data;
            } else {
                throw new Error("No data returned from server");
            }
        } catch (error) {
            console.error("Error sending message:", error);

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

            // Display an appropriate error message
            const errorMessage = error.response?.data?.error || "Failed to send message";
            toast.error(errorMessage);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendMessage };
};

export default useSendMessage;