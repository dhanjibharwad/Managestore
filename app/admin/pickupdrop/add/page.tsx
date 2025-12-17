"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { X, Calendar, ChevronDown, Info, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

export default function PickupDropPage() {
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hours, setHours] = useState("04");
  const [minutes, setMinutes] = useState("20");
  const [period, setPeriod] = useState("PM");
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleOk = () => {
    if (selectedDate) {
      const formattedDate = `${formatDate(selectedDate)} ${hours}:${minutes} ${period}`;
      setScheduleDate(formattedDate);
      setShowCalendar(false);
    }
  };

  const handleCancel = () => {
    setShowCalendar(false);
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long" });
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
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
      alert('Please fill in all required fields');
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
        // Store success message in localStorage for the next page
        const message = `${serviceType === 'pickup' ? 'Pickup' : 'Drop'} scheduled successfully! ID: ${result.pickupDrop.pickup_drop_id}`;
        localStorage.setItem('successMessage', message);
        
        // Redirect to listing page
        router.push('/admin/pickupdrop');
      } else {
        alert(result.error || 'Failed to schedule pickup/drop');
      }
    } catch (error) {
      console.error('Error scheduling pickup/drop:', error);
      alert('An error occurred while scheduling');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule A Pickup/Drop
          </h2>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Pickup/Drop Toggle */}
          <div className="flex items-center justify-center gap-8 mb-8">
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
                  <input
                    type="text"
                    placeholder="Search by name, mobile, e..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent"
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                    className={`flex-1 px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent ${
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-500"
                  >
                    <option value="">Select device type you want...</option>
                    <option value="mobile">Mobile</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent cursor-pointer"
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />

                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[400px]">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={handlePreviousMonth}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <span className="font-semibold text-gray-800">
                          {monthName} {year}
                        </span>
                        <button
                          onClick={handleNextMonth}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <ChevronRight size={20} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="mb-4">
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                              <div
                                key={day}
                                className="text-center text-xs font-medium text-gray-600 py-2"
                              >
                                {day}
                              </div>
                            )
                          )}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {/* Empty cells for days before month starts */}
                          {Array.from({ length: startingDayOfWeek }).map(
                            (_, index) => (
                              <div key={`empty-${index}`} className="py-2" />
                            )
                          )}
                          {/* Days of the month */}
                          {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            return (
                              <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                                  isToday(day)
                                    ? "bg-[#4A70A9] text-white hover:bg-[#3d5c8c]"
                                    : isSelected(day)
                                    ? "bg-blue-100 text-[#4A70A9] font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Picker */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="01"
                            max="12"
                            value={hours}
                            onChange={(e) => {
                              const val = e.target.value.padStart(2, "0");
                              if (
                                parseInt(val) >= 1 &&
                                parseInt(val) <= 12
                              ) {
                                setHours(val);
                              }
                            }}
                            className="w-16 px-2 py-1.5 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                          />
                          <div className="flex flex-col">
                            <button
                              onClick={() => {
                                const newHours = (parseInt(hours) % 12) + 1;
                                setHours(newHours.toString().padStart(2, "0"));
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => {
                                const newHours =
                                  parseInt(hours) - 1 || 12;
                                setHours(newHours.toString().padStart(2, "0"));
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        <span className="text-gray-600 font-semibold">:</span>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="00"
                            max="59"
                            value={minutes}
                            onChange={(e) => {
                              const val = e.target.value.padStart(2, "0");
                              if (
                                parseInt(val) >= 0 &&
                                parseInt(val) <= 59
                              ) {
                                setMinutes(val);
                              }
                            }}
                            className="w-16 px-2 py-1.5 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                          />
                          <div className="flex flex-col">
                            <button
                              onClick={() => {
                                const newMinutes = (parseInt(minutes) + 1) % 60;
                                setMinutes(newMinutes.toString().padStart(2, "0"));
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => {
                                const newMinutes =
                                  (parseInt(minutes) - 1 + 60) % 60;
                                setMinutes(newMinutes.toString().padStart(2, "0"));
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                          <ChevronDown
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                          />
                        </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleToday}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Today
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleOk}
                            className="px-4 py-2 text-sm bg-[#4A70A9] text-white rounded hover:bg-[#3d5c8c] transition-colors"
                          >
                            OK
                          </button>
                        </div>
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-500"
                >
                  <option value="">Select assignee name</option>
                  <option value="john">John Doe</option>
                  <option value="jane">Jane Smith</option>
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent resize-none"
              />
            </div>

            {/* Saved Responses */}
            <div className="mb-6">
              <div className="relative">
                <select
                  value={savedResponse}
                  onChange={(e) => setSavedResponse(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent text-gray-500"
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendAlert.sms}
                    onChange={(e) =>
                      setSendAlert({ ...sendAlert, sms: e.target.checked })
                    }
                    className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
                  />
                  <span className="text-sm text-gray-700">SMS</span>
                </label>
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

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5c8c] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
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