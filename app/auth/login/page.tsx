// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Login failed');
//         return;
//       }

//       router.push('/');
//       router.refresh();
//     } catch {
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-zinc-800">Welcome Back</h1>
//           <p className="text-gray-600 mt-2">Sign in to your account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-zinc-700 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-zinc-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <Link
//               href="/auth/forgot-password"
//               className="text-sm text-[#4A70A9] hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#4A70A9] text-white py-3 rounded-lg font-medium hover:bg-[#3d5d8f] transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Don't have an account?{' '}
//           <Link href="/auth/register" className="text-[#4A70A9] font-medium hover:underline">
//             Sign up
//           </Link>
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCompanyId = searchParams.get('companyId');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    preSelectedCompanyId ? parseInt(preSelectedCompanyId) : null
  );

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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

  // Load saved company from localStorage
  useEffect(() => {
    const savedCompanyId = localStorage.getItem('lastCompanyId');
    if (savedCompanyId && !preSelectedCompanyId) {
      setSelectedCompanyId(parseInt(savedCompanyId));
    }
  }, [preSelectedCompanyId]);

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(companySearchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCompanyId) {
      setError('Please select a company');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyId: selectedCompanyId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'EMAIL_NOT_VERIFIED') {
          // Redirect to verification page
          router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}&companyId=${selectedCompanyId}`);
          return;
        }
        setError(data.error || 'Login failed');
        return;
      }

      // Save company ID if remember me is checked
      if (rememberMe) {
        localStorage.setItem('lastCompanyId', selectedCompanyId.toString());
      } else {
        localStorage.removeItem('lastCompanyId');
      }

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
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
              Company <span className="text-red-500">*</span>
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
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4A70A9] rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">
                          {selectedCompany.company_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-800">{selectedCompany.company_name}</p>
                        <p className="text-xs text-gray-600">{selectedCompany.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCompanyId(null)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Change company"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-[#4A70A9] focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition flex items-center justify-between"
                >
                  <span className="text-gray-500">Select your company...</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showCompanySearch && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="p-3 border-b bg-gray-50">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search companies..."
                          value={companySearchQuery}
                          onChange={(e) => setCompanySearchQuery(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none"
                          autoFocus
                        />
                        <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {filteredCompanies.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <p>No companies found</p>
                          <p className="text-xs mt-1">Try a different search term</p>
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
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition border-b last:border-b-0 flex items-center"
                          >
                            <div className="w-8 h-8 bg-[#4A70A9] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-[#4A70A9] font-semibold text-sm">
                                {company.company_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-zinc-800">{company.company_name}</p>
                              <p className="text-xs text-gray-600">{company.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
              Email Address
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

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
              />
              <span className="ml-2 text-sm text-gray-600">Remember company</span>
            </label>
            <Link href={`/auth/forgot-password${selectedCompanyId ? `?companyId=${selectedCompanyId}` : ''}`} className="text-sm text-[#4A70A9] hover:underline">
              Forgot password?
            </Link>
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-[#4A70A9] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}