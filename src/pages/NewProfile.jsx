import React, { useEffect, useState, useCallback } from 'react';
import {
  User, Save, Edit3, Eye, EyeOff,
  Clock, TrendingUp, Download, UserCheck, UserX,
  AlertCircle, Mail, Phone, Building, Calendar,
  Check, X, ChevronRight, Camera, Home, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import api from '../api/axios';
import { useNotification } from '../components/NotificationProvider';
import { useAuth } from '../context/AuthContext';

// Mock data for demonstration
const ModernProfile = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState({ profile: false });
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(true);
      setCurrentUser(null);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Removed fetchPermissions function as per user request

  useEffect(() => {
    if (!error) {
      fetchCurrentUser();
    }
  }, [error]);



  const handleGoHome = () => {
    window.history.back();
  };



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
              {currentUser?.profile_picture ? (
                <img 
                  src={currentUser.profile_picture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-xl">
                  {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                </span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera className="h-3.5 w-3.5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {currentUser?.first_name} {currentUser?.last_name}
            </h2>
            <p className="text-gray-600 mb-3">
              {currentUser?.role?.charAt(0)?.toUpperCase() + currentUser?.role?.slice(1)} • {currentUser?.department}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{currentUser?.phone}</span>
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
            { label: 'First Name', value: currentUser?.first_name },
            { label: 'Last Name', value: currentUser?.last_name },
            { label: 'Email Address', value: currentUser?.email },
            { label: 'Phone Number', value: currentUser?.phone },
            { label: 'Department', value: currentUser?.department },
            { label: 'Role', value: currentUser?.role },
            { label: 'Join Date', value: currentUser?.date_joined ? new Date(currentUser.date_joined).toLocaleDateString() : 'Not set' },
            { label: 'Last Login', value: currentUser?.last_login ? new Date(currentUser.last_login).toLocaleString() : 'Not set' }
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
              Manage your personal profile information and account settings
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading.profile ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading profile data...</p>
                </div>
              </div>
            ) : currentUser === null ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-gray-600">No user data found.</p>
                <button
                  onClick={() => {
                    setError(false);
                    fetchCurrentUser();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ProfileSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;