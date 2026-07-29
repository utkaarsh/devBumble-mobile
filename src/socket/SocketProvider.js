import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/context";
import SocketContext from "./SocketContext";
import { createSocketConnection } from "../utils/socket";

const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // User logged out
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // User logged in
    const socketInstance = createSocketConnection();

    setSocket(socketInstance);

    console.log("✅ Socket connected");

    return () => {
      socketInstance.disconnect();
      console.log("❌ Socket disconnected");
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
