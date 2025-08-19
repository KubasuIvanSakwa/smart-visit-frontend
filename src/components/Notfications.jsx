import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';

const Notifications = ({ message, type, onDismiss, theme = 'light' }) => {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  // Light theme styles with blended grays and subtle color hints
  const lightColorMap = {
    success: {
      container: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700',
      icon: 'text-green-600',
      accent: 'border-l-green-400'
    },
    error: {
      container: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700',
      icon: 'text-red-500',
      accent: 'border-l-red-400'
    },
    warning: {
      container: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700',
      icon: 'text-amber-500',
      accent: 'border-l-amber-400'
    },
    info: {
      container: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700',
      icon: 'text-blue-500',
      accent: 'border-l-blue-400'
    },
  };

  // Dark theme styles with blended grays and subtle color hints
  const darkColorMap = {
    success: {
      container: 'bg-gray-900 border-gray-800',
      text: 'text-gray-300',
      icon: 'text-green-400',
      accent: 'border-l-green-500'
    },
    error: {
      container: 'bg-gray-900 border-gray-800',
      text: 'text-gray-300',
      icon: 'text-red-400',
      accent: 'border-l-red-500'
    },
    warning: {
      container: 'bg-gray-900 border-gray-800',
      text: 'text-gray-300',
      icon: 'text-amber-400',
      accent: 'border-l-amber-500'
    },
    info: {
      container: 'bg-gray-900 border-gray-800',
      text: 'text-gray-300',
      icon: 'text-blue-400',
      accent: 'border-l-blue-500'
    },
  };

  const colorMap = theme === 'light' ? lightColorMap : darkColorMap;
  const styles = colorMap[type] 


  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className={`border-l-4 ${styles.accent} border ${styles.container} p-4 rounded-lg shadow-lg max-w-xs md:max-w-sm backdrop-blur-sm`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {iconMap[type]}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setIsVisible(false);
                onDismiss();
              }}
              className={`${theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'} focus:outline-none transition-colors duration-200`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
