import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  autoConnect: true,
});

socket.on("connect", () => {
    console.log("Connected to the signaling server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from the signaling server");
});