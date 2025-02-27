import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useConversation from '../zustand/useConversation';
import { AppContext } from '../Context/AppContext';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { backendUrl, userData, lawyerData } = useContext(AppContext);

    const getMessages = async () => {
        const currentUser = userData || lawyerData;
        
        if (!currentUser) {
            toast.error("You must be logged in to fetch messages");
            return;
        }

        setLoading(true);

        const otherUserId = selectedConversation?.userId || "67c033958471238ebaa4445a";

        try {
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            const res = await axios.get(
                `${backendUrl}/api/messages/${otherUserId}`,
                config
            );

            const data = res.data;
            
            if (data) {
                const messageArray = Array.isArray(data) ? data : 
                                    (data.messages && Array.isArray(data.messages)) ? data.messages : [];
                
                setMessages(messageArray);
                return messageArray;
            } else {
                setMessages([]);
                return [];
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error.response?.data?.error || "Failed to fetch messages");
            setMessages([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedConversation) {
            getMessages();
        }
    }, [selectedConversation]);

    const safeMessages = Array.isArray(messages) ? messages : [];

    return { loading, messages: safeMessages, getMessages };
};

export default useGetMessages;