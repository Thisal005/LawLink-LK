import { useState, useEffect, useRef } from "react";
import { useSocketContext } from "../Context/SocketContext";
import axios from "axios";

const useVideocall = (meetingId) => {
  const { socket } = useSocketContext();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState(null);
  const peerConnectionRef = useRef(null);

  const startCall = async () => {
    if (!socket || !socket.connected) {
      setError("Server not connected. Please try again.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit("ice-candidate", { candidate: event.candidate, meetingId });
      };
      pc.ontrack = (event) => setRemoteStream(event.streams[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { offer, meetingId });
      socket.emit("join-meeting", meetingId);

      await axios.put(
        "http://localhost:5000/api/meetings/status",
        { meetingId, status: "ongoing" },
        { withCredentials: true }
      );

      setIsCallActive(true);
    } catch (err) {
      console.error("Error starting call:", err);
      setError("Failed to start video call. Check permissions or try again.");
    }
  };

  const endCall = async () => {
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

    try {
      await axios.put(
        "http://localhost:5000/api/meetings/status",
        { meetingId, status: "completed" },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error updating meeting status:", err);
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
  };

  useEffect(() => {
    if (!socket) return;

    const setupListeners = () => {
      socket.on("offer", async ({ offer, from }) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { answer, meetingId });
        } catch (err) {
          setError("Failed to process offer");
        }
      });

      socket.on("answer", ({ answer }) => {
        const pc = peerConnectionRef.current;
        if (pc) pc.setRemoteDescription(new RTCSessionDescription(answer)).catch(() => setError("Failed to process answer"));
      });

      socket.on("ice-candidate", ({ candidate }) => {
        const pc = peerConnectionRef.current;
        if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => setError("Failed to add ICE candidate"));
      });

      socket.on("user-left", () => {
        setRemoteStream(null);
        setIsCallActive(false);
      });

      socket.on("error", (msg) => setError(msg));
    };

    if (socket.connected) setupListeners();
    else socket.on("connect", setupListeners);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("error");
      socket.off("connect");
      if (isCallActive) endCall();
    };
  }, [socket, meetingId, isCallActive]);

  return { localStream, remoteStream, isCallActive, startCall, endCall, error };
};

export default useVideocall;