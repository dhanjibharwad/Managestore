"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import { CheckCircle, AlertCircle, XCircle, X, IndianRupee } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Customer {
  id: number;
  customer_id: string;
  company_id: number;
  customer_name: string;
  customer_type: string;
  mobile_number: string;
  email_id: string;
  status: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [sendingInvite, setSendingInvite] = useState<number | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, customer: Customer | null}>({show: false, customer: null});
  const [inviteModal, setInviteModal] = useState<{show: boolean, customer: Customer | null}>({show: false, customer: null});
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

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/admin/customers?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const handleSendInvitation = async (customerId: number) => {
    try {
      setSendingInvite(customerId);
      setInviteModal({show: false, customer: null});
      
      const response = await fetch('/api/admin/customers/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId })
      });
      
      if (response.ok) {
        showToast('Invitation sent successfully!', 'success');
        fetchCustomers(); // Refresh to update invitation status
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to send invitation', 'error');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      showToast('Failed to send invitation', 'error');
    } finally {
      setSendingInvite(null);
    }
  };

  const handleDeleteCustomer = async (customerId: number, customerName: string) => {
    try {
      setDeletingCustomer(customerId);
      setDeleteModal({show: false, customer: null});
      
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Customer deleted successfully!', 'success');
        fetchCustomers(); // Refresh the customer list
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete customer', 'error');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast('Failed to delete customer', 'error');
    } finally {
      setDeletingCustomer(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Customers</h1>
        
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Customer name, mobile number, email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-zinc-300 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* <button className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            All Filters
          </button> */}
          <Link href="/technician/customers/add">
          <button className="cursor-pointer px-4 py-2 bg-[#4A70A9] text-white rounded-lg text-sm font-medium hover:bg-[#3d5c8a]">
            + Add
          </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">
                <div className="flex items-center gap-1">
                  Customer
                  <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Type</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Payment Received</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Payment Remaining</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Phone Number</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Last Login</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Created On</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-zinc-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={customer.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#4A70A9] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {customer.customer_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">{customer.customer_name}</div>
                        <div className="text-xs text-zinc-500">{customer.customer_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.customer_type === 'individual' ? 'bg-blue-100 text-blue-800' :
                      customer.customer_type === 'business' ? 'bg-green-100 text-green-800' :
                      customer.customer_type === 'corporate' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.customer_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">0.00</td>
                  <td className="px-4 py-3 text-zinc-600">0.00</td>
                  <td className="px-4 py-3">
                    {customer.mobile_number && (
                      <span className="text-[#4A70A9]">+91 {customer.mobile_number}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {customer.email_id && (
                      <span className="text-[#4A70A9]">{customer.email_id}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">-</td>
                  <td className="px-4 py-3 text-zinc-600">{new Date(customer.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {customer.status === 'Active' && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      
                      {openDropdown === index && (
                        <div className="absolute right-0 top-8 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button 
                              onClick={() => {
                                setInviteModal({show: true, customer});
                                setOpenDropdown(null);
                              }}
                              disabled={sendingInvite === customer.id}
                              className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              {sendingInvite === customer.id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )}
                              {sendingInvite === customer.id ? 'Sending...' : 'Send Invitation'}
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                              <IndianRupee className="w-4 h-4" />
                              Send Payment Reminder
                            </button>
                            {/* <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Deactivate/Activate Account
                            </button> */}
                            <button 
                              onClick={() => {
                                setDeleteModal({show: true, customer});
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Account
                            </button>
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

      {/* Invite Modal */}
      {inviteModal.show && inviteModal.customer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Send Invitation</h3>
                  <p className="text-sm text-gray-500">Invite customer to access the portal</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={inviteModal.customer.customer_name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteModal.customer.email_id || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700"
                />
                {!inviteModal.customer.email_id && (
                  <p className="text-red-500 text-xs mt-1">No email address found for this customer</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setInviteModal({show: false, customer: null})}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendInvitation(inviteModal.customer!.id)}
                  disabled={!inviteModal.customer.email_id || sendingInvite === inviteModal.customer.id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingInvite === inviteModal.customer.id ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.customer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{deleteModal.customer.customer_name}</strong>? 
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({show: false, customer: null})}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCustomer(deleteModal.customer!.id, deleteModal.customer!.customer_name)}
                  disabled={deletingCustomer === deleteModal.customer.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingCustomer === deleteModal.customer.id ? (
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