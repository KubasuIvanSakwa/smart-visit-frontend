import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';

const Notifications = ({ message, type, onDismiss, theme = 'light' }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    loading: <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />,
  };

  // Modern dashboard-style toast notifications
  const styleMap = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-600',
      progress: 'bg-amber-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      progress: 'bg-blue-500'
    },
    loading: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      progress: 'bg-blue-500'
    },
  };

  const styles = styleMap[type];

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-2 max-w-sm backdrop-blur-sm`}>
        <div className="flex items-center space-x-2">
          <div className={`flex-shrink-0 p-0.5 rounded-full bg-white ${styles.icon}`}>
            {iconMap[type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium ${styles.text} leading-tight`}>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className={`${styles.text} hover:bg-white/50 focus:outline-none transition-colors duration-200 p-0.5 rounded-full`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Compact progress bar */}
        <div className="mt-1.5 bg-white/50 rounded-full h-0.5 overflow-hidden">
          <div
            className={`h-full ${styles.progress} transition-all duration-3000 ease-linear`}
            style={{
              width: isVisible ? '100%' : '0%',
              animation: isVisible ? 'shrink 3s linear forwards' : 'none'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
