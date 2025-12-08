/* eslint-disable */

'use client'

import React from 'react';
import {
  TrendingUp,
  RotateCcw,
  MessageSquare,
  Lightbulb,
  Award,
  Code,
  Users,
  Shield
} from 'lucide-react';

interface WorkFlowSectionProps {
  className?: string;
}

const WorkFlowSection: React.FC<WorkFlowSectionProps> = ({ className = '' }) => {
  const circularIcons = [
    { Icon: TrendingUp, angle: 0, delay: '0s', color: 'bg-sky-400 text-white' },
    { Icon: RotateCcw, angle: 45, delay: '0.5s', color: 'bg-sky-400 text-white' },
    { Icon: Code, angle: 90, delay: '1s', color: 'bg-sky-400 text-white' },
    { Icon: Shield, angle: 135, delay: '1.5s', color: 'bg-sky-400 text-white' },
    { Icon: Users, angle: 180, delay: '2s', color: 'bg-sky-400 text-white' },
    { Icon: Award, angle: 225, delay: '2.5s', color: 'bg-sky-400 text-white' },
    { Icon: MessageSquare, angle: 270, delay: '3s', color: 'bg-sky-400 text-white' },
    { Icon: Lightbulb, angle: 315, delay: '3.5s', color: 'bg-sky-400 text-white' },
  ];

  return (
    <section className={`py-2 sm:py-4 lg:py-4 px-2 sm:px-4 lg:px-4 bg-white relative overflow-hidden ${className}`}>

      {/* Background decoration for mobile */}
      <div className="absolute inset-0 bg-white rounded-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div>
              <p className="text-gray-900 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4">
                Features
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                Our Work Flow
              </h2>
              <p className="mt-4 text-gray-500 text-base leading-relaxed">
                At Store Manager, our workflow begins with understanding client needs and planning tailored solutions.
                We ensure smooth execution with quality checks at every stage. Finally, we provide ongoing support to build
                lasting relationships beyond service completion.
              </p>  
            </div>
            {/* CTA Button */}
            <button className="bg-blue-500 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none">
              LEARN MORE
            </button>
          </div>

          {/* Right Content - Circular Animation */}
          <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]">
            {/* Circular Container */}
            <div className="relative w-80 h-80 xl:w-96 xl:h-96 hidden lg:block">
              {/* Static Dotted Lines for each icon */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {circularIcons.map((_, index) => {
                    const angle = (index * 45) * (Math.PI / 180);
                    const innerRadius = 80;
                    const outerRadius = 160;

                    const x1 = 200 + Math.cos(angle) * innerRadius;
                    const y1 = 200 + Math.sin(angle) * innerRadius;
                    const x2 = 200 + Math.cos(angle) * outerRadius;
                    const y2 = 200 + Math.sin(angle) * outerRadius;

                    return (
                      <line
                        key={index} 
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#d1d5db"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Circular Icons */}
              {circularIcons.map(({ Icon, angle, delay, color }, index) => {
                const radius = 180; // Distance from center
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={index}
                    className="absolute w-16 h-16 animate-float"
                    style={{
                      left: `calc(50% + ${x}px - 32px)`,
                      top: `calc(50% + ${y}px - 32px)`,
                      animationDelay: delay,
                      animationDuration: '4s',
                      animationIterationCount: 'infinite'
                    }}
                  >
                    <div className={`w-full h-full rounded-full ${color} flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer border-2 border-white`}>
                      <Icon size={22} />
                    </div>
                  </div>
                );
              })}

              {/* Center Analysis Gathering Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center w-14 h-14 xl:w-16 xl:h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mb-4 xl:mb-6 mx-auto shadow-lg">
                  <Lightbulb className="text-white" size={24} />
                </div>

                <h3 className="text-xl xl:text-2xl font-bold text-gray-900 text-center mb-3 xl:mb-4">
                  Services
                </h3>

                <p className="text-gray-600 text-center leading-relaxed text-xs xl:text-sm max-w-[200px] xl:max-w-none">
                  Store Manager provides end-to-end digital solutions.
                </p>
              </div>
            </div>

            {/* Mobile Version */}
            <div className="lg:hidden w-full max-w-xs sm:max-w-sm mx-auto">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Mobile background icons */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-20">
                  <TrendingUp size={20} className="text-blue-500 sm:w-6 sm:h-6" />
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 opacity-20">
                  <Code size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                </div>

                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mb-4 sm:mb-6 mx-auto shadow-lg">
                  <Lightbulb className="text-white" size={20} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3 sm:mb-4">
                  Services
                </h3>

                <p className="text-gray-600 text-center leading-relaxed text-sm sm:text-base">
                  Store Manager provides end-to-end digital solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default WorkFlowSection;