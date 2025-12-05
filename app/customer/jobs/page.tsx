"use client"

import React, { useState } from 'react';
import { X, Plus, List } from 'lucide-react';

interface Job {
  id: string;
  jobSheet: string;
  customer: string;
  paymentReceived: string;
  paymentRemaining: string;
  paymentStatus: string;
  deviceBrand: string;
  deviceModel: string;
  dueDate: string;
  status: string;
}

export default function JobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jobSheet: '',
    customer: '',
    paymentReceived: '',
    paymentRemaining: '',
    paymentStatus: '',
    deviceBrand: '',
    deviceModel: '',
    dueDate: '',
    status: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newJob: Job = {
      id: Date.now().toString(),
      ...formData
    };
    setJobs(prev => [...prev, newJob]);
    setFormData({
      jobSheet: '',
      customer: '',
      paymentReceived: '',
      paymentRemaining: '',
      paymentStatus: '',
      deviceBrand: '',
      deviceModel: '',
      dueDate: '',
      status: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              {/* <h1 className="text-2xl font-semibold text-zinc-800">Jobs</h1> */}
              <div className="flex space-x-1 border-b-2 border-transparent">
                <button className="px-4 py-2 text-sm font-medium text-zinc-900 border-b-2 border-[#4A70A9]">
                  Open Jobs
                </button>
                <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
                  All Jobs
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#3d5d8f] transition-colors"
            >
              <Plus size={20} />
              <span>Create Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex justify-end items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Job sheet, customer, serial ..."
            className="w-80 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-sm"
          />
          <select className="px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-zinc-700 text-sm">
            <option>Select job status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="p-2 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors">
            <List size={20} className="text-zinc-600" />
          </button>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Job Sheet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Payment Received
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Payment Remaining
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Device Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Device Model
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-20 text-center text-zinc-500 text-base">  
                      No data
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">{job.jobSheet}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{job.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{job.paymentReceived}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{job.paymentRemaining}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          job.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{job.deviceBrand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{job.deviceModel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{job.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

       
      </div>

      {/* Create Job Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200">
              <h2 className="text-xl font-semibold text-zinc-900">Create New Job</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-zinc-500 hover:text-zinc-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Job Sheet
                  </label>
                  <input
                    type="text"
                    name="jobSheet"
                    value={formData.jobSheet}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Payment Received
                  </label>
                  <input
                    type="text"
                    name="paymentReceived"
                    value={formData.paymentReceived}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Payment Remaining
                  </label>
                  <input
                    type="text"
                    name="paymentRemaining"
                    value={formData.paymentRemaining}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Device Brand
                  </label>
                  <input
                    type="text"
                    name="deviceBrand"
                    value={formData.deviceBrand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Device Model
                  </label>
                  <input
                    type="text"
                    name="deviceModel"
                    value={formData.deviceModel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#3d5d8f]"
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}