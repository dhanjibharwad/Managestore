"use client"
import React, { useState } from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';

interface Sale {
  saleNumber: string;
  customerName: string;
  part: string;
  totalAmount: number;
  paymentReceived: number;
  paymentRemaining: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
}

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Select status');
  const [sales] = useState<Sale[]>([]);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Sale number, customer name, mobile"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-44 px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              >
                <option>Select status</option>
                <option>Paid</option>
                <option>Partially Paid</option>
                <option>Unpaid</option>
                 <option>Over Paid</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Menu Button */}
            {/* <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Sale Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Part
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Payment Received
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Payment Remaining
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-32 text-center">
                  <div className="text-gray-400 text-base">No data</div>
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.saleNumber} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{sale.saleNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{sale.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{sale.part}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{sale.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{sale.paymentReceived.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{sale.paymentRemaining.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        sale.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : sale.paymentStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
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
  );
}