'use client';

import React, { useState } from 'react';
import { Calendar, Upload, Info, Plus } from 'lucide-react';

const ContractFormPage = () => {
  const [contractStartDate, setContractStartDate] = useState('08-Dec-2025');
  const [contractEndDate, setContractEndDate] = useState('');
  const [autoRenew, setAutoRenew] = useState(false);

  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-8">
          {/* Contract Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Contract Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by name, mobile, email"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                  <button className="bg-[#4A70A9] text-white p-2 rounded-md hover:bg-[#3d5c8c] transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Assignee <span className="text-red-500">*</span>
                  <Info size={14} className="text-gray-400" />
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                  <option>Select assignee name</option>
                </select>
              </div>

              {/* AMC Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AMC Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                  <option>Select AMC type</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contract Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={contractStartDate}
                    onChange={(e) => setContractStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent pr-10"
                  />
                  <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Contract End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select contract end date"
                    value={contractEndDate}
                    onChange={(e) => setContractEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent pr-10"
                  />
                  <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Coverage Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Number Of Devices Covered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Of Devices Covered
                </label>
                <input
                  type="text"
                  placeholder="Eg: 5, 10 etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Response Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Response Time
                  <Info size={14} className="text-gray-400" />
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Eg: 2 hours, 1 day, 2 days"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                    <option>Select...</option>
                  </select>
                </div>
              </div>

              {/* Number Of Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Number Of Services
                  <Info size={14} className="text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Eg: 5, 10 etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Service Options
                  <Info size={14} className="text-gray-400" />
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                  <option>Select service options</option>
                </select>
              </div>

              {/* Contract Auto Renew */}
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${autoRenew ? 'bg-[#4A70A9]' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoRenew ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Contract Auto Renew
                    <Info size={14} className="text-gray-400" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Payment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Payment Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Frequency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                  <option>Eg: monthly, quarterly, annual, etc.</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter contract amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            {/* Contract Remark */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Remark
              </label>
              <div className="border border-gray-300 rounded-md">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <select className="text-sm border-none focus:outline-none bg-transparent">
                    <option>Normal text</option>
                  </select>
                  <div className="flex gap-1 ml-2">
                    <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
                      <span className="font-bold text-sm">B</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
                      <span className="italic text-sm">I</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Strikethrough">
                      <span className="line-through text-sm">S</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Underline">
                      <span className="underline text-sm">U</span>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Align Left">
                      <span className="text-sm">≡</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Align Center">
                      <span className="text-sm">≡</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Align Right">
                      <span className="text-sm">≡</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Justify">
                      <span className="text-sm">≡</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full px-3 py-2 focus:outline-none resize-none"
                  rows={4}
                  placeholder="Type here..."
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
            </div>
          </div>

          {/* Upload Images Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Upload Images
            </h2>
            
            <div className="border-2 border-dashed border-[#4A70A9] rounded-lg p-12 text-center bg-blue-50/30">
              <div className="flex flex-col items-center">
                <div className="bg-[#4A70A9] text-white p-4 rounded-full mb-4">
                  <Upload size={32} />
                </div>
                <p className="text-[#4A70A9] font-medium mb-2">
                  Take A Photo With Your Camera Or Choose A File From Your Device
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, BMP, WEBP, AND PDF FILES
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Terms and Conditions
            </h2>
            
            <div className="border border-gray-300 rounded-md">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                <select className="text-sm border-none focus:outline-none bg-transparent">
                  <option>Normal text</option>
                </select>
                <div className="flex gap-1 ml-2">
                  <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
                    <span className="font-bold text-sm">B</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
                    <span className="italic text-sm">I</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Strikethrough">
                    <span className="line-through text-sm">S</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Underline">
                    <span className="underline text-sm">U</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Align Left">
                    <span className="text-sm">≡</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Align Center">
                    <span className="text-sm">≡</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Align Right">
                    <span className="text-sm">≡</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Justify">
                    <span className="text-sm">≡</span>
                  </button>
                </div>
              </div>
              <textarea
                className="w-full px-3 py-2 focus:outline-none resize-none"
                rows={4}
                placeholder="Type text here"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractFormPage;