import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  FileText, 
  Users, 
  Badge, 
  Clock, 
  ArrowLeft,
  Edit3,
  Camera,
  CheckCircle,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { Link, useParams } from 'react-router';

const VisitorDetails = () => {
  const { id } = useParams();
  console.log(id)
  const [isEditing, setIsEditing] = useState(false);

  const visibleVisitors = JSON.parse(localStorage.getItem('visibleVisitors')) || [];

  // Find the visitor data by ID
  const visitor = visibleVisitors.find(visitor => visitor.id === parseInt(id));
  console.log(visitor)
  // const [visitor, setvisitor] = useState(visitor || {
  //   name: "John Doe",
  //   phone: "+1 (555) 123-4567",
  //   email: "john.doe@abccorp.com",
  //   company: "ABC Corporation",
  //   purpose: "Business meeting with development team to discuss new project requirements and timeline",
  //   hostName: "Sarah Wilson",
  //   badgeNumber: "V-2024-001",
  //   expectedDuration: "2 hours",
  //   checkInTime: "10:30 AM",
  //   checkInDate: "July 18, 2025",
  //   status: "In Office",
  //   type: "Pre-registered",
  //   photo: null, // In real app, this would be a base64 string or URL
  //   signature: null, // In real app, this would be a base64 string or URL
  //   visitLocation: "Conference Room B",
  //   emergencyContact: "Jane Doe - (555) 987-6543"
  // });

  const handleInputChange = (field, value) => {
    setvisitor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In real app, this would save to backend
    setIsEditing(false);
    console.log('Saving visitor data:', visitor);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setvisitor(prev => ({
          ...prev,
          photo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const InfoField = ({ icon: Icon, label, value, field, multiline = false }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )
        ) : (
          <p className={`text-gray-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
            {value || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'In Office': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'In Meeting': { color: 'bg-blue-100 text-blue-800', icon: Users },
      'Checked Out': { color: 'bg-gray-100 text-gray-800', icon: ArrowLeft },
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const StatusIcon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <StatusIcon className="h-4 w-4 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to=".." className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visitor Details</h1>
                <p className="text-gray-600">View and manage visitor information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={visitor.status} />
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                  isEditing
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? 'Save Changes' : 'Edit'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo and Signature Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo</h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {visitor.photo ? (
                      <img
                        src={visitor.photo}
                        alt="Visitor"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No photo uploaded</p>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature</h3>
              <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {visitor.signature ? (
                  <img
                    src={visitor.signature}
                    alt="Signature"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Edit3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No signature captured</p>
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                  Capture Signature
                </button>
              )}
            </div>
          </div>

          {/* Main Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitor Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    icon={User}
                    label="Full Name"
                    value={visitor.first_name}
                    field="name"
                  />
                  <InfoField
                    icon={Phone}
                    label="Phone Number"
                    value={visitor.phone}
                    field="phone"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    icon={Mail}
                    label="Email Address"
                    value={visitor.email}
                    field="email"
                  />
                  <InfoField
                    icon={Building}
                    label="Company"
                    value={visitor.company}
                    field="company"
                  />
                </div>

                <InfoField
                  icon={FileText}
                  label="Purpose of Visit"
                  value={visitor.purpose}
                  field="purpose"
                  multiline={true}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    icon={Users}
                    label="Host Name"
                    value={visitor.hostName}
                    field="hostName"
                  />
                  <InfoField
                    icon={Badge}
                    label="Badge Number"
                    value={visitor.badgeNumber}
                    field="badgeNumber"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    icon={Clock}
                    label="Expected Duration"
                    value={visitor.expectedDuration}
                    field="expectedDuration"
                  />
                  <InfoField
                    icon={MapPin}
                    label="Visit Location"
                    value={visitor.visitLocation}
                    field="visitLocation"
                  />
                </div>

                <InfoField
                  icon={Phone}
                  label="Emergency Contact"
                  value={visitor.emergencyContact}
                  field="emergencyContact"
                />
              </div>
            </div>

            {/* Visit Details Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Visit Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Check-in Time</p>
                  {(() => {
                    const date = new Date(visitor.check_in_time);
                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateStr = date.toLocaleDateString('en-GB'); // "dd/mm/yyyy" format

                    return (
                    <>
                      <p className="text-lg font-semibold text-gray-900">{timeStr}</p>
                      <p className="text-sm text-gray-500">{dateStr}</p>
                    </>
                  );
                })()}
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Badge className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Visit Type</p>
                  <p className="text-lg font-semibold text-gray-900">{visitor.type}</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="text-lg font-semibold text-gray-900">{visitor.status}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Send Notification to Host
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Print Badge
                </button>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Extend Visit
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Check Out Visitor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetails;