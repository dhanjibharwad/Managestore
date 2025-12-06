'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface PickupDrop {
  jobNumber: string;
  customer: string;
  deviceType: string;
  address: string;
  assignee: string;
  status: string;
  pickUpTime: string;
}

export default function PickupDropsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState<PickupDrop[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Pickup/Drops
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job number, customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-600 bg-white min-w-[150px]"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Add Button */}
            <button className="bg-[#4A70A9] hover:bg-[#3d5c8a] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
            </button>

           
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Job Number
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Device Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Address
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Assignee
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Pick Up Time
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.jobNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.deviceType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.assignee}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.pickUpTime}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}