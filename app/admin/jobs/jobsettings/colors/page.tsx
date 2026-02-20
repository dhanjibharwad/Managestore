"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Color {
  id: number;
  name: string;
  color_code: string;
  created_at: string;
  updated_at: string;
}

interface ColorsPageProps {
  addModal?: boolean;
  setAddModal?: (value: boolean) => void;
}

const ColorsPage = ({ addModal = false, setAddModal }: ColorsPageProps = {}) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, color: Color | null}>({show: false, color: null});
  const [deleteModal, setDeleteModal] = useState<{show: boolean, color: Color | null}>({show: false, color: null});
  const [formName, setFormName] = useState('');
  const [formColorCode, setFormColorCode] = useState('#000000');
  const [submitting, setSubmitting] = useState(false);

  const showAddModal = setAddModal ? addModal : internalAddModal;
  const handleSetAddModal = (value: boolean) => {
    if (setAddModal) setAddModal(value);
    else setInternalAddModal(value);
  };

  const fetchColors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/devices/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formName.trim() || !formColorCode) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/devices/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formName.trim(),
          color_code: formColorCode
        })
      });
      if (response.ok) {
        handleSetAddModal(false);
        setFormName('');
        setFormColorCode('#000000');
        fetchColors();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editModal.color || !formName.trim() || !formColorCode) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/devices/colors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editModal.color.id, 
          name: formName.trim(),
          color_code: formColorCode
        })
      });
      if (response.ok) {
        setEditModal({show: false, color: null});
        setFormName('');
        setFormColorCode('#000000');
        fetchColors();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.color) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/devices/colors?id=${deleteModal.color.id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteModal({show: false, color: null});
        fetchColors();
      }
    } finally {
      setSubmitting(false);
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

  useEffect(() => {
    fetchColors();
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Colors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Updated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created On</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : colors.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No colors found</td></tr>
            ) : (
              colors.map((color, index) => (
                <tr key={color.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{color.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border border-gray-300" style={{backgroundColor: color.color_code}}></div>
                      <span className="text-gray-600">{color.color_code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(color.updated_at || color.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(color.created_at)}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => { setEditModal({show: true, color}); setFormName(color.name); setFormColorCode(color.color_code); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />Edit
                        </button>
                        <button onClick={() => { setDeleteModal({show: true, color}); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
            <h3 className="text-lg font-semibold mb-4">Add Color</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                placeholder="Color Name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
              <div className="flex gap-3 items-center">
                <input 
                  type="color" 
                  value={formColorCode} 
                  onChange={(e) => setFormColorCode(e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input 
                  type="text" 
                  value={formColorCode} 
                  onChange={(e) => setFormColorCode(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
            <h3 className="text-lg font-semibold mb-4">Edit Color</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={formName} 
                onChange={(e) => setFormName(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
              <div className="flex gap-3 items-center">
                <input 
                  type="color" 
                  value={formColorCode} 
                  onChange={(e) => setFormColorCode(e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input 
                  type="text" 
                  value={formColorCode} 
                  onChange={(e) => setFormColorCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditModal({show: false, color: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Color</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{deleteModal.color?.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({show: false, color: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md">{submitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ColorsPage;
