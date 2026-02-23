"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Printer } from 'lucide-react';

interface PurchaseItem {
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

interface Purchase {
  id: number;
  purchase_number: string;
  supplier_name: string;
  party_invoice_number: string;
  purchase_date: string;
  due_date: string;
  payment_status: string;
  payment_mode: string;
  total_amount: number;
  items: PurchaseItem[];
  supplier_phone?: string;
  supplier_email?: string;
  terms_conditions?: string;
  company_name?: string;
}

export default function PurchaseInvoice() {
  const params = useParams();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
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
    fetchSession();
  }, []);

  const fetchPurchaseDetails = useCallback(async () => {
    if (!companyId) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/admin/purchases?companyId=${companyId}&purchaseId=${params.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch purchase: ${response.status}`);
      }
      const data = await response.json();
      if (data.purchase) {
        const items = data.items?.map((item: any) => ({
          id: item.id.toString(),
          description: item.part_name || item.description,
          taxCode: item.tax_code || '',
          qty: parseInt(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          disc: parseFloat(item.discount) || 0,
          tax: parseFloat(item.tax_rate) || 0,
          taxAmt: parseFloat(item.tax_amount) || 0,
          subTotal: parseFloat(item.subtotal) || 0,
          total: parseFloat(item.total) || 0
        })) || [];

        const totalAmount = items.reduce((sum: number, item: PurchaseItem) => sum + item.total, 0);

        setPurchase({
          ...data.purchase,
          total_amount: totalAmount,
          company_name: data.purchase.company_name,
          items
        });
      } else {
        setError('Purchase not found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load purchase');
    } finally {
      setLoading(false);
    }
  }, [params.id, companyId]);

  useEffect(() => {
    if (params.id && companyId) {
      fetchPurchaseDetails();
    }
  }, [params.id, companyId, fetchPurchaseDetails]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading purchase...</div>
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

  if (!purchase) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Purchase not found</div>
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
            Print Purchase Invoice
          </button>
        </div>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{purchase.company_name || 'Company Name'}</h2>
            <h1 className="text-2xl font-bold text-gray-800">Purchase Invoice {purchase.purchase_number}</h1>
          </div>
          <div className="text-right text-sm text-gray-600">
            {currentDate}
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
            <h2 className="font-semibold text-gray-800">Supplier Details</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 p-4 border border-gray-300 border-t-0">
            <div>
              <div className="mb-2">
                <span className="font-medium">Supplier:</span> {purchase.supplier_name}
              </div>
              <div className="mb-2">
                <span className="font-medium">Invoice No:</span> {purchase.party_invoice_number || 'N/A'}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-medium">Purchase Date:</span> {new Date(purchase.purchase_date).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <span className="font-medium">Due Date:</span> {purchase.due_date ? new Date(purchase.due_date).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="font-medium">Payment Status:</span> {purchase.payment_status}
              </div>
              <div>
                <span className="font-medium">Payment Mode:</span> {purchase.payment_mode || 'N/A'}
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
              {purchase.items && purchase.items.length > 0 ? (
                purchase.items.map((item) => (
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
                  {purchase.items?.reduce((sum, item) => sum + item.qty, 0) || 0}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {purchase.items?.reduce((sum, item) => sum + item.price, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {purchase.items?.reduce((sum, item) => sum + item.disc, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2"></td>
                <td className="border border-gray-300 px-3 py-2">
                  {purchase.items?.reduce((sum, item) => sum + item.taxAmt, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {purchase.items?.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2) || '0.00'}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {purchase.items?.reduce((sum, item) => sum + item.total, 0).toFixed(2) || '0.00'}
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
                    <td className="border border-gray-300 px-4 py-2 text-right font-bold">₹ {(purchase.total_amount || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {purchase.terms_conditions && (
          <div className="mb-8">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h2 className="font-semibold text-gray-800">Terms and Conditions</h2>
            </div>
            <div className="p-4 border border-gray-300 border-t-0">
              {purchase.terms_conditions}
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
