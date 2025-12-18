'use client';

import React, { useState } from 'react';
import { Phone, Mail, User, MessageCircle, Package, FileText, CreditCard, Bell, Edit } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');

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
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-orange-300 flex-shrink-0 overflow-hidden">
                <img 
                  src="/api/placeholder/128/128" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-semibold text-gray-900">Uday Mishra</h1>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Phone:</span>
                    <span className="text-sm font-medium text-[#4A70A9]">8208215900</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email:</span>
                    <span className="text-sm font-medium text-[#4A70A9]">usermail@gmail.com</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Role:</span>
                    <span className="text-sm font-medium">End User</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Whatsapp</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-blue-50 transition-colors">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Pickup Drops</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">Creation Date:</span>
                <span className="text-sm font-medium">Dec 3, 2025</span>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-blue-50 transition-colors">
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          </div>

          {/* Customer Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value="Vishwanth Anna"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="+91"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  readOnly
                />
                <input
                  type="text"
                  value="91XXXXXXXXX"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-400"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Eg: 91XXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-400"
              />
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
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-400">
                  <option>Select region / state</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-400">
                  <option>Select city / town</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code/ Zip Code
                </label>
                <input
                  type="text"
                  placeholder="Type postal code / zip code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}