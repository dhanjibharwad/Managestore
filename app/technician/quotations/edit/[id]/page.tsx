'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
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

export default function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const [quotationId, setQuotationId] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [expiredOn, setExpiredOn] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [note, setNote] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setQuotationId(resolvedParams.id);
      fetchQuotation(resolvedParams.id);
      fetchCustomers();
    };
    getParams();
  }, [params]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
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

  const fetchQuotation = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/quotations/${id}`);
      const data = await response.json();
      if (response.ok) {
        const { quotation, services: fetchedServices, parts: fetchedParts } = data;
        
        setQuotationNumber(quotation.quotation_number);
        setCustomerName(quotation.customer_name);
        setExpiredOn(quotation.expired_on ? quotation.expired_on.split('T')[0] : '');
        setNote(quotation.note || '');
        setTermsConditions(quotation.terms_conditions || '');
        
        // Format services
        const formattedServices = fetchedServices.map((s: any) => ({
          id: s.id.toString(),
          serviceName: s.service_name,
          description: s.description || '',
          price: parseFloat(s.price) || 0,
          disc: parseFloat(s.discount) || 0,
          subTotal: parseFloat(s.subtotal) || 0,
          taxCode: s.tax_code || '',
          tax: parseFloat(s.tax_rate) || 0,
          taxAmt: parseFloat(s.tax_amount) || 0,
          total: parseFloat(s.total) || 0,
          rateIncludingTax: s.rate_including_tax || false
        }));
        
        // Format parts
        const formattedParts = fetchedParts.map((p: any) => ({
          id: p.id.toString(),
          description: p.part_name || p.description,
          taxCode: p.tax_code || '',
          qty: parseInt(p.quantity) || 0,
          price: parseFloat(p.price) || 0,
          disc: parseFloat(p.discount) || 0,
          tax: parseFloat(p.tax_rate) || 0,
          taxAmt: parseFloat(p.tax_amount) || 0,
          subTotal: parseFloat(p.subtotal) || 0,
          total: parseFloat(p.total) || 0,
          serialNumber: p.serial_number || '',
          warranty: p.warranty || '',
          rateIncludingTax: p.rate_including_tax || false
        }));
        
        setServices(formattedServices);
        setParts(formattedParts);
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      showToast('Failed to load quotation', 'error');
    } finally {
      setLoading(false);
    }
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

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/quotations/${quotationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          expiredOn: expiredOn || null,
          note: note || null,
          termsConditions: termsConditions || null,
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
      if (response.ok) {
        showToast('Quotation updated successfully!', 'success');
        setTimeout(() => window.location.href = '/technician/quotations', 2000);
      } else {
        showToast(data.error || 'Failed to update quotation', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('An error occurred while updating the quotation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateServiceTotals = () => {
    return services.reduce(
      (acc, service) => ({
        price: acc.price + service.price,
        disc: acc.disc + service.disc,
        subTotal: acc.subTotal + service.subTotal,
        taxAmt: acc.taxAmt + service.taxAmt,
        total: acc.total + service.total,
      }),
      { price: 0, disc: 0, subTotal: 0, taxAmt: 0, total: 0 }
    );
  };

  const calculatePartTotals = () => {
    return parts.reduce(
      (acc, part) => ({
        price: acc.price + part.price * part.qty,
        disc: acc.disc + part.disc,
        taxAmt: acc.taxAmt + part.taxAmt,
        subTotal: acc.subTotal + part.subTotal,
        total: acc.total + part.total,
      }),
      { price: 0, disc: 0, taxAmt: 0, subTotal: 0, total: 0 }
    );
  };

  const serviceTotals = calculateServiceTotals();
  const partTotals = calculatePartTotals();
  const grandTotal = serviceTotals.total + partTotals.total;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

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
            Edit Quotation : {quotationNumber}
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
              {submitting ? 'Updating...' : 'Update'}
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
              <select
                value={customerName}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
                disabled
              >
                <option value="">Select customer</option>
                {Array.isArray(customers) && customers.map(cust => (
                  <option key={cust.id} value={cust.id}>
                    {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                  </option>
                ))}
              </select>
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

          {/* Services Table */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Repair Service</h2>
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
                        No services added
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
              </table>
            </div>
          </div>

          {/* Parts Table */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Parts</h2>
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
                        No parts added
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
            <textarea
              placeholder="Type text here"
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}