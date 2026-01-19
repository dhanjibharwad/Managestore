"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Plus, Info, Settings, CreditCard, DollarSign, FileText, Smartphone, Trash2, X, Calendar } from 'lucide-react';
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
  parts?: string;
}

export default function SalesPage() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTax, setFilterTax] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, right: number} | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPaymentModal]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

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

  const totalPayment = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.grand_total.toString()), 0);
  const totalPaymentReceived = 0; // TODO: Calculate from payments table
  const totalDueAmount = totalPayment - totalPaymentReceived;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xl font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Sale Quick Overview Report
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Total Payment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Payment</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {totalPayment.toFixed(2)}
          </div>
        </div>

        {/* Total Payment Received */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Payment Received</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {totalPaymentReceived.toFixed(2)}
          </div>
        </div>

        {/* Total Due Amount */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Due Amount</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {totalDueAmount.toFixed(2)}
          </div>
        </div>
      </div>

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
        <div className="overflow-x-auto overflow-visible">
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
                filteredSales.map((sale, index) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.sale_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {sale.parts || '-'}
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
                              <button 
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowPaymentModal(true);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CreditCard className="w-4 h-4" />
                                Add Payment
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Collect Payment
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Sale Invoice
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                Send UPI Link
                              </button>
                              {/* <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Sale
                              </button> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add Payment</h2>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sale Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Sales: </span>
                  <span className="text-sm font-medium text-blue-600">{selectedSale.sale_number}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Customer: </span>
                  <span className="text-sm font-medium">{selectedSale.customer_name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Received: </span>
                  <span className="text-sm font-medium">₹ 0.00</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Remaining: </span>
                  <span className="text-sm font-medium">₹ {parseFloat(selectedSale.grand_total.toString()).toFixed(2)}</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payable Amount: <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={`₹ ${parseFloat(selectedSale.grand_total.toString()).toFixed(2)}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remaining Amount: <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={`₹ ${parseFloat(selectedSale.grand_total.toString()).toFixed(2)}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Cash</option>
                      <option>Card</option>
                      <option>UPI</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      defaultValue={parseFloat(selectedSale.grand_total.toString())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Received Date
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="advance" className="rounded" />
                  <label htmlFor="advance" className="text-sm text-gray-700">Advance Payment</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Type text here"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Alert
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Mail</span>
                    </label>
                    {/* <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">SMS</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">In App</span>
                    </label> */}
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}