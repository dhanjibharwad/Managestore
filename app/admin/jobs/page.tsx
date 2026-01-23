"use client"
import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
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

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

const JobPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, job: Job | null}>({show: false, job: null});
  const [deletingJob, setDeletingJob] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

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
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (jobStatus) params.append('status', jobStatus);
      if (assigneeFilter) params.append('assignee', assigneeFilter);
      
      const response = await fetch(`/api/admin/jobs?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
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

  const handleDeleteJob = async (jobId: number, jobNumber: string) => {
    try {
      setDeletingJob(jobId);
      setDeleteModal({show: false, job: null});
      
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        showToast('Job deleted successfully!', 'success');
        fetchJobs();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete job', 'error');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast('Failed to delete job', 'error');
    } finally {
      setDeletingJob(null);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchJobs();
  }, [searchQuery, jobStatus, assigneeFilter]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Job sheet, customer, serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-zinc-300 rounded-lg w-80 text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={jobStatus}
            onChange={(e) => setJobStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-600"
          >
            <option value="">Select job status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-600"
          >
            <option value="">Select assignee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.employee_name}>
                {employee.employee_name} ({employee.employee_role})
              </option>
            ))}
          </select>
          
          <Link href="/admin/jobs/add">
            <button className="cursor-pointer px-4 py-2 bg-[#4A70A9] text-white rounded-lg text-sm font-medium hover:bg-[#3d5c8a]">
              + Add
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">
                <div className="flex items-center gap-1">
                  Job Number
                  <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Device Brand</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Device Model</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Services</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Assignee</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">Created On</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-zinc-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job, index) => (
                <tr key={job.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-blue-600">{job.job_number}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{job.customer_name}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{job.device_brand_name || job.device_brand}</td>
                  <td className="px-4 py-3 text-zinc-600">{job.device_model_name || job.device_model || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600 max-w-xs truncate">{job.services}</td>
                  <td className="px-4 py-3">
                    {(() => {
                      const employee = getEmployeeByName(job.assignee);
                      return employee ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#4A70A9] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(employee.employee_name)}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-900">{employee.employee_name}</div>
                            <div className="text-xs text-zinc-500">{employee.employee_role}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-900">{job.assignee}</span>
                      );
                    })()
                  }</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.priority === 'High' ? 'bg-red-100 text-red-800' :
                      job.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                      job.priority === 'Low' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Open' ? 'bg-green-100 text-green-800' :
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{formatDateTime(job.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      
                      {openDropdown === index && (
                        <div className="absolute right-0 top-8 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button 
                              onClick={() => {
                                // Edit functionality can be added here
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Job
                            </button>
                            <button 
                              onClick={() => {
                                // View details functionality
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            <button 
                              onClick={() => {
                                // Duplicate functionality
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Duplicate Job
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(deleteModal.job!.id, deleteModal.job!.job_number)}
                  disabled={deletingJob === deleteModal.job.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingJob === deleteModal.job.id ? (
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
    </div>
  );
};

export default JobPage;