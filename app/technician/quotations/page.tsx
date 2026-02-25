'use client';

import React, { useState } from 'react';
import { Search, Edit, CheckCircle, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  expiredOn: string;
  totalAmount: number;
  taxAmount: number;
  status: string;
  approvedRejectedBy: string;
  createdBy: string;
  createdAt: string;
}

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  React.useEffect(() => {
    fetchUserSession();
    
    // Check for success message from localStorage
    const message = localStorage.getItem('successMessage');
    if (message && message.trim()) {
      setSuccessMessage(message);
      setShowSuccessPopup(true);
      localStorage.removeItem('successMessage');
      
      // Hide popup after 5 seconds with fade-out
      setTimeout(() => {
        const popup = document.querySelector('.success-popup');
        if (popup) {
          popup.classList.add('animate-fade-out');
          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 300);
        }
      }, 4700);
    }
  }, []);

  React.useEffect(() => {
    if (companyId) {
      fetchQuotations();
    }
  }, [companyId]);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setCompanyId(data.user.companyId);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/quotations?companyId=${companyId}`);
      const data = await response.json();
      if (data.quotations) {
        const formattedQuotations = data.quotations.map((q: any) => ({
          id: q.id.toString(),
          quotationNumber: q.quotation_number,
          customerName: q.customer_name,
          expiredOn: q.expired_on ? new Date(q.expired_on).toLocaleDateString() : '-',
          totalAmount: parseFloat(q.total_amount) || 0,
          taxAmount: parseFloat(q.tax_amount) || 0,
          status: q.status || 'Pending',
          approvedRejectedBy: q.approved_rejected_by || '-',
          createdBy: q.created_by || '-',
          createdAt: q.created_at
        }));
        setQuotations(formattedQuotations);
      }
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700 min-w-[180px]"
            >
              <option value="">Select status</option>
              <option value="modified">Modified</option>
              <option value="Pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Add Button */}
          <Link href="/technician/quotations/add">
            <button className="bg-[#4A70A9] hover:bg-[#3d5d8f] text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
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
                  Created On
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
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                quotations
                  .filter(q => {
                    const matchesSearch = q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        q.customerName.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesStatus = !selectedStatus || q.status.toLowerCase() === selectedStatus.toLowerCase();
                    return matchesSearch && matchesStatus;
                  })
                  .map((quotation) => (
                  <tr key={quotation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.quotationNumber}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.customerName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.approvedRejectedBy}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        quotation.status === 'modified' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{quotation.createdBy}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">₹{quotation.taxAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">₹{quotation.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{formatDateTime(quotation.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">
                      <Link href={`/technician/quotations/edit/${quotation.id}`}>
                        <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="success-popup fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-500 ease-in-out translate-x-0 opacity-100">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <div className="font-semibold text-green-900">Success!</div>
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          </div>
        )}
        
        <style jsx>{`
          .success-popup {
            animation: slideInRight 0.5s ease-out;
          }
          .animate-fade-out {
            animation: fadeOut 0.3s ease-in forwards;
          }
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
