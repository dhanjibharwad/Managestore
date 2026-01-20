'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Calendar, CheckCircle, AlertCircle, X } from 'lucide-react';
import { State, City } from 'country-state-city';
import { useRouter } from 'next/navigation';

interface DeviceType {
  id: number;
  name: string;
}

interface DeviceBrand {
  id: number;
  name: string;
  device_type_id: number;
}

interface DeviceModel {
  id: number;
  name: string;
  device_brand_id: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
}

interface StateType {
  isoCode: string;
  name: string;
}

interface CityType {
  name: string;
}

export default function LeadInformationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    leadType: '',
    leadName: '',
    leadSource: '',
    referredBy: '',
    mobileNumber: '',
    emailId: '',
    phoneNumber: '',
    contactPerson: '',
    nextFollowUp: '',
    assignee: '',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    comment: '',
    addressLine: '',
    region: '',
    city: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceBrands, setDeviceBrands] = useState<DeviceBrand[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<DeviceBrand[]>([]);
  const [filteredModels, setFilteredModels] = useState<DeviceModel[]>([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: nextToastId, message, type };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetch('/api/devices/types')
      .then(res => res.json())
      .then(data => setDeviceTypes(data));
    
    fetch('/api/devices/brands')
      .then(res => res.json())
      .then(data => setDeviceBrands(data));
    
    fetch('/api/devices/models')
      .then(res => res.json())
      .then(data => setDeviceModels(data));
    
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
    
    fetchCustomers();
    
    // Load Indian states
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    // Load cities when state changes
    if (formData.region) {
      const stateCities = City.getCitiesOfState('IN', formData.region);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    // Reset city when state changes
    setFormData(prev => ({ ...prev, city: '' }));
  }, [formData.region]);

  useEffect(() => {
    if (formData.deviceType) {
      const filtered = deviceBrands.filter(brand => brand.device_type_id === parseInt(formData.deviceType));
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
    setFormData(prev => ({ ...prev, deviceBrand: '', deviceModel: '' }));
    setFilteredModels([]);
  }, [formData.deviceType, deviceBrands]);

  useEffect(() => {
    if (formData.deviceBrand) {
      const filtered = deviceModels.filter(model => model.device_brand_id === parseInt(formData.deviceBrand));
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
    setFormData(prev => ({ ...prev, deviceModel: '' }));
  }, [formData.deviceBrand, deviceModels]);

  const handleAddBrand = async () => {
    if (!newBrandName.trim() || !formData.deviceType) {
      showToast('Please enter a brand name', 'warning');
      return;
    }
    
    try {
      const response = await fetch('/api/devices/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, device_type_id: parseInt(formData.deviceType) })
      });
      
      if (response.ok) {
        const newBrand = await response.json();
        setDeviceBrands([...deviceBrands, newBrand]);
        setFilteredBrands([...filteredBrands, newBrand]);
        setFormData({ ...formData, deviceBrand: newBrand.id.toString() });
        setNewBrandName('');
        setShowBrandModal(false);
        showToast('Brand added successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to add brand', 'error');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      showToast('An error occurred while adding brand', 'error');
    }
  };

  const handleAddModel = async () => {
    if (!newModelName.trim() || !formData.deviceBrand) {
      showToast('Please enter a model name', 'warning');
      return;
    }
    
    try {
      const response = await fetch('/api/devices/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModelName, device_brand_id: parseInt(formData.deviceBrand) })
      });
      
      if (response.ok) {
        const newModel = await response.json();
        setDeviceModels([...deviceModels, newModel]);
        setFilteredModels([...filteredModels, newModel]);
        setFormData({ ...formData, deviceModel: newModel.id.toString() });
        setNewModelName('');
        setShowModelModal(false);
        showToast('Model added successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to add model', 'error');
      }
    } catch (error) {
      console.error('Error adding model:', error);
      showToast('An error occurred while adding model', 'error');
    }
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'mobileNumber':
        if (value && !/^[6-9][0-9]{9}$/.test(value)) {
          newErrors.mobileNumber = 'Invalid mobile: 10 digits starting with 6-9';
        } else {
          delete newErrors.mobileNumber;
        }
        break;
      case 'emailId':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.emailId = 'Invalid email format';
        } else {
          delete newErrors.emailId;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.leadName || !formData.assignee) {
      showToast('Lead Name and Assignee are required', 'warning');
      return;
    }

    // Validate fields on submit
    if (formData.mobileNumber) {
      validateField('mobileNumber', formData.mobileNumber);
    }
    if (formData.emailId) {
      validateField('emailId', formData.emailId);
    }

    if (Object.keys(errors).length > 0) {
      showToast('Please fix validation errors before submitting', 'error');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        showToast('Lead created successfully!', 'success');
        setTimeout(() => window.location.href = '/admin/leads', 2000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to create lead', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred', 'error');
    }
  };

  const handleCancel = () => {
    router.push('/admin/leads');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Lead Information</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Type</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.leadType}
                    onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
                  >
                    <option value="">Select lead type</option>
                    <option value="deal">Dealer</option>
                    <option value="enduser">End User</option>
                    <option value="corporate">Corporate User</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Eg: John Smith"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.leadSource}
                    onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                  >
                    <option value="">Select lead source type</option>
                    <option value="Personal">Personal Meeting</option>
                    <option value="google">Google</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="advertisement">Advertisement</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referred By Customer</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                  >
                    <option value="">Select customer</option>
                    {Array.isArray(customers) && customers.map(cust => (
                      <option key={cust.id} value={cust.id}>
                        {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <input type="text" value="+91" readOnly className="w-16 px-3 py-2.5 border border-gray-300 rounded bg-gray-50 text-center" />
                  <input
                    type="tel"
                    placeholder="10 digits starting with 6-9"
                    maxLength={10}
                    className={`flex-1 px-4 py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, mobileNumber: value });
                      validateField('mobileNumber', value);
                    }}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                <input
                  type="email"
                  placeholder="Eg: example@example.com"
                  className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                    errors.emailId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.emailId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, emailId: value });
                    validateField('emailId', value);
                  }}
                />
                {errors.emailId && (
                  <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  placeholder="Eg: 91XXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  placeholder="Type contact person"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Follow Up</label>
                <input
                  type="date"
                  value={formData.nextFollowUp}
                  onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  >
                    <option value="">Select assignee</option>
                    {Array.isArray(users) && users.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Device Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                  >
                    <option value="">Device type</option>
                    {deviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Brand</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={formData.deviceBrand}
                      onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                      disabled={!formData.deviceType}
                    >
                      <option value="">Select device brand</option>
                      {filteredBrands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(true)}
                    disabled={!formData.deviceType}
                    className="px-3 py-2.5 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Model</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={formData.deviceModel}
                      onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                      disabled={!formData.deviceBrand}
                    >
                      <option value="">Select device model</option>
                      {filteredModels.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModelModal(true)}
                    disabled={!formData.deviceBrand}
                    className="px-3 py-2.5 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] resize-none"
                rows={4}
                placeholder="Type text here"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Address Details <span className="text-gray-400 font-normal">(Optional)</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line</label>
                <input
                  type="text"
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region/State</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Town</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!formData.region}
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code/ Zip Code</label>
                <input
                  type="text"
                  placeholder="Type postal code / zip code"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>

        {showBrandModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add Device Brand</h3>
              <input
                type="text"
                placeholder="Enter brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] mb-4"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowBrandModal(false); setNewBrandName(''); }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBrand}
                  disabled={!newBrandName.trim()}
                  className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showModelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add Device Model</h3>
              <input
                type="text"
                placeholder="Enter model name"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddModel()}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] mb-4"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowModelModal(false); setNewModelName(''); }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddModel}
                  disabled={!newModelName.trim()}
                  className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
