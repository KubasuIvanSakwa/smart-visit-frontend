import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  BarChart3, 
  FileCheck, 
  Smartphone, 
  Users,
  CheckCircle,
  ArrowRight,
  QrCode,
  TrendingUp,
  ChevronUp
} from 'lucide-react';
import api from '../api/axios';

const LandingPage = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const features = [
    {
      icon: Shield,
      title: "Secure Visitor Processing",
      description: "Enterprise-grade security with encrypted data storage, NDA management, and compliance tracking."
    },
    {
      icon: Clock,
      title: "Real-Time Notifications",
      description: "Instant SMS, WhatsApp, and email alerts to hosts when visitors arrive or require attention."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive reporting on visitor patterns, peak hours, and operational efficiency metrics."
    },
    {
      icon: FileCheck,
      title: "Compliance Management",
      description: "Automated health declarations, NDA collection, and audit trail for regulatory compliance."
    },
    {
      icon: QrCode,
      title: "QR Code Integration",
      description: "Fast check-in with QR codes, pre-registration support, and contactless visitor processing."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Responsive interface optimized for tablets, kiosks, and mobile devices with touch-friendly controls."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee", icon: TrendingUp },
    { number: "< 30s", label: "Average Check-in Time", icon: Clock },
    { number: "500+", label: "Companies Trust Us", icon: Users },
    { number: "24/7", label: "Support Available", icon: Shield }
  ]


  // Handle scroll events for back to top button and progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowBackToTop(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const handleTryDemo = () => {
    window.location.href = '/dashboard';
  };

  const handleViewDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleStartCheckIn = () => {
    window.location.href = '/entry';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Back to Top Button with Progress Ring
  const BackToTopButton = () => {
    const circumference = 2 * Math.PI * 20;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;
    
    return (
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          onClick={scrollToTop}
          className={`relative w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95 ${
            activeTheme === 'light'
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          <svg
            className="absolute inset-0 w-12 h-12 transform -rotate-90"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke={activeTheme === 'light' ? '#e5e7eb' : '#374151'}
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke={activeTheme === 'light' ? '#ffffff' : '#000000'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          
          <ChevronUp className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </button>
      </div>
    );
  };

  // Theme Selector
  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* <button
        onClick={() => setActiveTheme('light')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'light' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Light
      </button> */}
      {/* <button
        onClick={() => setActiveTheme('dark')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        Dark
      </button> */}
    </div>
  );

  return (
    <div className="min-h-screen">
      <ThemeSelector />
      <BackToTopButton />

      
      {activeTheme === 'light' ? (
        // Light Theme
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <Users className="h-12 w-12 text-gray-700" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-light text-gray-900 mb-4 tracking-tight">
                  KREP <span className="font-medium">SmartVisit</span>
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-6">
                  Professional Visitor Management
                </h2>
                
                <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                  Transform your office reception with our POS-style Digital Visitor Management System. 
                  Fast, secure, and professional visitor processing for modern offices.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={handleStartCheckIn}
                  className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <ArrowRight className="h-5 w-5" />
                  <span>Start Check-In</span>
                </button>
                
                <button
                  onClick={handleViewDashboard}
                  className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>View Dashboard</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg p-6 text-center hover:border-gray-200 transition-colors">
                    <stat.icon className="h-6 w-6 text-gray-400 mx-auto mb-3" />
                    <div className="text-2xl font-light text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                  Why Choose <span className="font-medium">SmartVisit?</span>
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  Built for modern offices that demand security, efficiency, and professional visitor experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-8 transition-all duration-200 border border-gray-100 hover:border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <feature.icon className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Ready to <span className="font-medium">Get Started?</span>
              </h2>
              <p className="text-lg text-gray-500 mb-12 leading-relaxed">
                Join hundreds of companies using KREP SmartVisit for professional visitor management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Get Started Free</span>
                </button>
                
                <button
                  onClick={handleTryDemo}
                  className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-8 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Try Demo</span>
                </button>
              </div>

              <div className="mt-12 p-6 bg-white border border-gray-100 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                  Need Help?
                </p>
                <p className="text-sm text-gray-600">
                  Contact our support team for a personalized demo or implementation assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dark Theme
        <div className="min-h-screen bg-black">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-black py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-light text-white mb-4 tracking-tight">
                  KREP <span className="font-medium">SmartVisit</span>
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-medium text-gray-300 mb-6">
                  Professional Visitor Management
                </h2>
                
                <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                  Transform your office reception with our POS-style Digital Visitor Management System. 
                  Fast, secure, and professional visitor processing for modern offices.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={handleStartCheckIn}
                  className="inline-flex items-center space-x-2 bg-white hover:bg-gray-100 text-black font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <ArrowRight className="h-5 w-5" />
                  <span>Start Check-In</span>
                </button>
                
                <button
                  onClick={handleViewDashboard}
                  className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-700"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>View Dashboard</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center hover:border-gray-700 transition-colors">
                    <stat.icon className="h-6 w-6 text-gray-500 mx-auto mb-3" />
                    <div className="text-2xl font-light text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20 bg-gray-900">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                  Why Choose <span className="font-medium">SmartVisit?</span>
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Built for modern offices that demand security, efficiency, and professional visitor experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-black hover:bg-gray-800 rounded-lg p-8 transition-all duration-200 border border-gray-800 hover:border-gray-700">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                          <feature.icon className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 bg-black">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Ready to <span className="font-medium">Get Started?</span>
              </h2>
              <p className="text-lg text-gray-400 mb-12 leading-relaxed">
                Join hundreds of companies using KREP SmartVisit for professional visitor management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center space-x-2 bg-white hover:bg-gray-100 text-black font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Get Started Free</span>
                </button>
                
                <button
                  onClick={handleTryDemo}
                  className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-700"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Try Demo</span>
                </button>
              </div>

              <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                  Need Help?
                </p>
                <p className="text-sm text-gray-400">
                  Contact our support team for a personalized demo or implementation assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;