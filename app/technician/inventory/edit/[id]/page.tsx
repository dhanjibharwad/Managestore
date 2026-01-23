'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Part {
  part_id: string;
  part_name: string;
  purchase_price: number;
  selling_price: number;
  tax: string;
  warranty: string;
  opening_stock: number;
  current_stock: number;
  rate_including_tax: boolean;
  category: string;
  sub_category: string;
  low_stock_units: number;
  hsn_code: string;
  part_description: string;
  sku: string;
  unit_type: string;
  storage_location: string;
  barcode_number: string;
  manage_stock: boolean;
  low_stock_alert: boolean;
}

export default function EditPartPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partId, setPartId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPartId(resolvedParams.id);
      fetchPart(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchPart = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/inventory/${id}`);
      const data = await response.json();
      if (response.ok) {
        setPart(data.part);
      }
    } catch (error) {
      console.error('Error fetching part:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!part) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/inventory/${partId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(part)
      });

      if (response.ok) {
        localStorage.setItem('successMessage', 'Part updated successfully!');
        router.push('/technician/inventory');
      }
    } catch (error) {
      console.error('Error updating part:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Part not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/technician/inventory">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Part</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Name *
                </label>
                <input
                  type="text"
                  value={part.part_name}
                  onChange={(e) => setPart({...part, part_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={part.purchase_price}
                  onChange={(e) => setPart({...part, purchase_price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={part.selling_price || ''}
                  onChange={(e) => setPart({...part, selling_price: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax
                </label>
                <select
                  value={part.tax || ''}
                  onChange={(e) => setPart({...part, tax: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Select tax</option>
                  <option value="GST 18%">GST 18%</option>
                  <option value="GST 12%">GST 12%</option>
                  <option value="GST 5%">GST 5%</option>
                  <option value="IGST 18%">IGST 18%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  value={part.warranty || ''}
                  onChange={(e) => setPart({...part, warranty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={part.current_stock || 0}
                  onChange={(e) => setPart({...part, current_stock: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Units
                </label>
                <input
                  type="number"
                  value={part.low_stock_units || 0}
                  onChange={(e) => setPart({...part, low_stock_units: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HSN Code
                </label>
                <input
                  type="text"
                  value={part.hsn_code || ''}
                  onChange={(e) => setPart({...part, hsn_code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={part.rate_including_tax || false}
                  onChange={(e) => setPart({...part, rate_including_tax: e.target.checked})}
                  className="h-4 w-4 text-[#4A70A9] focus:ring-[#4A70A9] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Rate Including Tax</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={part.manage_stock !== false}
                  onChange={(e) => setPart({...part, manage_stock: e.target.checked})}
                  className="h-4 w-4 text-[#4A70A9] focus:ring-[#4A70A9] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Manage Stock</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={part.low_stock_alert !== false}
                  onChange={(e) => setPart({...part, low_stock_alert: e.target.checked})}
                  className="h-4 w-4 text-[#4A70A9] focus:ring-[#4A70A9] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Low Stock Alert</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Description
              </label>
              <textarea
                value={part.part_description || ''}
                onChange={(e) => setPart({...part, part_description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                placeholder="Enter part description..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/technician/inventory">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Part'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}