import React, { useState } from "react";
import {
  Camera,
  Upload,
  User,
  Phone,
  Building,
  FileText,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useNotification } from '../components/NotificationProvider.jsx';
import api from '../api/axios.js';

const CheckIn = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    hostName: "",
    purpose: "",
    photo: null,
    nda: null,
    healthDeclaration: false,
  });
  const { addNotification } = useNotification();
  

  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null) {
      form.append(key, value);
    }
  });

  try {
    const response = await api.post("/api/checkin/", form);

    alert("Visitor checked in successfully!");
    setFormData({
      qrCode: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      hostName: "",
      purpose: "",
      photo: null,
      nda: null,
      healthDeclaration: false,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Check-in failed";
    addNotification(errorMessage, 'warning');
  }
};

  const staff = [
    {
      name: "Ivan",
      role: "Manager",
      isHost: true,
      purposes: ["Consultation", "Partnerships"],
    },
    {
      name: "Daisy",
      role: "HR",
      isHost: true,
      purposes: ["Interview", "HR-related"],
    },
    {
      name: "Eric",
      role: "Support",
      isHost: true,
      purposes: ["Technical Support"],
    },
    {
      name: "Lucy",
      role: "Receptionist",
      isHost: false,
      purposes: ["Delivery", "Walk-in"],
    },
  ];

  const getHostForPurpose = (purpose) => {
    if (!purpose) return "";
    const hostStaff = staff.find((member) => member.purposes.includes(purpose));
    return hostStaff ? hostStaff.name : "";
  };

  const handlePurposeChange = (e) => {
    const { name, value } = e.target;
    const hostName = getHostForPurpose(value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      hostName: hostName,
    }));
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

  return (
    <div className={`min-h-screen ${activeTheme === 'light' ? 'bg-gray-50' : 'bg-black'}`}>
      <ThemeSelector />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              activeTheme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
            }`}>
              <CheckCircle2 className={`h-8 w-8 ${
                activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-light mb-4 tracking-tight ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Visitor Check-In
            </h1>
            
            <p className={`text-lg max-w-lg mx-auto leading-relaxed ${
              activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Please fill out the form below to complete your check-in process
            </p>
          </div>

          {/* Form */}
          <div className={`rounded-lg border p-8 ${
            activeTheme === 'light' 
              ? 'bg-white border-gray-100' 
              : 'bg-gray-900 border-gray-800'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className={`text-lg font-medium mb-6 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        activeTheme === 'light'
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                      } hover:border-gray-300`}
                    />
                  </div>
                  
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        activeTheme === 'light'
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                      } hover:border-gray-300`}
                    />
                  </div>
                  
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        activeTheme === 'light'
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                      } hover:border-gray-300`}
                    />
                  </div>
                  
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <Building className="h-4 w-4" />
                      <span>Company/Organization</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        activeTheme === 'light'
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                      } hover:border-gray-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Visit Information */}
              <div>
                <h3 className={`text-lg font-medium mb-6 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Visit Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <FileText className="h-4 w-4" />
                      <span>Purpose of Visit</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handlePurposeChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        activeTheme === 'light'
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                      }`}
                    >
                      <option value="">Select purpose</option>
                      <option value="Consultation">Business Meeting</option>
                      <option value="Interview">Interview</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="HR-related">HR Related</option>
                      <option value="Walk-in">Walk-in</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <User className="h-4 w-4" />
                      <span>Host Name</span>
                    </label>
                    <input
                      type="text"
                      name="hostName"
                      value={formData.hostName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        activeTheme === 'light'
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                          : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                      } hover:border-gray-300`}
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h3 className={`text-lg font-medium mb-6 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <Camera className="h-4 w-4" />
                      <span>Photo Upload</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      activeTheme === 'light'
                        ? 'border-gray-200 hover:border-gray-400 bg-gray-50'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "photo")}
                        className="hidden"
                        id="photo"
                      />
                      <label htmlFor="photo" className="cursor-pointer">
                        <Upload className={`h-8 w-8 mx-auto mb-2 ${
                          activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-sm ${
                          activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {formData.photo ? formData.photo.name : "Click to upload photo"}
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                      activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      <FileText className="h-4 w-4" />
                      <span>NDA/Documents</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      activeTheme === 'light'
                        ? 'border-gray-200 hover:border-gray-400 bg-gray-50'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "nda")}
                        className="hidden"
                        id="nda"
                      />
                      <label htmlFor="nda" className="cursor-pointer">
                        <Upload className={`h-8 w-8 mx-auto mb-2 ${
                          activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-sm ${
                          activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {formData.nda ? formData.nda.name : "Upload NDA or documents"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Declaration */}
              <div className={`p-4 rounded-lg border ${
                activeTheme === 'light' 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-yellow-900/20 border-yellow-800'
              }`}>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="healthDeclaration"
                    checked={formData.healthDeclaration}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <div className="text-sm pt-[0.1rem]">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        activeTheme === 'light' ? 'text-yellow-600' : 'text-yellow-500'
                      }`} />
                      <p className={`font-medium ${
                        activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Health Declaration *
                      </p>
                    </div>
                    <p className={`leading-relaxed ${
                      activeTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      I confirm that I am not experiencing any symptoms of illness
                      and agree to follow all health and safety protocols.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className={`inline-flex items-center space-x-2 font-medium py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-sm transform hover:scale-105 active:scale-95 ${
                    activeTheme === 'light'
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Complete Check-In</span>
                </button>
              </div>
            </form>

            {/* Help Text */}
            <div className={`mt-8 p-4 rounded-lg border ${
              activeTheme === 'light' 
                ? 'bg-gray-50 border-gray-100' 
                : 'bg-gray-800 border-gray-700'
            }`}>
              <p className={`text-xs uppercase tracking-wide font-medium mb-2 ${
                activeTheme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Need Help?
              </p>
              <p className={`text-sm ${
                activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                If you're experiencing any issues with the check-in process, 
                please contact the reception desk for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;