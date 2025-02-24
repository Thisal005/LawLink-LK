// Components - Message.jsx

import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../zustand/useConversation";

export function extractTime(dateString) {
    return `${String(new Date(dateString).getHours()).padStart(2, '0')}:${String(new Date(dateString).getMinutes()).padStart(2, '0')}`;
}

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const isFromMe = message.senderId === authUser?._id;
    const profilePic = isFromMe ? authUser?.profilePic : selectedConversation?.profilePic;

    return (
        <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg ${isFromMe ? 'bg-blue-500 text-white' : 'bg-white'}`} style={{ maxWidth: '70%' }}>
                <div className="flex items-center gap-2">
                    <img 
                        src={profilePic || '/default-profile.png'} 
                        alt="User" 
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{message.message}</span>
                </div>
                <div className="text-xs opacity-70 text-gray-500 mt-1">
                    {extractTime(message.createdAt)}
                </div>
            </div>
        </div>
    );
};

export default Message;