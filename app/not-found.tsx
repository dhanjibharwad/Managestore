/* eslint-disable */

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="container mx-auto px-4 py-8">
        {/* Centered Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          {/* <div className="mb-8 flex items-center justify-center">
            <Image
              src="/images/un-lg1.png"
              alt="Union Enterprise Logo"
              width={160}
              height={90}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div> */}

          {/* SVG Illustration */}
          <div className="mb-8 flex justify-center">
            <svg
              viewBox="0 0 600 400"
              className="w-full max-w-lg h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle cx="300" cy="200" r="180" fill="#f9fafb" opacity="0.8" />
              
              {/* Lost Person */}
              <g transform="translate(250, 180)">
                {/* Head */}
                <circle cx="0" cy="0" r="20" fill="#4A70A9" />
                {/* Body */}
                <rect x="-12" y="15" width="24" height="40" rx="12" fill="#4A70A9" />
                {/* Arms - confused gesture */}
                <path d="M -12 25 Q -25 20 -30 15" stroke="#4A70A9" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 12 25 Q 25 20 30 15" stroke="#4A70A9" strokeWidth="8" strokeLinecap="round" fill="none" />
                {/* Legs */}
                <path d="M -8 55 L -8 75" stroke="#4A70A9" strokeWidth="8" strokeLinecap="round" />
                <path d="M 8 55 L 8 75" stroke="#4A70A9" strokeWidth="8" strokeLinecap="round" />
                {/* Question mark above head */}
                <text x="25" y="-15" fontSize="30" fill="#6b7280" fontWeight="bold">?</text>
              </g>

              {/* Signpost */}
              <g transform="translate(380, 200)">
                {/* Post */}
                <rect x="-5" y="0" width="10" height="120" fill="#9ca3af" />
                {/* Sign 1 - pointing left */}
                <path d="M -5 20 L -80 20 L -85 30 L -80 40 L -5 40 Z" fill="#6b7280" />
                <text x="-50" y="34" fontSize="12" fill="white" fontWeight="600" textAnchor="middle">HOME</text>
                {/* Sign 2 - pointing right */}
                <path d="M 5 60 L 80 60 L 85 70 L 80 80 L 5 80 Z" fill="#4A70A9" />
                <text x="45" y="74" fontSize="12" fill="white" fontWeight="600" textAnchor="middle">404</text>
              </g>

              {/* Floating elements decoration */}
              <g opacity="0.4">
                <circle cx="100" cy="80" r="4" fill="#9ca3af" />
                <circle cx="480" cy="120" r="5" fill="#6b7280" />
                <circle cx="150" cy="320" r="3" fill="#9ca3af" />
                <circle cx="520" cy="280" r="4" fill="#6b7280" />
              </g>

              {/* Ground */}
              <ellipse cx="300" cy="320" rx="200" ry="20" fill="#d1d5db" opacity="0.3" />

              {/* 404 Text integrated into scene */}
              <text x="80" y="120" fontSize="48" fill="#9ca3af" fontWeight="bold" opacity="0.2">4</text>
              <text x="500" y="350" fontSize="48" fill="#9ca3af" fontWeight="bold" opacity="0.2">4</text>
            </svg>
          </div>

          {/* 404 Error Section */}
          <div className="mb-12">
            <h1 className="text-7xl md:text-8xl font-bold bg-[#4A70A9] bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              The page you're looking for isn't available right now, but{' '}
              <strong className="text-gray-900">Store Manager</strong> is here to guide you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/home/"
                className="inline-flex items-center bg-[#4A70A9] text-white px-8 py-3 rounded-full hover:from-gray-900 hover:to-gray-950 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Back Home
              </Link>

              <Link
                href="/user/contact"
                className="inline-flex items-center bg-white text-gray-900 border-2 border-gray-900 px-8 py-3 rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/user/about" className="text-sm text-gray-700 hover:text-gray-900 hover:underline">
                About Us
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/user/services" className="text-sm text-gray-700 hover:text-gray-900 hover:underline">
                Services
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/user/contact" className="text-sm text-gray-700 hover:text-gray-900 hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}