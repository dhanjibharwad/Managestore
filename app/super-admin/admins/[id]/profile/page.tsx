'use client';

import React, { useState } from 'react';
import { Phone, Mail, User, MessageSquare, Package, FileText, CreditCard, Truck, Receipt, Bell, Edit } from 'lucide-react';

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Contacts', icon: FileText },
    { name: 'Jobs', icon: FileText },
    { name: 'Sales', icon: FileText },
    { name: 'Referred List', icon: FileText },
    { name: 'Payments', icon: CreditCard },
    { name: 'Pickup Drops', icon: Truck },
    { name: 'Bulk Payments', icon: Receipt },
    { name: 'Invoices', icon: FileText },
    // { name: 'Notification Preferences', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            {/* Profile Avatar and Info */}
            <div className="flex items-start gap-8 flex-1">
              <div className="w-48 h-48 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-300 to-yellow-200 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-blue-400"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-yellow-200 rounded-t-full"></div>
                  <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-400 rounded-full"></div>
                  <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-500 rounded-full"></div>
                  <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-8 bg-yellow-400 rounded-full"></div>
                    <div className="absolute top-0 w-6 h-3 bg-yellow-400 rounded-t-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex-1">
                <h1 className="text-4xl font-semibold text-gray-900 mb-8">Vishwanth Anna</h1>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-600">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Phone:</span>
                    <span className="text-[#4A70A9]">8857859209</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Email:</span>
                    <span className="text-[#4A70A9]">officialsellersathi@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <User className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Role:</span>
                    <span className="text-gray-700">End User</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="flex items-center gap-2 px-8 py-3 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
                    <MessageSquare className="w-5 h-5" />
                    Whatsapp
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3 border-2 border-[#4A70A9] text-[#4A70A9] rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    <Package className="w-5 h-5" />
                    Pickup Drops
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="text-right space-y-4 flex-shrink-0">
              <div className="text-gray-600">
                <span className="font-medium">Creation Date:</span>
                <span className="ml-3 text-gray-700">Dec 3, 2025</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-5 py-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Payment Remaining</span>
                <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded">₹0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full px-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.name
                      ? 'text-[#4A70A9] border-b-2 border-[#4A70A9]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-8 py-10">
        <div className="bg-white rounded-lg border border-gray-200 p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-semibold text-gray-900">Customer Information</h2>
            <button className="flex items-center gap-2 px-6 py-3 border border-[#4A70A9] text-[#4A70A9] rounded-lg hover:bg-blue-50 transition-colors font-medium">
              <Edit className="w-5 h-5" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <label className="block font-medium text-gray-700 mb-3 text-base">
                Customer Name
              </label>
              <input
                type="text"
                value="Vishwanth Anna"
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-base"
                readOnly
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3 text-base">
                Mobile Number
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value="+91"
                  className="w-24 px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-center text-base"
                  readOnly
                />
                <input
                  type="text"
                  value="8857859209"
                  className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-base"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3 text-base">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Eg: 91XXXXXXXXX"
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-gray-400 text-base"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Address Details <span className="text-gray-400 font-normal">(Optional)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <label className="block font-medium text-gray-700 mb-3 text-base">
                Address Line
              </label>
              <input
                type="text"
                placeholder="House / building name/no, street name, locality"
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-gray-400 text-base"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3 text-base">
                Region/State
              </label>
              <select className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-gray-400 appearance-none bg-white text-base">
                <option>Select region / state</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-3 text-base">
                City/Town
              </label>
              <select className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-gray-400 appearance-none bg-white text-base">
                <option>Select city / town</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block font-medium text-gray-700 mb-3 text-base">
                Postal Code/ Zip Code
              </label>
              <input
                type="text"
                placeholder="Type postal code / zip code"
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none text-gray-400 text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}