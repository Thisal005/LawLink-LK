import React, { useEffect, useRef, useState } from "react";
import useVideocall from "../hooks/useVideocall";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  Camera, CameraOff, Mic, MicOff, PhoneOff, Share, 
  MessageSquare, Menu, X, Users, PictureInPicture, Smile
} from "lucide-react";

const VideoMeet = ({ meetingId, userName }) => {
  // Core video call functionality
  const { 
    localStream, 
    remoteStream, 
    isCallActive, 
    startCall, 
    endCall,
    toggleMute,
    toggleVideo 
  } = useVideocall(meetingId);
  
  // Refs and state
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [layout, setLayout] = useState("grid"); // grid, focus, pip
  const [showChat, setShowChat] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [roomTheme, setRoomTheme] = useState("aurora"); // aurora, midnight, sunset
  const [showEmojis, setShowEmojis] = useState(false);
  const [backgroundEffect, setBackgroundEffect] = useState("none"); // none, blur, virtual
  
  // Timer for meeting duration
  const [meetingTime, setMeetingTime] = useState(0);
  const timerRef = useRef(null);

  // Load meeting info
  useEffect(() => {
    if (meetingId) {
      fetchMeetingInfo();
    }
  }, [meetingId]);

  // Setup timer when call starts
  useEffect(() => {
    if (callStarted && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setMeetingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callStarted]);

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Theme variables
  const themeStyles = {
    aurora: {
      background: "bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-800",
      accent: "bg-teal-500",
      hoverAccent: "hover:bg-teal-600",
      controlsBg: "bg-black bg-opacity-30 backdrop-blur-md",
      buttonBg: "bg-indigo-600",
      buttonHover: "hover:bg-indigo-700",
      text: "text-white"
    },
    midnight: {
      background: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
      accent: "bg-blue-600",
      hoverAccent: "hover:bg-blue-700",
      controlsBg: "bg-gray-800 bg-opacity-60 backdrop-blur-md",
      buttonBg: "bg-gray-700",
      buttonHover: "hover:bg-gray-600",
      text: "text-white"
    },
    sunset: {
      background: "bg-gradient-to-br from-red-800 via-orange-500 to-yellow-600",
      accent: "bg-pink-600",
      hoverAccent: "hover:bg-pink-700",
      controlsBg: "bg-black bg-opacity-30 backdrop-blur-md",
      buttonBg: "bg-red-600",
      buttonHover: "hover:bg-red-700",
      text: "text-white"
    }
  };
  
  const currentTheme = themeStyles[roomTheme];

  const fetchMeetingInfo = async () => {
    try {
      const response = await axios.get(`/api/meetings/${meetingId}`, {
        withCredentials: true,
      });
      setMeetingInfo(response.data);
      setParticipants(response.data.participants || []);
    } catch (err) {
      toast.error("Failed to fetch meeting information");
    }
  };

  useEffect(() => {
    if (callStarted && localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (callStarted && remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream, callStarted]);

  useEffect(() => {
    // Update participants when someone joins/leaves
    if (callStarted) {
      const intervalId = setInterval(fetchMeetingInfo, 10000);
      return () => clearInterval(intervalId);
    }
  }, [callStarted]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (callStarted) setShowControls(false);
      }, 4000);
    };

    if (callStarted) {
      document.addEventListener("mousemove", handleActivity);
      document.addEventListener("click", handleActivity);
      timeout = setTimeout(() => setShowControls(false), 4000);
    }

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("click", handleActivity);
    };
  }, [callStarted]);

  const handleStartCall = async () => {
    try {
      setLoading(true);
      await startCall();
      setCallStarted(true);
      
      await axios.post(`/api/meetings/join/${meetingId}`, 
        { userName: userName || "Anonymous User" }, 
        { withCredentials: true }
      );
      
      toast.success("You joined the meeting");
    } catch (err) {
      toast.error("Failed to start the call: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await axios.post(`http://localhost:5000/api/meetings/end/${meetingId}`, {}, {
        withCredentials: true,
      });
      endCall();
      setCallStarted(false);
      toast.success("Meeting ended");
    } catch (err) {
      toast.error("Failed to end the meeting");
    }
  };
  const handleToggleAudio = () => {
    toggleMute();
    setAudioEnabled(!audioEnabled);
    toast.info(audioEnabled ? "Microphone muted" : "Microphone unmuted");
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setVideoEnabled(!videoEnabled);
    toast.info(videoEnabled ? "Camera turned off" : "Camera turned on");
  };

  const changeLayout = (newLayout) => {
    setLayout(newLayout);
    toast.info(`Layout changed to ${newLayout} view`);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages([
      ...messages, 
      { sender: "You", text: newMessage, time: new Date() }
    ]);
    setNewMessage("");
    
    // Here you would typically send to an API
    // Simulate receiving a reply for demo purposes
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "Remote User", text: "Got your message!", time: new Date() }
      ]);
    }, 2000);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) {
      setShowEmojis(false);
    }
  };

  const changeTheme = (theme) => {
    setRoomTheme(theme);
    toast.info(`Room theme changed to ${theme}`);
  };

  // Pre-meeting screen
  if (!callStarted) {
    return (
      <div className={`flex flex-col h-full ${currentTheme.background} text-white rounded-lg overflow-hidden transition-all duration-500`}>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 animate-pulse">
              {meetingInfo?.title || "Join Meeting"}
            </h1>
            <p className="text-xl opacity-75">Room ID: {meetingId}</p>
          </div>
          
          <div className="w-full max-w-md p-6 rounded-xl bg-black bg-opacity-30 backdrop-blur-lg">
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black h-64">
                {videoEnabled ? (
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    muted 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-3xl font-semibold">
                        {userName?.charAt(0) || "Y"}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={handleToggleAudio}
                    className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-800' : 'bg-red-600'}`}
                  >
                    {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button
                    onClick={handleToggleVideo}
                    className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-800' : 'bg-red-600'}`}
                  >
                    {videoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  className="flex-1 p-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                <div className="flex-shrink-0">
                  <button
                    onClick={handleStartCall}
                    disabled={loading}
                    className={`${currentTheme.buttonBg} ${currentTheme.buttonHover} text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <span>Join Now</span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center gap-3 pt-2">
                <button 
                  onClick={() => changeTheme('aurora')} 
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-800 ${roomTheme === 'aurora' ? 'ring-2 ring-white' : ''}`}
                />
                <button 
                  onClick={() => changeTheme('midnight')} 
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black ${roomTheme === 'midnight' ? 'ring-2 ring-white' : ''}`}
                />
                <button 
                  onClick={() => changeTheme('sunset')} 
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-red-800 via-orange-500 to-yellow-600 ${roomTheme === 'sunset' ? 'ring-2 ring-white' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video layouts
  const renderVideoLayout = () => {
    switch (layout) {
      case "focus":
        return (
          <div className="relative h-full w-full">
            {/* Main video (remote) */}
            <div className="absolute inset-0">
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-sm">
                Remote User
              </div>
            </div>
            
            {/* PIP for local video */}
            <div className="absolute bottom-4 right-4 w-40 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              {videoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-xl font-semibold">{userName?.charAt(0) || "Y"}</span>
                </div>
              )}
              {!audioEnabled && (
                <div className="absolute bottom-1 right-1 bg-red-600 rounded-full p-1">
                  <MicOff size={12} />
                </div>
              )}
            </div>
          </div>
        );
        
      case "pip":
        return (
          <div className="relative h-full w-full">
            {/* Main video (local) */}
            <div className="absolute inset-0">
              {videoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-4xl font-semibold">{userName?.charAt(0) || "Y"}</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-sm">
                You {!audioEnabled && "(Muted)"}
              </div>
            </div>
            
            {/* PIP for remote video */}
            <div className="absolute top-4 right-4 w-40 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
        
      case "grid":
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {/* Remote video */}
            <div className="relative bg-black rounded-xl overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-sm">
                Remote User
              </div>
            </div>
            
            {/* Local video */}
            <div className="relative bg-black rounded-xl overflow-hidden">
              {videoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-3xl font-semibold">{userName?.charAt(0) || "Y"}</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-sm">
                You {!audioEnabled && "(Muted)"}
              </div>
            </div>
          </div>
        );
    }
  };

  // Main meeting UI
  return (
    <div 
      className={`flex h-full ${currentTheme.background} text-white rounded-xl overflow-hidden transition-all duration-300`}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Meeting header */}
        <div className={`flex justify-between items-center p-3 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${currentTheme.controlsBg}`}>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${currentTheme.accent} animate-pulse`}></div>
            <span className="font-medium">{meetingInfo?.title || `Meeting: ${meetingId}`}</span>
            <span className="text-xs bg-black bg-opacity-30 px-2 py-1 rounded-full">
              {formatTime(meetingTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black bg-opacity-30 px-2 py-1 rounded-full">
              <Users size={14} className="mr-1" />
              <span className="text-xs">{participants.length}</span>
            </div>
            
            <div className="flex">
              <button 
                onClick={() => changeLayout("grid")} 
                className={`p-1 ${layout === "grid" ? currentTheme.accent : "bg-black bg-opacity-30"} rounded-l-md`}
              >
                <Menu size={16} />
              </button>
              <button 
                onClick={() => changeLayout("focus")} 
                className={`p-1 ${layout === "focus" ? currentTheme.accent : "bg-black bg-opacity-30"}`}
              >
                <Users size={16} />
              </button>
              <button 
                onClick={() => changeLayout("pip")} 
                className={`p-1 ${layout === "pip" ? currentTheme.accent : "bg-black bg-opacity-30"} rounded-r-md`}
              >
                <PictureInPicture size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Videos area */}
        <div className="flex-1 p-3">
          {renderVideoLayout()}
        </div>
        
        {/* Controls */}
        <div 
          className={`p-3 flex justify-center transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} ${currentTheme.controlsBg}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAudio}
              className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
            >
              {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            
            <button
              onClick={handleToggleVideo}
              className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
            >
              {videoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
            </button>
            
            <button
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Share size={20} />
            </button>
            
            <button
              onClick={toggleChat}
              className={`p-3 rounded-full ${showChat ? currentTheme.accent : 'bg-gray-800 hover:bg-gray-700'} transition-colors`}
            >
              <MessageSquare size={20} />
            </button>
            
            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat sidebar */}
      <div 
        className={`w-80 ${currentTheme.controlsBg} border-l border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${showChat ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h3 className="font-medium">Chat</h3>
          <button onClick={toggleChat} className="p-1 rounded hover:bg-gray-700">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet</p>
              <p className="text-xs mt-2">Start the conversation</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-xs ${msg.sender === "You" ? "ml-auto" : "mr-auto"}`}
              >
                <div 
                  className={`rounded-lg p-3 ${
                    msg.sender === "You" 
                      ? `${currentTheme.accent} text-white` 
                      : "bg-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{msg.sender}</span>
                  <span>
                    {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 border-t border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2 rounded hover:bg-gray-700"
            >
              <Smile size={20} />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>
          
          {showEmojis && (
            <div className="mt-2 p-2 bg-gray-800 rounded-lg grid grid-cols-8 gap-1">
              {["😊", "👍", "❤️", "😂", "🎉", "👋", "🔥", "👏"].map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewMessage(prev => prev + emoji)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoMeet;