// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Building2, User, Mail, Phone, Globe, CreditCard } from 'lucide-react';

// export default function CompanyRegisterPage() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [formData, setFormData] = useState({
//     companyName: '',
//     companyOwnerName: '',
//     email: '',
//     phone: '',
//     country: '',
//     subscriptionPlan: 'free'
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.companyName || !formData.companyOwnerName || !formData.email || !formData.phone || !formData.country) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const response = await fetch('/api/auth/company-register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setShowSuccess(true);
//       } else {
//         alert(result.error || 'Failed to register company');
//       }
//     } catch (error) {
//       console.error('Error registering company:', error);
//       alert('An error occurred while registering the company');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (showSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
//         <div className="w-full max-w-lg">
//           <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8 text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h1 className="text-3xl font-bold text-green-800 mb-4">Thank You!</h1>
//             <p className="text-lg text-gray-700 mb-6">
//               Your company registration has been submitted successfully.
//             </p>
//             <p className="text-gray-600 mb-8">
//               Our team will contact you soon for onboarding and to help you get started with your new account.
//             </p>
//             <button
//               onClick={() => router.push('/')}
//               className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-lg">
//         {/* Header */}
//         <div className="text-center mb-8">
         
//           <h1 className="text-3xl font-bold text-zinc-900 mb-2">Company Registration</h1>
//           <p className="text-zinc-600">Create your business account to get started</p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Company Name */}
//             <div>
//               <label className="block text-sm font-semibold text-zinc-700 mb-2">
//                 Company Name <span className="text-blue-500">*</span>
//               </label>
//               <div className="relative">
//                 <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleInputChange}
//                   placeholder="Enter your company name"
//                   className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Owner Name */}
//             <div>
//               <label className="block text-sm font-semibold text-zinc-700 mb-2">
//                 Owner Name <span className="text-blue-500">*</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
//                 <input
//                   type="text"
//                   name="companyOwnerName"
//                   value={formData.companyOwnerName}
//                   onChange={handleInputChange}
//                   placeholder="Enter owner's full name"
//                   className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-semibold text-zinc-700 mb-2">
//                 Business Email <span className="text-blue-500">*</span>
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="company@example.com"
//                   className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-semibold text-zinc-700 mb-2">
//                 Phone Number <span className="text-blue-500">*</span>
//               </label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="+1 (555) 000-0000"
//                   className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Country */}
//             <div>
//               <label className="block text-sm font-semibold text-zinc-700 mb-2">
//                 Country <span className="text-blue-500">*</span>
//               </label>
//               <div className="relative">
//                 <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
//                 <input
//                   type="text"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   placeholder="United States"
//                   className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Subscription Plan */}
//             <div>
//               <label className="block text-sm font-semibold text-zinc-700 mb-2">
//                 Subscription Plan
//               </label>
//               <div className="relative">
//                 <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
//                 <select
//                   name="subscriptionPlan"
//                   value={formData.subscriptionPlan}
//                   onChange={handleInputChange}
//                   className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
//                 >
//                   <option value="free">Free Plan - $0/month</option>
//                   <option value="basic">Basic Plan - $29/month</option>
//                   <option value="pro">Pro Plan - $79/month</option>
//                   <option value="enterprise">Enterprise Plan - $199/month</option>
//                 </select>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Creating Account...
//                 </div>
//               ) : (
//                 'Create Company Account'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"
import React, { useState } from 'react';
import { Building2, User, Mail, Phone, Globe, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

// Define explicit types for API response structures
type SuccessResponse = { message: string };
type ErrorResponse = { error: string };
type ApiResponse = SuccessResponse | ErrorResponse;

// Define the shape of the Promise resolved by simulateApiCall
type SimulateCallResult = { 
  ok: boolean, 
  json: () => Promise<ApiResponse> 
};


// Mock function for navigation in this single-file environment (replaces Next.js useRouter)
const useMockRouter = () => {
  const push = (path: string) => {
    console.log('Navigating to:', path);
    // In a real application, this would be a proper router.push(path)
  };
  return { push };
};

// Custom Notification Component to replace window.alert() and display in-line feedback
interface NotificationProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  const isError = type === 'error';
  const color = isError ? 'red' : 'green';
  const Icon = isError ? AlertTriangle : CheckCircle;

  return (
    <div 
      className={`p-4 mb-4 rounded-xl border border-${color}-300 bg-${color}-50 text-${color}-800 shadow-md flex items-start space-x-3 transition-opacity duration-300`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 text-${color}-600 mt-0.5`} />
      <div className="flex-grow">
        <p className="font-medium">{isError ? 'Submission Error' : 'Success'}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className={`ml-auto -mt-1 -mr-2 p-1 rounded-full text-${color}-600 hover:bg-${color}-100 transition`}
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
};


// Main Application Component
export default function App() {
  const router = useMockRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyOwnerName: '',
    email: '',
    phone: '',
    country: '',
    subscriptionPlan: 'free'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setErrorMessage(''); // Clear errors on input change
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Dummy API call simulation to replace the external fetch
  const simulateApiCall = async (data: typeof formData): Promise<SimulateCallResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful registration if key fields are filled
        if (!data.email || !data.phone || !data.companyName) {
             resolve({
                ok: false,
                json: async () => ({ error: 'Simulated server validation failed: Missing crucial data.' }),
            });
        } else if (data.companyName.toLowerCase().includes('fail')) {
          // Simulate a specific server error
          resolve({
            ok: false,
            json: async () => ({ error: 'Company name is blacklisted or already in use.' }),
          });
        } else {
          // Success: Fix applied here. Now returns { message: string } which is allowed by SimulateCallResult
          resolve({
            ok: true,
            json: async () => ({ message: 'Registration successful' }), 
          });
        }
      }, 1500); // 1.5 second delay
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Reset previous errors

    // 1. Client-side Validation (more robust check)
    if (!formData.companyName || !formData.companyOwnerName || !formData.email || !formData.phone || !formData.country) {
      setErrorMessage('Please ensure all required fields (marked with *) are filled out.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use the simulated API call
      const response = await simulateApiCall(formData);
      // We must cast result to ApiResponse now that we defined it explicitly
      const result = await response.json() as ApiResponse;

      if (response.ok) {
        setShowSuccess(true);
      } else {
        // result is guaranteed to have 'error' if !response.ok
        setErrorMessage((result as ErrorResponse).error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering company:', error);
      // Use Notification component instead of alert()
      setErrorMessage('An unexpected error occurred. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success State UI ---
  if (showSuccess) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-8 sm:p-12 text-center transform hover:scale-[1.01] transition-transform duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-200">
              <CheckCircle className="w-10 h-10 text-green-600 stroke-2" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight">Registration Complete!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Welcome to the platform, **{formData.companyName}**!
            </p>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              We have successfully created your account. Our onboarding specialist will reach out to you at *{formData.email}* soon.
            </p>
            <button
              onClick={() => router.push('/dashboard')} // Mock navigation
              // Removed blue shadow from success button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Reusable Input Field Component ---
  const InputField = ({ name, label, icon: Icon, type = 'text', required = true, placeholder, children }: 
    { name: keyof typeof formData, label: string, icon: React.ElementType, type?: string, required?: boolean, placeholder?: string, children?: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-blue-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {children ? (
            <select
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white text-gray-700 shadow-sm hover:border-blue-400 cursor-pointer"
              required={required}
            >
              {children}
            </select>
        ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 shadow-sm"
              required={required}
            />
        )}
      </div>
    </div>
  );

  return (
    // Changed min-h-screen to h-screen and removed overflow-y-auto to prevent scrolling
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl">
        {/* Header - Reduced vertical margin */}
        <div className="text-center mb-4">
          {/* <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-2" /> */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Register Your Business</h1>
          <p className="text-gray-600 text-base">Quick setup for your professional account in minutes.</p>
        </div>

        {/* Form Card - Reduced vertical padding and adjusted spacing for compaction */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message Display */}
            {errorMessage && (
              <Notification 
                message={errorMessage} 
                type="error" 
                onClose={() => setErrorMessage('')} 
              />
            )}

            {/* General Info Section - Implemented grid for two columns on medium screens and above */}
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">Company Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField 
                        name="companyName" 
                        label="Company Name" 
                        icon={Building2} 
                        placeholder="e.g., Company"
                    />
                    <InputField 
                        name="companyOwnerName" 
                        label="Owner/Primary Contact Name" 
                        icon={User} 
                        placeholder="Name" 
                    />
                </div>
            </div>

            {/* Contact Info Section - Implemented grid for two columns on medium screens and above */}
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField 
                        name="email" 
                        label="Business Email" 
                        icon={Mail} 
                        type="email" 
                        placeholder="contact@company.com" 
                    />
                    <InputField 
                        name="phone" 
                        label="Phone Number" 
                        icon={Phone} 
                        type="tel" 
                        placeholder="+91 123 456 7890" 
                    />
                    {/* Country spans both columns for a cleaner single line in this section */}
                    <div className="md:col-span-2">
                        <InputField 
                            name="country" 
                            label="Country of Operation" 
                            icon={Globe} 
                            placeholder="e.g., India" 
                        />
                    </div>
                </div>
            </div>

            {/* Plan Selection Section - Reduced vertical margin */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3">Select Plan</h2>
                <InputField 
                    name="subscriptionPlan" 
                    label="Choose Your Plan" 
                    icon={CreditCard}
                >
                  <option value="free">Free Plan - $0/month (Basic features)</option>
                  <option value="basic">Basic Plan - $29/month (Standard)</option>
                  <option value="pro">Pro Plan - $79/month (Advanced features)</option>
                  <option value="enterprise">Enterprise Plan - $199/month (Dedicated Support)</option>
                </InputField>
            </div>


            {/* Submit Button - Removed blue-specific shadow class */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Registration...
                </div>
              ) : (
                'Create Company Account'
              )}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-2">
                By clicking "Create Company Account", you agree to our <a href="#" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}