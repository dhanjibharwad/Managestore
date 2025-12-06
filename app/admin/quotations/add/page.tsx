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

  const addPart = () => {
    const newPart: Part = {
      id: Date.now().toString(),
      description: '',
      taxCode: '',
      qty: 0,
      price: 0,
      disc: 0,
      tax: 0,
      taxAmt: 0,
      subTotal: 0,
      total: 0,
    };
    setParts([...parts, newPart]);
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
                  onClick={addPart}
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
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Part description"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm">0</td>
                        <td className="px-4 py-2 text-sm">0.00</td>
                        <td className="px-4 py-2 text-sm">0.00</td>
                        <td className="px-4 py-2 text-sm">0.00</td>
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
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
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
    </div>
  );
}