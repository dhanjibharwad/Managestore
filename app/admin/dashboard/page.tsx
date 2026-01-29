
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

const JobsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'tasks' | 'leads' | 'pickups'>('jobs');

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
                className="pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent w-full sm:w-64 lg:w-80"
              />
            </div>
            
            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select className="px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent flex-1 sm:flex-initial sm:min-w-[140px] lg:min-w-[180px]">
                <option>{config.selectPlaceholder}</option>
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
            <tr>
              <td colSpan={config.headers.length} className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 text-center text-zinc-400 text-sm sm:text-base">
                No data
              </td>
            </tr>
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