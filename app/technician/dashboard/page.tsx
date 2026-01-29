'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Clipboard, Users, CheckSquare, Calendar } from 'lucide-react';

interface Job {
  id: number;
  job_number: string;
  customer_name: string;
  device_brand: string;
  device_model: string;
  device_brand_name?: string;
  device_model_name?: string;
  assignee: string;
  status: string;
  priority: string;
  services: string;
  initial_quotation?: string;
  created_at: string;
}

interface Lead {
  id: number;
  lead_name: string;
  mobile_number: string;
  email_id: string;
  device_type_name?: string;
  device_brand_name?: string;
  device_model_name?: string;
  next_follow_up: string;
  created_at: string;
}

interface Task {
  id: number;
  task_id: string;
  task_title: string;
  task_description: string;
  customer_name?: string;
  assignee_name: string;
  task_status: string;
  priority: string;
  due_date: string;
  created_at: string;
}

interface PickupDrop {
  id: number;
  pickup_drop_id: string;
  service_type: string;
  customer_search: string;
  mobile: string;
  device_type: string;
  schedule_date: string;
  assignee_name: string;
  status: string;
  address: string;
  created_at: string;
}

interface DashboardStats {
  assignedJobs: number;
  assignedLeads: number;
  assignedTasks: number;
  delayedJobs: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('assigned-jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    assignedJobs: 0,
    assignedLeads: 0,
    assignedTasks: 0,
    delayedJobs: 0
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pickupDrops, setPickupDrops] = useState<PickupDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchTabData();
  }, []);

  useEffect(() => {
    fetchTabData();
  }, [activeTab, searchQuery, jobStatus]);

  useEffect(() => {
    // Reset status filter when switching tabs
    if (activeTab !== 'assigned-jobs') {
      setJobStatus('');
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/technician/dashboard-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    try {
      setDataLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (jobStatus && activeTab === 'assigned-jobs') params.append('status', jobStatus);
      
      let endpoint = '';
      switch (activeTab) {
        case 'assigned-jobs':
          endpoint = '/api/technician/assigned-jobs';
          break;
        case 'assigned-leads':
          endpoint = '/api/technician/assigned-leads';
          break;
        case 'assigned-task':
          endpoint = '/api/technician/assigned-tasks';
          break;
        case 'assigned-scheduled':
          endpoint = '/api/technician/assigned-pickupdrop';
          break;
        default:
          endpoint = '/api/technician/assigned-jobs';
      }
      
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        switch (activeTab) {
          case 'assigned-jobs':
            setJobs(data.jobs || []);
            break;
          case 'assigned-leads':
            setLeads(data.leads || []);
            break;
          case 'assigned-task':
            setTasks(data.tasks || []);
            break;
          case 'assigned-scheduled':
            setPickupDrops(data.pickupDrops || []);
            break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setDataLoading(false);
    }
  };

  const tabs = [
    { id: 'assigned-jobs', label: 'Assigned Jobs', icon: Clipboard },
    { id: 'assigned-task', label: 'Assigned Task', icon: CheckSquare },
    { id: 'assigned-leads', label: 'Assigned Leads', icon: Users },
    { id: 'assigned-scheduled', label: 'Assigned Scheduled Pickups', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">
        {/* Assigned Jobs Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats.assignedJobs
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clipboard className="w-5 h-5" />
            <span className="font-medium">Assigned Jobs</span>
          </div>
        </div>

        {/* Assigned Leads Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats.assignedLeads
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="font-medium">Assigned Leads</span>
          </div>
        </div>

        {/* Assigned Task Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats.assignedTasks
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Assigned Task</span>
          </div>
        </div>

        {/* Assigned Delayed Jobs Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats.delayedJobs
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clipboard className="w-5 h-5" />
            <span className="font-medium">Assigned Delayed Jobs</span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white mx-3 sm:mx-4 lg:mx-6 rounded-t-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 min-w-max">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#4A70A9] border-b-2 border-[#4A70A9]'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="hidden sm:inline text-sm">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label.split(' ')[1] || tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white mx-3 sm:mx-4 lg:mx-6 rounded-b-lg shadow-sm border border-t-0 border-gray-200">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {activeTab === 'assigned-jobs' && 'Jobs'}
              {activeTab === 'assigned-leads' && 'Leads'}
              {activeTab === 'assigned-task' && 'Tasks'}
              {activeTab === 'assigned-scheduled' && 'Scheduled Pickups'}
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                <input
                  type="text"
                  placeholder="Job sheet, customer, serial ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Status Dropdown - Only show for jobs tab */}
              {activeTab === 'assigned-jobs' && (
                <select
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-600 flex-1 sm:flex-initial"
                >
                  <option value="">Select job status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}

              {/* Add Button */}
              <button className="bg-[#4A70A9] hover:bg-[#3A5F99] text-white p-2 rounded-md transition-colors flex-shrink-0">
                <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Table Content */}
          <div className="overflow-x-auto">
            {activeTab === 'assigned-jobs' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Job Sheet</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Quotation</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device Brand</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device Model</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-gray-400 text-lg">
                        Loading...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-gray-400 text-lg">
                        No jobs assigned
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-blue-600 font-medium">{job.job_number}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{job.customer_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">₹{job.initial_quotation || '0'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{job.device_brand_name || job.device_brand}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{job.device_model_name || job.device_model || '-'}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.priority === 'High' ? 'bg-red-100 text-red-800' :
                            job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {job.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'assigned-leads' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Lead Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mobile</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device Brand</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Next Follow Up</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                        Loading...
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                        No leads assigned
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-blue-600 font-medium">{lead.lead_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{lead.mobile_number}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{lead.email_id || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{lead.device_type_name || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{lead.device_brand_name || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'assigned-task' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Task ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                        Loading...
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                        No tasks assigned
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-blue-600 font-medium">{task.task_id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{task.task_title}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{task.customer_name || '-'}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.task_status === 'Not Started Yet' ? 'bg-gray-100 text-gray-800' :
                            task.task_status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            task.task_status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.task_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(task.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'assigned-scheduled' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Service ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mobile</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Device</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Schedule Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                        Loading...
                      </td>
                    </tr>
                  ) : pickupDrops.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                        No scheduled services assigned
                      </td>
                    </tr>
                  ) : (
                    pickupDrops.map((service) => (
                      <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-blue-600 font-medium">{service.pickup_drop_id}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.service_type === 'pickup' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{service.customer_search}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{service.mobile}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{service.device_type}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(service.schedule_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            service.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            service.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {service.status.replace('_', ' ').charAt(0).toUpperCase() + service.status.replace('_', ' ').slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}