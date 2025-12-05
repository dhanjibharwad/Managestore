'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Plus, ChevronUp } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: string;
  dueDate: string;
  customer: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortAscending, setSortAscending] = useState(true);

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
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Add Task Button */}
          <button className="bg-[#4A70A9] hover:bg-[#3d5d8f] text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
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
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-zinc-700">{task.title}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{task.description}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{task.assignee}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{task.status}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{task.dueDate}</td>
                    <td className="px-6 py-4 text-sm text-zinc-700">{task.customer}</td>
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