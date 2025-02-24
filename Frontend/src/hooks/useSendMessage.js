import { useEffect, useState, useRef } from 'react';
import { useSocketContext } from '../Context/SocketContext';
import { useAuthContext } from '../Context/AuthContext';
import useConversation from '../zustand/useConversation'; // Fixed import
import { toast } from 'react-toastify';

const useSendMessage = () => {
    const { socket } = useSocketContext();
    const { user } = useAuthContext();
    const { setSelectedConversation, selectedConversation } = useConversation();
    const [loading, setLoading] = useState(false);

    const sendMessage = async (message) => {
        if (!socket) return;
        setLoading(true);

        try {
            const newMessage = {
                senderId: user._id,
                receiverId: selectedConversation?.receiverId || '',
                message,
                createdAt: Date.now(),
                status: 'sent'
            };
            await socket.emit('newMessage', newMessage);
            toast.success('Message sent successfully!');
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;