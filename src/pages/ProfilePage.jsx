import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Settings, Save, Edit3, Eye, EyeOff, Shield, Users,
  Clock, TrendingUp, Download, UserCheck, UserX, UserPlus,
  AlertCircle, Bell, Lock, Mail, Phone, Building, Calendar,
  Check, X, ChevronRight, Camera
} from 'lucide-react';
import api from '../api/axios';
import { useNotification } from '../components/NotificationProvider';
import { useAuth } from '../context/AuthContext';

// User profiles data
const USERS = [
  {
    id: 1,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Human Resources',
    role: 'admin',
    avatar: null,
    joinDate: '2022-01-15',
    lastLogin: '2024-01-15 09:30 AM',
    status: 'active'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Reception',
    role: 'receptionist',
    avatar: null,
    joinDate: '2023-03-10',
    lastLogin: '2024-01-15 08:15 AM',
    status: 'active'
  },
  {
    id: 3,
    name: 'James Security',
    email: 'james.security@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Security',
    role: 'security',
    avatar: null,
    joinDate: '2022-08-22',
    lastLogin: '2024-01-15 07:00 AM',
    status: 'active'
  },
  {
    id: 4,
    name: 'Lisa Brown',
    email: 'lisa.brown@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Management',
    role: 'manager',
    avatar: null,
    joinDate: '2021-11-05',
    lastLogin: '2024-01-14 06:45 PM',
    status: 'active'
  }
];

// Available permissions mapped to the cards from your dashboard
const AVAILABLE_PERMISSIONS = {
  currentVisitors: {
    id: 'currentVisitors',
    name: 'Current Visitors',
    description: 'View list of visitors currently in the office',
    icon: Users,
    category: 'Visitor Management'
  },
  totalCheckedIn: {
    id: 'totalCheckedIn',
    name: 'Total Checked In',
    description: 'View total visitors checked in today',
    icon: UserCheck,
    category: 'Analytics'
  },
  totalCheckedOut: {
    id: 'totalCheckedOut',
    name: 'Total Checked Out',
    description: 'View total visitors checked out today',
    icon: UserX,
    category: 'Analytics'
  },
  walkInsVsPreRegistered: {
    id: 'walkInsVsPreRegistered',
    name: 'Walk-ins vs Pre-registered',
    description: 'Compare walk-in visitors to pre-registered ones',
    icon: UserPlus,
    category: 'Analytics'
  },
  pendingApprovals: {
    id: 'pendingApprovals',
    name: 'Pending Approvals',
    description: 'Manage visitor approval requests',
    icon: AlertCircle,
    category: 'Approval Management'
  },
  avgVisitDuration: {
    id: 'avgVisitDuration',
    name: 'Average Visit Duration',
    description: 'View average duration of visits',
    icon: Clock,
    category: 'Analytics'
  },
  todayCheckIns: {
    id: 'todayCheckIns',
    name: "Today's Check-ins",
    description: 'Monitor daily check-in trends',
    icon: TrendingUp,
    category: 'Analytics'
  },
  monthlyTotal: {
    id: 'monthlyTotal',
    name: 'Monthly Statistics',
    description: 'View monthly visitor statistics',
    icon: Users,
    category: 'Reporting'
  },
  exportReports: {
    id: 'exportReports',
    name: 'Export Reports',
    description: 'Export visitor data and reports',
    icon: Download,
    category: 'Reporting'
  }
};

// Default role permissions
const DEFAULT_ROLE_PERMISSIONS = {
  admin: Object.keys(AVAILABLE_PERMISSIONS),
  receptionist: ['totalCheckedIn', 'totalCheckedOut', 'walkInsVsPreRegistered', 'pendingApprovals'],
  security: ['currentVisitors', 'totalCheckedIn', 'totalCheckedOut', 'todayCheckIns'],
  manager: ['currentVisitors', 'avgVisitDuration', 'todayCheckIns', 'monthlyTotal', 'exportReports']
};

const ProfilePage = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    visitorCheckIn: true,
    pendingApprovals: true,
    systemUpdates: false
  });

  // Fetch user profile data from backend
  const fetchUserProfile = useCallback(async () => {
    try {
      console.log('ProfilePage: Starting to fetch user profile data...');
      setLoading(true);
      setError(null);

      // Show loading notification
      addNotification('Loading profile data...', 'loading');

      // Fetch current user profile
      const profileResponse = await api.get('/api/users/profile');
      console.log('ProfilePage: User profile data fetched successfully:', profileResponse.data);

      setCurrentUser(profileResponse.data);

      // Fetch all users if current user is admin
      if (profileResponse.data.role === 'admin') {
        console.log('ProfilePage: User is admin, fetching all users...');
        const usersResponse = await api.get('/api/users');
        console.log('ProfilePage: All users data fetched successfully:', usersResponse.data);
        setUsers(usersResponse.data);
      }

      console.log('ProfilePage: Data fetching completed successfully');
      // Show success notification
      addNotification('Profile data loaded successfully', 'success');
    } catch (err) {
      console.error('ProfilePage: Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');

      // Only show error notification if it's not a duplicate
      if (err.response?.status === 404) {
        addNotification('Profile endpoint not found. Please check backend configuration.', 'error');
      } else {
        addNotification('Failed to load profile data. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Fetch data on component mount
  useEffect(() => {
    console.log('ProfilePage: Component mounted, fetching user data...');
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSaveProfile = (userId, updatedData) => {
    setUsers(users.map(user => 
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

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-gray-600 mt-1">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} • {currentUser.department}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
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
          <button
            onClick={() => setEditingUser(currentUser.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={currentUser.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={currentUser.phone}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={currentUser.department}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
            <input
              type="text"
              value={new Date(currentUser.joinDate).toLocaleDateString()}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
            <input
              type="text"
              value={currentUser.lastLogin}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Confirm new password"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
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
          <div key={key} className="flex items-center justify-between">
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
      {/* Users List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'security' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setEditingUser(user.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setEditingPermissions(user.role)}
                      className="text-purple-600 hover:text-purple-800"
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
    </div>
  );

  const PermissionsSection = () => (
    <div className="space-y-6">
      {/* Role Permissions Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900 capitalize flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>{role}</span>
                </h4>
                <span className="text-sm text-gray-500">{permissions.length} permissions</span>
              </div>
              
              {/* Group permissions by category */}
              {Object.entries(
                Object.entries(AVAILABLE_PERMISSIONS).reduce((acc, [permId, perm]) => {
                  if (!acc[perm.category]) acc[perm.category] = [];
                  acc[perm.category].push({ id: permId, ...perm });
                  return acc;
                }, {})
              ).map(([category, categoryPerms]) => (
                <div key={category} className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">{category}</h5>
                  <div className="space-y-2">
                    {categoryPerms.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <perm.icon className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{perm.name}</div>
                            <div className="text-xs text-gray-500">{perm.description}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePermissionChange(role, perm.id, !permissions.includes(perm.id))}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            permissions.includes(perm.id) ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              permissions.includes(perm.id) ? 'translate-x-4' : 'translate-x-0'
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile, notifications, and system permissions</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-2">
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
            {currentUser.role === 'admin' && (
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
            {activeTab === 'users' && currentUser.role === 'admin' && <UserManagementSection />}
            {activeTab === 'permissions' && currentUser.role === 'admin' && <PermissionsSection />}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <p className="text-gray-600">Security settings will be implemented here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage