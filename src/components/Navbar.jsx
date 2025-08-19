import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import KrepLogo from '../assets/logo.png'
import features from '../assets/features.svg'
import qr from '../assets/qr.svg'
import phone from '../assets/phone.svg'
import { Sun, Moon, Menu, X, Home, Users, Settings, FileText, Bell, QrCode, FileArchive, MonitorCheck, LogIn } from 'lucide-react'
import { motion } from 'framer-motion';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation()

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/login', label: 'Login', icon: LogIn },
    // { path: '/form-builder', label: 'Form Builder', icon: FileArchive},
    // { path: '/kiosk-checkin', label: 'Kiosk', icon: MonitorCheck },
    // { path: '#features', label: 'Features', icon: FileArchive},
  ];
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center p-2">
      <div className="w-[5rem] h-[5rem] rounded-lg flex items-center justify-center">
        <img src={KrepLogo} alt="Krep Software" className="w-[5rem] h-[5rem]" />
      </div>
    </Link>
          </div>

          <div className="hidden md:flex items-center p-8">
            {navItems.map(({ path, label, icon: Icon }) => (
               (<Link
                  key={path}
                  to={path}
                  className={`flex items-center p-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className='pl-1'>{label}</span>
                </Link>)
            ))}
            

          </div>

          <div className="md:hidden flex items-center p-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 "
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center p-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar