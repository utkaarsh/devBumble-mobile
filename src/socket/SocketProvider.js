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

    const registerUser = () => {
      socketInstance.emit("register-user", { userId: user._id });
      console.log("✅ Socket connected + registered", user._id);
    };

    // Fires on first connect AND every reconnect — room membership
    // does not survive a disconnect, so this must re-run each time.
    socketInstance.on("connect", registerUser);

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.log("⚠️ Socket connect_error:", err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect", registerUser);
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
