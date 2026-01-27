'use client';

import React, { useState } from 'react';
import { ChevronUp, Search, Plus, Trash2, CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Purchase {
  id: string;
  purchase: string;
  supplier: string;
  partyInvoiceNumber: string;
  amount: number;
  remainingAmount: number;
  status: string;
  purchasedOn: string;
  dueDate: string;
}

export default function PurchasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, purchase: Purchase | null}>({show: false, purchase: null});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deletingPurchase, setDeletingPurchase] = useState<string | null>(null);
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

  React.useEffect(() => {
    fetchUserSession();
  }, []);

  React.useEffect(() => {
    if (companyId) {
      fetchPurchases();
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

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/purchases?companyId=${companyId}`);
      const data = await response.json();
      if (data.purchases) {
        const formattedPurchases = data.purchases.map((p: any) => ({
          id: p.id.toString(),
          purchase: p.purchase_number,
          supplier: p.supplier_name,
          partyInvoiceNumber: p.party_invoice_number || '-',
          amount: parseFloat(p.total_amount) || 0,
          remainingAmount: p.payment_status === 'paid' ? 0 : parseFloat(p.total_amount) || 0,
          status: p.payment_status === 'paid' ? 'Paid' : p.payment_status === 'partially-paid' ? 'Partial' : 'Unpaid',
          purchasedOn: new Date(p.purchase_date).toLocaleDateString(),
          dueDate: p.due_date ? new Date(p.due_date).toLocaleDateString() : '-'
        }));
        setPurchases(formattedPurchases);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (purchaseId: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/purchases/${purchaseId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPurchases(purchases.filter(p => p.id !== purchaseId));
        showToast('Purchase deleted successfully!', 'success');
        setDeleteModal({show: false, purchase: null});
      } else {
        showToast('Failed to delete purchase', 'error');
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
      showToast('Failed to delete purchase', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPurchasePrice = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidAmount = purchases.reduce((sum, p) => sum + (p.amount - p.remainingAmount), 0);
  const totalDueAmount = purchases.reduce((sum, p) => sum + p.remainingAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-gray-800 font-semibold text-lg mb-4"
          type="button"
        >
          Purchase Quick Overview Report
          <ChevronUp
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Summary Cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'
          }`}
        >
          {/* Total Purchase Price */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-semibold text-gray-800 mb-2">
              {totalPurchasePrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Total Purchase Price
              <span className="text-gray-400">ⓘ</span>
            </div>
          </div>

          {/* Total Paid Amount */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-semibold text-gray-800 mb-2">
              {totalPaidAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Total Paid Amount
              <span className="text-gray-400">ⓘ</span>
            </div>
          </div>

          {/* Total Due Amount */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-semibold text-gray-800 mb-2">
              {totalDueAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Total Due Amount
              <span className="text-gray-400">ⓘ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Table Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Purchase</h2>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Purchase, supplier, party invoice number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-80"
              />
            </div>
            {/* Add Button */}
            <Link href="/admin/purchase/add">
            <button 
              className="bg-[#4A70A9] hover:bg-[#3d5d8f] text-white p-2 rounded-lg transition-colors"
              type="button"
            >
              <Plus className="w-5 h-5" />
            </button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Purchase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Party Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Remaining Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Purchased On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="text-gray-400 text-sm">No data</div>
                  </td>
                </tr>
              ) : (
                purchases
                  .filter(
                    (purchase) =>
                      purchase.purchase.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      purchase.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      purchase.partyInvoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.purchase}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.supplier}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.partyInvoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">₹{purchase.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">₹{purchase.remainingAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          purchase.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          purchase.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.purchasedOn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{purchase.dueDate}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDeleteModal({ show: true, purchase })}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete purchase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.purchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Purchase</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete purchase <strong>{deleteModal.purchase.purchase}</strong>? 
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({show: false, purchase: null})}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.purchase!.id)}
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
  );
}