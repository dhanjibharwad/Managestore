"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';

interface Model {
  id: number;
  name: string;
  device_brand_id: number;
  created_at: string;
  updated_at: string;
}

interface Brand {
  id: number;
  name: string;
  device_type_id: number;
}

interface DeviceType {
  id: number;
  name: string;
}

interface ModelsPageProps {
  addModal?: boolean;
  setAddModal?: (value: boolean) => void;
}

const ModelsPage = ({ addModal = false, setAddModal }: ModelsPageProps = {}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, model: Model | null}>({show: false, model: null});
  const [deleteModal, setDeleteModal] = useState<{show: boolean, model: Model | null}>({show: false, model: null});
  const [formName, setFormName] = useState('');
  const [formDeviceTypeId, setFormDeviceTypeId] = useState('');
  const [formBrandId, setFormBrandId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const showAddModal = setAddModal ? addModal : internalAddModal;
  const handleSetAddModal = (value: boolean) => {
    if (setAddModal) setAddModal(value);
    else setInternalAddModal(value);
  };

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/devices/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/devices/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Error:', error);
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
    if (!formName.trim() || !formBrandId) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/devices/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formName.trim(),
          device_brand_id: parseInt(formBrandId)
        })
      });
      if (response.ok) {
        handleSetAddModal(false);
        setFormName('');
        setFormDeviceTypeId('');
        setFormBrandId('');
        fetchModels();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editModal.model || !formName.trim() || !formBrandId) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/devices/models', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editModal.model.id, 
          name: formName.trim(),
          device_brand_id: parseInt(formBrandId)
        })
      });
      if (response.ok) {
        setEditModal({show: false, model: null});
        setFormName('');
        setFormDeviceTypeId('');
        setFormBrandId('');
        fetchModels();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.model) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/devices/models?id=${deleteModal.model.id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteModal({show: false, model: null});
        fetchModels();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete model');
      }
    } catch (err) {
      setError('Failed to delete model');
    } finally {
      setSubmitting(false);
    }
  };

  const getBrandName = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    return brand?.name || 'Unknown';
  };

  const getDeviceTypeName = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return 'Unknown';
    const deviceType = deviceTypes.find(dt => dt.id === brand.device_type_id);
    return deviceType?.name || 'Unknown';
  };

  const getFilteredBrands = () => {
    if (!formDeviceTypeId) return brands;
    return brands.filter(brand => brand.device_type_id === parseInt(formDeviceTypeId));
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
    fetchModels();
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Model Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Device Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Updated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created On</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : models.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No models found</td></tr>
            ) : (
              models.map((model, index) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{model.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{getBrandName(model.device_brand_id)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{getDeviceTypeName(model.device_brand_id)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(model.updated_at || model.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(model.created_at)}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => { 
                          const brand = brands.find(b => b.id === model.device_brand_id);
                          setEditModal({show: true, model}); 
                          setFormName(model.name); 
                          setFormDeviceTypeId(brand?.device_type_id.toString() || '');
                          setFormBrandId(model.device_brand_id.toString()); 
                          setOpenDropdown(null); 
                        }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />Edit
                        </button>
                        <button onClick={() => { setDeleteModal({show: true, model}); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />Delete
                        </button>
                      </div>
                    )}
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
            <h3 className="text-lg font-semibold mb-4">Add Model</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                placeholder="Model Name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
              <select 
                value={formDeviceTypeId} 
                onChange={(e) => {
                  setFormDeviceTypeId(e.target.value);
                  setFormBrandId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select 
                value={formBrandId} 
                onChange={(e) => setFormBrandId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!formDeviceTypeId}
              >
                <option value="">Select Brand</option>
                {getFilteredBrands().map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
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

      {editModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Model</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
              <select 
                value={formDeviceTypeId} 
                onChange={(e) => {
                  setFormDeviceTypeId(e.target.value);
                  setFormBrandId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select 
                value={formBrandId} 
                onChange={(e) => setFormBrandId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!formDeviceTypeId}
              >
                <option value="">Select Brand</option>
                {getFilteredBrands().map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditModal({show: false, model: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Model</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{deleteModal.model?.name}</strong>?</p>
            {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setDeleteModal({show: false, model: null}); setError(''); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md">{submitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelsPage;