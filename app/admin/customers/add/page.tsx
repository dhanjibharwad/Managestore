'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { State, City } from 'country-state-city';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface StateType {
  isoCode: string;
  name: string;
}

interface CityType {
  name: string;
}

export default function CustomerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [formData, setFormData] = useState({
    customerType: '',
    customerName: '',
    mobileNumber: '',
    emailId: '',
    phoneNumber: '',
    source: '',
    referredBy: '',
    taxNumber: '',
    addressLine: '',
    regionState: '',
    cityTown: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Load Indian states
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    // Load cities when state changes
    if (formData.regionState) {
      const stateCities = City.getCitiesOfState('IN', formData.regionState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    // Reset city when state changes
    setFormData(prev => ({ ...prev, cityTown: '' }));
  }, [formData.regionState]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = {
      id: nextToastId,
      message,
      type
    };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
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
        if (!value) {
          newErrors.emailId = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.emailId = 'Invalid email format';
        } else {
          delete newErrors.emailId;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!formData.customerType || !formData.customerName || !formData.emailId) {
      showToast('Please fill in required fields: Customer Type, Customer Name, and Email ID', 'warning');
      return;
    }

    // Validate email on submit
    validateField('emailId', formData.emailId);

    if (Object.keys(errors).length > 0) {
      showToast('Please fix validation errors before submitting', 'error');
      return;
    }

    // Check for duplicate email
    try {
      const checkResponse = await fetch(`/api/admin/customers/check-email?email=${encodeURIComponent(formData.emailId)}`);
      const checkResult = await checkResponse.json();
      
      if (checkResult.exists) {
        showToast('A customer with this email address already exists', 'error');
        return;
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`Customer created successfully! Customer ID: ${result.customer.customer_id}`, 'success');
        setTimeout(() => {
          router.push('/admin/customers');
        }, 2000);
      } else {
        showToast(result.error || 'Failed to create customer', 'error');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      showToast('An error occurred while creating the customer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      customerType: '',
      customerName: '',
      mobileNumber: '',
      emailId: '',
      phoneNumber: '',
      source: '',
      referredBy: '',
      taxNumber: '',
      addressLine: '',
      regionState: '',
      cityTown: '',
      postalCode: ''
    });
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

      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Create</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Customer Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select customer type</option>
                    <option value="dealer">Dealer</option>
                    <option value="enduser">End User</option>
                    <option value="corporate">Corporate User</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Eg: John Smith"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="+91"
                    disabled
                    className="w-16 px-3 py-2.5 border border-gray-300 rounded-md bg-gray-100 text-gray-700 text-center"
                  />
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, mobileNumber: value });
                      validateField('mobileNumber', value);
                    }}
                    placeholder="10 digits starting with 6-9"
                    maxLength={10}
                    className={`flex-1 px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.emailId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, emailId: value });
                    validateField('emailId', value);
                  }}
                  placeholder="Eg: example@example.com"
                  className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                    errors.emailId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.emailId && (
                  <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Eg: 91XXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <div className="relative">
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select source</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social-media">Social Media</option>
                    <option value="advertisement">Advertisement</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Referred By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referred By
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    placeholder="Search by name, mobile, email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tax Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Number
                </label>
                <input
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  placeholder="Type Tax number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Address Details{' '}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Address Line */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line
                </label>
                <input
                  type="text"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Region/State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={formData.regionState}
                      onChange={(e) => setFormData({ ...formData, regionState: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    >
                      <option value="">Select region / state</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {/* <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors flex-shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button> */}
                </div>
              </div>

              {/* City/Town */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                <div className="relative">
                  <select
                    value={formData.cityTown}
                    onChange={(e) => setFormData({ ...formData, cityTown: e.target.value })}
                    disabled={!formData.regionState}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select city / town</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Postal Code / Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code/ Zip Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Type postal code / zip code"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}