"use client"
import React, { useState } from 'react';
import { Building2, Mail, User, Briefcase, Users, ChevronDown } from 'lucide-react';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    companySize: '',
    jobTitle: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Demo booked successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
      {/* Navigation */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <div className="space-y-10 pt-8">
            <div>
             
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-100">
                            See how our platform<br/><span className='text-blue-500 dark:text-blue-400'>grow your business</span>
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Register your store or company and let us handle the rest.
              </p>
            </div>

            {/* Results */}
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-600 mb-5">
                RESULTS STORE MANAGER DELIVERS:
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-4xl font-bold text-blue-600 mb-2">x1.5</div>
                  <div className="text-sm text-gray-600 leading-snug">
                    Increase in lead conversion rate
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
                  <div className="text-sm text-gray-600 leading-snug">
                    Increase in new customers
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600 leading-snug">
                    Dynamic Platform access
                  </div>
                </div>
              </div>
            </div>

            {/* Client Logos */}
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-600 mb-5">
                ALREADY HELPED BUSINESS PROFESSIONALS AT:
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-2xl font-bold text-blue-600"><img src=""/></div>
                <div className="flex items-center text-lg font-semibold text-gray-800">
                  <div className="w-6 h-6 bg-blue-600 rounded-full mr-1"></div>
                  Meta
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded">
                  TELUS
                </div>
                <div className="flex items-center text-lg font-semibold text-gray-700">
                  <div className="w-5 h-5 bg-blue-500 rounded-full mr-1"></div>
                  Spot
                </div>
                <div className="text-xl font-bold text-gray-700">xerox</div>
                <div className="flex items-center text-lg font-semibold">
                  <div className="w-5 h-5 bg-blue-600 rounded-full mr-1"></div>
                  <span className="text-blue-600">pepsi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-2xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-100">Book a demo</h3>
              <p className="mt-2 text-xs text-gray-500">*All fields are required</p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Work Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Work email"
                  value={formData.workEmail}
                  onChange={(e) => handleInputChange('workEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Company Name */}
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Company Size */}
              <div className="relative">
                <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 z-10" />
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-500"
                >
                  <option value="">Company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Job Title */}
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start space-x-2 text-xs text-gray-500 py-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="leading-relaxed">
                  We won't share your info with anyone. We won't be sending promotional emails. For details, see Privacy Policy.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
              >
                Book a demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs">Web Accessibility</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium">Muti-platform Access</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs">Secure Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}