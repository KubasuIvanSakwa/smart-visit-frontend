import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Save, X, User, Mail, Phone, Building, Briefcase } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';
import axios from 'axios';

const FormField = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, error, options = null, activeTheme }) => {
  const baseInputClasses = activeTheme === 'light' 
    ? `w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`
    : `w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
        error ? 'border-red-500 bg-red-900/20 text-white' : 'border-gray-700 bg-gray-800 text-white hover:border-gray-600'
      }`;

  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
        {label}
      </label>
      <div className="relative">
        <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
        }`} />
        {options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputClasses}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseInputClasses}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

const AddUser = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    role: 'user', // default role
    password: 'createme123',
    password2: 'createme123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { addNotification } = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleAddUser = async () => {
  if (!validateForm()) return;
  setIsLoading(true);

  try {
    const newUser = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      department: formData.department,
      password: formData.password,
      password2: formData.password2,
      role: formData.role,
    };

    const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', newUser, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 201) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        role: 'user',
        password: 'createme123',
        password2: 'createme123'
      });
      addNotification('User added successfully!', 'success');
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        addNotification(errorData, 'error');
      } else if (errorData.error) {
        addNotification(errorData.error, 'error');
      } else {
        const errorMessages = Object.entries(errorData)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('\n');
        addNotification(errorMessages, 'error');
      }
    } else {
      addNotification('Registration failed. Please try again.', 'error');
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleGoBack = () => {
    window.history.back();
  };

  const handleCancel = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: '',
      role: 'user',
      password: 'createme123',
      password2: 'createme123'
    });
    setErrors({});
  };

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

  return (
    <div className="min-h-screen">
      <ThemeSelector />
      
      {activeTheme === 'light' ? (
        // Light Theme
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={handleGoBack}
                className="inline-flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              
              <div className="flex items-center space-x-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                  <UserPlus className="h-6 w-6 text-gray-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
              </div>
              <p className="text-gray-600">Create a new user account with the required information below.</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <FormField
                  icon={User}
                  label="First Name"
                  name="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  error={errors.first_name}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={User}
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  error={errors.last_name}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Building}
                  label="Department"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleInputChange}
                  error={errors.department}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Briefcase}
                  label="Position/Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  activeTheme={activeTheme}
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'host', label: 'Host' },
                    { value: 'receptionist', label: 'Receptionist' }
                  ]}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-sm disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{isLoading ? 'Adding User...' : 'Add User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dark Theme
        <div className="min-h-screen bg-black py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={handleGoBack}
                className="inline-flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              
              <div className="flex items-center space-x-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg">
                  <UserPlus className="h-6 w-6 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">Add New User</h1>
              </div>
              <p className="text-gray-400">Create a new user account with the required information below.</p>
            </div>

            {/* Form */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="space-y-6">
                <FormField
                  icon={User}
                  label="First Name"
                  name="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  error={errors.first_name}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={User}
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  error={errors.last_name}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Building}
                  label="Department"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleInputChange}
                  error={errors.department}
                  activeTheme={activeTheme}
                />

                <FormField
                  icon={Briefcase}
                  label="Position/Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  activeTheme={activeTheme}
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'host', label: 'Host' },
                    { value: 'receptionist', label: 'Receptionist' }
                  ]}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 px-6 rounded-lg border border-gray-700 transition-all duration-200 hover:border-gray-600"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 disabled:bg-gray-600 text-black disabled:text-gray-400 font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-sm disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{isLoading ? 'Adding User...' : 'Add User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;