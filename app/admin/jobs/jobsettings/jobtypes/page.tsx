"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface JobType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface JobTypesPageProps {
  addModal?: boolean;
  setAddModal?: (value: boolean) => void;
  searchQuery?: string;
}

const JobTypesPage = ({ addModal = false, setAddModal, searchQuery = '' }: JobTypesPageProps = {}) => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{show: boolean, type: JobType | null}>({show: false, type: null});
  const [deleteModal, setDeleteModal] = useState<{show: boolean, type: JobType | null}>({show: false, type: null});
  const [formName, setFormName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showAddModal = setAddModal ? addModal : internalAddModal;
  const handleSetAddModal = (value: boolean) => {
    if (setAddModal) setAddModal(value);
    else setInternalAddModal(value);
  };

  const fetchJobTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/job-types');
      if (response.ok) {
        const data = await response.json();
        setJobTypes(data);
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

  const filteredJobTypes = jobTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/job-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim() })
      });
      if (response.ok) {
        handleSetAddModal(false);
        setFormName('');
        fetchJobTypes();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editModal.type || !formName.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/job-types', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editModal.type.id, name: formName.trim() })
      });
      if (response.ok) {
        setEditModal({show: false, type: null});
        setFormName('');
        fetchJobTypes();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.type) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/job-types?id=${deleteModal.type.id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteModal({show: false, type: null});
        fetchJobTypes();
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchJobTypes();
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Updated On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created On</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : filteredJobTypes.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No job types found</td></tr>
            ) : (
              filteredJobTypes.map((type, index) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{type.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(type.updated_at || type.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{formatDate(type.created_at)}</td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }} className="text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => { setEditModal({show: true, type}); setFormName(type.name); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />Edit
                        </button>
                        <button onClick={() => { setDeleteModal({show: true, type}); setOpenDropdown(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
            <h3 className="text-lg font-semibold mb-4">Add Job Type</h3>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Job Type Name" className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4" />
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
            <h3 className="text-lg font-semibold mb-4">Edit Job Type</h3>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setEditModal({show: false, type: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">{submitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Job Type</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{deleteModal.type?.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({show: false, type: null})} className="flex-1 px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md">{submitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobTypesPage;
