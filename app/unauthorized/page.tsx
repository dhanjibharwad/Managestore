"use client";

import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Shield className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your administrator.
          </p>
        </div>
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
