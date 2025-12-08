'use client';

import React, { useState } from 'react';
import { Search, Plus, Clipboard, Users, CheckSquare, Calendar } from 'lucide-react';

interface Job {
  jobSheet: string;
  customer: string;
  paymentReceived: string;
  paymentRemaining: string;
  paymentStatus: string;
  deviceBrand: string;
  deviceModel: string;
  assignee: string;
  serviceAssignee: string;
  status: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('assigned-jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobStatus, setJobStatus] = useState('');

  const tabs = [
    { id: 'assigned-jobs', label: 'Assigned Jobs', icon: Clipboard },
    { id: 'assigned-task', label: 'Assigned Task', icon: CheckSquare },
    { id: 'assigned-leads', label: 'Assigned Leads', icon: Users },
    { id: 'assigned-scheduled', label: 'Assigned Scheduled Pickups', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {/* Assigned Jobs Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">0</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clipboard className="w-5 h-5" />
            <span className="font-medium">Assigned Jobs</span>
          </div>
        </div>

        {/* Assigned Leads Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">0</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="font-medium">Assigned Leads</span>
          </div>
        </div>

        {/* Assigned Task Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">0</div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Assigned Task</span>
          </div>
        </div>

        {/* Assigned Delayed Jobs Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">0</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clipboard className="w-5 h-5" />
            <span className="font-medium">Assigned Delayed Jobs</span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white mx-6 rounded-t-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#4A70A9] border-b-2 border-[#4A70A9]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs Section */}
      <div className="bg-white mx-6 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job sheet, customer, serial ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent w-64"
                />
              </div>

              {/* Status Dropdown */}
              <select
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-600"
              >
                <option value="">Select job status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>


              {/* Add Button */}
              <button className="bg-[#4A70A9] hover:bg-[#3A5F99] text-white p-2 rounded-md transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Job Sheet</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Payment Received</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Payment Remaining</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Payment Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device Brand</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Assignee</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Service Assignee</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-400 text-lg">
                    No data
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}