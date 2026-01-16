"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface SaleItem {
  id: string;
  description: string;
  taxCode: string;
  qty: number;
  price: number;
  disc: number;
  tax: number;
  taxAmt: number;
  subTotal: number;
  total: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
  email_id: string;
  customer_type: string;
}

export default function SalesForm() {
  const router = useRouter();
  const [saleId, setSaleId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [termsConditions, setTermsConditions] = useState('');
  const [sendMail, setSendMail] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);

  React.useEffect(() => {
    fetchUserSession();
    generateSaleNumber();
    fetchCustomers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: nextToastId, message, type };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const generateSaleNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100);
    setSaleId(`SALE-${timestamp}-${random}`);
  };

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setCompanyId(data.user.companyId);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  // Add Part Form States
  const [partSearch, setPartSearch] = useState('');
  const [partName, setPartName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [warranty, setWarranty] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [rateIncludingTax, setRateIncludingTax] = useState(false);
  const [discount, setDiscount] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [tax, setTax] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // Auto-calculate amounts when price, quantity, discount, or tax changes
  React.useEffect(() => {
    const priceNum = parseFloat(price) || 0;
    const qtyNum = parseFloat(quantity) || 0;
    const discNum = parseFloat(discount) || 0;
    
    // Calculate subtotal: (price * quantity) - discount
    const calculatedSubTotal = (priceNum * qtyNum) - discNum;
    setSubTotal(calculatedSubTotal.toFixed(2));
    
    // Calculate tax amount based on selected tax
    let taxRate = 0;
    if (tax === '18') taxRate = 18;
    else if (tax === '12') taxRate = 12;
    else if (tax === '5') taxRate = 5;
    
    const calculatedTaxAmount = (calculatedSubTotal * taxRate) / 100;
    setTaxAmount(calculatedTaxAmount.toFixed(2));
    
    // Calculate total: subtotal + tax amount
    const calculatedTotal = calculatedSubTotal + calculatedTaxAmount;
    setTotalAmount(calculatedTotal.toFixed(2));
  }, [price, quantity, discount, tax]);

  const addItem = () => {
    setShowAddPartModal(true);
  };

  const handleSavePart = () => {
    const newItem: SaleItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: description || partName,
      taxCode: taxCode,
      qty: parseFloat(quantity) || 0,
      price: parseFloat(price) || 0,
      disc: parseFloat(discount) || 0,
      tax: parseFloat(tax) || 0,
      taxAmt: parseFloat(taxAmount) || 0,
      subTotal: parseFloat(subTotal) || 0,
      total: parseFloat(totalAmount) || 0
    };
    setItems([...items, newItem]);
    handleCloseModal();
  };

  const handleSubmitSale = async () => {
    if (!customerName || !saleDate || items.length === 0) {
      showToast('Please fill required fields and add at least one item', 'warning');
      return;
    }

    if (!companyId) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          saleNumber: saleId,
          customerName,
          saleDate,
          referredBy: referredBy || null,
          paymentStatus,
          termsConditions: termsConditions || null,
          sendMail,
          sendSms: false,
          items
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Sale created successfully!', 'success');
        setTimeout(() => window.location.href = '/technician/sales', 2000);
      } else {
        showToast(data.error || 'Failed to create sale', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('An error occurred while creating the sale', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddPartModal(false);
    // Reset form
    setPartSearch('');
    setPartName('');
    setSerialNumber('');
    setDescription('');
    setWarranty('');
    setPrice('');
    setQuantity('1');
    setRateIncludingTax(false);
    setDiscount('');
    setSubTotal('');
    setTax('');
    setTaxAmount('');
    setTaxCode('');
    setTotalAmount('');
  };

  const calculateTotals = () => {
    const totals = {
      qty: 0,
      disc: 0,
      taxAmt: 0,
      subTotal: 0,
      total: 0
    };
    
    items.forEach(item => {
      totals.qty += item.qty || 0;
      totals.disc += item.disc || 0;
      totals.taxAmt += item.taxAmt || 0;
      totals.subTotal += item.subTotal || 0;
      totals.total += item.total || 0;
    });
    
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-white p-2">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Sale : <span className="text-gray-600">{saleId}</span>
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/technician/sales')}
              className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitSale}
              disabled={submitting}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                  >
                    <option value="">Select customer</option>
                    {Array.isArray(customers) && customers.map(cust => (
                      <option key={cust.id} value={cust.id}>
                        {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                      </option>
                    ))}
                  </select>
                  <Link href="/admin/customers/add/">
                  <button className="p-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors">
                    <Plus size={20} />
                  </button>
                  </Link>
                </div>
              </div>

              {/* Sale Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Date
                </label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Referred By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referred By
                </label>
                <select
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select customer</option>
                  {Array.isArray(customers) && customers.map(cust => (
                    <option key={cust.id} value={cust.id}>
                      {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sale Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sale Items</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Part</h3>
                <div className="flex gap-2">
                  {/* <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-xl">📊</span>
                    <span>Add Part</span>
                  </button> */}
                  <button
                    onClick={addItem}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Part</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Part Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Tax Code</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Qty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Disc</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Tax</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Tax Amt</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Sub Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                          No data
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.taxCode}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.qty}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.disc.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.tax}%
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.taxAmt.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">
                            {item.subTotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                    {/* Totals Row */}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-medium">
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{totals.qty.toFixed(2)}</td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{totals.disc.toFixed(2)}</td>
                      <td className="px-4 py-3 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{totals.taxAmt.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{totals.subTotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{totals.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
          <div className="border-t border-gray-200 pt-4">
            {/* Payment Status Radio Buttons */}
            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="paid"
                  checked={paymentStatus === 'paid'}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">Paid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="partially-paid"
                  checked={paymentStatus === 'partially-paid'}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">Partially Paid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="unpaid"
                  checked={paymentStatus === 'unpaid'}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">Unpaid</span>
              </label>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms and Conditions
              </label>
              <div className="border border-gray-300 rounded">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300 bg-gray-50">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                  <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700">
                    <option>Normal text</option>
                  </select>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button className="p-1 hover:bg-gray-200 rounded font-bold text-gray-700">B</button>
                  <button className="p-1 hover:bg-gray-200 rounded italic text-gray-700">I</button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-700 line-through">S</button>
                  <button className="p-1 hover:bg-gray-200 rounded underline text-gray-700">U</button>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h8" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h8" />
                    </svg>
                  </button>
                </div>
                {/* Text Area */}
                <textarea
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Type text here"
                  className="w-full px-3 py-2 focus:outline-none resize-none text-sm text-gray-700"
                  rows={4}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</div>
            </div>

            {/* Send Alert */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send Alert
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendMail}
                    onChange={(e) => setSendMail(e.target.checked)}
                    className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9] rounded"
                  />
                  <span className="text-sm text-gray-700">Mail</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Part</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Part Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part
                </label>
                <select
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option value="">Search and select existing part or create new below</option>
                </select>
              </div>

              {/* OR Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Part Name and Serial Number */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: RAM, HDD"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: C02CQ261MD6P"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Warranty and Price */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    placeholder="Type warranty"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rate Including Tax and Quantity */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rateIncludingTax}
                      onChange={(e) => setRateIncludingTax(e.target.checked)}
                      className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9] rounded"
                    />
                    <span className="text-sm text-gray-700">Rate Including Tax</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Discount and Sub Total */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount
                  </label>
                  <input
                    type="text"
                    placeholder="Discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Sub Total
                    <span className="text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Sub total"
                    value={subTotal}
                    onChange={(e) => setSubTotal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Tax and Tax Amount */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax
                  </label>
                  <select
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select tax</option>
                    <option value="18">GST 18%</option>
                    <option value="12">GST 12%</option>
                    <option value="5">GST 5%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Tax Amount
                    <span className="text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tax amount"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Tax Code and Total Amount */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Code
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: HSN code"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Total Amount
                    <span className="text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Total amount"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePart}
                className="flex-1 px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors"
              >
                Save Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}