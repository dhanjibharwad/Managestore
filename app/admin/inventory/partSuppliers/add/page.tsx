'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { State, City } from 'country-state-city';
import { useRouter } from 'next/navigation';

interface StateType {
  isoCode: string;
  name: string;
}

interface CityType {
  name: string;
}

export default function PartSupplierPage() {
  const router = useRouter();
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [formData, setFormData] = useState({
    supplierName: '',
    mobileNumber: '',
    phoneNumber: '',
    taxNumber: '',
    emailId: '',
    addressLine: '',
    regionState: '',
    cityTown: '',
    postalCode: ''
  });

  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [newRegion, setNewRegion] = useState('');
  const [newCity, setNewCity] = useState('');
  const [regions, setRegions] = useState(['gujarat', 'maharashtra', 'delhi']);
  const [citiesOld, setCitiesOld] = useState(['vadodara', 'ahmedabad', 'surat']);

  useEffect(() => {
    // Load Indian states
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    // Load cities when state changes
    if (formData.regionState) {
      const stateCities = City.getCitiesOfState('IN', formData.regionState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    // Reset city when state changes
    setFormData(prev => ({ ...prev, cityTown: '' }));
  }, [formData.regionState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    router.push('/admin/inventory/partSuppliers');
  };

  const handleCreate = () => {
    console.log('Form Data:', formData);
    // Handle form submission
  };

  const handleSaveRegion = () => {
    if (newRegion.trim()) {
      setRegions([...regions, newRegion.toLowerCase().replace(/\s+/g, '-')]);
      setFormData(prev => ({ ...prev, regionState: newRegion.toLowerCase().replace(/\s+/g, '-') }));
      setNewRegion('');
      setShowRegionModal(false);
    }
  };

  const handleSaveCity = () => {
    if (newCity.trim()) {
      setCitiesOld([...citiesOld, newCity.toLowerCase().replace(/\s+/g, '-')]);
      setFormData(prev => ({ ...prev, cityTown: newCity.toLowerCase().replace(/\s+/g, '-') }));
      setNewCity('');
      setShowCityModal(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Part Supplier Information</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Part Supplier Information Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Part Supplier Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  placeholder="Type supplier name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="+91"
                    disabled
                    className="w-16 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                  />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Eg: 99XXXXXXXX"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Eg: 91XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tax Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Number
                </label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                  placeholder="Type Tax number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="Eg: example@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Address Details <span className="text-gray-400 font-normal">(Optional)</span>
            </h2>

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
                  onChange={handleInputChange}
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Region/State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region/State
                </label>
                <select
                  name="regionState"
                  value={formData.regionState}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Select region / state</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City/Town */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                <select
                  name="cityTown"
                  value={formData.cityTown}
                  onChange={handleInputChange}
                  disabled={!formData.regionState}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  onChange={handleInputChange}
                  placeholder="Type postal code / zip code"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Region/State Modal */}
      {showRegionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New State/Region</h2>
              <button
                onClick={() => {
                  setShowRegionModal(false);
                  setNewRegion('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region/State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                placeholder="Enter region/state name"
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowRegionModal(false);
                  setNewRegion('');
                }}
                className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRegion}
                className="flex-1 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded hover:bg-blue-50 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* City/Town Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New City/Town</h2>
              <button
                onClick={() => {
                  setShowCityModal(false);
                  setNewCity('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                placeholder="Enter city/town name"
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowCityModal(false);
                  setNewCity('');
                }}
                className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCity}
                className="flex-1 px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded hover:bg-blue-50 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}