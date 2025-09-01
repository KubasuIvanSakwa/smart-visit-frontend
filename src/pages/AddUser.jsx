import React, { useState } from 'react';
import { UserPlus, Save, X, User, Mail, Phone, Building, Briefcase } from 'lucide-react';

const FormField = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, error, options = null, activeTheme, required = false }) => {
  const baseInputClasses = activeTheme === 'light' 
    ? `w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
      }`
    : `w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
        error ? 'border-red-500 bg-red-900/20 text-white' : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
      }`;

  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
        {label} {required && <span className="text-red-500">*</span>}
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
    role: 'admin', // default role
    password: 'createme123',
    password2: 'createme123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const addNotification = (message, type) => {
    // Mock notification function
    console.log(`${type}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  };

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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        role: 'admin',
        password: 'createme123',
        password2: 'createme123'
      });
      addNotification('User added successfully!', 'success');
    } catch (error) {
      console.error('Registration error:', error);
      addNotification('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: '',
      role: 'admin',
      password: 'createme123',
      password2: 'createme123'
    });
    setErrors({});
  };

  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* <button
        onClick={() => setActiveTheme('light')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'light' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Light
      </button> */}
      <button
        onClick={() => setActiveTheme('dark')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'dark' 
            ? 'bg-blue-600 text-white' 
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
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-600">Details</span>
                </div>
                
                <div className="w-16 h-0.5 bg-gray-200"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-400">Photo</span>
                  <span className="text-xs text-gray-400">Optional</span>
                </div>
                
                <div className="w-16 h-0.5 bg-gray-200"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-400">✓</span>
                  </div>
                  <span className="text-sm text-gray-400">Complete</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">User Information</h1>
                <p className="text-gray-600">Please provide user details for account creation</p>
              </div>

              {/* Basic Information Section */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    icon={User}
                    label="First Name"
                    name="first_name"
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={errors.first_name}
                    activeTheme={activeTheme}
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                  />

                  <FormField
                    icon={Briefcase}
                    label="Position/Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    activeTheme={activeTheme}
                    required
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'host', label: 'Host' },
                      { value: 'receptionist', label: 'Receptionist' }
                    ]}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 hover:border-gray-400"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-sm disabled:cursor-not-allowed"
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
        <div className="min-h-screen bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-400">Details</span>
                </div>
                
                <div className="w-16 h-0.5 bg-gray-700"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">Photo</span>
                  <span className="text-xs text-gray-500">Optional</span>
                </div>
                
                <div className="w-16 h-0.5 bg-gray-700"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-500">✓</span>
                  </div>
                  <span className="text-sm text-gray-500">Complete</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">User Information</h1>
                <p className="text-gray-400">Please provide user details for account creation</p>
              </div>

              {/* Basic Information Section */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="h-5 w-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    icon={User}
                    label="First Name"
                    name="first_name"
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={errors.first_name}
                    activeTheme={activeTheme}
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                  />

                  <FormField
                    icon={Briefcase}
                    label="Position/Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    activeTheme={activeTheme}
                    required
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'host', label: 'Host' },
                      { value: 'receptionist', label: 'Receptionist' }
                    ]}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-700">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg border border-gray-600 transition-all duration-200 hover:border-gray-500"
                >
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white disabled:text-gray-400 font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-sm disabled:cursor-not-allowed"
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