'use client';

import { useState } from 'react';
import { Building2, User, Mail, Phone, Globe, CreditCard, CheckCircle2 } from 'lucide-react';

export default function CompanyRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyOwnerName: '',
    email: '',
    phone: '',
    country: '',
    subscriptionPlan: 'free'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Phone validation - only allow digits and limit to 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      return;
    }
    
    // Country validation - only allow letters and spaces
    if (name === 'country') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: lettersOnly }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.companyName || !formData.companyOwnerName || !formData.email || !formData.phone || !formData.country) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (formData.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(formData.country)) {
      alert('Country name can only contain letters and spaces');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/company-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccess(true);
      } else {
        alert(result.error || 'Failed to register company');
      }
    } catch (error) {
      console.error('Error registering company:', error);
      alert('An error occurred while registering the company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Registration Successful!
            </h1>
            <p className="text-xl text-gray-700 mb-4 font-medium">
              Welcome aboard, <strong>{formData.companyName}</strong>
            </p>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              The details have been registered with Store Manager. Soon our team will contact you and help in onboarding.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <p className="text-sm text-gray-600 mb-2">Once verification is complete, a confirmation email will be sent to:</p>
              <p className="text-blue-600 font-semibold text-lg">{formData.email}</p>
            </div>
            <button
              onClick={handleBackToHome}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - SVG Illustration */}
          <div className="hidden lg:flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              {/* Replace the src URL below with your own SVG image */}
              <img 
                src="/images/logt.svg"
                alt="Company Registration Illustration"
                className="w-full h-auto drop-shadow-2xl"
              />
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Join Thousands of Companies
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Start your journey with our platform and unlock powerful tools for your business growth.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Get Started Now
                </div>
              </div>
              {/* <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Company Registration
              </h1> */}
              <p className="text-gray-600 text-lg">Create your business account in minutes</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Company Name */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Owner Name */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="companyOwnerName"
                      value={formData.companyOwnerName}
                      onChange={handleInputChange}
                      placeholder="Enter owner's full name"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="company@example.com"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Country - Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter your country"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 bg-gray-50 focus:bg-white text-gray-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Plan */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subscription Plan
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                    <select
                      name="subscriptionPlan"
                      value={formData.subscriptionPlan}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300 appearance-none bg-gray-50 focus:bg-white text-gray-900 font-medium cursor-pointer"
                    >
                      <option value="free">Free Plan - $0/month</option>
                      <option value="basic">Basic Plan - $29/month</option>
                      <option value="pro">Pro Plan - $79/month</option>
                      <option value="enterprise">Enterprise Plan - $199/month</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Your Account...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      {/* <Building2 className="w-5 h-5 mr-2" /> */}
                      Create Company Account
                    </span>
                  )}
                </button>

                {/* Terms */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  By registering, you agree to our{' '}
                  <a href="/extra/terms/" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/extra/privacy" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}