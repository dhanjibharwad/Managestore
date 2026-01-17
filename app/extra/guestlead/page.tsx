'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload, User, Mail, Phone, MapPin, Package, ShieldCheck, Eye, EyeOff, X } from 'lucide-react';
import { State, City } from 'country-state-city';

type DeviceType = string;
type Brand = string;
type Model = string;

interface FormData {
  companyId: string;
  deviceType: DeviceType;
  brand: Brand;
  model: Model;
  serialNumber: string;
  password: string;
  accessories: string[];
  deviceImages: File[];
  deviceIssue: string;
  name: string;
  mobile: string;
  email: string;
  termsAccepted: boolean;
  addressLine: string;
  region: string;
  city: string;
  postalCode: string;
  pickupDateTime: string;
}

const deviceTypes = [
  'All In One', 'Camera', 'CD/DVD', 'CF Card', 'Desktop',
  'HDD (2.5 Inch)', 'HDD (3.5 Inch)', 'Laptop', 'Micro SD Card', 'Mobile',
  'Monitor', 'Motherboard', 'NAS Box', 'Pen Drive', 'SD Card',
  'Server Hard Drives', 'SSD', 'Tablet', 'Television'
];

const brandsByDevice: Record<string, string[]> = {
  'Camera': ['Sony', 'Canon', 'Nikon', 'Panasonic'],
  'Mobile': ['Apple', 'Samsung', 'OnePlus', 'Xiaomi'],
  'Laptop': ['Dell', 'HP', 'Lenovo', 'Apple'],
};

const modelsByBrand: Record<string, string[]> = {
  'Sony': ['DCR-SR65E', 'DCR-SR68', 'DCRA-C162'],
};

export default function SelfCheckIn() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyId: '',
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    password: '',
    accessories: [],
    deviceImages: [],
    deviceIssue: '',
    name: '',
    mobile: '',
    email: '',
    termsAccepted: false,
    addressLine: '',
    region: '',
    city: '',
    postalCode: '',
    pickupDateTime: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 1) {
      // Handle navigation within Step 1 device selection
      if (formData.model) {
        updateFormData('model', '');
      } else if (formData.brand) {
        updateFormData('brand', '');
      } else if (formData.deviceType) {
        updateFormData('deviceType', '');
      }
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/admin/guest-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit request');
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      files.forEach(file => uploadFormData.append('files', file));

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        updateFormData('deviceImages', [...formData.deviceImages, ...files]);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.deviceImages.filter((_, i) => i !== index);
    updateFormData('deviceImages', newImages);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      updateFormData('mobile', value);
    }
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 6) {
      updateFormData('postalCode', value);
    }
  };

  useEffect(() => {
    // Load Indian states
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    // Load cities when state changes
    if (formData.region) {
      const stateCities = City.getCitiesOfState('IN', formData.region);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    // Reset city when state changes
    setFormData(prev => ({ ...prev, city: '' }));
  }, [formData.region]);

  const filteredDeviceTypes = deviceTypes.filter(type =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableBrands = formData.deviceType ? brandsByDevice[formData.deviceType] || ['Sony'] : [];
  const availableModels = formData.brand ? modelsByBrand[formData.brand] || ['DCR-SR65E', 'DCR-SR68', 'DCRA-C162'] : [];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#4A70A9] rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Thank you for booking an Appointment with us.
            </h2>
            <p className="text-gray-600 mb-8">
              Your appointment has been confirmed: we're excited to fix your device and it brand new
            </p>
            <div className="w-full bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Information</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="text-base font-medium text-gray-800">{formData.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="text-base font-medium text-gray-800">{formData.model}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowSuccess(false)}
                className="flex-1 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5d8f] transition-colors"
              >
                Submit Another Self Check-In
              </button>
            </div>
          </div>
        </div>
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-semibold">Success</p>
            <p className="text-sm">Response Saved successfully</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#4A70A9] rounded flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Store Manager</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Device Information', icon: Package },
              { num: 2, label: 'Basic Information', icon: User },
              { num: 3, label: 'Save Or Book Pickup', icon: MapPin },
              { num: 4, label: 'Verify User Contact', icon: ShieldCheck }
            ].map((item, idx) => (
              <React.Fragment key={item.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step > item.num ? 'bg-[#4A70A9]' :
                    step === item.num ? 'bg-[#4A70A9]' : 'bg-gray-300'
                  }`}>
                    {step > item.num ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <item.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    step === item.num ? 'text-[#4A70A9] font-medium' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > item.num ? 'bg-[#4A70A9]' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Summary */}
          {step > 1 && (
            <div className="w-64 bg-white rounded-lg shadow p-6 h-fit">
              <h3 className="font-semibold text-gray-800 mb-4">Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Device Information</p>
                  <div className="flex gap-2 flex-wrap">
                    {formData.deviceType && (
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{formData.deviceType}</span>
                    )}
                    {formData.brand && (
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{formData.brand}</span>
                    )}
                    {formData.model && (
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">{formData.model}</span>
                    )}
                  </div>
                </div>
                {formData.serialNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Serial Number</p>
                    <p className="text-sm font-medium">{formData.serialNumber}</p>
                  </div>
                )}
                {step > 2 && formData.name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Basic Information</p>
                    <p className="text-sm"><span className="font-medium">Name:</span> {formData.name}</p>
                    <p className="text-sm"><span className="font-medium">Mobile Number:</span> {formData.mobile}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {step === 1 && 'Device Information'}
              {step === 2 && 'Basic Information'}
              {step === 3 && 'Schedule A Pickup'}
              {step === 4 && 'Verify User Contact'}
            </h2>

            {/* Step 1: Device Selection */}
            {step === 1 && (
              <div className="space-y-6">
                {!formData.deviceType && (
                  <>
                    <div className="text-blue-600 mb-4">Device Information</div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select device type
                      </label>
                      <input
                        type="text"
                        placeholder="Type or search for device type"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {filteredDeviceTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => updateFormData('deviceType', type)}
                          className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center"
                        >
                          <span className="text-sm">{type}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {formData.deviceType && !formData.brand && (
                  <>
                    <div className="text-blue-600 mb-4">
                      Device Information &gt; {formData.deviceType}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select device brand
                      </label>
                      <input
                        type="text"
                        placeholder="Type or search for device brand"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {availableBrands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => updateFormData('brand', brand)}
                          className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center"
                        >
                          <span className="text-sm">{brand}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {formData.brand && !formData.model && (
                  <>
                    <div className="text-blue-600 mb-4">
                      Device Information &gt; {formData.deviceType} &gt; {formData.brand}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select model
                      </label>
                      <input
                        type="text"
                        placeholder="Type or search for device model"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {availableModels.map(model => (
                        <button
                          key={model}
                          onClick={() => updateFormData('model', model)}
                          className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center"
                        >
                          <span className="text-sm">{model}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {formData.model && (
                  <>
                    <div className="text-blue-600 mb-4">
                      Device Information &gt; {formData.deviceType} &gt; {formData.brand} &gt; {formData.model}
                    </div>
                    
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-cyan-800">No repair services are available for this device</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type or search for service type
                      </label>
                      <input
                        type="text"
                        placeholder="Type or search for service type"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Device Detailed Issue
                      </label>
                      <div className="border border-gray-300 rounded-lg">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-300">
                          <button className="p-1 hover:bg-gray-100 rounded">↶</button>
                          <button className="p-1 hover:bg-gray-100 rounded">↷</button>
                          <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                            <option>Normal text</option>
                          </select>
                          <button className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
                          <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
                          <button className="p-1 hover:bg-gray-100 rounded line-through">S</button>
                          <button className="p-1 hover:bg-gray-100 rounded underline">U</button>
                          <button className="p-1 hover:bg-gray-100 rounded">≡</button>
                        </div>
                        <textarea
                          value={formData.deviceIssue}
                          onChange={(e) => updateFormData('deviceIssue', e.target.value)}
                          className="w-full px-4 py-3 min-h-[200px] focus:outline-none"
                          placeholder="Describe the issue..."
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Max Allowed Characters: 50000</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Serial / IMEI Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.serialNumber}
                            onChange={(e) => updateFormData('serialNumber', e.target.value)}
                            placeholder="Type device serial number"
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Device password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                            placeholder="Device password"
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accessories
                      </label>
                      <input
                        type="text"
                        placeholder="Select or search for accessories"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Device Images
                      </label>
                      <div className="border-2 border-dashed border-[#4A70A9] rounded-lg p-8 text-center bg-blue-50 relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/bmp,image/webp,application/pdf"
                          onChange={handleFileUpload}
                          multiple
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <div className="text-[#4A70A9]">
                            <div className="animate-spin w-8 h-8 border-4 border-[#4A70A9] border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-[#4A70A9] mx-auto mb-2" />
                            <p className="text-[#4A70A9] font-medium mb-1">
                              Choose Multiple Files or Take Photos
                            </p>
                            <p className="text-sm text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES</p>
                          </>
                        )}
                      </div>
                      {formData.deviceImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Images ({formData.deviceImages.length})
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            {formData.deviceImages.map((file, index) => (
                              <div key={index} className="relative bg-gray-100 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Basic Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-sm text-cyan-800">
                    Note: Please provide either your mobile number or email id to proceed.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="Eg: John Smith"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="+91"
                        disabled
                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        placeholder="Eg: 99XXXXXXXX"
                        maxLength={10}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-red-500 mt-1">Either mobile number or email is required field</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Eg: example@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h3>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to your terms and conditions mentioned above
                    </span>
                  </label>
                  {!formData.termsAccepted && (
                    <p className="text-xs text-red-500 mt-2">
                      Please agree to the Terms and Conditions to proceed.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Pickup Schedule */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-sm text-cyan-800">
                    Device pickup will be scheduled only after your request is approved.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Details</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine}
                        onChange={(e) => updateFormData('addressLine', e.target.value)}
                        placeholder="House / building name/no. street name, locality"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Region/State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.region}
                          onChange={(e) => updateFormData('region', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        >
                          <option value="">Select region / state</option>
                          {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City/Town <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => updateFormData('city', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                          disabled={!formData.region}
                        >
                          <option value="">Select city / town</option>
                          {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code/ Zip Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={handlePostalCodeChange}
                          placeholder="Type postal code / zip code"
                          maxLength={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Pickup Date/Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.pickupDateTime}
                          onChange={(e) => updateFormData('pickupDateTime', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verify Contact */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-sm text-cyan-800">
                    Note: Your self check-in form will be submitted automatically once your contact information is verified.
                  </p>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="verify" value="mobile" className="w-4 h-4 text-[#4A70A9]" />
                    <span className="text-sm">Mobile</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="verify" value="email" className="w-4 h-4 text-[#4A70A9]" />
                    <span className="text-sm">Email</span>
                  </label>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verify Email
                    </label>
                    <input
                      type="email"
                      placeholder="Eg: example@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    />
                  </div>
                  <button className="w-full px-6 py-2 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5d8f] transition-colors mb-4">
                    Send OTP
                  </button>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verify Mobile OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={step === 1 && !formData.deviceType && !formData.brand && !formData.model}
                className="flex items-center gap-2 px-6 py-2 border-2 border-[#4A70A9] text-[#4A70A9] rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.model) ||
                    (step === 2 && (!formData.name || !formData.termsAccepted)) ||
                    (step === 3 && (!formData.addressLine || !formData.region || !formData.city))
                  }
                  className="flex items-center gap-2 px-6 py-2 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5d8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5d8f] transition-colors"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}