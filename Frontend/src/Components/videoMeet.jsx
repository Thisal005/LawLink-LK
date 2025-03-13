import React, { useEffect, useRef, useState } from "react";
import useVideocall from "../hooks/useVideocall";

const VideoMeet = ({ meetingId }) => {
  const { localStream, remoteStream, isCallActive, startCall, endCall, error } = useVideocall(meetingId);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callError, setCallError] = useState(null);

  useEffect(() => {
    if (localStream) localVideoRef.current.srcObject = localStream;
    if (remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    if (error) setCallError(error);
  }, [localStream, remoteStream, error]);

  return (
    <div className="video-call p-4 bg-gray-100 rounded-lg shadow-md">
      {callError && <p className="text-red-500 mb-2">{callError}</p>}
      {!isCallActive ? (
        <button
          onClick={startCall}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Join Meeting
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <video ref={localVideoRef} autoPlay muted className="w-1/2 h-64 rounded shadow-md" />
            <video ref={remoteVideoRef} autoPlay className="w-1/2 h-64 rounded shadow-md" />
          </div>
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoMeet;