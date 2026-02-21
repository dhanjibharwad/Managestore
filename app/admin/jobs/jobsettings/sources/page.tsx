"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Source {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface SourcesPageProps {
  addModal?: boolean;
  setAddModal?: (value: boolean) => void;
}

const SourcesPage = ({ addModal = false, setAddModal }: SourcesPageProps = {}) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, source: Source | null}>({show: false, source: null});
  const [deleteModal, setDeleteModal] = useState<{show: boolean, source: Source | null}>({show: false, source: null});
  const [formName, setFormName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showAddModal = setAddModal ? addModal : internalAddModal;
  const handleSetAddModal = (value: boolean) => {
    if (setAddModal) setAddModal(value);
    else setInternalAddModal(value);
  };

  const fetchSources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sources');
      if (response.ok) {
        const data = await response.json();
        setSources(data);
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
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim() })
      });
      if (response.ok) {
        handleSetAddModal(false);
        setFormName('');
        fetchSources();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editModal.source || !formName.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/sources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editModal.source.id, name: formName.trim() })
      });
      if (response.ok) {
        setEditModal({show: false, source: null});
        setFormName('');
        fetchSources();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.source) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/sources?id=${deleteModal.source.id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteModal({show: false, source: null});
        fetchSources();
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSources();
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Updated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created On</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : sources.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No sources found</td></tr>
            ) : (
              sources.map((source, index) => (
                <tr key={source.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{source.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(source.updated_at || source.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(source.created_at)}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => { setEditModal({show: true, source}); setFormName(source.name); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />Edit
                        </button>
                        <button onClick={() => { setDeleteModal({show: true, source}); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
            <h3 className="text-lg font-semibold mb-4">Add Source</h3>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Source Name" className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4" />
            <div className="flex gap-3">
              <button onClick={() => handleSetAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {editModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Source</h3>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setEditModal({show: false, source: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Source</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{deleteModal.source?.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({show: false, source: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md">{submitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SourcesPage;
