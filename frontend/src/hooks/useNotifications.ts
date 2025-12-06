import { useState, useEffect } from 'react';
import type { NotificationItem } from '@/shared/types';
import { mockNotifications } from '@/utils/mockData';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadNotifications = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications(mockNotifications);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  const markAsRead = (id: string): void => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = (): void => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string): void => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getUnreadCount = (): number => {
    return notifications.filter(n => !n.isRead).length;
  };

  const getUnreadNotifications = (): NotificationItem[] => {
    return notifications.filter(n => !n.isRead);
  };

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getUnreadNotifications,
  };
};
