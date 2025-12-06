"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Plus, Info } from 'lucide-react';
import Link from 'next/link';

interface Sale {
  saleNumber: string;
  customerName: string;
  part: string;
  totalAmount: number;
  paymentReceived: number;
  paymentRemaining: number;
  paymentStatus: string;
}

export default function SalesPage() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTax, setFilterTax] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sales] = useState<Sale[]>([]);

  const totalPayment = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaymentReceived = sales.reduce((sum, sale) => sum + sale.paymentReceived, 0);
  const totalDueAmount = sales.reduce((sum, sale) => sum + sale.paymentRemaining, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Sale Quick Overview Report
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Total Payment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Payment</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {totalPayment.toFixed(2)}
          </div>
        </div>

        {/* Total Payment Received */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Payment Received</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {totalPaymentReceived.toFixed(2)}
          </div>
        </div>

        {/* Total Due Amount */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Due Amount</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {totalDueAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Sales Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Sales</h2>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sale number, customer name, mobile"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent w-64"
                />
              </div>

              {/* Filter by Tax */}
              <div className="relative">
                <select
                  value={filterTax}
                  onChange={(e) => setFilterTax(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">Filter by tax</option>
                  <option value="gst">GST</option>
                  <option value="non-gst">Non-GST</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Select Status */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">Select status</option>
                   <option value="paid">Paid</option>
                    <option value="partial">Partially Paid</option>
                     <option value="unpaid">Unpaid</option>
                      <option value="over">Over Paid</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Action Buttons */}
              <button
                className="px-4 py-2 text-white rounded-md text-sm font-medium transition-colors"
                style={{ backgroundColor: '#4A70A9' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a5a89'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A70A9'}
              >
                Export
              </button>
              
              <Link href="/admin/sales/add">
              <button
                className="p-2 border-2 rounded-md text-sm font-medium transition-colors"
                style={{ borderColor: '#4A70A9', color: '#4A70A9' }}
              >
                <Plus className="w-5 h-5" />
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Sale Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Part
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                sales.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.saleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.part}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.paymentReceived.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.paymentRemaining.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {sale.paymentStatus}
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
  );
}