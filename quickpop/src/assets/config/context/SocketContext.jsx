import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/auth';
import * as notificationService from '../services/notifications.js';
import { SocketContext } from './useSocket';
import { Bell, CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.toastId !== toastId));
  }, []);

  const addToast = useCallback((notification) => {
    const toastId = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...notification, toastId }]);
    
    // Auto remove after 5s
    setTimeout(() => {
        removeToast(toastId);
    }, 5000);
  }, [removeToast]);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
        notificationService.getNotifications()
            .then(res => {
                setNotifications(Array.isArray(res) ? res : []);
            })
            .catch(err => console.error("Failed to fetch notifications", err));
    } else {
        // Avoid synchronous state update warning
        setTimeout(() => setNotifications([]), 0);
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

    setTimeout(() => setSocket(newSocket), 0);

    return () => newSocket.close();
  }, []);

  // Handle App Badge
  const updateAppBadge = useCallback((currentNotifications) => {
      if ('setAppBadge' in navigator) {
          const unreadCount = currentNotifications.filter(n => !n.read_at).length;
          if (unreadCount > 0) {
              navigator.setAppBadge(unreadCount).catch(e => console.error("Badge error:", e));
          } else {
              navigator.clearAppBadge().catch(e => console.error("Badge clear error:", e));
          }
      }
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

    const handleNotification = async (notification) => {
        console.log('New notification:', notification);
        setNotifications(prev => {
            const updated = [notification, ...prev].slice(0, 20);
            updateAppBadge(updated);
            return updated;
        });
        addToast(notification);
        
        // Native/System Notification
        if ("Notification" in window && Notification.permission === "granted") {
             try {
                 // Try using Service Worker registration for better mobile support
                 const registration = await navigator.serviceWorker.ready;
                 if (registration && registration.showNotification) {
                     await registration.showNotification(notification.title, {
                         body: notification.body,
                         icon: '/imgs/logo-512.png',
                         badge: '/imgs/badge.png', // Small icon for status bar
                         vibrate: [200, 100, 200],
                         tag: 'quickpop-notification',
                         renotify: true,
                         data: { url: notification.url || '/app' }
                     });
                 } else {
                     // Fallback to standard API
                     new Notification(notification.title, { 
                         body: notification.body,
                         icon: '/imgs/logo-512.png',
                         badge: '/imgs/badge.png',
                         vibrate: [200, 100, 200]
                     });
                 }
             } catch (e) {
                 console.error("Notification error:", e);
                 // Fallback
                 new Notification(notification.title, { body: notification.body });
             }
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
  }, [socket, user, addToast, updateAppBadge]);

  useEffect(() => {
      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
      }
      
      // Initial badge update
      if (notifications.length > 0) {
          updateAppBadge(notifications);
      }
  }, [notifications]);

  const markNotificationAsRead = async (id) => {
    try {
        await notificationService.markAsRead(id);
        setNotifications(prev => {
            const updated = prev.map(n => 
                n.id === id ? { ...n, read_at: new Date().toISOString(), status: 'read' } : n
            );
            updateAppBadge(updated);
            return updated;
        });
    } catch (error) {
        console.error("Failed to mark notification as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      case 'error': return <AlertCircle size={20} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      default: return <Bell size={20} className="text-blue-500" />;
    }
  };

  const getGradient = (type) => {
    switch (type) {
        case 'success': return 'from-green-500/20 to-green-500/5';
        case 'error': return 'from-red-500/20 to-red-500/5';
        case 'warning': return 'from-amber-500/20 to-amber-500/5';
        default: return 'from-blue-500/20 to-blue-500/5';
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications, markNotificationAsRead, onlineUsers }}>
      {children}
      
      {/* Toast Container - Centered Top */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
         {toasts.map(t => (
            <div 
                key={t.toastId} 
                className="pointer-events-auto w-full transform transition-all duration-500 animate-in slide-in-from-top-10 fade-in zoom-in-95"
            >
                <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-black/5 rounded-3xl p-1">
                    {/* Animated Border Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(t.type)} opacity-50`} />
                    
                    <div className="relative bg-white/60 backdrop-blur-xl rounded-[1.3rem] p-4 flex items-start gap-4">
                        {/* Icon Bubble */}
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-white rounded-full blur-md opacity-80 animate-pulse" />
                            <div className="relative w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                                {getIcon(t.type)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                            <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{t.title}</h4>
                            <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2">{t.body}</p>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={() => removeToast(t.toastId)}
                            className="shrink-0 p-1.5 hover:bg-black/5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-1 right-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-gradient-to-r ${getGradient(t.type).replace('/20', '').replace('/5', '')} origin-left animate-progress`}
                            style={{ animationDuration: '5000ms', animationTimingFunction: 'linear', animationFillMode: 'forwards' }}
                        />
                    </div>
                </div>
            </div>
         ))}
      </div>
      
      <style>{`
        @keyframes progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
        .animate-progress {
            animation-name: progress;
        }
      `}</style>
    </SocketContext.Provider>
  );
};
