'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, X, FileText } from 'lucide-react';
import Link from 'next/link';

interface Quotation {
  id: string;
  quotation_number: string;
  customer_display_name: string;
  approved_rejected_by: string;
  status: string;
  created_by: string;
  tax_amount: number;
  total_amount: number;
  note: string;
  expired_on: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [processingQuotation, setProcessingQuotation] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchQuotations = async () => {
    try {
      const response = await fetch('/api/customer/quotations');
      const data = await response.json();
      if (data.quotations) {
        setQuotations(data.quotations);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      showToast('Failed to fetch quotations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuotationAction = async (quotationId: string, action: 'approved' | 'rejected') => {
    setProcessingQuotation(quotationId);
    try {
      const response = await fetch('/api/customer/quotations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotationId, action })
      });

      if (response.ok) {
        setQuotations(prev => prev.map(q => 
          q.id === quotationId 
            ? { ...q, status: action, approved_rejected_by: 'Customer' }
            : q
        ));
        showToast(`Quotation ${action} successfully`, 'success');
      } else {
        const data = await response.json();
        showToast(data.error || `Failed to ${action.slice(0, -1)} quotation`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action.slice(0, -3)}ing quotation:`, error);
      showToast(`Failed to ${action.slice(0, -1)} quotation`, 'error');
    } finally {
      setProcessingQuotation(null);
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotation_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || quotation.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray p-8">
      <div className="max-w-full mx-auto">
        {/* Filters Bar */}
        <div className="flex items-center justify-end gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Quotation number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700 min-w-[180px]"
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Quotations
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Quotation For
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Customer Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Approved/Rejected By
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Created By
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Tax Amt
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.quotation_number}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.note || '-'}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.customer_display_name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.approved_rejected_by || '-'}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {quotation.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.created_by}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">₹{parseFloat(quotation.tax_amount.toString()).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">₹{parseFloat(quotation.total_amount.toString()).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      <div className="flex items-center gap-2">
                        <Link href={`/customer/quotations/${quotation.id}/invoice`}>
                          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </Link>
                        {(!quotation.status || quotation.status === 'pending') && (
                          <>
                            <button
                              onClick={() => handleQuotationAction(quotation.id, 'approved')}
                              disabled={processingQuotation === quotation.id}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleQuotationAction(quotation.id, 'rejected')}
                              disabled={processingQuotation === quotation.id}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
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

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-600" size={20} />}
            {toast.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
            <span className={`flex-1 text-sm font-medium ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`hover:opacity-70 ${
                toast.type === 'success' ? 'text-green-600' :
                toast.type === 'error' ? 'text-red-600' :
                'text-yellow-600'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}