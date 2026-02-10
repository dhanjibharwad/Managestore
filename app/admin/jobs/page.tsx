"use client"
import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import Link from 'next/link';

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
  created_at: string;
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
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, job: Job | null}>({show: false, job: null});
  const [deletingJob, setDeletingJob] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [statusModal, setStatusModal] = useState<StatusUpdateModal>({show: false, job: null});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selfCheckinModal, setSelfCheckinModal] = useState<{show: boolean, request: any}>({show: false, request: null});
  const [deleteSelfCheckinModal, setDeleteSelfCheckinModal] = useState<{show: boolean, request: any}>({show: false, request: null});
  const [viewModal, setViewModal] = useState<{show: boolean, request: any}>({show: false, request: null});


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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'Self Check-In') {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (jobStatus) params.append('status', jobStatus);
        
        const response = await fetch(`/api/admin/selfcheckin?${params}`);
        const data = await response.json();
        
        if (response.ok) {
          setSelfCheckins(data.requests || []);
        } else {
          console.error('Self check-in fetch error:', data);
          showToast(data.error || 'Failed to fetch self check-in requests', 'error');
        }
        return;
      }
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (jobStatus) params.append('status', jobStatus);
      if (assigneeFilter) params.append('assignee', assigneeFilter);
      
      if (activeTab === 'Open Jobs') {
        params.append('tabFilter', 'open');
      }
      
      const response = await fetch(`/api/admin/jobs?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        let jobsData = data.jobs || [];
        
        if (activeTab === 'Open Jobs') {
          jobsData = jobsData.filter((job: Job) => 
            job.status === 'Pending' || job.status === 'In Progress'
          );
        }
        
        setJobs(jobsData);
      } else {
        showToast(data.error || 'Failed to fetch jobs', 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (activeTab === 'Self Check-In') {
        showToast('Failed to fetch self check-in requests. Please try again.', 'error');
      } else {
        showToast('Failed to fetch jobs. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleUpdateStatus = async () => {
    if (!statusModal.job || !selectedStatus) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/jobs/${statusModal.job.id}`, {
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

  const handleDeleteSelfCheckin = async (requestId: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/selfcheckin/${requestId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showToast('Self check-in deleted successfully!', 'success');
        setDeleteSelfCheckinModal({show: false, request: null});
        fetchJobs();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete', 'error');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSelfCheckin = async () => {
    if (!selfCheckinModal.request) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/selfcheckin/${selfCheckinModal.request.id}`, {
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

  const handleDeleteJob = async (jobId: number, jobNumber: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Job deleted successfully!', 'success');
        setDeleteModal({show: false, job: null});
        fetchJobs();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete job', 'error');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast('Failed to delete job', 'error');
    } finally {
      setIsDeleting(false);
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
    'Self Check-In',
    // 'Basic/Workflow Settings',
    // 'Job Settings',
    // 'Technician Print Options',
    // 'Print Option Settings',
    // 'Job Service Option',
    // 'Overview'
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
              {/* {tab === 'Self Check-In' && 
              (
                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              )
              } */}
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
              </div>
            </div>

            {/* Self Check-In Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                            </div>
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
                                      setSelectedAssignee('');
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
                                      setSelectedAssignee('');
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Assigned To
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteSelfCheckinModal({show: true, request});
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'Outsourced Jobs' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Outsourced Jobs</h1>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Outsource vendor name"
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
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Job Sheet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Comment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Job Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created On</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-500">No data</td>
                    </tr>
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

              <Link href="/admin/jobs/add">
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
                                  <button 
                                    onClick={() => {
                                      setDeleteModal({show: true, job});
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Job
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
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab}</h3>
              <p className="text-gray-500">Content for this tab is coming soon...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* View Self Check-In Modal */}
      {viewModal.show && viewModal.request && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Self Check-In Preview</h3>
                <button onClick={() => setViewModal({show: false, request: null})} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Customer Detail Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-blue-600">Customer Detail</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      viewModal.request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      viewModal.request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      viewModal.request.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {viewModal.request.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.address_line || 'Not Provided'}</p>
                  </div>
                </div>
              </div>

              {/* Device Detail Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-blue-600">Device Detail</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Device Type</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.device_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Device Brand</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Device Model</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Serial Number</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.serial_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Device password</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.device_password || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Accessories</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.accessories || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Service Information Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-blue-600">Service Information</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Services</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.services || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Comment</p>
                    <p className="text-sm font-medium text-gray-900">{viewModal.request.device_issue || 'No comment provided'}</p>
                  </div>
                </div>
              </div>

              {/* Device Images Section */}
              {viewModal.request.device_images && viewModal.request.device_images.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-blue-600">Device Images</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {viewModal.request.device_images.map((image: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer group"
                        onClick={() => {
                          const newWindow = window.open();
                          if (newWindow) {
                            newWindow.document.write(`<img src="${image}" style="max-width:100%; height:auto;" />`);
                          }
                        }}
                      >
                        <img src={image} alt={`Device ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
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
                <button onClick={() => setSelfCheckinModal({show: false, request: null})} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
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
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.employee_name}>{emp.employee_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setSelfCheckinModal({show: false, request: null})} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleUpdateSelfCheckin} disabled={updatingStatus} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {updatingStatus ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Self Check-in Modal */}
      {deleteSelfCheckinModal.show && deleteSelfCheckinModal.request && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Self Check-In</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">Are you sure you want to delete this self check-in request from <strong>{deleteSelfCheckinModal.request.customer_name}</strong>?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteSelfCheckinModal({show: false, request: null})} disabled={isDeleting} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleDeleteSelfCheckin(deleteSelfCheckinModal.request.id)} disabled={isDeleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.job && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete job <strong>{deleteModal.job.job_number}</strong>? 
                All associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({show: false, job: null})}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(deleteModal.job!.id, deleteModal.job!.job_number)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
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
    </div>
  );
};

export default JobPage;