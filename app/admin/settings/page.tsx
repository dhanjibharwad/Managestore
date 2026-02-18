"use client"

import React, { useState } from 'react';
import { 
  Building2, Settings, FileText, Hash, Bell, Mail, 
  Percent, Wrench, Printer, Palette, DollarSign, CreditCard, 
  ShoppingCart, MessageSquare, Link as LinkIcon, Edit2, Trash2, Plus
} from 'lucide-react';

interface SettingsMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PaymentType {
  id: number;
  name: string;
  payments: number;
  updatedOn: string;
  createdOn: string;
}

const settingsMenu: SettingsMenuItem[] = [
  { id: 'business-info', label: 'Business Information', icon: <Building2 className="w-4 h-4" /> },
  // { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'terms', label: 'Terms and Conditions', icon: <FileText className="w-4 h-4" /> },
  { id: 'sequence', label: 'Sequence Settings', icon: <Hash className="w-4 h-4" /> },
  { id: 'reminder', label: 'Reminder Settings', icon: <Bell className="w-4 h-4" /> },
  { id: 'email', label: 'Email Settings', icon: <Mail className="w-4 h-4" /> },
  { id: 'tax', label: 'Tax Settings', icon: <Percent className="w-4 h-4" /> },
  { id: 'workflow', label: 'Workflow Settings', icon: <Wrench className="w-4 h-4" /> },
  { id: 'print', label: 'Print Settings', icon: <Printer className="w-4 h-4" /> },
  { id: 'theme', label: 'Theme Layout Settings', icon: <Palette className="w-4 h-4" /> },
  { id: 'expense', label: 'Expense Category', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment Types', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'subscription', label: 'Subscription', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-4 h-4" /> },
];

const mockPaymentTypes: PaymentType[] = [
  { id: 1, name: 'Phone Pay (Automatic)', payments: 0, updatedOn: '25-Nov-2025 11:56 AM', createdOn: '25-Nov-2025 11:56 AM' },
  { id: 2, name: 'Card', payments: 0, updatedOn: '25-Nov-2025 11:56 AM', createdOn: '25-Nov-2025 11:56 AM' },
  { id: 3, name: 'Cheque', payments: 0, updatedOn: '25-Nov-2025 11:56 AM', createdOn: '25-Nov-2025 11:56 AM' },
  { id: 4, name: 'Online', payments: 0, updatedOn: '25-Nov-2025 11:56 AM', createdOn: '25-Nov-2025 11:56 AM' },
  { id: 5, name: 'Cash', payments: 1, updatedOn: '25-Nov-2025 11:56 AM', createdOn: '25-Nov-2025 11:56 AM' },
];

export default function BusinessSettingsPage() {
  const [activeSection, setActiveSection] = useState('payment');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentTypes] = useState<PaymentType[]>(mockPaymentTypes);

  const renderContent = () => {
    switch (activeSection) {
      case 'payment':
        return (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b border-zinc-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">Payment Type</h2>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-zinc-100 rounded-md border border-zinc-300">
                    <Settings className="w-5 h-5 text-zinc-600" />
                  </button>
                  <button className="p-2 hover:bg-zinc-100 rounded-md border border-zinc-300">
                    <FileText className="w-5 h-5 text-zinc-600" />
                  </button>
                  <button className="px-4 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8c] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name, mobile, email, etc"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Payments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Updated On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Created On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentTypes
                    .filter(type => 
                      type.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((type) => (
                      <tr key={type.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                        <td className="px-6 py-4 text-sm text-zinc-900">{type.name}</td>
                        <td className="px-6 py-4 text-sm text-zinc-900">{type.payments}</td>
                        <td className="px-6 py-4 text-sm text-zinc-900">{type.updatedOn}</td>
                        <td className="px-6 py-4 text-sm text-zinc-900">{type.createdOn}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-zinc-100 rounded">
                              <Edit2 className="w-4 h-4 text-zinc-600" />
                            </button>
                            <button className="p-1.5 hover:bg-zinc-100 rounded">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'business-info':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Business Information</h2>
            <p className="text-zinc-600">Configure your business details here.</p>
          </div>
        );

      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Settings</h2>
            <p className="text-zinc-600">General settings configuration.</p>
          </div>
        );

      case 'terms':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Terms and Conditions</h2>
            <p className="text-zinc-600">Manage your terms and conditions.</p>
          </div>
        );

      case 'sequence':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Sequence Settings</h2>
            <p className="text-zinc-600">Configure sequence numbering for documents.</p>
          </div>
        );

      case 'reminder':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Reminder Settings</h2>
            <p className="text-zinc-600">Set up automated reminders.</p>
          </div>
        );

      case 'email':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Email Settings</h2>
            <p className="text-zinc-600">Configure email notifications and templates.</p>
          </div>
        );

      case 'tax':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Tax Settings</h2>
            <p className="text-zinc-600">Manage tax rates and configurations.</p>
          </div>
        );

      case 'workflow':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Workflow Settings</h2>
            <p className="text-zinc-600">Configure workflow automation.</p>
          </div>
        );

      case 'print':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Print Settings</h2>
            <p className="text-zinc-600">Customize print templates and layouts.</p>
          </div>
        );

      case 'theme':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Theme Layout Settings</h2>
            <p className="text-zinc-600">Customize the appearance of your application.</p>
          </div>
        );

      case 'expense':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Expense Category</h2>
            <p className="text-zinc-600">Manage expense categories.</p>
          </div>
        );

      case 'subscription':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Subscription</h2>
            <p className="text-zinc-600">Manage your subscription plan.</p>
          </div>
        );

      case 'sms':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">SMS</h2>
            <p className="text-zinc-600">Configure SMS notifications.</p>
          </div>
        );

      case 'integrations':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Integrations</h2>
            <p className="text-zinc-600">Connect with third-party services.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-zinc-900">Business Settings</h1>
      </div>

      <div className="flex h-[calc(100vh-180px)]">
        {/* Sub-Sidebar */}
        <div className="w-64 bg-white border-r border-zinc-200 overflow-y-auto">
          <nav className="p-2">
            {settingsMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-[#4A70A9] border-r-2 border-[#4A70A9]'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
