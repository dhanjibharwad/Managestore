'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  User, 
  MessageCircle, 
  Package, 
  FileText, 
  CreditCard, 
  Bell, 
  Edit,
  Save,
  X,
  Calendar,
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [user, setUser] = useState({
    name: '', email: '', phone: '', role: '', company: '', created_at: ''
  });
  const [customer, setCustomer] = useState({
    customer_name: '', mobile_number: '', phone_number: '',
    address_line: '', region_state: '', city_town: '', postal_code: ''
  });
  const [formData, setFormData] = useState({
    customer_name: '', mobile_number: '', phone_number: '',
    address_line: '', region_state: '', city_town: '', postal_code: ''
  });

  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    if (!formData.customer_name.trim()) errors.customer_name = 'Customer name is required';
    if (!formData.mobile_number.trim()) errors.mobile_number = 'Mobile number is required';
    
    if (formData.mobile_number && !/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      errors.mobile_number = 'Invalid mobile number';
    }
    
    if (formData.phone_number && !/^[6-9]\d{9}$/.test(formData.phone_number)) {
      errors.phone_number = 'Invalid phone number';
    }
    
    if (formData.postal_code && !/^\d{6}$/.test(formData.postal_code)) {
      errors.postal_code = 'Postal code must be 6 digits';
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
          setUser({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            role: data.user.role,
            company: data.user.company || '',
            created_at: data.user.createdAt
          });
          
          const customerData = {
            customer_name: data.user.name,
            mobile_number: data.user.phone || '',
            phone_number: data.user.profile?.alternatePhone || '',
            address_line: data.user.profile?.addressLine || '',
            region_state: data.user.profile?.state || '',
            city_town: data.user.profile?.city || '',
            postal_code: data.user.profile?.postalCode || ''
          };
          setCustomer(customerData);
          setFormData(customerData);
          
          // Load cities for existing state
          if (data.user.profile?.state) {
            const stateCities = City.getCitiesOfState('IN', data.user.profile.state);
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
    if (formData.region_state) {
      const stateCities = City.getCitiesOfState('IN', formData.region_state);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    // Reset city when state changes (not on initial load)
    if (formData.region_state && formData.region_state !== customer.region_state) {
      setFormData(prev => ({ ...prev, city_town: '' }));
    }
  }, [formData.region_state, customer.region_state]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        body: JSON.stringify({
          name: formData.customer_name,
          phone: formData.mobile_number,
          alternatePhone: formData.phone_number,
          addressLine: formData.address_line,
          state: formData.region_state,
          city: formData.city_town,
          postalCode: formData.postal_code
        })
      });
      
      if (res.ok) {
        setUser(prev => ({
          ...prev,
          name: formData.customer_name,
          phone: formData.mobile_number
        }));
        setCustomer(formData);
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
    setFormData(customer);
    setIsEditing(false);
    setError('');
    setValidationErrors({});
  };

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Contacts', icon: Phone },
    { name: 'Jobs', icon: FileText },
    { name: 'Sales', icon: Package },
    { name: 'Referred List', icon: FileText },
    { name: 'Payments', icon: CreditCard },
    { name: 'Pickup Drops', icon: Package },
    { name: 'Bulk Payments', icon: CreditCard },
    { name: 'Invoices', icon: FileText },
    { name: 'Notification Preferences', icon: Bell },
  ];

  return (
    <div className="bg-gray-50">
      <div className="mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            {/* Profile Section */}
            <div className="flex gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-orange-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>

              {/* User Info */}
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-semibold text-gray-900">{user.name || 'User Name'}</h1>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Phone:</span>
                    <span className="text-sm font-medium text-[#4A70A9]">{customer.mobile_number || user.phone || 'Not provided'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email:</span>
                    <span className="text-sm font-medium text-[#4A70A9]">{user.email || 'Not provided'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Role:</span>
                    <span className="text-sm font-medium capitalize">{user.role || 'Customer'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Whatsapp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Creation Date:</span>
                <span className="text-sm font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not available'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Payment Remaining</span>
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-md">
                  ₹ 0.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.name
                      ? 'text-[#4A70A9] border-b-2 border-[#4A70A9]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {activeTab === 'Profile' && (
            <div className="space-y-8">
              {/* Customer Information Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={isEditing ? formData.customer_name : customer.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent' : 'bg-gray-50'} ${
                        validationErrors.customer_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.customer_name && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="+91"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        readOnly
                      />
                      <input
                        type="text"
                        value={isEditing ? formData.mobile_number : customer.mobile_number}
                        onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                        readOnly={!isEditing}
                        className={`flex-1 px-3 py-2 border rounded-md ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent' : 'bg-gray-50'} ${
                          validationErrors.mobile_number ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {validationErrors.mobile_number && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.mobile_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={isEditing ? formData.phone_number : customer.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="Eg: 91XXXXXXXXX"
                      readOnly={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent' : 'bg-gray-50'} ${
                        validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.phone_number && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</p>
                    )}
                  </div>
                </div>

                {/* Address Details Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Address Details <span className="text-gray-400 font-normal">(Optional)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line
                      </label>
                      <input
                        type="text"
                        value={isEditing ? formData.address_line : customer.address_line}
                        onChange={(e) => handleInputChange('address_line', e.target.value)}
                        placeholder="House / building name/no, street name, locality"
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region/State
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <select
                            value={formData.region_state}
                            onChange={(e) => handleInputChange('region_state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none"
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
                          value={states.find(s => s.isoCode === customer.region_state)?.name || customer.region_state || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
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
                            value={formData.city_town}
                            onChange={(e) => handleInputChange('city_town', e.target.value)}
                            disabled={!formData.region_state}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
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
                          value={customer.city_town || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code/ Zip Code
                      </label>
                      <input
                        type="text"
                        value={isEditing ? formData.postal_code : customer.postal_code}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        placeholder="Type postal code / zip code"
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent' : 'bg-gray-50'} ${
                          validationErrors.postal_code ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.postal_code && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.postal_code}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && (
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
    </div>
  );
}