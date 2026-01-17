"use client"

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  ClipboardList, 
  Users, 
  Package, 
  Lock, 
  FileText, 
  Bell, 
  Plane,
  Phone,
  Mail,
  UserCircle,
  Edit,
  Calendar,
  Save,
  X,
  ChevronDown
} from 'lucide-react';
import { State, City } from 'country-state-city';

interface ValidationErrors {
  [key: string]: string;
}

interface StateType {
  isoCode: string;
  name: string;
}

interface CityType {
  name: string;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [user, setUser] = useState({ 
    name: '', email: '', phone: '', role: '', createdAt: '',
    profile: {
      displayName: '', alternatePhone: '', aadhaarNumber: '', gender: '',
      panNumber: '', dateOfBirth: '', addressLine: '', state: '', city: '',
      postalCode: '', accountName: '', bankName: '', branch: '',
      accountNumber: '', ifscCode: ''
    }
  });
  const [formData, setFormData] = useState({
    name: '', phone: '', displayName: '', alternatePhone: '', aadhaarNumber: '',
    gender: '', panNumber: '', dateOfBirth: '', addressLine: '', state: '',
    city: '', postalCode: '', accountName: '', bankName: '', branch: '',
    accountNumber: '', ifscCode: ''
  });

  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Required fields
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    
    // Phone validation
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }
    
    // Alternate phone validation
    if (formData.alternatePhone && !/^[6-9]\d{9}$/.test(formData.alternatePhone)) {
      errors.alternatePhone = 'Invalid alternate phone number';
    }
    
    // Aadhaar validation
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
      errors.aadhaarNumber = 'Aadhaar must be 12 digits';
    }
    
    // PAN validation
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      errors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    
    // Postal code validation
    if (formData.postalCode && !/^\d{6}$/.test(formData.postalCode)) {
      errors.postalCode = 'Postal code must be 6 digits';
    }
    
    // IFSC validation
    if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      errors.ifscCode = 'Invalid IFSC code format';
    }
    
    // Account number validation
    if (formData.accountNumber && !/^\d{9,18}$/.test(formData.accountNumber)) {
      errors.accountNumber = 'Account number must be 9-18 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          const userData = {
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            role: data.user.role,
            createdAt: new Date(data.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            profile: data.user.profile || {}
          };
          setUser(userData);
          setFormData({
            name: userData.name,
            phone: userData.phone,
            displayName: userData.profile.displayName || '',
            alternatePhone: userData.profile.alternatePhone || '',
            aadhaarNumber: userData.profile.aadhaarNumber || '',
            gender: userData.profile.gender || '',
            panNumber: userData.profile.panNumber || '',
            dateOfBirth: userData.profile.dateOfBirth || '',
            addressLine: userData.profile.addressLine || '',
            state: userData.profile.state || '',
            city: userData.profile.city || '',
            postalCode: userData.profile.postalCode || '',
            accountName: userData.profile.accountName || '',
            bankName: userData.profile.bankName || '',
            branch: userData.profile.branch || '',
            accountNumber: userData.profile.accountNumber || '',
            ifscCode: userData.profile.ifscCode || ''
          });
          
          // Load cities for existing state
          if (userData.profile.state) {
            const stateCities = City.getCitiesOfState('IN', userData.profile.state);
            setCities(stateCities);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load profile data');
      }
    };
    fetchUserData();
    
    // Load Indian states
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    // Load cities when state changes
    if (formData.state) {
      const stateCities = City.getCitiesOfState('IN', formData.state);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    // Reset city when state changes (not on initial load)
    if (formData.state && formData.state !== user.profile.state) {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.state, user.profile.state]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError('Please fix validation errors');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setUser(prev => ({
          ...prev,
          name: formData.name,
          phone: formData.phone,
          profile: {
            displayName: formData.displayName,
            alternatePhone: formData.alternatePhone,
            aadhaarNumber: formData.aadhaarNumber,
            gender: formData.gender,
            panNumber: formData.panNumber,
            dateOfBirth: formData.dateOfBirth,
            addressLine: formData.addressLine,
            state: formData.state,
            city: formData.city,
            postalCode: formData.postalCode,
            accountName: formData.accountName,
            bankName: formData.bankName,
            branch: formData.branch,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode
          }
        }));
        setIsEditing(false);
        setValidationErrors({});
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      displayName: user.profile.displayName || '',
      alternatePhone: user.profile.alternatePhone || '',
      aadhaarNumber: user.profile.aadhaarNumber || '',
      gender: user.profile.gender || '',
      panNumber: user.profile.panNumber || '',
      dateOfBirth: user.profile.dateOfBirth || '',
      addressLine: user.profile.addressLine || '',
      state: user.profile.state || '',
      city: user.profile.city || '',
      postalCode: user.profile.postalCode || '',
      accountName: user.profile.accountName || '',
      bankName: user.profile.bankName || '',
      branch: user.profile.branch || '',
      accountNumber: user.profile.accountNumber || '',
      ifscCode: user.profile.ifscCode || ''
    });
    setIsEditing(false);
    setError('');
    setValidationErrors({});
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'jobs', label: 'Assigned Jobs', icon: Briefcase },
    { id: 'tasks', label: 'Assigned Task', icon: ClipboardList },
    { id: 'leads', label: 'Assigned Leads', icon: Users },
    { id: 'pickups', label: 'Assigned Pickup Drops', icon: Package },
    { id: 'permissions', label: 'Permissions', icon: Lock },
    { id: 'notes', label: 'Private Notes', icon: FileText },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'travel', label: 'Employee Travel Logs', icon: Plane },
  ];

  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Profile Avatar */}
              <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center text-white text-5xl font-bold">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>

              {/* Profile Info */}
              <div className="pt-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{user.name || 'Loading...'}</h1>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <a href={`tel:${user.phone}`} className="text-[#4A70A9] hover:underline">{user.phone || 'Not provided'}</a>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${user.email}`} className="text-[#4A70A9] hover:underline">{user.email || 'Loading...'}</a>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <UserCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Role:</span>
                    <span className="text-gray-900 capitalize">{user.role || 'Loading...'}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <button className="mt-4 px-6 py-2.5 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Whatsapp
                </button>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="text-right space-y-4">
              <div className="flex items-center justify-end gap-3">
                <span className="text-gray-700 font-medium">Work Schedule:</span>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center justify-end gap-3">
                <span className="text-gray-700 font-medium">Creation Date:</span>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{user.createdAt || 'Loading...'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto px-6">
          <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#4A70A9] text-[#4A70A9]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Employee Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Employee Information</h2>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-[#4A70A9] border border-[#4A70A9] rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.name : user.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.displayName : user.profile.displayName || ''}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Eg: Dummy name visible to customer"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="+91"
                      readOnly
                      className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-center"
                    />
                    <input
                      type="text"
                      value={isEditing ? formData.phone : user.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      readOnly={!isEditing}
                      className={`flex-1 px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.alternatePhone : user.profile.alternatePhone || ''}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    placeholder="Eg: 9XXXXXXXXX"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.alternatePhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.alternatePhone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.alternatePhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.aadhaarNumber : user.profile.aadhaarNumber || ''}
                    onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                    placeholder="Type aadhaar number"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.aadhaarNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.aadhaarNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select 
                    value={isEditing ? formData.gender : user.profile.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pan Card / Tax Number
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.panNumber : user.profile.panNumber || ''}
                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    placeholder="Eg: ABCD1234A"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.panNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.panNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.panNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Of Birth
                  </label>
                  <input
                    type="date"
                    value={isEditing ? formData.dateOfBirth : user.profile.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  />
                </div>
              </div>
            </div>

            {/* Address Details Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Address Details <span className="text-gray-400 font-normal">(Optional)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.addressLine : user.profile.addressLine || ''}
                    onChange={(e) => handleInputChange('addressLine', e.target.value)}
                    placeholder="House / building name/no, street name, locality"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region/State
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 appearance-none"
                      >
                        <option value="">Select region / state</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={states.find(s => s.isoCode === user.profile.state)?.name || user.profile.state || ''}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City/Town
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!formData.state}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                      >
                        <option value="">Select city / town</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={user.profile.city || ''}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code/ Zip Code
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.postalCode : user.profile.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="Type postal code / zip code"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Bank Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.accountName : user.profile.accountName || ''}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    placeholder="Type account name"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.bankName : user.profile.bankName || ''}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Type bank name"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.branch : user.profile.branch || ''}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    placeholder="Type branch name"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.accountNumber : user.profile.accountNumber || ''}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="Type account number"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.accountNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.accountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.ifscCode : user.profile.ifscCode || ''}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    placeholder="Type IFSC code"
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2.5 border rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50'} text-gray-900 ${
                      validationErrors.ifscCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.ifscCode && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.ifscCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'profile' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">This section is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;