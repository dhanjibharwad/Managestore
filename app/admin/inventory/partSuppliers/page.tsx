'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, List, Plus, Trash2, AlertCircle, CheckCircle, XCircle, X, Edit } from 'lucide-react';
import Link from 'next/link';

interface Supplier {
  id: number;
  supplier_name: string;
  mobile_number: string;
  phone_number: string;
  email_id: string;
  tax_number: string;
  city_town: string;
  address_line: string;
  region_state: string;
  postal_code: string;
  created_at: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function PartSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, supplier: Supplier | null}>({show: false, supplier: null});
  const [deletingSupplier, setDeletingSupplier] = useState<number | null>(null);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/admin/part-suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (supplierId: number) => {
    try {
      setDeletingSupplier(supplierId);
      setDeleteModal({show: false, supplier: null});
      
      const response = await fetch(`/api/admin/part-suppliers?id=${supplierId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuppliers(prev => prev.filter(s => s.id !== supplierId));
        showToast('Supplier deleted successfully!', 'success');
      } else {
        showToast('Failed to delete supplier', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete supplier', 'error');
    } finally {
      setDeletingSupplier(null);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.mobile_number.includes(searchQuery) ||
    (supplier.email_id && supplier.email_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Part Suppliers</h1>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name, mobile, email, etc"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Action Buttons */}
            {/* <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" style={{ color: '#4A70A9' }} />
            </button>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <List className="w-5 h-5" style={{ color: '#4A70A9' }} />
            </button> */}
            
            <Link href="/admin/inventory/partSuppliers/add">
            <button 
              className="p-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#4A70A9' }}
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Supplier
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Tax Number
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    City
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Created On
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">Loading...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">No suppliers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr 
                      key={supplier.id} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {supplier.supplier_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        +91 {supplier.mobile_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.phone_number || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.email_id || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.tax_number || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.city_town || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(supplier.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/inventory/partSuppliers/edit/${supplier.id}`}>
                            <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => setDeleteModal({show: true, supplier})}
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.supplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Supplier</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete supplier <strong>{deleteModal.supplier.supplier_name}</strong>? 
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({show: false, supplier: null})}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.supplier!.id)}
                  disabled={deletingSupplier === deleteModal.supplier.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingSupplier === deleteModal.supplier.id ? (
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