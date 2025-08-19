import React, { useState } from 'react';
import { 
  Users, Clock, TrendingUp, Download, UserCheck, UserX, UserPlus, 
  AlertCircle, Shield, User, Menu, X, Home, ClipboardList, 
  Settings, Badge, LogOut, FormInput, Monitor, UserCog, Calendar,
  Filter, BarChart3, PieChart, FileText, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router';

// Sample data for reports
const reportData = {
  daily: [
    { date: '2025-07-17', visitors: 23, walkIns: 8, preRegistered: 15, avgDuration: '2.3h' },
    { date: '2025-07-18', visitors: 31, walkIns: 12, preRegistered: 19, avgDuration: '2.1h' },
    { date: '2025-07-19', visitors: 28, walkIns: 9, preRegistered: 19, avgDuration: '2.5h' },
    { date: '2025-07-20', visitors: 35, walkIns: 14, preRegistered: 21, avgDuration: '2.2h' },
    { date: '2025-07-21', visitors: 42, walkIns: 18, preRegistered: 24, avgDuration: '2.0h' },
    { date: '2025-07-22', visitors: 38, walkIns: 15, preRegistered: 23, avgDuration: '2.4h' },
    { date: '2025-07-23', visitors: 27, walkIns: 11, preRegistered: 16, avgDuration: '2.5h' }
  ],
  hourly: [
    { hour: '8 AM', visitors: 2, checkIns: 2, checkOuts: 0 },
    { hour: '9 AM', visitors: 8, checkIns: 8, checkOuts: 0 },
    { hour: '10 AM', visitors: 12, checkIns: 12, checkOuts: 2 },
    { hour: '11 AM', visitors: 15, checkIns: 15, checkOuts: 5 },
    { hour: '12 PM', visitors: 10, checkIns: 10, checkOuts: 8 },
    { hour: '1 PM', visitors: 6, checkIns: 6, checkOuts: 12 },
    { hour: '2 PM', visitors: 14, checkIns: 14, checkOuts: 4 },
    { hour: '3 PM', visitors: 18, checkIns: 18, checkOuts: 8 },
    { hour: '4 PM', visitors: 11, checkIns: 11, checkOuts: 15 },
    { hour: '5 PM', visitors: 5, checkIns: 5, checkOuts: 18 }
  ],
  monthly: [
    { month: 'Jan 2025', visitors: 856, walkIns: 342, preRegistered: 514, avgDuration: '2.2h' },
    { month: 'Feb 2025', visitors: 723, walkIns: 289, preRegistered: 434, avgDuration: '2.4h' },
    { month: 'Mar 2025', visitors: 942, walkIns: 377, preRegistered: 565, avgDuration: '2.1h' },
    { month: 'Apr 2025', visitors: 1087, walkIns: 435, preRegistered: 652, avgDuration: '2.3h' },
    { month: 'May 2025', visitors: 1234, walkIns: 494, preRegistered: 740, avgDuration: '2.0h' },
    { month: 'Jun 2025', visitors: 1156, walkIns: 462, preRegistered: 694, avgDuration: '2.2h' },
    { month: 'Jul 2025', visitors: 824, walkIns: 330, preRegistered: 494, avgDuration: '2.3h' }
  ]
};

const hostPerformance = [
  { name: 'Sarah Wilson', totalVisitors: 89, avgDuration: '2.1h', satisfaction: 4.8 },
  { name: 'Mike Johnson', totalVisitors: 76, avgDuration: '2.3h', satisfaction: 4.6 },
  { name: 'Lisa Brown', totalVisitors: 92, avgDuration: '1.9h', satisfaction: 4.9 },
  { name: 'David Lee', totalVisitors: 64, avgDuration: '2.5h', satisfaction: 4.7 },
  { name: 'Emma Davis', totalVisitors: 71, avgDuration: '2.2h', satisfaction: 4.5 },
  { name: 'Tom Smith', totalVisitors: 58, avgDuration: '2.4h', satisfaction: 4.8 }
];

const companyFrequency = [
  { company: 'ABC Corp', visits: 45, lastVisit: '2025-07-23' },
  { company: 'XYZ Ltd', visits: 38, lastVisit: '2025-07-22' },
  { company: 'Tech Solutions', visits: 32, lastVisit: '2025-07-23' },
  { company: 'StartupCo', visits: 28, lastVisit: '2025-07-21' },
  { company: 'Design Co', visits: 24, lastVisit: '2025-07-20' },
  { company: 'Marketing Ltd', visits: 21, lastVisit: '2025-07-19' }
];

const NAVIGATION_ITEMS = {
  admin: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCheck, label: 'Check-in', path: '/check-in' },
    { icon: ClipboardList, label: 'Visitor Management', path: '/dashboard/visitors' },
    { icon: FormInput, label: 'Form Builder', path: '/form-builder' },
    { icon: Badge, label: 'Badge Designer', path: '/badge' },
    { icon: Monitor, label: 'Kiosk Setup', path: '/kiosk-checkin' },
    { icon: TrendingUp, label: 'Reports', path: '/dashboard/reports', isActive: true },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: UserCog, label: 'User Management', path: '/dashboard/users' }
  ],
  receptionist: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCheck, label: 'Check-in', path: '/check-in' },
    { icon: ClipboardList, label: 'Visitor Management', path: '/dashboard/visitors' },
    { icon: Badge, label: 'Print Badges', path: '/badge' },
    { icon: AlertCircle, label: 'Pending Approvals', path: '/dashboard/approvals' },
    { icon: TrendingUp, label: 'Reports', path: '/dashboard/reports', isActive: true }
  ]
};

const CleanBarChart = ({ data, title, dataKey = 'visitors', activeTheme }) => {
  const maxValue = Math.max(...data.map(item => item[dataKey]));
  
  return (
    <div className={`${
      activeTheme === 'light' 
        ? 'bg-white border border-gray-100' 
        : 'bg-gray-900 border border-gray-800'
    } rounded-lg p-6 transition-all duration-200`}>
      <h3 className={`text-lg font-medium mb-6 ${
        activeTheme === 'light' 
          ? 'text-gray-900' 
          : 'text-white'
      }`}>
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                activeTheme === 'light' 
                  ? 'text-gray-700' 
                  : 'text-gray-300'
              }`}>
                {item.hour || item.date || item.month}
              </span>
              <span className={`text-sm ${
                activeTheme === 'light' 
                  ? 'text-gray-500' 
                  : 'text-gray-400'
              }`}>
                {item[dataKey]}
              </span>
            </div>
            <div className={`${
              activeTheme === 'light' 
                ? 'bg-gray-100' 
                : 'bg-gray-800'
            } rounded-full h-2 relative overflow-hidden`}>
              <div 
                className={`${
                  activeTheme === 'light' 
                    ? 'bg-gray-900' 
                    : 'bg-white'
                } h-2 rounded-full transition-all duration-500 ease-out group-hover:opacity-80`}
                style={{ 
                  width: `${(item[dataKey] / maxValue) * 100}%`,
                  transitionDelay: `${index * 50}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, change, activeTheme }) => (
  <div className={`${
    activeTheme === 'light' 
      ? 'bg-white border border-gray-100' 
      : 'bg-gray-900 border border-gray-800'
  } rounded-lg p-6 transition-all duration-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium mb-2 ${
          activeTheme === 'light' 
            ? 'text-gray-500' 
            : 'text-gray-400'
        }`}>
          {title}
        </p>
        <p className={`text-2xl font-light ${
          activeTheme === 'light' 
            ? 'text-gray-900' 
            : 'text-white'
        }`}>
          {value}
        </p>
        {change && (
          <p className={`text-sm mt-2 ${
            change.startsWith('+') ? 
              activeTheme === 'light' ? 'text-green-600' : 'text-green-400' :
            change.startsWith('-') ? 
              activeTheme === 'light' ? 'text-red-600' : 'text-red-400' : 
              activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${
        activeTheme === 'light' 
          ? 'bg-gray-100' 
          : 'bg-gray-800'
      }`}>
        <Icon className={`h-6 w-6 ${
          activeTheme === 'light' 
            ? 'text-gray-600' 
            : 'text-gray-400'
        }`} />
      </div>
    </div>
  </div>
);

const Sidebar = ({ currentRole, isCollapsed, onToggle, onLogout, activeTheme }) => {
  const navigationItems = NAVIGATION_ITEMS[currentRole] || [];

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={`${
        activeTheme === 'light' 
          ? 'bg-white border-gray-100' 
          : 'bg-gray-900 border-gray-800'
      } border-r transition-all duration-200 ease-in-out flex flex-col ${
        isCollapsed ? 'w-12' : 'w-60'
      }`}>
        {/* Header */}
        <div className={`flex items-center h-12 px-3 border-b ${
          activeTheme === 'light' 
            ? 'border-gray-100' 
            : 'border-gray-800'
        } ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h2 className={`text-sm font-medium truncate ${
              activeTheme === 'light' 
                ? 'text-gray-900' 
                : 'text-white'
            }`}>
              Visitor Manager
            </h2>
          )}
          <button
            onClick={onToggle}
            className={`p-1 rounded transition-colors ${
              activeTheme === 'light' 
                ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-800' 
                : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {isCollapsed ? 
              <Menu className="h-4 w-4" /> : 
              <X className="h-4 w-4" />
            }
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2">
          <div className={isCollapsed ? 'space-y-1' : 'space-y-0.5'}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center transition-colors duration-150 ${
                      isCollapsed 
                        ? 'justify-center h-10 mx-1' 
                        : 'h-8 px-3 mx-2'
                    } ${
                      item.isActive 
                        ? activeTheme === 'light'
                          ? 'bg-gray-900 text-white rounded-md'
                          : 'bg-white text-black rounded-md'
                        : activeTheme === 'light'
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md'
                    }`}
                  >
                    <Icon className="flex-shrink-0 h-4 w-4" />
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-normal truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className={`absolute left-full top-0 ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 ${
                      activeTheme === 'light' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-white text-black'
                    }`}>
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Logout at bottom */}
        <div className={`mt-auto border-t ${
          activeTheme === 'light' 
            ? 'border-gray-100' 
            : 'border-gray-800'
        }`}>
          <div className="relative group">
            <button
              onClick={onLogout}
              className={`flex items-center transition-colors duration-150 w-full ${
                isCollapsed 
                  ? 'justify-center h-10 m-1 rounded-md' 
                  : 'h-8 px-3 m-2 rounded-md'
              } ${
                activeTheme === 'light'
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
              }`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-normal">Logout</span>
              )}
            </button>

            {/* Tooltip for logout when collapsed */}
            {isCollapsed && (
              <div className={`absolute left-full top-0 ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 ${
                activeTheme === 'light' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-black'
              }`}>
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Reports = () => {
  const [currentRole, setCurrentRole] = useState('admin');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState('overview');
  const [activeTheme, setActiveTheme] = useState('light');

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const exportToCSV = (reportName) => {
    const headers = ['Date', 'Visitors', 'Walk-ins', 'Pre-registered', 'Avg Duration'];
    const rows = reportData.daily.map(d =>
      [d.date, d.visitors, d.walkIns, d.preRegistered, d.avgDuration]
    );

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentData = () => {
    switch(dateRange) {
      case 'day': return reportData.hourly;
      case 'month': return reportData.monthly;
      default: return reportData.daily;
    }
  };

  const getTotalStats = () => {
    const data = getCurrentData();
    const total = data.reduce((sum, item) => sum + item.visitors, 0);
    const walkIns = data.reduce((sum, item) => sum + (item.walkIns || 0), 0);
    const preRegistered = data.reduce((sum, item) => sum + (item.preRegistered || 0), 0);
    
    return { total, walkIns, preRegistered };
  };

  const stats = getTotalStats();

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
      
      <div className={`min-h-screen flex ${
        activeTheme === 'light' 
          ? 'bg-gray-50' 
          : 'bg-black'
      } transition-colors duration-200`}>
        <Sidebar 
          currentRole={currentRole}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          activeTheme={activeTheme}
        />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className={`text-3xl font-light mb-2 tracking-tight ${
                  activeTheme === 'light' 
                    ? 'text-gray-900' 
                    : 'text-white'
                }`}>
                  Reports & Analytics
                </h1>
                <p className={`text-lg ${
                  activeTheme === 'light' 
                    ? 'text-gray-500' 
                    : 'text-gray-400'
                }`}>
                  Comprehensive visitor analytics and performance insights
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className={`${
                  activeTheme === 'light' 
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-800'
                } px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors`}>
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => exportToCSV('visitor_analytics')}
                  className={`${
                    activeTheme === 'light' 
                      ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                      : 'bg-white hover:bg-gray-100 text-black'
                  } px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors`}
                >
                  <Download className="h-5 w-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className={`${
              activeTheme === 'light' 
                ? 'bg-white border border-gray-100' 
                : 'bg-gray-900 border border-gray-800'
            } rounded-lg p-6 mb-8`}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className={`h-5 w-5 ${
                    activeTheme === 'light' 
                      ? 'text-gray-500' 
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    activeTheme === 'light' 
                      ? 'text-gray-700' 
                      : 'text-gray-300'
                  }`}>
                    Filters:
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className={`h-4 w-4 ${
                    activeTheme === 'light' 
                      ? 'text-gray-500' 
                      : 'text-gray-400'
                  }`} />
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className={`${
                      activeTheme === 'light' 
                        ? 'bg-white border-gray-200 text-gray-900' 
                        : 'bg-black border-gray-800 text-white'
                    } border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900`}
                  >
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <BarChart3 className={`h-4 w-4 ${
                    activeTheme === 'light' 
                      ? 'text-gray-500' 
                      : 'text-gray-400'
                  }`} />
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className={`${
                      activeTheme === 'light' 
                        ? 'bg-white border-gray-200 text-gray-900' 
                        : 'bg-black border-gray-800 text-white'
                    } border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900`}
                  >
                    <option value="overview">Overview</option>
                    <option value="detailed">Detailed Analytics</option>
                    <option value="performance">Host Performance</option>
                    <option value="companies">Company Analysis</option>
                  </select>
                </div>

                {currentRole === 'admin' && (
                  <div className="flex items-center space-x-2">
                    <User className={`h-4 w-4 ${
                      activeTheme === 'light' 
                        ? 'text-gray-500' 
                        : 'text-gray-400'
                    }`} />
                    <select 
                      value={currentRole} 
                      onChange={(e) => setCurrentRole(e.target.value)}
                      className={`${
                        activeTheme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900' 
                          : 'bg-black border-gray-800 text-white'
                      } border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900`}
                    >
                      <option value="admin">Admin View</option>
                      <option value="receptionist">Receptionist View</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={Users}
                title={`Total Visitors (${dateRange})`}
                value={stats.total}
                change="+15%"
                activeTheme={activeTheme}
              />
              <StatsCard
                icon={UserPlus}
                title="Walk-in Visitors"
                value={stats.walkIns}
                change="+23%"
                activeTheme={activeTheme}
              />
              <StatsCard
                icon={UserCheck}
                title="Pre-registered"
                value={stats.preRegistered}
                change="+8%"
                activeTheme={activeTheme}
              />
              <StatsCard
                icon={Clock}
                title="Avg. Visit Duration"
                value="2.3h"
                change="-5%"
                activeTheme={activeTheme}
              />
            </div>

            {/* Charts Section */}
            {reportType === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <CleanBarChart 
                  data={getCurrentData()} 
                  title={`Visitor Traffic - ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`}
                  dataKey="visitors"
                  activeTheme={activeTheme}
                />
                <CleanBarChart 
                  data={getCurrentData().filter(item => item.walkIns)} 
                  title="Walk-ins vs Pre-registered"
                  dataKey="walkIns"
                  activeTheme={activeTheme}
                />
              </div>
            )}

            {/* Host Performance Table */}
            {(reportType === 'performance' || currentRole === 'admin') && (
              <div className={`${
                activeTheme === 'light' 
                  ? 'bg-white border border-gray-100' 
                  : 'bg-gray-900 border border-gray-800'
              } rounded-lg overflow-hidden mb-8`}>
                <div className={`px-6 py-4 border-b ${
                  activeTheme === 'light' 
                    ? 'border-gray-100' 
                    : 'border-gray-800'
                }`}>
                  <h3 className={`text-lg font-medium ${
                    activeTheme === 'light' 
                      ? 'text-gray-900' 
                      : 'text-white'
                  }`}>
                    Host Performance
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={activeTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Avg Duration
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Satisfaction
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      activeTheme === 'light' 
                        ? 'divide-gray-100' 
                        : 'divide-gray-800'
                    }`}>
                      {hostPerformance.map((host, index) => (
                        <tr key={index} className={activeTheme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              activeTheme === 'light' 
                                ? 'text-gray-900' 
                                : 'text-white'
                            }`}>
                              {host.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              activeTheme === 'light' 
                                ? 'text-gray-900' 
                                : 'text-white'
                            }`}>
                              {host.totalVisitors}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              activeTheme === 'light' 
                                ? 'text-gray-500' 
                                : 'text-gray-400'
                            }`}>
                              {host.avgDuration}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`text-sm ${
                                activeTheme === 'light' 
                                  ? 'text-gray-900' 
                                  : 'text-white'
                              }`}>
                                {host.satisfaction}
                              </div>
                              <div className="ml-2 text-yellow-400">★</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              host.satisfaction >= 4.8 ? 
                                activeTheme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-400' :
                              host.satisfaction >= 4.5 ? 
                                activeTheme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900/30 text-yellow-400' :
                                activeTheme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-900/30 text-red-400'
                            }`}>
                              {host.satisfaction >= 4.8 ? 'Excellent' :
                               host.satisfaction >= 4.5 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Company Frequency Table */}
            {(reportType === 'companies' || currentRole === 'admin') && (
              <div className={`${
                activeTheme === 'light' 
                  ? 'bg-white border border-gray-100' 
                  : 'bg-gray-900 border border-gray-800'
              } rounded-lg overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${
                  activeTheme === 'light' 
                    ? 'border-gray-100' 
                    : 'border-gray-800'
                }`}>
                  <h3 className={`text-lg font-medium ${
                    activeTheme === 'light' 
                      ? 'text-gray-900' 
                      : 'text-white'
                  }`}>
                    Top Visiting Companies
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={activeTheme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Company
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Total Visits
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Last Visit
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Frequency
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          activeTheme === 'light' 
                            ? 'text-gray-500' 
                            : 'text-gray-400'
                        }`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      activeTheme === 'light' 
                        ? 'divide-gray-100' 
                        : 'divide-gray-800'
                    }`}>
                      {companyFrequency.map((company, index) => (
                        <tr key={index} className={activeTheme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              activeTheme === 'light' 
                                ? 'text-gray-900' 
                                : 'text-white'
                            }`}>
                              {company.company}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              activeTheme === 'light' 
                                ? 'text-gray-900' 
                                : 'text-white'
                            }`}>
                              {company.visits}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              activeTheme === 'light' 
                                ? 'text-gray-500' 
                                : 'text-gray-400'
                            }`}>
                              {company.lastVisit}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              company.visits >= 40 ? 
                                activeTheme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-400' :
                              company.visits >= 25 ? 
                                activeTheme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900/30 text-yellow-400' :
                                activeTheme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-gray-400'
                            }`}>
                              {company.visits >= 40 ? 'High' :
                               company.visits >= 25 ? 'Medium' : 'Low'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                            <button className={`${
                              activeTheme === 'light' 
                                ? 'text-gray-600 hover:text-gray-800' 
                                : 'text-gray-400 hover:text-gray-200'
                            } transition-colors`}>
                              View Details
                            </button>
                            <button className={`${
                              activeTheme === 'light' 
                                ? 'text-gray-600 hover:text-gray-800' 
                                : 'text-gray-400 hover:text-gray-200'
                            } transition-colors`}>
                              Export
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 'light' 
                            