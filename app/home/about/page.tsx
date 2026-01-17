/* eslint-disable */

"use client";

import { useState, useEffect } from 'react';
import { FaUsers, FaTools, FaHeadset, FaHome, FaLaptop, FaWrench } from 'react-icons/fa';
import Link from 'next/link';


export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    '/images/service1.jpg',
    '/images/service2.jpg',
    '/images/service3.jpg',
    '/images/service4.jpg',
    '/images/service5.jpg',
    '/images/service6.jpg',
    '/images/service7.jpg',
    // '/images/service8.jpg',
    // Add more images here: '/images/service7.jpg',
  ];

  const extendedImages = [...images, ...images]; // Duplicate for infinite scroll

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= images.length - 1) {
          setTimeout(() => setCurrentSlide(0), 500); // Reset after transition
          return prev + 1;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}

      <section className="relative text-white">
        {/* Decorative shapes */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-22 h-22 bg-gray-400 opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-26 h-26 bg-gray-400 opacity-20 rounded-full animate-pulse"></div>
        </div> */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-100">
            About Us
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in delay-200 max-w-4xl mx-auto">
            A comprehensive multi-tenant service management platform designed for repair shops and service businesses to streamline operations and maximize efficiency.
          </p>

          {/* Call-to-action buttons */}
          {/* <div className="flex justify-center gap-4 mt-4 animate-fade-in delay-400">
            <a
              href="/user/herosec"
              className="px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold shadow-lg hover:bg-gray-100 transition"
            >
              Our Services
            </a>
            <Link href="/user/contact">
              <button className="border-2 border-white text-black px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:text-gray-800 transition cursor-pointer">
                Contact Us
              </button>
            </Link>
          </div> */}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Our Story</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Store Manager was born from a simple observation: repair shops and service centers were struggling with fragmented systems, manual processes, and data security concerns. We set out to create a unified platform that would transform service management.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Built on a multi-tenant architecture, Store Manager ensures complete data isolation for each business while providing powerful tools for job tracking, customer management, technician coordination, and real-time analytics. Every company operates in its own secure subdomain.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                From guest check-ins to final invoicing, from inventory management to AMC tracking, our modular platform scales with your business. We're committed to reducing administrative overhead so you can focus on what matters most—delivering exceptional service.
              </p>
            </div>
            <div className="order-1 lg:order-2 bg-white p-4 sm:p-8">
              <img src="/images/teche.jpg" alt="Our Story" className="w-full h-48 sm:h-64 lg:h-auto object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center mb-8 sm:mb-12 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">How We Serve You</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="bg-gray-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <FaLaptop className="text-2xl sm:text-3xl text-gray-800 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Job Management</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Complete job lifecycle tracking from creation to completion. Assign technicians, update status in real-time, and monitor progress with comprehensive dashboards.
              </p>
      
            </div>
            <div className="group bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="bg-gray-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <FaHome className="text-2xl sm:text-3xl text-gray-800 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Multi-Tenant Security</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Company-isolated architecture with subdomain access. Each business operates in its own secure environment with complete data separation and role-based access control.
              </p>
            
            </div>
            <div className="group bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="bg-gray-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <FaWrench className="text-2xl sm:text-3xl text-gray-800 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Modular Platform</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Use only what you need: Dashboard, Jobs, Customers, Inventory, Billing, AMC, Reports, and Tasks. Scalable modules that grow with your business requirements.
              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Our Work in Action</h2>
          <div className="relative overflow-hidden rounded-lg">
            <div
              className={`flex ${currentSlide >= images.length ? 'transition-none' : 'transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]'}`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {extendedImages.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <img
                    src={image}
                    alt={`Service ${(index % images.length) + 1}`}
                    className="w-full h-48 sm:h-64 lg:h-96 object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${currentSlide % images.length === index ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center mb-8 sm:mb-12 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <FaUsers className="text-4xl sm:text-5xl text-gray-800 mx-auto mb-4" />
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Efficiency First</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Every feature is designed to reduce administrative burden and streamline operations, helping you serve more customers with less effort.
              </p>
            </div>
            <div className="text-center">
              <FaTools className="text-4xl sm:text-5xl text-gray-800 mx-auto mb-4" />
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Data Security</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Multi-tenant architecture with strict company isolation ensures your business data remains private, secure, and accessible only to authorized users.
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <FaHeadset className="text-4xl sm:text-5xl text-gray-800 mx-auto mb-4" />
              <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Continuous Innovation</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Regular updates and new features based on real-world feedback from repair shops and service centers ensure the platform evolves with your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center mb-8 sm:mb-12 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Meet Our Team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="text-center">
                <img
                  src={`/images/team-${member}.png`}
                  alt={`Team Member ${member}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover"
                />
                <h3 className="mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">Team Member {member}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Technical Specialist</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700 dark:text-gray-100">
            Ready to Get Started?
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Join hundreds of repair shops and service centers who trust Store Manager
            to streamline their operations and grow their business.
          </p>

          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition cursor-pointer">
              Submit a Query
            </button>
            <Link href="/user/contact">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:text-gray-800 transition cursor-pointer">
                Contact Us
              </button>
            </Link>
          </div> */}
        </div>
      </section>

    </div>
  );
}