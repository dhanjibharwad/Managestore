'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
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
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
  email_id: string;
}

export default function EditSalePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [saleId, setSaleId] = useState('');
  const [saleNumber, setSaleNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [termsConditions, setTermsConditions] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingItem, setEditingItem] = useState<SaleItem | null>(null);

  const [partName, setPartName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [discount, setDiscount] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [tax, setTax] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSaleId(resolvedParams.id);
      fetchSale(resolvedParams.id);
      fetchCustomers();
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (showAddPartModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddPartModal]);

  useEffect(() => {
    const priceNum = parseFloat(price) || 0;
    const qtyNum = parseFloat(quantity) || 0;
    const discNum = parseFloat(discount) || 0;
    const calculatedSubTotal = (priceNum * qtyNum) - discNum;
    setSubTotal(calculatedSubTotal.toFixed(2));
    
    let taxRate = 0;
    if (tax === '18') taxRate = 18;
    else if (tax === '12') taxRate = 12;
    else if (tax === '5') taxRate = 5;
    
    const calculatedTaxAmount = (calculatedSubTotal * taxRate) / 100;
    setTaxAmount(calculatedTaxAmount.toFixed(2));
    const calculatedTotal = calculatedSubTotal + calculatedTaxAmount;
    setTotalAmount(calculatedTotal.toFixed(2));
  }, [price, quantity, discount, tax]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: crypto.randomUUID(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: string) => {
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

  const fetchSale = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/sales/${id}`);
      const data = await response.json();
      if (response.ok && data.sale) {
        const sale = data.sale;
        setSaleNumber(sale.sale_number);
        setCustomerName(sale.customer_name);
        setSaleDate(sale.sale_date ? sale.sale_date.split('T')[0] : '');
        setPaymentStatus(sale.payment_status || 'unpaid');
        setTermsConditions(sale.terms_conditions || '');
        setItems(sale.items || []);
      } else {
        showToast('Failed to load sale', 'error');
      }
    } catch (error) {
      console.error('Error fetching sale:', error);
      showToast('Failed to load sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openPartModal = (item?: SaleItem) => {
    if (item) {
      setEditingItem(item);
      setPartName(item.description);
      setPrice(item.price.toString());
      setQuantity(item.qty.toString());
      setDiscount(item.disc.toString());
      setTax(item.tax.toString());
      setTaxCode(item.taxCode);
    } else {
      setEditingItem(null);
      resetForm();
    }
    setShowAddPartModal(true);
  };

  const resetForm = () => {
    setPartName('');
    setPrice('');
    setQuantity('1');
    setDiscount('');
    setSubTotal('');
    setTax('');
    setTaxAmount('');
    setTaxCode('');
    setTotalAmount('');
  };

  const handleSavePart = () => {
    if (!partName || !price) {
      showToast('Part name and price are required', 'warning');
      return;
    }

    const itemData: SaleItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      description: partName,
      taxCode: taxCode,
      qty: parseFloat(quantity) || 0,
      price: parseFloat(price) || 0,
      disc: parseFloat(discount) || 0,
      tax: parseFloat(tax) || 0,
      taxAmt: parseFloat(taxAmount) || 0,
      subTotal: parseFloat(subTotal) || 0,
      total: parseFloat(totalAmount) || 0
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? itemData : i));
    } else {
      setItems([...items, itemData]);
    }
    handleCloseModal();
    showToast('Item saved', 'success');
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    showToast('Item removed', 'success');
  };

  const handleCloseModal = () => {
    setShowAddPartModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleSubmitSale = async () => {
    if (!customerName || !saleDate || items.length === 0) {
      showToast('Please fill required fields and add at least one item', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/sales/${saleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          saleDate,
          paymentStatus,
          termsConditions: termsConditions || null,
          items
        })
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Sale updated successfully!', 'success');
        setTimeout(() => router.push('/technician/sales'), 2000);
      } else {
        showToast(data.error || 'Failed to update sale', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('An error occurred while updating the sale', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotals = () => {
    return items.reduce((acc, item) => ({
      qty: acc.qty + item.qty,
      disc: acc.disc + item.disc,
      taxAmt: acc.taxAmt + item.taxAmt,
      subTotal: acc.subTotal + item.subTotal,
      total: acc.total + item.total
    }), { qty: 0, disc: 0, taxAmt: 0, subTotal: 0, total: 0 });
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2">
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
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Sale : <span className="text-gray-600">{saleNumber}</span>
          </h1>
          <div className="flex gap-3">
            <button onClick={() => router.push('/technician/sales')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmitSale} disabled={submitting} className="px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] disabled:opacity-50">
              {submitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <select value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] bg-white">
                  <option value="">Select customer</option>
                  {customers.map(cust => (
                    <option key={cust.id} value={cust.id}>
                      {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Date</label>
                <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] bg-white">
                  <option value="paid">Paid</option>
                  <option value="partially-paid">Partially Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sale Items</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">Part</h3>
              <button onClick={() => openPartModal()} className="flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded hover:bg-blue-50">
                <Plus size={18} />
                <span>Add Part</span>
              </button>
            </div>

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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-gray-400">No data</td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.taxCode}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.qty}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.disc.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.tax}%</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.taxAmt.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.subTotal.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200">{item.total.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          <div className="flex gap-2">
                            <button onClick={() => openPartModal(item)} className="text-blue-600 hover:text-blue-800">Edit</button>
                            <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
          <div className="border-t border-gray-200 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
              <textarea value={termsConditions} onChange={(e) => setTermsConditions(e.target.value)} placeholder="Type text here" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] resize-none" rows={4} />
            </div>
          </div>
        </div>
      </div>

      {showAddPartModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{editingItem ? 'Edit Part' : 'Add New Part'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Part Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Eg: RAM, HDD" value={partName} onChange={(e) => setPartName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter price" value={price} onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
                  <input type="text" value={quantity} onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setQuantity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <input type="text" placeholder="Discount" value={discount} onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setDiscount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Total</label>
                  <input type="text" value={subTotal} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
                  <select value={tax} onChange={(e) => setTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select tax</option>
                    <option value="18">GST 18%</option>
                    <option value="12">GST 12%</option>
                    <option value="5">GST 5%</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Amount</label>
                  <input type="text" value={taxAmount} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Code</label>
                  <input type="text" placeholder="Eg: HSN code" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                <input type="text" value={totalAmount} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" readOnly />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={handleCloseModal} className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Cancel</button>
              <button onClick={handleSavePart} className="flex-1 px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f]">{editingItem ? 'Update Part' : 'Save Part'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
