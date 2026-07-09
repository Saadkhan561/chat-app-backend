import "reflect-metadata";
import "dotenv/config";
import http from "http";
import app from "./app.js";
import { AppDataSource } from "./config/data-source.js";
import { Server } from "socket.io";
import { initChatSocket } from "./sockets/chat.socket.js";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    initChatSocket(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
