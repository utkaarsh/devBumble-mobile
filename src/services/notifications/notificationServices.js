import api from "../../utils/api";

export const getNotifications = async ({ limit = 20, before = null } = {}) => {
  const params = {
    limit,
  };

  if (before) {
    params.before = before;
  }

  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/mark-all-read");

  return response.data;
};
