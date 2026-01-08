import * as notificationsModel from '../models/notificationsModel.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationsModel.getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationsModel.markNotificationRead(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await notificationsModel.markAllNotificationsRead(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendBroadcastNotification = async (req, res) => {
  try {
    const { title, body, type, url } = req.body;
    
    // 1. Create in DB for all users
    await notificationsModel.createBroadcastNotification({ title, body, type, url });

    // 2. Emit via Socket.io to all connected clients
    if (req.io) {
      req.io.emit('notification', {
        id: Date.now(), // Temporary ID for realtime
        title,
        body,
        type,
        url,
        created_at: new Date()
      });
    }

    res.json({ success: true, message: 'Notification broadcasted' });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
