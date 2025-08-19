import React, { useState } from 'react';
import { Home, ArrowLeft, AlertTriangle, Search, RefreshCw } from 'lucide-react';

const NotFound = () => {
  const [activeTheme, setActiveTheme] = useState('light');

  const handleGoHome = () => {
    // In a real app, this would navigate to home
    alert('Navigating to home...');
  };

  const handleGoBack = () => {
    // In a real app, this would go back in history
    window.history.back();
  };

  const handleRetry = () => {
    // In a real app, this would retry the current page
    window.location.reload();
  };

  const handleSearch = () => {
    // In a real app, this would open search functionality
    alert('Opening search...');
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
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-gray-400" />
              </div>
              
              {/* Error Code */}
              <h1 className="text-8xl md:text-9xl font-light text-gray-900 mb-4 tracking-tight">
                404
              </h1>
              
              {/* Error Message */}
              <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
                Page Not Found
              </h2>
              
              <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Please check the URL or return to the dashboard.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleGoHome}
                className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <Home className="h-5 w-5" />
                <span>Go to Dashboard</span>
              </button>
              
              <button
                onClick={handleGoBack}
                className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </button>
              
              <span className="hidden sm:block text-gray-300">•</span>
              
              <button
                onClick={handleSearch}
                className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-12 p-4 bg-white border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                Need Help?
              </p>
              <p className="text-sm text-gray-600">
                If you believe this is an error, please contact your system administrator 
                or try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Dark Theme
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-gray-500" />
              </div>
              
              {/* Error Code */}
              <h1 className="text-8xl md:text-9xl font-light text-white mb-4 tracking-tight">
                404
              </h1>
              
              {/* Error Message */}
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Page Not Found
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Please check the URL or return to the dashboard.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleGoHome}
                className="inline-flex items-center space-x-2 bg-white hover:bg-gray-100 text-black font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <Home className="h-5 w-5" />
                <span>Go to Dashboard</span>
              </button>
              
              <button
                onClick={handleGoBack}
                className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </button>
              
              <span className="hidden sm:block text-gray-600">•</span>
              
              <button
                onClick={handleSearch}
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-12 p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Need Help?
              </p>
              <p className="text-sm text-gray-400">
                If you believe this is an error, please contact your system administrator 
                or try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFound;