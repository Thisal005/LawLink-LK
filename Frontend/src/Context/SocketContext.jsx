// Context-SocketContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from './AuthContext';
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useAuthContext();

    useEffect(() => {
        if (user) {
            console.log("Connecting to WebSocket with userId:", user._id);
            const newSocket = io('http://localhost:5000', { 
                query: { 
                    userId: user._id,
                    name: user?.name || ''
                }
            });

            newSocket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            newSocket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server');
                setSocket(null);
            });

            newSocket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });

            newSocket.on('newMessage', (newMessage) => {
                const message = {
                    ...newMessage,
                    shouldShake: true,
                    createdAt: Date.now()
                };
                useConversation.setState(prev => ({
                    messages: [...prev.messages, message]
                }));
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};