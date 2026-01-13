'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus } from 'lucide-react';

export default function CustomerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async () => {
    if (!formData.customerType || !formData.customerName) {
      alert('Please fill in required fields: Customer Type and Customer Name');
      return;
    }

    if (Object.keys(errors).length > 0) {
      alert('Please fix validation errors before submitting');
      return;
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
        alert(`Customer created successfully! Customer ID: ${result.customer.customer_id}`);
        router.push('/admin/customers');
      } else {
        alert(result.error || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('An error occurred while creating the customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/technician/customers');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                  Email ID
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
                      <option value="gujarat">Gujarat</option>
                      <option value="maharashtra">Maharashtra</option>
                      <option value="delhi">Delhi</option>
                      <option value="karnataka">Karnataka</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors flex-shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* City/Town */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={formData.cityTown}
                      onChange={(e) => setFormData({ ...formData, cityTown: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    >
                      <option value="">Select city / town</option>
                      <option value="vadodara">Vadodara</option>
                      <option value="ahmedabad">Ahmedabad</option>
                      <option value="surat">Surat</option>
                      <option value="rajkot">Rajkot</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors flex-shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
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