// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
  

//   // Calculate password strength
//   const calculatePasswordStrength = (password: string) => {
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (password.length >= 12) strength++;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^a-zA-Z\d]/.test(password)) strength++;
//     return strength;
//   };

//   const handlePasswordChange = (password: string) => {
//     setFormData({ ...formData, password });
//     setPasswordStrength(calculatePasswordStrength(password));
//   };

//   const getPasswordStrengthColor = () => {
//     if (passwordStrength <= 1) return 'bg-red-500';
//     if (passwordStrength <= 3) return 'bg-yellow-500';
//     return 'bg-green-500';
//   };

//   const getPasswordStrengthText = () => {
//     if (passwordStrength <= 1) return 'Weak';
//     if (passwordStrength <= 3) return 'Medium';
//     return 'Strong';
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       setError('Name is required');
//       return false;
//     }

//     if (!formData.email.trim()) {
//       setError('Email is required');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }

//     if (formData.password.length < 8) {
//       setError('Password must be at least 8 characters long');
//       return false;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Registration failed');
//         return;
//       }

//       // Redirect to email verification page
//       router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           {/* <div className="w-16 h-16 bg-[#4A70A9] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               className="w-8 h-8 text-[#4A70A9]"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
//               />
//             </svg>
//           </div> */}
//           <h1 className="text-3xl font-bold text-zinc-800">Create Account</h1>
//           <p className="text-gray-600 mt-2">Join us Today</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
//               <svg
//                 className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Name Input */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
//               Full Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
//               placeholder="John Doe"
//             />
//           </div>

//           {/* Email Input */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
//               placeholder="you@example.com"
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               required
//               value={formData.password}
//               onChange={(e) => handlePasswordChange(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
//               placeholder="••••••••"
//             />
//             {/* Password Strength Indicator */}
//             {formData.password && (
//               <div className="mt-2">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs text-gray-600">Password strength:</span>
//                   <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
//                     {getPasswordStrengthText()}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor()}`}
//                     style={{ width: `${(passwordStrength / 5) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Confirm Password Input */}
//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">
//               Confirm Password
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               required
//               value={formData.confirmPassword}
//               onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
//               placeholder="••••••••"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#4A70A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d5d8f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Creating account...
//               </>
//             ) : (
//               'Create Account'
//             )}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Already have an account?</span>
//             </div>
//           </div>

//           <div className="mt-2 text-center">
//             <Link
//               href="/auth/login"
//               className="text-[#4A70A9] font-medium hover:underline"
//             >
//               Sign in instead
//             </Link>
//           </div>
//         </div>

//         {/* Terms */}
//         <p className="mt-4 text-xs text-center text-gray-500">
//           By creating an account, you agree to our{' '}
//           <a href="#" className="text-[#4A70A9] hover:underline">
//             Terms of Service
//           </a>{' '}
//           and{' '}
//           <a href="#" className="text-[#4A70A9] hover:underline">
//             Privacy Policy
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Company {
  id: number;
  company_name: string;
  email: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCompanyId = searchParams.get('companyId');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    preSelectedCompanyId ? parseInt(preSelectedCompanyId) : null
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  // Fetch available companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies/list-active');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.companies || []);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  const validateForm = () => {
    if (!selectedCompanyId) {
      setError('Please select a company');
      return false;
    }

    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          companyId: selectedCompanyId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Redirect to email verification with company context
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(formData.email)}&companyId=${selectedCompanyId}`
      );
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4A70A9] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#4A70A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join your company</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Company Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Select Company <span className="text-red-500">*</span>
            </label>
            
            {loadingCompanies ? (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-[#4A70A9] mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading companies...</span>
                </div>
              </div>
            ) : selectedCompany ? (
              <div className="relative">
                <div className="w-full px-4 py-3 border-2 border-[#4A70A9] bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-zinc-800">{selectedCompany.company_name}</p>
                      <p className="text-sm text-gray-600">{selectedCompany.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCompanyId(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCompanySearch(!showCompanySearch)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-[#4A70A9] focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
                >
                  <span className="text-gray-500">Choose your company...</span>
                </button>

                {showCompanySearch && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="p-3 border-b">
                      <input
                        type="text"
                        placeholder="Search companies..."
                        value={companySearchQuery}
                        onChange={(e) => setCompanySearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {filteredCompanies.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No companies found
                        </div>
                      ) : (
                        filteredCompanies.map((company) => (
                          <button
                            key={company.id}
                            type="button"
                            onClick={() => {
                              setSelectedCompanyId(company.id);
                              setShowCompanySearch(false);
                              setCompanySearchQuery('');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b last:border-b-0"
                          >
                            <p className="font-medium text-zinc-800">{company.company_name}</p>
                            <p className="text-sm text-gray-600">{company.email}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Don't see your company? Contact your administrator.
            </p>
          </div>

          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
              placeholder="+1234567890"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedCompanyId}
            className="w-full bg-[#4A70A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d5d8f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <Link href="/auth/login" className="text-[#4A70A9] font-medium hover:underline">
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-2 text-xs text-center text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-[#4A70A9] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#4A70A9] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}