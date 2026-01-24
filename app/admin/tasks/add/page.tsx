'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Bold, Italic, Underline, AlignLeft, AlignCenter, MoreVertical, Undo, Redo, Upload, ChevronLeft, ChevronRight, Calendar, CheckCircle, AlertCircle, DivideCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
  email_id: string;
  customer_type: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  companyId: number;
  company: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function AddNewTaskPage() {
  const router = useRouter();
  // Initialize with current date and time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(now);
  const [selectedHour, setSelectedHour] = useState(
    (currentHour % 12 || 12).toString().padStart(2, '0')
  );
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinute.toString().padStart(2, '0')
  );
  const [selectedPeriod, setSelectedPeriod] = useState(currentHour >= 12 ? 'PM' : 'AM');
  const [taskStatus, setTaskStatus] = useState('Not Started Yet');
  const [priority, setPriority] = useState('Medium');
  const [customer, setCustomer] = useState('');
  const [sendAlert, setSendAlert] = useState({
    mail: false,
    sms: false,
    inApp: false,
    whatsApp: false
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(1);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toast: Toast = { id: nextToastId, message, type };
    setToasts(prev => [...prev, toast]);
    setNextToastId(prev => prev + 1);
    setTimeout(() => removeToast(toast.id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Set initial due date on component mount
  useEffect(() => {
    const formattedDate = `${formatDate(now)} ${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    setDueDate(formattedDate);
    
    // Fetch current user and company info
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(error => console.error('Error fetching current user:', error));
    
    // Fetch users
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
    
    // Fetch customers
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.customers) {
          setCustomers(data.customers);
        }
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleSubmit = async () => {
    if (!taskTitle || !assignee) {
      showToast('Please fill in required fields: Task Title and Assignee', 'warning');
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
      
      // Create task with file URLs
      const taskData = {
        taskTitle,
        taskDescription,
        assignee,
        dueDate,
        taskStatus,
        priority,
        customer,
        attachments: uploadedFileUrls,
        sendAlert,
        companyId: currentUser?.companyId,
        createdBy: currentUser?.id
      };
      
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`Task created successfully! Task ID: ${result.task.task_id}`, 'success');
        setTimeout(() => window.location.href = '/admin/tasks', 2000);
      } else {
        showToast(result.error || 'Failed to create task', 'error');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('An error occurred while creating the task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleConfirmDate = () => {
    const formattedDate = `${formatDate(selectedDate)} ${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    setDueDate(formattedDate);
    setShowDatePicker(false);
  };

  const handleTodayClick = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    setSelectedDate(today);
    setSelectedHour((currentHour % 12 || 12).toString().padStart(2, '0'));
    setSelectedMinute(currentMinute.toString().padStart(2, '0'));
    setSelectedPeriod(currentHour >= 12 ? 'PM' : 'AM');
  };

  const handleOpenDatePicker = () => {
    // When opening, set to current real-time date and time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    setSelectedDate(now);
    setSelectedHour((currentHour % 12 || 12).toString().padStart(2, '0'));
    setSelectedMinute(currentMinute.toString().padStart(2, '0'));
    setSelectedPeriod(currentHour >= 12 ? 'PM' : 'AM');
    setShowDatePicker(true);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const days = [];
    const prevMonthDays = getDaysInMonth(year, month - 1);

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          type="button"
          className="p-1.5 text-gray-400 text-xs hover:bg-gray-100 rounded"
          onClick={() => {
            changeMonth(-1);
            handleDateSelect(prevMonthDays - i);
          }}
        >
          {prevMonthDays - i}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day;
      const isToday = isCurrentMonth && today.getDate() === day;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`p-1.5 text-xs rounded transition-colors ${
            isSelected
              ? 'bg-[#4A70A9] text-white'
              : isToday
              ? 'border-2 border-[#4A70A9] text-gray-900'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <button
          key={`next-${day}`}
          type="button"
          className="p-1.5 text-gray-400 text-xs hover:bg-gray-100 rounded"
          onClick={() => {
            changeMonth(1);
            handleDateSelect(day);
          }}
        >
          {day}
        </button>
      );
    }

    return days;
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

      <div className="mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Add New Task</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/tasks')}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Type task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <div className="border border-gray-300 rounded-md">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                {/* <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <Undo size={18} className="text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <Redo size={18} className="text-gray-600" />
                </button> */}
                {/* <div className="h-6 w-px bg-gray-300 mx-1"></div> */}
                <div className="px-2 py-1 text-sm border-0 bg-transparent text-gray-700 focus:ring-0 outline-none">
                  <option>Normal text</option>
                  {/* <option>Heading 1</option>
                  <option>Heading 2</option> */}
                </div>
                {/* <div className="h-6 w-px bg-gray-300 mx-1"></div> */}
                {/* <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <Bold size={18} className="text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <Italic size={18} className="text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <span className="text-gray-600 font-semibold text-lg">S</span>
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <Underline size={18} className="text-gray-600" />
                </button>
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <AlignLeft size={18} className="text-gray-600" />
                </button>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <AlignCenter size={18} className="text-gray-600" />
                </button>
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                  <MoreVertical size={18} className="text-gray-600" />
                </button> */}
              </div>
              {/* Text Area */}
              <textarea
                placeholder="Type task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 resize-none border-0 focus:ring-0 outline-none text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
          </div>

          {/* Assignee and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee <span className="text-red-500">*</span>
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select assignee</option>
                {Array.isArray(users) && users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dueDate}
                  onClick={handleOpenDatePicker}
                  readOnly
                  placeholder="Select due date"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none transition-all cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-3 w-[280px]">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft size={16} className="text-gray-600" />
                      </button>
                      <span className="font-medium text-gray-900 text-sm">
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight size={16} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-600 p-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1 mb-3">
                      {renderCalendar()}
                    </div>

                    {/* Time Picker */}
                    <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-gray-200">
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = (i + 1).toString().padStart(2, '0');
                          return <option key={hour} value={hour}>{hour}</option>;
                        })}
                      </select>
                      <span className="text-gray-600 text-xs">:</span>
                      <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none"
                      >
                        {Array.from({ length: 60 }, (_, i) => {
                          const minute = i.toString().padStart(2, '0');
                          return <option key={minute} value={minute}>{minute}</option>;
                        })}
                      </select>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleTodayClick}
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDate}
                        className="flex-1 px-3 py-1.5 text-xs bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(false)}
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Status <span className="text-red-500">*</span>
              </label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-all appearance-none bg-white"
              >
                <option value="Not Started Yet">Not Started Yet</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="urgent">Urgent</option>
                <option value="Medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer
            </label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none transition-all appearance-none bg-white"
            >
              <option value="">Select customer</option>
              {Array.isArray(customers) && customers.map(cust => (
                <option key={cust.id} value={cust.id}>
                  {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const validFiles = files.filter(file => {
                    const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'application/pdf'];
                    return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
                  });
                  setUploadedFiles(prev => [...prev, ...validFiles]);
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-[#4A70A9] text-white rounded-full p-4 mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="text-[#4A70A9] font-medium mb-1">
                    Take A Photo With Your Camera Or Choose A File From Your Device
                  </p>
                  <p className="text-gray-500 text-sm">
                    JPEG, PNG, BMP, WEBP, AND PDF FILES
                  </p>
                </div>
              </label>
            </div>
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Send Alert */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Send Alert
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendAlert.mail}
                  onChange={(e) => setSendAlert({...sendAlert, mail: e.target.checked})}
                  className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">Mail</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendAlert.sms}
                  onChange={(e) => setSendAlert({...sendAlert, sms: e.target.checked})}
                  className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">SMS</span>
              </label>
             
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendAlert.whatsApp}
                  onChange={(e) => setSendAlert({...sendAlert, whatsApp: e.target.checked})}
                  className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </label>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}