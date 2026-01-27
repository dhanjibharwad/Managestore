'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Info, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
  email_id: string;
  customer_type: string;
}

export default function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const [contractId, setContractId] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [autoRenew, setAutoRenew] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; filename: string; size: number }>>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [amcId, setAmcId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    assignee: '',
    amcType: '',
    devicesCovered: '',
    responseTimeValue: '',
    responseTimeUnit: '',
    numberOfServices: '',
    serviceOptions: '',
    paymentFrequency: '',
    amount: '',
    contractRemark: '',
    termsConditions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setAmcId(resolvedParams.id);
      fetchContract(resolvedParams.id);
      fetchUserSession();
      fetchUsers();
      fetchCustomers();
    };
    getParams();
  }, [params]);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setCompanyId(data.user.companyId);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchContract = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/amcs/${id}`);
      const data = await response.json();
      if (response.ok && data.contract) {
        const contract = data.contract;
        setContractId(contract.contract_number);
        setContractStartDate(contract.contract_start_date ? contract.contract_start_date.split('T')[0] : '');
        setContractEndDate(contract.contract_end_date ? contract.contract_end_date.split('T')[0] : '');
        setAutoRenew(contract.auto_renew || false);
        
        setFormData({
          customerName: contract.customer_name || '',
          assignee: contract.assignee || '',
          amcType: contract.amc_type || '',
          devicesCovered: contract.devices_covered?.toString() || '',
          responseTimeValue: contract.response_time_value?.toString() || '',
          responseTimeUnit: contract.response_time_unit || '',
          numberOfServices: contract.number_of_services?.toString() || '',
          serviceOptions: contract.service_options || '',
          paymentFrequency: contract.payment_frequency || '',
          amount: contract.amount?.toString() || '',
          contractRemark: contract.contract_remark || '',
          termsConditions: contract.terms_conditions || ''
        });
      }
    } catch (error) {
      console.error('Error fetching contract:', error);
      showToast('Failed to load contract', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: nextToastId, message, type };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    if (!formData.assignee) newErrors.assignee = 'Assignee is required';
    if (!formData.amcType) newErrors.amcType = 'AMC type is required';
    if (!contractStartDate) newErrors.contractStartDate = 'Start date is required';
    if (!contractEndDate) newErrors.contractEndDate = 'End date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!companyId) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/amcs/${amcId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          contractNumber: contractId,
          customerName: formData.customerName,
          assignee: formData.assignee,
          amcType: formData.amcType,
          contractStartDate: contractStartDate || null,
          contractEndDate: contractEndDate || null,
          devicesCovered: formData.devicesCovered ? parseInt(formData.devicesCovered) : null,
          responseTimeValue: formData.responseTimeValue ? parseInt(formData.responseTimeValue) : null,
          responseTimeUnit: formData.responseTimeUnit || null,
          numberOfServices: formData.numberOfServices ? parseInt(formData.numberOfServices) : null,
          serviceOptions: formData.serviceOptions || null,
          autoRenew,
          paymentFrequency: formData.paymentFrequency || null,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          contractRemark: formData.contractRemark || null,
          termsConditions: formData.termsConditions || null,
          images: uploadedFiles.map(f => f.url)
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Contract updated successfully!', 'success');
        setTimeout(() => window.location.href = '/admin/amcs', 2000);
      } else {
        showToast(data.error || 'Failed to update contract', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('An error occurred while updating the contract', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.files) {
        setUploadedFiles(prev => [...prev, ...data.files]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Contract Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Edit Contract : <span className="text-gray-600">{contractId}</span>
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8c] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Select customer</option>
                  {Array.isArray(customers) && customers.map(cust => (
                    <option key={cust.id} value={cust.id}>
                      {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                    </option>
                  ))}
                </select>
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Assignee <span className="text-red-500">*</span>
                  <Info size={14} className="text-gray-400" />
                </label>
                <select 
                  value={formData.assignee}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Select assignee</option>
                  {Array.isArray(users) && users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
                {errors.assignee && <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>}
              </div>

              {/* AMC Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AMC Type <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.amcType}
                  onChange={(e) => handleInputChange('amcType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Select AMC type</option>
                  <option value="AMC">AMC</option>
                  <option value="CMC">CMC</option>
                </select>
                {errors.amcType && <p className="text-red-500 text-xs mt-1">{errors.amcType}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contract Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={contractStartDate}
                  onChange={(e) => setContractStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
                {errors.contractStartDate && <p className="text-red-500 text-xs mt-1">{errors.contractStartDate}</p>}
              </div>

              {/* Contract End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={contractEndDate}
                  onChange={(e) => setContractEndDate(e.target.value)}
                  min={contractStartDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
                {errors.contractEndDate && <p className="text-red-500 text-xs mt-1">{errors.contractEndDate}</p>}
              </div>
            </div>
          </div>

          {/* Coverage Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Coverage Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Number Of Devices Covered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Of Devices Covered
                </label>
                <input
                  type="text"
                  placeholder="Eg: 5, 10 etc..."
                  value={formData.devicesCovered}
                  onChange={(e) => handleInputChange('devicesCovered', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Response Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Response Time
                  <Info size={14} className="text-gray-400" />
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Eg: 2 hours, 1 day, 2 days"
                    value={formData.responseTimeValue}
                    onChange={(e) => handleInputChange('responseTimeValue', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                  <select 
                    value={formData.responseTimeUnit}
                    onChange={(e) => handleInputChange('responseTimeUnit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="HOURS">HOURS</option>
                    <option value="DAYS">DAYS</option>
                    <option value="WEEK">WEEK</option>
                  </select>
                </div>
              </div>

              {/* Number Of Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Number Of Services
                  <Info size={14} className="text-gray-400" />
                </label>
                <input
                  type="text"
                  placeholder="Eg: 5, 10 etc..."
                  value={formData.numberOfServices}
                  onChange={(e) => handleInputChange('numberOfServices', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  Service Options
                  <Info size={14} className="text-gray-400" />
                </label>
                <select 
                  value={formData.serviceOptions}
                  onChange={(e) => handleInputChange('serviceOptions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Select service options</option>
                  <option value="On Site">On Site</option>
                  <option value="Carry in">Carry in</option>
                </select>
              </div>

              {/* Contract Auto Renew */}
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${autoRenew ? 'bg-[#4A70A9]' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoRenew ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Contract Auto Renew
                    <Info size={14} className="text-gray-400" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Payment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Payment Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Frequency
                </label>
                <select 
                  value={formData.paymentFrequency}
                  onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Eg: monthly, quarterly, annual, etc.</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter contract amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            {/* Contract Remark */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Remark
              </label>
              <div className="border border-gray-300 rounded-md">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <div className="text-sm border-none focus:outline-none bg-transparent">
                    <option>Normal text</option>
                  </div>
                </div>
                <textarea
                  className="w-full px-3 py-2 focus:outline-none resize-none"
                  rows={4}
                  placeholder="Type here..."
                  value={formData.contractRemark}
                  onChange={(e) => handleInputChange('contractRemark', e.target.value)}
                  maxLength={50000}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
            </div>
          </div>

          {/* Upload Images Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Upload Images
            </h2>
            
            <div 
              className="border-2 border-dashed border-[#4A70A9] rounded-lg p-12 text-center bg-blue-50/30 cursor-pointer hover:bg-blue-50/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="bg-[#4A70A9] text-white p-4 rounded-full mb-4">
                  <Upload size={32} />
                </div>
                <p className="text-[#4A70A9] font-medium mb-2">
                  {uploading ? 'Uploading...' : 'Take A Photo With Your Camera Or Choose A File From Your Device'}
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, BMP, WEBP, AND PDF FILES
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/bmp,image/webp,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms and Conditions Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Terms and Conditions
            </h2>
            
            <div className="border border-gray-300 rounded-md">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                <div className="text-sm border-none focus:outline-none bg-transparent">
                  <option>Normal text</option>
                </div>
              </div>
              <textarea
                className="w-full px-3 py-2 focus:outline-none resize-none"
                rows={4}
                placeholder="Type text here"
                value={formData.termsConditions}
                onChange={(e) => handleInputChange('termsConditions', e.target.value)}
                maxLength={50000}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
          </div>
        </div>
      </div>
    </div>
  );
}