import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Camera,
  User,
  Phone,
  Clock,
  FileText,
  CheckCircle,
  UserPlus,
  RotateCcw,
  ChevronRight,
  Undo,
  Redo,
  ArrowLeft,
  Building,
  Mail,
  Target,
  Timer,
  Badge,
  Wifi,
  WifiOff,
  Car,
} from "lucide-react";

import axios from "axios";
import { useNotification } from "../components/NotificationProvider";
import { form } from "framer-motion/client";

const NewKiosk = () => {
  const [currentStep, setCurrentStep] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [status, setStatus] = useState("Idle");
  const { addNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [formData, setFormData] = useState({
    first_name: "",
    phone: "",
    plate: "",
    email: "",
    company: "",
    purpose: "",
    hostname: "",
    badgenumber: "",
    expectedduration: "30",
    host_id: "",
    host_name: "", // ✅ This is correct
  });

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Network connection handling
  useEffect(() => {
    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        // syncPendingCheckins();
        // syncOfflineCheckins();
      }
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    // Try to sync when component mounts and we're online
    if (navigator.onLine) {
      // syncPendingCheckins();
      // syncOfflineCheckins();
    }

    handleFetchUsers();

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  const sendToServer = async (data) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const res = await fetch(
        "https://smart-visit-backend.onrender.com/api/visitors/kiosk-checkin/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (res.ok) {
        const responseData = await res.json(); // ✅ Parse the response to get the visitor ID
        setStatus("Checked in successfully!");
        return responseData; // ✅ Return the response data instead of just true
      } else {
        const errorData = await res.text();
        console.error("API Error:", errorData);
        setStatus("Error: Saved Locally");
        return false;
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.error("Request timed out");
      } else {
        console.error("Server error:", err);
      }
      setStatus("Error: Offline fallback");
      return false;
    }
  };

  // Mock data for demonstration
  const preRegisteredVisitors = [
    {
      id: 1,
      name: "John Smith",
      phone: "+1234567890",
      company: "Tech Corp",
      purpose: "Meeting",
      hostName: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Alice Brown",
      phone: "+1234567891",
      company: "Design Co",
      purpose: "Interview",
      hostName: "Mike Davis",
    },
    {
      id: 3,
      name: "Bob Wilson",
      phone: "+1234567892",
      company: "StartUp Inc",
      purpose: "Presentation",
      hostName: "Emma Thompson",
    },
  ];

  const filteredVisitors = preRegisteredVisitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.phone.includes(searchQuery) ||
      visitor.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "host_id") {
      const selectedHost = users.find((user) => user.id.toString() === value);
      setFormData((prev) => ({
        ...prev,
        host_id: selectedHost?.id || "",
        host_name: selectedHost
          ? `${selectedHost.first_name} ${selectedHost.last_name}`
          : "", // ✅ Fixed
      }));
      // ✅ Use setTimeout to log updated state
      setTimeout(() => {
        console.log("Updated formData:", formData);
      }, 0);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVisitorSelect = (visitor) => {
    setFormData({
      ...formData,
      first_name: visitor.first_name,
      phone: visitor.phone,
      company: visitor.company,
      purpose: visitor.purpose,
      hostname: visitor.hostname,
    });
  };

  const handleWalkInRegistration = () => {
    setIsWalkIn(true);
    setCurrentStep("form");
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const dataURL = canvas.toDataURL("image/png");
      setCapturedPhoto(dataURL);

      // Stop camera
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Signature functions
  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  const saveSignature = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      setSignature(dataURL);
    }
  };

  const resetProcess = () => {
    setCurrentStep("search");
    setSearchQuery("");
    setIsWalkIn(false);
    setCapturedPhoto(null);
    setSignature(null);
    setStatus("Idle");
    setFormData({
      first_name: "",
      phone: "",
      email: "",
      plate: "",
      company: "",
      purpose: "",
      hostname: "",
      badgenumber: "",
      expectedduration: "30",
      host_id: "",
      host_name: "", // ✅ Reset this too
    });
  };

  const handleFetchUsers = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      addNotification("You must be logged in to fetch users.", "error");
      return;
    }

    try {
      const response = await axios.get(
        "https://smart-visit-backend.onrender.com/api/auth/users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // ✅ Filter only hosts
        const hostUsers = response.data.filter((user) => user.role === "host");
        setUsers(hostUsers);
        // addNotification("Hosts loaded successfully!", "success");
        // console.log("Host users loaded:", hostUsers);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error(error);
      // addNotification(
      //   error.response?.data?.message ||
      //     error.message ||
      //     "Failed to fetch users.",
      //   "error"
      // );
    }
  };

  const handleSubmit = async () => {
    // ✅ Better validation
    if (!formData.first_name || !formData.phone || !formData.host_id) {
      alert("Name, Phone, and Host selection are required");
      return;
    }

    setStatus("Processing...");

    // ✅ Log formData before submitting
    console.log("Submitting formData:", formData);

    const visitorData = {
      ...formData,
      last_name: formData.last_name || "-",
      photo: capturedPhoto,
      signature: signature,
      check_in_time: new Date().toISOString(),
      status: "checked_in",
      visitor_type: "walk_in",
    };

    // ✅ Log complete visitor data
    console.log("Complete visitor data being sent:", visitorData);

    try {
      if (!navigator.onLine) {
        setStatus("Offline: Saved Locally");
      } else {
        // 1. First send visitor data to server
        const visitorResponse = await sendToServer(visitorData);

        if (visitorResponse && visitorResponse.id) {
          // 2. Then send comprehensive notifications
          const notificationPayload = {
            visitor_id: visitorResponse.id,
            host_id: formData.host_id,
            message: `Visitor ${formData.first_name} has checked in.`,
            channels: ["email", "pusher"],
            data: {
              check_in_time: new Date().toISOString(),
              location: formData.location || "Main Reception",
            },
          };

          // Send to your notification endpoint
          await axios.post(
            "https://smart-visit-backend.onrender.com/api/notifications/bulk_notify/",
            notificationPayload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          setStatus("Check-in successful!");
        }
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      setStatus("Error occurred - please try again");
    } finally {
      setTimeout(() => {
        resetProcess();
      }, 3000);
    }
  };

  useEffect(() => {
    if (currentStep === "photo" && !capturedPhoto) {
      startCamera();
    }
  }, [currentStep]);

  const StepIndicator = () => (
    <div className="bg-white border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {[
          { id: "search", icon: Search, label: "Search" },
          { id: "form", icon: FileText, label: "Details" },
          { id: "photo", icon: Camera, label: "Photo" },
          { id: "signature", icon: FileText, label: "Signature" },
          { id: "complete", icon: CheckCircle, label: "Complete" },
        ].map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center space-x-2 ${
                currentStep === step.id ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <step.icon className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:block">
                {step.label}
              </span>
            </div>
            {index < 4 && (
              <ChevronRight className="h-3 w-3 text-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const handleBack = () => {
    // In a real app, this would navigate back
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm m-3 
                        bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-light text-gray-900">
                  Visitor Check-In
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">
                    Welcome to our facility
                  </p>
                  <div className="flex items-center space-x-1">
                    {isOnline ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-xs text-gray-400">
                      {isOnline ? "Online" : "Offline Mode"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                {new Date().toLocaleTimeString()}
              </p>
              {status !== "Idle" && (
                <p className="text-xs text-blue-600 mt-1">Status: {status}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <StepIndicator />

        {/* Step 1: Search */}
        {currentStep === "search" && (
          <div className="bg-white border border-gray-100 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Let's get you checked in
                </h2>
                <p className="text-gray-500">
                  Search for your pre-registered visit or register as a walk-in
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, or company..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-none focus:border-gray-400 focus:outline-none text-lg"
                />
              </div>

              {searchQuery && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                    Pre-registered Visitors
                  </h3>
                  {filteredVisitors.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {filteredVisitors.map((visitor) => (
                        <div
                          key={visitor.id}
                          onClick={() => handleVisitorSelect(visitor)}
                          className="p-4 hover:bg-gray-25 cursor-pointer transition-colors duration-150"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {visitor.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {visitor.company} • {visitor.purpose}
                              </div>
                              <div className="text-xs text-gray-400">
                                Host: {visitor.hostName}
                              </div>
                            </div>
                            <ChevronRight className="h-3 w-3 text-gray-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8 text-sm">
                      No pre-registered visitors found
                    </p>
                  )}
                </div>
              )}

              <div className="text-center pt-6">
                <button
                  onClick={handleWalkInRegistration}
                  className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register as Walk-in</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {currentStep === "form" && (
          <div className="bg-white border border-gray-100 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  {isWalkIn ? "Walk-in Registration" : "Visitor Information"}
                </h2>
                <p className="text-gray-500">Please fill in your details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Number Plate <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="plate"
                        name="plate"
                        value={formData.car}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                        placeholder="Car number plate"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                      placeholder="Company name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Visit <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                        required
                      >
                        <option value="">Select purpose</option>
                        <option value="Meeting">Business Meeting</option>
                        <option value="Interview">Interview</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Host Name
                    </label>
                    <select
                      name="host_id"
                      value={formData.host_id}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                      required
                    >
                      <option value="">Select Host</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Duration <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      name="expectedduration"
                      value={formData.expectedduration}
                      required
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-gray-400 focus:outline-none"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="480">All day</option>
                    </select>
                  </div>
                </div>

                {/* ✅ Debug info - remove in production */}
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <strong>Debug Info:</strong>
                  <br />
                  Host ID: {formData.host_id}
                  <br />
                  Host Name: {formData.host_name}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={resetProcess}
                  className="flex-1 bg-gray-600 text-white py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if(formData.purpose === "" || formData.company === "" || formData.badgenumberhost_id === "") {
                      alert("Please fill in all required fields.")
                      return
                    }
                    setCurrentStep("photo")
                  }}
                  className="flex-1 bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Next: Take Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photo Capture */}
        {currentStep === "photo" && (
          <div className="bg-white border border-gray-100 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Take Your Photo
                </h2>
                <p className="text-gray-500">
                  This will be used for your visitor badge
                </p>
              </div>

              <div className="text-center">
                <div className="inline-block bg-gray-50 border border-gray-100 p-4 mb-6">
                  {!capturedPhoto ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-80 h-60 object-cover border border-gray-200"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      {cameraActive && (
                        <button
                          onClick={capturePhoto}
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <Camera className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={capturedPhoto}
                        alt="Captured"
                        className="w-80 h-60 object-cover border border-gray-200"
                      />
                      <button
                        onClick={retakePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Retake Photo
                      </button>
                    </div>
                  )}
                </div>

                {capturedPhoto && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep("form")}
                      className="flex-1 bg-gray-600 text-white py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep("signature")}
                      className="flex-1 bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Next: Signature
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Signature */}
        {currentStep === "signature" && (
          <div className="bg-white border border-gray-100 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Digital Signature
                </h2>
                <p className="text-gray-500">
                  Please sign below to complete your check-in
                </p>
              </div>

              <div className="text-center">
                <div className="inline-block border border-gray-200 p-4 mb-6">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="border border-gray-100 cursor-crosshair"
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
                      context.lineWidth = 2;
                      context.lineCap = "round";
                      context.strokeStyle = "#000";
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
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Draw your signature above
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={clearSignature}
                    className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={saveSignature}
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Save Signature</span>
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentStep("photo")}
                    className="flex-1 bg-gray-600 text-white py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  {signature && (
                    <button
                      onClick={() => setCurrentStep("complete")}
                      className="flex-1 bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Complete Check-in
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === "complete" && (
          <div className="bg-white border border-gray-100 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Check-in Complete!
                </h2>
                <p className="text-gray-500 mb-6">
                  Welcome to our facility, {formData.first_name}!
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-6">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">
                  Visit Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Visitor:</span>
                    <p className="text-gray-900 font-medium">
                      {formData.first_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Company:</span>
                    <p className="text-gray-900 font-medium">
                      {formData.company || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Purpose:</span>
                    <p className="text-gray-900 font-medium">
                      {formData.purpose}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Host:</span>
                    <p className="text-gray-900 font-medium">
                      {formData.host_name}
                    </p>{" "}
                    {/* ✅ Fixed reference */}
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <p className="text-gray-900 font-medium">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="text-gray-900 font-medium">
                      {formData.expectedduration} minutes
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p
                      className={`font-medium ${
                        status.includes("successfully")
                          ? "text-green-600"
                          : status.includes("Offline") ||
                            status.includes("Error")
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Connection:</span>
                    <p
                      className={`font-medium ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {!isOnline && (
                <div className="bg-orange-50 border border-orange-200 p-4">
                  <div className="flex items-center space-x-2">
                    <WifiOff className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-700">
                      Your check-in has been saved locally and will sync when
                      connection is restored.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={status === "Processing..."}
                  className={`px-8 py-3 text-sm font-medium transition-colors ${
                    status === "Processing..."
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {status === "Processing..."
                    ? "Processing..."
                    : "Print Badge & Finish"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewKiosk;
