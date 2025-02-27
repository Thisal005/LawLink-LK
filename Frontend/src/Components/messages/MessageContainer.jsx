import Messages from "../messages/Mesasges";
import MessageInput from "../messages/MessageInput";

const MessageContainer = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white shadow-lg rounded-lg mx-4 my-2">
            {/* Messages container with scroll */}
            <div className="flex-1 overflow-y-auto">
                <Messages />
            </div>

            {/* Fixed input at bottom */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <MessageInput />
            </div>
        </div>
    );
};

export default MessageContainer;