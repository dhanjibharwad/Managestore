"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronUp, Search, Plus, Info } from 'lucide-react';

interface Part {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  tax: number;
  warranty: string;
  stock: number;
  rateIncludesTax: boolean;
  qty: number;
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Sample data - empty for "No data" state
  const parts: Part[] = [];

  const totalPurchasePrice = parts.reduce((sum, part) => sum + part.purchasePrice, 0);
  const totalSellingPrice = parts.reduce((sum, part) => sum + part.sellingPrice, 0);
  const lowStockCount = parts.filter(part => part.stock < 10).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-gray-800 font-semibold text-xl mb-4 hover:text-[#4A70A9] transition-colors"
        >
          Part Quick Overview Report
          <ChevronUp
            className={`w-5 h-5 transition-transform duration-500 ease-in-out ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Summary Cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
            isCollapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-96 opacity-100'
          }`}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-800 mb-2">
                  {totalPurchasePrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Total Part Purchase Price
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-800 mb-2">
                  {totalSellingPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Total Part Selling Price
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-800 mb-2">
                  {lowStockCount}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Part Low Stock Count
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parts Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header with Actions */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Parts</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search part"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent w-64"
              />
            </div>

            {/* Action Buttons */}
            <button className="px-4 py-2 text-sm font-medium text-[#4A70A9] border border-[#4A70A9] rounded-md hover:bg-[#4A70A9] hover:text-white transition-colors">
              Part Suppliers
            </button>
            
            <button className="px-4 py-2 text-sm font-medium text-[#4A70A9] border border-[#4A70A9] rounded-md hover:bg-[#4A70A9] hover:text-white transition-colors">
              All Filters
            </button>

            <Link href="/admin/inventory/add" className="p-2 text-white bg-[#4A70A9] rounded-md hover:bg-[#3d5c8a] transition-colors inline-flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Part
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Warranty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Manage Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Rate Includes Tax
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                parts.map((part) => (
                  <tr key={part.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{part.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {part.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {part.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.tax}%</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.warranty}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.stock}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {part.rateIncludesTax ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.qty}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;