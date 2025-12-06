"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Job {
  id: string;
  jobSheet: string;
  customer: string;
  paymentReceived: number;
  paymentRemaining: number;
  paymentStatus: string;
  deviceBrand: string;
  deviceModel: string;
  dueDate: string;
  status: string;
}

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<'open' | 'all'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data - replace with your actual data
  const jobs: Job[] = [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header with Tabs */}
        <div className="mb-6">
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('open')}
              className={`text-lg font-medium pb-3 transition-colors relative ${
                activeTab === 'open'
                  ? 'text-[#4A70A9]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Open Jobs
              {activeTab === 'open' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A70A9]" />
              )}
            </button>
            <Link
              href="/customer/jobs/all"
              onClick={() => setActiveTab('all')}
              className={`text-lg font-medium pb-3 transition-colors relative ${
                activeTab === 'all'
                  ? 'text-[#4A70A9]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Jobs
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A70A9]" />
              )}
            </Link>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex justify-end gap-4 mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job sheet, customer, serial ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700"
          >
            <option value="">Select job status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {/* <button className="px-6 py-2.5 bg-[#4A70A9] text-white rounded-lg hover:bg-[#3d5c8a] transition-colors font-medium">
            + New
          </button> */}
        </div>

        {/* Jobs Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Job Sheet
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Payment Received
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Payment Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Device Brand
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Device Model
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="text-gray-400 text-lg">No data</div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.jobSheet}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.paymentReceived}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.paymentRemaining}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.paymentStatus === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : job.paymentStatus === 'Partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {job.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.deviceBrand}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.deviceModel}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.dueDate}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {job.status}
                        </span>
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