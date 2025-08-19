import React, { useState, useEffect } from 'react';
import { useNotification } from '../components/NotificationProvider';
import axios from 'axios';
import { User, Mail, Phone, Building, Briefcase, Save, X } from 'lucide-react';

const ProfileEdit = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        department: userData.department || '',
        role: userData.role || 'user'
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.patch(
        'https://smart-visit-backend.onrender.com/api/profile/update/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      
      addNotification('Profile updated successfully!', 'success');
      onUpdate(response.data);
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
        addNotification('Failed to update profile', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
        </div>

        {/* Similar fields for last_name, phone, department, role */}
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => onUpdate(null)}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <X className="inline mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            <Save className="inline mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;