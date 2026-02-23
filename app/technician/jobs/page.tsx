"use client"
import React, { useState, useEffect } from 'react';
import { Search, Plus, Grid, List, Settings, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: number;
  job_id: string;
  job_number: string;
  customer_name: string;
  customer_id?: number;
  source?: string;
  referred_by?: string;
  service_type?: string;
  job_type?: string;
  device_type: string;
  device_brand: string;
  device_model: string;
  device_type_name?: string;
  device_brand_name?: string;
  device_model_name?: string;
  serial_number?: string;
  accessories?: string;
  storage_location?: string;
  device_color?: string;
  device_password?: string;
  services: string;
  tags?: string;
  hardware_config?: string;
  service_assessment?: string;
  assignee: string;
  status: string;
  priority: string;
  initial_quotation?: string;
  due_date?: string;
  dealer_job_id?: string;
  terms_conditions?: string;
  images?: string[];
  created_at: string;
  updated_at?: string;
}

interface Employee {
  id: number;
  employee_name: string;
  employee_role: string;
  email: string;
}

interface CheckInLead {
  id: string;
  openLead: string;
  mobile: string;
  email: string;
  assignee: {
    name: string;
    initials: string;
  };
  status: 'Open' | 'Closed' | 'Pending';
  deviceType: string;
  services: string;
  comment: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface StatusUpdateModal {
  show: boolean;
  job: Job | null;
}

const JobPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Open Jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selfCheckins, setSelfCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [statusModal, setStatusModal] = useState<StatusUpdateModal>({show: false, job: null});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selfCheckinModal, setSelfCheckinModal] = useState<{show: boolean, request: any}>({show: false, request: null});
  const [viewModal, setViewModal] = useState<{show: boolean, request: any}>({show: false, request: null});
  const [viewJobModal, setViewJobModal] = useState<{show: boolean, job: Job | null}>({show: false, job: null});
  const [imageModal, setImageModal] = useState<{show: boolean, image: string, title: string}>({show: false, image: '', title: ''});

  const openFileModal = (file: string, title: string) => {
    setImageModal({show: true, image: file, title});
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/admin/employees');
      const data = await response.json();
      if (response.ok && data.employees) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const getEmployeeByName = (name: string) => {
    return employees.find(emp => emp.employee_name === name);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'Self Check-In') {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (jobStatus) params.append('status', jobStatus);
        
        const response = await fetch(`/api/technician/assigned-selfcheckin?${params}`);
        const data = await response.json();
        
        if (response.ok) {
          setSelfCheckins(data.requests || []);
        } else {
          showToast(data.error || 'Failed to fetch self check-in requests', 'error');
        }
        return;
      }
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (jobStatus) params.append('status', jobStatus);
      if (assigneeFilter) params.append('assignee', assigneeFilter);
      
      // Add tab-specific filtering
      if (activeTab === 'Open Jobs') {
        params.append('tabFilter', 'open');
      }
      
      const response = await fetch(`/api/technician/assigned-jobs?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        let jobsData = data.jobs || [];
        
        // Client-side filtering for Open Jobs tab
        if (activeTab === 'Open Jobs') {
          jobsData = jobsData.filter((job: Job) => 
            job.status === 'Pending' || job.status === 'In Progress'
          );
        }
        
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUpdateSelfCheckin = async () => {
    if (!selfCheckinModal.request) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/technician/assigned-selfcheckin/${selfCheckinModal.request.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          assignee: selectedAssignee
        })
      });

      if (response.ok) {
        showToast('Status updated successfully!', 'success');
        setSelfCheckinModal({show: false, request: null});
        fetchJobs();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update', 'error');
      }
    } catch (error) {
      console.error('Error updating:', error);
      showToast('Failed to update', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModal.job || !selectedStatus) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/technician/assigned-jobs/${statusModal.job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          assignee: selectedAssignee
        })
      });

      if (response.ok) {
        showToast('Job status updated successfully!', 'success');
        setStatusModal({show: false, job: null});
        
        // Switch to All Jobs tab if status is Completed or Cancelled
        if ((selectedStatus === 'Completed' || selectedStatus === 'Cancelled') && activeTab === 'Open Jobs') {
          setActiveTab('All Jobs');
        }
        
        fetchJobs();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchJobs();
  }, [searchQuery, jobStatus, assigneeFilter, activeTab]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const tabs = [
    'Open Jobs',
    'All Jobs',
    // 'Outsourced Jobs',
    'Self Check-In'
  ];

  return (
    <div className="bg-gray">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-[#4A70A9]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'Self Check-In' ? (
          <>
            {/* Self Check-In Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Self Check-In</h1>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Lead name, number, comment"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-80"
                  />
                </div>

                <select
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-700"
                >
                  <option value="">Select status</option>
                 <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <Grid className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  >
                    <List className="w-5 h-5 text-gray-600" />
                  </button>
                </div> */}
              </div>
            </div>

            {/* Self Check-In Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Open Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Device Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Comment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : selfCheckins.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">No self check-in requests found</td>
                      </tr>
                    ) : (
                      selfCheckins.map((request, index) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.customer_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A70A9]">{request.mobile_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {(() => {
                              if (!request.assignee) return <span className="text-gray-500">-</span>;
                              const employee = getEmployeeByName(request.assignee);
                              return employee ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                    {getInitials(employee.employee_name)}
                                  </div>
                                  <div>
                                    <div className="text-gray-900 font-medium">{employee.employee_name}</div>
                                    <div className="text-gray-500 text-xs">{employee.employee_role}</div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-900">{request.assignee}</span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              request.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.device_type} - {request.brand}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.model}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{request.device_issue || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === index ? null : index);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Settings className="w-5 h-5" />
                              </button>
                              {openDropdown === index && (
                                <div className="fixed mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]" style={{transform: 'translateX(-100%)', marginLeft: '-1rem'}}>
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setViewModal({show: true, request});
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelfCheckinModal({show: true, request});
                                        setSelectedStatus(request.status);
                                        setSelectedAssignee(request.assignee || '');
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      Update Status
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelfCheckinModal({show: true, request});
                                        setSelectedStatus(request.status);
                                        setSelectedAssignee(request.assignee || '');
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      Assigned To
                                    </button>
                                  </div>
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
          </>
        ) : (activeTab === 'Open Jobs' || activeTab === 'All Jobs') ? (
          <>
            <div className="flex gap-4 mb-6 justify-end">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job sheet, customer, serial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
              
              <select
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-700"
              >
                <option value="">Select job status</option>
                {/* <option value="Open">Open</option> */}
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-700"
              >
                <option value="">Select assignee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.employee_name}>
                    {employee.employee_name} ({employee.employee_role})
                  </option>
                ))}
              </select>

              <Link href="/technician/jobs/add">
                <button className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors flex items-center gap-2 font-medium">
                  <Plus className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg">
              <div className="">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Job Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Device Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Device Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created On</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : jobs.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center text-gray-500">No jobs found</td>
                      </tr>
                    ) : (
                      jobs.map((job, index) => (
                        <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{job.job_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.customer_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.device_brand_name || job.device_brand}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.device_model_name || job.device_model || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{job.services}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {(() => {
                              const employee = getEmployeeByName(job.assignee);
                              return employee ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                    {getInitials(employee.employee_name)}
                                  </div>
                                  <div>
                                    <div className="text-gray-900 font-medium">{employee.employee_name}</div>
                                    <div className="text-gray-500 text-xs">{employee.employee_role}</div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-900">{job.assignee}</span>
                              );
                            })()
                          }</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.priority === 'High' ? 'bg-red-100 text-red-800' :
                              job.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                              job.priority === 'Low' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {job.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              job.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(job.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === index ? null : index);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Settings className="w-5 h-5" />
                              </button>
                            
                            {openDropdown === index && (
                              <div className="absolute right-0 top-8 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                                <div className="py-1">
                                  <button 
                                    onClick={() => {
                                      setViewJobModal({show: true, job});
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setStatusModal({show: true, job});
                                      setSelectedStatus(job.status);
                                      setSelectedAssignee(job.assignee);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Update Status
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setStatusModal({show: true, job});
                                      setSelectedStatus(job.status);
                                      setSelectedAssignee(job.assignee);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Assigned To
                                  </button>
                                </div>
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
          </>
        ) : null}
      </div>
      
      {/* View Job Modal */}
      {viewJobModal.show && viewJobModal.job && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Job Details</h3>
                <button onClick={() => setViewJobModal({show: false, job: null})} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-6"><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><h4 className="text-lg font-semibold text-blue-600">Job Information</h4></div><div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg"><div><p className="text-sm text-gray-600 mb-1">Job Number</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.job_number}</p></div><div><p className="text-sm text-gray-600 mb-1">Status</p><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${viewJobModal.job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : viewJobModal.job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : viewJobModal.job.status === 'Completed' ? 'bg-green-100 text-green-800' : viewJobModal.job.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{viewJobModal.job.status}</span></div><div><p className="text-sm text-gray-600 mb-1">Priority</p><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${viewJobModal.job.priority === 'High' ? 'bg-red-100 text-red-800' : viewJobModal.job.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' : viewJobModal.job.priority === 'Low' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>{viewJobModal.job.priority}</span></div><div><p className="text-sm text-gray-600 mb-1">Source</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.source || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Referred By</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.referred_by || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Service Type</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.service_type || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Job Type</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.job_type || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Created On</p><p className="text-sm font-medium text-gray-900">{formatDateTime(viewJobModal.job.created_at)}</p></div><div><p className="text-sm text-gray-600 mb-1">Due Date</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.due_date ? formatDate(viewJobModal.job.due_date) : 'N/A'}</p></div>{viewJobModal.job.dealer_job_id && (<div className="col-span-2"><p className="text-sm text-gray-600 mb-1">Dealer Job ID</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.dealer_job_id}</p></div>)}</div></div>
              <div className="mb-6"><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><h4 className="text-lg font-semibold text-blue-600">Customer Detail</h4></div><div className="bg-gray-50 p-4 rounded-lg"><div><p className="text-sm text-gray-600 mb-1">Customer Name</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.customer_name}</p></div></div></div>
              <div className="mb-6"><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg><h4 className="text-lg font-semibold text-blue-600">Device Detail</h4></div><div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg"><div><p className="text-sm text-gray-600 mb-1">Device Type</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.device_type_name || viewJobModal.job.device_type}</p></div><div><p className="text-sm text-gray-600 mb-1">Device Brand</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.device_brand_name || viewJobModal.job.device_brand}</p></div><div><p className="text-sm text-gray-600 mb-1">Device Model</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.device_model_name || viewJobModal.job.device_model || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Serial Number</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.serial_number || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Device Color</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.device_color || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Device Password</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.device_password || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Storage Location</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.storage_location || 'N/A'}</p></div><div><p className="text-sm text-gray-600 mb-1">Accessories</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.accessories || 'None'}</p></div>{viewJobModal.job.hardware_config && (<div className="col-span-2"><p className="text-sm text-gray-600 mb-1">Hardware Configuration</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.hardware_config}</p></div>)}</div></div>
              <div className="mb-6"><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg><h4 className="text-lg font-semibold text-blue-600">Service Information</h4></div><div className="bg-gray-50 p-4 rounded-lg space-y-4"><div><p className="text-sm text-gray-600 mb-1">Services</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.services}</p></div>{viewJobModal.job.service_assessment && (<div><p className="text-sm text-gray-600 mb-1">Service Assessment</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.service_assessment}</p></div>)}{viewJobModal.job.tags && (<div><p className="text-sm text-gray-600 mb-1">Tags</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.tags}</p></div>)}{viewJobModal.job.initial_quotation && (<div><p className="text-sm text-gray-600 mb-1">Initial Quotation</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.initial_quotation}</p></div>)}</div></div>
              <div className="mb-6"><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg><h4 className="text-lg font-semibold text-blue-600">Assignment</h4></div><div className="bg-gray-50 p-4 rounded-lg"><div><p className="text-sm text-gray-600 mb-1">Assigned To</p><p className="text-sm font-medium text-gray-900">{viewJobModal.job.assignee}</p></div></div></div>
              {viewJobModal.job.terms_conditions && (<div className="mb-6"><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><h4 className="text-lg font-semibold text-blue-600">Terms & Conditions</h4></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{viewJobModal.job.terms_conditions}</p></div></div>)}
              {viewJobModal.job.images && viewJobModal.job.images.length > 0 && (<div><div className="flex items-center gap-2 mb-4"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><h4 className="text-lg font-semibold text-blue-600">Device Images</h4></div><div className="grid grid-cols-3 gap-4">{viewJobModal.job.images.map((image: string, idx: number) => (<div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => openFileModal(image, `Job Image ${idx + 1}`)}><img src={image} alt={`Device ${idx + 1}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center"><svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></div></div>))}</div></div>)}
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModal.show && statusModal.job && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Update Job Status</h3>
                <button
                  onClick={() => setStatusModal({show: false, job: null})}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Job:</span>
                    <span className="ml-2 font-medium">{statusModal.job.job_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      statusModal.job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      statusModal.job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      statusModal.job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      statusModal.job.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {statusModal.job.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{statusModal.job.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assignee:</span>
                    <span className="ml-2 font-medium">{statusModal.job.assignee}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee Name</label>
                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.employee_name}>
                        {employee.employee_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStatusModal({show: false, job: null})}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      {imageModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button 
              onClick={() => setImageModal({show: false, image: '', title: ''})}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{imageModal.title}</h3>
              </div>
              <div className="p-4 flex items-center justify-center bg-gray-50">
                <img 
                  src={imageModal.image} 
                  alt={imageModal.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                  style={{minHeight: '200px'}}
                />
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imageModal.image;
                    link.download = `${imageModal.title}.jpg`;
                    link.click();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => {
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(`
                        <html>
                          <head><title>${imageModal.title}</title></head>
                          <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f3f4f6;">
                            <img src="${imageModal.image}" style="max-width:100%; max-height:100vh; object-fit:contain;" />
                          </body>
                        </html>
                      `);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in New Tab
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

      {/* View Self Check-In Modal */}
      {viewModal.show && viewModal.request && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Self Check-In Preview</h3>
                <button onClick={() => setViewModal({show: false, request: null})} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <h4 className="text-lg font-semibold text-blue-600">Customer Detail</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div><p className="text-sm text-gray-600 mb-1">Name</p><p className="text-sm font-medium text-gray-900">{viewModal.request.customer_name}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Email</p><p className="text-sm font-medium text-gray-900">{viewModal.request.email}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Mobile</p><p className="text-sm font-medium text-gray-900">{viewModal.request.mobile_number}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Status</p><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{viewModal.request.status}</span></div>
                  <div className="col-span-2"><p className="text-sm text-gray-600 mb-1">Address</p><p className="text-sm font-medium text-gray-900">{viewModal.request.address_line || 'Not Provided'}</p></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <h4 className="text-lg font-semibold text-blue-600">Device Detail</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div><p className="text-sm text-gray-600 mb-1">Type</p><p className="text-sm font-medium text-gray-900">{viewModal.request.device_type}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Brand</p><p className="text-sm font-medium text-gray-900">{viewModal.request.brand}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Model</p><p className="text-sm font-medium text-gray-900">{viewModal.request.model}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Serial</p><p className="text-sm font-medium text-gray-900">{viewModal.request.serial_number || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Password</p><p className="text-sm font-medium text-gray-900">{viewModal.request.device_password || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Accessories</p><p className="text-sm font-medium text-gray-900">{viewModal.request.accessories || 'None'}</p></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <h4 className="text-lg font-semibold text-blue-600">Service Info</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4"><p className="text-sm text-gray-600 mb-1">Services</p><p className="text-sm font-medium text-gray-900">{viewModal.request.services || 'None'}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Comment</p><p className="text-sm font-medium text-gray-900">{viewModal.request.device_issue || 'No comment'}</p></div>
                </div>
              </div>
              {viewModal.request.device_images && viewModal.request.device_images.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <h4 className="text-lg font-semibold text-blue-600">Device Images</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {viewModal.request.device_images.map((image: string, idx: number) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => openFileModal(image, `Self Check-In Image ${idx + 1}`)}>
                        <img src={image} alt={`Device ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Self Check-in Status Modal */}
      {selfCheckinModal.show && selfCheckinModal.request && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Update Self Check-In</h3>
                <button onClick={() => setSelfCheckinModal({show: false, request: null})} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select value={selectedAssignee} onChange={(e) => setSelectedAssignee(e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="">Select assignee</option>
                    {employees.map(emp => (<option key={emp.id} value={emp.employee_name}>{emp.employee_name}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelfCheckinModal({show: false, request: null})} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleUpdateSelfCheckin} disabled={updatingStatus} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50">{updatingStatus ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;