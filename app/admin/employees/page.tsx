"use client"

import React, { useState } from 'react';
import { Search, Settings, X, Check, Download, List, Plus } from 'lucide-react';
import Link from 'next/link';

interface Employee {
  id: string;
  name: string;
  displayName: string;
  role: string;
  mobile: string;
  email: string;
  gender: string;
  active: boolean;
  onRide: boolean;
  lastLogin: string;
  avatar: string;
}

const EmployeeTable = () => {
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Dhanji Bharwad',
      displayName: 'DB',
      role: 'Admin',
      mobile: '7600234249',
      email: 'hr.jashviro@gmail.com',
      gender: 'Male',
      active: true,
      onRide: false,
      lastLogin: '25-Nov-2025 03:19 PM',
      avatar: '#10B981'
    },
    {
      id: '2',
      name: 'Shreya Mehta',
      displayName: 'SM',
      role: 'Technician',
      mobile: '8857889898',
      email: 'newuser@gmail.com',
      gender: 'Female',
      active: true,
      onRide: false,
      lastLogin: '',
      avatar: '#EF4444'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Employees</h1>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Employee name, display name, mobile numbe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <List className="w-5 h-5 text-gray-600" />
            </button>
             <Link href="/admin/employees/add" className="p-2 text-white bg-[#4A70A9] rounded-md hover:bg-[#3d5c8a] transition-colors inline-flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      Employee
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Display Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Mobile</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Gender</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-700">Active</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-700">On Ride</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Last Login</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr 
                    key={employee.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === employees.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm"
                          style={{ backgroundColor: employee.avatar }}
                        >
                          {employee.displayName}
                        </div>
                        <span className="text-[#4A70A9] font-medium hover:underline cursor-pointer">
                          {employee.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700"></td>
                    <td className="px-6 py-4 text-gray-700">{employee.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#4A70A9] hover:underline cursor-pointer">
                          {employee.mobile}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(employee.mobile)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#4A70A9] hover:underline cursor-pointer">
                          {employee.email}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(employee.email)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{employee.gender}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {employee.active ? (
                          <Check className="w-5 h-5 text-gray-400" />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <X className="w-5 h-5 text-red-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {employee.lastLogin || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;