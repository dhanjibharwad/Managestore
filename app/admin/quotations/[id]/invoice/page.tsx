"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Printer } from 'lucide-react';

interface QuotationItem {
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

interface Quotation {
  id: number;
  quotation_number: string;
  customer_name: string;
  expired_on: string;
  total_amount: number;
  items: QuotationItem[];
  customer_phone?: string;
  customer_email?: string;
  note?: string;
  terms_conditions?: string;
  company_name?: string;
}

export default function QuotationInvoice() {
  const params = useParams();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotationDetails = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/quotations/${params.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quotation: ${response.status}`);
      }
      const data = await response.json();
      if (data.quotation) {
        const services = data.services?.map((s: any) => ({
          id: s.id.toString(),
          description: s.service_name,
          taxCode: s.tax_code || '',
          qty: 1,
          price: parseFloat(s.price) || 0,
          disc: parseFloat(s.discount) || 0,
          tax: parseFloat(s.tax_rate) || 0,
          taxAmt: parseFloat(s.tax_amount) || 0,
          subTotal: parseFloat(s.subtotal) || 0,
          total: parseFloat(s.total) || 0
        })) || [];
        
        const parts = data.parts?.map((p: any) => ({
          id: p.id.toString(),
          description: p.part_name || p.description,
          taxCode: p.tax_code || '',
          qty: parseInt(p.quantity) || 0,
          price: parseFloat(p.price) || 0,
          disc: parseFloat(p.discount) || 0,
          tax: parseFloat(p.tax_rate) || 0,
          taxAmt: parseFloat(p.tax_amount) || 0,
          subTotal: parseFloat(p.subtotal) || 0,
          total: parseFloat(p.total) || 0
        })) || [];

        setQuotation({
          ...data.quotation,
          total_amount: parseFloat(data.quotation.total_amount) || 0,
          company_name: data.quotation.company_name,
          items: [...services, ...parts]
        });
      } else {
        setError('Quotation not found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load quotation');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchQuotationDetails();
    }
  }, [params.id, fetchQuotationDetails]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading quotation...</div>
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

  if (!quotation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Quotation not found</div>
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
      <div className="invoice-container max-w-4xl mx-auto p-8 bg-white">
        <div className="no-print flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print Quotation
          </button>
        </div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{quotation.company_name || 'Company Name'}</h2>
            <h1 className="text-2xl font-bold text-gray-800">Quotation {quotation.quotation_number}</h1>
          </div>
          <div className="text-right text-sm text-gray-600">
            {currentDate}
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
            <h2 className="font-semibold text-gray-800">Customer Details</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 p-4 border border-gray-300 border-t-0">
            <div>
              <div className="mb-2">
                <span className="font-medium">Name:</span> {quotation.customer_name}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-medium">Phone:</span> {quotation.customer_phone || 'N/A'}
              </div>
            </div>
            <div>
              <div>
                <span className="font-medium">Email:</span> {quotation.customer_email || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Description</th>
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
              {quotation.items && quotation.items.length > 0 ? (
                quotation.items.map((item) => (
                  <tr key={item.id}>
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
              
              <tr className="bg-gray-50 font-medium">
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2">
                  {quotation.items?.reduce((sum, item) => sum + item.qty, 0) || 0}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {quotation.items?.reduce((sum, item) => sum + item.price, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {quotation.items?.reduce((sum, item) => sum + item.disc, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2">
                  {quotation.items?.reduce((sum, item) => sum + item.taxAmt, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {quotation.items?.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {quotation.items?.reduce((sum, item) => sum + item.total, 0).toFixed(2) || '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <div className="flex justify-end">
            <div className="w-80">
              <table className="w-full border border-gray-300">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 bg-gray-100 font-medium">Grand Total</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-bold">₹ {(quotation.total_amount || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {quotation.note && (
          <div className="mb-8">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h2 className="font-semibold text-gray-800">Note</h2>
            </div>
            <div className="p-4 border border-gray-300 border-t-0">
              {quotation.note}
            </div>
          </div>
        )}

        {quotation.terms_conditions && (
          <div className="mb-8">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h2 className="font-semibold text-gray-800">Terms and Conditions</h2>
            </div>
            <div className="p-4 border border-gray-300 border-t-0">
              {quotation.terms_conditions}
            </div>
          </div>
        )}
      </div>

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
