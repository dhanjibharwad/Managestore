"use client"
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  jobSheet: string;
  customer: string;
  paymentReceived: number;
  paymentRemaining: number;
  paymentStatus: string;
  deviceBrand: string;
  deviceModel: string;
  assignee: string;
  serviceAssignee: string;
  status: string;
}

const JobPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Open Jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [jobs] = useState<Job[]>([]);

  const tabs = [
    'Open Jobs',
    'All Jobs',
    'Outsourced Jobs',
    'Self Check-In',
    'Basic/Workflow Settings',
    'Job Settings',
    'Technician Print Options',
    'Print Option Settings',
    'Job Service Option',
    'Overview'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-[#4A70A9]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
        </div> */}

        {/* Filters */}
        <div className="flex gap-4 mb-6 justify-end">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job sheet, customer, serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>
          
          <select
            value={jobStatus}
            onChange={(e) => setJobStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-700"
          >
            <option value="">Select job status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-700"
          >
            <option value="">Select assignee</option>
            <option value="john">John Doe</option>
            <option value="jane">Jane Smith</option>
          </select>

          <Link href="/admin/jobs/add">
          <button className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors flex items-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
          </button>
          </Link>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Job Sheet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Payment Received
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Payment Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Device Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Device Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Service Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-16 text-center text-gray-500">
                      No data
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.jobSheet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.paymentReceived}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.paymentRemaining}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.paymentStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.deviceBrand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.deviceModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.assignee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.serviceAssignee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.status}
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
};

export default JobPage;