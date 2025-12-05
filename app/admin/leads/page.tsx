"use client";

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  leadName: string;
  mobileNumber: string;
  assignee: string;
  leadSource: string;
  nextFollowUp: string;
  lastFollowupComment: string;
  status: string;
}

export default function LeadsPage() {
  const [leads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');

  return (
    <div className="bg-white p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Leads</h1>
        
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>

          {/* Lead Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white"
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
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white"
          >
            <option value="">Select assignee name</option>
            <option value="john">John Doe</option>
            <option value="jane">Jane Smith</option>
            <option value="mike">Mike Johnson</option>
          </select>

          {/* All Filters Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4A70A9] text-white rounded-md text-sm font-medium hover:bg-[#3d5d8f] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            All Filters
          </button>

          {/* Add Button */}
          <Link href="/admin/leads/add">
            
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
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <p className="text-gray-400 text-sm">No data</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.leadName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.mobileNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.assignee}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.leadSource}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.nextFollowUp}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.lastFollowupComment}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}