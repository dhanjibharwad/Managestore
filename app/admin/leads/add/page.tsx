'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Calendar } from 'lucide-react';

export default function LeadInformationPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
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
          {/* Lead Information Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Lead Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Type
                </label>
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

              {/* Lead Name */}
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

              {/* Lead Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.leadSource}
                    onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                  >
                    <option value="">Select lead source type</option>
                    <option value="Personal">Personal Meeting</option>
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
              {/* Referred By Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referred By Customer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, mobile, email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
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
                    readOnly
                    className="w-16 px-3 py-2.5 border border-gray-300 rounded bg-gray-50 text-center"
                  />
                  <input
                    type="text"
                    placeholder="Eg: 99XXXXXXXX"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  placeholder="Eg: example@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.emailId}
                  onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Eg: 91XXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="Type contact person"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>

              {/* Next Follow Up */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Follow Up
                </label>
                <input
                  type="date"
                  value={formData.nextFollowUp}
                  onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Assignee */}
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
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                    <option value="user3">User 3</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Device Information Section */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Device Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Type
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                  >
                    <option value="">Device type</option>
                    <option value="all">All in one</option>
                    <option value="mobile">Mobile</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
                    <option value="desktop">Desktop</option>
                    <option value="camera">Camera</option>
                    <option value="motherboard">Motherboard</option>
                    <option value="harddrive">Hard Drives</option>
                    <option value="camera">television</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Device Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Brand
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                      value={formData.deviceBrand}
                      onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                    >
                      <option value="">Select device brand</option>
                      <option value="apple">Apple</option>
                      <option value="samsung">Samsung</option>
                      <option value="oneplus">OnePlus</option>
                      <option value="xiaomi">Xiaomi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2.5 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Device Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Model
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                      value={formData.deviceModel}
                      onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                    >
                      <option value="">Select device model</option>
                      <option value="model1">Model 1</option>
                      <option value="model2">Model 2</option>
                      <option value="model3">Model 3</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2.5 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <div className="border border-gray-300 rounded">
                <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9]">
                      <option>Normal text</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
                      <span className="font-bold text-sm">B</span>
                    </button>
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
                      <span className="italic text-sm">I</span>
                    </button>
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Strikethrough">
                      <span className="line-through text-sm">S</span>
                    </button>
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Underline">
                      <span className="underline text-sm">U</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded" title="Align Left">
                      <div className="flex flex-col gap-0.5">
                        <div className="w-3 h-0.5 bg-gray-600"></div>
                        <div className="w-3 h-0.5 bg-gray-600"></div>
                        <div className="w-3 h-0.5 bg-gray-600"></div>
                      </div>
                    </button> 
              
                  </div>
                </div>
                <textarea
                  className="w-full px-4 py-3 focus:outline-none resize-none"
                  rows={4}
                  placeholder="Type text here"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                ></textarea>
              </div>
              <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Address Details <span className="text-gray-400 font-normal">(Optional)</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Address Line */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line
                </label>
                <input
                  type="text"
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    >
                      <option value="">Select region / state</option>
                      <option value="gujarat">Gujarat</option>
                      <option value="maharashtra">Maharashtra</option>
                      <option value="delhi">Delhi</option>
                      <option value="karnataka">Karnataka</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2.5 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors"
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="">Select city / town</option>
                      <option value="vadodara">Vadodara</option>
                      <option value="ahmedabad">Ahmedabad</option>
                      <option value="surat">Surat</option>
                      <option value="rajkot">Rajkot</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2.5 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Postal Code/Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code/ Zip Code
                </label>
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
      </div>
    </div>
  );
}