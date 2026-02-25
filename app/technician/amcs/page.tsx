"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    fetchEmployees();
    const timeoutId = setTimeout(() => {
      fetchContracts();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
              <Link href="/technician/amcs/add">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-32 text-center">
                      <p className="text-gray-400 text-lg">Loading...</p>
                    </td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-32 text-center">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}