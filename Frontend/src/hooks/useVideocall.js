import React, { useState, useEffect, useRef } from "react";
import { useSocketContext } from "../Context/SocketContext";
import { toast } from "react-toastify";

const useVideocall = (meetingId) => {
  const { socket } = useSocketContext();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const peerConnectionRef = useRef(null);

  const startCall = async () => {
    if (!socket || !socket.connected) {
      console.error("Socket not connected when starting call");
      toast.error("Cannot start call: Server not connected. Please try again.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate && socket.connected) {
          socket.emit("ice-candidate", { candidate: event.candidate, meetingId });
        } else {
          console.warn("Socket not connected when sending ICE candidate");
        }
      };

      pc.ontrack = (event) => {
        console.log("Received remote stream");
        setRemoteStream(event.streams[0]);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { offer, meetingId });

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
    if (socket && socket.connected) {
      socket.emit("leave-meeting", meetingId);
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
  };

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not available in useEffect");
      return;
    }

    // Wait for socket to connect before setting up listeners
    const setupListeners = () => {
      if (!socket.connected) {
        console.warn("Socket exists but not connected in useEffect");
        return;
      }

      console.log("Setting up WebRTC listeners for meeting:", meetingId);

      socket.on("offer", async ({ offer, from }) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        console.log(`Received offer from ${from}`);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { answer, meetingId });
      });

      socket.on("answer", ({ answer }) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          console.log("Received answer");
          pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", ({ candidate }) => {
        const pc = peerConnectionRef.current;
        if (pc) {
          console.log("Received ICE candidate");
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on("user-left", () => { // Match server.js event name
        console.log("User left the meeting");
        setRemoteStream(null);
        setIsCallActive(false);
      });
    };

    // Set up listeners when socket connects
    if (socket.connected) {
      setupListeners();
    } else {
      socket.on("connect", () => {
        console.log("Socket connected, setting up listeners");
        setupListeners();
      });
    }

    // Cleanup
    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("connect");
      if (isCallActive) endCall();
    };
  }, [socket, meetingId, isCallActive]);

  return { localStream, remoteStream, isCallActive, startCall, endCall };
};

export default useVideocall;