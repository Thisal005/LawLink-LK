import React ,{ useState, useEffect, useRef } from "react";
import { useSocketContext } from "../Context/SocketContext";
import { toast } from "react-toastify";


const useVideocall = (meetingId) => {
    const {socket} = useSocketContext();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const peerConnectionRef = useRef(null);
    const [isCallActive, setIsCallActive] = useState(false);

    const startCall =  async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });
            peerConnectionRef.current = pc;

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { candidate: event.candidate, meetingId });
                }
            };

            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            //Send Offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("offer", { offer, meetingId });

            //Join Meeting
            socket.emit("join-meeting", meetingId);

            setIsCallActive(true);
        } catch (error) {
            console.error("Error starting video call:", error);
            toast.error("Failed to start video call. Please try again.");
        }
    };

    const endCall = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        socket.emit("leave-meeting", meetingId);
        setIsCallActive(false);
        setLocalStream(null);
        setRemoteStream(null);
    };

    useEffect(() => {
        if(!socket) return;

        socket.on("offer", async ({offer, from}) => {
            const pc = peerConnectionRef.current;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { answer, meetingId });
        });

        socket.on("answer", ({answer}) => {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", ({candidate}) => {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("user-disconnected", () => {
            setRemoteStream(null);
            setIsCallActive(false);
        });

        return () => {
            if (isCallActive) endCall();
        };

    }, [socket,meetingId,isCallActive]);

    return {localStream, remoteStream, isCallActive, startCall, endCall};
};

export default useVideocall;
   