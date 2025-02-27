import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import dayjs from "dayjs";

const Message = ({ message }) => {
    const { userData, lawyerData } = useContext(AppContext);
    const currentUserId = userData?._id || lawyerData?._id;
    const isOwnMessage = message.senderId === currentUserId;

    return (
        <div
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                        ? "bg-blue-500 text-white" // Your messages
                        : "bg-gray-200 text-gray-800" // Other users' messages
                }`}
            >
                <div className="message-content">{message.message}</div>
                <div className="text-xs mt-1 opacity-80">
                    {dayjs(message.createdAt).format("h:mm A")}
                    {isOwnMessage && (
                        <span className="ml-1">✓{message.isRead && "✓"}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;