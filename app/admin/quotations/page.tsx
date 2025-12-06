'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface Quotation {
  id: string;
  quotationFor: string;
  customerName: string;
  approvedRejectedBy: string;
  status: string;
  createdBy: string;
  taxAmt: number;
  amount: number;
}

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [quotations] = useState<Quotation[]>([]);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Quotations</h1>
          
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Quotation number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white min-w-[160px]"
            >
              <option value="">Select status</option>
              <option value="modified">Modified</option>
              <option value="await approved">Awaiting approval</option>
               <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Add Button */}
            <Link href="/admin/quotations/add">
            <button
              style={{ backgroundColor: '#4A70A9' }}
              className="px-6 py-2 text-white rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              + Add
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Quotations
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Quotation For
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Approved/Rejected By
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Tax Amt
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {quotations.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="text-gray-400 text-base">No data</div>
                </td>
              </tr>
            ) : (
              quotations.map((quotation) => (
                <tr key={quotation.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.quotationFor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.approvedRejectedBy}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-gray-700">
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.createdBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.taxAmt.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}