'use client';

import React, { useState } from 'react';
import { Search, Trash2, CheckCircle, AlertCircle, XCircle, X, Edit, ChevronDown, Plus, FileText } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, quotation: Quotation | null}>({show: false, quotation: null});
  const [deletingQuotation, setDeletingQuotation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          createdBy: q.created_by || 'Admin',
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

  const handleDelete = async (quotationId: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/quotations?id=${quotationId}&companyId=${companyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setQuotations(prev => prev.filter(q => q.id !== quotationId));
        showToast('Quotation deleted successfully!', 'success');
        setDeleteModal({show: false, quotation: null});
      } else {
        showToast('Failed to delete quotation', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete quotation', 'error');
    } finally {
      setIsDeleting(false);
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
          <Link href="/admin/quotations/add">
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
                    const matchesSearch = (q.quotationNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        (q.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
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
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/quotations/${quotation.id}/invoice`}>
                          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/quotations/edit/${quotation.id}`}>
                          <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteModal({show: true, quotation})}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Delete Confirmation Modal */}
        {deleteModal.show && deleteModal.quotation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Quotation</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.quotation.quotationNumber}</strong>? 
                  All associated data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({show: false, quotation: null})}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal.quotation!.id)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
    </div>
  );
}
