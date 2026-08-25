import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import api from "../../utils/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  console.log("\n");
  console.log("====================================");
  console.log("\n");

  console.log("function called : registerForPushNotificationsAsync");

  if (Platform.OS === "web") {
    console.log("Push notifications are not supported on web");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFB703",
    });
  }

  const permissions = await Notifications.getPermissionsAsync();

  console.log("permission status:", permissions.status);

  let finalStatus = permissions.status;

  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;

    console.log("requested permission:", finalStatus);
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  console.log("Notification permission granted");

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;

  console.log("Expo project ID:", projectId);

  if (!projectId) {
    console.error("Expo project ID not found");
    return null;
  }
  console.log("Before token call ");
  let token;
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    token = tokenData;
    console.log("Expo push token:", token);
  } catch (error) {
    console.error("Expo push token error", error);
  }

  console.log("\n");
  console.log("====================================");
  console.log("\n");
  return token?.data ?? null;
}

export async function syncPushTokenWithBackend(token) {
  if (!token) return;

  await api.post("/notifications/push-token", {
    token,
    platform: Platform.OS,
  });
}
