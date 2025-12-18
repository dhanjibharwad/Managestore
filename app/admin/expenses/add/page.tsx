'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Upload, Undo2, Redo2, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ExpensePage() {
  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const calendarRef = useRef<HTMLDivElement>(null);

  const maxCharacters = 50000;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setDescription(text);
      setCharacterCount(text.length);
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateSelect = (date: Date) => {
    setExpenseDate(formatDate(date));
    setShowCalendar(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(currentYear, currentMonthNum, 0);
      const prevMonthDays = prevMonth.getDate();
      const day = prevMonthDays - startingDayOfWeek + i + 1;
      days.push(
        <button
          key={`prev-${i}`}
          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:bg-gray-100 rounded"
          onClick={() => {
            const date = new Date(currentYear, currentMonthNum - 1, day);
            handleDateSelect(date);
          }}
        >
          {day}
        </button>
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthNum, day);
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            isToday
              ? 'bg-[#4A70A9] text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    // Add empty cells for days after the last day of the month
    const totalCells = days.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <button
          key={`next-${i}`}
          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:bg-gray-100 rounded"
          onClick={() => {
            const date = new Date(currentYear, currentMonthNum + 1, i);
            handleDateSelect(date);
          }}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
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
      alert('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert('Amount must be greater than 0');
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
        // Store success message in localStorage for the next page
        const message = `Expense created successfully! Expense ID: ${result.expense.expense_id}`;
        localStorage.setItem('successMessage', message);
        
        // Redirect to listing page
        router.push('/admin/expenses');
      } else {
        alert(result.error || 'Failed to create expense');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('An error occurred while creating the expense');
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
            <button className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors font-medium">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select category</option>
                    <option value="travel">Travel</option>
                    <option value="meals">Meals</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="supplies">Supplies</option>
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
                <div className="relative" ref={calendarRef}>
                  <input
                    type="text"
                    placeholder="Select expense date"
                    value={expenseDate}
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent cursor-pointer"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  
                  {showCalendar && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={handlePrevMonth}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="font-semibold text-gray-800">
                          {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          onClick={handleNextMonth}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Calendar Days Header */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div
                            key={day}
                            className="w-10 h-8 flex items-center justify-center text-sm font-medium text-gray-600"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expense Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Description
              </label>
              
              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t bg-gray-50 px-3 py-2 flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                  <Undo2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                  <Redo2 className="w-4 h-4" />
                </button>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
                  <option>Normal text</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="flex gap-1 ml-2">
                  <button className="px-2 py-1 hover:bg-gray-200 rounded font-bold text-gray-700">B</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded italic text-gray-700">I</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">S</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded underline text-gray-700">U</button>
                </div>
                <div className="flex gap-1 ml-2">
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">≡</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">≡</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">≡</button>
                  <button className="px-2 py-1 hover:bg-gray-200 rounded text-gray-700">≡</button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                placeholder="Type expense description"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full px-4 py-3 border border-t-0 border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent resize-none"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select payment mode</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="card">Card</option>
                    <option value="phonepay">Phone Pay</option>
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
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
    </div>
  );
}