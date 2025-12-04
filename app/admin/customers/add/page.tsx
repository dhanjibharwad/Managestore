'use client';

import React, { useState } from 'react';
import { X, ChevronDown, Plus } from 'lucide-react';

const CustomerForm: React.FC = () => {
  const [customerType, setCustomerType] = useState('End User');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [source, setSource] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [regionState, setRegionState] = useState('');
  const [cityTown, setCityTown] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleCreate = () => {
    console.log('Create customer');
  };

  const handleCancel = () => {
    console.log('Cancel');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Create</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8c] transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Customer Information
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Customer Type */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Customer Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option>End User</option>
                  <option>Business</option>
                  <option>Reseller</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <X className="w-4 h-4 text-gray-400" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Eg: John Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="+91"
                  readOnly
                  className="w-16 px-3 py-2 border border-gray-300 rounded text-gray-900 bg-gray-50"
                />
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Eg: 99XXXXXXXX"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Email ID */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email ID
              </label>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Eg: example@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Eg: 91XXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Source
              </label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-400 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option value="">Select source</option>
                  <option>Website</option>
                  <option>Referral</option>
                  <option>Social Media</option>
                  <option>Advertisement</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Referred By */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Referred By
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Search by name, mobile, email"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            Address Details <span className="text-gray-500 font-normal">(Optional)</span>
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Address Line */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Address Line
              </label>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="House / building name/no, street name, locality"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Region/State */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Region/State
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={regionState}
                    onChange={(e) => setRegionState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-400 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select region / state</option>
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button className="w-10 h-10 bg-[#4A70A9] text-white rounded flex items-center justify-center hover:bg-[#3d5c8c] transition-colors flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* City/Town */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                City/Town
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={cityTown}
                    onChange={(e) => setCityTown(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-400 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select city / town</option>
                    <option>Vadodara</option>
                    <option>Ahmedabad</option>
                    <option>Surat</option>
                    <option>Rajkot</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button className="w-10 h-10 bg-[#4A70A9] text-white rounded flex items-center justify-center hover:bg-[#3d5c8c] transition-colors flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Postal Code / Zip Code */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Postal Code/ Zip Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Type postal code / zip code"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;