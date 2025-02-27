import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useConversation from '../zustand/useConversation';
import { AppContext } from '../Context/AppContext';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { backendUrl, userData, lawyerData } = useContext(AppContext);

    const sendMessage = async (messageText) => {
        if (!messageText.trim()) return null;
        
        const currentUser = userData || lawyerData;
        
        if (!currentUser) {
            toast.error("You must be logged in to send messages");
            return null;
        }

        const receiverId = selectedConversation?.userId || "67c033958471238ebaa4445a";
        
        const optimisticMessage = {
            _id: Date.now().toString(),
            senderId: currentUser._id,
            receiverId,
            message: messageText,
            createdAt: new Date().toISOString(),
            isPending: true
        };
        
        setMessages(prevMessages => [...(Array.isArray(prevMessages) ? prevMessages : []), optimisticMessage]);
        
        setLoading(true);

        try {
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            const res = await axios.post(
                `${backendUrl}/api/messages/send/${receiverId}`,
                { message: messageText },
                config
            );
            
            const data = res.data;
            
            if (data) {
                setMessages(prevMessages => {
                    const messages = Array.isArray(prevMessages) ? prevMessages : [];
                    return messages.map(msg => 
                        msg._id === optimisticMessage._id ? data : msg
                    );
                });
                
                return data;
            } else {
                setMessages(prevMessages => {
                    const messages = Array.isArray(prevMessages) ? prevMessages : [];
                    return messages.filter(msg => msg._id !== optimisticMessage._id);
                });
                
                throw new Error("No data returned from server");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            
            setMessages(prevMessages => {
                const messages = Array.isArray(prevMessages) ? prevMessages : [];
                return messages.filter(msg => msg._id !== optimisticMessage._id);
            });
            
            toast.error(error.response?.data?.error || "Failed to send message");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendMessage };
};

export default useSendMessage;