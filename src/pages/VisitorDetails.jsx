import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Clock, MapPin, Building } from 'lucide-react';

const VisitorDetails = () => {
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    // Retrieve visitor data from localStorage
    const selectedVisitor = localStorage.getItem('selectedVisitor');
    if (selectedVisitor) {
      const visitorData = JSON.parse(selectedVisitor);

      // Format the visitor data to match the expected structure
      const formattedVisitor = {
        id: visitorData.id,
        name: visitorData.name || `${visitorData.first_name || ''} ${visitorData.last_name || ''}`.trim() || 'Unknown Visitor',
        email: visitorData.email || 'N/A',
        phone: visitorData.phone || 'N/A',
        company: visitorData.company || 'N/A',
        purpose: visitorData.purpose || 'N/A',
        checkInTime: visitorData.check_in_time ? new Date(visitorData.check_in_time).toLocaleString() : 'N/A',
        checkOutTime: visitorData.check_out_time ? new Date(visitorData.check_out_time).toLocaleString() : null,
        host: visitorData.host || 'N/A',
        badgeNumber: visitorData.badge_number || 'N/A',
        photo: visitorData.photo || null,
        status: visitorData.status
      };

      setVisitor(formattedVisitor);
    } else {
      // Fallback to sample data if no data in localStorage
      setVisitor({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Corp',
        purpose: 'Meeting with CEO',
        checkInTime: '2024-01-15 09:30 AM',
        checkOutTime: null,
        host: 'Jane Smith',
        badgeNumber: 'V001',
        photo: null, // URL to photo if available
      });
    }
  }, []);

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Details</h1>
          <p className="text-gray-600">View and manage visitor information</p>
        </div>

        {/* Visitor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">{visitor.name}</h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  visitor.status === 'CI' ? 'bg-green-100 text-green-800' :
                  visitor.status === 'CO' ? 'bg-gray-100 text-gray-800' :
                  visitor.status === 'IM' ? 'bg-blue-100 text-blue-800' :
                  visitor.status === 'W' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {visitor.status === 'CI' ? 'Checked In' :
                   visitor.status === 'CO' ? 'Checked Out' :
                   visitor.status === 'IM' ? 'In Meeting' :
                   visitor.status === 'W' ? 'Waiting' :
                   'Unknown'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{visitor.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{visitor.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{visitor.company}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Host: {visitor.host}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visit Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Check-in Date</p>
                  <p className="text-gray-900">
                    {visitor.checkInTime && visitor.checkInTime !== 'N/A'
                      ? new Date(visitor.checkInTime).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Check-in Time</p>
                  <p className="text-gray-900">
                    {visitor.checkInTime && visitor.checkInTime !== 'N/A'
                      ? new Date(visitor.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="text-gray-900">{visitor.purpose}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badge Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">ID</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Badge Number</p>
                  <p className="text-gray-900 font-mono">{visitor.badgeNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${
                    visitor.status === 'CI' ? 'text-green-600' :
                    visitor.status === 'CO' ? 'text-gray-600' :
                    visitor.status === 'IM' ? 'text-blue-600' :
                    visitor.status === 'W' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {visitor.status === 'CI' ? 'Checked In' :
                     visitor.status === 'CO' ? 'Checked Out' :
                     visitor.status === 'IM' ? 'In Meeting' :
                     visitor.status === 'W' ? 'Waiting' :
                     'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
            Edit Visitor
          </button>
          <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200">
            Check Out
          </button>
          <button className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200">
            Print Badge
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetails;
