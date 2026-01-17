"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

interface Sale {
  id: number;
  sale_number: string;
  customer_name: string;
  sale_date: string;
  payment_status: string;
  grand_total: number;
  subtotal: number;
  total_tax: number;
}

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTax, setFilterTax] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/admin/sales');
      const data = await response.json();
      if (data.sales) {
        setSales(data.sales);
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.sale_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || sale.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">

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
              {/* <button
                className="px-4 py-2 text-white rounded-md text-sm font-medium transition-colors"
                style={{ backgroundColor: '#4A70A9' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a5a89'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A70A9'}
              >
                Export
              </button> */}
              
              <Link href="/technician/sales/add">
              <button
                className="cursor-pointer p-2 border-2 rounded-md text-sm font-medium transition-colors"
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.sale_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ₹{parseFloat(sale.grand_total.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ₹0.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ₹{parseFloat(sale.grand_total.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        sale.payment_status === 'partially-paid' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.payment_status}
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