'use client';

import { useState } from 'react';
import { Search, Filter, Grid3x3, List, Plus, X } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState<'pickup' | 'drop'>('pickup');
  const [formData, setFormData] = useState({
    mobile: '',
    deviceType: '',
    scheduleOn: '',
    address: '',
    savedResponses: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      mobile: '',
      deviceType: '',
      scheduleOn: '',
      address: '',
      savedResponses: '',
      description: ''
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      mobile: '',
      deviceType: '',
      scheduleOn: '',
      address: '',
      savedResponses: '',
      description: ''
    });
  };

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

              {/* Add Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors"
              >
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-zinc-800">Schedule A Pickup/Drop</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Radio Buttons */}
                <div className="flex items-center justify-center gap-8 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="pickup"
                      checked={scheduleType === 'pickup'}
                      onChange={() => setScheduleType('pickup')}
                      className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9]"
                    />
                    <span className="text-sm text-zinc-700">Pickup</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="drop"
                      checked={scheduleType === 'drop'}
                      onChange={() => setScheduleType('drop')}
                      className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9]"
                    />
                    <span className="text-sm text-zinc-700">Drop</span>
                  </label>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Mobile and Device Type Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-700 mb-1">
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                          +91
                        </span>
                        <input
                          type="text"
                          placeholder="8857859209"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-700 mb-1">
                        Device Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.deviceType}
                        onChange={(e) => handleInputChange('deviceType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm text-gray-600"
                      >
                        <option value="">Select device type you want...</option>
                        <option value="laptop">Laptop</option>
                        <option value="desktop">Desktop</option>
                        <option value="tablet">Tablet</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                  </div>

                  {/* Schedule On */}
                  <div>
                    <label className="block text-sm text-zinc-700 mb-1">
                      Schedule On <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.scheduleOn}
                      onChange={(e) => handleInputChange('scheduleOn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm text-zinc-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Saved Responses */}
                  <div>
                    <select
                      value={formData.savedResponses}
                      onChange={(e) => handleInputChange('savedResponses', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm text-gray-600"
                    >
                      <option value="">Saved responses</option>
                      <option value="response1">Response 1</option>
                      <option value="response2">Response 2</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm text-zinc-700 mb-1">Description</label>
                    <div className="border border-gray-300 rounded-md">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                        <button className="text-gray-600 hover:text-gray-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6-6m6 6l-6 6" />
                          </svg>
                        </button>
                        <select className="text-xs border-0 bg-transparent text-gray-600 focus:outline-none">
                          <option>Normal text</option>
                          <option>Heading</option>
                        </select>
                        <button className="text-gray-600 hover:text-gray-800 font-bold text-sm">B</button>
                        <button className="text-gray-600 hover:text-gray-800 italic text-sm">I</button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm line-through">S</button>
                        <button className="text-gray-600 hover:text-gray-800">⋮</button>
                      </div>
                      <textarea
                        placeholder="Type text here"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 focus:outline-none text-sm resize-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors text-sm font-medium"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}