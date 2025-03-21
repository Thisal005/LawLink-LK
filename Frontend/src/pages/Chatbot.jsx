// frontend/src/Chatbot.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import Sidebar from "../Components/Sidebar"; // Your app’s Sidebar
import Header from "../Components/Header";   // Your app’s Header
import { PaperAirplaneIcon, ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";

const Chatbot = () => {
  const { backendUrl, userData, lawyerData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const AI_NAME = "Lexi";
  const MESSAGE_LIMIT = 20;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedHistory);

    const initializeChatbot = async () => {
      try {
        console.log("Initializing chatbot...");
        const response = await fetch(`${backendUrl}/api/chatbot/init`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Init response:", data);
        if (data.success) {
          setMessages([{ sender: "bot", text: data.welcome }]);
        } else {
          throw new Error(data.error || "Init failed");
        }
      } catch (error) {
        console.error("Init Error:", error);
        setMessages([{ sender: "bot", text: "Failed to load Lexi. Are you logged in?" }]);
      }
    };
    initializeChatbot();
  }, [backendUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending message:", input);
      const response = await fetch(`${backendUrl}/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log(`${AI_NAME} Response:`, data);

      if (!response.ok || !data.success) {
        throw new Error(data.msg || "Failed to process request");
      }

      const botReply = { sender: "bot", text: data.response };
      setMessages((prev) => {
        const newMessages = [...prev, botReply];
        saveChatHistory(newMessages);
        return newMessages;
      });
    } catch (error) {
      console.error(`${AI_NAME} Error:`, error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const saveChatHistory = (newMessages) => {
    setChatHistory((prevHistory) => {
      const updatedHistory = [
        { id: currentChatId, messages: newMessages, timestamp: Date.now() },
        ...prevHistory.filter((chat) => chat.id !== currentChatId),
      ].slice(0, 10);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(Date.now());
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setShowHistory(false);
    }
  };

  const isChatLimitReached = messages.length >= MESSAGE_LIMIT;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        {/* Header */}
        <Header
          displayName={userData?.fullName || lawyerData?.fullName || "User"}
          practiceAreas={lawyerData ? "Legal Assistance" : "Client"}
        />

        {/* Chatbot Area */}
        <div className="flex-1 flex flex-col mt-16">
          {/* Chat Header as Rounded Box */}
          <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md">
            <div className="flex items-center justify-between max-w-md mx-auto bg-white/10 rounded-full p-3 shadow-inner">
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg font-semibold">Chat with Lexi</span>
                <span className="text-xs text-blue-200">Your Legal Assistant</span>
              </div>
              <button
                onClick={startNewChat}
                className="p-2 hover:bg-blue-600 rounded-full transition-colors"
                title="Start a new chat"
              >
                <ArrowPathIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Message Area with Scrollbar */}
          <div className="flex-1 overflow-y-auto p-6 bg-white/95 max-h-[calc(100vh-16rem)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-lg p-4 rounded-lg shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-gray-900 border-l-4 border-blue-500"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="p-4 rounded-lg bg-blue-100 text-gray-700 flex items-center gap-2 shadow-sm">
                  <span className="animate-pulse text-lg">...</span>
                </div>
              </div>
            )}
            {isChatLimitReached && (
              <div className="text-center text-blue-600 text-sm mb-4 font-medium">
                Chat limit reached! Start a new chat above.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-blue-200 shadow-lg">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Lexi anything..."
                className="flex-1 p-3 bg-blue-50 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500 disabled:bg-gray-200 transition-all"
                disabled={loading || isChatLimitReached}
              />
              <button
                onClick={sendMessage}
                disabled={loading || isChatLimitReached}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-3 bg-blue-200 text-blue-800 rounded-full hover:bg-blue-300 transition-colors"
                title="Chat History"
              >
                <ClockIcon className="h-5 w-5" />
              </button>
            </div>

            {/* History Dropdown */}
            {showHistory && (
              <div className="absolute bottom-20 right-6 w-72 bg-white border border-blue-200 rounded-xl shadow-xl p-4 max-h-72 overflow-y-auto z-10">
                <h3 className="text-sm font-bold text-blue-700 mb-3">Chat History</h3>
                {chatHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No chats yet</p>
                ) : (
                  chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => loadChat(chat.id)}
                      className="w-full text-left p-3 text-gray-700 hover:bg-blue-50 rounded-md text-sm transition-colors"
                    >
                      {new Date(chat.timestamp).toLocaleString()} ({chat.messages.length} messages)
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;