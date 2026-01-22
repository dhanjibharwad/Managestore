"use client"
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface Sale {
  id: number;
  saleNumber: string;
  customerName: string;
  parts: string;
  totalAmount: number;
  paymentReceived: number;
  paymentRemaining: number;
  paymentStatus: string;
  saleDate: string;
  createdAt: string;
}

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/customer/sales');
      if (response.ok) {
        const data = await response.json();
        setSales(data.sales || []);
      } else {
        console.error('Failed to fetch sales');
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusDisplay = (status: string, received: number, total: number) => {
    if (received >= total) return 'Paid';
    if (received > 0) return 'Partially Paid';
    return 'Unpaid';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partially paid': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchQuery === '' ||
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.parts.toLowerCase().includes(searchQuery.toLowerCase());
    
    const displayStatus = getPaymentStatusDisplay(sale.paymentStatus, sale.paymentReceived, sale.totalAmount);
    const matchesStatus = statusFilter === '' || displayStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-44 px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
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
                Parts
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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-32 text-center">
                  <div className="text-gray-400 text-base">Loading...</div>
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-32 text-center">
                  <div className="text-gray-400 text-base">No data</div>
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => {
                const displayStatus = getPaymentStatusDisplay(sale.paymentStatus, sale.paymentReceived, sale.totalAmount);
                return (
                  <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{sale.saleNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{sale.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{sale.parts}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{sale.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{sale.paymentReceived.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{sale.paymentRemaining.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(displayStatus)}`}>
                        {displayStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}