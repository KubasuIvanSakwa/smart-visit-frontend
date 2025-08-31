import React, { createContext, useState, useContext } from 'react';
import Notifications from './Notfications';


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // To track the current notification id for loading toast
  const [loadingNotificationId, setLoadingNotificationId] = useState(null);

  const addNotification = (message, type = 'info') => {
    // Prevent stacking: if a notification is already shown, replace it
    setNotifications((prev) => {
      // If same message and type exists, do not add duplicate
      if (prev.length > 0) {
        const existing = prev.find(n => n.message === message && n.type === type);
        if (existing) return prev;
      }
      // Only allow one notification at a time
      return [{ id: Date.now(), message, type }];
    });

    // If this is a loading notification, save its id
    if (type === 'loading') {
      const id = Date.now();
      setLoadingNotificationId(id);
      return id;
    }

    // If this is a success notification, dismiss loading notification
    if (type === 'success' && loadingNotificationId) {
      removeNotification(loadingNotificationId);
      setLoadingNotificationId(null);
    }

    return null;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4">
        {notifications.length > 0 && (
          <Notifications
            key={notifications[0].id}
            message={notifications[0].message}
            type={notifications[0].type}
            onDismiss={() => removeNotification(notifications[0].id)}
          />
        )}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
