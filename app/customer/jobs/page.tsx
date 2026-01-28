"use client";

import React, { useState, useEffect } from 'react';
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      // Add tab-specific filtering
      if (activeTab === 'open') {
        params.append('tabFilter', 'open');
      }
      
      // For all jobs tab, apply status filter if selected
      if (activeTab === 'all' && statusFilter) {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/customer/jobs?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        let jobsData = data.jobs || [];
        
        // Client-side filtering for Open Jobs tab
        if (activeTab === 'open') {
          jobsData = jobsData.filter((job: Job) => 
            job.status === 'Pending' || job.status === 'In Progress'
          );
        }
        
        setJobs(jobsData);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, statusFilter, activeTab]);

  const tabs = ['Open Jobs', 'All Jobs'];

  return (
    <div className="bg-white">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab === 'Open Jobs' ? 'open' : 'all')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                (tab === 'Open Jobs' && activeTab === 'open') || (tab === 'All Jobs' && activeTab === 'all')
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
        {/* Filters */}
        <div className="flex gap-4 mb-6 justify-end">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job sheet, customer, serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={activeTab === 'open'}
            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-700 ${
              activeTab === 'open' ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select job status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
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
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-red-500">{error}</td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-gray-500">No jobs found</td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {job.jobSheet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{job.paymentReceived}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{job.paymentRemaining}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          job.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.deviceBrand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.deviceModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
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