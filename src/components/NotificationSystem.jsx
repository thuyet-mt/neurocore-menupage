import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const timeoutIdsRef = React.useRef([]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, notification]);
    // Auto remove after duration
    const timeoutId = setTimeout(() => {
      removeNotification(id);
    }, duration);
    timeoutIdsRef.current.push(timeoutId);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Expose addNotification globally
  useEffect(() => {
    window.addNotification = addNotification;
    return () => {
      delete window.addNotification;
      // Cleanup all timeouts
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, []);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            <span className="notification-message">
              {notification.message}
            </span>
            <button 
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem; 