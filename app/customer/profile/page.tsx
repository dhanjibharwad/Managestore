'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, User, MessageCircle, Package, FileText, CreditCard, Bell, Edit } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    company: '',
    created_at: ''
  });
  const [customer, setCustomer] = useState({
    customer_name: '',
    mobile_number: '',
    phone_number: '',
    address_line: '',
    region_state: '',
    city_town: '',
    postal_code: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData.user);
          
          // Fetch customer details if user is a customer
          if (userData.user.role === 'customer') {
            const customerRes = await fetch('/api/customer/profile');
            if (customerRes.ok) {
              const customerData = await customerRes.json();
              setCustomer(customerData.customer);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A70A9] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
                    <span className="text-sm font-medium text-[#4A70A9]">{user.phone || customer.mobile_number || 'Not provided'}</span>
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
                  {/* <button className="flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-blue-50 transition-colors">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Pickup Drops</span>
                  </button> */}
                </div>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">Creation Date:</span>
                <span className="text-sm font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
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
                value={customer.customer_name || user.name || ''}
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
                  value={customer.mobile_number || user.phone || ''}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
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
                value={customer.phone_number || ''}
                placeholder="Eg: 91XXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                readOnly
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
                  value={customer.address_line || ''}
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <input
                  type="text"
                  value={customer.region_state || ''}
                  placeholder="Select region / state"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                <input
                  type="text"
                  value={customer.city_town || ''}
                  placeholder="Select city / town"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code/ Zip Code
                </label>
                <input
                  type="text"
                  value={customer.postal_code || ''}
                  placeholder="Type postal code / zip code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}