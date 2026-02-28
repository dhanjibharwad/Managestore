'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function AddPartPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);
  const [formData, setFormData] = useState({
    partName: '',
    category: '',
    subCategory: '',
    warranty: '',
    storageLocation: '',
    openingStock: '',
    unitType: '',
    sku: '',
    lowStockUnits: '',
    barcodeNumber: '',
    rateIncludingTax: false,
    manageStock: true,
    lowStockAlert: true,
    purchasePrice: '0',
    sellingPrice: '',
    tax: '',
    hsnCode: '',
    partDescription: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [storageLocations, setStorageLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = {
      id: nextToastId,
      message,
      type
    };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Load subcategories when category changes
    if (name === 'category' && value) {
      loadSubcategories(value);
    }
  };

  const handleToggle = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: newCategoryName })
      });
      
      const result = await response.json();
      if (response.ok) {
        setFormData(prev => ({ ...prev, category: result.category.id }));
        setNewCategoryName('');
        setShowCategoryModal(false);
        loadCategories(); // Refresh categories
      } else {
        showToast(result.error || 'Failed to create category', 'error');
      }
    } catch (error) {
      showToast('Error creating category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedCategoryForSub) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categoryId: selectedCategoryForSub, 
          subcategoryName: newSubCategoryName 
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        setFormData(prev => ({ ...prev, subCategory: result.subcategory.id }));
        setNewSubCategoryName('');
        setSelectedCategoryForSub('');
        setShowSubCategoryModal(false);
        loadSubcategories(formData.category); // Refresh subcategories
      } else {
        showToast(result.error || 'Failed to create subcategory', 'error');
      }
    } catch (error) {
      showToast('Error creating subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const result = await response.json();
      if (response.ok) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/subcategories?categoryId=${categoryId}`);
      const result = await response.json();
      if (response.ok) {
        setSubcategories(result.subcategories);
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const loadStorageLocations = async () => {
    try {
      const response = await fetch('/api/admin/storage-locations');
      const result = await response.json();
      if (response.ok && Array.isArray(result)) {
        setStorageLocations(result);
      }
    } catch (error) {
      console.error('Error loading storage locations:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadStorageLocations();
  }, []);

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (showCategoryModal || showSubCategoryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCategoryModal, showSubCategoryModal]);

  const handleSubmit = async () => {
    if (!formData.partName || !formData.openingStock || !formData.purchasePrice) {
      showToast('Please fill in required fields: Part Name, Opening Stock, and Purchase Price', 'warning');
      return;
    }

    // Convert numeric fields and validate
    const numericData = {
      ...formData,
      openingStock: parseInt(formData.openingStock) || 0,
      lowStockUnits: parseInt(formData.lowStockUnits) || 0,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0
    };

    setIsSubmitting(true);
    
    try {
      let uploadedFileUrls: string[] = [];
      
      // Upload files if any
      if (uploadedFiles.length > 0) {
        try {
          const fileFormData = new FormData();
          uploadedFiles.forEach(file => {
            fileFormData.append('files', file);
          });
          
          const uploadResponse = await fetch('/api/admin/upload', {
            method: 'POST',
            body: fileFormData,
          });
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            uploadedFileUrls = uploadResult.files.map((f: any) => f.url);
          } else {
            showToast('Failed to upload images, but continuing with part creation', 'warning');
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          showToast('Failed to upload images, but continuing with part creation', 'warning');
        }
      }
      
      // Create inventory part with file URLs
      const partData = {
        ...numericData,
        images: uploadedFileUrls
      };
      
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`Inventory part created successfully! Part ID: ${result.part.part_id}`, 'success');
        setTimeout(() => {
          router.push('/admin/inventory');
        }, 2000);
      } else {
        showToast(result.error || 'Failed to create inventory part', 'error');
      }
    } catch (error) {
      console.error('Error creating inventory part:', error);
      showToast('An error occurred while creating the inventory part', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Toast Container */}
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
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Add Part</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/admin/inventory')}
              className="px-8 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Basic Information Section */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">
                  Part Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleInputChange}
                  placeholder="Eg: RAM, optical drive, etc"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Category</label>
                <div className="flex gap-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setShowCategoryModal(true)}
                    className="px-3.5 py-3 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Sub Category</label>
                <div className="flex gap-2">
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                    disabled={!formData.category}
                  >
                    <option value="">Select sub category</option>
                    {subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.subcategory_name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setShowSubCategoryModal(true)}
                    className="px-3.5 py-3 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Warranty</label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder="Type warranty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Storage Location</label>
                <select
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                >
                  <option value="">Select storage location</option>
                  {storageLocations.map(location => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stock Information Section */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Stock Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">
                  Opening Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="openingStock"
                  value={formData.openingStock}
                  onChange={handleInputChange}
                  placeholder="Type in numbers only"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Unit Type</label>
                <select
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                >
                  <option value="">Select unit type</option>
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="units">Units</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Type SKU code / barcode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Low Stock Units</label>
                <input
                  type="text"
                  name="lowStockUnits"
                  value={formData.lowStockUnits}
                  onChange={handleInputChange}
                  placeholder="Type low stock units"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Barcode Information Section */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Barcode Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Barcode Number</label>
                <input
                  type="text"
                  name="barcodeNumber"
                  value={formData.barcodeNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>
              {/* <div className="flex items-end">
                <button className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors text-sm">
                  View Barcode
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01" />
                  </svg>
                </button>
              </div> */}
            </div>

            {/* Toggle Switches */}
            <div className="flex flex-wrap gap-12">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle('rateIncludingTax')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.rateIncludingTax ? 'bg-[#4A70A9]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.rateIncludingTax ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">Rate Including Tax</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle('manageStock')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.manageStock ? 'bg-[#4A70A9]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.manageStock ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">Manage Stock</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle('lowStockAlert')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.lowStockAlert ? 'bg-[#4A70A9]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.lowStockAlert ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">Low Stock Alert</span>
              </div>
            </div>
          </div>

          {/* Price Information Section */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Price Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">
                  Purchase Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Selling Price</label>
                <input
                  type="text"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="Enter selling price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Tax</label>
                <select
                  name="tax"
                  value={formData.tax}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                >
                  <option value="">Select tax</option>
                  <option value="GST 18%">GST 18%</option>
                  <option value="IGST 18%">IGST 18%</option>
                  <option value="GST 12%">GST 12%</option>
                  <option value="GST 5%">GST 5%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">HSN Code</label>
                <input
                  type="text"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleInputChange}
                  placeholder="Type HSN / SAC code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Part Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2.5">Part Description</label>
              <div className="border border-gray-300 rounded-md">
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
                  {/* <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10h18M3 14h18" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                    </svg>
                  </button> */}
                  {/* <div className="px-3 py-1.5 text-sm border border-gray-300 rounded"> */}
                    <option>Normal text</option>
                    {/* <option>Heading 1</option> */}
                    {/* <option>Heading 2</option> */}
                  {/* </div> */}
                  {/* <button className="p-1.5 hover:bg-gray-200 rounded font-bold transition-colors">B</button>
                  <button className="p-1.5 hover:bg-gray-200 rounded italic transition-colors">I</button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">S</button>
                  <button className="p-1.5 hover:bg-gray-200 rounded underline transition-colors">U</button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">≡</button> */}
                </div>
                <textarea
                  name="partDescription"
                  value={formData.partDescription}
                  onChange={handleInputChange}
                  placeholder="Enter part description"
                  rows={5}
                  className="w-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#4A70A9] resize-none text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Max Allowed Characters 50000</p>
            </div>
          </div>

          {/* Upload Images Section */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Upload Images</h2>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center hover:border-[#4A70A9] transition-colors cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#4A70A9] rounded-full flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
              <p className="text-[#4A70A9] font-medium mb-2 text-base">
                Take A Photo With Your Camera Or Choose A File From Your Device
              </p>
              <p className="text-sm text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES (Max 10MB each)</p>
            </div>
            
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/bmp,image/webp,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Uploaded Files:</h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        {file.type.startsWith('image/') ? '🖼️' : '📄'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
              <button 
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Eg: storage, power supply etc"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
              />
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName('');
                }}
                className="flex-1 px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={loading || !newCategoryName.trim()}
                className="flex-1 px-6 py-3 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-blue-50 font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sub Category Modal */}
      {showSubCategoryModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Sub Category</h2>
              <button 
                onClick={() => {
                  setShowSubCategoryModal(false);
                  setNewSubCategoryName('');
                  setSelectedCategoryForSub('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategoryForSub}
                  onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder="Eg: storage, power supply etc"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => {
                  setShowSubCategoryModal(false);
                  setNewSubCategoryName('');
                  setSelectedCategoryForSub('');
                }}
                className="flex-1 px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubCategory}
                disabled={loading || !newSubCategoryName.trim() || !selectedCategoryForSub}
                className="flex-1 px-6 py-3 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-blue-50 font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}