import React, { useState } from "react";
import {
  LogOut,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useNotification } from '../components/NotificationProvider.jsx';
import api from '../api/axios.js';

const Checkout = () => {
  const [activeTheme, setActiveTheme] = useState('light');
  const [formData, setFormData] = useState({
    email: "",
    visitorId: "",
    checkoutNotes: "",
  });
  const { addNotification } = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const response = await api.post("/api/checkout/", form);

      alert("Visitor checked out successfully!");
      setFormData({
        email: "",
        visitorId: "",
        checkoutNotes: "",
      });
    } catch (error) {
      console.error("Check-out error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Check-out failed";
      addNotification(errorMessage, 'warning');
    }
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
              <LogOut className={`h-8 w-8 ${
                activeTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>

            <h1 className={`text-3xl md:text-4xl font-light mb-4 tracking-tight ${
              activeTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Visitor Check-Out
            </h1>

            <p className={`text-lg max-w-lg mx-auto leading-relaxed ${
              activeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Please provide your details to complete the check-out process
            </p>
          </div>

          {/* Form */}
          <div className={`rounded-lg border p-8 ${
            activeTheme === 'light'
              ? 'bg-white border-gray-100'
              : 'bg-gray-900 border-gray-800'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Visitor Identification */}
              <div>
                <h3 className={`text-lg font-medium mb-6 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Visitor Identification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <User className="h-4 w-4" />
                      <span>Visitor ID (Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="visitorId"
                      value={formData.visitorId}
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

              {/* Checkout Notes */}
              <div>
                <h3 className={`text-lg font-medium mb-6 ${
                  activeTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Checkout Notes
                </h3>
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-medium mb-3 ${
                    activeTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <FileText className="h-4 w-4" />
                    <span>Additional Notes</span>
                  </label>
                  <textarea
                    name="checkoutNotes"
                    value={formData.checkoutNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      activeTheme === 'light'
                        ? 'bg-white border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-100'
                        : 'bg-gray-900 border-gray-800 text-white focus:border-gray-600 focus:ring-2 focus:ring-gray-800'
                    } hover:border-gray-300`}
                    placeholder="Any additional notes about your visit..."
                  />
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
                  <LogOut className="h-5 w-5" />
                  <span>Complete Check-Out</span>
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
                If you're experiencing any issues with the check-out process,
                please contact the reception desk for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
