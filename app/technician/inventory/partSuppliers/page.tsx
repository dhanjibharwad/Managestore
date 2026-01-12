'use client';

import React, { useState } from 'react';
import { Search, Filter, List, Plus } from 'lucide-react';
import Link from 'next/link';

interface Supplier {
  id: string;
  supplier: string;
  mobile: string;
  phone: string;
  email: string;
  taxNumber: string;
  city: string;
}

export default function PartSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Part Suppliers</h1>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name, mobile, email, etc"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Action Buttons */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" style={{ color: '#4A70A9' }} />
            </button>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <List className="w-5 h-5" style={{ color: '#4A70A9' }} />
            </button>
            
            <Link href="/technician/inventory/partSuppliers/add">
            <button 
              className="p-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#4A70A9' }}
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Supplier
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Tax Number
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    City
                  </th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">No data</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr 
                      key={supplier.id} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {supplier.supplier}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.mobile}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.taxNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.city}
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