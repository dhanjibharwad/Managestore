
'use client';

import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Upload, X } from 'lucide-react';

interface CustomerData {
  customerType: string;
  customerName: string;
  mobileNumber: string;
  emailId: string;
  phoneNumber: string;
  source: string;
  referredBy: string;
  addressLine: string;
  regionState: string;
  cityTown: string;
  postalCode: string;
  sendMail: boolean;
  sendSMS: boolean;
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    customerType: 'End User',
    customerName: '',
    mobileNumber: '',
    emailId: '',
    phoneNumber: '',
    source: '',
    referredBy: '',
    addressLine: '',
    regionState: '',
    cityTown: '',
    postalCode: '',
    sendMail: false,
    sendSMS: false
  });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomerData(prev => ({ ...prev, [name]: checked }));
    } else {
      setCustomerData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (showCustomerModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCustomerModal]);

  const handleAddCustomer = () => {
    console.log('Customer added:', customerData);
    setFormData(prev => ({ ...prev, customerName: customerData.customerName }));
    setShowCustomerModal(false);
    // Reset customer form
    setCustomerData({
      customerType: 'End User',
      customerName: '',
      mobileNumber: '',
      emailId: '',
      phoneNumber: '',
      source: '',
      referredBy: '',
      addressLine: '',
      regionState: '',
      cityTown: '',
      postalCode: '',
      sendMail: false,
      sendSMS: false
    });
  };

  const handleCancelCustomer = () => {
    setShowCustomerModal(false);
  };

  const handleSubmit = () => {
    if (!formData.customerName || !formData.deviceType || !formData.deviceBrand) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Job Sheet Created Successfully!');
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
          <h1 className="text-2xl font-semibold text-gray-800">Job: 001</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded font-medium transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-full">
          {/* Basic Information */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Search by name, mobile, email"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCustomerModal(true)}
                    className="px-3 bg-[#4A70A9] hover:bg-[#3a5a89] border-2 border-[#4A70A9] text-white rounded transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                >
                  <option>Google</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange}
                  placeholder="Search by name, mobile, email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                >
                  <option>Carried By User</option>
                  <option>Pickup</option>
                  <option>On-site</option>
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
                className="w-full lg:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
              >
                <option>No Warranty</option>
                <option>Under Warranty</option>
                <option>Extended Warranty</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                >
                  <option value="">Device type</option>
                  <option>Laptop</option>
                  <option>Desktop</option>
                  <option>Mobile</option>
                  <option>Tablet</option>
                  <option>Printer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deviceBrand"
                  value={formData.deviceBrand}
                  onChange={handleInputChange}
                  placeholder="Select device brand"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Model</label>
                <input
                  type="text"
                  name="deviceModel"
                  value={formData.deviceModel}
                  onChange={handleInputChange}
                  placeholder="Select device model"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial / IMEI Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="Type device serial number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                <select
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                >
                  <option value="">Select storage location</option>
                  <option>Warehouse A</option>
                  <option>Warehouse B</option>
                  <option>Service Center</option>
                  <option>Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Color</label>
                <select
                  name="deviceColor"
                  value={formData.deviceColor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                >
                  <option value="">Select device color</option>
                  <option>Black</option>
                  <option>White</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Blue</option>
                  <option>Red</option>
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Assessment</label>
              <div className="border border-gray-300 rounded">
                <div className="bg-gray-50 border-b px-3 py-2 flex items-center gap-2">
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                  <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                >
                  <option value="">Select assignee name</option>
                  <option>John Smith</option>
                  <option>Jane Doe</option>
                  <option>Mike Johnson</option>
                  <option>Sarah Williams</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
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
                className="w-full lg:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
              />
            </div>
          </section>

          {/* Upload Images */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Upload Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4A70A9] cursor-pointer transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-[#E8EEF7] rounded-full flex items-center justify-center mb-3">
                  <Upload className="text-[#4A70A9]" size={28} />
                </div>
                <p className="text-[#4A70A9] font-medium mb-1">
                  Take A Photo With Your Camera Or Choose A File From Your Device
                </p>
                <p className="text-sm text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES</p>
              </div>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Terms and Conditions</h2>
            <div className="border border-gray-300 rounded">
              <div className="bg-gray-50 border-b px-3 py-2 flex items-center gap-2">
                <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 rounded text-sm underline">U</button>
              </div>
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

      {/* Add Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Add New Customer</h2>
              <button
                onClick={handleCancelCustomer}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="customerType"
                      value={customerData.customerType}
                      onChange={handleCustomerInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] appearance-none"
                    >
                      <option>End User</option>
                      <option>Business</option>
                      <option>Corporate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={customerData.customerName}
                    onChange={handleCustomerInputChange}
                    placeholder="Eg: John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="+91"
                      readOnly
                      className="w-16 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-center"
                    />
                    <input
                      type="text"
                      name="mobileNumber"
                      value={customerData.mobileNumber}
                      onChange={handleCustomerInputChange}
                      placeholder="Eg: 99XXXXXXXX"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    name="emailId"
                    value={customerData.emailId}
                    onChange={handleCustomerInputChange}
                    placeholder="Eg: example@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={customerData.phoneNumber}
                    onChange={handleCustomerInputChange}
                    placeholder="Eg: 91XXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    name="source"
                    value={customerData.source}
                    onChange={handleCustomerInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                  >
                    <option value="">Select Source</option>
                    <option>Google</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Referral</option>
                    <option>Walk-in</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                  <input
                    type="text"
                    name="referredBy"
                    value={customerData.referredBy}
                    onChange={handleCustomerInputChange}
                    placeholder="Search by name, mobile, email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                  />
                </div>
              </div>

              {/* Address Details */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Address Details <span className="text-gray-500 font-normal">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={customerData.addressLine}
                      onChange={handleCustomerInputChange}
                      placeholder="House / building name/no, street name, landmark"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="regionState"
                        value={customerData.regionState}
                        onChange={handleCustomerInputChange}
                        placeholder="Select region / state"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                      />
                      <button
                        type="button"
                        className="px-3 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City/Town</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="cityTown"
                        value={customerData.cityTown}
                        onChange={handleCustomerInputChange}
                        placeholder="Select city / town"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                      />
                      <button
                        type="button"
                        className="px-3 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code/ Zip Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={customerData.postalCode}
                      onChange={handleCustomerInputChange}
                      placeholder="Type postal code / zip code"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                    />
                  </div>
                </div>
              </div>

              {/* Send Alert */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Alert</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendMail"
                      checked={customerData.sendMail}
                      onChange={handleCustomerInputChange}
                      className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                    />
                    <span className="text-sm text-gray-700">Mail</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendSMS"
                      checked={customerData.sendSMS}
                      onChange={handleCustomerInputChange}
                      className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                    />
                    <span className="text-sm text-gray-700">SMS</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleCancelCustomer}
                  className="flex-1 px-5 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 px-5 py-2.5 bg-[#4A70A9] hover:bg-[#3a5a89] text-white rounded font-medium transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
