import React, { useEffect, useRef, useState } from 'react';
import { Users, Clock, TrendingUp, Download, UserCheck, UserX, UserPlus, AlertCircle, User, ChevronRight, Home, BarChart3, Settings, Calendar, Bell, Menu, X, LogOut, CheckCircle, XCircle, Eye } from 'lucide-react';

import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/NotificationProvider.jsx';
import { Link } from 'react-router';

// Sample data for host dashboard
const hostInfo = {
  name: 'Sarah Wilson',
  department: 'Marketing',
  email: 'sarah.wilson@company.com',
  office: 'Floor 3, Room 301'
};

const HostDashboard = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedVisitor, setSelectedVisitor] = useState(null);



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { addNotification } = useNotification();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const initialLoad = useRef(true)

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    // { id: 'visitors', icon: Users, label: 'My Visitors' },
    { id: 'calendar', icon: Calendar, label: 'Schedule', URL: '/host-schedule' },
    { id: 'notifications', icon: Bell, label: 'Notifications', URL: '/notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleApproveVisitor = (visitorId) => {
    const visitor = pendingList.find(v => v.id === visitorId);
    if (visitor) {
      setPendingList(pendingList.filter(v => v.id !== visitorId));
      setVisitorList([...visitorList, {
        ...visitor,
        checkIn: 'Pending Arrival',
        status: 'Approved',
        type: 'Approved'
      }]);
    }
  }; // not working

  const handleRejectVisitor = (visitorId) => {
    setPendingList(pendingList.filter(v => v.id !== visitorId));
  };

  const handleLogout = () => {
    addNotification('Logged out', 'warning');
    localStorage.clear();
    window.location.href = '/login';
    console.log('');
  };

  // Light Theme Components
  const LightSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Host Portal</h2>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      {/* Host Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{hostInfo.name}</p>
            <p className="text-xs text-gray-500">{hostInfo.department}</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 px-4">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.URL}
            onClick={() => setActiveNav(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors ${
              activeNav === item.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  const LightStatsCard = ({ icon: Icon, title, value, change, trend }) => (
    <div className="bg-white border border-gray-100 p-6 transition-all duration-200 hover:border-gray-200 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-light text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={`text-xs flex items-center ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'
            }`}>
              {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className="ml-4 p-2 bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const LightPendingTable = ({ title, data }) => (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {data.map((visitor) => (
          <div key={visitor.id} className="px-6 py-4 hover:bg-gray-25 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">{visitor.name}</div>
                <div className="text-xs text-gray-500 mb-1">{visitor.company}</div>
                <div className="text-xs text-gray-400">{visitor.purpose}</div>
              </div>
              <div className="text-xs text-gray-400 mr-4">
                {visitor.appointmentTime}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproveVisitor(visitor.id)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleRejectVisitor(visitor.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Reject"
                >
                  <XCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedVisitor(visitor)}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const LightVisitorTable = ({ title, data }) => (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {data.map((visitor) => (
          <div key={visitor.id} className="px-6 py-4 hover:bg-gray-25 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">{`${visitor.first_name} ${visitor.last_name}`}</div>
                <div className="text-xs text-gray-500 mb-1">{visitor.company}</div>
                <div className="text-xs text-gray-400">{visitor.purpose}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-2 py-1 rounded-full text-xs ${
                  visitor.status === 'In Meeting' ? 'bg-blue-100 text-blue-800' :
                  visitor.status === 'checked_in' ? 'bg-green-100 text-green-800' :
                  visitor.status === 'checked_ut' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {visitor.status}
                </div>
                <div className="text-xs text-gray-400">
                  {visitor.checkIn}
                </div>
                <ChevronRight className="h-3 w-3 text-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Dark Theme Components
  const DarkSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
        <h2 className="text-lg font-medium text-white">Host Portal</h2>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded hover:bg-gray-800"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      {/* Host Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{hostInfo.name}</p>
            <p className="text-xs text-gray-400">{hostInfo.department}</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 px-4">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.URL}
            onClick={() => setActiveNav(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors ${
              activeNav === item.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  const DarkStatsCard = ({ icon: Icon, title, value, change, trend }) => (
    <div className="bg-gray-900 border border-gray-800 p-6 transition-all duration-200 hover:border-gray-700 hover:bg-gray-850">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
          <p className="text-2xl font-light text-white mb-1">{value}</p>
          {change && (
            <p className={`text-xs flex items-center ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'
            }`}>
              {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className="ml-4 p-2 bg-gray-800 rounded-lg">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </div>
  );

  const DarkPendingTable = ({ title, data }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-100 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-gray-800">
        {data.map((visitor) => (
          <div key={visitor.id} className="px-6 py-4 hover:bg-gray-800 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100 mb-1">{visitor.name}</div>
                <div className="text-xs text-gray-400 mb-1">{visitor.company}</div>
                <div className="text-xs text-gray-500">{visitor.purpose}</div>
              </div>
              <div className="text-xs text-gray-500 mr-4">
                {visitor.appointmentTime}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproveVisitor(visitor.id)}
                  className="p-1 text-green-400 hover:bg-green-900 hover:bg-opacity-20 rounded transition-colors"
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleRejectVisitor(visitor.id)}
                  className="p-1 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors"
                  title="Reject"
                >
                  <XCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedVisitor(visitor)}
                  className="p-1 text-gray-400 hover:bg-gray-700 rounded transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DarkVisitorTable = ({ title, data }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-100 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-gray-800">
        {data.map((visitor) => (
          <div key={visitor.id} className="px-6 py-4 hover:bg-gray-800 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100 mb-1">{visitor.name}</div>
                <div className="text-xs text-gray-400 mb-1">{visitor.company}</div>
                <div className="text-xs text-gray-500">{visitor.purpose}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-2 py-1 rounded-full text-xs ${
                  visitor.status === 'In Meeting' ? 'bg-blue-900 bg-opacity-50 text-blue-300' :
                  visitor.status === 'checked_in' ? 'bg-green-900 bg-opacity-50 text-green-300' :
                  visitor.status === 'Checked Out' ? 'bg-gray-700 text-gray-300' :
                  'bg-yellow-900 bg-opacity-50 text-yellow-300'
                }`}>
                  {visitor.status}
                </div>
                <div className="text-xs text-gray-500">
                  {visitor.checkIn}
                </div>
                <ChevronRight className="h-3 w-3 text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Visitor Detail Modal
  const VisitorModal = ({ visitor, onClose, theme }) => {
    if (!visitor) return null;

    const modalClasses = theme === 'light' 
      ? 'bg-white border-gray-200 text-gray-900'
      : 'bg-gray-800 border-gray-700 text-white';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${modalClasses} border rounded-lg p-6 max-w-md w-full`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Visitor Details</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium opacity-70">Name</label>
              <p>{visitor.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Company</label>
              <p>{visitor.company}</p>
            </div>
            <div>
              <label className="text-sm font-medium opacity-70">Purpose</label>
              <p>{visitor.purpose}</p>
            </div>
            {visitor.email && (
              <div>
                <label className="text-sm font-medium opacity-70">Email</label>
                <p>{visitor.email}</p>
              </div>
            )}
            {visitor.phone && (
              <div>
                <label className="text-sm font-medium opacity-70">Phone</label>
                <p>{visitor.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium opacity-70">Time</label>
              <p>{visitor.appointmentTime || visitor.checkIn}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  

  const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        addNotification('Loading..', 'info');
        
        const [statsRes, visitorsRes, approvalsRes, hoursRes, trendsRes] = await Promise.all([
          api.get('/api/dashboard/stats/').catch(err => {
            addNotification('Could not load statistics', 'warning');
            return { data: null };
          }),
          api.get('/api/dashboard/current-visitors/').catch(err => {
            addNotification('Could not load current visitors', 'warning');
            return { data: [] };
          }),
          api.get('/api/dashboard/pending-approvals/').catch(err => {
            addNotification('Could not load pending approvals', 'warning');
            return { data: [] };
          }),
          api.get('/api/dashboard/peak-hours/').catch(err => {
            addNotification('Could not load peak hours data', 'warning');
            return { data: [] };
          }),
          api.get('/api/dashboard/monthly-trends/').catch(err => {
            addNotification('Could not load monthly trends', 'warning');
            return { data: [] };
          })
        ]);
  
        // Set data only if response exists
        if (statsRes.data) setStats(statsRes.data);
        if (visitorsRes.data) setVisitors(visitorsRes.data);
        console.log(visitorsRes.data)
        if (approvalsRes.data) setPendingApprovals(approvalsRes.data);
        if (hoursRes.data) setPeakHours(hoursRes.data);
        if (trendsRes.data) setMonthlyTrends(trendsRes.data);
  
        setLastUpdated(new Date());
        addNotification('Dashboard updated successfully', 'success');
  
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        addNotification('Failed to load dashboard data', 'error');
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          addNotification('Session expired - redirecting to login', 'error');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
  

    const { user } = useAuth();
    const [currentRole, setCurrentRole] = useState('admin');
  
  
    useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      fetchData();
    }
    
    // // Set up polling every 30 seconds
    // const interval = setInterval(fetchData, 30000);
    // return () => clearInterval(interval);
  }, []);
  
   const handleCheckOut = async (visitorId) => {
      try {
        await api.post(`/api/visitors/${visitorId}/checkout`);
        fetchData(); // Refresh data
      } catch (err) {
        console.error('Failed to check out visitor:', err);
        setError('Failed to check out visitor. Please try again.');
      }
    };
  
    const handleApprove = async (requestId) => {
      try {
        await api.post(`/api/visitors/approve/${requestId}`);
        fetchData(); // Refresh data
      } catch (err) {
        console.error('Failed to approve request:', err);
        setError('Failed to approve request. Please try again.');
      }
    };
  
    const handleReject = async (requestId) => {
      try {
        await api.post(`/api/visitors/reject/${requestId}`);
        fetchData(); // Refresh data
      } catch (err) {
        console.error('Failed to reject request:', err);
        setError('Failed to reject request. Please try again.');
      }
    };
  
  
     const getVisibleVisitors = () => {
      if (currentRole === 'host') {
        return visitors.filter(v => v.host === user?.name);
      }
      return visitors;
    };
  
    const getVisiblePendingApprovals = () => {
      if (currentRole === 'host') {
        return pendingApprovals.filter(v => v.host === user?.name);
      }
      return pendingApprovals;
    };
  
    const visibleVisitors = getVisibleVisitors();
    console.log(`${visibleVisitors[0]?.first_name} ${visibleVisitors[0]?.last_name}`)
    console.log(`${visibleVisitors}`)
    const visiblePendingApprovals = getVisiblePendingApprovals();
  
  
     const formatDuration = (duration) => {
    if (!duration) return '0sec';
  
    // Handle Django format: HH:MM:SS.microseconds
    if (typeof duration === 'string') {
      const [timePart] = duration.split('.');
      const parts = timePart.split(':').map(Number); // Convert to numbers
  
      if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
  
        let result = '';
        if (hours > 0) result += `${hours}hr `;
        if (minutes > 0) result += `${minutes}min `;
        if (seconds > 0 || result === '') result += `${seconds}sec`;
  
        return result.trim();
      }
  
      return timePart;
    }
  
    return '0sec';
  }
  
  const formatCheckinTime = (datetimeString) => {
    if (!datetimeString) return '';
  
    const date = new Date(datetimeString);
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
  
    const formattedHours = (hours % 12) || 12; // convert 0 to 12
    const formattedMinutes = minutes.toString().padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };


  const statsData = [
    { icon: AlertCircle, title: 'Pending Approvals', value: visiblePendingApprovals.length.toString(), change: 'Awaiting your response' },
    { icon: Users, title: 'My Visitors Today', value: visiblePendingApprovals.filter(v => v.status !== 'Checked Out').length.toString(), change: 'Currently with you' },
    { icon: UserCheck, title: 'Total This Month', value: '23', change: '+12% from last month', trend: 'up' },
    { icon: Clock, title: 'Avg Meeting Duration', value: '6h', change: 'total visit', trend: 'up' }
  ];


  // Theme Selector
  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => 
          // setActiveTheme('light')
          fetchData()
        }
        className={`px-4 py-2 text-sm font-medium transition-colors  ${
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
      
      
      {selectedVisitor && (
        <VisitorModal 
          visitor={selectedVisitor} 
          onClose={() => setSelectedVisitor(null)}
          theme={activeTheme}
        />
      )}

      {activeTheme === 'light' ? (
        // Light Theme Layout
        <div className="flex h-screen bg-gray-50">
          <LightSidebar />
          
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mr-4 p-1 rounded hover:bg-gray-100"
                  >
                    <Menu className="h-5 w-5 text-gray-500" />
                  </button>
                  <h1 className="text-2xl font-light text-gray-900">Host Dashboard</h1>
                </div>
                <p className="text-gray-500 text-sm">Manage your visitors and appointments</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                  <LightStatsCard key={index} {...stat} />
                ))}
                
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               {visiblePendingApprovals.length > 0 ? <LightPendingTable title="Pending Approvals" data={visiblePendingApprovals} /> : <div className="text-gray-500">No Pending Approvals</div> }
                {visibleVisitors.length > 0 ? <LightVisitorTable title="My Visitors" data={visibleVisitors} /> : <div className="text-gray-500">No Visitors</div>}
              </div>

               

              {/* Action Button */}
              <div className="flex justify-end">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export Visitor Log</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dark Theme Layout
        <div className="flex h-screen bg-black">
          <DarkSidebar />
          
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mr-4 p-1 rounded hover:bg-gray-800"
                  >
                    <Menu className="h-5 w-5 text-gray-400" />
                  </button>
                  <h1 className="text-2xl font-light text-white">Host Dashboard</h1>
                </div>
                <p className="text-gray-400 text-sm">Manage your visitors and appointments</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                  <DarkStatsCard key={index} {...stat} />
                ))}
              </div>

              {/* Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {visiblePendingApprovals.length > 0 ? <DarkPendingTable title="Pending Approvals" data={visiblePendingApprovals} /> : <div className="text-gray-500">No Pending Approvals</div>}
                {visibleVisitors.length > 0 ? <DarkVisitorTable title="My Visitors" data={visibleVisitors} /> : <div className="text-gray-500">No Visitors</div>}
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button className="flex items-center space-x-2  px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export Visitor Log</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;