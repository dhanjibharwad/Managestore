
"use client"
import React from 'react';

// Helper component for Trust Badges (to keep main component cleaner)
const Badge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors duration-200">
    <div className="w-5 h-5 text-blue-200">{icon}</div>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

// Using App as the main component name for single-file React convention
export default function App() {
  const handleBookDemo = () => {
    // This is the mock link handler
    console.log("Navigating to demo booking link...");
    // window.open('https://your-demo-link.com', '_blank');
  };

  const featureData = [
    {
      title: "Lightning Fast Setup",
      description: "Get your store up and running in minutes, not days. Our streamlined process makes it effortless.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      ),
    },
    {
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols keep your data and customer transactions safe and compliant.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
      ),
    },
    {
      title: "Real-Time Analytics",
      description: "Track performance, sales, and customer behavior with a powerful, customizable insights dashboard.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
      ),
    },
    {
      title: "Dedicated 24/7 Support",
      description: "Our expert support team is available around the clock to help you succeed and answer any question.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-life-buoy"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>
      ),
    },
  ];

  const statData = [
    { value: "x1.5", label: "Increase in lead conversion rate" },
    { value: "90%", label: "Average increase in new customers" },
    { value: "100%", label: "Dynamic Platform Access & API" },
  ];

  const clientLogos = [
    { name: "Meta", logoStyle: "font-bold text-gray-800" },
    { name: "TELUS", logoStyle: "bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded" },
    { name: "Spot", logoStyle: "font-semibold text-gray-700" },
    { name: "xerox", logoStyle: "text-xl font-bold text-gray-700" },
    { name: "pepsi", logoStyle: "text-xl font-bold text-blue-600" },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Navigation/Header Bar (Stays Fixed CTA) */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-end">
          <button
            onClick={handleBookDemo}
            // Added stronger hover effects (shadow/scale) and overflow-hidden for shine
            className="group relative px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300 font-semibold text-sm flex items-center space-x-2 overflow-hidden border border-blue-600"
          >
            {/* Shine Effect */}
            <span className="absolute top-0 left-0 w-full h-full block bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"></span>
            
            <span className="relative z-10">Book a Demo</span>
            <svg className="relative z-10 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {/* Darker background color transition */}
            <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Hero Section (Left Column) */}
          <div className="lg:col-span-6 space-y-12">
            
            {/* Headline and Subtext */}
            <div className='mt-8'>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
                See how our platform
                <br className='hidden sm:block'/>
                <span className='text-blue-600 drop-shadow-md inline-block mt-1 sm:mt-2'>grows your business.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                The unified solution for modern retail and service management. Register your store or company and let us handle the heavy lifting.
              </p>
              {/* Primary CTA (visible on small screens) */}
              <button
                onClick={handleBookDemo}
                // Added stronger hover effects (shadow/scale) and overflow-hidden for shine
                className="mt-8 md:hidden w-full sm:w-auto group relative px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300 font-bold text-base flex items-center justify-center space-x-2 overflow-hidden border border-blue-600"
              >
                {/* Shine Effect */}
                <span className="absolute top-0 left-0 w-full h-full block bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"></span>

                {/* Darker background color transition */}
                <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>

                 <span className="relative z-10">Book a Live Demo</span>
              </button>
            </div>

            {/* Results/Stats Section */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest font-bold text-blue-600">
                RESULTS STORE MANAGER DELIVERS:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-xl ring-1 ring-blue-100 hover:ring-2 hover:ring-blue-200 transition-all duration-300 transform hover:-translate-y-0.5 border-t-4 border-blue-500">
                    <div className="text-4xl font-extrabold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 leading-snug font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Logos */}
            <div className="space-y-4 pt-4">
              <p className="text-xs uppercase tracking-widest font-bold text-blue-600">
                ALREADY TRUSTED BY INDUSTRY LEADERS:
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {clientLogos.map((client, index) => (
                  <div key={index} className="relative transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-105 filter grayscale hover:grayscale-0">
                    <span className={client.logoStyle}>{client.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features & Trust Section (Right Column) */}
          <div className="lg:col-span-6 space-y-10 lg:pl-10 pt-10">
            
            {/* Key Features List */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Platform Highlights</h3>
              <div className="space-y-8">
                {featureData.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:bg-blue-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            {/* <div className="bg-gradient-to-tr from-blue-700 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Trusted by Thousands</h3>
                <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="font-bold text-lg">4.9/5 Rating</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Badge icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe-2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>} text="Web Accessible" />
                <Badge icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>} text="Secure Certified" />
                <Badge icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor-smartphone"><path d="M14 10V5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v4"/><path d="M20 7h-2.5a2 2 0 0 0-2 2v14h7V9a2 2 0 0 0-2-2Z"/></svg>} text="Multi-platform" />
                <Badge icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} text="24/7 Support" />
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}