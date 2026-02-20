
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Eye, EyeOff, Upload, X, Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface DeviceType {
  id: number;
  name: string;
}

interface DeviceBrand {
  id: number;
  name: string;
  device_type_id: number;
}

interface DeviceModel {
  id: number;
  name: string;
  device_brand_id: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
  email_id: string;
  customer_type: string;
}

interface StorageLocation {
  id: number;
  name: string;
}

interface DeviceColor {
  id: number;
  name: string;
  color_code: string;
}



interface FormData {
  customerName: string;
  source: string;
  referredBy: string;
  serviceType: string;
  jobType: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  serialNumber: string;
  accessories: string;
  storageLocation: string;
  deviceColor: string;
  devicePassword: string;
  services: string;
  tags: string;
  hardwareConfig: string;
  serviceAssessment: string;
  priority: string;
  assignee: string;
  initialQuotation: string;
  dueDate: string;
  dealerJobId: string;
  termsConditions: string;
}

export default function JobSheetForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceBrands, setDeviceBrands] = useState<DeviceBrand[]>([]);
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<DeviceBrand[]>([]);
  const [filteredModels, setFilteredModels] = useState<DeviceModel[]>([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [deviceColors, setDeviceColors] = useState<DeviceColor[]>([]);

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    source: 'Google',
    referredBy: '',
    serviceType: 'Carried By User',
    jobType: 'No Warranty',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    serialNumber: '',
    accessories: '',
    storageLocation: '',
    deviceColor: '',
    devicePassword: '',
    services: '',
    tags: '',
    hardwareConfig: '',
    serviceAssessment: '',
    priority: 'Regular',
    assignee: '',
    initialQuotation: '',
    dueDate: '',
    dealerJobId: '',
    termsConditions: ''
  });

  useEffect(() => {
    fetch('/api/devices/types')
      .then(res => res.json())
      .then(data => setDeviceTypes(data));
    
    fetch('/api/devices/brands')
      .then(res => res.json())
      .then(data => setDeviceBrands(data));
    
    fetch('/api/devices/models')
      .then(res => res.json())
      .then(data => setDeviceModels(data));
    
    // Fetch customers
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.customers) {
          setCustomers(data.customers);
        }
      })
      .catch(error => console.error('Error fetching customers:', error));
    
    // Fetch employees
    fetch('/api/admin/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) {
          setEmployees(data.employees);
        }
      })
      .catch(error => console.error('Error fetching employees:', error));
    
    // Fetch storage locations
    fetch('/api/admin/storage-locations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStorageLocations(data);
        }
      })
      .catch(error => console.error('Error fetching storage locations:', error));
    
    // Fetch device colors
    fetch('/api/devices/colors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDeviceColors(data);
        }
      })
      .catch(error => console.error('Error fetching device colors:', error));
  }, []);

  useEffect(() => {
    if (formData.deviceType) {
      const filtered = deviceBrands.filter(brand => brand.device_type_id === parseInt(formData.deviceType));
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
    setFormData(prev => ({ ...prev, deviceBrand: '', deviceModel: '' }));
    setFilteredModels([]);
  }, [formData.deviceType, deviceBrands]);

  useEffect(() => {
    if (formData.deviceBrand) {
      const filtered = deviceModels.filter(model => model.device_brand_id === parseInt(formData.deviceBrand));
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
    setFormData(prev => ({ ...prev, deviceModel: '' }));
  }, [formData.deviceBrand, deviceModels]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
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

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim() || !formData.deviceType) {
      showToast('Please enter a brand name', 'warning');
      return;
    }
    
    try {
      const response = await fetch('/api/devices/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, device_type_id: parseInt(formData.deviceType) })
      });
      
      if (response.ok) {
        const newBrand = await response.json();
        setDeviceBrands([...deviceBrands, newBrand]);
        setFilteredBrands([...filteredBrands, newBrand]);
        setFormData({ ...formData, deviceBrand: newBrand.id.toString() });
        setNewBrandName('');
        setShowBrandModal(false);
        showToast('Brand added successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to add brand', 'error');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      showToast('An error occurred while adding brand', 'error');
    }
  };

  const handleAddModel = async () => {
    if (!newModelName.trim() || !formData.deviceBrand) {
      showToast('Please enter a model name', 'warning');
      return;
    }
    
    try {
      const response = await fetch('/api/devices/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModelName, device_brand_id: parseInt(formData.deviceBrand) })
      });
      
      if (response.ok) {
        const newModel = await response.json();
        setDeviceModels([...deviceModels, newModel]);
        setFilteredModels([...filteredModels, newModel]);
        setFormData({ ...formData, deviceModel: newModel.id.toString() });
        setNewModelName('');
        setShowModelModal(false);
        showToast('Model added successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to add model', 'error');
      }
    } catch (error) {
      console.error('Error adding model:', error);
      showToast('An error occurred while adding model', 'error');
    }
  };







  const handleSubmit = async () => {
    if (!formData.customerName || !formData.deviceType || !formData.deviceBrand || !formData.services || !formData.assignee) {
      showToast('Please fill in all required fields: Customer Name, Device Type, Device Brand, Services, and Assignee', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let uploadedFileUrls: string[] = [];
      
      // Upload files if any
      if (uploadedFiles.length > 0) {
        const fileFormData = new FormData();
        uploadedFiles.forEach(file => {
          fileFormData.append('files', file);
        });
        
        const uploadResponse = await fetch('/api/admin/jobs/upload', {
          method: 'POST',
          body: fileFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedFileUrls = uploadResult.files.map((f: any) => f.url);
        }
      }
      
      // Create job with file URLs
      const jobData = {
        ...formData,
        images: uploadedFileUrls
      };
      
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`Job created successfully! Job Number: ${result.job.job_number}`, 'success');
        setTimeout(() => router.push('/technician/jobs'), 2000);
      } else {
        showToast(result.error || 'Failed to create job', 'error');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      showToast('An error occurred while creating the job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All data will be lost.')) {
      setFormData({
        customerName: '',
        source: 'Google',
        referredBy: '',
        serviceType: 'Carried By User',
        jobType: 'No Warranty',
        deviceType: '',
        deviceBrand: '',
        deviceModel: '',
        serialNumber: '',
        accessories: '',
        storageLocation: '',
        deviceColor: '',
        devicePassword: '',
        services: '',
        tags: '',
        hardwareConfig: '',
        serviceAssessment: '',
        priority: 'Regular',
        assignee: '',
        initialQuotation: '',
        dueDate: '',
        dealerJobId: '',
        termsConditions: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-full bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Job :</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-full">
          {/* Basic Information */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  >
                    <option value="">Select customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.customer_name}>
                        {customer.customer_name} - {customer.customer_id} ({customer.mobile_number})
                      </option>
                    ))}
                  </select>
                  <Link href="/admin/customers/add">
                    <button 
                      type="button"
                      className="w-10 h-10 flex items-center justify-center bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded transition-colors flex-shrink-0"
                    >
                      <Plus size={20} />
                    </button>
                  </Link>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option>Google</option>
                  <option>Just Dial</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                <select
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Select customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.customer_name}>
                      {customer.customer_name} - {customer.customer_id} ({customer.mobile_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option>Carried By User</option>
                  <option>Pickup</option>
                  <option>On-site</option>
                  <option>Courier</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full lg:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
              >
                <option>No Warranty</option>
                <option>Free</option>
                <option>Under Warranty</option>
                <option>AMC</option>
              </select>
            </div>
          </section>

          {/* Device Information */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Device Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Device type</option>
                  {deviceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Brand <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="deviceBrand"
                    value={formData.deviceBrand}
                    onChange={handleInputChange}
                    disabled={!formData.deviceType}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select device brand</option>
                    {filteredBrands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowBrandModal(true)}
                    disabled={!formData.deviceType}
                    className="px-3 py-2 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Model</label>
                <div className="flex gap-2">
                  <select
                    name="deviceModel"
                    value={formData.deviceModel}
                    onChange={handleInputChange}
                    disabled={!formData.deviceBrand}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select device model</option>
                    {filteredModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowModelModal(true)}
                    disabled={!formData.deviceBrand}
                    className="px-3 py-2 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial / IMEI Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="Type device serial number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
                <input
                  type="text"
                  name="accessories"
                  value={formData.accessories}
                  onChange={handleInputChange}
                  placeholder="Select or search for accessories"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                <select
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Select storage location</option>
                  {storageLocations.map(location => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Color</label>
                <select
                  name="deviceColor"
                  value={formData.deviceColor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Select device color</option>
                  {deviceColors.map(color => (
                    <option key={color.id} value={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="devicePassword"
                    value={formData.devicePassword}
                    onChange={handleInputChange}
                    placeholder="Device password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Service Information */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  placeholder="Select or search for services"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Eg: 4GB RAM, 1TB HDD etc, type name and press enter button to create"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Configuration</label>
              <textarea
                name="hardwareConfig"
                value={formData.hardwareConfig}
                onChange={handleInputChange}
                placeholder="Enter hardware configuration details (e.g: RAM, HDD Serial, Motherboard)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Assessment</label>
              <div className="border border-gray-300 rounded">
                {/* <div className="bg-gray-50 border-b px-3 py-2 flex items-center gap-2">
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                </div> */}
                <textarea
                  name="serviceAssessment"
                  value={formData.serviceAssessment}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 focus:outline-none resize-none"
                  placeholder="Describe the service assessment..."
                />
                <div className="px-3 py-1 text-xs text-gray-500 border-t">
                  Max Allowed Characters 50000
                </div>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option>Regular</option>
                  <option>High</option>
                  <option>Urgent</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee <span className="text-red-500">*</span>
                </label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                >
                  <option value="">Select assignee name</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.employee_name}>
                      {employee.employee_name} ({employee.employee_role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quotation</label>
                <input
                  type="text"
                  name="initialQuotation"
                  value={formData.initialQuotation}
                  onChange={handleInputChange}
                  placeholder="2000-5000 etc"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Job ID</label>
              <input
                type="text"
                name="dealerJobId"
                value={formData.dealerJobId}
                onChange={handleInputChange}
                placeholder="Dealer job id if any"
                className="w-full lg:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
              />
            </div>
          </section>

          {/* Upload Images */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Upload Images</h2>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4A70A9] cursor-pointer transition-colors"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-[#E8EEF7] rounded-full flex items-center justify-center mb-3">
                  <Upload className="text-[#4A70A9]" size={28} />
                </div>
                <p className="text-[#4A70A9] font-medium mb-1">
                  Take A Photo With Your Camera Or Choose A File From Your Device
                </p>
                <p className="text-sm text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES (Max 10MB each)</p>
              </div>
            </div>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/bmp,image/webp,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Uploaded Files:</h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        {file.type.startsWith('image/') ? '🖼️' : '📄'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Terms and Conditions */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Terms and Conditions</h2>
            <div className="border border-gray-300 rounded">
              {/* <div className="bg-gray-50 border-b px-3 py-2 flex items-center gap-2">
                <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm underline">U</button>
              </div> */}
              <textarea
                name="termsConditions"
                value={formData.termsConditions}
                onChange={handleInputChange}
                rows={4}
                placeholder="Type text here"
                className="w-full px-3 py-2 focus:outline-none resize-none"
              />
              <div className="px-3 py-1 text-xs text-gray-500 border-t">
                Max Allowed Characters 50000
              </div>
            </div>
          </section>
        </div>
      </div>

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

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Device Brand</h3>
            <input
              type="text"
              placeholder="Enter brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowBrandModal(false); setNewBrandName(''); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBrand}
                disabled={!newBrandName.trim()}
                className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3a5a89] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Modal */}
      {showModelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Device Model</h3>
            <input
              type="text"
              placeholder="Enter model name"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddModel()}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowModelModal(false); setNewModelName(''); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddModel}
                disabled={!newModelName.trim()}
                className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3a5a89] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
