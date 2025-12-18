"use client"

import React, { useState, useEffect } from 'react';
import { Search, Settings, X, Check, Download, List, Plus } from 'lucide-react';
import Link from 'next/link';

interface Employee {
  id: number;
  employee_id: string;
  employee_name: string;
  display_name: string;
  employee_role: string;
  mobile_number: string;
  email_id: string;
  gender: string;
  status: string;
  created_at: string;
}

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/admin/employees?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-16 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-16 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, index) => (
                    <tr 
                      key={employee.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === employees.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm bg-[#4A70A9]">
                            {employee.display_name || employee.employee_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[#4A70A9] font-medium hover:underline cursor-pointer">
                              {employee.employee_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {employee.employee_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{employee.display_name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.employee_role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          employee.employee_role === 'technician' ? 'bg-blue-100 text-blue-800' :
                          employee.employee_role === 'reception' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.employee_role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[#4A70A9] hover:underline cursor-pointer">
                            +91 {employee.mobile_number}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(employee.mobile_number)}
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
                            {employee.email_id}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(employee.email_id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 capitalize">{employee.gender || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {employee.status === 'Active' ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <X className="w-5 h-5 text-red-500" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {new Date(employee.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Settings className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;