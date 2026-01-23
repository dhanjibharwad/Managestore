"use client";

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Edit, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: number;
  lead_name: string;
  mobile_number: string;
  assignee_id: number;
  assignee_name?: string;
  lead_source: string;
  next_follow_up: string;
  comment: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchLeads();
    fetchUsers();
    
    // Check for success message from localStorage
    const message = localStorage.getItem('successMessage');
    if (message && message.trim()) {
      setSuccessMessage(message);
      setShowSuccessPopup(true);
      localStorage.removeItem('successMessage');
      
      // Hide popup after 5 seconds with fade-out
      setTimeout(() => {
        const popup = document.querySelector('.success-popup');
        if (popup) {
          popup.classList.add('animate-fade-out');
          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 300);
        }
      }, 4700);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssigneeName = (assigneeId: number) => {
    const user = users.find(u => u.id === assigneeId);
    return user ? `${user.name} (${user.role})` : assigneeId.toString();
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      lead.lead_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.mobile_number && lead.mobile_number.includes(searchQuery)) ||
      (lead.comment && lead.comment.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAssignee = selectedAssignee === '' || lead.assignee_id.toString() === selectedAssignee;
    
    return matchesSearch && matchesAssignee;
  });

  return (
    <div className="bg-white p-6">
      {/* Header Section */}
      <div className="mb-6">
        {/* <h1 className="text-2xl font-semibold text-gray-900 mb-6">Leads</h1> */}
        
        {/* Filters Bar */}
        <div className="flex items-center justify-end gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Lead name, mobile number, email, last follow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>

          {/* Lead Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
          >
            <option value="">Select lead status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>

          {/* Assignee Dropdown */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
          >
            <option value="">Select assignee name</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
            ))}
          </select>

          {/* All Filters Button */}
          {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4A70A9] text-white rounded-md text-sm font-medium hover:bg-[#3d5d8f] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            All Filters
          </button> */}

          {/* Add Button */}
          <Link href="/technician/leads/add">
            
          <button className="flex items-center justify-center w-10 h-10 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Lead Name
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Mobile Number
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Assignee
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Lead Source
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Next Follow Up
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Last Followup Comment
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <p className="text-gray-400 text-sm">Loading...</p>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <p className="text-gray-400 text-sm">No data</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.lead_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.mobile_number || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getAssigneeName(lead.assignee_id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.lead_source || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.comment || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link href={`/technician/leads/edit/${lead.id}`}>
                      <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-500 ease-in-out translate-x-0 opacity-100">
          <CheckCircle size={24} className="text-green-600" />
          <div>
            <div className="font-semibold text-green-900">Success!</div>
            <div className="text-sm text-green-700">{successMessage}</div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .success-popup {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-fade-out {
          animation: fadeOut 0.3s ease-in forwards;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}