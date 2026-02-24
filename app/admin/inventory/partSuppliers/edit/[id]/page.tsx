'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { State, City } from 'country-state-city';
import { useRouter, useParams } from 'next/navigation';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface StateType {
  isoCode: string;
  name: string;
}

interface CityType {
  name: string;
}

export default function EditPartSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

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

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = {
      id: nextToastId,
      message,
      type
    };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (formData.regionState) {
      const stateCities = City.getCitiesOfState('IN', formData.regionState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [formData.regionState]);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch('/api/admin/part-suppliers');
        if (response.ok) {
          const suppliers = await response.json();
          const supplier = suppliers.find((s: any) => s.id === parseInt(supplierId));
          
          if (supplier) {
            setFormData({
              supplierName: supplier.supplier_name || '',
              mobileNumber: supplier.mobile_number || '',
              phoneNumber: supplier.phone_number || '',
              taxNumber: supplier.tax_number || '',
              emailId: supplier.email_id || '',
              addressLine: supplier.address_line || '',
              regionState: supplier.region_state || '',
              cityTown: supplier.city_town || '',
              postalCode: supplier.postal_code || ''
            });
          } else {
            showToast('Supplier not found', 'error');
            router.push('/admin/inventory/partSuppliers');
          }
        }
      } catch (error) {
        showToast('Failed to load supplier data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId, router]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'mobileNumber':
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Invalid mobile number';
      case 'emailId':
        return value && !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email format' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'mobileNumber' || name === 'phoneNumber') {
      if (!/^\d*$/.test(value) || value.length > 10) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCancel = () => {
    router.push('/admin/inventory/partSuppliers');
  };

  const handleUpdate = async () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.supplierName.trim()) newErrors.supplierName = 'Supplier name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number';
    if (formData.emailId && !/^\S+@\S+\.\S+$/.test(formData.emailId)) newErrors.emailId = 'Invalid email format';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/part-suppliers?id=${supplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showToast('Supplier updated successfully!', 'success');
        setTimeout(() => {
          router.push('/admin/inventory/partSuppliers');
        }, 2000);
      } else {
        const result = await response.json();
        showToast(result.error || 'Failed to update supplier', 'error');
      }
    } catch (error) {
      showToast('An error occurred while updating the supplier', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
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
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Edit Part Supplier</h1>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleUpdate} disabled={isSubmitting} className="px-4 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5d8f] transition-colors disabled:opacity-50">
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent ${
                    errors.supplierName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.supplierName && <p className="text-red-500 text-sm mt-1">{errors.supplierName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input type="text" value="+91" disabled className="w-16 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600" />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Eg: 99XXXXXXXX"
                    className={`flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Eg: 91XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Number</label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                  placeholder="Type Tax number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="Eg: example@example.com"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent ${
                    errors.emailId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.emailId && <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Address Details <span className="text-gray-400 font-normal">(Optional)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line</label>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleInputChange}
                  placeholder="House / building name/no, street name, locality"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region/State</label>
                <select
                  name="regionState"
                  value={formData.regionState}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Town</label>
                <select
                  name="cityTown"
                  value={formData.cityTown}
                  onChange={handleInputChange}
                  disabled={!formData.regionState}
                  className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code/ Zip Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Type postal code / zip code"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
