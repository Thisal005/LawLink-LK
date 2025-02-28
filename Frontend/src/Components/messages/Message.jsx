import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import dayjs from "dayjs";

const Message = ({ message }) => {
    const { userData, lawyerData } = useContext(AppContext);

   

    // Safely retrieve currentUserId with a fallback
    const currentUserId = userData?._id || lawyerData?._id || "defaultUserId";

    // Determine if the message belongs to the current user
    const isOwnMessage = message.senderId === currentUserId;
    

    return (
        <div
            className={`flex items-end mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isOwnMessage
                        ? "bg-gray-200 text-gray-800 rounded-br-none"
                        : " bg-blue-500 text-white rounded-bl-none" 
                       
                } shadow-sm`}
            >
                <div className="message-content text-sm">{message.message}</div>
                <div className="flex items-center justify-end text-xs mt-1 opacity-80">
                    {dayjs(message.createdAt).format("h:mm A")}
                    {isOwnMessage && (
                        <span className="ml-1">
                            {message.isPending ? (
                                <span className="text-blue-200">⟳</span>
                            ) : (
                                <>✓{message.isRead && "✓"}</>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;