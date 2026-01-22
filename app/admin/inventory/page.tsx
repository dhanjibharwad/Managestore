"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUp, Search, Plus, Info, Edit, Trash2, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Part {
  part_id: string;
  part_name: string;
  purchase_price: number;
  selling_price: number;
  tax: string;
  warranty: string;
  opening_stock: number;
  current_stock: number;
  rate_including_tax: boolean;
  category: string;
  sub_category: string;
  low_stock_units: number;
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPart, setDeletingPart] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, part: Part | null}>({show: false, part: null});
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
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      if (response.ok) {
        setParts(data.parts || []);
      }
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (partId: string, partName: string) => {
    try {
      setDeletingPart(partId);
      setDeleteModal({show: false, part: null});
      
      const response = await fetch(`/api/admin/inventory/${partId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Part deleted successfully!', 'success');
        fetchParts();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete part', 'error');
      }
    } catch (error) {
      console.error('Error deleting part:', error);
      showToast('Failed to delete part', 'error');
    } finally {
      setDeletingPart(null);
    }
  };

  const totalPurchasePrice = parts.reduce((sum, part) => sum + Number(part.purchase_price || 0), 0);
  const totalSellingPrice = parts.reduce((sum, part) => sum + Number(part.selling_price || 0), 0);
  const lowStockCount = parts.filter(part => part.current_stock <= (part.low_stock_units || 0)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-gray-800 font-semibold text-xl mb-4 hover:text-[#4A70A9] transition-colors"
        >
          Part Quick Overview Report
          <ChevronUp
            className={`w-5 h-5 transition-transform duration-500 ease-in-out ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Summary Cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
            isCollapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-96 opacity-100'
          }`}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-800 mb-2">
                  {totalPurchasePrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Total Part Purchase Price
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-800 mb-2">
                  {totalSellingPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Total Part Selling Price
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-gray-800 mb-2">
                  {lowStockCount}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Part Low Stock Count
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parts Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header with Actions */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Parts</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search part"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-64"
              />
            </div>

            {/* Action Buttons */}
            <Link href="/admin/inventory/partSuppliers">
            <button className="px-4 py-2 text-sm font-medium text-[#4A70A9] border border-[#4A70A9] rounded-md hover:bg-[#4A70A9] hover:text-white transition-colors">
              Part Suppliers
            </button>
            </Link>
            
            {/* <button className="px-4 py-2 text-sm font-medium text-[#4A70A9] border border-[#4A70A9] rounded-md hover:bg-[#4A70A9] hover:text-white transition-colors">
              All Filters
            </button> */}

            <Link href="/admin/inventory/add" className="p-2 text-white bg-[#4A70A9] rounded-md hover:bg-[#3d5c8a] transition-colors inline-flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Part
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Warranty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Manage Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Rate Includes Tax
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                parts
                  .filter(part => 
                    part.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    part.part_id.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((part) => (
                  <tr key={part.part_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="font-medium">{part.part_name}</div>
                      <div className="text-xs text-gray-500">{part.part_id}</div>
                      {part.category && (
                        <div className="text-xs text-blue-600">{part.category}{part.sub_category && ` > ${part.sub_category}`}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      ₹{Number(part.purchase_price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {part.selling_price ? `₹${Number(part.selling_price).toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.tax || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.warranty || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        part.current_stock <= (part.low_stock_units || 0) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {part.current_stock || part.opening_stock || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {part.rate_including_tax ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{part.current_stock || part.opening_stock || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/inventory/edit/${part.part_id}`}>
                          <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            setDeleteModal({show: true, part});
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
        {deleteModal.show && deleteModal.part && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Part</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.part.part_name}</strong>? 
                  All associated data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({show: false, part: null})}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePart(deleteModal.part!.part_id, deleteModal.part!.part_name)}
                    disabled={deletingPart === deleteModal.part.part_id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingPart === deleteModal.part.part_id ? (
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
};

export default InventoryPage;