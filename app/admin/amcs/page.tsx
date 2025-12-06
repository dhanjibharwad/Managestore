"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface Contract {
  id: string;
  customer: string;
  assignee: string;
  paymentReceived: string;
  totalAmount: string;
  contractStartOn: string;
  contractEndsAt: string;
  status: string;
  paymentStatus: string;
}

export default function AMCContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - replace with your actual data
  const contracts: Contract[] = [];

  return (
    <div className="bg-gray-50">
      {/* Header Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/admin/amcs"
              className="py-4 px-1 border-b-2 border-[#4A70A9] text-[#4A70A9] font-medium text-sm transition-colors"
            >
              Contracts
            </Link>
            <Link
              href="/admin/amcs/services"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              Services
            </Link>
            <Link
              href="/admin/amcs/complaints"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              Complaints
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="AMC contract, customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button className="bg-[#4A70A9] text-white px-6 py-2 rounded-md hover:bg-[#3d5c8a] transition-colors font-medium">
                + New
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contracts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Received
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Start On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Ends At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-400 text-lg">No data</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.assignee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.paymentReceived}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.contractStartOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.contractEndsAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {contract.paymentStatus}
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