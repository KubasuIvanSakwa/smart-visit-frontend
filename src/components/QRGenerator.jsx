import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Save, QrCode } from 'lucide-react';

const QRGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    hostName: '',
  });
  const [showQR, setShowQR] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQR = () => {
    const hasData = Object.values(formData).some(val => val.trim() !== '');
    if (hasData) {
      setShowQR(true);
    } else {
      alert('Please fill in at least one field to generate a QR code.');
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('generated-qr');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'visitor_qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] to-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Generate Visitor QR Code</h1>
          <p className="text-gray-600 text-lg">Fill in the details to create a QR code</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900"
                placeholder="Enter your email"
              />
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Company/Organization</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900"
                placeholder="Enter your company name"
              />
            </div>

            {/* Host Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Host Name</label>
              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white text-gray-900"
                placeholder="Enter host name"
              />
            </div>
          </div>

          <button
            onClick={generateQR}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center 0-2"
          >
            <QrCode className="h-5 w-5" />
            <span>Generate QR Code</span>
          </button>

          {showQR && (
            <div className="text-center space-y-4">
              <QRCodeSVG
                id="generated-qr"
                value={JSON.stringify(formData)}
                size={256}
                level="H"
                includeMargin
              />
              <button
                onClick={downloadQR}
                className="mt-4 inline-flex items-center 0-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
              >
                <Save className="h-5 w-5" />
                <span>Save QR Code</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
