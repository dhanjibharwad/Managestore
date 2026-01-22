  'use client';

  import React, { useState, useEffect } from 'react';
  import { Search, ChevronDown, Plus, ChevronUp, Edit, Trash2, AlertCircle, X, CheckCircle, XCircle } from 'lucide-react';
  import Link from 'next/link';

  interface Task {
    id: number;
    task_id: string;
    task_title: string;
    task_description: string;
    assignee_id: number;
    assignee_name?: string;
    task_status: string;
    priority: string;
    due_date: string;
    customer_id: number;
    customer_name?: string;
    attachments: string[];
    created_at: string;
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

  interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning';
  }

  export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortAscending, setSortAscending] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{show: boolean, task: Task | null}>({show: false, task: null});
    const [deletingTask, setDeletingTask] = useState<number | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
      fetchTasks();
      fetchUsers();
      fetchCustomers();
      
      // Check for success message from localStorage
      const message = localStorage.getItem('successMessage');
      if (message) {
        setSuccessMessage(message);
        setShowSuccessPopup(true);
        localStorage.removeItem('successMessage');
        
        // Hide popup after 5 seconds with fade-out
        setTimeout(() => {
          const popup = document.querySelector('.success-popup');
          if (popup) {
            popup.classList.add('animate-fade-out');
            setTimeout(() => {
              setShowSuccessPopup(false);
            }, 300);
          }
        }, 4700);
      }
    }, []);

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/admin/tasks');
        const data = await response.json();
        if (response.ok) {
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
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

    const getCustomerName = (customerId: number) => {
      const customer = customers.find(c => c.id === customerId);
      return customer ? customer.customer_name : `Customer ${customerId}`;
    };

    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    };

    const removeToast = (id: number) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleDeleteTask = async (taskId: number, taskTitle: string) => {
      try {
        setDeletingTask(taskId);
        setDeleteModal({show: false, task: null});
        
        const response = await fetch(`/api/admin/tasks/${taskId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          showToast('Task deleted successfully!', 'success');
          fetchTasks();
        } else {
          const error = await response.json();
          showToast(error.error || 'Failed to delete task', 'error');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task', 'error');
      } finally {
        setDeletingTask(null);
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Not Started Yet': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'urgent': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="bg-white p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          {/* <div className="mb-6">
            <h1 className="text-3xl font-semibold text-zinc-800">Tasks</h1>
          </div> */}

          {/* Filters Bar */}
          <div className="flex items-center justify-end gap-4 mb-6">
            {/* Search Input */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Task name, description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Assignee Filter */}
            <div className="relative">
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700 min-w-[200px]"
              >
                <option value="">Select assignee name</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700 min-w-[180px]"
              >
                <option value="">Select status</option>
                <option value="Not Started Yet">Not Started Yet</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Add Task Button */}
            <Link href="/admin/tasks/add">
            <button className="bg-[#4A70A9] hover:bg-[#3d5d8f] text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            </Link>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    Assignee
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    Due Date
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    <div className="flex items-center gap-2">
                      Customer
                      <button
                        onClick={() => setSortAscending(!sortAscending)}
                        className="hover:bg-gray-200 p-1 rounded transition-colors"
                      >
                        {sortAscending ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-zinc-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      No data
                    </td>
                  </tr>
                ) : (
                  tasks
                    .filter(task => {
                      const matchesSearch = task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (task.task_description && task.task_description.toLowerCase().includes(searchQuery.toLowerCase()));
                      const matchesAssignee = selectedAssignee === '' || task.assignee_id.toString() === selectedAssignee;
                      const matchesStatus = selectedStatus === '' || task.task_status === selectedStatus;
                      return matchesSearch && matchesAssignee && matchesStatus;
                    })
                    .map((task) => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        <div className="font-medium">{task.task_title}</div>
                        <div className="text-xs text-gray-500">{task.task_id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        <div className="max-w-xs truncate">
                          {task.task_description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {task.assignee_name || task.assignee_id || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.task_status)}`}>
                            {task.task_status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        {formatDate(task.due_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        <div>
                          {task.customer_id ? getCustomerName(task.customer_id) : '-'}
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="text-xs mt-1">
                              {task.attachments.map((attachment, index) => (
                                <button
                                  key={index}
                                  onClick={() => window.open(attachment, '_blank')}
                                  className="text-blue-600 hover:text-blue-800 underline mr-2"
                                >
                                  Attachment {index + 1}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/tasks/edit/${task.id}`}>
                            <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => {
                              setDeleteModal({show: true, task});
                            }}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Delete Confirmation Modal */}
          {deleteModal.show && deleteModal.task && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                      <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete <strong>{deleteModal.task.task_title}</strong>? 
                    All associated data will be permanently removed.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteModal({show: false, task: null})}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteTask(deleteModal.task!.id, deleteModal.task!.task_title)}
                      disabled={deletingTask === deleteModal.task.id}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {deletingTask === deleteModal.task.id ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Toast Notifications */}
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md animate-in slide-in-from-right duration-300 ${
                  toast.type === 'success' ? 'bg-green-50 border border-green-200' :
                  toast.type === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}
              >
                {toast.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
                {toast.type === 'error' && <XCircle className="text-red-600" size={20} />}
                {toast.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
                <span className={`flex-1 text-sm font-medium ${
                  toast.type === 'success' ? 'text-green-800' :
                  toast.type === 'error' ? 'text-red-800' :
                  'text-yellow-800'
                }`}>
                  {toast.message}
                </span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`hover:opacity-70 ${
                    toast.type === 'success' ? 'text-green-600' :
                    toast.type === 'error' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="success-popup fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-500 ease-in-out translate-x-0 opacity-100">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <div className="font-semibold text-green-900">Success!</div>
                <div className="text-sm text-green-700">{successMessage}</div>
              </div>
            </div>
          )}
          
          <style jsx>{`
            .success-popup {
              animation: slideInRight 0.5s ease-out;
            }
            .animate-fade-out {
              animation: fadeOut 0.3s ease-in forwards;
            }
            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes fadeOut {
              from {
                transform: translateX(0);
                opacity: 1;
              }
              to {
                transform: translateX(100%);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </div>
    );
  }