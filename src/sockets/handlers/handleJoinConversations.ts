import { Socket } from "socket.io";
import { ConversationsService } from "../../modules/conversations-module/conversations.service.js";

const conversationService = new ConversationsService();

export const handleJoinConversations = async (
  userId: string,
  socket: Socket,
) => {
  try {
    const conversationIds =
      await conversationService.findConversationIds(userId);

    conversationIds.forEach((id) => {
      socket.join(id);
      console.log(`User ${userId} joined room: ${id}`);
    });
  } catch (err) {
    console.error(err);
  }
};
