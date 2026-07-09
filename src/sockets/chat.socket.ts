import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { SendMsgPayload } from "../interfaces/socket.interface.js";
import { handleJoinConversations } from "./handlers/handleJoinConversations.js";
import { handleSendMessage } from "./handlers/handleSendMessage.js";
import { handleDisconnect } from "./handlers/handleDisconnect.js";
import { handleNewConversation } from "./handlers/handleNewConversation.js";
import { handleJoinConversation } from "./handlers/handleJoinConversation.js";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const initChatSocket = (io: Server) => {
  const users = new Map<string, Set<string>>();

  const getUserId = (socket: Socket): string => {
    const token = socket.handshake.auth?.accessToken;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return payload.userId;
  };

  io.of("/chat").on("connection", (socket: Socket) => {
    let userId: string;

    try {
      userId = getUserId(socket);
    } catch (err) {
      socket.disconnect();
      return;
    }

    if (!users.has(userId)) {
      users.set(userId, new Set());
    }

    users.get(userId)!.add(socket.id);

    console.log("Connected users:", users);

    socket.on("disconnect", () => {
      handleDisconnect(users, socket);
    });

    socket.on("join-conversation", () => {
      handleJoinConversations(userId, socket);
    });

    socket.on("send-message", (data: SendMsgPayload) => {
      handleSendMessage(data, io, userId);
    });

    socket.on(
      "create-conversation",
      (data: { conversationId: string; otherUserId: string }) => {
        const userSockets = users.get(data.otherUserId);
        handleJoinConversation(socket, data.conversationId, userId);
        handleNewConversation(
          io,
          userSockets ?? new Set(),
          data.conversationId,
        );
      },
    );

    socket.on("join-new-conversation", (data: { conversationId: string }) => {
      handleJoinConversation(socket, data.conversationId, userId);
    });
  });
};
