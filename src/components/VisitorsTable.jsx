import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Phone, Mail, Building2, Clock } from 'lucide-react';

const VisitorsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const itemsPerPage = 8;

  // Extended visitor data with 20 visitors
  const allVisitors = [
    {
      id: '#VIS001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      company: 'TechCorp Inc.',
      purpose: 'Business Meeting',
      checkIn: '10:30 AM',
      checkOut: '2:45 PM',
      date: '3-26-2024',
      status: 'checked_out',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '#VIS002', 
      name: 'Michael Chen',
      email: 'michael.chen@startup.io',
      company: 'StartupXYZ',
      purpose: 'Interview',
      checkIn: '9:15 AM',
      checkOut: '-',
      date: '3-26-2024',
      status: 'In Meeting',
      phone: '+1 (555) 234-5678'
    },
    {
      id: '#VIS003',
      name: 'Emily Rodriguez',
      email: 'emily.r@consulting.com',
      company: 'Global Consulting',
      purpose: 'Client Consultation',
      checkIn: '11:00 AM',
      checkOut: '-',
      date: '3-26-2024',
      status: 'checked_in',
      phone: '+1 (555) 345-6789'
    },
    {
      id: '#VIS004',
      name: 'David Kim',
      email: 'david.kim@tech.com',
      company: 'Innovation Labs',
      purpose: 'Partnership Discussion',
      checkIn: '1:30 PM',
      checkOut: '4:15 PM',
      date: '3-25-2024',
      status: 'checked_out',
      phone: '+1 (555) 456-7890'
    },
    {
      id: '#VIS005',
      name: 'Lisa Wang',
      email: 'lisa.wang@design.co',
      company: 'Creative Design Co',
      purpose: 'Design Review',
      checkIn: '2:00 PM',
      checkOut: '-',
      date: '3-25-2024',
      status: 'Waiting',
      phone: '+1 (555) 567-8901'
    },
    {
      id: '#VIS006',
      name: 'James Wilson',
      email: 'james.w@finance.com',
      company: 'Financial Partners',
      purpose: 'Financial Planning',
      checkIn: '10:00 AM',
      checkOut: '12:30 PM',
      date: '3-25-2024',
      status: 'checked_out',
      phone: '+1 (555) 678-9012'
    },
    {
      id: '#VIS007',
      name: 'Amanda Martinez',
      email: 'amanda.m@marketing.com',
      company: 'Marketing Pro',
      purpose: 'Campaign Review',
      checkIn: '3:15 PM',
      checkOut: '-',
      date: '3-24-2024',
      status: 'checked_in',
      phone: '+1 (555) 789-0123'
    },
    {
      id: '#VIS008',
      name: 'Robert Taylor',
      email: 'robert.t@logistics.com',
      company: 'Swift Logistics',
      purpose: 'Supply Chain Meeting',
      checkIn: '8:45 AM',
      checkOut: '11:30 AM',
      date: '3-24-2024',
      status: 'checked_out',
      phone: '+1 (555) 890-1234'
    },
    {
      id: '#VIS009',
      name: 'Jennifer Brown',
      email: 'jen.brown@healthcare.org',
      company: 'HealthTech Solutions',
      purpose: 'Product Demo',
      checkIn: '1:00 PM',
      checkOut: '3:30 PM',
      date: '3-24-2024',
      status: 'checked_out',
      phone: '+1 (555) 901-2345'
    },
    {
      id: '#VIS010',
      name: 'Alex Thompson',
      email: 'alex.t@education.edu',
      company: 'EdTech Institute',
      purpose: 'Research Collaboration',
      checkIn: '10:15 AM',
      checkOut: '-',
      date: '3-23-2024',
      status: 'In Meeting',
      phone: '+1 (555) 012-3456'
    },
    {
      id: '#VIS011',
      name: 'Maria Garcia',
      email: 'maria.g@retail.com',
      company: 'Retail Solutions',
      purpose: 'System Integration',
      checkIn: '2:30 PM',
      checkOut: '5:00 PM',
      date: '3-23-2024',
      status: 'checked_out',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '#VIS012',
      name: 'Kevin Lee',
      email: 'kevin.lee@automotive.com',
      company: 'Auto Innovations',
      purpose: 'Technology Review',
      checkIn: '9:00 AM',
      checkOut: '12:00 PM',
      date: '3-23-2024',
      status: 'checked_out',
      phone: '+1 (555) 234-5678'
    },
    {
      id: '#VIS013',
      name: 'Rachel Green',
      email: 'rachel.g@media.com',
      company: 'Digital Media Corp',
      purpose: 'Content Strategy',
      checkIn: '11:30 AM',
      checkOut: '-',
      date: '3-22-2024',
      status: 'Waiting',
      phone: '+1 (555) 345-6789'
    },
    {
      id: '#VIS014',
      name: 'Thomas Anderson',
      email: 'thomas.a@security.com',
      company: 'CyberSafe Inc.',
      purpose: 'Security Audit',
      checkIn: '8:30 AM',
      checkOut: '4:45 PM',
      date: '3-22-2024',
      status: 'checked_out',
      phone: '+1 (555) 456-7890'
    },
    {
      id: '#VIS015',
      name: 'Sophie Miller',
      email: 'sophie.m@legal.com',
      company: 'Legal Associates',
      purpose: 'Contract Review',
      checkIn: '1:45 PM',
      checkOut: '3:15 PM',
      date: '3-22-2024',
      status: 'checked_out',
      phone: '+1 (555) 567-8901'
    },
    {
      id: '#VIS016',
      name: 'Carlos Rodriguez',
      email: 'carlos.r@construction.com',
      company: 'BuildRight Corp',
      purpose: 'Project Planning',
      checkIn: '7:30 AM',
      checkOut: '10:00 AM',
      date: '3-21-2024',
      status: 'checked_out',
      phone: '+1 (555) 678-9012'
    },
    {
      id: '#VIS017',
      name: 'Isabella Davis',
      email: 'isabella.d@hospitality.com',
      company: 'Hotel Management Plus',
      purpose: 'Service Review',
      checkIn: '3:00 PM',
      checkOut: '-',
      date: '3-21-2024',
      status: 'checked_in',
      phone: '+1 (555) 789-0123'
    },
    {
      id: '#VIS018',
      name: 'Nathan Wright',
      email: 'nathan.w@transport.com',
      company: 'Transport Solutions',
      purpose: 'Logistics Meeting',
      checkIn: '12:15 PM',
      checkOut: '2:30 PM',
      date: '3-21-2024',
      status: 'checked_out',
      phone: '+1 (555) 890-1234'
    },
    {
      id: '#VIS019',
      name: 'Grace Kim',
      email: 'grace.k@fashion.com',
      company: 'Fashion Forward',
      purpose: 'Brand Collaboration',
      checkIn: '10:45 AM',
      checkOut: '-',
      date: '3-20-2024',
      status: 'In Meeting',
      phone: '+1 (555) 901-2345'
    },
    {
      id: '#VIS020',
      name: 'Daniel White',
      email: 'daniel.w@energy.com',
      company: 'Green Energy Corp',
      purpose: 'Sustainability Talk',
      checkIn: '2:15 PM',
      checkOut: '4:00 PM',
      date: '3-20-2024',
      status: 'checked_out',
      phone: '+1 (555) 012-3456'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Meeting':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-green-100 text-green-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch(status) {
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      default:
        return status;
    }
  };

  // Generate avatar with initials
  const getAvatar = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-medium`}>
        {initials}
      </div>
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(allVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visitors = allVisitors.slice(startIndex, startIndex + itemsPerPage);

  const handleVisitorClick = (visitor) => {
    setSelectedVisitor(visitor);
  };

  return (
    <div className="flex gap-6">
      {/* Main Table */}
      <div className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Latest Visitors</h3>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
            <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider gap-4">
              <div className="w-16 flex-shrink-0 hidden md:block">ID</div>
              <div className="w-60 flex-shrink-0">VISITOR</div>
              <div className="w-32 flex-shrink-0 hidden xl:block">COMPANY</div>
              <div className="w-20 flex-shrink-0">CHECK IN</div>
              <div className="w-20 flex-shrink-0 hidden lg:block">CHECK OUT</div>
              <div className="w-20 flex-shrink-0 hidden lg:block">DATE</div>
              <div className="w-28 flex-shrink-0">STATUS</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-50">
            {visitors.map((visitor) => (
              <div key={visitor.id} className="px-6 py-4 hover:bg-gray-25 transition-colors duration-150 cursor-pointer" onClick={() => handleVisitorClick(visitor)}>
                <div className="flex items-center gap-4">
                  {/* ID */}
                  <div className="text-sm font-medium text-blue-600 whitespace-nowrap w-16 flex-shrink-0 hidden md:block">
                    {visitor.id}
                  </div>

                  {/* Visitor Info */}
                  <div className="flex items-center space-x-3 w-60 flex-shrink-0">
                    <div className="flex-shrink-0">
                      {getAvatar(visitor.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{visitor.name}</div>
                      <div className="text-xs text-gray-500 truncate">{visitor.email}</div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="text-sm text-gray-900 whitespace-nowrap w-32 flex-shrink-0 hidden xl:block">
                    {visitor.company}
                  </div>

                  {/* Check In */}
                  <div className="text-sm text-gray-900 whitespace-nowrap w-20 flex-shrink-0">
                    {visitor.checkIn}
                  </div>

                  {/* Check Out */}
                  <div className="text-sm text-gray-900 whitespace-nowrap w-20 flex-shrink-0 hidden lg:block">
                    {visitor.checkOut}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-900 whitespace-nowrap w-20 flex-shrink-0 hidden lg:block">
                    {visitor.date}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between w-28 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(visitor.status)}`}>
                      {formatStatus(visitor.status)}
                    </span>
                    {/* <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 ml-2" /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {/* Pagination */}
<div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  {/* Info */}
  <div className="text-sm text-gray-500">
    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, allVisitors.length)} of {allVisitors.length} visitors
  </div>

  {/* Controls */}
  <div className="flex flex-wrap items-center gap-2">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Previous
    </button>
    
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 text-sm rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
    </div>

    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
      <ChevronRight className="h-4 w-4 ml-1" />
    </button>
  </div>
</div>

      </div>

      {/* Visitor Details Card - Hidden on mobile */}
      <div className="w-80 hidden lg:block">
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden sticky top-0">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Visitor Details</h3>
          </div>
          
          {selectedVisitor ? (
            <div className="p-6">
              {/* Avatar and Name */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0">
                  {getAvatar(selectedVisitor.name)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{selectedVisitor.name}</h4>
                  <p className="text-sm text-gray-500">{selectedVisitor.id}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedVisitor.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedVisitor.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedVisitor.company}</span>
                </div>
              </div>

              {/* Visit Details */}
              <div className="space-y-3 mb-6">
                <h5 className="text-sm font-medium text-gray-900">Visit Information</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Purpose:</span>
                    <span className="text-sm text-gray-900">{selectedVisitor.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm text-gray-900">{selectedVisitor.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Check In:</span>
                    <span className="text-sm text-gray-900">{selectedVisitor.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Check Out:</span>
                    <span className="text-sm text-gray-900">{selectedVisitor.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedVisitor.status)}`}>
                  <Clock className="h-4 w-4 mr-2" />
                  {formatStatus(selectedVisitor.status)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <div className="mb-4">
                <Building2 className="h-12 w-12 mx-auto text-gray-300" />
              </div>
              <p className="text-sm">Click on a visitor to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorsTable;