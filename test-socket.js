import { io } from "socket.io-client";
const socket = io("http://localhost:5000/chat", {
    auth: {
        accessToken: "your_jwt_token", // or remove if testing
    },
});
socket.on("connect", () => {
    console.log("Connected:", socket.id);
    socket.emit("join-conversation");
    socket.emit("send-message", {
        message: "Hello from client",
        conversationId: "test-id",
    });
});
socket.on("receive-msg", (data) => {
    console.log("Received:", data);
});
socket.on("connect_error", (err) => {
    console.log("Error:", err.message);
});
//# sourceMappingURL=test-socket.js.map