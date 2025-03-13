import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [peerConnection, setPeerConnection] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      console.log("Connecting to WebSocket with userId:", user._id);
      const newSocket = io("http://localhost:5000", {
        query: {
          userId: user._id,
          name: user?.name || "",
        },
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
        setSocket(null);
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("newMessage", (newMessage) => {
        const message = {
          ...newMessage,
          shouldShake: true,
          createdAt: Date.now(),
        };
        useConversation.setState((prev) => ({
          messages: [...prev.messages, message],
        }));
      });

      setSocket(newSocket);

      // Cleanup
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // WebRTC setup
  const startVideoCall = async (roomId) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);
    setPeerConnection(pc);

    // Get local stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    document.getElementById("localVideo").srcObject = stream;

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    // Join room
    socket.emit("join-room", roomId);

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { offer, roomId });

    // Handle incoming signaling
    socket.on("offer", async ({ offer, from }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { answer, roomId });
    });

    socket.on("answer", ({ answer }) => {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", ({ candidate }) => {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  return (
    <SocketContext.Provider value={{ socket, startVideoCall }}>
      {children}
    </SocketContext.Provider>
  );
};