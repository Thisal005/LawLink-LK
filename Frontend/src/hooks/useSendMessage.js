import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useConversation from '../zustand/useConversation';
import { AppContext } from '../Context/AppContext';

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { backendUrl, userData, lawyerData } = useContext(AppContext);

    const sendMessage = async (messageText, files = []) => {
        if ((!messageText.trim() && files.length === 0) || loading) return;

        const currentUser = userData || lawyerData;
        if (!currentUser) {
            toast.error("You must be logged in to send messages");
            return;
        }

        const receiverId = userData ? "67c033958471238ebaa4445a" : "67bb15745b40ffa3d45ddd78";

        const formData = new FormData();
        formData.append('message', messageText);
        files.forEach((file) => {
            formData.append('documents', file);
        });

        setLoading(true);

        try {
            const res = await axios.post(
                `${backendUrl}/api/messages/send/${receiverId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            setMessages([...messages, res.data]);
            setLoading(false);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            setLoading(false);
        }
    };

    return { loading, sendMessage };
};

export default useSendMessage;