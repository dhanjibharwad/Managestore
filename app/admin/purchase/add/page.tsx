'use client';

import React, { useState } from 'react';
import { Plus, X, Calendar, Upload, Info } from 'lucide-react';
import Link from 'next/link';

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
}

export default function PurchasePage() {
  const [supplierName, setSupplierName] = useState('');
  const [partyInvoiceNumber, setPartyInvoiceNumber] = useState('IN-1001');
  const [purchaseDate, setPurchaseDate] = useState('06-Dec-2025');
  const [dueDate, setDueDate] = useState('11-Dec-2025 04:21 PM');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amount, setAmount] = useState('');
  const [terms, setTerms] = useState('');
  const [parts, setParts] = useState<Part[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Modal form state
  const [modalPart, setModalPart] = useState('');
  const [modalPartName, setModalPartName] = useState('');
  const [modalWarranty, setModalWarranty] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalRateIncludingTax, setModalRateIncludingTax] = useState(false);
  const [modalQuantity, setModalQuantity] = useState('1');
  const [modalDiscount, setModalDiscount] = useState('');
  const [modalSubTotal, setModalSubTotal] = useState('');
  const [modalTax, setModalTax] = useState('');
  const [modalTaxAmount, setModalTaxAmount] = useState('');
  const [modalTaxCode, setModalTaxCode] = useState('');
  const [modalTotalAmount, setModalTotalAmount] = useState('');

  const handleAddPart = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form
    setModalPart('');
    setModalPartName('');
    setModalWarranty('');
    setModalDescription('');
    setModalPrice('');
    setModalRateIncludingTax(false);
    setModalQuantity('1');
    setModalDiscount('');
    setModalSubTotal('');
    setModalTax('');
    setModalTaxAmount('');
    setModalTaxCode('');
    setModalTotalAmount('');
  };

  const handleSavePart = () => {
    const newPart: Part = {
      id: Date.now().toString(),
      description: modalPartName || modalDescription,
      taxCode: modalTaxCode,
      qty: parseFloat(modalQuantity) || 0,
      price: parseFloat(modalPrice) || 0,
      disc: parseFloat(modalDiscount) || 0,
      tax: parseFloat(modalTax) || 0,
      taxAmt: parseFloat(modalTaxAmount) || 0,
      subTotal: parseFloat(modalSubTotal) || 0,
      total: parseFloat(modalTotalAmount) || 0,
    };
    setParts([...parts, newPart]);
    handleCloseModal();
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
  };

  const calculateTotals = () => {
    return parts.reduce(
      (acc, part) => ({
        subTotal: acc.subTotal + part.subTotal,
        disc: acc.disc + part.disc,
        taxAmt: acc.taxAmt + part.taxAmt,
        total: acc.total + part.total,
      }),
      { subTotal: 0, disc: 0, taxAmt: 0, total: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Purchase : PI25-1</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors">
              Create
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Top Fields Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Part Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Supplier Name <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Select or create supplier"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
                <Link href="/admin/inventory/partSuppliers/add">
                <button className="px-3 py-3 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors">
                  <Plus size={20} />
                </button>
                </Link>
              </div>
              {/* <p className="text-xs text-red-500 mt-1">Part suppliers a required field</p> */}
            </div>

            {/* Party Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party Invoice Number
              </label>
              <input
                type="text"
                value={partyInvoiceNumber}
                onChange={(e) => setPartyInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>
          </div>

          {/* Parts Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Parts</h2>
              <button
                onClick={handleAddPart}
                className="flex items-center gap-2 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded hover:bg-[#4A70A9] hover:text-white transition-colors"
              >
                <Plus size={18} />
                Add Part
              </button>
            </div>

            {/* Parts Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Part Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tax Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Disc</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tax</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tax Amt</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sub Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                        No data
                      </td>
                    </tr>
                  ) : (
                    parts.map((part) => (
                      <tr key={part.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{part.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.taxCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.qty}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.disc.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.tax.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.taxAmt.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.subTotal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{part.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRemovePart(part.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={3}></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{totals.subTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{totals.disc.toFixed(2)}</td>
                    <td></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{totals.taxAmt.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{totals.subTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{totals.total.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Status and Mode */}
          <div className="mb-6">
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
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
                  value="unpaid"
                  checked={paymentStatus === 'unpaid'}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-4 h-4 text-[#4A70A9] focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">Unpaid</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions
            </label>
            <div className="border border-gray-300 rounded">
              <div className="border-b border-gray-300 px-3 py-2 flex items-center gap-2 bg-gray-50">
                <button className="text-gray-600 hover:text-gray-800 p-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 2h10v2H3z" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2h12v2H2z" />
                  </svg>
                </button>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>Normal text</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="flex gap-1 ml-2">
                  <button className="p-1 text-gray-600 hover:text-gray-800 font-bold">B</button>
                  <button className="p-1 text-gray-600 hover:text-gray-800 italic">I</button>
                  <button className="p-1 text-gray-600 hover:text-gray-800 line-through">S</button>
                  <button className="p-1 text-gray-600 hover:text-gray-800 underline">U</button>
                </div>
                <div className="flex gap-1 ml-2">
                  <button className="p-1 text-gray-600 hover:text-gray-800">≡</button>
                  <button className="p-1 text-gray-600 hover:text-gray-800">≡</button>
                  <button className="p-1 text-gray-600 hover:text-gray-800">≡</button>
                  <button className="p-1 text-gray-600 hover:text-gray-800">≡</button>
                </div>
              </div>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Type text here"
                rows={4}
                className="w-full px-3 py-2 focus:outline-none resize-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
          </div>

          {/* Upload Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Images</h3>
            <div className="border-2 border-dashed border-[#4A70A9] rounded-lg p-12 text-center hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#4A70A9] rounded-full flex items-center justify-center mb-4">
                  <Upload className="text-white" size={24} />
                </div>
                <p className="text-[#4A70A9] font-medium mb-1">
                  Take A Photo With Your Camera Or Choose A File From Your Device
                </p>
                <p className="text-sm text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Part Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Add New Part</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              {/* Part Select/Create */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Part</label>
                <select
                  value={modalPart}
                  onChange={(e) => setModalPart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option value="">Search and select existing part or create new below</option>
                </select>
              </div>

              {/* OR Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Part Name and Warranty */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalPartName}
                    onChange={(e) => setModalPartName(e.target.value)}
                    placeholder="Eg: RAM, HDD"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                  <input
                    type="text"
                    value={modalWarranty}
                    onChange={(e) => setModalWarranty(e.target.value)}
                    placeholder="Type warranty"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Enter description (optional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent resize-none"
                />
              </div>

              {/* Price and Rate Including Tax */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalRateIncludingTax}
                      onChange={(e) => setModalRateIncludingTax(e.target.checked)}
                      className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                    />
                    <span className="text-sm text-gray-700">Rate Including Tax</span>
                  </label>
                </div>
              </div>

              {/* Quantity and Discount */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={modalQuantity}
                    onChange={(e) => setModalQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <input
                    type="text"
                    value={modalDiscount}
                    onChange={(e) => setModalDiscount(e.target.value)}
                    placeholder="Discount"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sub Total and Tax */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Sub Total
                    <Info size={14} className="text-gray-400" />
                  </label>
                  <input
                    type="text"
                    value={modalSubTotal}
                    onChange={(e) => setModalSubTotal(e.target.value)}
                    placeholder="Sub total"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
                  <select
                    value={modalTax}
                    onChange={(e) => setModalTax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select tax</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              {/* Tax Amount and Tax Code */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    Tax Amount
                    <Info size={14} className="text-gray-400" />
                  </label>
                  <input
                    type="text"
                    value={modalTaxAmount}
                    onChange={(e) => setModalTaxAmount(e.target.value)}
                    placeholder="Tax amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Code</label>
                  <input
                    type="text"
                    value={modalTaxCode}
                    onChange={(e) => setModalTaxCode(e.target.value)}
                    placeholder="Eg: HSN code"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Total Amount
                  <Info size={14} className="text-gray-400" />
                </label>
                <input
                  type="text"
                  value={modalTotalAmount}
                  onChange={(e) => setModalTotalAmount(e.target.value)}
                  placeholder="Total amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  readOnly
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePart}
                className="flex-1 px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors"
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