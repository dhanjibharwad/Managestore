'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Eye, EyeOff, Upload, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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
  services: string[];
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

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const [deviceBrands, setDeviceBrands] = useState<any[]>([]);
  const [deviceModels, setDeviceModels] = useState<any[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [storageLocations, setStorageLocations] = useState<any[]>([]);
  const [deviceColors, setDeviceColors] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    source: '',
    referredBy: '',
    serviceType: 'Carried By User',
    jobType: '',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    serialNumber: '',
    accessories: '',
    storageLocation: '',
    deviceColor: '',
    devicePassword: '',
    services: [],
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

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, typesRes, brandsRes, modelsRes, customersRes, employeesRes, locationsRes, colorsRes, jobTypesRes, sourcesRes] = await Promise.all([
          fetch(`/api/admin/jobs/${jobId}`),
          fetch('/api/devices/types'),
          fetch('/api/devices/brands'),
          fetch('/api/devices/models'),
          fetch('/api/admin/customers'),
          fetch('/api/admin/employees'),
          fetch('/api/admin/storage-locations'),
          fetch('/api/devices/colors'),
          fetch('/api/admin/job-types'),
          fetch('/api/admin/sources')
        ]);

        if (typesRes.ok) setDeviceTypes(await typesRes.json());
        if (brandsRes.ok) setDeviceBrands(await brandsRes.json());
        if (modelsRes.ok) setDeviceModels(await modelsRes.json());
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData.customers || []);
        }
        if (employeesRes.ok) {
          const employeesData = await employeesRes.json();
          setEmployees(employeesData.employees || []);
        }
        if (locationsRes.ok) setStorageLocations(await locationsRes.json());
        if (colorsRes.ok) setDeviceColors(await colorsRes.json());
        if (jobTypesRes.ok) setJobTypes(await jobTypesRes.json());
        if (sourcesRes.ok) setSources(await sourcesRes.json());

        if (jobRes.ok) {
          const jobData = await jobRes.json();
          console.log('Job data received:', jobData);
          if (jobData.job) {
            const job = jobData.job;
            setFormData({
              customerName: job.customer_name || '',
              source: job.source || '',
              referredBy: job.referred_by || '',
              serviceType: job.service_type || 'Carried By User',
              jobType: job.job_type || '',
              deviceType: String(job.device_type_id || job.device_type || ''),
              deviceBrand: String(job.device_brand_id || job.device_brand || ''),
              deviceModel: String(job.device_model_id || job.device_model || ''),
              serialNumber: job.serial_number || '',
              accessories: job.accessories || '',
              storageLocation: job.storage_location || '',
              deviceColor: job.device_color || '',
              devicePassword: job.device_password || '',
              services: job.services ? job.services.split(', ') : [],
              tags: job.tags || '',
              hardwareConfig: job.hardware_config || '',
              serviceAssessment: job.service_assessment || '',
              priority: job.priority || 'Regular',
              assignee: job.assignee || '',
              initialQuotation: job.initial_quotation || '',
              dueDate: job.due_date ? job.due_date.split('T')[0] : '',
              dealerJobId: job.dealer_job_id || '',
              termsConditions: job.terms_conditions || ''
            });
            setExistingImages(Array.isArray(job.images) ? job.images : (job.images ? JSON.parse(job.images) : []));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load job data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showServicesDropdown && !target.closest('.services-dropdown-container')) {
        setShowServicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showServicesDropdown]);

  useEffect(() => {
    if (formData.deviceType) {
      const filtered = deviceBrands.filter((brand: any) => brand.device_type_id === parseInt(formData.deviceType));
      setFilteredBrands(filtered);
      fetch(`/api/admin/services?device_type_id=${formData.deviceType}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setServices(Array.isArray(data) ? data : []));
    } else {
      setFilteredBrands([]);
      setServices([]);
    }
  }, [formData.deviceType, deviceBrands]);

  useEffect(() => {
    if (formData.deviceBrand) {
      const filtered = deviceModels.filter((model: any) => model.device_brand_id === parseInt(formData.deviceBrand));
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
  }, [formData.deviceBrand, deviceModels]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'deviceType') {
      setFormData(prev => ({ ...prev, [name]: value, deviceBrand: '', deviceModel: '', services: [] }));
    } else if (name === 'deviceBrand') {
      setFormData(prev => ({ ...prev, [name]: value, deviceModel: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceName) ? prev.services.filter(s => s !== serviceName) : [...prev.services, serviceName]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.deviceType || !formData.deviceBrand || formData.services.length === 0 || !formData.assignee) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedFileUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        const fileFormData = new FormData();
        uploadedFiles.forEach(file => fileFormData.append('files', file));
        const uploadResponse = await fetch('/api/admin/upload', { method: 'POST', body: fileFormData });
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedFileUrls = uploadResult.files.map((f: any) => f.url);
        }
      }

      const jobData = {
        customer_name: formData.customerName,
        source: formData.source,
        referred_by: formData.referredBy,
        service_type: formData.serviceType,
        job_type: formData.jobType,
        device_type: formData.deviceType,
        device_brand: formData.deviceBrand,
        device_model: formData.deviceModel,
        serial_number: formData.serialNumber,
        accessories: formData.accessories,
        storage_location: formData.storageLocation,
        device_color: formData.deviceColor,
        device_password: formData.devicePassword,
        services: formData.services.join(', '),
        tags: formData.tags,
        hardware_config: formData.hardwareConfig,
        service_assessment: formData.serviceAssessment,
        priority: formData.priority,
        assignee: formData.assignee,
        initial_quotation: formData.initialQuotation,
        due_date: formData.dueDate || null,
        dealer_job_id: formData.dealerJobId,
        terms_conditions: formData.termsConditions,
        images: JSON.stringify([...(Array.isArray(existingImages) ? existingImages : []), ...uploadedFileUrls])
      };

      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        showToast('Job updated successfully!', 'success');
        setTimeout(() => router.push('/admin/jobs'), 2000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update job', 'error');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      showToast('An error occurred while updating the job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-full bg-white">
        <div className="sticky top-0 z-10 border-b bg-white px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Job</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(true)} className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2 bg-[#4A70A9] hover:bg-[#3a5d8f] text-white rounded font-medium transition-colors disabled:opacity-50">{isSubmitting ? 'Updating...' : 'Update'}</button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>
        ) : (
          <div className="px-8 py-6 max-w-full">
            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                  <select name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select customer</option>
                    {customers.map((customer: any) => (<option key={customer.id} value={customer.customer_name}>{customer.customer_name} - {customer.customer_id}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select name="source" value={formData.source} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select source</option>
                    {sources.map((source: any) => (<option key={source.id} value={source.name}>{source.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                  <select name="referredBy" value={formData.referredBy} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select customer</option>
                    {customers.map((customer: any) => (<option key={customer.id} value={customer.customer_name}>{customer.customer_name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option>Carried By User</option>
                    <option>Pickup</option>
                    <option>On-site</option>
                    <option>Courier</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type <span className="text-red-500">*</span></label>
                <select name="jobType" value={formData.jobType} onChange={handleInputChange} className="w-full lg:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                  <option value="">Select job type</option>
                  {jobTypes.map((type: any) => (<option key={type.id} value={type.name}>{type.name}</option>))}
                </select>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Device Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type <span className="text-red-500">*</span></label>
                  <select name="deviceType" value={formData.deviceType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Device type</option>
                    {deviceTypes.map((type: any) => (<option key={type.id} value={type.id}>{type.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Brand <span className="text-red-500">*</span></label>
                  <select name="deviceBrand" value={formData.deviceBrand} onChange={handleInputChange} disabled={!formData.deviceType} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] disabled:bg-gray-100">
                    <option value="">Select device brand</option>
                    {filteredBrands.map((brand: any) => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Model</label>
                  <select name="deviceModel" value={formData.deviceModel} onChange={handleInputChange} disabled={!formData.deviceBrand} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] disabled:bg-gray-100">
                    <option value="">Select device model</option>
                    {filteredModels.map((model: any) => (<option key={model.id} value={model.id}>{model.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial / IMEI Number</label>
                  <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} placeholder="Type device serial number" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
                  <input type="text" name="accessories" value={formData.accessories} onChange={handleInputChange} placeholder="Select or search for accessories" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                  <select name="storageLocation" value={formData.storageLocation} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select storage location</option>
                    {storageLocations.map((location: any) => (<option key={location.id} value={location.name}>{location.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Color</label>
                  <select name="deviceColor" value={formData.deviceColor} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select device color</option>
                    {deviceColors.map((color: any) => (<option key={color.id} value={color.name}>{color.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="devicePassword" value={formData.devicePassword} onChange={handleInputChange} placeholder="Device password" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Service Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="relative services-dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services <span className="text-red-500">*</span></label>
                  <div onClick={() => formData.deviceType && setShowServicesDropdown(!showServicesDropdown)} className="border border-gray-300 rounded p-2 min-h-[42px] bg-white cursor-pointer">
                    {formData.services.length === 0 ? (<span className="text-gray-400 text-sm">Select services</span>) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.services.map((service, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">{service}<button type="button" onClick={(e) => { e.stopPropagation(); handleServiceToggle(service); }} className="hover:text-blue-600"><X size={14} /></button></span>
                        ))}
                      </div>
                    )}
                  </div>
                  {showServicesDropdown && formData.deviceType && (
                    <div className="absolute z-10 mt-1 w-full border border-gray-200 rounded bg-white shadow-lg max-h-60 overflow-y-auto">
                      {services.map((service: any) => (
                        <div key={service.id} onClick={() => handleServiceToggle(service.name)} className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${formData.services.includes(service.name) ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-center gap-2"><input type="checkbox" checked={formData.services.includes(service.name)} onChange={() => {}} className="rounded" /><span className="text-sm">{service.name}</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Eg: 4GB RAM, 1TB HDD etc" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Configuration</label>
                <textarea name="hardwareConfig" value={formData.hardwareConfig} onChange={handleInputChange} placeholder="Enter hardware configuration details" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Assessment</label>
                <div className="border border-gray-300 rounded">
                  <textarea name="serviceAssessment" value={formData.serviceAssessment} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 focus:outline-none resize-none" placeholder="Describe the service assessment..." />
                  <div className="px-3 py-1 text-xs text-gray-500 border-t">Max Allowed Characters 50000</div>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority <span className="text-red-500">*</span></label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option>Regular</option>
                    <option>High</option>
                    <option>Urgent</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee <span className="text-red-500">*</span></label>
                  <select name="assignee" value={formData.assignee} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]">
                    <option value="">Select assignee name</option>
                    {employees.map((employee: any) => (<option key={employee.id} value={employee.employee_name}>{employee.employee_name} ({employee.employee_role})</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quotation</label>
                  <input type="text" name="initialQuotation" value={formData.initialQuotation} onChange={handleInputChange} placeholder="2000-5000 etc" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Job ID</label>
                <input type="text" name="dealerJobId" value={formData.dealerJobId} onChange={handleInputChange} placeholder="Dealer job id if any" className="w-full lg:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9]" />
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Upload Images</h2>
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Images:</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Image ${idx + 1}`} className="w-full h-24 object-cover rounded border" />
                        <button onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4A70A9] cursor-pointer transition-colors" onClick={() => document.getElementById('fileInput')?.click()}>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#E8EEF7] rounded-full flex items-center justify-center mb-3"><Upload className="text-[#4A70A9]" size={28} /></div>
                  <p className="text-[#4A70A9] font-medium mb-1">Take A Photo With Your Camera Or Choose A File From Your Device</p>
                  <p className="text-sm text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES (Max 10MB each)</p>
                </div>
              </div>
              <input id="fileInput" type="file" multiple accept="image/jpeg,image/png,image/bmp,image/webp,application/pdf" onChange={handleFileUpload} className="hidden" />
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">New Files:</h3>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">{file.type.startsWith('image/') ? '🖼️' : '📄'}</div>
                        <div><p className="text-sm font-medium text-gray-900">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Terms and Conditions</h2>
              <div className="border border-gray-300 rounded">
                <textarea name="termsConditions" value={formData.termsConditions} onChange={handleInputChange} rows={4} placeholder="Type text here" className="w-full px-3 py-2 focus:outline-none resize-none" />
                <div className="px-3 py-1 text-xs text-gray-500 border-t">Max Allowed Characters 50000</div>
              </div>
            </section>
          </div>
        )}
      </div>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : toast.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            {toast.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-600" size={20} />}
            {toast.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
            <span className={`flex-1 text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : toast.type === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="hover:opacity-70"><X size={16} /></button>
          </div>
        ))}
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600" /></div>
              <div><h3 className="text-lg font-semibold text-gray-900">Cancel Editing</h3><p className="text-sm text-gray-500">Unsaved changes will be lost</p></div>
            </div>
            <p className="text-gray-700 mb-6">Are you sure you want to cancel? All unsaved changes will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">Continue Editing</button>
              <button onClick={() => router.push('/admin/jobs')} className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}