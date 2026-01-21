"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { X, Calendar, ChevronDown, Info, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Customer {
  id: number;
  customer_id: string;
  customer_name: string;
  mobile_number: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface DeviceType {
  id: number;
  name: string;
}

export default function PickupDropPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [serviceType, setServiceType] = useState<"pickup" | "drop">("pickup");
  const [customerSearch, setCustomerSearch] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [deviceType, setDeviceType] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(
    (new Date().getHours() % 12 || 12).toString().padStart(2, '0')
  );
  const [selectedMinute, setSelectedMinute] = useState(
    new Date().getMinutes().toString().padStart(2, '0')
  );
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM');
  const calendarRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.customers) setCustomers(data.customers);
      })
      .catch(err => console.error('Error fetching customers:', err));

    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error('Error fetching users:', err));

    fetch('/api/devices/types')
      .then(res => res.json())
      .then(data => setDeviceTypes(data))
      .catch(err => console.error('Error fetching device types:', err));
  }, []);

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
    setScheduleDate(formattedDate);
    setShowCalendar(false);
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
  const [address, setAddress] = useState("");
  const [savedResponse, setSavedResponse] = useState("");
  const [description, setDescription] = useState("");
  const [sendAlert, setSendAlert] = useState({
    mail: false,
    sms: false,
    inApp: false,
  });

  const handleSubmit = async () => {
    // Validate mobile number
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    // Validate required fields
    if (!customerSearch || !deviceType || !scheduleDate || !address) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/pickupdrop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType,
          customerSearch,
          mobile,
          deviceType,
          scheduleDate,
          assignee,
          address,
          savedResponse,
          description,
          sendAlert,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`${serviceType === 'pickup' ? 'Pickup' : 'Drop'} scheduled successfully! ID: ${result.pickupDrop.pickup_drop_id}`, 'success');
        setTimeout(() => router.push('/admin/pickupdrop'), 2000);
      } else {
        showToast(result.error || 'Failed to schedule pickup/drop', 'error');
      }
    } catch (error) {
      console.error('Error scheduling pickup/drop:', error);
      showToast('An error occurred while scheduling', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule A Pickup/Drop
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/admin/pickupdrop')}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8c] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Pickup/Drop Toggle */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                checked={serviceType === "pickup"}
                onChange={() => setServiceType("pickup")}
                className="w-5 h-5 text-[#4A70A9] focus:ring-[#4A70A9]"
              />
              <span className="text-gray-700 font-medium">Pickup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                checked={serviceType === "drop"}
                onChange={() => setServiceType("drop")}
                className="w-5 h-5 text-[#4A70A9] focus:ring-[#4A70A9]"
              />
              <span className="text-gray-700 font-medium">Drop</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {/* Customer and Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select customer</option>
                    {Array.isArray(customers) && customers.map(cust => (
                      <option key={cust.id} value={cust.id}>
                        {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-gray-700">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Eg: 99XXXXXXXX"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setMobile(value);
                        // Validate Indian mobile number
                        if (value.length === 10 && /^[6-9]\d{9}$/.test(value)) {
                          setMobileError('');
                        } else if (value.length > 0) {
                          setMobileError('Mobile number must be 10 digits starting with 6-9');
                        } else {
                          setMobileError('');
                        }
                      }
                    }}
                    className={`flex-1 px-4 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent ${
                      mobileError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {mobileError && (
                  <p className="text-red-500 text-sm mt-1">{mobileError}</p>
                )}
              </div>
            </div>

            {/* Device Type and Schedule On Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Device Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                  >
                    <option value="">Select device type</option>
                    {deviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Schedule On Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule On <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={calendarRef}>
                  <input
                    type="text"
                    placeholder="Select from calendar"
                    value={scheduleDate}
                    onClick={() => setShowCalendar(!showCalendar)}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent cursor-pointer"
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />

                  {/* Calendar Dropdown */}
                  {showCalendar && (
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
                          onClick={() => setShowCalendar(false)}
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

            {/* Assignee Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Assignee
                <Info size={16} className="text-gray-400" />
              </label>
              <div className="relative">
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent bg-white"
                >
                  <option value="">Select assignee</option>
                  {Array.isArray(users) && users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Type address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent resize-none"
              />
            </div>

            {/* Saved Responses */}
            <div className="mb-6">
              <div className="relative">
                <select
                  value={savedResponse}
                  onChange={(e) => setSavedResponse(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent text-gray-500"
                >
                  <option value="">Saved responses</option>
                  <option value="response1">Response 1</option>
                  <option value="response2">Response 2</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="border border-gray-300 rounded-md">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10H11a8 8 0 0 0-8 8v2m18-10l-6-6m6 6l-6 6" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm text-gray-600">Normal text</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <button className="text-gray-600 hover:text-gray-800 font-semibold">
                      B
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 italic">
                      I
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <span className="line-through">S</span>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Type text here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 focus:outline-none resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max Allowed Characters 50000
              </p>
            </div>

            {/* Send Alert */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send Alert
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendAlert.mail}
                    onChange={(e) =>
                      setSendAlert({ ...sendAlert, mail: e.target.checked })
                    }
                    className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                  />
                  <span className="text-sm text-gray-700">Mail</span>
                </label>
                {/* <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendAlert.sms}
                    onChange={(e) =>
                      setSendAlert({ ...sendAlert, sms: e.target.checked })
                    }
                    className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                  />
                  <span className="text-sm text-gray-700">SMS</span>
                </label> */}
                {/* <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendAlert.inApp}
                    onChange={(e) =>
                      setSendAlert({ ...sendAlert, inApp: e.target.checked })
                    }
                    className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                  />
                  <span className="text-sm text-gray-700">In App</span>
                </label> */}
              </div>
            </div>

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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <CheckCircle size={24} />
          <div>
            <div className="font-semibold">Success!</div>
            <div className="text-sm">{successMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}