/* eslint-disable */
"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  popular: boolean;
  features: Feature[];
}

const PricingManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; planId: string; planName: string }>({ show: false, planId: '', planName: '' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      const normalizedData = data.map((plan: Plan) => ({
        ...plan,
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || 0,
        features: plan.features.map(f => ({ name: f.name || '', included: f.included }))
      }));
      setPlans(normalizedData);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan({ 
      ...plan,
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price || 0,
      features: plan.features.map(f => ({ name: f.name || '', included: f.included }))
    });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (editingPlan) {
      try {
        await fetch('/api/pricing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPlan),
        });
        await fetchPlans();
        setEditingPlan(null);
      } catch (error) {
        console.error('Error updating plan:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/pricing?id=${id}`, { method: 'DELETE' });
      await fetchPlans();
      setDeleteConfirm({ show: false, planId: '', planName: '' });
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleAddNew = () => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      description: '',
      popular: false,
      features: [],
    };
    setEditingPlan(newPlan);
    setIsAddingNew(true);
  };

  const handleSaveNew = async () => {
    if (editingPlan) {
      try {
        await fetch('/api/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPlan),
        });
        await fetchPlans();
        setEditingPlan(null);
        setIsAddingNew(false);
      } catch (error) {
        console.error('Error creating plan:', error);
      }
    }
  };

  const addFeature = () => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, { name: '', included: true }],
      });
    }
  };

  const updateFeature = (index: number, field: keyof Feature, value: string | boolean) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      newFeatures[index] = { 
        ...newFeatures[index], 
        [field]: field === 'name' ? (value || '') : value 
      };
      setEditingPlan({ ...editingPlan, features: newFeatures });
    }
  };

  const removeFeature = (index: number) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: editingPlan.features.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pricing Plans Management</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#4A70A9] text-white px-4 py-2 rounded-lg hover:bg-[#3d5d8f] transition"
        >
          <Plus className="w-5 h-5" />
          Add New Plan
        </button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                {plan.popular && (
                  <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded-full">Popular</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: true, planId: plan.id, planName: plan.name })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
            <div className="text-3xl font-bold text-gray-800 mb-4">
              ₹{plan.price}<span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            <div className="space-y-2">
              {plan.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className={feature.included ? 'text-green-600' : 'text-red-600'}>
                    {feature.included ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-700">{feature.name}</span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <p className="text-xs text-gray-500">+{plan.features.length - 3} more features</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {isAddingNew ? 'Add New Plan' : 'Edit Plan'}
              </h2>
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setIsAddingNew(false);
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹/month)</label>
                <input
                  type="number"
                  value={editingPlan.price || 0}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingPlan.description || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingPlan.popular}
                  onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                  className="w-4 h-4 text-[#4A70A9] rounded focus:ring-[#4A70A9]"
                />
                <label className="text-sm font-medium text-gray-700">Mark as Popular</label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={addFeature}
                    className="text-sm text-[#4A70A9] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={feature.included}
                        onChange={(e) => updateFeature(index, 'included', e.target.checked)}
                        className="w-4 h-4 text-[#4A70A9] rounded focus:ring-[#4A70A9]"
                      />
                      <input
                        type="text"
                        value={feature.name || ''}
                        onChange={(e) => updateFeature(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                        placeholder="Feature name"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={isAddingNew ? handleSaveNew : handleSave}
                className="flex items-center gap-2 bg-[#4A70A9] text-white px-4 py-2 rounded-lg hover:bg-[#3d5d8f] transition"
              >
                <Save className="w-4 h-4" />
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Plan</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the <span className="font-semibold">{deleteConfirm.planName}</span> plan? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, planId: '', planName: '' })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.planId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingManagement;
