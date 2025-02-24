import { io } from "socket.io-client";
import { getCookie } from "./cookies";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  auth: {
    token: getCookie("jwt"), // Pass the JWT token for authentication
  },
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;