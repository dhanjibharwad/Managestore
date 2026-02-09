'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Undo2, Redo2, ChevronDown, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function ExpensePage() {
  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const maxCharacters = 50000;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setDescription(text);
      setCharacterCount(text.length);
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

  const handleSubmit = async () => {
    // Validation
    if (!expenseName || !category || !expenseDate || !paymentMode || !amount) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (parseFloat(amount) <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let uploadedFileUrls: string[] = [];
      
      // Upload files if any
      if (uploadedFiles.length > 0) {
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
        }
      }
      
      // Create expense with file URLs
      const expenseData = {
        expenseName,
        category,
        expenseDate,
        description,
        paymentMode,
        amount: parseFloat(amount),
        attachments: uploadedFileUrls
      };
      
      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`Expense created successfully! Expense ID: ${result.expense.expense_id}`, 'success');
        setTimeout(() => router.push('/admin/expenses'), 2000);
      } else {
        showToast(result.error || 'Failed to create expense', 'error');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      showToast('An error occurred while creating the expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-end items-center px-6 py-4 border-b border-gray-200">
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/admin/expenses')}
              className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Expense Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Expense Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Expense Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type expense name"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select category</option>
                    <option value="food">Food</option>
                    <option value="utilities">Utilities</option>
                    <option value="transportation">Transportation</option>
                    <option value="salaries">Salaries</option>
                    <option value="rent">Rent</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Expense Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>

            {/* Expense Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Description
              </label>
              
              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t bg-gray-50 px-3 py-2 flex items-center gap-2">
                {/* <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                  <Undo2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                  <Redo2 className="w-4 h-4" />
                </button> */}
                <div className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                  <option>Normal text</option>
                  {/* <option>Heading 1</option>
                  <option>Heading 2</option> */}
                </div>
                {/* <div className="flex gap-1 ml-2">
                  <button className="px-2 py-1 hover:bg-gray-200 rounded font-bold text-gray-700">B</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded italic text-gray-700">I</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">S</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded underline text-gray-700">U</button>
                </div>
                <div className="flex gap-1 ml-2">
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">≡</button>
                </div> */}
              </div>

              {/* Textarea */}
              <textarea
                placeholder="Type expense description"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full px-4 py-3 border border-t-0 border-gray-300 rounded-b focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent resize-none"
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-1">
                Max Allowed Characters {characterCount}/{maxCharacters}
              </p>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select payment mode</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="card">Card</option>
                    {/* <option value="phonepay">Phone Pay</option> */}
                    <option value="cheque">Cheque</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Upload Images Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Images</h2>
            
            <div className="border-2 border-dashed border-[#4A70A9] rounded-lg p-12 text-center bg-blue-50/30">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#4A70A9] rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-[#4A70A9] font-medium mb-2">
                    Take A Photo With Your Camera Or Choose A File From Your Device
                  </p>
                  <p className="text-sm text-gray-500">
                    JPEG, PNG, BMP, WEBP, AND PDF FILES
                  </p>
                </div>
              </label>
            </div>
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
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

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-green-50 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-600" size={20} />}
            {toast.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
            <span className={`flex-1 text-sm font-medium ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`hover:opacity-70 ${
                toast.type === 'success' ? 'text-green-600' :
                toast.type === 'error' ? 'text-red-600' :
                'text-yellow-600'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}