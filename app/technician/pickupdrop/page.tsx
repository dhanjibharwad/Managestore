'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, CheckCircle, Edit, Trash2, AlertCircle, XCircle, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface StatusUpdateModal {
  show: boolean;
  item: PickupDrop | null;
}

interface PickupDrop {
  id: number;
  pickup_drop_id: string;
  service_type: string;
  customer_search: string;
  customer_name: string;
  mobile: string;
  device_type: string;
  device_type_name: string;
  address: string;
  assignee_id: number;
  assignee_name: string;
  schedule_date: string;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PickupDropsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState<PickupDrop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingItem, setDeletingItem] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, item: PickupDrop | null}>({show: false, item: null});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [statusModal, setStatusModal] = useState<StatusUpdateModal>({show: false, item: null});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
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

  useEffect(() => {
    fetchPickupDrops();
    fetchUsers();
    
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

  const fetchPickupDrops = async () => {
    try {
      const response = await fetch('/api/admin/pickupdrop');
      const result = await response.json();
      if (response.ok) {
        setData(result.pickupDrops || []);
      }
    } catch (error) {
      console.error('Error fetching pickup/drops:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getUserById = (idOrName: string | number) => {
    const byName = users.find(user => user.name === idOrName);
    if (byName) return byName;
    
    const id = typeof idOrName === 'number' ? idOrName : parseInt(idOrName.toString());
    if (!isNaN(id)) {
      return users.find(user => user.id === id);
    }
    
    return undefined;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModal.item || !newStatus) {
      showToast('Please select a status', 'warning');
      return;
    }

    if (newStatus === statusModal.item.status) {
      showToast('Status is already set to this value', 'warning');
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/pickupdrop/${statusModal.item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Pickup/Drop status updated successfully!', 'success');
        setStatusModal({show: false, item: null});
        fetchPickupDrops();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteItem = async (itemId: number, itemName: string) => {
    try {
      setDeletingItem(itemId);
      setDeleteModal({show: false, item: null});
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/pickupdrop/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Pickup/Drop deleted successfully!', 'success');
        fetchPickupDrops();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete pickup/drop', 'error');
      }
    } catch (error) {
      console.error('Error deleting pickup/drop:', error);
      showToast('Failed to delete pickup/drop', 'error');
    } finally {
      setDeletingItem(null);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Pickup/Drops
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job number, customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-600 bg-white min-w-[150px]"
            >
              <option value="">Select status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Add Button */}
             
             <Link href="/technician/pickupdrop/add">    
            <button className="bg-[#4A70A9] hover:bg-[#3d5c8a] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            </Link>

           
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Customer & Mobile
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Device Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Address
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Assignee
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Schedule Time
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                data
                  .filter(item => 
                    (item.pickup_drop_id && item.pickup_drop_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (item.customer_name && item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (item.mobile && item.mobile.includes(searchTerm))
                  )
                  .filter(item => !statusFilter || item.status === statusFilter)
                  .map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="font-medium">{item.pickup_drop_id}</div>
                      <div className="text-xs text-blue-600 capitalize">{item.service_type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="font-medium">{item.customer_name || 'Unknown Customer'}</div>
                      <div className="text-xs text-gray-500">+91 {item.mobile}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 capitalize">
                      {item.device_type_name || item.device_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="max-w-xs truncate">{item.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {(() => {
                        const user = getUserById(item.assignee_name || item.assignee_id);
                        if (user) {
                          return (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <div className="text-gray-900 font-medium">{user.name}</div>
                                <div className="text-gray-500 text-xs">{user.role}</div>
                              </div>
                            </div>
                          );
                        }
                        return item.assignee_name || (item.assignee_id ? `User ${item.assignee_id}` : '-');
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatDate(item.schedule_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setStatusModal({show: true, item});
                            setNewStatus(item.status);
                          }}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors" 
                          title="Update Status"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <Link href={`/technician/pickupdrop/edit/${item.id}`}>
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
        
        {/* Delete Confirmation Modal */}
        {deleteModal.show && deleteModal.item && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Pickup/Drop</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.item.pickup_drop_id}</strong>? 
                  All associated data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({show: false, item: null})}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteItem(deleteModal.item!.id, deleteModal.item!.pickup_drop_id)}
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
        {statusModal.show && statusModal.item && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Update Pickup/Drop Status</h3>
                  <button
                    onClick={() => setStatusModal({show: false, item: null})}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ID:</span>
                      <span className="ml-2 font-medium">{statusModal.item.pickup_drop_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <span className="ml-2 font-medium">{statusModal.item.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(statusModal.item.status)}`}>
                        {statusModal.item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Service:</span>
                      <span className="ml-2 font-medium capitalize">{statusModal.item.service_type}</span>
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
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatusModal({show: false, item: null})}
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
        
        {/* Delete Confirmation Modal */}
        {deleteModal.show && deleteModal.item && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Pickup/Drop</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.item.pickup_drop_id}</strong>? 
                  All associated data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({show: false, item: null})}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteItem(deleteModal.item!.id, deleteModal.item!.pickup_drop_id)}
                    disabled={deletingItem === deleteModal.item.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingItem === deleteModal.item.id ? (
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