import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    
    const WS_URL = 'ws://localhost:8000';
    
    const { sendMessage, lastMessage } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            const receivedMessage = JSON.parse(lastMessage.data);
            setMessages((prev) => [...prev, receivedMessage]);
        }
    }, [lastMessage]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageData = {
            text: messageInput,
            timestamp: new Date().toISOString(),
            sender: 'User' // You can replace this with actual user info
        };
        
        sendMessage(JSON.stringify(messageData));
        setMessageInput('');
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <strong>{message.sender}: </strong>
                        <span>{message.text}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat; 