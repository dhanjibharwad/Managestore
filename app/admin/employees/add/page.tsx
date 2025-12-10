"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus } from 'lucide-react';

const EmployeeForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeRole: '',
    employeeName: '',
    displayName: '',
    emailId: '',
    mobileNumber: '',
    phoneNumber: '',
    aadhaarNumber: '',
    gender: '',
    panCard: '',
    dateOfBirth: '',
    addressLine: '',
    regionState: '',
    cityTown: '',
    postalCode: '',
    accountName: '',
    bankName: '',
    branch: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'aadhaarNumber':
        if (value && !/^[2-9]{1}[0-9]{11}$/.test(value)) {
          newErrors.aadhaarNumber = 'Invalid Aadhaar: 12 digits starting with 2-9';
        } else {
          delete newErrors.aadhaarNumber;
        }
        break;
      case 'panCard':
        if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
          newErrors.panCard = 'Invalid PAN: Format ABCDE1234F';
        } else {
          delete newErrors.panCard;
        }
        break;
      case 'mobileNumber':
        if (value && !/^[6-9][0-9]{9}$/.test(value)) {
          newErrors.mobileNumber = 'Invalid mobile: 10 digits starting with 6-9';
        } else {
          delete newErrors.mobileNumber;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async () => {
    if (!formData.employeeRole || !formData.employeeName || !formData.emailId || !formData.mobileNumber) {
      alert('Please fill in all required fields: Employee Role, Name, Email, and Mobile Number');
      return;
    }

    if (Object.keys(errors).length > 0) {
      alert('Please fix validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Employee created successfully! Employee ID: ${result.employee.employee_id}`);
        router.push('/admin/employees');
      } else {
        alert(result.error || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('An error occurred while creating the employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Add your cancel logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Create</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Employee Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Employee Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Employee Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="employeeRole"
                  value={formData.employeeRole}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option value="">Select employee type</option>
                  <option value="admin">Admin</option>
                  <option value="technician">Technician</option>
                  <option value="reception">Reception</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Eg: John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                  <span className="ml-1 text-gray-400 cursor-help" title="Name visible to customers">ⓘ</span>
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Eg: Dummy name visible to customer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="Eg: example@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-700 flex items-center">
                    +91
                  </div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="10 digits starting with 6-9"
                    maxLength={10}
                    className={`flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Eg: 91XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aadhaar Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="12 digits starting with 2-9"
                  maxLength={12}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                    errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.aadhaarNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Pan Card / Tax Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pan Card / Tax Number
                </label>
                <input
                  type="text"
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleChange}
                  placeholder="Format: ABCDE1234F"
                  maxLength={10}
                  style={{textTransform: 'uppercase'}}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
                    errors.panCard ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.panCard && (
                  <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Date Of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Address Details</h2>
            <p className="text-sm text-gray-500 mb-6">(Optional)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Address Line */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line
                </label>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Region/State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <div className="flex gap-2">
                  <select
                    name="regionState"
                    value={formData.regionState}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select region / state</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="delhi">Delhi</option>
                    <option value="karnataka">Karnataka</option>
                  </select>
                  <button className="px-3 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8a] transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* City/Town */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                <div className="flex gap-2">
                  <select
                    name="cityTown"
                    value={formData.cityTown}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  >
                    <option value="">Select city / town</option>
                    <option value="vadodara">Vadodara</option>
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="surat">Surat</option>
                    <option value="mumbai">Mumbai</option>
                  </select>
                  <button className="px-3 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8a] transition-colors">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Postal Code / Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code/ Zip Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Type postal code / zip code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bank Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Type account name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Type bank name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Type branch name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Type account number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                  <span className="ml-1 text-gray-400 cursor-help" title="Indian Financial System Code">ⓘ</span>
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="Type IFSC code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;