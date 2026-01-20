"use client"

import React, { useState, useEffect } from 'react';
import { Search, Settings, X, Check, Download, List, Plus, CheckCircle, AlertCircle, XCircle, IndianRupee } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

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
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [sendingInvite, setSendingInvite] = useState<number | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleSendInvitation = async (employeeId: number) => {
    try {
      setSendingInvite(employeeId);
      setOpenDropdown(null);
      
      const response = await fetch('/api/admin/employees/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      });
      
      if (response.ok) {
        showToast('Invitation sent successfully!', 'success');
        fetchEmployees();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to send invitation', 'error');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      showToast('Failed to send invitation', 'error');
    } finally {
      setSendingInvite(null);
    }
  };



  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Employees</h1>
        
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Employee name, display name, mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-zinc-300 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* <button className="p-2 border border-zinc-300 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-zinc-300 rounded-lg hover:bg-gray-100 transition-colors">
            <List className="w-5 h-5 text-gray-600" />
          </button> */}
          <Link href="/technician/employees/add">
            <button className="px-4 py-2 bg-[#4A70A9] text-white rounded-lg text-sm font-medium hover:bg-[#3d5c8a]">
              + Add
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">
                <div className="flex items-center gap-1">
                  Employee
                  <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Display Name</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Role</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Mobile</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Gender</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Active</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">On Ride</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Last Login</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-zinc-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={employee.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#4A70A9] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {employee.employee_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">{employee.employee_name}</div>
                        <div className="text-xs text-zinc-500">{employee.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{employee.display_name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.employee_role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      employee.employee_role === 'technician' ? 'bg-blue-100 text-blue-800' :
                      employee.employee_role === 'reception' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.employee_role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {employee.mobile_number && (
                      <span className="text-[#4A70A9]">+91 {employee.mobile_number}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {employee.email_id && (
                      <span className="text-[#4A70A9]">{employee.email_id}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 capitalize">{employee.gender || '-'}</td>
                  <td className="px-4 py-3">
                    {employee.status === 'Active' && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <X className="w-5 h-5 text-red-500" />
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{new Date(employee.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      
                      {openDropdown === index && (
                        <div className="absolute right-0 top-8 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button 
                              onClick={() => handleSendInvitation(employee.id)}
                              disabled={sendingInvite === employee.id}
                              className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              {sendingInvite === employee.id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )}
                              {sendingInvite === employee.id ? 'Sending...' : 'Send Invitation'}
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                              <IndianRupee className="w-4 h-4" />
                              Send Payment Reminder
                            </button>
                            {/* <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Deactivate/Activate Account
                            </button> */}

                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>



      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-600" size={20} />}
            {toast.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
            <span className={`flex-1 text-sm font-medium ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`hover:opacity-70 ${
                toast.type === 'success' ? 'text-green-600' :
                toast.type === 'error' ? 'text-red-600' :
                'text-yellow-600'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTable;