import { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useConversation from '../zustand/useConversation';
import { AppContext } from '../Context/AppContext';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { backendUrl, userData, lawyerData } = useContext(AppContext);

    const getMessages = useCallback(async (forceRefresh = false) => {
        const currentUser = userData || lawyerData;
        if (!currentUser) {
            setError("You must be logged in to view messages");
            return [];
        }

        let otherUserId;
        if (userData) {
            otherUserId = "67c033958471238ebaa4445a"; // Lawyer ID
        } else if (lawyerData) {
            otherUserId = "67bb15745b40ffa3d45ddd78"; // Client ID
        } else {
            setError("Cannot determine conversation partner");
            return [];
        }

        // Throttle requests to prevent too many API calls
        if (!forceRefresh && lastFetch && Date.now() - lastFetch < 2000) {
            return Array.isArray(messages) ? messages : [];
        }

        setLoading(true);
        setError(null);

        try {
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const res = await axios.get(
                `${backendUrl}/api/messages/${otherUserId}`,
                config
            );

            const data = res.data;
            setLastFetch(Date.now());

            if (data) {
                // Parse the response data correctly
                const messageArray = Array.isArray(data) ? data : 
                                    (data.messages && Array.isArray(data.messages)) ? data.messages : [];
                
                // Keep any pending messages in the state
                const pendingMessages = Array.isArray(messages) 
                    ? messages.filter(msg => msg.isPending) 
                    : [];
                
                // Combine server messages with pending messages
                const serverMessageIds = new Set(messageArray.map(msg => msg._id));
                const filteredPendingMessages = pendingMessages.filter(
                    msg => !serverMessageIds.has(msg._id)
                );
                
                const combinedMessages = [...messageArray, ...filteredPendingMessages];
                
                // Sort messages by timestamp
                combinedMessages.sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                
                setMessages(combinedMessages);
                return combinedMessages;
            } else {
                // Keep any pending messages even if server returned empty
                const pendingMessages = Array.isArray(messages) 
                    ? messages.filter(msg => msg.isPending) 
                    : [];
                setMessages(pendingMessages);
                return pendingMessages;
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError(error.response?.data?.error || "Failed to fetch messages");
            
            // Don't clear messages on error, just return current state
            return Array.isArray(messages) ? messages : [];
        } finally {
            setLoading(false);
        }
    }, [backendUrl, userData, lawyerData, messages, setMessages, lastFetch]);

    // Make sure messages is always an array
    const safeMessages = Array.isArray(messages) ? messages : [];

    return { 
        loading, 
        error,
        messages: safeMessages, 
        getMessages 
    };
};

export default useGetMessages;