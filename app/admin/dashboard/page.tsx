
"use client"

import React, { useState } from 'react';
import { Receipt, TrendingUp, Briefcase, AlertCircle, DollarSign, ClipboardList, ListTodo, UserPlus, Calendar, Search, Plus, SlidersHorizontal, Download, Upload, FileText, List } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  icon: React.ReactNode;
  dateRange: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage, icon, dateRange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-zinc-600">
          {icon}
          <span className="text-xs sm:text-sm font-medium">{title}</span>
        </div>
        <span className="text-xs font-medium text-cyan-500 bg-cyan-50 px-2.5 py-1 rounded">
          {percentage}
        </span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-1 sm:mb-2">{value}</div>
      <div className="text-[10px] sm:text-xs text-zinc-400">{dateRange}</div>
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
      <div className="border-b border-zinc-200 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2 p-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">{config.title}</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                className="pl-11 pr-4 py-2.5 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent w-full sm:w-64 lg:w-80"
              />
            </div>
            <select className="px-3 sm:px-4 py-2.5 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent w-full sm:w-auto sm:min-w-[180px]">
              <option>{config.selectPlaceholder}</option>
            </select>
            {config.showAllFilters && (
              <button className="px-3 sm:px-4 py-2.5 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 font-medium">
                <SlidersHorizontal className="w-4 h-4" />
                All Filters
              </button>
            )}
            {config.showExtraButtons && (
              <>
                <button className="p-2.5 border border-zinc-300 rounded-md text-zinc-700 hover:bg-zinc-50">
                  <Download className="w-5 h-5" />
                </button>
              </>
            )}
            <button className="px-4 sm:px-5 py-2.5 bg-[#4A70A9] text-white rounded-md text-xs sm:text-sm hover:bg-[#3d5c8c] flex items-center gap-2 font-medium shadow-sm">
              <Plus className="w-5 h-5" />
              {config.buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {config.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={config.headers.length} className="px-6 py-20 text-center text-zinc-400 text-base">
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
  const stats = [
    {
      title: "Payment Received",
      value: "0.00",
      percentage: "- 0%",
      icon: <Receipt className="w-4 h-4" />,
      dateRange: "From 2025-11-04 - 2025-12-04"
    },
    {
      title: "Total Expense",
      value: "0.00",
      percentage: "- 0%",
      icon: <TrendingUp className="w-4 h-4" />,
      dateRange: "From 2025-11-04 - 2025-12-04"
    },
    {
      title: "Total Business",
      value: "0.00",
      percentage: "- 0%",
      icon: <Briefcase className="w-4 h-4" />,
      dateRange: "From 2025-11-04 - 2025-12-04"
    },
    {
      title: "Total Due Amount",
      value: "0.00",
      percentage: "- 0%",
      icon: <AlertCircle className="w-4 h-4" />,
      dateRange: "From 2025-11-04 - 2025-12-04"
    },
    {
      title: "Net Profit",
      value: "0.00",
      percentage: "- 0%",
      icon: <DollarSign className="w-4 h-4" />,
      dateRange: "From 2025-11-04 - 2025-12-04"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              percentage={stat.percentage}
              icon={stat.icon}
              dateRange={stat.dateRange}
            />
          ))}
        </div>

        <JobsSection />
      </div>
    </div>
  );
}