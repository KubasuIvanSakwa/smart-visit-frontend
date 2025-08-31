import React, { useState } from "react";
import { Search, Cog as Settings, Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Link } from "react-router";

export default function TopNav({ sidebarOpen, setSidebarOpen, logoImage }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Sample notifications data - in a real app, this would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New visitor check-in",
      message: "John Doe has checked in at the reception.",
      type: "visitor",
      time: "2 minutes ago",
      isRead: false,
      priority: "normal"
    },
    {
      id: 2,
      title: "System maintenance scheduled",
      message: "System maintenance is scheduled for tonight at 11 PM.",
      type: "system",
      time: "1 hour ago",
      isRead: false,
      priority: "high"
    },
    {
      id: 3,
      title: "Meeting reminder",
      message: "You have a meeting with the IT team in 15 minutes.",
      type: "meeting",
      time: "15 minutes ago",
      isRead: true,
      priority: "normal"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    console.log('Setting selected notification...');
    setSelectedNotification(notification);
    setShowNotifications(false); // Close the dropdown when opening modal
    // Mark as read when clicked
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
  };

  const handleCloseNotification = () => {
    setSelectedNotification(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'visitor':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'meeting':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative w-full">
      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-white/10 backdrop-blur-lg backdrop-saturate-150 transition-all duration-300"
              onClick={handleCloseNotification}
            ></div>

            {/* Modal Content */}
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg">
              <div className="bg-white px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h3>
                  <button
                    onClick={handleCloseNotification}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4 flex items-center space-x-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notification Details</p>
                    <p className="text-xs text-gray-500">{selectedNotification.time}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedNotification.message}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCloseNotification}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/dashboard/notifications"
                onClick={() => setShowNotifications(false)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="sticky top-0 left-0 right-0 border-white/20 bg-white/10 backdrop-blur-xl backdrop-saturate-150 z-50 px-2 sm:px-6 py-6 h-[5rem]">
        <div className="flex items-center justify-center h-[3.8rem] bg-transparent">
          <div className="flex items-center justify-between z-10 p-2 h-full w-[100%] overflow-hidden rounded-md shadow-sm bg-white">
            {/* Logo for small screens */}
            <div className="flex items-center sm:hidden mr-2">
              {logoImage ? (
                <img
                  src={logoImage}
                  alt="Logo"
                  className="w-[2.5rem] h-[2.5rem] rounded object-cover"
                />
              ) : (
                <div className="w-[2.5rem] h-[2.5rem] bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  YN
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center flex-1 min-w-0 mr-1 sm:mr-2">
              <Search className="h-4 w-4 text-gray-500 ml-1 sm:ml-3 opacity-50" />
              <input
                className="outline-none px-1 sm:px-2 text-sm placeholder:text-gray-400"
                placeholder="Search..."
              />
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5 text-gray-600 mr-1 sm:mr-4 flex-shrink-0">
              {/* Settings */}
              <Link to="/dashboard/settings">
                <Settings className="cursor-pointer hover:text-gray-800" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative cursor-pointer hover:text-gray-800"
                >
                  <Bell className="" />
                  {unreadCount > 0 && (
                    <>
                      {/* Red Dot */}
                      <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                      {/* Ping effect */}
                      <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                    </>
                  )}
                </button>
              </div>

              {/* Profile avatar */}
              <Link to="/dashboard/profile" className="w-9 h-9 rounded-full overflow-hidden border border-blue-800 cursor-pointer right-[2rem] p-1">
                <div className="bg-yellow-700 w-full h-full rounded-full"></div>
              </Link>

              {/* Hamburger menu for small screens */}
              <button
                className="sm:hidden ml-2 p-1 rounded hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
