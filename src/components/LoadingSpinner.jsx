import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Users, Settings, PieChart, TrendingUp, FileText, Globe } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, theme = 'light' }) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const icons = [
    { Icon: BarChart3, label: 'Analytics' },
    { Icon: Calendar, label: 'Calendar' },
    { Icon: Users, label: 'Users' },
    { Icon: PieChart, label: 'Reports' },
    { Icon: TrendingUp, label: 'Trends' },
    { Icon: FileText, label: 'Documents' },
    { Icon: Globe, label: 'Global' },
    { Icon: Settings, label: 'Settings' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 800);

    return () => clearInterval(interval);
  }, [icons.length]);

  const CurrentIcon = icons[currentIconIndex].Icon;

  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'} ${
      theme === 'light' ? 'bg-gray-50' : 'bg-black'
    }`}>
      {/* Main Spinner Container */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`animate-spin rounded-full h-20 w-20 border-2 ${
          theme === 'light' 
            ? 'border-gray-200 border-t-gray-900' 
            : 'border-gray-800 border-t-white'
        }`}></div>
        
        {/* Inner spinning ring (counter-clockwise) */}
        <div className={`absolute inset-2 animate-spin-reverse rounded-full h-16 w-16 border-2 ${
          theme === 'light' 
            ? 'border-gray-100 border-b-gray-600' 
            : 'border-gray-900 border-b-gray-400'
        }`} style={{ 
          animation: 'spin 2s linear infinite reverse' 
        }}></div>
        
        {/* Center icon container */}
        <div className={`absolute inset-0 flex items-center justify-center rounded-full ${
          theme === 'light' ? 'bg-gray-50' : 'bg-black'
        }`}>
          <div className="relative">
            {/* Icon with fade transition */}
            <div className="transition-all duration-300 ease-in-out transform">
              <CurrentIcon className={`h-8 w-8 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className={`text-sm font-medium transition-all duration-300 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Loading {icons[currentIconIndex].label}
        </p>
        <div className="flex justify-center mt-2">
          {/* Dot indicators */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className={`h-1 w-1 rounded-full transition-all duration-300 ${
                  theme === 'light' ? 'bg-gray-400' : 'bg-gray-600'
                }`}
                style={{
                  animationDelay: `${dot * 0.2}s`,
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 w-32">
        <div className={`h-1 rounded-full overflow-hidden ${
          theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'
        }`}>
          <div 
            className={`h-full rounded-full transition-all duration-800 ease-out ${
              theme === 'light' ? 'bg-gray-900' : 'bg-white'
            }`}
            style={{
              width: `${((currentIconIndex + 1) / icons.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

// Demo component with theme switching
const LoadingSpinnerDemo = () => {
  const [theme, setTheme] = useState('light');
  const [fullScreen, setFullScreen] = useState(true);

  return (
    <div className="relative">
      {/* Theme Toggle */}
      {/* <div className="fixed top-4 left-4 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setTheme('light')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            theme === 'light' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Dark
        </button>
      </div> */}

      {/* Full Screen Toggle */}
      {/* <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setFullScreen(!fullScreen)}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {fullScreen ? 'Container View' : 'Full Screen'}
        </button>
      </div> */}

      {/* Loading Spinner */}
      {fullScreen ? (
        <LoadingSpinner fullScreen={true} theme={theme} />
      ) : (
        <div className={`p-8 ${theme === 'light' ? 'bg-gray-50' : 'bg-black'} min-h-screen`}>
          <div className="max-w-md mx-auto">
            <h2 className={`text-2xl font-light mb-8 text-center ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Dashboard Loading
            </h2>
            <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center" style={{
              borderColor: theme === 'light' ? '#e5e7eb' : '#374151'
            }}>
              <LoadingSpinner fullScreen={false} theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinnerDemo;