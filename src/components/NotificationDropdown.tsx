import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, X, Check } from 'lucide-react';

interface Notification {
  _id: string;
  type: 'opportunity_reminder' | 'forum_reply' | 'registration_confirmation' | 'system';
  title: string;
  message: string;
  relatedOpportunity?: {
    _id: string;
    title: string;
  };
  relatedForumPost?: {
    _id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: string;
}

const NotificationDropdown: React.FC = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    
    return date.toLocaleDateString();
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedOpportunity) {
      return `/opportunities/${notification.relatedOpportunity._id}`;
    }
    if (notification.relatedForumPost) {
      return `/forum/${notification.relatedForumPost._id}`;
    }
    return '#';
  };

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`p-3 border-b hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between">
                    <Link 
                      to={getNotificationLink(notification)}
                      className="flex-1"
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                    >
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatDate(notification.createdAt)}
                      </span>
                    </Link>
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="ml-2 text-gray-400 hover:text-blue-600"
                        aria-label="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 text-center border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 