import Messages from "./Mesasges";
import MessageInput from "./MessageInput";
import { useState } from "react";


const MessageContainer = () => {
  const [receiverId, setReceiverId] = useState("67aa61a22044865722d577aa");
  return (
    <div className="flex flex-col h-[calc(99vh-74px)] bg-white shadow-lg rounded-lg ml-70 mt-18 mr-5 mb-2">
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-y-auto p-4">
        <Messages />
      </div>
      
      {/* Fixed input at bottom */}
      <div className="border-t border-gray-200 p-2 bg-transparent-50 shadow-lg rounded-b-lg backdrop-blur-sm">
      <MessageInput receiverId={receiverId} />
      </div>
    </div>
  );
};

export default MessageContainer