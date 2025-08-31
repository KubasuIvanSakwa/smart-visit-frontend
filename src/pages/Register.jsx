import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, User, Mail, Building, Phone, Users } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  

  
  const [showPassword, setShowPassword] = useState(false);
  const [notSame, setNotSame] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const navigate = useNavigate();
    const { addNotification } = useNotification();

  const isDisabled =
  notSame ||
  !formData.firstName ||
  !formData.lastName ||
  !formData.email ||
  !formData.phone ||
  !formData.password ||
  !formData.confirmPassword

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('http://https://smart-visit-backend.onrender.com/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'user', // you can make this dynamic if needed
        phone: formData.phone,
        department: formData.department || 'visitor', // fallback if not in form
        job_title: formData.jobTitle || 'audit' // fallback if not in form
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    addNotification('Registration successful! Please check your email for verification.', 'success');
    navigate('/login');
  } catch (error) {
    addNotification(error.message, 'error');
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (formData.password !== formData.confirmPassword) {
      setNotSame(true)
      console.log('checking')
    } else {
      setNotSame(false)
    }
  }, [formData.password, formData.confirmPassword]);

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

  return (
    <div className="min-h-screen">
      <ThemeSelector />
      
      {activeTheme === 'light' ? (
        // Light Theme
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Logo and Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
                Create Account
              </h1>
              
              <p className="text-gray-500 text-lg">
                Join KREP SmartVisit to modernize your reception
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-white border border-gray-100 rounded-lg p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base"
                      placeholder="Enter your phone number"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base"
                      placeholder="Enter your company name"
                      required
                    />
                    <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base pr-12"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Confirm Password <span className='text-red-400 text-sm pl-3'>{notSame && 'Passwords do not match'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base pr-12"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    required
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
  type="button"
  onClick={handleSubmit}
  disabled={isDisabled || isLoading}
  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
>
  {isLoading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Creating account...</span>
    </>
  ) : (
    <>
      <User className="w-5 h-5" />
      <span>Create Account</span>
    </>
  )}
</button>

              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dark Theme
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Logo and Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                <Users className="h-8 w-8 text-black" />
              </div>
              
              <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
                Create Account
              </h1>
              
              <p className="text-gray-400 text-lg">
                Join KREP SmartVisit to modernize your reception
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500"
                      placeholder="Enter your phone number"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Company Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500"
                      placeholder="Enter your company name"
                      required
                    />
                    <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500 pr-12"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Confirm Password <span className='text-red-400'>{notSame && "Passwords do not match"}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500 pr-12"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-white border-gray-600 rounded focus:ring-white bg-gray-800"
                    required
                  />
                  <label className="text-sm text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-gray-300 hover:text-white font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-gray-300 hover:text-white font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;