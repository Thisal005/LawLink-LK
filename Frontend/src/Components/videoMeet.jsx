import React, {useEffect, useRef} from "react";
import useVideocall from "../hooks/useVideocall";

const videoMeet = ({meetingId}) => {
    const { localStream, remoteStream, isCallActive, startCall, endCall } = useVideocall(meetingId);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if(localStream) localVideoRef.current.srcObject = localStream;
        if(remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    }, [localStream, remoteStream]);

    return(
        <div className="video-call p-4 bg-gray-100 rounded-lg shadow-md">
            {isCallActive ? (
                <button
                onClick={startCall}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Join Meeting
                </button>
            ) : (
                <>
                <div className="flex gap-4">
                    <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-1/2 h-64 rounded shadow-md"
                    />
                    <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-1/2 h-64 rounded shadow-md"
                    />
                    <button
                    onClick={endCall}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        End Call
                    </button>
                </div>
                </>
                
            )}
        </div>
    );

};

export default videoMeet;