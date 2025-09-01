import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, UserCheck, Camera, Edit3, CheckCircle, FileText, User,
  Phone, Mail, Building, Car, MapPin, Target, Timer, Users, ChevronRight,
  X, Check, AlertCircle, RotateCcw, Badge, Clock, Wifi, WifiOff
} from 'lucide-react';
import api from '../api/axios';
import { useNotification } from '../components/NotificationProvider';
import axios from 'axios';

const VisitorCheckIn = () => {
  const [currentStep, setCurrentStep] = useState("form");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    company: "",
    plate: "",
    purpose: "",
    expectedduration: "60",
    host_id: "",
    host_name: ""
  });
  
  const [hasCar, setHasCar] = useState(null);
  const [skipPhoto, setSkipPhoto] = useState(false);
  const [skipSignature, setSkipSignature] = useState(false);
  const [skipHost, setSkipHost] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("Ready to check in");
  const [isOnline, setIsOnline] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hostNotified, setHostNotified] = useState(false);
  const [hostSeen, setHostSeen] = useState(false);
  const [checkoutDisabled, setCheckoutDisabled] = useState(true);
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mock users data
  const users = [
    { id: 1, first_name: "John", last_name: "Smith" },
    { id: 2, first_name: "Sarah", last_name: "Johnson" },
    { id: 3, first_name: "Mike", last_name: "Brown" },
    { id: 4, first_name: "Lisa", last_name: "Davis" }
  ];

  useEffect(() => {
    if (currentStep === "photo" && !skipPhoto) {
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentStep, skipPhoto]);

  useEffect(() => {
    if (currentStep === "complete" && !animationComplete) {
      // Simulate processing and host notification
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        setHostNotified(true);

        // Simulate host seeing the request after a few seconds
        setTimeout(() => {
          setHostSeen(true);
        }, 3000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, animationComplete]);

  // Countdown timer for checkout button
  useEffect(() => {
    if (animationComplete && checkoutDisabled) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCheckoutDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [animationComplete, checkoutDisabled]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setCapturedPhoto(imageDataUrl);

    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }

    // Push to server if signature is skipped (photo taken, signature skipped)
    if (skipSignature) {
      console.log("📸 Photo captured and signature skipped - pushing to server");
      const dataToSend = {
        ...formData,
        photo: imageDataUrl,
        signature: null,
        hasCar: hasCar,
        checkin_time: new Date().toISOString(),
      };
      sendToServer(dataToSend);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const imageDataUrl = canvas.toDataURL("image/png");
    setSignature(imageDataUrl);

    // Push to server if photo is skipped but signature is saved
    if (skipPhoto) {
      console.log("✍️ Signature saved and photo skipped - pushing to server");
      const dataToSend = {
        ...formData,
        photo: null,
        signature: imageDataUrl,
        hasCar: hasCar,
        checkin_time: new Date().toISOString(),
      };
      sendToServer(dataToSend);
    }
    // Push to server if both photo and signature are completed (neither skipped)
    else if (capturedPhoto && !skipSignature) {
      console.log("📸📝 Both photo and signature completed - pushing to server");
      const dataToSend = {
        ...formData,
        photo: capturedPhoto,
        signature: imageDataUrl,
        hasCar: hasCar,
        checkin_time: new Date().toISOString(),
      };
      sendToServer(dataToSend);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "host_id") {
      const selectedUser = users.find(user => user.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        [name]: value,
        host_name: selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.email ||
        !formData.company || !formData.purpose || (hasCar && !formData.plate)) {
      alert("Please fill in all required fields");
      return;
    }

    // Push to server if both photo and signature are skipped (default case)
    if (skipPhoto && skipSignature) {
      console.log("📝 Form completed and both photo & signature skipped - pushing to server");
      const dataToSend = {
        ...formData,
        photo: null,
        signature: null,
        hasCar: hasCar,
        checkin_time: new Date().toISOString(),
      };
      sendToServer(dataToSend);
    }

    setCurrentStep(getNextStep());
  };

  const handleSkipConfirm = (stepType) => {
    if (stepType === "photo") {
      setSkipPhoto(true);
      setCurrentStep(getNextStep());
    } else if (stepType === "signature") {
      setSkipSignature(true);
      setCurrentStep("complete");
    }
  };

  const sendToServer = async (data) => {
    console.log("🚀 Starting backend push to kiosk-checkin endpoint");
    console.log("📤 Data being sent:", data);

    try {
      console.log("🌐 Making API request to: /api/visitors/kiosk-checkin/");

      const response = await api.post("/api/visitors/kiosk-checkin/", data);

      console.log("📡 Response status:", response.status);
      console.log("📡 Response data:", response.data);

      console.log("✅ Backend push successful! Response data:", response.data);
      setStatus("Checked in successfully!");
      return response.data;
    } catch (err) {
      console.error("❌ API Error:", err);
      console.error("❌ Error details:", err.response?.data || err.message);
      setStatus("Error: Saved Locally");
      return false;
    }
  };
  const resetProcess = () => {
    setCurrentStep("form");
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      company: "",
      plate: "",
      purpose: "",
      expectedduration: "60",
      host_id: "",
      host_name: ""
    });
    setHasCar(null);
    setSkipPhoto(false);
    setSkipSignature(false);
    setSkipHost(false);
    setCapturedPhoto(null);
    setSignature(null);
    setAnimationComplete(false);
    setHostNotified(false);
    setHostSeen(false);
  };

  const getStepStatus = (stepId) => {
    const steps = ["form", !skipPhoto ? "photo" : null, !skipSignature ? "signature" : null, "complete"].filter(Boolean);
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(stepId);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const getNextStep = () => {
    if (currentStep === "form") {
      return skipPhoto ? (skipSignature ? "complete" : "signature") : "photo";
    }
    if (currentStep === "photo") {
      return skipSignature ? "complete" : "signature";
    }
    if (currentStep === "signature") {
      return "complete";
    }
    return "complete";
  };

  const getPreviousStep = () => {
    if (currentStep === "complete") {
      return skipSignature ? (skipPhoto ? "form" : "photo") : "signature";
    }
    if (currentStep === "signature") {
      return skipPhoto ? "form" : "photo";
    }
    if (currentStep === "photo") {
      return "form";
    }
    return "form";
  };

  const CheckAnimation = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          {/* Outer circle animation */}
          <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-pulse"></div>
          
          {/* Inner circle with check */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 w-32 h-32 border-2 border-green-300 rounded-full animate-ping opacity-25"></div>
        </div>
        
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-2xl font-bold text-green-700">Check-in Complete!</h3>
          <p className="text-green-600">Welcome to our facility</p>
        </div>
      </div>
    );
  };

  const HostNotificationStatus = () => {
    if (!formData.host_name) return null;
    
    return (
      <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{formData.host_name}</p>
              <p className="text-sm text-gray-600">Your host</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!hostNotified ? (
              <div className="flex items-center space-x-2 text-orange-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Notifying...</span>
              </div>
            ) : !hostSeen ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Notification sent</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Host notified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Responsive Step Indicator */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            {[
              { id: "form", icon: FileText, label: "Details", required: true },
              { id: "photo", icon: Camera, label: "Photo", required: false },
              { id: "signature", icon: Edit3, label: "Signature", required: false },
              { id: "complete", icon: CheckCircle, label: "Complete", required: true },
            ].map((step, index) => {
              const stepStatus = getStepStatus(step.id);
              const isSkipped = (step.id === "photo" && skipPhoto) || (step.id === "signature" && skipSignature);
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3 flex-1">
                    <div className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                      stepStatus === "current" ? "bg-blue-100 shadow-md scale-105 sm:scale-110" : 
                      stepStatus === "completed" ? "bg-green-100" :
                      isSkipped ? "bg-gray-100" :
                      "bg-gray-50"
                    }`}>
                      <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 transition-colors ${
                        stepStatus === "current" ? "text-blue-600" : 
                        stepStatus === "completed" ? "text-green-600" :
                        isSkipped ? "text-gray-400" :
                        "text-gray-400"
                      }`} />
                    </div>
                    <div className="text-center">
                      <span className={`text-xs sm:text-sm font-semibold ${
                        stepStatus === "current" ? "text-blue-600" : 
                        stepStatus === "completed" ? "text-green-600" :
                        "text-gray-500"
                      }`}>
                        {step.label}
                      </span>
                      {!step.required && (
                        <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                          {isSkipped ? "Skipped" : "Optional"}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`h-px flex-1 mx-2 sm:mx-4 transition-colors ${
                      stepStatus === "completed" ? "bg-green-300" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Enhanced Responsive Form */}
        {currentStep === "form" && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="max-w-3xl mx-auto space-y-8 lg:space-y-10">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Visitor Information
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">Please provide your details for check-in</p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Basic Info */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span>Basic Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg"
                          placeholder="your.email@company.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg"
                        placeholder="Your company name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <Car className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span>Vehicle Information</span>
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                      Do you have a vehicle today? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setHasCar(true)}
                        className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                          hasCar === true 
                            ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md" 
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <Car className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
                        <span className="text-base sm:text-lg font-semibold block">Yes, I have a car</span>
                        <span className="text-xs sm:text-sm text-gray-500">I'll need parking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHasCar(false);
                          setFormData(prev => ({ ...prev, plate: "" }));
                        }}
                        className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                          hasCar === false 
                            ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md" 
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <MapPin className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
                        <span className="text-base sm:text-lg font-semibold block">No vehicle</span>
                        <span className="text-xs sm:text-sm text-gray-500">Public transport/walking</span>
                      </button>
                    </div>
                  </div>

                  {hasCar && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        License Plate Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Car className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <input
                          type="text"
                          name="plate"
                          value={formData.plate}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg uppercase"
                          placeholder="ABC-1234"
                          required={hasCar}
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        We'll help you find parking upon arrival
                      </p>
                    </div>
                  )}
                </div>

                {/* Visit Details */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span>Visit Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Purpose of Visit <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Target className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg appearance-none bg-white"
                          required
                        >
                          <option value="">Select purpose</option>
                          <option value="Meeting">Business Meeting</option>
                          <option value="Interview">Job Interview</option>
                          <option value="Delivery">Delivery/Pickup</option>
                          <option value="Maintenance">Maintenance Service</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Training">Training Session</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Expected Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Timer className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <select
                          name="expectedduration"
                          value={formData.expectedduration}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg appearance-none bg-white"
                          required
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                          <option value="480">Full day</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {!skipHost && (
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Host Selection
                        </label>
                        <button
                          type="button"
                          onClick={() => setSkipHost(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Skip this step
                        </button>
                      </div>
                      <div className="relative">
                        <Users className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <select
                          name="host_id"
                          value={formData.host_id}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base sm:text-lg appearance-none bg-white"
                        >
                          <option value="">Select your host (optional)</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.first_name} {user.last_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Steps Selection */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span>Additional Options</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className={`p-4 sm:p-6 border-2 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                      skipPhoto ? "border-gray-200 bg-gray-50" : "border-blue-200 bg-blue-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                            skipPhoto ? "bg-gray-200" : "bg-blue-100"
                          }`}>
                            <Camera className={`h-4 w-4 sm:h-6 sm:w-6 ${
                              skipPhoto ? "text-gray-500" : "text-blue-600"
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-900">Photo Capture</p>
                            <p className="text-xs sm:text-sm text-gray-600">For your visitor badge</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSkipPhoto(!skipPhoto)}
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                            skipPhoto 
                              ? "bg-gray-200 text-gray-600 hover:bg-gray-300" 
                              : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                          }`}
                        >
                          {skipPhoto ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Check className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className={`p-4 sm:p-6 border-2 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                      skipSignature ? "border-gray-200 bg-gray-50" : "border-blue-200 bg-blue-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                            skipSignature ? "bg-gray-200" : "bg-blue-100"
                          }`}>
                            <Edit3 className={`h-4 w-4 sm:h-6 sm:w-6 ${
                              skipSignature ? "text-gray-500" : "text-blue-600"
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-900">Digital Signature</p>
                            <p className="text-xs sm:text-sm text-gray-600">Terms acknowledgment</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSkipSignature(!skipSignature)}
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                            skipSignature 
                              ? "bg-gray-200 text-gray-600 hover:bg-gray-300" 
                              : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                          }`}
                        >
                          {skipSignature ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Check className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Quick Check-in</p>
                        <p className="text-xs sm:text-sm text-blue-700">
                          You can skip photo and signature for faster processing. These can be completed later if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8">
                <button
                  onClick={resetProcess}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center space-x-3"
                >
                  <span>Continue Check-in</span>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photo Capture */}
        {currentStep === "photo" && !skipPhoto && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Take Your Photo
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">This will be used for your visitor badge and security</p>
              </div>

              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-inner">
                  {!capturedPhoto ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full max-w-sm sm:w-80 lg:w-96 h-48 sm:h-60 lg:h-72 object-cover rounded-lg sm:rounded-xl border-2 sm:border-4 border-white shadow-lg"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      {cameraActive && (
                        <div className="absolute inset-x-0 bottom-4 sm:bottom-6">
                          <button
                            onClick={capturePhoto}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl transform hover:scale-105"
                          >
                            <Camera className="h-6 w-6 sm:h-8 sm:w-8" />
                          </button>
                        </div>
                      )}
                      {!cameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg sm:rounded-xl">
                          <div className="text-center">
                            <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm sm:text-base">Initializing camera...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={capturedPhoto}
                        alt="Captured visitor photo"
                        className="w-full max-w-sm sm:w-80 lg:w-96 h-48 sm:h-60 lg:h-72 object-cover rounded-lg sm:rounded-xl border-2 sm:border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={retakePhoto}
                        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                      >
                        Retake Photo
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4 mt-6 sm:mt-8">
                  <button
                    onClick={() => handleSkipConfirm("photo")}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50"
                  >
                    Skip Photo
                  </button>
                </div>

                {capturedPhoto && (
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                    <button
                      onClick={() => setCurrentStep(getPreviousStep())}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(getNextStep())}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center space-x-3"
                    >
                      <span>{!skipSignature ? "Next: Signature" : "Complete Check-in"}</span>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Signature */}
        {currentStep === "signature" && !skipSignature && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Digital Signature
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">Please sign below to acknowledge our visitor policies</p>
              </div>

              <div className="text-center">
                <div className="inline-block border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white shadow-inner overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={Math.min(600, window.innerWidth - 100)}
                    height={200}
                    className="border border-gray-200 cursor-crosshair bg-white rounded-lg sm:rounded-xl shadow-sm w-full max-w-full"
                    style={{ touchAction: 'none' }}
                    onMouseDown={(e) => {
                      const canvas = canvasRef.current;
                      const rect = canvas.getBoundingClientRect();
                      const context = canvas.getContext("2d");
                      context.beginPath();
                      context.moveTo(
                        e.clientX - rect.left,
                        e.clientY - rect.top
                      );
                      canvas.isDrawing = true;
                    }}
                    onMouseMove={(e) => {
                      const canvas = canvasRef.current;
                      if (!canvas.isDrawing) return;
                      const rect = canvas.getBoundingClientRect();
                      const context = canvas.getContext("2d");
                      context.lineWidth = 3;
                      context.lineCap = "round";
                      context.strokeStyle = "#1f2937";
                      context.lineTo(
                        e.clientX - rect.left,
                        e.clientY - rect.top
                      );
                      context.stroke();
                    }}
                    onMouseUp={() => {
                      const canvas = canvasRef.current;
                      canvas.isDrawing = false;
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const canvas = canvasRef.current;
                      const rect = canvas.getBoundingClientRect();
                      const context = canvas.getContext("2d");
                      const touch = e.touches[0];
                      context.beginPath();
                      context.moveTo(
                        touch.clientX - rect.left,
                        touch.clientY - rect.top
                      );
                      canvas.isDrawing = true;
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const canvas = canvasRef.current;
                      if (!canvas.isDrawing) return;
                      const rect = canvas.getBoundingClientRect();
                      const context = canvas.getContext("2d");
                      const touch = e.touches[0];
                      context.lineWidth = 3;
                      context.lineCap = "round";
                      context.strokeStyle = "#1f2937";
                      context.lineTo(
                        touch.clientX - rect.left,
                        touch.clientY - rect.top
                      );
                      context.stroke();
                    }}
                    onTouchEnd={() => {
                      const canvas = canvasRef.current;
                      canvas.isDrawing = false;
                    }}
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-4">
                    Sign with your mouse, finger, or stylus
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    onClick={clearSignature}
                    className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={saveSignature}
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-md"
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Save Signature</span>
                  </button>
                </div>

                <div className="flex justify-center mt-4 sm:mt-6">
                  <button
                    onClick={() => handleSkipConfirm("signature")}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50"
                  >
                    Skip Signature
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-10">
                  <button
                    onClick={() => setCurrentStep(getPreviousStep())}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep("complete")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center space-x-3"
                    disabled={!signature}
                  >
                    <span>Complete Check-in</span>
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {!signature && (
                  <div className="text-center mt-4">
                    <p className="text-xs sm:text-sm text-gray-500">Please sign above or skip to continue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Completion with Animation */}
        {currentStep === "complete" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Main Success Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-6 sm:p-8 lg:p-12 shadow-sm">
              <div className="max-w-2xl mx-auto text-center space-y-8">
                
                {/* Animated Checkmark */}
                {!animationComplete ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <div className="relative">
                      {/* Processing animation */}
                      <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-blue-200 rounded-full animate-spin">
                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UserCheck className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-6 sm:mt-8 text-center space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Processing Check-in...</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Please wait a moment</p>
                    </div>
                  </div>
                ) : (
                  <CheckAnimation />
                )}

                {/* Visit Summary - Only show after animation */}
                {animationComplete && (
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-center space-x-2">
                      <Badge className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      <span>Visit Summary</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Visitor</span>
                          <div className="mt-1 sm:mt-2">
                            <p className="text-base sm:text-lg font-semibold text-gray-900">{formData.first_name} {formData.last_name}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{formData.company}</p>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Purpose</span>
                          <div className="mt-1 sm:mt-2">
                            <p className="text-base sm:text-lg font-semibold text-gray-900">{formData.purpose}</p>
                            <p className="text-xs sm:text-sm text-gray-600">Duration: {formData.expectedduration} minutes</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in Time</span>
                          <div className="mt-1 sm:mt-2">
                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {hasCar && (
                          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Vehicle</span>
                            <div className="mt-1 sm:mt-2 flex items-center space-x-2">
                              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              <p className="text-base sm:text-lg font-semibold text-blue-900">{formData.plate}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Host Notification Status */}
                {animationComplete && <HostNotificationStatus />}

                {/* Action Buttons - Only show after animation */}
                {animationComplete && (
                  <div className="space-y-4 sm:space-y-6">
                    <button
                      onClick={sendToServer}
                      disabled={isProcessing || checkoutDisabled}
                      className={`w-full py-4 sm:py-6 px-6 sm:px-8 rounded-lg sm:rounded-xl text-lg sm:text-xl font-bold transition-all duration-200 ${
                        isProcessing
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : checkoutDisabled
                          ? "bg-red-600 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : checkoutDisabled ? (
                        <div className="flex items-center justify-center space-x-3">
                          <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                          <span>Checkout ({Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')})</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <Badge className="h-5 w-5 sm:h-6 sm:w-6" />
                          <span>Print Badge & Complete</span>
                        </div>
                      )}
                    </button>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                      <button
                        onClick={resetProcess}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Start New Check-in
                      </button>
                      <button
                        onClick={() => setCurrentStep("form")}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Next Steps Info */}
                {animationComplete && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-2xl p-4 sm:p-6">
                    <div className="text-center">
                      <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">Next Steps</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 justify-center">
                          <Badge className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-blue-800">Collect your visitor badge</span>
                        </div>
                        <div className="flex items-center space-x-2 justify-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-blue-800">Reception will guide you</span>
                        </div>
                        <div className="flex items-center space-x-2 justify-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-blue-800">Remember to check out</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorCheckIn;