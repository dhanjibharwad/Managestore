'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, Search, SlidersHorizontal, Plus, CheckCircle, Edit } from 'lucide-react';
import Link from 'next/link';

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchExpenses();
    
    // Check for success message from localStorage
    const message = localStorage.getItem('successMessage');
    if (message) {
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* All Filters Button */}
            {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              All Filters
            </button> */}

            {/* Add Button */}
            <Link href="/technician/expenses/add" >
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
                        <Link href={`/technician/expenses/edit/${expense.id}`}>
                          <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
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