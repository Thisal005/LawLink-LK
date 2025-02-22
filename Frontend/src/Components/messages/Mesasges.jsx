import React from "react";
import decryptMessage from '../../utills/encryption';

const Messages = ({ messages }) => {
    const decryptMessages = async (messages) => {
        const key = sodium.from_hex("your-encryption-key"); // Replace with actual key
        const decryptedMessages = await Promise.all(messages.map(async (msg) => {
            const decryptedMessage = await decryptMessage(msg.message, msg.nonce, key);
            return { ...msg, message: decryptedMessage };
        }));
        return decryptedMessages;
    };

    const [decryptedMessages, setDecryptedMessages] = React.useState([]);

    React.useEffect(() => {
        decryptMessages(messages).then(setDecryptedMessages);
    }, [messages]);

    return (
        <div>
            {decryptedMessages.map((msg) => (
                <div key={msg._id} className="space-y-2 p-2">
                    {/* Display sender's message */}
                    {msg.senderId === "currentUserId" ? (
                        <div className="flex items-start justify-end group">
                            <div className="max-w-[80%]">
                                <div className="bg-blue-500 rounded-2xl rounded-tr-none px-4 py-2 text-white">
                                    <p>{msg.message}</p>
                                </div>
                                <div className="flex items-center justify-end mt-1 space-x-2">
                                    <span className="text-xs text-gray-500">
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start group">
                            <div className="max-w-[80%]">
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-gray-800">
                                    <p>{msg.message}</p>
                                </div>
                                <div className="flex items-center mt-1 space-x-2">
                                    <span className="text-xs text-gray-500">
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Messages;