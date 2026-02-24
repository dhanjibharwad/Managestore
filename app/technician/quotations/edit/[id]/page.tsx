'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
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
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [companyServices, setCompanyServices] = useState<any[]>([]);
  const [quotationParts, setQuotationParts] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setQuotationId(resolvedParams.id);
      fetchUserSession();
      fetchQuotation(resolvedParams.id);
      fetchCustomers();
      fetchCompanyServices();
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (companyId) {
      fetchQuotationParts();
    }
  }, [companyId]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
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

  const fetchCompanyServices = async () => {
    try {
      const response = await fetch('/api/admin/services/all');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCompanyServices(data);
        }
      }
    } catch (error) {
      console.error('Error fetching company services:', error);
    }
  };

  const fetchQuotationParts = async () => {
    try {
      const response = await fetch(`/api/admin/quotations/parts?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.parts) {
          setQuotationParts(data.parts);
        }
      }
    } catch (error) {
      console.error('Error fetching quotation parts:', error);
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
          disc: parseFloat(s.disc) || 0,
          subTotal: parseFloat(s.price) - parseFloat(s.disc) || 0,
          taxCode: s.tax_code || '',
          tax: parseFloat(s.tax) || 0,
          taxAmt: parseFloat(s.total) * parseFloat(s.tax) / (100 + parseFloat(s.tax)) || 0,
          total: parseFloat(s.total) || 0,
          rateIncludingTax: s.rate_including_tax || false
        }));
        
        // Format parts
        const formattedParts = fetchedParts.map((p: any) => ({
          id: p.id.toString(),
          description: p.description,
          taxCode: p.tax_code || '',
          qty: parseInt(p.qty) || 0,
          price: parseFloat(p.price) || 0,
          disc: parseFloat(p.disc) || 0,
          tax: parseFloat(p.tax) || 0,
          taxAmt: parseFloat(p.total) * parseFloat(p.tax) / (100 + parseFloat(p.tax)) || 0,
          subTotal: (parseFloat(p.price) * parseInt(p.qty)) - parseFloat(p.disc) || 0,
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

  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        repairService: service.serviceName,
        description: service.description,
        price: service.price.toString(),
        discount: service.disc.toString(),
        subTotal: service.subTotal.toString(),
        tax: service.tax === 18 ? 'gst' : service.tax === 5 ? 'gst5' : '',
        taxAmount: service.taxAmt.toString(),
        taxCode: service.taxCode,
        totalAmount: service.total.toString(),
        rateIncludingTax: service.rateIncludingTax,
      });
    } else {
      setEditingService(null);
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
    }
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handleServiceFormChange = (field: string, value: any) => {
    if (field === 'repairService' && value) {
      const selectedService = companyServices.find(s => s.name === value);
      if (selectedService) {
        setServiceForm(prev => ({
          ...prev,
          repairService: selectedService.name,
          description: selectedService.description || '',
          price: selectedService.price?.toString() || ''
        }));
        return;
      }
    }
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

  const saveService = () => {
    if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
      showToast('Please enter a valid price', 'warning');
      return;
    }

    let taxRate = 0;
    if (serviceForm.tax === 'gst' || serviceForm.tax === 'igst') taxRate = 18;
    else if (serviceForm.tax === 'gst5') taxRate = 5;

    const serviceData: Service = {
      id: editingService?.id || Date.now().toString(),
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

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
    } else {
      setServices([...services, serviceData]);
    }
    closeServiceModal();
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const openPartModal = (part?: Part) => {
    if (part) {
      setEditingPart(part);
      setPartForm({
        part: '',
        partName: part.description,
        serialNumber: part.serialNumber || '',
        description: '',
        warranty: part.warranty || '',
        price: part.price.toString(),
        quantity: part.qty.toString(),
        rateIncludingTax: part.rateIncludingTax || false,
        discount: part.disc.toString(),
        subTotal: part.subTotal.toString(),
        tax: part.tax === 18 ? 'gst' : part.tax === 5 ? 'gst5' : '',
        taxAmount: part.taxAmt.toString(),
        taxCode: part.taxCode,
        totalAmount: part.total.toString(),
      });
    } else {
      setEditingPart(null);
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
    }
    setShowPartModal(true);
  };

  const closePartModal = () => {
    setShowPartModal(false);
    setEditingPart(null);
  };

  const handlePartFormChange = (field: string, value: any) => {
    if (field === 'part' && value) {
      const selectedPart = quotationParts.find(p => p.part_name === value);
      if (selectedPart) {
        setPartForm(prev => ({
          ...prev,
          part: selectedPart.part_name,
          partName: selectedPart.part_name,
          description: selectedPart.description || '',
          price: selectedPart.price?.toString() || '',
          warranty: selectedPart.warranty || '',
          taxCode: selectedPart.tax_code || ''
        }));
        return;
      }
    }
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

  const savePart = () => {
    let taxRate = 0;
    if (partForm.tax === 'gst' || partForm.tax === 'igst') taxRate = 18;
    else if (partForm.tax === 'gst5') taxRate = 5;

    const partData: Part = {
      id: editingPart?.id || Date.now().toString(),
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

    if (editingPart) {
      setParts(parts.map(p => p.id === editingPart.id ? partData : p));
    } else {
      setParts([...parts, partData]);
    }
    closePartModal();
  };

  const deletePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id));
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
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Repair Service</h2>
              <button
                onClick={() => openServiceModal()}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
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
                        <td className="px-4 py-2 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openServiceModal(service)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteService(service.id)}
                              className="text-red-600 hover:text-red-800"
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

          {/* Parts Table */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Parts</h2>
              <button
                onClick={() => openPartModal()}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
                style={{ borderColor: '#4A70A9', color: '#4A70A9' }}
              >
                <Plus className="w-4 h-4" />
                Add Part
              </button>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-gray-400">
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
                        <td className="px-4 py-2 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openPartModal(part)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePart(part.id)}
                              className="text-red-600 hover:text-red-800"
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

      {/* Add/Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={closeServiceModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
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
                    <option value="">Select repair service</option>
                    {companyServices.map(service => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter description (optional)"
                  value={serviceForm.description}
                  onChange={(e) => handleServiceFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <input
                    type="number"
                    placeholder="Discount"
                    value={serviceForm.discount}
                    onChange={(e) => handleServiceFormChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Total</label>
                  <input
                    type="text"
                    value={serviceForm.subTotal}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Amount</label>
                  <input
                    type="text"
                    value={serviceForm.taxAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Code</label>
                  <input
                    type="text"
                    placeholder="Ex: HSN code"
                    value={serviceForm.taxCode}
                    onChange={(e) => handleServiceFormChange('taxCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                <input
                  type="text"
                  value={serviceForm.totalAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
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
                {editingService ? 'Update Service' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Part Modal */}
      {showPartModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingPart ? 'Edit Part' : 'Add New Part'}
              </h2>
              <button onClick={closePartModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Part</label>
                <select
                  value={partForm.part}
                  onChange={(e) => handlePartFormChange('part', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Search and select existing part or create new below</option>
                  {quotationParts.map((part, index) => (
                    <option key={index} value={part.part_name}>
                      {part.part_name}
                    </option>
                  ))}
                </select>
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                  <input
                    type="text"
                    placeholder="Eg: C02CQ261MD6P"
                    value={partForm.serialNumber}
                    onChange={(e) => handlePartFormChange('serialNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter description (optional)"
                  value={partForm.description}
                  onChange={(e) => handlePartFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <input
                    type="number"
                    placeholder="Discount"
                    value={partForm.discount}
                    onChange={(e) => handlePartFormChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Total</label>
                  <input
                    type="text"
                    value={partForm.subTotal}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Amount</label>
                  <input
                    type="text"
                    value={partForm.taxAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Code</label>
                  <input
                    type="text"
                    placeholder="Eg: HSN code"
                    value={partForm.taxCode}
                    onChange={(e) => handlePartFormChange('taxCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                  <input
                    type="text"
                    value={partForm.totalAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
            </div>
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
                {editingPart ? 'Update Part' : 'Save Part'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}