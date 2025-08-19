import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { QrCode, Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VisitorEntry = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const [qrData, setQrData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [status, setStatus] = useState('ready'); // ready, checking, authenticated, unauthenticated, error
  const navigate = useNavigate();
  const location = useLocation();
  const qrCodeRef = useRef(null);

  // Generate QR Code using canvas
  const generateQRCode = (text, size = 200) => {
    // Simple QR code generation using a basic pattern
    // In a real app, you'd use a proper QR code library
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    // Create a simple pattern that represents QR code data
    const moduleSize = size / 25; // 25x25 grid
    const data = text;
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Create QR-like pattern
    ctx.fillStyle = '#000000';
    
    // Generate pseudo-random pattern based on data
    let seed = 0;
    for (let i = 0; i < data.length; i++) {
      seed += data.charCodeAt(i);
    }
    
    const random = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Draw finder patterns (corners)
    const drawFinderPattern = (x, y) => {
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
    };
    
    drawFinderPattern(0, 0);
    drawFinderPattern(size - moduleSize * 7, 0);
    drawFinderPattern(0, size - moduleSize * 7);
    
    // Draw data modules
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        // Skip finder patterns
        if ((x < 9 && y < 9) || (x > 15 && y < 9) || (x < 9 && y > 15)) continue;
        
        const shouldFill = random(seed + x * 25 + y) > 0.5;
        if (shouldFill) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    return canvas.toDataURL();
  };

  useEffect(() => {
    // Generate QR code data and URL
    const mockQrData = {
      companyId: 'comp_123',
      locationId: 'loc_456',
      timestamp: new Date().toISOString(),
      entryPoint: 'main_entrance',
      redirectUrl: `${window.location.origin}/checkin`
    };

    const qrDataString = JSON.stringify(mockQrData);
    const qrUrl = generateQRCode(qrDataString);
    
    setQrData(mockQrData);
    setQrCodeUrl(qrUrl);
  }, []);

  const handleQRCodeScan = async () => {
    setIsChecking(true);
    setStatus('checking');

    // Simulate QR code scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if visitor is already authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const visitorData = sessionStorage.getItem('visitorData');

    if (isAuthenticated && visitorData) {
      // Visitor is already logged in, redirect to check-in
      setStatus('authenticated');
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/checkin', { 
        state: { 
          qrData: qrData,
          visitorData: JSON.parse(visitorData),
          returning: true 
        } 
      });
    } else {
      // New or unauthenticated visitor, redirect to login
      setStatus('unauthenticated');
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/login', { 
        state: { 
          qrData: qrData,
          from: 'visitor-entry' 
        } 
      });
    }

    setIsChecking(false);
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

  const renderStatusContent = () => {
    switch (status) {
      case 'ready':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <QrCode className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Visitor Entry
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Scan the QR code below to begin your visit
            </p>
            
            {/* QR Code Display */}
            {qrCodeUrl && (
              <div className="mb-8">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <img 
                    ref={qrCodeRef}
                    src={qrCodeUrl} 
                    alt="Entry QR Code" 
                    className="w-48 h-48 mx-auto cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleQRCodeScan}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-3">
                  Click the QR code to simulate scanning
                </p>
              </div>
            )}
          </>
        );
      
      case 'checking':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Processing Entry
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Please wait while we process your entry and check your authentication status...
            </p>
          </>
        );
      
      case 'authenticated':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              You're already authenticated. Redirecting you to the check-in page...
            </p>
          </>
        );
      
      case 'unauthenticated':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <Users className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Authentication Required
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Please sign in to continue with your visit. Redirecting you to the login page...
            </p>
          </>
        );
      
      case 'error':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Entry Error
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              There was an issue processing your QR code. Please try scanning again or contact reception.
            </p>
          </>
        );
      
      default:
        return null;
    }
  };

  const renderStatusContentDark = () => {
    switch (status) {
      case 'ready':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-900 rounded-full mb-6">
              <QrCode className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-light text-white mb-4 tracking-tight">
              Visitor Entry
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Scan the QR code below to begin your visit
            </p>
            
            {/* QR Code Display */}
            {qrCodeUrl && (
              <div className="mb-8">
                <div className="inline-block p-4 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-sm">
                  <img 
                    ref={qrCodeRef}
                    src={qrCodeUrl} 
                    alt="Entry QR Code" 
                    className="w-48 h-48 mx-auto cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleQRCodeScan}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Click the QR code to simulate scanning
                </p>
              </div>
            )}
          </>
        );
      
      case 'checking':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
              <Loader2 className="h-12 w-12 text-gray-500 animate-spin" />
            </div>
            <h1 className="text-3xl font-light text-white mb-4 tracking-tight">
              Processing Entry
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Please wait while we process your entry and check your authentication status...
            </p>
          </>
        );
      
      case 'authenticated':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-900 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-light text-white mb-4 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              You're already authenticated. Redirecting you to the check-in page...
            </p>
          </>
        );
      
      case 'unauthenticated':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-900 rounded-full mb-6">
              <Users className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-light text-white mb-4 tracking-tight">
              Authentication Required
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Please sign in to continue with your visit. Redirecting you to the login page...
            </p>
          </>
        );
      
      case 'error':
        return (
          <>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-900 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-red-400" />
            </div>
            <h1 className="text-3xl font-light text-white mb-4 tracking-tight">
              Entry Error
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              There was an issue processing your QR code. Please try scanning again or contact reception.
            </p>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <ThemeSelector />
      
      {activeTheme === 'light' ? (
        // Light Theme
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {renderStatusContent()}
            
            {/* QR Code Info */}
            {qrData && status !== 'ready' && (
              <div className="p-4 bg-white border border-gray-100 rounded-lg mb-8">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <QrCode className="h-5 w-5 text-gray-400" />
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                    QR Code Data
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Company ID:</strong> {qrData.companyId}</p>
                  <p><strong>Location:</strong> {qrData.locationId}</p>
                  <p><strong>Entry Point:</strong> {qrData.entryPoint}</p>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {status !== 'ready' && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    status === 'checking' ? 'bg-gray-400 animate-pulse' : 'bg-gray-200'
                  }`} />
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    status === 'authenticated' || status === 'unauthenticated' ? 'bg-gray-400 animate-pulse' : 'bg-gray-200'
                  }`} />
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    status === 'error' ? 'bg-red-400' : 'bg-gray-200'
                  }`} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Dark Theme
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {renderStatusContentDark()}
            
            {/* QR Code Info */}
            {qrData && status !== 'ready' && (
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg mb-8">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <QrCode className="h-5 w-5 text-gray-500" />
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    QR Code Data
                  </p>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><strong>Company ID:</strong> {qrData.companyId}</p>
                  <p><strong>Location:</strong> {qrData.locationId}</p>
                  <p><strong>Entry Point:</strong> {qrData.entryPoint}</p>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {status !== 'ready' && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    status === 'checking' ? 'bg-gray-500 animate-pulse' : 'bg-gray-700'
                  }`} />
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    status === 'authenticated' || status === 'unauthenticated' ? 'bg-gray-500 animate-pulse' : 'bg-gray-700'
                  }`} />
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    status === 'error' ? 'bg-red-500' : 'bg-gray-700'
                  }`} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorEntry;