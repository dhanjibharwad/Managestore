"use client"

import React, { useState } from 'react';
import { Search, Download, RefreshCw, List } from 'lucide-react';

type TabType = 'invoices' | 'payments' | 'collect';

interface Payment {
  id: string;
  paymentAgainst: string;
  amount: number;
  customer: string;
  paymentMode: string;
  createdBy: string;
  receivedAt: string;
  createdOn: string;
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('filterByReceivedAt');

  // Sample data - replace with actual data
  const payments: Payment[] = [];

  const handleTabClick = (tab: TabType) => {
    if (tab === 'invoices') {
      // Navigate to invoices page
      window.location.href = '/admin/billing/';
    } else if (tab === 'collect') {
      // Navigate to collect payments page
      window.location.href = '/collect-payments';
    } else {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    // Only render payments content since other tabs navigate away
    return (
      <div className="bg-white rounded-lg">
        {/* Search and Filter Bar */}
        <div className="flex items-center justify-end gap-4 p-4 border-b border-gray-200">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Payment against, customer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="filterByReceivedAt">filterByReceivedAt</option>
            <option value="filterByCreatedAt">filterByCreatedAt</option>
            <option value="filterByAmount">filterByAmount</option>
          </select>

          {/* <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <List className="w-5 h-5 text-gray-600" />
            </button>
          </div> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Payment Against</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Payment Mode</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created By</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Received at</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created On</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.paymentAgainst}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.paymentMode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.createdBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.receivedAt}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.createdOn}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 bg-white px-6">
          <button
            onClick={() => handleTabClick('invoices')}
            className="pb-3 px-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Invoices
          </button>
          
          <button
            onClick={() => handleTabClick('payments')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'payments'
                ? 'text-[#4A70A9]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Payments
            {activeTab === 'payments' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A70A9]" />
            )}
          </button>
          
          {/* <button
            onClick={() => handleTabClick('collect')}
            className="pb-3 px-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Collect Payments
          </button> */}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mt-6 mb-6 px-6">
          Payments
        </h1>

        {/* Tab Content */}
        <div className="px-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}