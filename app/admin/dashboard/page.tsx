
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Receipt, TrendingUp, Briefcase, AlertCircle, IndianRupee, ClipboardList, ListTodo, UserPlus, Calendar, Search, Plus, SlidersHorizontal, Download, Upload, FileText, List } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  icon: React.ReactNode;
  dateRange: string;
}

interface DashboardStats {
  paymentReceived: string;
  totalExpense: string;
  totalBusiness: string;
  totalDue: string;
  netProfit: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage, icon, dateRange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-3 sm:p-4 lg:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-600 min-w-0 flex-1">
          <div className="flex-shrink-0">{icon}</div>
          <span className="text-xs sm:text-sm font-medium truncate">{title}</span>
        </div>
        <span className="text-xs font-medium text-cyan-500 bg-cyan-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded flex-shrink-0 ml-2">
          {percentage}
        </span>
      </div>
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-1 sm:mb-2">{value}</div>
      <div className="text-[10px] sm:text-xs text-zinc-400 leading-tight">{dateRange}</div>
    </div>
  );
};

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

interface Customer {
  id: number;
  customer_name: string;
  customer_id: string;
}

interface Lead {
  id: number;
  lead_name: string;
  mobile_number: string;
  assignee_id: number;
  assignee_name?: string;
  lead_source: string;
  next_follow_up: string;
  comment: string;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PickupDrop {
  id: number;
  pickup_drop_id: string;
  service_type: string;
  customer_search: string;
  customer_name: string;
  mobile: string;
  device_type: string;
  device_type_name: string;
  address: string;
  assignee_id: number;
  assignee_name: string;
  schedule_date: string;
  status: string;
  created_at: string;
}

const JobsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'tasks' | 'leads' | 'pickups'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pickups, setPickups] = useState<PickupDrop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const tabs = [
    { id: 'jobs' as const, label: 'Assigned Jobs', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'tasks' as const, label: 'Assigned Task', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'leads' as const, label: 'Assigned Leads', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'pickups' as const, label: 'Assigned Scheduled Pickups', icon: <Calendar className="w-4 h-4" /> }
  ];

  const getTableConfig = () => {
    switch (activeTab) {
      case 'jobs':
        return {
          title: 'Jobs',
          searchPlaceholder: 'Job sheet, customer, serial ...',
          selectPlaceholder: 'Select job status',
          buttonText: 'New Job',
          buttonLink: '/admin/jobs/add',
          statusOptions: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
          headers: [
            'Job Sheet',
            'Customer',
            'Payment Received',
            'Payment Remaining',
            'Payment Status',
            'Device Brand',
            'Device Model',
            'Assignee',
            'Service Assignee',
            'Status'
          ]
        };
      case 'tasks':
        return {
          title: 'Tasks',
          searchPlaceholder: 'Task name, description',
          selectPlaceholder: 'Select status',
          buttonText: 'New Task',
          buttonLink: '/admin/tasks/add',
          statusOptions: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
          headers: [
            'Title',
            'Description',
            'Assignee',
            'Status',
            'Due Date',
            'Customer'
          ]
        };
      case 'leads':
        return {
          title: 'Assigned Leads',
          searchPlaceholder: 'Lead name, mobile number, email, last follow...',
          selectPlaceholder: 'Select lead status',
          buttonText: 'New Lead',
          buttonLink: '/admin/leads/add',
          showAllFilters: true,
          showExtraButtons: true,
          statusOptions: ['new', 'contacted', 'qualified', 'lost'],
          headers: [
            'Lead Name',
            'Mobile Number',
            'Assignee',
            'Lead Source',
            'Next Follow Up',
            'Last Followup Comment',
            'Status'
          ]
        };
      case 'pickups':
        return {
          title: 'Pickup/Drops',
          searchPlaceholder: 'Job number, customer',
          selectPlaceholder: 'Select status',
          buttonText: 'New Pickup',
          buttonLink: '/admin/pickupdrop/add',
          statusOptions: ['scheduled', 'in_progress', 'completed', 'cancelled'],
          headers: [
            'Job Number',
            'Customer',
            'Device Type',
            'Address',
            'Assignee',
            'Status',
            'Pick Up Time'
          ]
        };
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/jobs');
      const data = await response.json();
      
      if (response.ok) {
        const jobsData = data.jobs || [];
        const filteredJobs = jobsData.filter((job: Job) => 
          job.status === 'Pending' || job.status === 'In Progress'
        );
        setJobs(filteredJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tasks');
      const data = await response.json();
      
      if (response.ok) {
        const tasksData = data.tasks || [];
        const filteredTasks = tasksData.filter((task: Task) => 
          task.task_status === 'Pending' || task.task_status === 'In Progress'
        );
        setTasks(filteredTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      const data = await response.json();
      
      if (response.ok) {
        const leadsData = data || [];
        const filteredLeads = leadsData.filter((lead: Lead) => 
          lead.status === 'new' || lead.status === 'contacted'
        );
        setLeads(filteredLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pickupdrop');
      const data = await response.json();
      
      if (response.ok) {
        const pickupsData = data.pickupDrops || [];
        const filteredPickups = pickupsData.filter((pickup: PickupDrop) => 
          pickup.status === 'scheduled' || pickup.status === 'in_progress'
        );
        setPickups(filteredPickups);
      }
    } catch (error) {
      console.error('Error fetching pickups:', error);
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

  const getAssigneeName = (assigneeId: number) => {
    const user = users.find(u => u.id === assigneeId);
    return user ? `${user.name} (${user.role})` : assigneeId.toString();
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

  useEffect(() => {
    setSelectedStatus('');
    if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'tasks') {
      fetchTasks();
    } else if (activeTab === 'leads') {
      fetchLeads();
    } else if (activeTab === 'pickups') {
      fetchPickups();
    }
    fetchEmployees();
    fetchCustomers();
    fetchUsers();
  }, [activeTab]);

  const config = getTableConfig();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200">
      {/* Tabs Header */}
      <div className="border-b border-zinc-200 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 lg:px-5 py-2 sm:py-2.5 lg:py-3.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap min-w-0 ${
                activeTab === tab.id
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <div className="flex-shrink-0">{tab.icon}</div>
              <span className="hidden sm:inline lg:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[1] || tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-zinc-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-zinc-900">{config.title}</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Search Input - Full width on mobile */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-zinc-400" />
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-full sm:w-64 lg:w-80"
              />
            </div>
            
            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent flex-1 sm:flex-initial sm:min-w-[140px] lg:min-w-[180px]">
                <option value="">{config.selectPlaceholder}</option>
                {config.statusOptions?.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              {/* {config.showAllFilters && (
                <button className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-1 sm:gap-2 font-medium">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">All Filters</span>
                  <span className="sm:hidden">Filters</span>
                </button>
              )}
              
              {config.showExtraButtons && (
                <button className="p-2 sm:p-2.5 border border-zinc-300 rounded-md text-zinc-700 hover:bg-zinc-50 flex-shrink-0">
                  <Download className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              )}
               */}
              <Link href={config.buttonLink} className="px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-[#4A70A9] text-white rounded-md text-xs sm:text-sm hover:bg-[#3d5c8c] flex items-center gap-1 sm:gap-2 font-medium shadow-sm flex-shrink-0">
                <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden xs:inline">{config.buttonText}</span>
                <span className="xs:hidden">New</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[800px]">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {config.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'jobs' ? (
              loading ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    Loading...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    No pending or in-progress jobs
                  </td>
                </tr>
              ) : (
                jobs.filter(job => {
                  const matchesSearch = job.job_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (job.device_brand && job.device_brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (job.device_model && job.device_model.toLowerCase().includes(searchQuery.toLowerCase()));
                  const matchesStatus = !selectedStatus || job.status === selectedStatus;
                  return matchesSearch && matchesStatus;
                }).map((job) => {
                  const employee = getEmployeeByName(job.assignee);
                  return (
                    <tr key={job.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[#4A70A9]">
                        {job.job_number}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {job.customer_name}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        ₹0
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        ₹0
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {job.device_brand_name || job.device_brand}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {job.device_model_name || job.device_model || '-'}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {employee ? (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                              {getInitials(employee.employee_name)}
                            </div>
                            <div className="hidden sm:block">
                              <div className="text-zinc-900 font-medium text-xs">{employee.employee_name}</div>
                              <div className="text-zinc-500 text-xs">{employee.employee_role}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-900">{job.assignee}</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {employee ? (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                              {getInitials(employee.employee_name)}
                            </div>
                            <div className="hidden sm:block">
                              <div className="text-zinc-900 font-medium text-xs">{employee.employee_name}</div>
                              <div className="text-zinc-500 text-xs">{employee.employee_role}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-900">{job.assignee}</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )
            ) : activeTab === 'tasks' ? (
              loading ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    Loading...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    No pending or in-progress tasks
                  </td>
                </tr>
              ) : (
                tasks.filter(task => {
                  const matchesSearch = task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (task.task_description && task.task_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (task.assignee_name && task.assignee_name.toLowerCase().includes(searchQuery.toLowerCase()));
                  const matchesStatus = !selectedStatus || task.task_status === selectedStatus;
                  return matchesSearch && matchesStatus;
                }).map((task) => {
                  const employee = employees.find(emp => emp.id === task.assignee_id);
                  return (
                    <tr key={task.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        <div className="font-medium">{task.task_title}</div>
                        <div className="text-xs text-zinc-500">{task.task_id}</div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-zinc-900">
                        <div className="max-w-xs truncate">
                          {task.task_description || '-'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {employee ? (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                              {getInitials(employee.employee_name)}
                            </div>
                            <div className="hidden sm:block">
                              <div className="text-zinc-900 font-medium text-xs">{employee.employee_name}</div>
                              <div className="text-zinc-500 text-xs">{employee.employee_role}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-900">{task.assignee_name || task.assignee_id}</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.task_status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                          task.task_status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.task_status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {formatDateTime(task.due_date)}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {task.customer_id ? getCustomerName(task.customer_id) : '-'}
                      </td>
                    </tr>
                  );
                })
              )
            ) : activeTab === 'leads' ? (
              loading ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    No new or contacted leads
                  </td>
                </tr>
              ) : (
                leads.filter(lead => {
                  const matchesSearch = lead.lead_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (lead.mobile_number && lead.mobile_number.includes(searchQuery)) ||
                    (lead.comment && lead.comment.toLowerCase().includes(searchQuery.toLowerCase()));
                  const matchesStatus = !selectedStatus || lead.status === selectedStatus;
                  return matchesSearch && matchesStatus;
                }).map((lead) => {
                  return (
                    <tr key={lead.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {lead.lead_name}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {lead.mobile_number || '-'}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {getAssigneeName(lead.assignee_id)}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {lead.lead_source || '-'}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {lead.next_follow_up ? formatDateTime(lead.next_follow_up) : '-'}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-zinc-900">
                        <div className="max-w-xs truncate">
                          {lead.comment || '-'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status || 'new'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )
            ) : activeTab === 'pickups' ? (
              loading ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    Loading...
                  </td>
                </tr>
              ) : pickups.length === 0 ? (
                <tr>
                  <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                    No scheduled or in-progress pickups
                  </td>
                </tr>
              ) : (
                pickups.filter(pickup => {
                  const matchesSearch = (pickup.pickup_drop_id && pickup.pickup_drop_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (pickup.customer_name && pickup.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (pickup.mobile && pickup.mobile.includes(searchQuery));
                  const matchesStatus = !selectedStatus || pickup.status === selectedStatus;
                  return matchesSearch && matchesStatus;
                }).map((pickup) => {
                  return (
                    <tr key={pickup.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        <div className="font-medium">{pickup.pickup_drop_id}</div>
                        <div className="text-xs text-zinc-500 capitalize">{pickup.service_type}</div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        <div className="font-medium">{pickup.customer_name || 'Unknown Customer'}</div>
                        <div className="text-xs text-zinc-500">+91 {pickup.mobile}</div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {pickup.device_type_name || pickup.device_type}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-zinc-900">
                        <div className="max-w-xs truncate">
                          {pickup.address}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {pickup.assignee_name || (pickup.assignee_id ? `User ${pickup.assignee_id}` : '-')}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pickup.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          pickup.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pickup.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-900">
                        {formatDateTime(pickup.schedule_date)}
                      </td>
                    </tr>
                  );
                })
              )
            ) : (
              <tr>
                <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    paymentReceived: "₹0",
    totalExpense: "₹0",
    totalBusiness: "₹0",
    totalDue: "₹0",
    netProfit: "₹0"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
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

    fetchDashboardStats();
  }, []);

  const statsConfig = [
    {
      title: "Payment Received",
      value: stats.paymentReceived,
      percentage: "- 0%",
      icon: <Receipt className="w-4 h-4" />,
      dateRange: ""
    },
    {
      title: "Total Expense",
      value: stats.totalExpense,
      percentage: "- 0%",
      icon: <TrendingUp className="w-4 h-4" />,
      dateRange: ""
    },
    {
      title: "Total Business",
      value: stats.totalBusiness,
      percentage: "- 0%",
      icon: <Briefcase className="w-4 h-4" />,
      dateRange: ""
    },
    {
      title: "Total Due Amount",
      value: stats.totalDue,
      percentage: "- 0%",
      icon: <AlertCircle className="w-4 h-4" />,
      dateRange: ""
    },
    {
      title: "Net Profit",
      value: stats.netProfit,
      percentage: "- 0%",
      icon: <IndianRupee className="w-4 h-4" />,
      dateRange: ""
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Stats Grid - Responsive layout */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-10">
          {loading ? (
            // Loading skeleton
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-3 sm:p-4 lg:p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            statsConfig.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                percentage={stat.percentage}
                icon={stat.icon}
                dateRange={stat.dateRange}
              />
            ))
          )}
        </div>

        <JobsSection />
      </div>
    </div>
  );
}