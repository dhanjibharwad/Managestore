"use client";
import React, { useState } from 'react';
import { 
  Briefcase, 
  ShoppingCart, 
  Package, 
  Wallet, 
  BarChart3, 
  CreditCard, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Info
} from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('Jobs');

  const tabs = [
    { name: 'Jobs', Icon: Briefcase },
    { name: 'Sales', Icon: ShoppingCart },
    { name: 'Purchase', Icon: Package },
    { name: 'Expenses', Icon: Wallet },
    { name: 'Inventory', Icon: BarChart3 },
    { name: 'Payments', Icon: CreditCard },
    { name: 'Revenues', Icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-start px-8 py-2">
          {tabs.map((tab) => {
            const Icon = tab.Icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex flex-col items-center justify-center px-20 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.name
                    ? 'text-[#4A70A9] border-b-2 border-[#4A70A9]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Cards */}
      <div className="px-8 pt-8">
        <div className="grid grid-cols-2 gap-6 max-w-6xl">
          {activeTab === 'Jobs' && (
            <>
              {/* Total Jobs Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Jobs</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Job Total Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Job Total Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Sales' && (
            <>
              {/* Total Sale Count Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Sale Count</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Total Sale Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Sale Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Purchase' && (
            <>
              {/* Total Purchase Count Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Purchase Count</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Total Purchase Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Purchase Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Expenses' && (
            <>
              {/* Total Expense Count Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Expense Count</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Total Expense Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Expense Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Payments' && (
            <>
              {/* Total Received Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Total Received Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Job Received Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Job Received Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Sale Received Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Sale Received Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>

              {/* Purchase Amount Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <h3 className="text-gray-700 font-medium">Purchase Amount</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-cyan-500 text-sm">
                    {/* <TrendingDown className="w-4 h-4" /> */}
                    <span>0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-gray-900">0.00</div>
                  {/* <div className="text-sm text-gray-500">
                    From 2025-11-06 - 2025-12-06
                  </div> */}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Inventory' && (
            <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Part Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Min Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      In Stock
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Required Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                      No data
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;