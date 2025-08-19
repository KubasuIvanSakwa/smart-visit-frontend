import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router'; // Uncomment when using with React Router
import api from '../api/axios';
import { useNotification } from '../components/NotificationProvider'

const NewLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const [error, setError] = useState(false);
  const { addNotification } = useNotification()
  // const navigate = useNavigate(); // Uncomment when using with React Router

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setIsLoading(true);

    try {
      
      //Uncomment when ready to use real API
    const response = await api.post('/api/token/', {
    email: formData.username, // now sending email
    password: formData.password
});

      
      const { access, refresh, roles } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', roles);      
      // Navigate to dashboard
      window.location.href = '/dashboard';
      
      
      
    } catch (err) {
      console.error('Login error:', err);
      addNotification(`${err.message}`, 'error');
      if(err.status === 401){ setError(true)}
      console.log(err.status)
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

  const handleDemoLogin = () => {
    setFormData({
      username: 'admin@krep.com',
      password: 'demo123'
    });
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
              Welcome Back
            </h1>

            <p className="text-gray-500 text-lg">
              Sign in to your KREP SmartVisit account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 mb-6">
            {error && <span className='inline-block pb-3 text-red-500'>*wrong credentials</span>}
            <div className="space-y-6">
              {/* username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 text-base"
                    placeholder="Enter your username"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Enter your password"
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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-light"
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <label htmlFor="remember-light" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => console.log('Navigate to forgot password')}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sign Up */}
          <div className="text-center mb-6">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => console.log('Navigate to register')}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors underline"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="p-4 bg-white border border-gray-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                Demo Credentials
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>username:</strong> admin@krep.com</p>
              <p><strong>Password:</strong> demo123</p>
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
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg">
              Sign in to your KREP SmartVisit account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 text-base text-white placeholder-gray-500"
                  placeholder="Enter your username"
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-dark"
                  className="w-4 h-4 text-white border-gray-600 rounded focus:ring-white bg-gray-800"
                />
                <label htmlFor="remember-dark" className="ml-2 text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => console.log('Navigate to forgot password')}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up */}
          <div className="text-center mb-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => console.log('Navigate to register')}
                className="text-gray-300 hover:text-white font-medium transition-colors underline"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Demo Credentials
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs text-gray-400 hover:text-gray-300 underline transition-colors"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>username:</strong> admin@krep.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default NewLogin;