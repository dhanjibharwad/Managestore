"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, AlertCircle, CheckCircle, XCircle, X, Edit } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Contract {
  id: number;
  contract_number: string;
  customer_name: string;
  customer_display_name: string;
  assignee: string;
  assignee_display_name: string;
  amount: string;
  contract_start_date: string;
  contract_end_date: string;
  amc_type: string;
  auto_renew: boolean;
  created_at?: string;
}

interface Employee {
  id: number;
  employee_name: string;
  employee_role: string;
  email: string;
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default function AMCContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, contract: Contract | null}>({show: false, contract: null});
  const [deletingContract, setDeletingContract] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
    const timeoutId = setTimeout(() => {
      fetchContracts();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/admin/employees');
      const data = await response.json();
      if (response.ok && data.employees) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const getEmployeeByName = (nameOrId: string | number) => {
    // Try to find by name first
    const byName = employees.find(emp => emp.employee_name === nameOrId);
    if (byName) return byName;
    
    // If not found and it's a number or numeric string, try to find by ID
    const id = typeof nameOrId === 'number' ? nameOrId : parseInt(nameOrId);
    if (!isNaN(id)) {
      return employees.find(emp => emp.id === id);
    }
    
    return undefined;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/admin/amcs?${params}`);
      const data = await response.json();
      if (data.contracts) {
        setContracts(data.contracts);
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering as fallback
  const filteredContracts = searchQuery ? 
    contracts.filter(contract =>
      (contract.customer_display_name || contract.customer_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.assignee_display_name || contract.assignee).toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.contract_number.toLowerCase().includes(searchQuery.toLowerCase())
    ) : contracts;

  const handleDelete = async (contractId: number) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/amcs?id=${contractId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setContracts(prev => prev.filter(c => c.id !== contractId));
        showToast('Contract deleted successfully!', 'success');
        setDeleteModal({show: false, contract: null});
      } else {
        showToast('Failed to delete contract', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete contract', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header Tabs */}
      <div className="bg-white border-b rounded-lg border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/admin/amcs"
              className="py-4 px-1 border-b-2 border-[#4A70A9] text-[#4A70A9] font-medium text-sm transition-colors"
            >
              Contracts
            </Link>
            {/* <Link
              href="/admin/amcs/services"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              Services
            </Link>
            <Link
              href="/admin/amcs/complaints"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              Complaints
            </Link> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="AMC contract, customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Link href="/admin/amcs/add">
              <button className="bg-[#4A70A9] text-white px-4 py-2 rounded-md hover:bg-[#3d5c8a] transition-colors font-medium">
                + New
              </button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AMC Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auto Renew
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-32 text-center">
                      <p className="text-gray-400 text-lg">Loading...</p>
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-400 text-lg">No data</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.contract_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.customer_display_name || contract.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {(() => {
                          if (!contract.assignee) return <span className="text-gray-500">-</span>;
                          const employee = getEmployeeByName(contract.assignee);
                          return employee ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                {getInitials(employee.employee_name)}
                              </div>
                              <div>
                                <div className="text-gray-900 font-medium">{employee.employee_name}</div>
                                <div className="text-gray-500 text-xs">{employee.employee_role}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-900">{contract.assignee_display_name || contract.assignee}</span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.amc_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.amount ? `₹${contract.amount}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(contract.contract_start_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(contract.contract_end_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contract.auto_renew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.auto_renew ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(contract.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/amcs/edit/${contract.id}`}>
                            <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => setDeleteModal({show: true, contract})}
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
      {deleteModal.show && deleteModal.contract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Contract</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete contract <strong>{deleteModal.contract.contract_number}</strong>? 
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({show: false, contract: null})}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.contract!.id)}
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