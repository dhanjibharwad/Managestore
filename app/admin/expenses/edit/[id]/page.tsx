'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Expense {
  id: number;
  expense_name: string;
  category: string;
  description: string;
  amount: number;
  payment_mode: string;
  expense_date: string;
}

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expenseId, setExpenseId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setExpenseId(resolvedParams.id);
      fetchExpense(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/expenses/${id}`);
      const data = await response.json();
      if (response.ok) {
        setExpense(data.expense);
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/expenses/${expenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });

      if (response.ok) {
        localStorage.setItem('successMessage', 'Expense updated successfully!');
        router.push('/admin/expenses');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
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

  if (!expense) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Expense not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/expenses">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Expense</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Name *
                </label>
                <input
                  type="text"
                  value={expense.expense_name}
                  onChange={(e) => setExpense({...expense, expense_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={expense.category}
                  onChange={(e) => setExpense({...expense, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="food">Food</option>
                    <option value="utilities">Utilities</option>
                    <option value="transportation">Transportation</option>
                    <option value="salaries">Salaries</option>
                    <option value="rent">Rent</option>
                    <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={expense.amount}
                  onChange={(e) => setExpense({...expense, amount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode *
                </label>
                <select
                  value={expense.payment_mode}
                  onChange={(e) => setExpense({...expense, payment_mode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select payment mode</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="card">Card</option>                 
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Date *
                </label>
                <input
                  type="date"
                  value={expense.expense_date?.split('T')[0] || ''}
                  onChange={(e) => setExpense({...expense, expense_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={expense.description || ''}
                onChange={(e) => setExpense({...expense, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter expense description..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/admin/expenses">
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}