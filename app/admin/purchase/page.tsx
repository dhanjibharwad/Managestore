'use client';

'use client';

import React, { useState } from 'react';
import { ChevronUp, Search, Plus } from 'lucide-react';

interface Purchase {
  id: string;
  purchase: string;
  supplier: string;
  partyInvoiceNumber: string;
  amount: number;
  remainingAmount: number;
  status: string;
  purchasedOn: string;
  dueDate: string;
}

export default function PurchasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sample data - replace with actual data fetching
  const purchases: Purchase[] = [];

  const totalPurchasePrice = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidAmount = purchases.reduce((sum, p) => sum + (p.amount - p.remainingAmount), 0);
  const totalDueAmount = purchases.reduce((sum, p) => sum + p.remainingAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-gray-800 font-semibold text-lg mb-4"
          type="button"
        >
          Purchase Quick Overview Report
          <ChevronUp
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Summary Cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
          }`}
        >
          {/* Total Purchase Price */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-semibold text-gray-800 mb-2">
              {totalPurchasePrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Total Purchase Price
              <span className="text-gray-400">ⓘ</span>
            </div>
          </div>

          {/* Total Paid Amount */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-semibold text-gray-800 mb-2">
              {totalPaidAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Total Paid Amount
              <span className="text-gray-400">ⓘ</span>
            </div>
          </div>

          {/* Total Due Amount */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-semibold text-gray-800 mb-2">
              {totalDueAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Total Due Amount
              <span className="text-gray-400">ⓘ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Table Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Purchase</h2>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Purchase, supplier, party invoice number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent w-80"
              />
            </div>
            {/* Add Button */}
            <button 
              className="bg-[#4A70A9] hover:bg-[#3d5d8f] text-white p-2 rounded-lg transition-colors"
              type="button"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Purchase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Party Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Remaining Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Purchased On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="text-gray-400 text-sm">No data</div>
                  </td>
                </tr>
              ) : (
                purchases
                  .filter(
                    (purchase) =>
                      purchase.purchase.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      purchase.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      purchase.partyInvoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.purchase}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.supplier}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {purchase.partyInvoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {purchase.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {purchase.remainingAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            purchase.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : purchase.status === 'Partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.purchasedOn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.dueDate}</td>
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