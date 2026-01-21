'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
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

  React.useEffect(() => {
    fetchUserSession();
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
          createdAt: new Date(q.created_at).toLocaleDateString()
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
    <div className="bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Quotations</h1>
          
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Quotation number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white min-w-[160px]"
            >
              <option value="">Select status</option>
              <option value="modified">Modified</option>
              <option value="Pending">Pending</option>
               <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Add Button */}
            <Link href="/technician/quotations/add">
            <button
              style={{ backgroundColor: '#4A70A9' }}
              className="cursor-pointer px-6 py-2 text-white rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              + Add
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Quotations
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Approved/Rejected By
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Tax Amt
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="text-gray-400 text-base">Loading...</div>
                </td>
              </tr>
            ) : quotations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="text-gray-400 text-base">No data</div>
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
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.quotationNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.approvedRejectedBy}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      quotation.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      quotation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      quotation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quotation.createdBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{quotation.taxAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{quotation.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}