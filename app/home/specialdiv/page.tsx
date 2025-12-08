'use client';

import React from 'react';

export default function ServiceManager() {

  return (
    <div className="bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mt-2 mb-4 text-4xl sm:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
            Managing services with ease, performance, and excellence
          </h1>
          <p className="text-xl text-gray-800">
            See how our service management helps you track repairs with these in-depth{' '}
            <span className="font-semibold" style={{ color: '#2196F3' }}>features</span>.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 scale-105">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-zinc-200">
            <div className="flex gap-3 mb-4">
              <div className="rounded-full p-3 shadow-md" style={{ backgroundColor: '#2196F3' }}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M2 7h20" stroke="white" strokeWidth="2"/>
                  <circle cx="6" cy="5" r="0.5" fill="white"/>
                  <circle cx="8" cy="5" r="0.5" fill="white"/>
                  <circle cx="10" cy="5" r="0.5" fill="white"/>
                  <rect x="8" y="19" width="8" height="2" rx="1" fill="white"/>
                  <path d="M12 17v2" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <h3 className="mt-2 mb-2 text-xl sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Laptop Repair</h3>
            <p className="text-gray-800 mb-8 leading-relaxed">
              Expert laptop repair services for all brands. Fast diagnostics and quality parts replacement.
            </p>
            <button className="text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:opacity-90" style={{ backgroundColor: '#2196F3' }}>
              See repair details
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-zinc-200">
            <div className="flex gap-3 mb-4">
              <div className="rounded-full p-3 shadow-md" style={{ backgroundColor: '#2196F3' }}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="2" width="12" height="20" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M6 5h12M6 19h12" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="20" r="0.8" fill="white"/>
                </svg>
              </div>
            </div>
            <h3 className="mt-2 mb-2 text-xl sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Mobile Repair</h3>
            <p className="text-gray-800 mb-8 leading-relaxed">
              Professional mobile repair with genuine parts. Screen replacement, battery issues, and more.
            </p>
            <button className="text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:opacity-90" style={{ backgroundColor: '#2196F3' }}>
              See repair details
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-zinc-200">
            <div className="flex gap-3 mb-4">
              <div className="rounded-full p-3 shadow-md" style={{ backgroundColor: '#2196F3' }}>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="20" height="13" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M2 6h20" stroke="white" strokeWidth="2"/>
                  <rect x="7" y="19" width="10" height="2" rx="1" fill="white"/>
                  <path d="M9 16v3M15 16v3" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <h3 className="mt-2 mb-2 text-xl sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Desktop Repair</h3>
            <p className="text-gray-800 mb-8 leading-relaxed">
              Complete desktop solutions including hardware upgrades, virus removal, & system optimization.
            </p>
            <button className="text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:opacity-90" style={{ backgroundColor: '#2196F3' }}>
              See repair details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}