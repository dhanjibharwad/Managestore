"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  device_type_id: number;
  device_type_name?: string;
  created_at: string;
  updated_at: string;
}

interface DeviceType {
  id: number;
  name: string;
}

interface BrandsPageProps {
  addModal?: boolean;
  setAddModal?: (value: boolean) => void;
}

const BrandsPage = ({ addModal = false, setAddModal }: BrandsPageProps = {}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, brand: Brand | null}>({show: false, brand: null});
  const [deleteModal, setDeleteModal] = useState<{show: boolean, brand: Brand | null}>({show: false, brand: null});
  const [formName, setFormName] = useState('');
  const [formDeviceTypeId, setFormDeviceTypeId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showAddModal = setAddModal ? addModal : internalAddModal;
  const handleSetAddModal = (value: boolean) => {
    if (setAddModal) setAddModal(value);
    else setInternalAddModal(value);
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/devices/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
      console.error('Error:', error);
    }
  };

  const handleAdd = async () => {
    if (!formName.trim() || !formDeviceTypeId) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/devices/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formName.trim(),
          device_type_id: parseInt(formDeviceTypeId)
        })
      });
      if (response.ok) {
        handleSetAddModal(false);
        setFormName('');
        setFormDeviceTypeId('');
        fetchBrands();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getDeviceTypeName = (deviceTypeId: number) => {
    const deviceType = deviceTypes.find(dt => dt.id === deviceTypeId);
    return deviceType?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    fetchBrands();
    fetchDeviceTypes();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Brand Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Device Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Updated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created On</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No brands found</td></tr>
            ) : (
              brands.map((brand, index) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{brand.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{getDeviceTypeName(brand.device_type_id)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(brand.updated_at || brand.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(brand.created_at)}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add Brand</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                placeholder="Brand Name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
              <select 
                value={formDeviceTypeId} 
                onChange={(e) => setFormDeviceTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleSetAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandsPage;