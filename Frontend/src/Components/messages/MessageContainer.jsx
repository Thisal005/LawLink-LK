import Messages from "./Mesasges";
import MessageInput from './MessageInput';
import { useEffect, useContext,useState } from "react";
import useConversation from "../../zustand/useConversation";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../Context/AuthContext";
import { AppContext } from "../../Context/AppContext";


const MessageContainer = () => {
    const { selectedConversation, setMessages } = useConversation();
    const [messagesEndRef, setMessagesEndRef] = useState(null);

    useEffect(() => {
        // Set scroll to bottom when new messages arrive
        if (messagesEndRef) {
            messagesEndRef.scrollIntoView({ behavior: 'smooth' });
        }

        return () => {
            setMessages([]);
        };
    }, [selectedConversation]);

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


export default MessageContainer;


