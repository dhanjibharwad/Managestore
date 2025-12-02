"use client"

import React, { useState } from 'react';
import { Search } from 'lucide-react';

type TabType = 'invoices' | 'payments' | 'collect';

interface Invoice {
  id: string;
  jobsheet: string;
  customerName: string;
  status: string;
  createdBy: string;
  taxAmt: number;
  amount: number;
  createdOn: string;
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Select status');

  // Sample data - replace with actual data
  const invoices: Invoice[] = [];

  const handleTabClick = (tab: TabType) => {
    if (tab === 'payments') {
      // Navigate to payments page
      window.location.href = '/admin/billing/payments';
    } else if (tab === 'collect') {
      // Navigate to collect payments page
      window.location.href = '/collect-payments';
    } else {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    // Only render invoices content since other tabs navigate away
    return (
      <div className="bg-white rounded-lg">
        {/* Search and Filter Bar */}
        <div className="flex items-center justify-end gap-4 p-4 border-b border-gray-200">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job invoice, job sheet"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Select status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Jobsheet</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created By</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tax Amt</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created On</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.jobsheet}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.customerName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.createdBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.taxAmt}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.createdOn}</td>
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
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'invoices'
                ? 'text-[#4A70A9]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Invoices
            {activeTab === 'invoices' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A70A9]" />
            )}
          </button>
          
          <button
            onClick={() => handleTabClick('payments')}
            className="pb-3 px-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Payments
          </button>
          
          <button
            onClick={() => handleTabClick('collect')}
            className="pb-3 px-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Collect Payments
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mt-6 mb-6 px-6">
          Job Invoices
        </h1>

        {/* Tab Content */}
        <div className="px-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}