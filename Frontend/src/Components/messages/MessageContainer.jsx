import Messages from "./Mesasges";
import MessageInput from "./MessageInput";
import { useState, useEffect } from "react";
import socket from "../../utills/socket.js";


const MessageContainer = () => {
  const [receiverId, setReceiverId] = useState("67b96ed0823f5c33a83ec119");
  const [messages, setMessages] = useState([]); // State to store messages

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(99vh-74px)] bg-white shadow-lg rounded-lg ml-70 mt-18 mr-5 mb-2">
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-y-auto p-4">
        <Messages messages={messages} /> {/* Pass messages as a prop */}
      </div>

      {/* Fixed input at bottom */}
      <div className="border-t border-gray-200 p-2 bg-transparent-50 shadow-lg rounded-b-lg backdrop-blur-sm">
        <MessageInput receiverId={receiverId} />
      </div>
    </div>
  );
};

export default MessageContainer;