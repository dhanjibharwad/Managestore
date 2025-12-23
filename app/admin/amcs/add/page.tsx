'use client';

import React, { useState, useRef } from 'react';
import { Calendar as CalendarIcon, Upload, Info, Plus, X } from 'lucide-react';
import Link from 'next/link';
import Calendar from '@/components/Calendar';



const ContractFormPage = () => {
  const [contractStartDate, setContractStartDate] = useState<Date | null>(null);
  const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
  const [autoRenew, setAutoRenew] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; filename: string; size: number }>>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.files) {
        setUploadedFiles(prev => [...prev, ...data.files]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Contract Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Contract Information
              </h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8c] transition-colors">
                  Create
                </button>
              </div>
            </div>
            
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
                  <Link href="/admin/customers/add/">
                  <button className="bg-[#4A70A9] text-white p-2 rounded-md hover:bg-[#3d5c8c] transition-colors">
                    <Plus size={20} />
                  </button>
                  </Link>
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
                  <option>AMC</option>
                  <option>CMC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contract Start Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatDate(contractStartDate)}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent pr-10 cursor-pointer"
                  />
                  <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {showStartCalendar && (
                  <div className="absolute z-10 mt-2">
                    <Calendar
                      selectedDate={contractStartDate || undefined}
                      onDateSelect={(date) => {
                        setContractStartDate(date);
                        setShowStartCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Contract End Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select contract end date"
                    value={formatDate(contractEndDate)}
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent pr-10 cursor-pointer"
                  />
                  <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {showEndCalendar && (
                  <div className="absolute z-10 mt-2">
                    <Calendar
                      selectedDate={contractEndDate || undefined}
                      onDateSelect={(date) => {
                        setContractEndDate(date);
                        setShowEndCalendar(false);
                      }}
                      minDate={contractStartDate || undefined}
                    />
                  </div>
                )}
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
                    <option>HOURS</option>
                    <option>DAYS</option>
                    <option>WEEk</option>
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
                  <option>On Site</option>
                  <option>Carry in</option>
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
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
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
            
            <div 
              className="border-2 border-dashed border-[#4A70A9] rounded-lg p-12 text-center bg-blue-50/30 cursor-pointer hover:bg-blue-50/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="bg-[#4A70A9] text-white p-4 rounded-full mb-4">
                  <Upload size={32} />
                </div>
                <p className="text-[#4A70A9] font-medium mb-2">
                  {uploading ? 'Uploading...' : 'Take A Photo With Your Camera Or Choose A File From Your Device'}
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, BMP, WEBP, AND PDF FILES
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/bmp,image/webp,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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