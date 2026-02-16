'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload, User, Mail, Phone, MapPin, Package, ShieldCheck, Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';
import { State, City } from 'country-state-city';

interface DeviceType {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
  device_type_id: number;
}

interface Model {
  id: number;
  name: string;
  device_brand_id: number;
}

interface FormData {
  companyId: string;
  deviceType: string;
  deviceTypeId: number | null;
  brand: string;
  brandId: number | null;
  model: string;
  modelId: number | null;
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

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}



export default function SelfCheckIn() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyId: '',
    deviceType: '',
    deviceTypeId: null,
    brand: '',
    brandId: null,
    model: '',
    modelId: null,
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
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: nextToastId, message, type };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleNext = () => {
    if (step === 1 && !formData.model) {
      showToast('Please select a device model', 'warning');
      return;
    }
    if (step === 2 && !formData.name) {
      showToast('Name is required', 'warning');
      return;
    }
    if (step === 2 && !formData.termsAccepted) {
      showToast('Please accept terms and conditions', 'warning');
      return;
    }
    if (step < 3) setStep(step + 1);
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

  const handleSubmit = async (skipPickup = false) => {
    if (!skipPickup) {
      if (!formData.addressLine || !formData.region || !formData.city) {
        showToast('Please complete all required address fields or skip pickup', 'warning');
        return;
      }
      if (!formData.pickupDateTime) {
        showToast('Please select pickup date and time or skip pickup', 'warning');
        return;
      }
    }

    try {
      const requestData = {
        deviceType: formData.deviceType,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber,
        password: formData.password,
        deviceIssue: formData.deviceIssue,
        accessories: formData.accessories.join(', '),
        deviceImages: (window as any).deviceImagesBase64 || [],
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        termsAccepted: formData.termsAccepted,
        addressLine: skipPickup ? '' : formData.addressLine,
        region: skipPickup ? '' : formData.region,
        city: skipPickup ? '' : formData.city,
        postalCode: skipPickup ? '' : formData.postalCode,
        pickupDateTime: skipPickup ? '' : formData.pickupDateTime,
        skipPickup: skipPickup
      };

      const response = await fetch('/api/customer/selfcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        showToast('Request submitted successfully!', 'success');
        setShowSuccess(true);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to submit request', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('Failed to submit request', 'error');
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
      // Convert files to base64
      const base64Images = await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      updateFormData('deviceImages', [...formData.deviceImages, ...files]);
      // Store base64 images separately
      if (!(window as any).deviceImagesBase64) {
        (window as any).deviceImagesBase64 = [];
      }
      (window as any).deviceImagesBase64.push(...base64Images);
      showToast('Images uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Upload failed', 'error');
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
    
    // Load device types and profile
    fetchDeviceTypes();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    console.log('fetchProfile called');
    try {
      console.log('Fetching from /api/profile');
      const response = await fetch('/api/profile');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        const profileData = {
          name: data.user?.name || '',
          mobile: data.user?.phone || '',
          email: data.user?.email || '',
          addressLine: data.user?.profile?.addressLine || '',
          region: data.user?.profile?.state || '',
          city: data.user?.profile?.city || '',
          postalCode: data.user?.profile?.postalCode || ''
        };
        
        setFormData(prev => ({
          ...prev,
          ...profileData
        }));
        
        // Load cities for the profile's state
        if (profileData.region) {
          const stateCities = City.getCitiesOfState('IN', profileData.region);
          setCities(stateCities);
        }
      } else {
        const errorText = await response.text();
        console.error('Profile fetch failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      console.log('Setting loadingProfile to false');
      setLoadingProfile(false);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch('/api/devices/types');
      if (response.ok) {
        const data = await response.json();
        setDeviceTypes(data);
      }
    } catch (error) {
      console.error('Failed to fetch device types:', error);
    }
  };

  const fetchBrands = async (deviceTypeId: number) => {
    setLoadingBrands(true);
    try {
      const response = await fetch(`/api/devices/brands?device_type_id=${deviceTypeId}`);
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchModels = async (brandId: number) => {
    setLoadingModels(true);
    try {
      const response = await fetch(`/api/devices/models?device_brand_id=${brandId}`);
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    if (formData.deviceTypeId) {
      fetchBrands(formData.deviceTypeId);
      // Reset brand and model when device type changes
      setFormData(prev => ({ ...prev, brand: '', brandId: null, model: '', modelId: null }));
      setBrands([]);
      setModels([]);
    }
  }, [formData.deviceTypeId]);

  useEffect(() => {
    if (formData.brandId) {
      fetchModels(formData.brandId);
      // Reset model when brand changes
      setFormData(prev => ({ ...prev, model: '', modelId: null }));
      setModels([]);
    }
  }, [formData.brandId]);

  useEffect(() => {
    // Load cities when state changes
    if (formData.region) {
      const stateCities = City.getCitiesOfState('IN', formData.region);
      setCities(stateCities);
    }
  }, [formData.region]);

  const filteredDeviceTypes = deviceTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 rounded-xl">
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
              { num: 3, label: 'Save Or Book Pickup', icon: MapPin }
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
                {idx < 2 && (
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {filteredDeviceTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => {
                            updateFormData('deviceType', type.name);
                            updateFormData('deviceTypeId', type.id);
                          }}
                          className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center"
                        >
                          <span className="text-sm">{type.name}</span>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {loadingBrands ? (
                        <div className="col-span-5 text-center py-8">
                          <div className="animate-spin w-8 h-8 border-4 border-[#4A70A9] border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-gray-600 mt-2">Loading brands...</p>
                        </div>
                      ) : brands.length > 0 ? (
                        brands.map(brand => (
                          <button
                            key={brand.id}
                            onClick={() => {
                              updateFormData('brand', brand.name);
                              updateFormData('brandId', brand.id);
                            }}
                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center"
                          >
                            <span className="text-sm">{brand.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-5 text-center py-8 text-gray-500">
                          No brands available for this device type
                        </div>
                      )}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {loadingModels ? (
                        <div className="col-span-5 text-center py-8">
                          <div className="animate-spin w-8 h-8 border-4 border-[#4A70A9] border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-gray-600 mt-2">Loading models...</p>
                        </div>
                      ) : models.length > 0 ? (
                        models.map(model => (
                          <button
                            key={model.id}
                            onClick={() => {
                              updateFormData('model', model.name);
                              updateFormData('modelId', model.id);
                            }}
                            className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center"
                          >
                            <span className="text-sm">{model.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-5 text-center py-8 text-gray-500">
                          No models available for this brand
                        </div>
                      )}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Device Detailed Issue
                      </label>
                      <div className="border border-gray-300 rounded-lg">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-300">
                          {/* <button className="p-1 hover:bg-gray-100 rounded">↶</button>
                          <button className="p-1 hover:bg-gray-100 rounded">↷</button> */}
                          <div className="px-2 py-1 border border-gray-300 rounded text-sm">
                            <option>Normal text</option>
                          </div>
                          {/* <button className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
                          <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
                          <button className="p-1 hover:bg-gray-100 rounded line-through">S</button>
                          <button className="p-1 hover:bg-gray-100 rounded underline">U</button>
                          <button className="p-1 hover:bg-gray-100 rounded">≡</button> */}
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
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
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
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
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
                    Your profile information has been auto-filled from your account.
                  </p>
                </div>

                {loadingProfile ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-[#4A70A9] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading profile...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
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
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email ID
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

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
                    Device pickup will be scheduled only after your request is approved. Address details have been auto-filled from your profile.
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
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Region/State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={states.find(s => s.isoCode === formData.region)?.name || formData.region}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City/Town <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
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
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>
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
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.model) ||
                    (step === 2 && (!formData.name || !formData.termsAccepted))
                  }
                  className="flex items-center gap-2 px-6 py-2 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5d8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmit(true)}
                    className="px-6 py-2 border-2 border-gray-400 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Skip Pickup
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={!formData.addressLine || !formData.region || !formData.city || !formData.pickupDateTime}
                    className="px-6 py-2 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5d8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit with Pickup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}