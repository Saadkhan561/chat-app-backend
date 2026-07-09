import { Socket } from "socket.io";

export const handleJoinConversation = (
  socket: Socket,
  conversationId: string,
  userId: string,
) => {
  socket.join(conversationId);
  console.log(`${userId} joined ${conversationId}`);
};
