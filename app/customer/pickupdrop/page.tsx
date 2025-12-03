'use client';

import { useState } from 'react';
import { Search, Filter, Grid3x3, List, Plus } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [pickupDrops] = useState<PickupDrop[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-800">Pickup/Drops</h1>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex items-center justify-between gap-4">
            {/* Empty space on left */}
            <div className="flex-1"></div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="w-72 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job number, customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-600 bg-white text-sm min-w-[150px]"
              >
                <option value="">Select status</option>
                <option value="pending">open</option>
                {/* <option value="in-progress">In Progress</option> */}
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* All Filters Button */}
              <button className="px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-[#4A70A9] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                All Filters
              </button>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-[#4A70A9] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-[#4A70A9] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Add Button */}
              <button className="p-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Job Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Device Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Assignee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Pick Up Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {pickupDrops.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-400 text-lg">No data</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pickupDrops.map((item) => (
                    <tr
                      key={item.jobNumber}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {item.jobNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {item.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {item.deviceType}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {item.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {item.assignee}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4A70A9] text-white">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
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
    </div>
  );
}