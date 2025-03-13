import React, { useEffect, useRef, useState } from "react";
import useVideocall from "../hooks/useVideocall";
import { toast } from "react-toastify";
import axios from "axios";
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Settings, Users } from "lucide-react";

const VideoMeet = ({ meetingId, userName }) => {
  const { 
    localStream, 
    remoteStream, 
    isCallActive, 
    startCall, 
    endCall,
    toggleMute,
    toggleVideo 
  } = useVideocall(meetingId);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);

  useEffect(() => {
    if (meetingId) {
      fetchMeetingInfo();
    }
  }, [meetingId]);

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

  const handleStartCall = async () => {
    try {
      setLoading(true);
      await startCall();
      setCallStarted(true);
      
      // Record that user joined the meeting
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

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Meeting header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-semibold">
            {meetingInfo?.title || `Meeting: ${meetingId}`}
          </h2>
          <p className="text-gray-400 text-sm">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Participants"
          >
            <Users size={18} />
          </button>
          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Meeting content */}
      <div className="flex-1 p-4">
        {!callStarted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-xl mb-4">Ready to join?</h3>
            <button
              onClick={handleStartCall}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Connecting..." : "Join Meeting"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Remote video (primary) */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden col-span-full md:col-span-1 aspect-video">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                  Participant
                </div>
              </div>

              {/* Local video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden col-span-full md:col-span-1 aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${!videoEnabled ? "hidden" : ""}`}
                />
                {!videoEnabled && (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl">
                      {userName?.charAt(0).toUpperCase() || "Y"}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                  You {!audioEnabled && "(Muted)"}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 py-4">
              <button
                onClick={handleToggleAudio}
                className={`p-4 rounded-full ${
                  audioEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
                }`}
                title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button
                onClick={handleToggleVideo}
                className={`p-4 rounded-full ${
                  videoEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
                }`}
                title={videoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {videoEnabled ? <Camera size={24} /> : <CameraOff size={24} />}
              </button>
              <button
                onClick={handleEndCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700"
                title="Leave meeting"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Participants sidebar could go here */}
    </div>
  );
};

export default VideoMeet;