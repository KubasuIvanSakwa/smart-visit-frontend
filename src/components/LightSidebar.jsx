import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "./NotificationProvider";

import {
  Users,
  Clock,
  TrendingUp,
  Download,
  UserCheck,
  UserX,
  UserPlus,
  AlertCircle,
  User,
  MonitorCheck,
  LogOut,
  ChevronRight,
  Home,
  BarChart3,
  Settings,
  Calendar,
  Bell,
  PencilLine,
  X,
} from "lucide-react";

// Import the new LightSidebar component
const LightSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeNav,
  setActiveNav,
}) => {
  const { addNotification } = useNotification();
    // Initialize state from localStorage or default to true
    const navItems = [
        { id: "dashboard", icon: Home, label: "Dashboard" },
        // { id: 'visitors', icon: Users, label: 'Visitors' },
        // { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: "notifications", icon: Bell, label: "Notifications", count: 3 },
        { id: "kiosk-checkin", icon: MonitorCheck, label: "Kiosk" },
        { id: "adduser", icon: UserPlus, label: "Add User" },
        { id: "analytics", icon: BarChart3, label: "Analytics" },
        { id: "profile", icon: Settings, label: "Settings" },
      ];
    const [isExpanded, setIsExpanded] = useState(() => {
      const saved = localStorage.getItem("sidebarExpanded");
      return saved !== null ? JSON.parse(saved) : true;
    });

    const handleLogout = () => {
      addNotification("Logged out", "warning");
      localStorage.clear();
      window.location.href = "/login";
      console.log("");
    };

    const [logoImage, setLogoImage] = useState(() => {
      // Also save logo in localStorage
      const savedLogo = localStorage.getItem("dashspaceLogo");
      return savedLogo || null;
    });

    // Save to localStorage whenever isExpanded changes
    useEffect(() => {
      localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded));
    }, [isExpanded]);

    // Save logo to localStorage whenever it changes
    useEffect(() => {
      if (logoImage) {
        localStorage.setItem("dashspaceLogo", logoImage);
      } else {
        localStorage.removeItem("dashspaceLogo");
      }
    }, [logoImage]);

    const handleLogoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setLogoImage(e.target.result);
        reader.readAsDataURL(file);
      }
    };

    const handleToggleExpanded = () => {
      setIsExpanded((prevExpanded) => !prevExpanded);
    };

    return (
      <div
        className={`fixed inset-y-0 left-0 z-50 ${
          isExpanded ? "w-65" : "w-16"
        } bg-white transform shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="block w-[2.5rem] h-[2.5rem] bg-gradient-to-br border overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity"
                title="Click to upload logo"
              >
                {logoImage ? (
                  <div className="relative">
                    <img
                      src={logoImage}
                      alt="Logo"
                      className="w-[2.5rem] h-[2.5rem] rounded object-cover"
                    />
                    {/* {<div className="absolute z-4 top-1 left-1 bg-white rounded-full flex justify-center items-center p-1">
                     <PencilLine className="w-[1.3rem]"/>
                    </div>} */}
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    YN
                  </div>
                )}
              </label>
            </div>

            {/* DashSpace Text */}
            {isExpanded && (
              <h2 className="text-lg font-semibold text-gray-900 transition-opacity duration-200">
                Yunovia Group
              </h2>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleToggleExpanded}
            className="p-1 rounded-full hover:bg-gray-100 bg-white transition-colors"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <div className="w-4 h-4 border-2 border-gray-400 rounded-full relative">
              <div
                className={`absolute top-0.5 left-0.5 w-2 h-2 bg-gray-400 rounded-full transition-transform duration-200 ${
                  isExpanded
                    ? "transform translate-x-0"
                    : "transform translate-x-1"
                }`}
              ></div>
            </div>
          </button>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="px-3 pt-4">
          {/* MENU Section */}
          {isExpanded && (
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-3">
              MENU
            </div>
          )}

          {/* Dashboard */}
          <Link
            to="/dashboard"
            onClick={() => setActiveNav("dashboard")}
            className={`flex items-center ${
              isExpanded ? "px-3 justify-start" : "px-2 justify-center"
            } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors group ${
              activeNav === "dashboard"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            title={!isExpanded ? "Dashboard" : ""}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="ml-3">Dashboard</span>}
            {isExpanded && (
              <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
            )}
          </Link>

          {/* APPS Section */}
          {isExpanded && (
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 mt-6 px-3">
              APPS
            </div>
          )}

          {/* Map through your existing navItems */}
          {navItems
            .filter((item) =>
              ["notifications", "kiosk-checkin", "adduser"].includes(item.id)
            )
            .map((item) => (
              <Link
                key={item.id}
                to={`/${item.id}`}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center ${
                  isExpanded ? "px-3 justify-start" : "px-2 justify-center"
                } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors relative ${
                  activeNav === item.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={!isExpanded ? item.label : ""}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span className="ml-3">{item.label}</span>}
                {item.count && isExpanded && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
                {/* Show notification dot even when collapsed */}
                {item.count && !isExpanded && (
                  <span className="absolute top-2 right-2 bg-red-500 w-[0.6rem] h-[0.6rem] rounded-full"></span>
                )}
              </Link>
            ))}

          {/* Analytics */}
          <Link
            to="/analytics"
            onClick={() => setActiveNav("analytics")}
            className={`flex items-center ${
              isExpanded ? "px-3 justify-start" : "px-2 justify-center"
            } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors ${
              activeNav === "analytics"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            title={!isExpanded ? "Analytics" : ""}
          >
            <BarChart3 className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="ml-3">Analytics</span>}
          </Link>

          {/* PAGES Section */}
          {isExpanded && (
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 mt-6 px-3">
              PAGES
            </div>
          )}

          {/* Settings */}
          <Link
            to="/profile"
            onClick={() => setActiveNav("profile")}
            className={`flex items-center ${
              isExpanded ? "px-3 justify-start" : "px-2 justify-center"
            } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors ${
              activeNav === "profile"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            title={!isExpanded ? "Settings" : ""}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="ml-3">Settings</span>}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isExpanded ? "px-3 justify-start" : "px-2 justify-center"
            } py-2.5 text-sm font-medium text-red-400 hover:bg-red-200/20 rounded-lg transition-colors mt-6`}
            title={!isExpanded ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>
    );
  };

  export default LightSidebar;