import React, { useState } from 'react';
import { 
  Users, Clock, TrendingUp, Download, UserCheck, UserX, UserPlus, 
  AlertCircle, Shield, User, Menu, X, Home, ClipboardList, 
  Settings, Badge, LogOut, FormInput, Monitor, UserCog, Eye,
  CheckCircle, XCircle, Calendar, Phone, Mail, Building
} from 'lucide-react';

// Mock data for pending approvals
const pendingApprovals = [
  { 
    id: 8, 
    name: 'Peter Parker', 
    company: 'Daily Bugle', 
    host: 'J. Jonah Jameson', 
    appointmentTime: '03:00 PM',
    appointmentDate: '2025-07-23',
    status: 'Pending',
    email: 'peter.parker@dailybugle.com',
    phone: '+1 (555) 123-4567',
    purpose: 'Photography meeting for upcoming article',
    requestedAt: '2025-07-23 10:30 AM',
    avatar: 'PP',
    priority: 'Normal'
  },
  { 
    id: 9, 
    name: 'Clark Kent', 
    company: 'Daily Planet', 
    host: 'Lois Lane', 
    appointmentTime: '04:00 PM',
    appointmentDate: '2025-07-23',
    status: 'Pending',
    email: 'clark.kent@dailyplanet.com',
    phone: '+1 (555) 987-6543',
    purpose: 'Interview collaboration discussion',
    requestedAt: '2025-07-23 11:15 AM',
    avatar: 'CK',
    priority: 'High'
  },
  { 
    id: 10, 
    name: 'Bruce Wayne', 
    company: 'Wayne Enterprises', 
    host: 'Sarah Wilson', 
    appointmentTime: '05:00 PM',
    appointmentDate: '2025-07-23',
    status: 'Pending',
    email: 'bruce.wayne@wayneenterprises.com',
    phone: '+1 (555) 555-0123',
    purpose: 'Board meeting preparation and strategy discussion',
    requestedAt: '2025-07-23 09:45 AM',
    avatar: 'BW',
    priority: 'High'
  },
  { 
    id: 11, 
    name: 'Diana Prince', 
    company: 'Smithsonian Institution', 
    host: 'Mike Johnson', 
    appointmentTime: '10:00 AM',
    appointmentDate: '2025-07-24',
    status: 'Pending',
    email: 'diana.prince@smithsonian.gov',
    phone: '+1 (555) 246-8135',
    purpose: 'Ancient artifacts consultation',
    requestedAt: '2025-07-23 02:20 PM',
    avatar: 'DP',
    priority: 'Normal'
  },
  { 
    id: 12, 
    name: 'Tony Stark', 
    company: 'Stark Industries', 
    host: 'David Lee', 
    appointmentTime: '02:30 PM',
    appointmentDate: '2025-07-24',
    status: 'Pending',
    email: 'tony.stark@starkindustries.com',
    phone: '+1 (555) 789-0123',
    purpose: 'Technology partnership discussion',
    requestedAt: '2025-07-23 01:10 PM',
    avatar: 'TS',
    priority: 'High'
  }
];

// Navigation items based on role
const NAVIGATION_ITEMS = {
  admin: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCheck, label: 'Check-in', path: '/check-in' },
    { icon: ClipboardList, label: 'Visitor Management', path: '/dashboard/visitors' },
    { icon: AlertCircle, label: 'Pending Approvals', path: '/dashboard/approvals', isActive: true },
    { icon: FormInput, label: 'Form Builder', path: '/form-builder' },
    { icon: Badge, label: 'Badge Designer', path: '/badge' },
    { icon: Monitor, label: 'Kiosk Setup', path: '/kiosk-checkin' },
    { icon: TrendingUp, label: 'Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: UserCog, label: 'User Management', path: '/dashboard/users' }
  ],
  receptionist: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCheck, label: 'Check-in', path: '/check-in' },
    { icon: ClipboardList, label: 'Visitor Management', path: '/dashboard/visitors' },
    { icon: Badge, label: 'Print Badges', path: '/badge' },
    { icon: AlertCircle, label: 'Pending Approvals', path: '/dashboard/approvals', isActive: true },
    { icon: TrendingUp, label: 'Reports', path: '/dashboard/reports' }
  ],
  host: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'My Visitors', path: '/dashboard/my-visitors' },
    { icon: AlertCircle, label: 'My Approvals', path: '/dashboard/my-approvals', isActive: true },
    { icon: UserCog, label: 'Profile', path: '/profile' }
  ]
};

const Sidebar = ({ currentRole, isCollapsed, onToggle, onLogout }) => {
  const navigationItems = NAVIGATION_ITEMS[currentRole] || [];

  return (
    <>
      
      <div className={`bg-white border-r border-gray-200 transition-all duration-200 ease-in-out flex flex-col`}>
        <div className={`flex items-center h-12 px-3 border-b border-gray-200 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!isCollapsed && (
            <h2 className="text-sm font-medium text-gray-800 truncate">
              Visitor Manager
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
          >
            {isCollapsed ? 
              <Menu className="h-4 w-4" /> : 
              <X className="h-4 w-4" />
            }
          </button>
        </div>

        <nav className="flex-1 py-2">
          <div className={isCollapsed ? 'space-y-1' : 'space-y-0.5'}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path} className="relative group">
                  <button
                    className={`flex items-center transition-colors duration-150 w-full ${
                      isCollapsed 
                        ? 'justify-center h-10 mx-1' 
                        : 'h-8 px-3 mx-2'
                    } ${
                      item.isActive 
                        ? isCollapsed
                          ? 'bg-blue-500 text-white rounded-md shadow-sm'
                          : 'bg-blue-500 text-white border-l-2 border-blue-600 ml-0 pl-5 rounded-r-md shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md'
                    }`}
                  >
                    <Icon className={`flex-shrink-0 ${
                      isCollapsed ? 'h-4 w-4' : 'h-4 w-4'
                    }`} />
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-normal truncate">
                        {item.label}
                      </span>
                    )}
                  </button>

                  {isCollapsed && (
                    <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {!isCollapsed && (
          <div className="px-3 py-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Account
            </div>
          </div>
        )}

        <div className="mt-auto border-t border-gray-200">
          <div className="relative group">
            <button
              onClick={onLogout}
              className={`flex items-center transition-colors duration-150 text-red-600 hover:text-red-700 hover:bg-red-50 w-full ${
                isCollapsed 
                  ? 'justify-center h-10 m-1 rounded-md' 
                  : 'h-8 px-3 m-2 rounded-md'
              }`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-normal">Logout</span>
              )}
            </button>

            {isCollapsed && (
              <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const StatsCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className="text-sm mt-1 text-gray-600">
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const ApprovalCard = ({ visitor, onApprove, onReject, onViewDetails, currentRole }) => {
  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Normal: 'bg-gray-100 text-gray-800',
    Low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {visitor.avatar}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{visitor.name}</h3>
            <p className="text-sm text-gray-600">{visitor.company}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[visitor.priority]}`}>
          {visitor.priority}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {currentRole !== 'host' && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Host: {visitor.host}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{visitor.appointmentDate} at {visitor.appointmentTime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <span>{visitor.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building className="h-4 w-4 mr-2" />
          <span className="truncate">{visitor.purpose}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails(visitor)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => onReject(visitor.id)}
            className="flex items-center px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </button>
          <button
            onClick={() => onApprove(visitor.id)}
            className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

const VisitorDetailsModal = ({ visitor, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !visitor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Visitor Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {visitor.avatar}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{visitor.name}</h3>
              <p className="text-gray-600">{visitor.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{visitor.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{visitor.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Host</label>
                <p className="text-gray-900">{visitor.host}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Appointment Date</label>
                <p className="text-gray-900">{visitor.appointmentDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Appointment Time</label>
                <p className="text-gray-900">{visitor.appointmentTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  visitor.priority === 'High' ? 'bg-red-100 text-red-800' :
                  visitor.priority === 'Normal' ? 'bg-gray-100 text-gray-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {visitor.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-500">Purpose of Visit</label>
            <p className="text-gray-900 mt-1">{visitor.purpose}</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-500">Request Submitted</label>
            <p className="text-gray-900 mt-1">{visitor.requestedAt}</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                onReject(visitor.id);
                onClose();
              }}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Reject
            </button>
            <button
              onClick={() => {
                onApprove(visitor.id);
                onClose();
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VisitorApprovals = () => {
  const [currentRole, setCurrentRole] = useState('admin');
  const [hostName, setHostName] = useState('Sarah Wilson');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [visitorList, setVisitorList] = useState(pendingApprovals);
  const [filter, setFilter] = useState('all'); // all, today, tomorrow, high-priority

  const getVisibleApprovals = () => {
    let filtered = visitorList;
    
    if (currentRole === 'host') {
      filtered = filtered.filter(v => v.host === hostName);
    }

    if (filter === 'today') {
      filtered = filtered.filter(v => v.appointmentDate === '2025-07-23');
    } else if (filter === 'tomorrow') {
      filtered = filtered.filter(v => v.appointmentDate === '2025-07-24');
    } else if (filter === 'high-priority') {
      filtered = filtered.filter(v => v.priority === 'High');
    }

    return filtered;
  };

  const handleApprove = (visitorId) => {
    setVisitorList(prev => prev.filter(v => v.id !== visitorId));
    // Here you would typically send an API request
    console.log('Approved visitor:', visitorId);
  };

  const handleReject = (visitorId) => {
    setVisitorList(prev => prev.filter(v => v.id !== visitorId));
    // Here you would typically send an API request
    console.log('Rejected visitor:', visitorId);
  };

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setShowDetailsModal(true);
  };

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const visibleApprovals = getVisibleApprovals();
  const totalPending = visitorList.length;
  const highPriorityCount = visitorList.filter(v => v.priority === 'High').length;
  const todayCount = visitorList.filter(v => v.appointmentDate === '2025-07-23').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentRole={currentRole}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />
      
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentRole === 'host' ? 'My Approvals' : 'Pending Approvals'}
                  {currentRole === 'host' && <span className="text-xl text-gray-600 ml-2">- {hostName}</span>}
                </h1>
                <p className="text-gray-600 mt-2">
                  Review and manage visitor approval requests
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {currentRole === 'host' && (
                  <select 
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sarah Wilson">Sarah Wilson</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Lisa Brown">Lisa Brown</option>
                    <option value="David Lee">David Lee</option>
                    <option value="J. Jonah Jameson">J. Jonah Jameson</option>
                    <option value="Lois Lane">Lois Lane</option>
                  </select>
                )}
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="host">Host</option>
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={AlertCircle}
                title="Total Pending"
                value={currentRole === 'host' ? visibleApprovals.length : totalPending}
                change="Awaiting approval"
                color="bg-orange-500"
              />
              <StatsCard
                icon={Clock}
                title="Today's Requests"
                value={currentRole === 'host' ? visibleApprovals.filter(v => v.appointmentDate === '2025-07-23').length : todayCount}
                change="For today"
                color="bg-blue-500"
              />
              <StatsCard
                icon={TrendingUp}
                title="High Priority"
                value={currentRole === 'host' ? visibleApprovals.filter(v => v.priority === 'High').length : highPriorityCount}
                change="Urgent requests"
                color="bg-red-500"
              />
              <StatsCard
                icon={UserCheck}
                title="Average Response"
                value="12m"
                change="Response time"
                color="bg-green-500"
              />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'All Requests' },
                    { key: 'today', label: 'Today' },
                    { key: 'tomorrow', label: 'Tomorrow' },
                    { key: 'high-priority', label: 'High Priority' }
                  ].map((filterOption) => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === filterOption.key
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Approval Cards Grid */}
            {visibleApprovals.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleApprovals.map((visitor) => (
                  <ApprovalCard
                    key={visitor.id}
                    visitor={visitor}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewDetails}
                    currentRole={currentRole}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'All visitor requests have been processed.' 
                    : `No visitor requests match the current filter: ${filter.replace('-', ' ')}.`
                  }
                </p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all requests
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visitor Details Modal */}
      <VisitorDetailsModal
        visitor={selectedVisitor}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default VisitorApprovals;