"use client"
import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');

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
                DB
              </div>

              {/* Profile Info */}
              <div className="pt-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Dhanji Bharwad</h1>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <a href="tel:7600234249" className="text-[#4A70A9] hover:underline">7600234249</a>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <a href="mailto:hrjashviro@gmail.com" className="text-[#4A70A9] hover:underline">hrjashviro@gmail.com</a>
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
                    <span className="text-gray-900">Admin</span>
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
                  <span>Nov 25, 2025</span>
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
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Employee Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Employee Information</h2>
                <button className="px-4 py-2 text-[#4A70A9] border border-[#4A70A9] rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value="Dhanji Bharwad"
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                    <svg className="inline w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: Dummy name visible to customer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
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
                      readOnly
                      className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-center"
                    />
                    <input
                      type="text"
                      value="7600234249"
                      readOnly
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: 91XXXXXXXX"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    placeholder="Type aadhaar number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400">
                    <option>Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pan Card / Tax Number
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: ABCD1234A"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Date of birth"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Address Details <span className="text-gray-400 font-normal">(Optional)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line
                  </label>
                  <input
                    type="text"
                    placeholder="House / building name/no, street name, locality"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region/State
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400">
                    <option>Select region / state</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City/Town
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400">
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
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
                    placeholder="Type account name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="Type bank name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    placeholder="Type branch name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Type account number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                    <svg className="inline w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    placeholder="Type IFSC code"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-400"
                  />
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