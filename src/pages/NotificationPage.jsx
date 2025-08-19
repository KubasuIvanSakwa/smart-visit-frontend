import React, { useState } from 'react';
import { 
  Bell, 
  BellRing,
  User, 
  Calendar,
  Clock, 
  Mail, 
  Phone,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Settings,
  Filter,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';

const NotificationsPage = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [filterType, setFilterType] = useState('all'); // all, meetings, system, messages
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Sample notifications data
  const initialNotifications = [
  ];

  const [notificationsState, setNotificationsState] = useState(initialNotifications);

  const getNotificationIcon = (type, priority) => {
    const iconClass = `h-5 w-5 ${
      activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
    }`;
    
    switch(type) {
      case 'meeting':
        return <Calendar className={iconClass} />;
      case 'message':
        return <Mail className={iconClass} />;
      case 'system':
        return priority === 'high' ? <AlertCircle className={iconClass} /> : <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority, isRead) => {
    if (activeTheme === 'light') {
      switch(priority) {
        case 'high':
          return isRead ? 'border-l-red-200' : 'border-l-red-500';
        case 'medium':
          return isRead ? 'border-l-yellow-200' : 'border-l-yellow-500';
        case 'low':
          return isRead ? 'border-l-gray-200' : 'border-l-gray-400';
        default:
          return 'border-l-gray-200';
      }
    } else {
      switch(priority) {
        case 'high':
          return isRead ? 'border-l-red-800' : 'border-l-red-500';
        case 'medium':
          return isRead ? 'border-l-yellow-800' : 'border-l-yellow-500';
        case 'low':
          return isRead ? 'border-l-gray-800' : 'border-l-gray-400';
        default:
          return 'border-l-gray-800';
      }
    }
  };

  const filteredNotifications = notificationsState.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    return matchesType && matchesReadStatus;
  });

  const unreadCount = notificationsState.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    // Mark as read when opened
    if (!notification.isRead) {
      setNotificationsState(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleMarkAsUnread = () => {
    if (selectedNotification) {
      setNotificationsState(prev => 
        prev.map(n => n.id === selectedNotification.id ? { ...n, isRead: false } : n)
      );
      setSelectedNotification(prev => prev ? { ...prev, isRead: false } : null);
    }
  };

  const handleDeleteNotification = () => {
    if (selectedNotification) {
      setNotificationsState(prev => 
        prev.filter(n => n.id !== selectedNotification.id)
      );
      setSelectedNotification(null);
    }
  };

  // Theme Selector
  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setActiveTheme('light')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'light' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setActiveTheme('dark')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Dark
      </button>
    </div>
  );

  // Notification Modal
  const NotificationModal = () => {
    if (!selectedNotification) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-white-200/40 backdrop-blur-sm bg-opacity-75 transition-opacity"
            onClick={handleCloseModal}
          ></div>

          {/* Modal panel */}
          <div className={`inline-block align-bottom rounded-lg text-left relative z-30 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
            activeTheme === 'light' ? 'bg-white' : 'bg-gray-900'
          }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
              activeTheme === 'light' ? 'border-gray-200' : 'border-gray-800'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {selectedNotification.avatar ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      activeTheme === 'light'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      {selectedNotification.avatar}
                    </div>
                  ) : (
                    <div className={`p-2 rounded-full ${
                      activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                    }`}>
                      {getNotificationIcon(selectedNotification.type, selectedNotification.priority)}
                    </div>
                  )}
                  <div>
                    <h3 className={`text-lg font-medium ${
                      activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {selectedNotification.title}
                    </h3>
                    <p className={`text-sm ${
                      activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {selectedNotification.time}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 rounded-full hover:bg-opacity-80 ${
                    activeTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'
                  }`}
                >
                  <X className={`h-5 w-5 ${
                    activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedNotification.type === 'meeting' 
                    ? activeTheme === 'light' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-blue-900/30 text-blue-300'
                    : selectedNotification.type === 'message'
                    ? activeTheme === 'light'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-green-900/30 text-green-300'
                    : activeTheme === 'light'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-800 text-gray-300'
                }`}>
                  {selectedNotification.type} • {selectedNotification.priority} priority
                </span>
              </div>
              
              <p className={`text-base leading-relaxed ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {selectedNotification.message}
              </p>

              {/* Additional details based on type */}
              {selectedNotification.type === 'meeting' && (
                <div className={`mt-6 p-4 rounded-lg ${
                  activeTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
                }`}>
                  <h4 className={`font-medium mb-3 ${
                    activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Meeting Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className={`h-4 w-4 ${
                        activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Today at 9:00 AM (60 minutes)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className={`h-4 w-4 ${
                        activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        TechCorp Solutions - Business Meeting
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={`px-6 py-4 border-t space-y-3 ${
              activeTheme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-800 bg-gray-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex space-x-2">
                  <button
                    onClick={handleMarkAsUnread}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      activeTheme === 'light'
                        ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {selectedNotification.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  
                  {selectedNotification.type === 'meeting' && (
                    <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTheme === 'light'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      View Meeting
                    </button>
                  )}
                </div>
                
                <button
                  onClick={handleDeleteNotification}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTheme === 'light'
                      ? 'text-red-700 hover:bg-red-50'
                      : 'text-red-400 hover:bg-red-900/20'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NotificationCard = ({ notification }) => (
    <div 
      className={`p-6 border-l-4 transition-all duration-200 hover:shadow-sm cursor-pointer ${
        getPriorityColor(notification.priority, notification.isRead)
      } ${
        activeTheme === 'light' 
          ? `bg-white border-r border-t border-b border-gray-100 hover:border-gray-200 ${
              !notification.isRead ? 'bg-blue-50/30' : ''
            }` 
          : `bg-gray-900 border-r border-t border-b border-gray-800 hover:border-gray-700 ${
              !notification.isRead ? 'bg-blue-900/10' : ''
            }`
      }`}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon or Avatar */}
          <div className={`flex-shrink-0 ${
            notification.avatar ? 'mt-1' : 'mt-0.5'
          }`}>
            {notification.avatar ? (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                activeTheme === 'light'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-800 text-gray-300'
              }`}>
                {notification.avatar}
              </div>
            ) : (
              <div className={`p-2 rounded-full ${
                activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
              }`}>
                {getNotificationIcon(notification.type, notification.priority)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-medium leading-tight ${
                activeTheme === 'light' 
                  ? notification.isRead ? 'text-gray-700' : 'text-gray-900'
                  : notification.isRead ? 'text-gray-300' : 'text-white'
              }`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 mt-2 ${
                  activeTheme === 'light' ? 'bg-blue-500' : 'bg-blue-400'
                }`} />
              )}
            </div>
            
            <p className={`text-sm leading-relaxed mb-3 ${
              activeTheme === 'light' 
                ? notification.isRead ? 'text-gray-500' : 'text-gray-600'
                : notification.isRead ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${
                activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {notification.time}
              </span>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  notification.type === 'meeting' 
                    ? activeTheme === 'light' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-blue-900/30 text-blue-400'
                    : notification.type === 'message'
                    ? activeTheme === 'light'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-green-900/30 text-green-400'
                    : activeTheme === 'light'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-gray-800 text-gray-400'
                }`}>
                  {notification.type}
                </span>
                
                <button 
                  className={`p-1 rounded hover:bg-opacity-80 ${
                    activeTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle individual notification actions here
                  }}
                >
                  <MoreHorizontal className={`h-4 w-4 ${
                    activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleBack = () => {
    // In a real app, this would navigate back
    window.history.back();
  };

  return (
    <div className={`min-h-screen ${activeTheme === 'light' ? 'bg-gray-50' : 'bg-black'}`}>
      <ThemeSelector />
      <NotificationModal />
      <button
        onClick={handleBack}
        className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm m-3 ${
          activeTheme === "light"
            ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
            : "bg-gray-900 hover:bg-gray-800 text-white border-gray-800 hover:border-gray-700"
        }`}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 relative ${
              activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
            }`}>
              <Bell className={`h-8 w-8 ${
                activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              {unreadCount > 0 && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  activeTheme === 'light' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-light mb-4 tracking-tight ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Notifications
            </h1>
            
            <p className={`text-lg max-w-lg mx-auto leading-relaxed ${
              activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Stay updated with your latest activities and messages
            </p>
          </div>

          {/* Controls */}
          <div className={`rounded-lg border p-6 mb-8 ${
            activeTheme === 'light' 
              ? 'bg-white border-gray-100' 
              : 'bg-gray-900 border-gray-800'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className={`text-2xl font-light ${
                    activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {notificationsState.length}
                  </p>
                  <p className={`text-sm ${
                    activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Total
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-light ${
                    activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {unreadCount}
                  </p>
                  <p className={`text-sm ${
                    activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Unread
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    activeTheme === 'light'
                      ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-400'
                      : 'bg-gray-800 border-gray-700 text-white focus:border-gray-600'
                  }`}
                >
                  <option value="all">All Types</option>
                  <option value="meeting">Meetings</option>
                  <option value="message">Messages</option>
                  <option value="system">System</option>
                </select>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className={`text-sm ${
                    activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Unread only
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-0 rounded-lg overflow-hidden border border-gray-100">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id} className={index !== filteredNotifications.length - 1 ? 'border-b border-gray-100' : ''}>
                  <NotificationCard notification={notification} />
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 rounded-lg border ${
              activeTheme === 'light' 
                ? 'bg-white border-gray-100' 
                : 'bg-gray-900 border-gray-800'
            }`}>
              <Bell className={`h-12 w-12 mx-auto mb-4 ${
                activeTheme === 'light' ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                No notifications found
              </h3>
              <p className={`${
                activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {filterType !== 'all' || showUnreadOnly
                  ? 'Try adjusting your filter criteria'
                  : 'You\'re all caught up!'
                }
              </p>
            </div>
          )}

          {/* Quick Actions */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 text-center">
              <button 
                className={`px-6 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light'
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => {
                  setNotificationsState(prev => 
                    prev.map(n => ({ ...n, isRead: true }))
                  );
                }}
              >
                Mark All as Read
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;