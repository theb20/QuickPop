import api from "../api.js";

export const getNotifications = async () => {
  return await api.get("/notifications");
};

export const markAsRead = async (id) => {
  return await api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return await api.put("/notifications/read-all");
};

export const sendBroadcastNotification = async (data) => {
  return await api.post("/notifications/broadcast", data);
};
