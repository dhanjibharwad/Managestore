'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Scan, X } from 'lucide-react';

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
}

export default function QuotationPage() {
  const [quotationNumber] = useState('QT25-1');
  const [customerName, setCustomerName] = useState('');
  const [expiredOn, setExpiredOn] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [note, setNote] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  
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

  const handlePartFormChange = (field: string, value: any) => {
    setPartForm(prev => ({ ...prev, [field]: value }));
  };

  const saveService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      serviceName: serviceForm.repairService,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price) || 0,
      disc: parseFloat(serviceForm.discount) || 0,
      subTotal: parseFloat(serviceForm.subTotal) || 0,
      taxCode: serviceForm.taxCode,
      tax: parseFloat(serviceForm.tax) || 0,
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
    const newPart: Part = {
      id: Date.now().toString(),
      description: partForm.partName || partForm.part,
      taxCode: partForm.taxCode,
      qty: parseFloat(partForm.quantity) || 0,
      price: parseFloat(partForm.price) || 0,
      disc: parseFloat(partForm.discount) || 0,
      tax: parseFloat(partForm.tax) || 0,
      taxAmt: parseFloat(partForm.taxAmount) || 0,
      subTotal: parseFloat(partForm.subTotal) || 0,
      total: parseFloat(partForm.totalAmount) || 0,
    };
    setParts([...parts, newPart]);
    closePartModal();
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
    <div className="bg-gray-50 p-6">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Quotation : {quotationNumber}
          </h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 text-white rounded" style={{ backgroundColor: '#4A70A9' }}>
              Create
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, mobile, email"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onFocus={() => setShowCustomerSearch(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white rounded"
                  style={{ backgroundColor: '#4A70A9' }}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expired On
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select expiry date"
                  value={expiredOn}
                  onChange={(e) => setExpiredOn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Repair Service Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Repair Service</h2>
              <button
                onClick={openServiceModal}
                className="flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
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
                <button
                  className="flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
                  style={{ borderColor: '#4A70A9', color: '#4A70A9' }}
                >
                  <Scan className="w-4 h-4" />
                  Scan Part
                </button>
                <button
                  onClick={openPartModal}
                  className="flex items-center gap-2 px-4 py-2 border-2 rounded text-sm font-medium"
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>Normal text</option>
                </select>
                <div className="flex gap-1 border-l border-gray-300 pl-2">
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
                </div>
                <div className="flex gap-1 border-l border-gray-300 pl-2">
                  <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                  <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                  <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                  <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                </div>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Price and Discount */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={serviceForm.price}
                    onChange={(e) => handleServiceFormChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select tax</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select tax</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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