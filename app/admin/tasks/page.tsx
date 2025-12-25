  'use client';

  import React, { useState, useEffect } from 'react';
  import { Search, ChevronDown, Plus, ChevronUp } from 'lucide-react';
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
    attachments: string[];
    created_at: string;
  }

  export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortAscending, setSortAscending] = useState(true);

    useEffect(() => {
      fetchTasks();
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
              />
            </div>

            {/* Assignee Filter */}
            <div className="relative">
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700 min-w-[200px]"
              >
                <option value="">Select assignee name</option>
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
                <option value="mike">Mike Johnson</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white text-gray-700 min-w-[180px]"
              >
                <option value="">Select status</option>
                <option value="Not Started Yet">Not Started Yet</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Completed">Cancelled</option>
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      No data
                    </td>
                  </tr>
                ) : (
                  tasks
                    .filter(task => 
                      task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (task.task_description && task.task_description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
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
                          {task.customer_id ? `Customer ${task.customer_id}` : '-'}
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="text-xs text-blue-600 mt-1">
                              {task.attachments.length} attachment(s)
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }