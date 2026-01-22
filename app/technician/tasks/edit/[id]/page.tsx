'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: number;
  task_id: string;
  task_title: string;
  task_description: string;
  assignee_id: number;
  task_status: string;
  priority: string;
  due_date: string;
  customer_id: number;
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface Customer {
  id: number;
  customer_name: string;
  customer_id: string;
}

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taskId, setTaskId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setTaskId(resolvedParams.id);
      fetchTask(resolvedParams.id);
    };
    getParams();
    fetchUsers();
    fetchCustomers();
  }, [params]);

  const fetchTask = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tasks/${id}`);
      const data = await response.json();
      if (response.ok) {
        setTask(data.task);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        localStorage.setItem('successMessage', 'Task updated successfully!');
        router.push('/technician/tasks');
      }
    } catch (error) {
      console.error('Error updating task:', error);
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

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Task not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/technician/tasks">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Task</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={task.task_title}
                  onChange={(e) => setTask({...task, task_title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee *
                </label>
                <select
                  value={task.assignee_id}
                  onChange={(e) => setTask({...task, assignee_id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  required
                >
                  <option value="">Select assignee</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Status *
                </label>
                <select
                  value={task.task_status}
                  onChange={(e) => setTask({...task, task_status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  required
                >
                  <option value="Not Started Yet">Not Started Yet</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) => setTask({...task, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="urgent">Urgent</option>
                  <option value="Medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setTask({...task, due_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <select
                  value={task.customer_id || ''}
                  onChange={(e) => setTask({...task, customer_id: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Select customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_name} - {customer.customer_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <textarea
                value={task.task_description || ''}
                onChange={(e) => setTask({...task, task_description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                placeholder="Enter task description..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/technician/tasks">
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
                {saving ? 'Saving...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}