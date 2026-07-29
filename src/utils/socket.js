import { io } from "socket.io-client";
import { path } from "./path";

export const createSocketConnection = () => {
  return io(path);
};
