"use client"

import { Search, Bell, ChevronDown, User, Settings, Download, Key, Trash2, Layers, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function CustomerHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center">
      {/* Right side - Search, Notification and user profile */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs, leads, tasks, customer..."
            className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
        {/* Notification bell with badge */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile with dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-[#4A70A9] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              UD
            </div>
            <span className="text-sm font-medium text-gray-700">Uday</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-500" />
                <span>Profile Account Actions</span>
              </button>
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Business Settings</span>
              </button>
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                <Download className="w-4 h-4 text-gray-500" />
                <span>Install App</span>
              </button>
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                <Key className="w-4 h-4 text-gray-500" />
                <span>Change Password</span>
              </button>
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                <Trash2 className="w-4 h-4 text-gray-500" />
                <span>Clear Cache</span>
              </button>
              
              <div className="px-4 py-2 flex items-center gap-3 text-sm text-gray-500">
                <Layers className="w-4 h-4" />
                <span>App Version 3.1.0</span>
              </div>
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}