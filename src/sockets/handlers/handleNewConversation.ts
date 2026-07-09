import { Server } from "socket.io";

export const handleNewConversation = (
  io: Server,
  otherUserSockets: Set<string>,
  convoId: string,
) => {
  otherUserSockets.forEach((socket) => {
    io.of("/chat").to(socket).emit("new-conversation", {
      conversationId: convoId,
    });
  });
};
