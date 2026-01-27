'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, Search, SlidersHorizontal, Plus, CheckCircle, Edit, Trash2, AlertCircle, XCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Expense {
  id: number;
  expense_id: string;
  expense_name: string;
  category: string;
  description: string;
  amount: number;
  payment_mode: string;
  expense_date: string;
  attachments: string[];
  created_at: string;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingExpense, setDeletingExpense] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, expense: Expense | null}>({show: false, expense: null});
  const [toasts, setToasts] = useState<Toast[]>([]);

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

  useEffect(() => {
    fetchExpenses();
    
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

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/admin/expenses');
      const data = await response.json();
      if (response.ok) {
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const handleDeleteExpense = async (expenseId: number, expenseName: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Expense deleted successfully!', 'success');
        setDeleteModal({show: false, expense: null});
        fetchExpenses();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete expense', 'error');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      showToast('Failed to delete expense', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPaymentReceived = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const totalExpensesCount = expenses.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <div 
          className="flex items-center gap-2 cursor-pointer mb-6"
          onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
        >
          <h1 className="text-2xl font-semibold text-gray-800">
            Expense Quick Overview Report
          </h1>
          <ChevronUp 
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isOverviewExpanded ? '' : 'rotate-180'
            }`}
          />
        </div>

        {/* Overview Cards */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOverviewExpanded ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-4xl font-semibold text-gray-800 mb-2">
                {totalPaymentReceived.toFixed(2)}
              </div>
              <div className="text-gray-600 flex items-center gap-2">
                Total Payment Received
                <span className="text-gray-400">ⓘ</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-4xl font-semibold text-gray-800 mb-2">
                {totalExpensesCount}
              </div>
              <div className="text-gray-600 flex items-center gap-2">
                Total Expenses Count
                <span className="text-gray-400">ⓘ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Expenses Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Expense name, description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* All Filters Button */}
            {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              All Filters
            </button> */}

            {/* Add Button */}
            <Link href="/admin/expenses/add" >
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-md text-white transition-colors"
              style={{ backgroundColor: '#4A70A9' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d5a8a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A70A9'}
            >
              <Plus className="w-5 h-5" />
            </button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Expense Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Created On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-sm">No data</div>
                  </td>
                </tr>
              ) : (
                expenses
                  .filter(expense => 
                    expense.expense_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (expense.description && expense.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="font-medium">{expense.expense_name}</div>
                      <div className="text-xs text-gray-500">{expense.expense_id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 capitalize">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="max-w-xs truncate">
                        {expense.description || '-'}
                      </div>
                      {expense.attachments && expense.attachments.length > 0 && (
                        <div className="text-xs mt-1">
                          {expense.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              onClick={() => window.open(attachment, '_blank')}
                              className="text-blue-600 hover:text-blue-800 underline mr-2"
                            >
                              Attachment {index + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      ₹{Number(expense.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 capitalize">
                      {expense.payment_mode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatDate(expense.expense_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatDateTime(expense.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/expenses/edit/${expense.id}`}>
                          <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            setDeleteModal({show: true, expense});
                          }}
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
        {deleteModal.show && deleteModal.expense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.expense.expense_name}</strong>? 
                  All associated data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({show: false, expense: null})}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(deleteModal.expense!.id, deleteModal.expense!.expense_name)}
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