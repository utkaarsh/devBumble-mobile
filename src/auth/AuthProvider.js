import React, { useState, useEffect } from "react";
import AuthContext from "./context";
import { getToken, deleteToken } from "./authTokenStorage";
import { ActivityIndicator } from "react-native";
import api from "../utils/api";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  syncPushTokenWithBackend,
} from "../services/notifications/pushNotifications";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification.request.content);
      });
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification opened:",
          response.notification.request.content,
        );
      });

    registerForPushNotificationsAsync()
      .then(syncPushTokenWithBackend)
      .catch((error) => {
        console.warn("Push notification setup failed:", error.message);
      });

    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, [user]);

  const restoreSession = async () => {
    try {
      const token = await getToken();

      if (!token) return;

      const res = await api.get("/profile/view");
      setUser(res.data);
    } catch (error) {
      console.log("Catch Error :: ", error.response?.data || error.message);
      await deleteToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await deleteToken();
    setUser(null);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
