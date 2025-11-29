"use client";
import React from "react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

const services: ServiceCardProps[] = [
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 2.5c0 .83-.67 1.5-1.5 1.5S12 7.33 12 6.5 12.67 5 13.5 5s1.5.67 1.5 1.5zM16.5 18H7.5v-.75c0-1 2-1.5 4.5-1.5s4.5.5 4.5 1.5V18z" />
      </svg>
    ),
    title: "Online Support",
    description: "24/7 customer chat & call support, Remote troubleshooting, Guidance for software or device setup, Account and billing.",
    category: "Interactive"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
    title: "Technical & On-site",
    description: "Home visits by verified technicians, Hardware installation and repairs, Software troubleshooting and Network setup.",
    category: "Popular"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
      </svg>
    ),
    title: "Electrician On-site Support",
    description: "Installation, repair, and maintenance support, Electrical, electronic, and networking help, Smart device setup and configuration.",
    category: "Structured"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
    title: "Digital Assistance",
    description: "Help with online applications, registrations, and payments, Document scanning, uploading, and verification.",
    category: "Advanced"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Consulting & Solutions",
    description: "Personalized problem-solving assistance, Small business support solutions, Expert consultation for technical issues.",
    category: "Challenge"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H3.5C2.67 2 2 2.67 2 3.5v15C2 19.33 2.67 20 3.5 20h17c.83 0 1.5-.67 1.5-1.5v-15C22 2.67 21.33 2 20.5 2z" />
      </svg>
    ),
    title: "Why Choose US",
    description: "Reliable and professional team, Verified technicians, Affordable and transparent pricing, Customer satisfaction guarantee.",
    category: "Foundation"
  }
];

const ServicesPage = () => {
  return (
    <section className="py-10 bg-zinc-800">
      <div className="text-center mb-12">
        {/* <h2 className="text-3xl font-bold text-gray-800">Our Services</h2> */}
        {/* <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          Comprehensive support solutions designed to meet all your technical and service needs with professional expertise.
        </p> */}
      </div>

      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden transform hover:-translate-y-2"
          >
            <div className="absolute top-4 right-4">
              <span className="bg-[#4A70A9] text-white text-xs px-3 py-1 rounded-full font-medium">
                {service.category}
              </span>
            </div>

            <div className="mb-4">
              <div className="bg-[#4A70A9] p-4 rounded-2xl text-white w-16 h-16 flex items-center justify-center">
                {service.icon}
              </div>
            </div>

            <h3 className="mt-2 mb-2 text-xl sm:text-xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
              {service.title}
            </h3>

            <p className="mt-4 mb-2 text-sm text-gray-700 leading-relaxed">
              {service.description}
            </p>

            <button className="bg-[#4A70A9] hover:bg-[#4A70A9] text-white font-semibold py-2 px-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer">
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;