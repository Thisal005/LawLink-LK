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
    console.log("SocketContext useEffect triggered. Current user:", user);

    if (!user) {
      console.log("No user available yet, skipping socket initialization");
      if (socket) {
        console.log("Closing existing socket due to no user");
        socket.close();
        setSocket(null);
      }
      return;
    }

    console.log("Initializing socket with userId:", user._id);
    const newSocket = io("http://localhost:5000", {
      query: { userId: user._id, name: user.fullName || "Unnamed User" }, // Use fullName from lawyer data
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", user._id);
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

    newSocket.on("newMeeting", (meeting) => {
      console.log("New meeting scheduled:", meeting);
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket for user:", user._id);
      newSocket.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};