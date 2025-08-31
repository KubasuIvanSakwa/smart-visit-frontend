import React, { useEffect, useState } from 'react';
import { 
  User, Settings, Save, Edit3, Eye, EyeOff, Shield, Users, 
  Clock, TrendingUp, Download, UserCheck, UserX, UserPlus, 
  AlertCircle, Bell, Lock, Mail, Phone, Building, Calendar,
  Check, X, ChevronRight, Camera, Home, ArrowLeft, Search,
  MoreHorizontal, Filter
} from 'lucide-react';

// Mock data for demonstration
const mockCurrentUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@yunovia.com",
  phone: "+1 (555) 123-4567",
  role: "admin",
  department: "IT",
  profile_picture: null,
  date_joined: "2024-01-15T10:30:00Z",
  last_login: "2024-08-30T14:22:00Z",
  is_active: true
};

const mockUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe", 
    email: "john.doe@yunovia.com",
    role: "admin",
    department: "IT",
    last_login: "2024-08-30T14:22:00Z",
    is_active: true,
    profile_picture: null
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@yunovia.com", 
    role: "manager",
    department: "Operations",
    last_login: "2024-08-29T09:15:00Z",
    is_active: true,
    profile_picture: null
  },
  {
    id: 3,
    first_name: "Mike",
    last_name: "Johnson",
    email: "mike.johnson@yunovia.com",
    role: "security", 
    department: "Security",
    last_login: "2024-08-30T08:45:00Z",
    is_active: true,
    profile_picture: null
  },
  {
    id: 4,
    first_name: "Sarah",
    last_name: "Wilson",
    email: "sarah.wilson@yunovia.com",
    role: "receptionist",
    department: "Front Desk", 
    last_login: "2024-08-28T16:30:00Z",
    is_active: false,
    profile_picture: null
  }
];

const ModernProfile = () => {
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    visitorCheckIn: true,
    pendingApprovals: true,
    systemUpdates: false
  });

  const handleGoHome = () => {
    window.history.back();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const TabButton = ({ id, label, icon: Icon, active, onClick, badge }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full ${
        active 
          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              {currentUser.profile_picture ? (
                <img 
                  src={currentUser.profile_picture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-xl">
                  {currentUser.first_name?.charAt(0)}{currentUser.last_name?.charAt(0)}
                </span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera className="h-3.5 w-3.5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {currentUser.first_name} {currentUser.last_name}
            </h2>
            <p className="text-gray-600 mb-3">
              {currentUser.role?.charAt(0)?.toUpperCase() + currentUser.role?.slice(1)} • {currentUser.department}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{currentUser.phone}</span>
              </div>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'First Name', value: currentUser.first_name },
            { label: 'Last Name', value: currentUser.last_name },
            { label: 'Email Address', value: currentUser.email },
            { label: 'Phone Number', value: currentUser.phone },
            { label: 'Department', value: currentUser.department },
            { label: 'Role', value: currentUser.role },
            { label: 'Join Date', value: new Date(currentUser.date_joined).toLocaleDateString() },
            { label: 'Last Login', value: new Date(currentUser.last_login).toLocaleString() }
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value || 'Not set'}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400" /> : 
                  <Eye className="h-5 w-5 text-gray-400" />
                }
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
      <div className="space-y-6">
        {Object.entries({
          email: { label: 'Email Notifications', description: 'Receive notifications via email' },
          push: { label: 'Push Notifications', description: 'Receive browser push notifications' },
          sms: { label: 'SMS Notifications', description: 'Receive text message notifications' },
          visitorCheckIn: { label: 'Visitor Check-ins', description: 'Get notified when visitors check in' },
          pendingApprovals: { label: 'Pending Approvals', description: 'Get notified about pending visitor approvals' },
          systemUpdates: { label: 'System Updates', description: 'Receive notifications about system maintenance' }
        }).map(([key, config]) => (
          <div key={key} className="flex items-center justify-between py-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{config.label}</h4>
              <p className="text-sm text-gray-500">{config.description}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications[key] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifications[key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const UserManagementSection = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="security">Security</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-4">
                        {user.profile_picture ? (
                          <img 
                            src={user.profile_picture} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-medium text-sm">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'manager' 
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'security' 
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Edit
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enable 2FA
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Login History</h4>
                <p className="text-sm text-gray-600">View recent login activity</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <button
                onClick={handleGoHome}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Profile & Settings</h1>
            </div>
            <p className="text-gray-600 ml-12">
              Manage your profile, notifications, and system permissions
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
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
                badge={3}
              />
              {currentUser?.role === 'admin' && (
                <TabButton
                  id="users"
                  label="User Management"
                  icon={Users}
                  active={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                />
              )}
              <TabButton
                id="security"
                label="Security"
                icon={Lock}
                active={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'users' && currentUser?.role === 'admin' && <UserManagementSection />}
            {activeTab === 'security' && <SecuritySection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;