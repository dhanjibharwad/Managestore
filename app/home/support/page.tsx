"use client"
import React, { useState, useEffect } from 'react';

const AppFeaturesPage: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const leftFeatures = [
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Multi-Tenant Architecture',
      description: 'Company-isolated model where each business operates in its own secure space with subdomain access. Complete data separation ensures privacy and security.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Role-Based Access',
      description: 'Flexible user management with admin, technician, and customer roles. Super-admin panel for managing all companies from a central dashboard.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Self Check-In',
      description: 'Allow customers to submit service requests directly from panel by logging in. Streamlined self-service flows improve customer experience and reduce workload.'
    }
  ];

  const rightFeatures = [
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Complete Job Management',
      description: 'Track service lifecycle from creation to completion. Manage customers, devices, assign technicians, and monitor job status in real-time.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Modular & Scalable',
      description: 'Use only what you need with modules for Dashboard, Jobs, Customers, Inventory, Billing, AMC, Reports, and Tasks. Extensible architecture grows with your business.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-Time Analytics',
      description: 'Monitor operations with comprehensive dashboards. Track payments, technician workload, customer history, and generate detailed reports of all filtered by company.'
    }
  ];

  const cardContent = [
    {
      title: 'Jobs',
      temp: '247',
      subtitle: 'Active Services',
      gradient: 'from-sky-400 to-sky-300',
      dotColor: 'bg-sky-400'
    },
    {
      title: 'Efficiency',
      temp: '98%',
      subtitle: 'Uptime',
      gradient: 'from-blue-500 to-blue-400',
      dotColor: 'bg-blue-400'
    },
    {
      title: 'Platform',
      temp: '',
      subtitle: 'Store Manager',
      description: 'Service Management',
      gradient: 'from-purple-200 to-purple-100',
      dotColor: 'bg-purple-300',
      isProfile: true
    }
  ];

  return (
    <div className="mt-16 sm:mt-20 py-8 sm:py-16 lg:py-26 px-4 mb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-center">
          {/* Left Features */}
          <div className="space-y-8 sm:space-y-12 order-2 lg:order-1">
            {leftFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 sm:gap-6 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-10 h-10 sm:w-12 sm:h-12">
                    {React.cloneElement(feature.icon, { className: "w-full h-full text-blue-500" })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Phone Mockup */}
          <div className="flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-64 h-[480px] sm:w-72 sm:h-[540px] lg:w-80 lg:h-[600px] bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-2 sm:p-3 border-4 sm:border-6 border-blue-500">
                <div className="w-full h-full bg-[#E2EBF6] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative">
                  {/* Logo */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-500">Store Manager</div>
                    <div className="text-xs text-gray-500 mt-1">sign in | sign up</div>
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cardContent.map((card, index) => (
                      <div
                        key={index}
                        className={`absolute w-32 h-44 sm:w-36 sm:h-52 lg:w-40 lg:h-56 bg-gradient-to-br ${card.gradient} rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-5 lg:p-6 transition-all duration-700 ${
                          activeCard === index 
                            ? 'translate-x-0 translate-y-0 rotate-0 z-30 scale-110' 
                            : activeCard === (index - 1 + 3) % 3
                            ? 'translate-x-[-60px] sm:translate-x-[-80px] lg:translate-x-[-100px] translate-y-[-30px] sm:translate-y-[-40px] lg:translate-y-[-50px] rotate-[-15deg] z-10 scale-90 opacity-70'
                            : 'translate-x-[60px] sm:translate-x-[80px] lg:translate-x-[100px] translate-y-[-30px] sm:translate-y-[-40px] lg:translate-y-[-50px] rotate-[15deg] z-20 scale-95 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className={`${card.isProfile ? 'text-gray-700' : 'text-white'} text-xs sm:text-sm font-medium`}>
                            {card.title}
                          </span>
                          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center">
                            <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 ${card.dotColor} rounded-full`}></div>
                          </div>
                        </div>
                        
                        {card.isProfile ? (
                          <>
                            <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24 mb-2 sm:mb-3">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-sky-400 to-sky-300 rounded-full flex items-center justify-center">
                                <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="text-gray-700 text-xs sm:text-sm font-semibold text-center">{card.subtitle}</div>
                            <div className="text-gray-600 text-xs text-center mt-1">{card.description}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">{card.temp}</div>
                            <div className="text-white text-xs opacity-90">{card.subtitle}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Wave */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 300 150" className="w-full">
                      <path
                        d="M0,50 Q75,20 150,50 T300,50 L300,150 L0,150 Z"
                        fill="#4A70A9"
                        className="transition-all duration-1000"
                      />
                    </svg>
                  </div>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-24 sm:bottom-28 lg:bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setActiveCard(i)}
                        className={`rounded-full transition-all ${
                          activeCard === i ? 'bg-blue-500 w-5 h-2 sm:w-6 sm:h-2' : 'bg-gray-400 w-2 h-2'
                        }`}
                        aria-label={`View card ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-8 sm:space-y-12 order-3">
            {rightFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 sm:gap-6 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-10 h-10 sm:w-12 sm:h-12">
                    {React.cloneElement(feature.icon, { className: "w-full h-full text-blue-500" })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFeaturesPage;