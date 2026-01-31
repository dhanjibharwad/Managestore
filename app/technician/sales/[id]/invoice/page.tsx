"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Printer } from 'lucide-react';

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

interface Sale {
  id: number;
  sale_number: string;
  customer_name: string;
  sale_date: string;
  payment_status: string;
  grand_total: number;
  subtotal: number;
  total_tax: number;
  items: SaleItem[];
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  customer_tax_no?: string;
  company_name?: string;
}

export default function TechnicianSaleInvoice() {
  const params = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSaleDetails = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/sales/${params.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sale: ${response.status}`);
      }
      const data = await response.json();
      if (data.sale) {
        setSale(data.sale);
      } else {
        setError('Sale not found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load sale');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchSaleDetails();
    }
  }, [params.id, fetchSaleDetails]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading invoice...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Sale not found</div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      {/* Print Button - Hidden in print */}
      <div className="no-print fixed top-4 right-4 z-10">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Content */}
      <div className="invoice-container max-w-4xl mx-auto p-8 bg-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{sale.company_name || 'Company Name'}</h2>
            <h1 className="text-2xl font-bold text-gray-800">Tax Invoice {sale.sale_number}</h1>
          </div>
          <div className="text-right text-sm text-gray-600">
            {currentDate}
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-8">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
            <h2 className="font-semibold text-gray-800">Customer Details</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 p-4 border border-gray-300 border-t-0">
            <div>
              <div className="mb-2">
                <span className="font-medium">Name:</span> {sale.customer_name}
              </div>
              <div>
                <span className="font-medium">Tax No:</span> {sale.customer_tax_no || 'N/A'}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-medium">Phone:</span> {sale.customer_phone || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Address:</span> {sale.customer_address || 'N/A'}
              </div>
            </div>
            <div>
              <div>
                <span className="font-medium">Email:</span> {sale.customer_email || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Part Description Table */}
        <div className="mb-8">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Part Description</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Tax Code</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Qty</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Price</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Disc</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Tax</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Tax Amt</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Sub Total</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items && sale.items.length > 0 ? (
                sale.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="font-medium">{item.description}</div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{item.taxCode || ''}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.qty}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.disc.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {item.tax > 0 && (
                        <div className="text-xs">
                          <div>GST {item.tax}%</div>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{item.taxAmt.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.subTotal.toFixed(2)}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="border border-gray-300 px-3 py-8 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
              
              {/* Totals Row */}
              <tr className="bg-gray-50 font-medium">
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2">
                  {sale.items?.reduce((sum, item) => sum + item.qty, 0) || 0}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {sale.items?.reduce((sum, item) => sum + item.price, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {sale.items?.reduce((sum, item) => sum + item.disc, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2">
                  {sale.items?.reduce((sum, item) => sum + item.taxAmt, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {sale.items?.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {sale.items?.reduce((sum, item) => sum + item.total, 0).toFixed(2) || '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="w-80">
              <table className="w-full border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 bg-gray-100 font-medium">Total Amount</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹ {sale.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 bg-gray-100 font-medium">Total Tax Amount</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹ {sale.total_tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 bg-gray-100 font-medium">Grand Total</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-bold">₹ {sale.grand_total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
            <h2 className="font-semibold text-gray-800">Payment Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 p-4 border border-gray-300 border-t-0">
            <div>
              <div className="mb-2">
                <span className="font-medium">Payable Amount:</span> ₹ {sale.grand_total.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Payment Status:</span> 
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  sale.payment_status === 'partially-paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {sale.payment_status}
                </span>
              </div>
            </div>
            <div>
              <div>
                <span className="font-medium">Payment Received:</span> ₹ {(0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        {/* <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="border-2 border-blue-300 rounded h-32 mb-2"></div>
            <div className="text-center mt-2 font-medium">Customer Signature</div>
          </div>
          <div>
            <div className="border-2 border-blue-300 rounded h-32 mb-2"></div>
            <div className="text-center mt-2 font-medium">Employee Signature</div>
          </div>
        </div> */}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          
          .invoice-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 15mm !important;
            background: white !important;
            box-shadow: none !important;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          table {
            border-collapse: collapse !important;
          }
          
          .bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          .bg-gray-50 {
            background-color: #f9fafb !important;
          }
        }
      `}</style>
    </>
  );
}