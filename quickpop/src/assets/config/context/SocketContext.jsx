import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/auth';
import * as notificationService from '../services/notifications.js';
import { SocketContext } from './useSocket';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
        notificationService.getNotifications()
            .then(res => {
                setNotifications(Array.isArray(res) ? res : []);
            })
            .catch(err => console.error("Failed to fetch notifications", err));
    } else {
        setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    // Only connect if we have a user? Or connect always but authenticate?
    // Let's connect always but join room when user is present
    
    const token = localStorage.getItem('token');
    // Determine API URL based on environment
    // In dev, usually localhost:3000 (backend) if frontend is 5173
    // But here backend seems to run on same port or proxy?
    // Let's assume standard Vite proxy or check api.js
    
    // api.js uses import.meta.env.VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '/');

    const newSocket = io(apiUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'] // fallback
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    const joinRoom = () => {
        socket.emit('join_room', `user_${user.id}`);
    };

    if (socket.connected) {
        joinRoom();
    }
    
    // Always listen for connect to rejoin on reconnection
    socket.on('connect', joinRoom);

    const handleNotification = (notification) => {
        console.log('New notification:', notification);
        setNotifications(prev => [notification, ...prev].slice(0, 20));
        
        // Browser notification if supported and granted
        if ("Notification" in window && Notification.permission === "granted") {
             new Notification(notification.title, { body: notification.body });
        }
    };

    socket.on('notification', handleNotification);

    socket.on('online_users', (users) => {
        setOnlineUsers(users);
    });

    return () => {
      socket.off('connect', joinRoom);
      socket.off('notification', handleNotification);
      socket.off('online_users');
    };
  }, [socket, user]);

  useEffect(() => {
      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
      }
  }, []);

  const markNotificationAsRead = async (id) => {
    try {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, read_at: new Date().toISOString(), status: 'read' } : n
        ));
    } catch (error) {
        console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications, markNotificationAsRead, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
