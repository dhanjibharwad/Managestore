"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  device_type_id: number;
  device_type_name: string;
  created_at: string;
  updated_at: string;
}

interface DeviceType {
  id: number;
  name: string;
}

interface ServicesPageProps {
  addModal?: boolean;
  setAddModal?: (value: boolean) => void;
}

const ServicesPage = ({ addModal = false, setAddModal }: ServicesPageProps = {}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, service: Service | null}>({show: false, service: null});
  const [deleteModal, setDeleteModal] = useState<{show: boolean, service: Service | null}>({show: false, service: null});
  const [formData, setFormData] = useState({
    name: '',
    device_type_id: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const showAddModal = setAddModal ? addModal : internalAddModal;
  const handleSetAddModal = (value: boolean) => {
    if (setAddModal) setAddModal(value);
    else setInternalAddModal(value);
    if (!value) resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      device_type_id: selectedDeviceType?.toString() || ''
    });
  };

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch('/api/devices/types');
      if (response.ok) {
        const data = await response.json();
        setDeviceTypes(data);
        if (data.length > 0 && !selectedDeviceType) {
          setSelectedDeviceType(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchServices = async () => {
    if (!selectedDeviceType) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/services?device_type_id=${selectedDeviceType}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.device_type_id) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          device_type_id: parseInt(formData.device_type_id)
        })
      });
      if (response.ok) {
        handleSetAddModal(false);
        fetchServices();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editModal.service || !formData.name.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editModal.service.id,
          name: formData.name,
          device_type_id: parseInt(formData.device_type_id)
        })
      });
      if (response.ok) {
        setEditModal({show: false, service: null});
        fetchServices();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.service) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/services?id=${deleteModal.service.id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteModal({show: false, service: null});
        fetchServices();
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  useEffect(() => {
    if (selectedDeviceType) {
      fetchServices();
      setFormData(prev => ({ ...prev, device_type_id: selectedDeviceType.toString() }));
    }
  }, [selectedDeviceType]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <>
      <div className="mb-4">
        <select 
          value={selectedDeviceType || ''} 
          onChange={(e) => setSelectedDeviceType(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9]"
        >
          {deviceTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Services</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Device Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Updated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created On</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No services found</td></tr>
            ) : (
              services.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{service.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{service.device_type_name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(service.updated_at || service.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(service.created_at)}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => { 
                          setEditModal({show: true, service}); 
                          setFormData({
                            name: service.name,
                            device_type_id: service.device_type_id.toString()
                          });
                          setOpenDropdown(null); 
                        }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />Edit
                        </button>
                        <button onClick={() => { setDeleteModal({show: true, service}); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
            <h3 className="text-lg font-semibold mb-4">Add Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device Type</label>
                <select value={formData.device_type_id} onChange={(e) => setFormData({...formData, device_type_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {deviceTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => handleSetAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {editModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device Type</label>
                <select value={formData.device_type_id} onChange={(e) => setFormData({...formData, device_type_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {deviceTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal({show: false, service: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Service</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{deleteModal.service?.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({show: false, service: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md">{submitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesPage;
