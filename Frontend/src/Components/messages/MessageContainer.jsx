import Messages from "./Mesasges";
import MessageInput from "./MessageInput";


const MessageContainer = () => {
  return (
    <div className="flex flex-col h-[calc(99vh-74px)] bg-white shadow-lg rounded-lg ml-70 mt-18 mr-5 mb-2">
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-y-auto p-4">
        <Messages />
      </div>
      
      {/* Fixed input at bottom */}
      <div className="border-t border-gray-200 p-2 bg-transparent-50 shadow-lg rounded-b-lg backdrop-blur-sm">
        <MessageInput />
      </div>
    </div>
  );
};

export default MessageContainer