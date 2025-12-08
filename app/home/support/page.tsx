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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      title: 'Awesome Support',
      description: 'Get 24/7 dedicated customer support from our expert team. We\'re always here to help you succeed with instant responses.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Financial Support',
      description: 'Access comprehensive financial tools and resources. Track expenses, manage budgets, and get intelligent insights to make better financial decisions.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      title: 'Social Sharing',
      description: 'Share your achievements and connect with friends seamlessly. Integrate with all major social platforms and expand your network effortlessly.'
    }
  ];

  const rightFeatures = [
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      title: 'SEO Optimized',
      description: 'Built with search engine optimization in mind. Boost your visibility with lightning-fast performance and best practices for maximum reach.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      title: 'Supreme Choice',
      description: 'Trusted by thousands of users worldwide. Experience premium quality, reliability, and features that set industry standards for excellence.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      title: 'Market Analysis',
      description: 'Get powerful analytics and real-time market insights. Make data-driven decisions with comprehensive reports and predictive intelligence.'
    }
  ];

  const cardContent = [
    {
      title: 'Weather',
      temp: '26°',
      subtitle: 'Partly Cloudy',
      gradient: 'from-sky-400 to-sky-300',
      dotColor: 'bg-sky-400'
    },
    {
      title: 'Fast Response',
      temp: '100%',
      subtitle: 'Optimization',
      gradient: 'from-blue-500 to-blue-400',
      dotColor: 'bg-blue-400'
    },
    {
      title: 'Profile',
      temp: '',
      subtitle: 'Our Store',
      description: 'One Platform',
      gradient: 'from-purple-200 to-purple-100',
      dotColor: 'bg-purple-300',
      isProfile: true
    }
  ];

  return (
    <div className="bg-white py-26 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Features */}
          <div className="space-y-12">
            {leftFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mt-2 text-xl sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-80 h-[600px] bg-white rounded-[3rem] shadow-2xl p-3 border-6 border-blue-500">
                <div className="w-full h-full bg-[#E2EBF6] rounded-[2.5rem] overflow-hidden relative">
                  {/* Logo */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="text-2xl font-bold text-blue-500">Store Manager</div>
                    <div className="text-xs text-gray-500 mt-1">sign in | sign up</div>
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cardContent.map((card, index) => (
                      <div
                        key={index}
                        className={`absolute w-40 h-56 bg-gradient-to-br ${card.gradient} rounded-3xl shadow-xl p-6 transition-all duration-700 ${
                          activeCard === index 
                            ? 'translate-x-0 translate-y-0 rotate-0 z-30 scale-110' 
                            : activeCard === (index - 1 + 3) % 3
                            ? 'translate-x-[-100px] translate-y-[-50px] rotate-[-15deg] z-10 scale-90 opacity-70'
                            : 'translate-x-[100px] translate-y-[-50px] rotate-[15deg] z-20 scale-95 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`${card.isProfile ? 'text-gray-700' : 'text-white'} text-sm font-medium`}>
                            {card.title}
                          </span>
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className={`w-4 h-4 ${card.dotColor} rounded-full`}></div>
                          </div>
                        </div>
                        
                        {card.isProfile ? (
                          <>
                            <div className="flex items-center justify-center h-24 mb-3">
                              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-300 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="text-gray-700 text-sm font-semibold text-center">{card.subtitle}</div>
                            <div className="text-gray-600 text-xs text-center mt-1">{card.description}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-white text-5xl font-bold mb-2">{card.temp}</div>
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
                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setActiveCard(i)}
                        className={`rounded-full transition-all ${
                          activeCard === i ? 'bg-blue-500 w-6 h-2' : 'bg-gray-400 w-2 h-2'
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
          <div className="space-y-12">
            {rightFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mt-2 text-xl sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
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