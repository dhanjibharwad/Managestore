"use client"
import React, { useState } from 'react';
import { ChevronRight, Search, Wrench, Check } from 'lucide-react';

type DeviceType = 'All In One' | 'Camera' | 'CD/DVD' | 'CF Card' | 'Desktop' | 'HDD (2.5 Inch)' | 
  'HDD (3.5 Inch)' | 'Laptop' | 'Micro SD Card' | 'Mobile' | 'Monitor' | 'Motherboard' | 
  'NAS Box' | 'Pen Drive' | 'SD Card' | 'Server Hard Drives' | 'SSD' | 'Tablet';

const deviceTypes: DeviceType[] = [
  'All In One', 'Camera', 'CD/DVD', 'CF Card', 'Desktop', 'HDD (2.5 Inch)',
  'HDD (3.5 Inch)', 'Laptop', 'Micro SD Card', 'Mobile', 'Monitor', 'Motherboard',
  'NAS Box', 'Pen Drive', 'SD Card', 'Server Hard Drives', 'SSD', 'Tablet'
];

const deviceBrands: Partial<Record<DeviceType, string[]>> = {
  'Mobile': ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google', 'Oppo', 'Vivo', 'Realme'],
  'Camera': ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Olympus'],
  'Laptop': ['Acer', 'Apple', 'Asus', 'Benq', 'Compaq', 'Custom Build', 'Dell', 'Fujitsu', 'Gateway', 'Google', 'HCL', 'HP', 'Huawei', 'IBM', 'Lenovo', 'LG', 'Microsoft', 'MSI'],
  'Desktop': ['Dell', 'HP', 'Lenovo', 'Apple', 'Custom Build'],
  'HDD (2.5 Inch)': ['Seagate', 'Western Digital', 'Toshiba', 'HGST'],
  'HDD (3.5 Inch)': ['Seagate', 'Western Digital', 'Toshiba', 'HGST'],
  'SSD': ['Samsung', 'Crucial', 'Western Digital', 'Kingston', 'SanDisk'],
};

const deviceModels: Record<string, string[]> = {
  'Sony': ['DCR-SR68', 'DCR-SR88', 'HDR-CX405', 'FDR-AX33', 'A7 III', 'A6400'],
  'Apple': ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'MacBook Pro'],
  'Samsung': ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23', 'Galaxy A54', 'Galaxy Z Fold 5'],
  'Canon': ['EOS R5', 'EOS R6', '5D Mark IV', 'PowerShot G7X', 'VIXIA HF R800'],
  'Google': ['Google Pixelbook Go', 'Pixelbook', 'Chromebook Pixel'],
};

const services: Record<string, string[]> = {
  'Laptop': [
    'Bad hard disk',
    'Bad keyboard',
    'Battery does not charge properly',
    'Camera not working',
    "Can't connect to wireless network",
    "Dead - Won't Start",
    'Dim Display',
    'Display Cracked',
    'Display flickering',
    'Drivers issue',
    'Hinges broken',
    'Laptop shuts down unexpectedly',
  ],
  'Mobile': [
    'Battery replacement',
    'Screen replacement',
    'Water damage',
    'Charging port issue',
  ],
};

const accessories = ['Bag', 'Charger', 'Mouse', 'Keyboard', 'Cable', 'Manual', 'Box'];

export default function SelfCheckIn() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | ''>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [devicePassword, setDevicePassword] = useState<string>('');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [searchDevice, setSearchDevice] = useState<string>('');
  const [searchBrand, setSearchBrand] = useState<string>('');
  const [searchModel, setSearchModel] = useState<string>('');
  const [searchService, setSearchService] = useState<string>('');
  
  // Basic Information
  const [yourName, setYourName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const filteredDevices = deviceTypes.filter(device =>
    device.toLowerCase().includes(searchDevice.toLowerCase())
  );

  const filteredBrands = selectedDevice && deviceBrands[selectedDevice] 
    ? deviceBrands[selectedDevice]!.filter(brand =>
        brand.toLowerCase().includes(searchBrand.toLowerCase())
      )
    : [];

  const filteredModels = selectedBrand && deviceModels[selectedBrand]
    ? deviceModels[selectedBrand].filter(model =>
        model.toLowerCase().includes(searchModel.toLowerCase())
      )
    : [];

  const availableServices = selectedDevice && services[selectedDevice]
    ? services[selectedDevice].filter(service =>
        service.toLowerCase().includes(searchService.toLowerCase())
      )
    : [];

  const handleDeviceSelect = (device: DeviceType) => {
    setSelectedDevice(device);
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedServices([]);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
    setSelectedServices([]);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setSelectedServices([]);
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleAccessory = (accessory: string) => {
    setSelectedAccessories(prev =>
      prev.includes(accessory)
        ? prev.filter(a => a !== accessory)
        : [...prev, accessory]
    );
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const breadcrumbs = () => {
    const items = ['Device Information'];
    if (selectedDevice) items.push(selectedDevice);
    if (selectedBrand) items.push(selectedBrand);
    if (selectedModel) items.push(selectedModel);
    if (currentStep === 2 && selectedModel) items.push('Step 4');
    return items;
  };

  const showSummary = selectedDevice || currentStep >= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-[#4A70A9]' : 'bg-gray-300'
              }`}>
                {currentStep > 1 ? (
                  <Check className="w-8 h-8 text-white" />
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep >= 1 ? 'text-[#4A70A9]' : 'text-gray-400'
              }`}>
                Device Information
              </span>
            </div>

            <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-[#4A70A9]' : 'bg-gray-300'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-[#4A70A9]' : 'bg-gray-300'
              }`}>
                {currentStep > 2 ? (
                  <Check className="w-8 h-8 text-white" />
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep >= 2 ? 'text-[#4A70A9]' : 'text-gray-400'
              }`}>
                Basic Information
              </span>
            </div>

            <div className={`flex-1 h-0.5 ${currentStep >= 3 ? 'bg-[#4A70A9]' : 'bg-gray-300'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-[#4A70A9]' : 'bg-gray-300'
              }`}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep >= 3 ? 'text-[#4A70A9]' : 'text-gray-400'
              }`}>
                Save Or Book Pickup
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Summary Sidebar */}
          {showSummary && (
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Device Information</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDevice && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {selectedDevice}
                      </span>
                    )}
                    {selectedBrand && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {selectedBrand}
                      </span>
                    )}
                    {selectedModel && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {selectedModel}
                      </span>
                    )}
                  </div>
                </div>

                {selectedServices.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Service Information</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Services:</span> {selectedServices.join(', ')}
                    </p>
                    {serialNumber && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Serial Number:</span> {serialNumber}
                      </p>
                    )}
                    {selectedAccessories.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Accessories:</span> {selectedAccessories.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStep === 1 && 'Device Information'}
                  {currentStep === 2 && 'Basic Information'}
                  {currentStep === 3 && 'Save Or Book Pickup'}
                </h2>
              </div>

              <div className="p-6">
                {/* Breadcrumb */}
                {currentStep === 1 && (
                  <div className="flex items-center space-x-2 text-sm mb-6">
                    {breadcrumbs().map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                        <span className={index === breadcrumbs().length - 1 ? 'text-gray-900 font-medium' : 'text-[#4A70A9]'}>
                          {item}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Step 1: Device Selection */}
                {currentStep === 1 && !selectedDevice && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-base font-medium text-gray-900 mb-4">Select device type</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type or search for device type"
                          value={searchDevice}
                          onChange={(e) => setSearchDevice(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {filteredDevices.map((device) => (
                        <button
                          key={device}
                          onClick={() => handleDeviceSelect(device)}
                          className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center font-medium text-gray-700 hover:text-[#4A70A9]"
                        >
                          {device}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand Selection */}
                {currentStep === 1 && selectedDevice && !selectedBrand && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-base font-medium text-gray-900 mb-4">Select device brand</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type or search for device brand"
                          value={searchBrand}
                          onChange={(e) => setSearchBrand(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {filteredBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleBrandSelect(brand)}
                          className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center font-medium text-gray-700 hover:text-[#4A70A9]"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Selection */}
                {currentStep === 1 && selectedBrand && !selectedModel && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-base font-medium text-gray-900 mb-4">Select model</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type or search for device model"
                          value={searchModel}
                          onChange={(e) => setSearchModel(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {filteredModels.map((model) => (
                        <button
                          key={model}
                          onClick={() => handleModelSelect(model)}
                          className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#4A70A9] hover:bg-blue-50 transition-all text-center font-medium text-gray-700 hover:text-[#4A70A9]"
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Selection & Details */}
                {currentStep === 1 && selectedModel && (
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedModel}</h3>
                      <p className="text-sm text-gray-600 mt-1">Brand: {selectedBrand}</p>
                    </div>

                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type or search for service type"
                          value={searchService}
                          onChange={(e) => setSearchService(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {availableServices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {availableServices.map((service) => (
                          <button
                            key={service}
                            onClick={() => toggleService(service)}
                            className={`p-4 border-2 rounded-lg flex items-center justify-between transition-all ${
                              selectedServices.includes(service)
                                ? 'border-[#4A70A9] bg-blue-50'
                                : 'border-gray-200 hover:border-[#4A70A9] hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Wrench className="w-5 h-5 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{service}</span>
                            </div>
                            <div
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                selectedServices.includes(service)
                                  ? 'bg-[#4A70A9] border-[#4A70A9]'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedServices.includes(service) && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 mb-8">
                        No services available
                      </div>
                    )}

                    {/* Serial Number & Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Serial / IMEI Number
                        </label>
                        <input
                          type="text"
                          placeholder="Type device serial number"
                          value={serialNumber}
                          onChange={(e) => setSerialNumber(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Device password
                        </label>
                        <input
                          type="password"
                          placeholder="Device password"
                          value={devicePassword}
                          onChange={(e) => setDevicePassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Accessories */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Accessories
                      </label>
                      <div className="relative">
                        <select
                          multiple
                          value={selectedAccessories}
                          onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions, option => option.value);
                            setSelectedAccessories(options);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        >
                          {accessories.map((accessory) => (
                            <option key={accessory} value={accessory}>
                              {accessory}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple items</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Basic Information */}
                {currentStep === 2 && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Eg: John Smith"
                          value={yourName}
                          onChange={(e) => setYourName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                        {yourName === '' && (
                          <p className="text-xs text-red-500 mt-1">Name is a required field.</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Mobile Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg text-sm">
                            +91
                          </span>
                          <input
                            type="tel"
                            placeholder="Eg: 99XXXXXXXX"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email ID
                        </label>
                        <input
                          type="email"
                          placeholder="Eg: example@example.com"
                          value={emailId}
                          onChange={(e) => setEmailId(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          I agree to your terms and conditions mentioned above
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Save Or Book Pickup */}
                {currentStep === 3 && (
                  <div>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted Successfully!</h3>
                      <p className="text-gray-600 mb-8">Your device information has been saved. Choose an option below:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <button className="p-6 border-2 border-[#4A70A9] rounded-lg hover:bg-blue-50 transition-all">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#4A70A9] rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Save for Later</h4>
                            <p className="text-sm text-gray-600">Save your information and complete the process later</p>
                          </div>
                        </button>
                        
                        <button className="p-6 border-2 border-[#4A70A9] bg-[#4A70A9] text-white rounded-lg hover:bg-[#3d5c8a] transition-all">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">Book Pickup</h4>
                            <p className="text-sm opacity-90">Schedule a pickup for your device repair</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      disabled={currentStep === 1 && !selectedModel}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        (currentStep === 1 && !selectedModel) || (currentStep === 2 && (!yourName || !agreeTerms))
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#4A70A9] text-white hover:bg-[#3d5c8a]'
                      }`}
                    >
                      {currentStep === 2 ? 'Complete' : 'Next'}
                    </button>
                  ) : (
                    <button
                      onClick={() => window.location.href = '/customer/dashboard'}
                      className="px-6 py-3 bg-[#4A70A9] text-white rounded-lg font-medium hover:bg-[#3d5c8a] transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}