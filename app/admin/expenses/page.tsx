'use client';

import React, { useState } from 'react';
import { ChevronUp, Search, SlidersHorizontal, Plus } from 'lucide-react';

interface Expense {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: number;
  paymentType: string;
  expenseDate: string;
  createdOn: string;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);

  const totalPaymentReceived = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpensesCount = expenses.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div 
          className="flex items-center gap-2 cursor-pointer mb-6"
          onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
        >
          <h1 className="text-2xl font-semibold text-gray-800">
            Expense Quick Overview Report
          </h1>
          <ChevronUp 
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isOverviewExpanded ? '' : 'rotate-180'
            }`}
          />
        </div>

        {/* Overview Cards */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOverviewExpanded ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-4xl font-semibold text-gray-800 mb-2">
                {totalPaymentReceived.toFixed(2)}
              </div>
              <div className="text-gray-600 flex items-center gap-2">
                Total Payment Received
                <span className="text-gray-400">ⓘ</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-4xl font-semibold text-gray-800 mb-2">
                {totalExpensesCount}
              </div>
              <div className="text-gray-600 flex items-center gap-2">
                Total Expenses Count
                <span className="text-gray-400">ⓘ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Expenses Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Expense name, description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* All Filters Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              All Filters
            </button>

            {/* Add Button */}
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-md text-white transition-colors"
              style={{ backgroundColor: '#4A70A9' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d5a8a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A70A9'}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Expense Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Created On
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-sm">No data</div>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.paymentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.expenseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {expense.createdOn}
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