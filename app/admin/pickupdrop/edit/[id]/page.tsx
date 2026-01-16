'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronDown, Info, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

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

interface PickupDrop {
  id: number;
  service_type: string;
  customer_search: string;
  mobile: string;
  device_type: string;
  schedule_date: string;
  assignee_id: number;
  address: string;
  status: string;
}

export default function EditPickupDropPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [pickupDrop, setPickupDrop] = useState<PickupDrop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickupDropId, setPickupDropId] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [serviceType, setServiceType] = useState<'pickup' | 'drop'>('pickup');
  const [customerSearch, setCustomerSearch] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState((new Date().getHours() % 12 || 12).toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes().toString().padStart(2, '0'));
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
    const getParams = async () => {
      const resolvedParams = await params;
      setPickupDropId(resolvedParams.id);
      fetchPickupDrop(resolvedParams.id);
    };
    getParams();

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
  }, [params]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPickupDrop = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pickupdrop/${id}`);
      const data = await response.json();
      if (response.ok) {
        const pd = data.pickupDrop;
        setPickupDrop(pd);
        setServiceType(pd.service_type);
        setCustomerSearch(pd.customer_search);
        setMobile(pd.mobile);
        setDeviceType(pd.device_type);
        setScheduleDate(pd.schedule_date);
        setAssignee(pd.assignee_id?.toString() || '');
        setAddress(pd.address);
        setStatus(pd.status);
      }
    } catch (error) {
      console.error('Error fetching pickup/drop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    if (!customerSearch || !deviceType || !scheduleDate || !address) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/pickupdrop/${pickupDropId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          customer_search: customerSearch,
          mobile,
          device_type: deviceType,
          schedule_date: scheduleDate,
          assignee_id: assignee ? parseInt(assignee) : null,
          address,
          status
        })
      });

      if (response.ok) {
        localStorage.setItem('successMessage', 'Pickup/Drop updated successfully!');
        router.push('/admin/pickupdrop');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update pickup/drop', 'error');
      }
    } catch (error) {
      console.error('Error updating pickup/drop:', error);
      showToast('Failed to update pickup/drop', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
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
    setSelectedDate(today);
    setSelectedHour((today.getHours() % 12 || 12).toString().padStart(2, '0'));
    setSelectedMinute(today.getMinutes().toString().padStart(2, '0'));
    setSelectedPeriod(today.getHours() >= 12 ? 'PM' : 'AM');
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

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <button key={`prev-${i}`} type="button" className="p-1.5 text-gray-400 text-xs hover:bg-gray-100 rounded"
          onClick={() => { changeMonth(-1); handleDateSelect(prevMonthDays - i); }}>
          {prevMonthDays - i}
        </button>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day;
      const isToday = isCurrentMonth && today.getDate() === day;
      days.push(
        <button key={day} type="button" onClick={() => handleDateSelect(day)}
          className={`p-1.5 text-xs rounded transition-colors ${isSelected ? 'bg-[#4A70A9] text-white' : isToday ? 'border-2 border-[#4A70A9] text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
          {day}
        </button>
      );
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <button key={`next-${day}`} type="button" className="p-1.5 text-gray-400 text-xs hover:bg-gray-100 rounded"
          onClick={() => { changeMonth(1); handleDateSelect(day); }}>
          {day}
        </button>
      );
    }
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!pickupDrop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Pickup/Drop not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Pickup/Drop</h2>
          <div className="flex gap-3">
            <button onClick={() => router.push('/admin/pickupdrop')}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8c] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-8 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="serviceType" checked={serviceType === 'pickup'}
                onChange={() => setServiceType('pickup')} className="w-5 h-5 text-[#4A70A9] focus:ring-[#4A70A9]" />
              <span className="text-gray-700 font-medium">Pickup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="serviceType" checked={serviceType === 'drop'}
                onChange={() => setServiceType('drop')} className="w-5 h-5 text-[#4A70A9] focus:ring-[#4A70A9]" />
              <span className="text-gray-700 font-medium">Drop</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent appearance-none bg-white">
                    <option value="">Select customer</option>
                    {customers.map(cust => (
                      <option key={cust.id} value={cust.id}>
                        {cust.customer_name} - {cust.customer_id} ({cust.mobile_number})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-gray-700">+91</span>
                  </div>
                  <input type="tel" placeholder="Eg: 99XXXXXXXX" value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setMobile(value);
                        if (value.length === 10 && /^[6-9]\d{9}$/.test(value)) {
                          setMobileError('');
                        } else if (value.length > 0) {
                          setMobileError('Mobile number must be 10 digits starting with 6-9');
                        } else {
                          setMobileError('');
                        }
                      }
                    }}
                    className={`flex-1 px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${mobileError ? 'border-red-500' : 'border-gray-300'}`} />
                </div>
                {mobileError && <p className="text-red-500 text-sm mt-1">{mobileError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                    <option value="">Select device type</option>
                    {deviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule On <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={calendarRef}>
                  <input type="text" placeholder="Select from calendar" value={scheduleDate}
                    onClick={() => setShowCalendar(!showCalendar)} readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent cursor-pointer" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />

                  {showCalendar && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-3 w-[280px]">
                      <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronLeft size={16} className="text-gray-600" />
                        </button>
                        <span className="font-medium text-gray-900 text-sm">
                          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">
                          <ChevronRight size={16} className="text-gray-600" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-600 p-1">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-3">{renderCalendar()}</div>
                      <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-gray-200">
                        <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none">
                          {Array.from({ length: 12 }, (_, i) => {
                            const hour = (i + 1).toString().padStart(2, '0');
                            return <option key={hour} value={hour}>{hour}</option>;
                          })}
                        </select>
                        <span className="text-gray-600 text-xs">:</span>
                        <select value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none">
                          {Array.from({ length: 60 }, (_, i) => {
                            const minute = i.toString().padStart(2, '0');
                            return <option key={minute} value={minute}>{minute}</option>;
                          })}
                        </select>
                        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#4A70A9] focus:border-transparent outline-none">
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={handleTodayClick}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                          Today
                        </button>
                        <button type="button" onClick={handleConfirmDate}
                          className="flex-1 px-3 py-1.5 text-xs bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8f] transition-colors">
                          OK
                        </button>
                        <button type="button" onClick={() => setShowCalendar(false)}
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Assignee <Info size={16} className="text-gray-400" />
              </label>
              <div className="relative">
                <select value={assignee} onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                  <option value="">Select assignee</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent bg-white">
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea placeholder="Type address" value={address} onChange={(e) => setAddress(e.target.value)} rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent resize-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : toast.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            {toast.type === 'success' && <CheckCircle className="text-green-600" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-600" size={20} />}
            {toast.type === 'warning' && <AlertCircle className="text-yellow-600" size={20} />}
            <span className={`flex-1 text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : toast.type === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>
              {toast.message}
            </span>
            <button onClick={() => removeToast(toast.id)}
              className={`hover:opacity-70 ${toast.type === 'success' ? 'text-green-600' : toast.type === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
