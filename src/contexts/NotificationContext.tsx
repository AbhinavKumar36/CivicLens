import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationGroup = 'system' | 'alert' | 'message';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  group: NotificationGroup;
  read: boolean;
  timestamp: number;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'civiclens_notifications';

// Initial Mock Notifications
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'init-1',
    title: 'Traffic Alert',
    message: 'High congestion detected on Sector 4 Junction.',
    type: 'warning',
    group: 'alert',
    read: false,
    timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
  },
  {
    id: 'init-2',
    title: 'Permit Approved',
    message: 'Your building permit #8492 has been approved.',
    type: 'success',
    group: 'message',
    read: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  }
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Real-time Simulation Engine
  useEffect(() => {
    const timer = setInterval(() => {
      // 10% chance every 10 seconds to generate a notification
      if (Math.random() > 0.9) {
        const events = [
          { title: 'Water Pressure Drop', msg: 'Sensors detect an anomaly in District 3.', t: 'error', g: 'alert' },
          { title: 'Payment Received', msg: 'Thank you for paying your Property Tax.', t: 'success', g: 'message' },
          { title: 'AI Recommendation', msg: 'Optimal routing suggested for daily commute.', t: 'info', g: 'system' }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        addNotification({
          title: event.title,
          message: event.msg,
          type: event.t as NotificationType,
          group: event.g as NotificationGroup
        });
      }
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
