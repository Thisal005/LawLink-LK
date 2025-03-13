import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
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
    const testUserId = user?._id || "test-user-" + Math.random().toString(36).substr(2, 9);
    console.log("Initializing socket with userId:", testUserId);
    const newSocket = io("http://localhost:5000", {
      query: { userId: testUserId, name: user?.name || "Test User" },
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", testUserId);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server. Reason:", reason);
      setSocket(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("newMessage", (newMessage) => {
      const message = { ...newMessage, shouldShake: true, createdAt: Date.now() };
      useConversation.setState((prev) => ({
        messages: [...prev.messages, message],
      }));
    });

    setSocket(newSocket);

    // Cleanup only when the provider unmounts (app closes)
    return () => {
      console.log("Cleaning up socket");
      newSocket.close();
    };
  }, []); // Empty dependency array to run once on mount

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};