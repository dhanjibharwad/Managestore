"use client"
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Settings, FileText } from 'lucide-react';
import Link from 'next/link';

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
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, right: number} | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

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
    <div className="bg-gray-50 flex flex-col overflow-hidden">
      {/* Sales Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
        {/* Header with Filters */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-64"
                />
              </div>

              {/* Select Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">Select status</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, index) => {
                  const displayStatus = getPaymentStatusDisplay(sale.paymentStatus, sale.paymentReceived, sale.totalAmount);
                  return (
                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {sale.saleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {sale.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {sale.parts || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ₹{sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ₹{sale.paymentReceived.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ₹{sale.paymentRemaining.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          displayStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          displayStatus === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDropdownPosition({
                                top: rect.bottom + window.scrollY,
                                right: window.innerWidth - rect.right
                              });
                              setOpenDropdown(openDropdown === index ? null : index);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                          
                          {openDropdown === index && dropdownPosition && (
                            <div className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-56" 
                                 style={{
                                   top: `${dropdownPosition.top}px`,
                                   right: `${dropdownPosition.right}px`
                                 }}>
                              <div className="py-1">
                                <Link href={`/customer/sales/${sale.id}/invoice`}>
                                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Sale Invoice
                                  </button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}