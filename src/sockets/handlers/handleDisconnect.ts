import { Socket } from "socket.io";

export const handleDisconnect = (
  users: Map<string, Set<string>>,
  socket: Socket,
) => {
  for (const [uid, sockets] of users.entries()) {
    if (sockets.has(socket.id)) {
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        users.delete(uid);
      }
      break;
    }
  }
};
