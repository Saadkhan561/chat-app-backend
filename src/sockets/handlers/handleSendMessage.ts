import { Server } from "socket.io";
import { SendMsgPayload } from "../../interfaces/socket.interface.js";

export const handleSendMessage = (
  data: SendMsgPayload,
  io: Server,
  userId: string,
) => {
  io.of("/chat").to(data.conversationId).emit("receive-msg", {
    from: userId,
    message: data.message,
  });
};
