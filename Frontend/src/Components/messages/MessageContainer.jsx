import { useEffect, useState } from "react";
import Messages from "../messages/Mesasges";
import MessageInput from "../messages/MessageInput";
import { ChevronDown } from "lucide-react";

const MessageContainer = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [containerRef, setContainerRef] = useState(null);

    // Handle scroll button visibility
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const bottomThreshold = scrollHeight - clientHeight - 100;
        setShowScrollButton(scrollTop < bottomThreshold);
    };

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (containerRef) {
            const messagesContainer = containerRef.querySelector('[data-scroll-end]');
            if (messagesContainer) {
                messagesContainer.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <div 
            className="flex flex-col h-[calc(100vh-120px)] bg-white shadow-lg rounded-xl overflow-hidden relative"
            ref={setContainerRef}
        >
            {/* Header with status */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center">
                <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Chat</span>
                </div>
                <div className="ml-auto text-xs text-gray-500">Online</div>
            </div>

            {/* Messages container with scroll */}
            <div 
                className="flex-1 overflow-y-auto" 
                onScroll={handleScroll}
            >
                <Messages />
                <div data-scroll-end />
            </div>

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-6 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-all"
                >
                    <ChevronDown size={20} />
                </button>
            )}

            {/* Fixed input at bottom */}
            <div className="border-t border-gray-100 p-3 bg-white">
                <MessageInput />
            </div>
        </div>
    );
};

export default MessageContainer;