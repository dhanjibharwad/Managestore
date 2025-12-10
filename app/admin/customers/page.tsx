"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";

interface Customer {
  id: number;
  customer_id: string;
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
          
          <button className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            All Filters
          </button>
          <Link href="/admin/customers/add">
          <button className="cursor-pointer px-4 py-2 bg-[#4A70A9] text-white rounded-lg text-sm font-medium hover:bg-[#3d5c8a]">
            + Add
          </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    <button className="text-zinc-400 hover:text-zinc-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}