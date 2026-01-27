"use client";

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Edit, Trash2, AlertCircle, CheckCircle, XCircle, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Lead {
  id: number;
  lead_name: string;
  mobile_number: string;
  assignee_id: number;
  assignee_name?: string;
  lead_source: string;
  next_follow_up: string;
  comment: string;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface StatusUpdateModal {
  show: boolean;
  lead: Lead | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [deletingLead, setDeletingLead] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, lead: Lead | null}>({show: false, lead: null});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statusModal, setStatusModal] = useState<StatusUpdateModal>({show: false, lead: null});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

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
    fetchLeads();
    fetchUsers();
    
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssigneeName = (assigneeId: number) => {
    const user = users.find(u => u.id === assigneeId);
    return user ? `${user.name} (${user.role})` : assigneeId.toString();
  };

  const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'new':
        return 'px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200';
      case 'contacted':
        return 'px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'qualified':
        return 'px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200';
      case 'lost':
        return 'px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200';
      default:
        return 'px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModal.lead || !newStatus) {
      showToast('Please select a status', 'warning');
      return;
    }

    if (newStatus === (statusModal.lead.status || 'new')) {
      showToast('Status is already set to this value', 'warning');
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/leads/${statusModal.lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Lead status updated successfully!', 'success');
        setStatusModal({show: false, lead: null});
        fetchLeads();
      } else {
        if (response.status === 401) {
          showToast('Session expired. Please login again.', 'error');
        } else if (response.status === 404) {
          showToast('Lead not found', 'error');
        } else if (response.status === 400) {
          showToast('Invalid request data', 'error');
        } else {
          showToast(data.error || 'Failed to update status', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast('Network error. Please check your connection.', 'error');
      } else {
        showToast('An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteLead = async (leadId: number, leadName: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Lead deleted successfully!', 'success');
        setDeleteModal({show: false, lead: null});
        fetchLeads();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete lead', 'error');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      showToast('Failed to delete lead', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      lead.lead_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.mobile_number && lead.mobile_number.includes(searchQuery)) ||
      (lead.comment && lead.comment.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAssignee = selectedAssignee === '' || lead.assignee_id.toString() === selectedAssignee;
    // Since status column doesn't exist in database, treat all leads as 'new' for filtering
    const leadStatus = lead.status || 'new';
    const matchesStatus = selectedStatus === '' || leadStatus === selectedStatus;
    
    return matchesSearch && matchesAssignee && matchesStatus;
  });

  return (
    <div className="bg-white p-6">
      {/* Header Section */}
      <div className="mb-6">
        {/* <h1 className="text-2xl font-semibold text-gray-900 mb-6">Leads</h1> */}
        
        {/* Filters Bar */}
        <div className="flex items-center justify-end gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Lead name, mobile number, email, last follow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
            />
          </div>

          {/* Lead Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
          >
            <option value="">Select lead status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>

          {/* Assignee Dropdown */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
          >
            <option value="">Select assignee name</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
            ))}
          </select>

          {/* All Filters Button */}
          {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4A70A9] text-white rounded-md text-sm font-medium hover:bg-[#3d5d8f] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            All Filters
          </button> */}

          {/* Add Button */}
          <Link href="/admin/leads/add">
            
          <button className="flex items-center justify-center w-10 h-10 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Lead Name
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Mobile Number
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Assignee
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Lead Source
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Next Follow Up
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Last Followup Comment
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <p className="text-gray-400 text-sm">Loading...</p>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <p className="text-gray-400 text-sm">No data</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.lead_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.mobile_number || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getAssigneeName(lead.assignee_id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.lead_source || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.comment || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={getStatusStyle(lead.status || 'new')}>
                      {lead.status || 'new'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setStatusModal({show: true, lead});
                          setNewStatus(lead.status || 'new');
                        }}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors" 
                        title="Update Status"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <Link href={`/admin/leads/edit/${lead.id}`}>
                        <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => {
                          setDeleteModal({show: true, lead});
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
      {deleteModal.show && deleteModal.lead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Lead</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{deleteModal.lead.lead_name}</strong>? 
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({show: false, lead: null})}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteLead(deleteModal.lead!.id, deleteModal.lead!.lead_name)}
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
      
      {/* Status Update Modal */}
      {statusModal.show && statusModal.lead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Update Lead Status</h3>
                <button
                  onClick={() => setStatusModal({show: false, lead: null})}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Lead:</span>
                    <span className="ml-2 font-medium">{statusModal.lead.lead_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mobile:</span>
                    <span className="ml-2 font-medium">{statusModal.lead.mobile_number || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Status:</span>
                    <span className={getStatusStyle(statusModal.lead.status || 'new')}>
                      {statusModal.lead.status || 'new'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assignee:</span>
                    <span className="ml-2 font-medium">{getAssigneeName(statusModal.lead.assignee_id)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStatusModal({show: false, lead: null})}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
  );
}