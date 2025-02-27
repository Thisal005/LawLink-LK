import Message from "../messages/Message";
import useGetMessages from "../../hooks/useGetMessages";
import { useEffect, useRef } from "react";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const Messages = () => {
    const { messages, loading, getMessages } = useGetMessages();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getMessages();
    }, []);

    // Auto-scroll to the bottom when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-2">
            {loading ? (
                [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)
            ) : messages.length > 0 ? (
                messages.map((message) => (
                    <Message key={message._id || message.createdAt} message={message} />
                ))
            ) : (
                <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Messages;