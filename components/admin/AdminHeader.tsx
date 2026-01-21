"use client"

import { Search, Bell, ChevronDown, User, Settings, Download, Key, Trash2, Layers, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AdminHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', company: '', role: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        window.location.href = '/auth/login';
      } else {
        console.error('Logout failed');
        // Still redirect even if API fails
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API fails
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center">
      {/* Right side - Search, Notification sticky top-0 z-50 and user profile */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs, leads, tasks, customer..."
            className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent text-sm"
          />
        </div> */}
        {/* Notification bell with badge */}
        {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* Company name */}
        <div className="text-sm font-semibold text-gray-800 mr-4 px-3 py-1 bg-gray-50 rounded-md">
          {user.company || 'Your Company Name'}
        </div>

        {/* User profile with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-[#4A70A9] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{user.name || 'User'}</span>
              <span className="text-xs text-gray-500">{user.role || 'Role'}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link href="/admin/profile" className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700" onClick={() => setIsDropdownOpen(false)}>
                <User className="w-4 h-4 text-gray-500" />
                <span>Profile Account Actions</span>
              </Link>
              
              {/* <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
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
              </div> */}
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700">
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
