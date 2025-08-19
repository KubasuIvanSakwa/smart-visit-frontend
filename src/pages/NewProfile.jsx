import React, { useEffect, useState } from 'react';
import { 
  User, Settings, Save, Edit3, Eye, EyeOff, Shield, Users, 
  Clock, TrendingUp, Download, UserCheck, UserX, UserPlus, 
  AlertCircle, Bell, Lock, Mail, Phone, Building, Calendar,
  Check, X, ChevronRight, Camera, Home, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../components/NotificationProvider';


// User profiles data
const USERS = [
  
];

// Available permissions
const AVAILABLE_PERMISSIONS = {
  
};

// Default role permissions
const DEFAULT_ROLE_PERMISSIONS = {
  admin: Object.keys(AVAILABLE_PERMISSIONS),
  receptionist: ['totalCheckedIn', 'totalCheckedOut', 'walkInsVsPreRegistered', 'pendingApprovals'],
  security: ['currentVisitors', 'totalCheckedIn', 'totalCheckedOut', 'todayCheckIns'],
  manager: ['currentVisitors', 'avgVisitDuration', 'todayCheckIns', 'monthlyTotal', 'exportReports']
};

const NewProfile = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const { addNotification } = useNotification();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [availablePermissions, setAvailablePermissions] = useState({});
  const [loading, setLoading] = useState({
    users: false,
    permissions: false,
    profile: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    visitorCheckIn: true,
    pendingApprovals: true,
    systemUpdates: false
  });

const fetchCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    addNotification('Authentication required', 'error');
    return;
  }

  setLoading(prev => ({ ...prev, profile: true }));
  try {
    const response = await axios.get('https://smart-visit-backend.onrender.com/api/auth/user/profile/', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    setCurrentUser(response.data);
  } catch (error) {
    console.error('Profile fetch error:', error);
    
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        addNotification('Session expired. Please login again.', 'error');
        // Handle token expiration (redirect to login)
      } else if (error.response.status === 500) {
        addNotification('Server error. Please contact support.', 'error');
        console.error('Server error details:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      addNotification('Network error. Please check your connection.', 'error');
    } else {
      // Setup error
      addNotification('Error setting up request', 'error');
    }
  } finally {
    setLoading(prev => ({ ...prev, profile: false }));
  }
};

  const fetchPermissions = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      addNotification('Authentication required', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, permissions: true }));
    try {
      const response = await axios.get('https://smart-visit-backend.onrender.com/api/auth/permissions/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Assuming response.data has structure:
      // { availablePermissions: {...}, rolePermissions: {...} }
      setAvailablePermissions(response.data.availablePermissions || {});
      setRolePermissions(response.data.rolePermissions || {});
    } catch (error) {
      addNotification('Failed to fetch permissions', 'error');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, permissions: false }));
    }
  };

  const handleFetchUsers = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      addNotification('You must be logged in to fetch users.', 'error');
      return;
    }

    try {
      const response = await axios.get('https://smart-visit-backend.onrender.com/api/auth/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data);
        addNotification('Users loaded successfully!', 'success');
        console.log(response.data);
      } else {
        throw new Error('Unexpected response from server.');
      }

    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || error.message || 'Failed to fetch users.',
        'error'
      );
    }
  };

  const handleFetchUserProfile = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      addNotification('You must be logged in to fetch user profile.', 'error');
      return;
    }

    try {
      const response = await axios.get('https://smart-visit-backend.onrender.com/api/auth/user/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setEditingUser(response.data);
        addNotification('User profile loaded successfully!', 'success');
        console.log(response.data);
      } else {
        throw new Error('Unexpected response from server.');
      }

    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || error.message || 'Failed to fetch user profile.',
        'error'
      );
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchCurrentUser();
      await fetchUsers();
      await fetchPermissions();
    };

    fetchAllData();
  }, []);

  const handleSaveProfile = (userId, updatedData) => {
    setUsers(users?.map(user => 
      user.id === userId ? { ...user, ...updatedData } : user
    ));
    setEditingUser(null);
  };

  const handlePermissionChange = (role, permissionId, enabled) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: enabled 
        ? [...prev[role], permissionId]
        : prev[role].filter(p => p !== permissionId)
    }));
  };

  const handleGoHome = () => {
    window.history.back()
  };

  // Theme Selector
  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setActiveTheme('light')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'light' 
            ? 'bg-gray-900 text-white dark:bg-white dark:text-black' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setActiveTheme('dark')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'dark' 
            ? 'bg-gray-900 text-white dark:bg-white dark:text-black' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        Dark
      </button>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-4 rounded-lg font-medium transition-all duration-200 w-full ${
        active 
          ? activeTheme === 'light'
            ? 'bg-gray-900 text-white shadow-sm' 
            : 'bg-white text-black shadow-sm'
          : activeTheme === 'light'
            ? 'text-gray-700 hover:bg-gray-100 border border-gray-200'
            : 'text-gray-300 hover:bg-gray-800 border border-gray-700'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  const ProfileSection = () => {
    // Loading state
    if (loading.profile) {
      return (
        <div className="space-y-8">
          <div className={`rounded-lg p-8 border transition-all duration-200 ${
            activeTheme === 'light' 
              ? 'bg-white border-gray-100 shadow-sm' 
              : 'bg-gray-900 border-gray-800 shadow-sm'
          }`}>
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse flex flex-col items-center space-y-4">
                <div className={`h-24 w-24 rounded-full ${
                  activeTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}></div>
                <div className={`h-6 w-48 rounded ${
                  activeTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}></div>
                <div className={`h-4 w-64 rounded ${
                  activeTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                }`}></div>
              </div>
            </div>
          </div>
          <div className={`rounded-lg p-8 border transition-all duration-200 ${
            activeTheme === 'light' 
              ? 'bg-white border-gray-100 shadow-sm' 
              : 'bg-gray-900 border-gray-800 shadow-sm'
          }`}>
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className={`h-4 w-24 mb-2 rounded ${
                    activeTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                  }`}></div>
                  <div className={`h-10 w-full rounded ${
                    activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (!currentUser) {
      return (
        <div className="space-y-8">
          <div className={`rounded-lg p-8 border transition-all duration-200 ${
            activeTheme === 'light' 
              ? 'bg-white border-gray-100 shadow-sm' 
              : 'bg-gray-900 border-gray-800 shadow-sm'
          }`}>
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className={`h-12 w-12 ${
                activeTheme === 'light' ? 'text-red-500' : 'text-red-400'
              }`} />
              <h3 className={`text-xl font-medium ${
                activeTheme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Failed to load profile data
              </h3>
              <p className={`text-center ${
                activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                We couldn't load your profile information. Please try again later.
              </p>
              <button
                onClick={fetchCurrentUser}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTheme === 'light'
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-white hover:bg-gray-100 text-black'
                }`}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Success state
    return (
      <div className="space-y-8">
        {/* Profile Header */}
        <div className={`rounded-lg p-8 border transition-all duration-200 ${
          activeTheme === 'light' 
            ? 'bg-white border-gray-100 shadow-sm' 
            : 'bg-gray-900 border-gray-800 shadow-sm'
        }`}>
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
              }`}>
                {currentUser.profile_picture ? (
                  <img 
                    src={currentUser.profile_picture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className={`h-12 w-12 ${
                    activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                )}
              </div>
              <button className={`absolute -bottom-2 -right-2 p-2 rounded-full transition-colors ${
                activeTheme === 'light' 
                  ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                  : 'bg-white hover:bg-gray-100 text-black'
              }`}>
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-medium mb-1 ${
                activeTheme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {currentUser.first_name} {currentUser.last_name}
              </h2>
              <p className={`mb-3 ${
                activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {currentUser.role?.charAt(0)?.toUpperCase() + currentUser.role?.slice(1)} • {currentUser.department || 'No department'}
              </p>
              <div className={`flex items-center space-x-4 text-sm ${
                activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{currentUser.phone}</span>
                </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditingUser(currentUser.id)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 ${
                activeTheme === 'light'
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-white hover:bg-gray-100 text-black'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className={`rounded-lg p-8 border transition-all duration-200 ${
          activeTheme === 'light' 
            ? 'bg-white border-gray-100 shadow-sm' 
            : 'bg-gray-900 border-gray-800 shadow-sm'
        }`}>
          <h3 className={`text-lg font-medium mb-6 ${
            activeTheme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'First Name', value: currentUser.first_name || 'Not set' },
              { label: 'Last Name', value: currentUser.last_name || 'Not set' },
              { label: 'Email Address', value: currentUser.email || 'Not set' },
              { label: 'Phone Number', value: currentUser.phone || 'Not set' },
              { label: 'Department', value: currentUser.department || 'Not set' },
              { label: 'Role', value: currentUser.role || 'Not set' },
              { label: 'Join Date', value: currentUser.date_joined ? new Date(currentUser.date_joined).toLocaleDateString() : 'Not set' },
              { label: 'Last Login', value: currentUser.last_login || 'Not set' }
            ].map((field, index) => (
              <div key={index}>
                <label className={`block text-sm font-medium mb-2 ${
                  activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  disabled
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    activeTheme === 'light' 
                      ? 'border-gray-200 bg-gray-50 text-gray-900' 
                      : 'border-gray-700 bg-gray-800 text-gray-300'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className={`rounded-lg p-8 border transition-all duration-200 ${
          activeTheme === 'light' 
            ? 'bg-white border-gray-100 shadow-sm' 
            : 'bg-gray-900 border-gray-800 shadow-sm'
        }`}>
          <h3 className={`text-lg font-medium mb-6 ${
            activeTheme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Change Password
          </h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 rounded-lg border pr-12 transition-colors ${
                    activeTheme === 'light' 
                      ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                      : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? 
                    <EyeOff className={`h-5 w-5 ${activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} /> : 
                    <Eye className={`h-5 w-5 ${activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                  }
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                }`}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Confirm New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                }`}
                placeholder="Confirm new password"
              />
            </div>
            <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTheme === 'light'
                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationsSection = () => (
    <div className={`rounded-lg p-8 border transition-all duration-200 ${
      activeTheme === 'light' 
        ? 'bg-white border-gray-100 shadow-sm' 
        : 'bg-gray-900 border-gray-800 shadow-sm'
    }`}>
      <h3 className={`text-lg font-medium mb-6 ${
        activeTheme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        Notification Preferences
      </h3>
      <div className="space-y-6">
        {Object.entries({
          email: { label: 'Email Notifications', description: 'Receive notifications via email' },
          push: { label: 'Push Notifications', description: 'Receive browser push notifications' },
          sms: { label: 'SMS Notifications', description: 'Receive text message notifications' },
          visitorCheckIn: { label: 'Visitor Check-ins', description: 'Get notified when visitors check in' },
          pendingApprovals: { label: 'Pending Approvals', description: 'Get notified about pending visitor approvals' },
          systemUpdates: { label: 'System Updates', description: 'Receive notifications about system maintenance' }
        }).map(([key, config]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className={`text-sm font-medium ${
                activeTheme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {config.label}
              </h4>
              <p className={`text-sm ${
                activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {config.description}
              </p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications[key] 
                  ? activeTheme === 'light' ? 'bg-gray-900' : 'bg-white'
                  : activeTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                  notifications[key] 
                    ? activeTheme === 'light' 
                      ? 'translate-x-5 bg-white' 
                      : 'translate-x-5 bg-black'
                    : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const UserManagementSection = () => {
    // Loading state
    if (loading.users) {
      return (
        <div className={`rounded-lg border overflow-hidden transition-all duration-200 ${
          activeTheme === 'light' 
            ? 'bg-white border-gray-100 shadow-sm' 
            : 'bg-gray-900 border-gray-800 shadow-sm'
        }`}>
          <div className={`px-8 py-6 border-b ${
            activeTheme === 'light' ? 'border-gray-100' : 'border-gray-800'
          }`}>
            <h3 className={`text-lg font-medium ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              User Management
            </h3>
          </div>
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-16 rounded ${
                  activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                }`}></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Error or empty state
    if (users.length === 0) {
      return (
        <div className={`rounded-lg border overflow-hidden transition-all duration-200 ${
          activeTheme === 'light' 
            ? 'bg-white border-gray-100 shadow-sm' 
            : 'bg-gray-900 border-gray-800 shadow-sm'
        }`}>
          <div className={`px-8 py-6 border-b ${
            activeTheme === 'light' ? 'border-gray-100' : 'border-gray-800'
          }`}>
            <h3 className={`text-lg font-medium ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              User Management
            </h3>
          </div>
          <div className="p-12 flex flex-col items-center justify-center">
            <Users className={`h-12 w-12 mb-4 ${
              activeTheme === 'light' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h4 className={`text-lg font-medium mb-2 ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              No Users Found
            </h4>
            <p className={`text-center max-w-md mb-6 ${
              activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              There are currently no users in the system. You can add new users by clicking the button below.
            </p>
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTheme === 'light'
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-white hover:bg-gray-100 text-black'
              }`}
            >
              <UserPlus className="inline mr-2 h-4 w-4" />
              Add New User
            </button>
          </div>
        </div>
      );
    }

    // Success state
    return (
      <div className={`rounded-lg border overflow-hidden transition-all duration-200 ${
        activeTheme === 'light' 
          ? 'bg-white border-gray-100 shadow-sm' 
          : 'bg-gray-900 border-gray-800 shadow-sm'
      }`}>
        <div className={`px-8 py-6 border-b ${
          activeTheme === 'light' ? 'border-gray-100' : 'border-gray-800'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              User Management
            </h3>
            <button
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${
                activeTheme === 'light'
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-white hover:bg-gray-100 text-black'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={activeTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}>
              <tr>
                <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  User
                </th>
                <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Role
                </th>
                <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Department
                </th>
                <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Last Login
                </th>
                <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Status
                </th>
                <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              activeTheme === 'light' ? 'divide-gray-100' : 'divide-gray-800'
            }`}>
              {users.map((user) => (
                <tr key={user.id} className={`transition-colors ${
                  activeTheme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800'
                }`}>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                      }`}>
                        {user.profile_picture ? (
                          <img 
                            src={user.profile_picture} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className={`h-5 w-5 ${
                            activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${
                          activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name'}
                        </div>
                        <div className={`text-sm ${
                          activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {user.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? activeTheme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200'
                        : user.role === 'manager' 
                          ? activeTheme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
                          : user.role === 'security' 
                            ? activeTheme === 'light' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 text-orange-200'
                            : activeTheme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
                    }`}>
                      {user.role || 'No role'}
                    </span>
                  </td>
                  <td className={`px-8 py-6 whitespace-nowrap text-sm ${
                    activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {user.department || 'No department'}
                  </td>
                  <td className={`px-8 py-6 whitespace-nowrap text-sm ${
                    activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      user.is_active 
                        ? activeTheme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
                        : activeTheme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-200'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium space-x-4">
                    <button 
                      onClick={() => setEditingUser(user.id)}
                      className={`transition-colors ${
                        activeTheme === 'light' 
                          ? 'text-gray-900 hover:text-gray-700' 
                          : 'text-white hover:text-gray-300'
                      }`}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setEditingPermissions(user.role)}
                      className={`transition-colors ${
                        activeTheme === 'light' 
                          ? 'text-gray-600 hover:text-gray-800' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PermissionsSection = () => {
    if (loading.permissions) {
      return <div>Loading permissions...</div>;
    }

    if (Object.keys(availablePermissions).length === 0) {
      return <div>No permissions data available</div>;
    }

    return (
      <div className={`rounded-lg p-8 border transition-all duration-200 ${
        activeTheme === 'light' 
          ? 'bg-white border-gray-100 shadow-sm' 
          : 'bg-gray-900 border-gray-800 shadow-sm'
      }`}>
        <h3 className={`text-lg font-medium mb-6 ${
          activeTheme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className={`border rounded-lg p-6 ${
              activeTheme === 'light' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-md font-medium capitalize flex items-center space-x-2 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  <Shield className="h-5 w-5" />
                  <span>{role}</span>
                </h4>
                <span className={`text-sm ${
                  activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {permissions.length} permissions
                </span>
              </div>
              
              {Object.entries(
                Object.entries(AVAILABLE_PERMISSIONS).reduce((acc, [permId, perm]) => {
                  if (!acc[perm.category]) acc[perm.category] = [];
                  acc[perm.category].push({ id: permId, ...perm });
                  return acc;
                }, {})
              ).map(([category, categoryPerms]) => (
                <div key={category} className="mb-4">
                  <h5 className={`text-sm font-medium mb-3 ${
                    activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {category}
                  </h5>
                  <div className="space-y-3">
                    {categoryPerms.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <perm.icon className={`h-4 w-4 ${
                            activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <div>
                            <div className={`text-sm font-medium ${
                              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              {perm.name}
                            </div>
                            <div className={`text-xs ${
                              activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {perm.description}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePermissionChange(role, perm.id, !permissions.includes(perm.id))}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            permissions.includes(perm.id) 
                              ? activeTheme === 'light' ? 'bg-gray-900' : 'bg-white'
                              : activeTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                              permissions.includes(perm.id) 
                                ? activeTheme === 'light' 
                                  ? 'translate-x-4 bg-white' 
                                  : 'translate-x-4 bg-black'
                                : 'translate-x-0 bg-white'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Edit User Modal
  const EditUserModal = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      role: user?.role || 'receptionist'
    });

    const handleSubmit = () => {
      onSave(user.id, formData);
    };

    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`max-w-md w-full mx-4 rounded-lg p-6 ${
          activeTheme === 'light' ? 'bg-white' : 'bg-gray-900'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-medium ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Edit User
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                activeTheme === 'light' 
                  ? 'text-gray-400 hover:text-gray-600' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 bg-white text-gray-900 focus:border-gray-900' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 focus:border-white'
                }`}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Receptionist</option>
                <option value="security">Security</option>
              </select>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSubmit}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTheme === 'light'
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-white hover:bg-gray-100 text-black'
                }`}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-lg font-medium border transition-colors ${
                  activeTheme === 'light' 
                    ? 'border-gray-200 text-gray-700 hover:bg-gray-50' 
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      activeTheme === 'light' ? 'bg-gray-50' : 'bg-black'
    }`}>
      <ThemeSelector />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <button
                onClick={handleGoHome}
                className={`p-2 rounded-lg transition-colors ${
                  activeTheme === 'light' 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className={`text-3xl font-medium ${
                activeTheme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Profile & Settings
              </h1>
            </div>
            <p className={`${
              activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Manage your profile, notifications, and system permissions
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 space-y-3">
            <TabButton
              id="profile"
              label="My Profile"
              icon={User}
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
            <TabButton
              id="notifications"
              label="Notifications"
              icon={Bell}
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
            {currentUser?.role === 'admin' && (
              <>
                <TabButton
                  id="users"
                  label="User Management"
                  icon={Users}
                  active={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                />
                <TabButton
                  id="permissions"
                  label="Permissions"
                  icon={Shield}
                  active={activeTab === 'permissions'}
                  onClick={() => setActiveTab('permissions')}
                />
              </>
            )}
            <TabButton
              id="security"
              label="Security"
              icon={Lock}
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'users' && currentUser?.role === 'admin' && <UserManagementSection />}
            {activeTab === 'permissions' && currentUser?.role === 'admin' && <PermissionsSection />}
            {activeTab === 'security' && (
              <div className={`rounded-lg p-8 border transition-all duration-200 ${
                activeTheme === 'light' 
                  ? 'bg-white border-gray-100 shadow-sm' 
                  : 'bg-gray-900 border-gray-800 shadow-sm'
              }`}>
                <h3 className={`text-lg font-medium mb-6 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${
                    activeTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Shield className={`h-5 w-5 ${
                        activeTheme === 'light' ? 'text-green-600' : 'text-green-400'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          Two-Factor Authentication
                        </h4>
                        <p className={`text-sm ${
                          activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <button className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTheme === 'light'
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-white hover:bg-gray-100 text-black'
                    }`}>
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    activeTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Lock className={`h-5 w-5 ${
                        activeTheme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          Login History
                        </h4>
                        <p className={`text-sm ${
                          activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          View recent login activity
                        </p>
                      </div>
                    </div>
                    <button className={`mt-4 px-4 py-2 rounded-lg font-medium border transition-colors ${
                      activeTheme === 'light' 
                        ? 'border-gray-200 text-gray-700 hover:bg-gray-50' 
                        : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    }`}>
                      View History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={users.find(u => u.id === editingUser)}
          onSave={handleSaveProfile}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default NewProfile;