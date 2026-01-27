'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Scan, X, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  disc: number;
  subTotal: number;
  taxCode: string;
  tax: number;
  taxAmt: number;
  total: number;
  rateIncludingTax: boolean;
}

interface Part {
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
  serialNumber?: string;
  warranty?: string;
  rateIncludingTax?: boolean;
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

export default function QuotationPage() {
  const [quotationNumber, setQuotationNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [expiredOn, setExpiredOn] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [note, setNote] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('Admin');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);

  React.useEffect(() => {
    fetchUserSession();
    generateQuotationNumber();
    fetchCustomers();
  }, []);

  // Prevent background scroll when modals are open
  React.useEffect(() => {
    if (showServiceModal || showPartModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showServiceModal, showPartModal]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: nextToastId, message, type };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setCompanyId(data.user.companyId);
        setCurrentUser(data.user.name || data.user.email || 'Admin');
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

  const generateQuotationNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100);
    setQuotationNumber(`QT-${timestamp}-${random}`);
  };
  
  // Service modal form state
  const [serviceForm, setServiceForm] = useState({
    repairService: '',
    description: '',
    price: '',
    discount: '',
    subTotal: '',
    tax: '',
    taxAmount: '',
    taxCode: '',
    totalAmount: '',
    rateIncludingTax: false,
  });

  // Part modal form state
  const [partForm, setPartForm] = useState({
    part: '',
    partName: '',
    serialNumber: '',
    description: '',
    warranty: '',
    price: '',
    quantity: '1',
    rateIncludingTax: false,
    discount: '',
    subTotal: '',
    tax: '',
    taxAmount: '',
    taxCode: '',
    totalAmount: '',
  });

  const openServiceModal = () => {
    setShowServiceModal(true);
    setServiceForm({
      repairService: '',
      description: '',
      price: '',
      discount: '',
      subTotal: '',
      tax: '',
      taxAmount: '',
      taxCode: '',
      totalAmount: '',
      rateIncludingTax: false,
    });
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
  };

  const handleServiceFormChange = (field: string, value: any) => {
    setServiceForm(prev => ({ ...prev, [field]: value }));
  };

  // Auto-calculate service amounts
  React.useEffect(() => {
    const price = parseFloat(serviceForm.price) || 0;
    const disc = parseFloat(serviceForm.discount) || 0;
    
    let taxRate = 0;
    if (serviceForm.tax === 'gst' || serviceForm.tax === 'igst') taxRate = 18;
    else if (serviceForm.tax === 'gst5') taxRate = 5;

    const subTotal = price - disc;
    const taxAmount = (subTotal * taxRate) / 100;
    const total = subTotal + taxAmount;

    setServiceForm(prev => ({
      ...prev,
      subTotal: subTotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: total.toFixed(2)
    }));
  }, [serviceForm.price, serviceForm.discount, serviceForm.tax]);

  const handlePartFormChange = (field: string, value: any) => {
    setPartForm(prev => ({ ...prev, [field]: value }));
  };

  // Auto-calculate part amounts
  React.useEffect(() => {
    const price = parseFloat(partForm.price) || 0;
    const qty = parseFloat(partForm.quantity) || 0;
    const disc = parseFloat(partForm.discount) || 0;
    
    let taxRate = 0;
    if (partForm.tax === 'gst' || partForm.tax === 'igst') taxRate = 18;
    else if (partForm.tax === 'gst5') taxRate = 5;

    const subTotal = (price * qty) - disc;
    const taxAmount = (subTotal * taxRate) / 100;
    const total = subTotal + taxAmount;

    setPartForm(prev => ({
      ...prev,
      subTotal: subTotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: total.toFixed(2)
    }));
  }, [partForm.price, partForm.quantity, partForm.discount, partForm.tax]);

  const saveService = () => {
    if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
      showToast('Please enter a valid price', 'warning');
      return;
    }

    let taxRate = 0;
    if (serviceForm.tax === 'gst' || serviceForm.tax === 'igst') taxRate = 18;
    else if (serviceForm.tax === 'gst5') taxRate = 5;

    const newService: Service = {
      id: Date.now().toString(),
      serviceName: serviceForm.repairService,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price) || 0,
      disc: parseFloat(serviceForm.discount) || 0,
      subTotal: parseFloat(serviceForm.subTotal) || 0,
      taxCode: serviceForm.taxCode,
      tax: taxRate,
      taxAmt: parseFloat(serviceForm.taxAmount) || 0,
      total: parseFloat(serviceForm.totalAmount) || 0,
      rateIncludingTax: serviceForm.rateIncludingTax,
    };
    setServices([...services, newService]);
    closeServiceModal();
  };

  const openPartModal = () => {
    setShowPartModal(true);
    setPartForm({
      part: '',
      partName: '',
      serialNumber: '',
      description: '',
      warranty: '',
      price: '',
      quantity: '1',
      rateIncludingTax: false,
      discount: '',
      subTotal: '',
      tax: '',
      taxAmount: '',
      taxCode: '',
      totalAmount: '',
    });
  };

  const closePartModal = () => {
    setShowPartModal(false);
  };

  const savePart = () => {
    let taxRate = 0;
    if (partForm.tax === 'gst' || partForm.tax === 'igst') taxRate = 18;
    else if (partForm.tax === 'gst5') taxRate = 5;

    const newPart: Part = {
      id: Date.now().toString(),
      description: partForm.partName || partForm.part,
      taxCode: partForm.taxCode,
      qty: parseFloat(partForm.quantity) || 0,
      price: parseFloat(partForm.price) || 0,
      disc: parseFloat(partForm.discount) || 0,
      tax: taxRate,
      taxAmt: parseFloat(partForm.taxAmount) || 0,
      subTotal: parseFloat(partForm.subTotal) || 0,
      total: parseFloat(partForm.totalAmount) || 0,
      serialNumber: partForm.serialNumber,
      warranty: partForm.warranty,
      rateIncludingTax: partForm.rateIncludingTax
    };
    setParts([...parts, newPart]);
    closePartModal();
  };

  const handleSubmitQuotation = async () => {
    if (!customerName) {
      showToast('Please enter customer name', 'warning');
      return;
    }

    if (services.length === 0 && parts.length === 0) {
      showToast('Please add at least one service or part', 'warning');
      return;
    }

    if (!companyId) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          quotationNumber,
          customerName,
          expiredOn: expiredOn || null,
          note: note || null,
          termsConditions: termsConditions || null,
          createdBy: currentUser,
          services: services.map(s => ({
            serviceName: s.serviceName,
            description: s.description,
            price: s.price,
            disc: s.disc,
            taxCode: s.taxCode,
            tax: s.tax,
            rateIncludingTax: s.rateIncludingTax,
            total: s.total
          })),
          parts: parts.map(p => ({
            description: p.description,
            serialNumber: p.serialNumber,
            warranty: p.warranty,
            taxCode: p.taxCode,
            qty: p.qty,
            price: p.price,
            disc: p.disc,
            tax: p.tax,
            rateIncludingTax: p.rateIncludingTax,
            total: p.total
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Quotation created successfully!', 'success');
        setTimeout(() => window.location.href = '/admin/quotations', 2000);
      } else {
        showToast(data.error || 'Failed to create quotation', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('An error occurred while creating the quotation', 'error');
    } finally {
      setSubmitting(false);
    }
  };



  const calculateServiceTotals = () => {
    const totals = services.reduce(
      (acc, service) => ({
        price: acc.price + service.price,
        disc: acc.disc + service.disc,
        subTotal: acc.subTotal + service.subTotal,
        taxAmt: acc.taxAmt + service.taxAmt,
        total: acc.total + service.total,
      }),
      { price: 0, disc: 0, subTotal: 0, taxAmt: 0, total: 0 }
    );
    return totals;
  };

  const calculatePartTotals = () => {
    const totals = parts.reduce(
      (acc, part) => ({
        price: acc.price + part.price * part.qty,
        disc: acc.disc + part.disc,
        taxAmt: acc.taxAmt + part.taxAmt,
        subTotal: acc.subTotal + part.subTotal,
        total: acc.total + part.total,
      }),
      { price: 0, disc: 0, taxAmt: 0, subTotal: 0, total: 0 }
    );
    return totals;
  };

  const serviceTotals = calculateServiceTotals();
  const partTotals = calculatePartTotals();
  const grandTotal = serviceTotals.total + partTotals.total;

  return (
    <div className="bg-gray-50">
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

      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Quotation : {quotationNumber}
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitQuotation}
              disabled={submitting}
              className="px-4 py-2 text-white rounded disabled:opacity-50" 
              style={{ backgroundColor: '#4A70A9' }}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Customer Info Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select customer</option>
                  {Array.isArray(customers) && customers.map(cust => (
                    <option key={cust.id} value={cust.id}>
                      {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                    </option>
                  ))}
                </select>
                <Link href="/admin/customers/add">
                  <button 
                    className="p-3 text-white rounded hover:opacity-90"
                    style={{ backgroundColor: '#4A70A9' }}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expired On
              </label>
              <input
                type="date"
                value={expiredOn}
                onChange={(e) => setExpiredOn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Repair Service Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Repair Service</h2>
              <button
                onClick={openServiceModal}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
                style={{ borderColor: '#4A70A9', color: '#4A70A9' }}
              >
                <Plus className="w-4 h-4" />
                Add Services
              </button>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Service Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Disc</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Sub Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tax Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tax</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tax Amt</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        No data
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm">{service.serviceName}</td>
                        <td className="px-4 py-2 text-sm">{service.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{service.disc.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{service.subTotal.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{service.taxCode}</td>
                        <td className="px-4 py-2 text-sm">{service.tax}</td>
                        <td className="px-4 py-2 text-sm">{service.taxAmt.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{service.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {serviceTotals.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {serviceTotals.disc.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {serviceTotals.subTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {serviceTotals.taxAmt.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {serviceTotals.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Parts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Parts</h2>
              <div className="flex gap-3">
                {/* <button
                  className="flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
                  style={{ borderColor: '#4A70A9', color: '#4A70A9' }}
                >
                  <Scan className="w-4 h-4" />
                  Scan Part
                </button> */}
                <button
                  onClick={openPartModal}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
                  style={{ borderColor: '#4A70A9', color: '#4A70A9' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Part
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Part Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tax Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Disc</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tax</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tax Amt</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Sub Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        No data
                      </td>
                    </tr>
                  ) : (
                    parts.map((part) => (
                      <tr key={part.id} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm">{part.description}</td>
                        <td className="px-4 py-2 text-sm">{part.taxCode}</td>
                        <td className="px-4 py-2 text-sm">{part.qty}</td>
                        <td className="px-4 py-2 text-sm">{part.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{part.disc.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{part.tax}</td>
                        <td className="px-4 py-2 text-sm">{part.taxAmt.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{part.subTotal.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{part.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {partTotals.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {partTotals.disc.toFixed(2)}
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {partTotals.taxAmt.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {partTotals.subTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {partTotals.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end mt-4">
              <div className="w-80 border border-gray-200 rounded">
                <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Total Amount</span>
                  <span className="text-sm font-medium">₹ {grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-800">Grand Total</span>
                  <span className="text-sm font-semibold">₹ {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              placeholder="Enter any note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Terms and Conditions Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions
            </label>
            <div className="border border-gray-300 rounded">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300 bg-gray-50">
                <div className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>Normal text</option>
                </div>
                {/* <div className="flex gap-1 border-l border-gray-300 pl-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <span className="font-bold text-sm">B</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <span className="italic text-sm">I</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <span className="text-sm line-through">S</span>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <span className="text-sm underline">U</span>
                  </button>
                </div> */}
                {/* <div className="flex gap-1 border-l border-gray-300 pl-2">
                  <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                </div> */}
              </div>
              <textarea
                placeholder="Type text here"
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                className="w-full px-3 py-2 focus:outline-none resize-none"
                rows={4}
              />
              <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-300">
                Max Allowed Characters 50000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add New Service</h2>
              <button
                onClick={closeServiceModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Repair Service */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repair Service <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <select
                    value={serviceForm.repairService}
                    onChange={(e) => handleServiceFormChange('repairService', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Eg: virus or malware attack, broken di...</option>
                    <option value="Virus Removal">Virus Removal</option>
                    <option value="Screen Repair">Screen Repair</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={serviceForm.rateIncludingTax}
                      onChange={(e) => handleServiceFormChange('rateIncludingTax', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Rate Including Tax
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter description (optional)"
                  value={serviceForm.description}
                  onChange={(e) => handleServiceFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Price and Discount */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={serviceForm.price}
                    onChange={(e) => handleServiceFormChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount
                  </label>
                  <input
                    type="number"
                    placeholder="Discount"
                    value={serviceForm.discount}
                    onChange={(e) => handleServiceFormChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Sub Total and Tax */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Sub Total
                    <span className="text-gray-400 text-xs">(i)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Sub total"
                    value={serviceForm.subTotal}
                    onChange={(e) => handleServiceFormChange('subTotal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax
                  </label>
                  <select
                    value={serviceForm.tax}
                    onChange={(e) => handleServiceFormChange('tax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select tax</option>
                    <option value="gst5">GST 5%</option>
                    <option value="gst">GST 18%</option>
                    <option value="igst">IGST 18%</option>
                  </select>
                </div>
              </div>

              {/* Tax Amount and Tax Code */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Tax Amount
                    <span className="text-gray-400 text-xs">(i)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tax amount"
                    value={serviceForm.taxAmount}
                    onChange={(e) => handleServiceFormChange('taxAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Code
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: HSN code"
                    value={serviceForm.taxCode}
                    onChange={(e) => handleServiceFormChange('taxCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Total Amount
                  <span className="text-gray-400 text-xs">(i)</span>
                </label>
                <input
                  type="text"
                  placeholder="Total amount"
                  value={serviceForm.totalAmount}
                  onChange={(e) => handleServiceFormChange('totalAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeServiceModal}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="flex-1 px-4 py-2 text-white rounded"
                style={{ backgroundColor: '#4A70A9' }}
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Part Modal */}
      {showPartModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add New Part</h2>
              <button
                onClick={closePartModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Part Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part
                </label>
                <select
                  value={partForm.part}
                  onChange={(e) => handlePartFormChange('part', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Search and select existing part or create new below</option>
                  <option value="RAM">RAM</option>
                  <option value="HDD">HDD</option>
                  <option value="SSD">SSD</option>
                </select>
              </div>

              {/* OR Divider */}
              <div className="relative mb-4">
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
                    value={partForm.partName}
                    onChange={(e) => handlePartFormChange('partName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: C02CQ261MD6P"
                    value={partForm.serialNumber}
                    onChange={(e) => handlePartFormChange('serialNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter description (optional)"
                  value={partForm.description}
                  onChange={(e) => handlePartFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
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
                    value={partForm.warranty}
                    onChange={(e) => handlePartFormChange('warranty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={partForm.price}
                    onChange={(e) => handlePartFormChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Rate Including Tax and Quantity */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={partForm.rateIncludingTax}
                      onChange={(e) => handlePartFormChange('rateIncludingTax', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Rate Including Tax
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={partForm.quantity}
                    onChange={(e) => handlePartFormChange('quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    type="number"
                    placeholder="Discount"
                    value={partForm.discount}
                    onChange={(e) => handlePartFormChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Sub Total
                    <span className="text-gray-400 text-xs">(i)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Sub total"
                    value={partForm.subTotal}
                    onChange={(e) => handlePartFormChange('subTotal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
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
                    value={partForm.tax}
                    onChange={(e) => handlePartFormChange('tax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select tax</option>
                    <option value="gst5">GST 5%</option>
                    <option value="gst">GST 18%</option>
                    <option value="igst">IGST 18%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Tax Amount
                    <span className="text-gray-400 text-xs">(i)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tax amount"
                    value={partForm.taxAmount}
                    onChange={(e) => handlePartFormChange('taxAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              {/* Tax Code and Total Amount */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Code
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: HSN code"
                    value={partForm.taxCode}
                    onChange={(e) => handlePartFormChange('taxCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Total Amount
                    <span className="text-gray-400 text-xs">(i)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Total amount"
                    value={partForm.totalAmount}
                    onChange={(e) => handlePartFormChange('totalAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closePartModal}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={savePart}
                className="flex-1 px-4 py-2 text-white rounded"
                style={{ backgroundColor: '#4A70A9' }}
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