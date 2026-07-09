import { Server } from "socket.io";

let io: Server;

export const setSocketInstance = (socketInstance: Server) => {
  io = socketInstance;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket instance not created");
  }
  return io;
};
