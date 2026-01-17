'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// --- ICONS (Defined individually to prevent syntax errors) ---

const IconTicket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const IconZap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconLayers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconSmile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconTrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconMinus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Map icons to an object for easy access
const Icons = {
  Ticket: IconTicket,
  Users: IconUsers,
  Shield: IconShield,
  Bell: IconBell,
  Zap: IconZap,
  Layers: IconLayers,
  Smile: IconSmile,
  CheckCircle: IconCheckCircle,
  TrendingUp: IconTrendingUp,
  ChevronDown: IconChevronDown,
  Plus: IconPlus,
  Minus: IconMinus,
};

// --- DATA ---
const featureCards = [
  {
    title: "Real-time Ticket Updates",
    description: "Track every repair status instantly from pending to completed with live dashboard updates and activity logs.",
    icon: <Icons.Ticket />,
  },
  {
    title: "Technician Workflow",
    description: "Assign specific jobs to technicians, monitor performance, and track turnaround times effectively.",
    icon: <Icons.Users />,
  },
  {
    title: "Secure Data Handling",
    description: "Enterprise-grade encryption ensures your customer data and device patterns never fall into the wrong hands.",
    icon: <Icons.Shield />,
  },
  {
    title: "Automatic Notifications",
    description: "Send automated SMS and Email updates to customers whenever their device status changes.",
    icon: <Icons.Bell />,
  }
];

const faqs = [
  {
    question: "How do I create a new repair ticket?",
    answer: "Creating a ticket is simple. Navigate to the dashboard, click 'New Ticket', enter the customer details and device issues, and assign it to a technician instantly."
  },
  {
    question: "Can customers track their own repair status?",
    answer: "Yes! The system generates a unique tracking link for each ticket that you can share with customers via SMS or email."
  },
  {
    question: "Is my shop's data secure?",
    answer: "Absolutely. We use AES-256 encryption for all data at rest and TLS for data in transit. Your business data is isolated and backed up daily."
  },
  {
    question: "Can I customize the workflow steps?",
    answer: "Yes, you can define custom status tags (e.g., 'Waiting for Parts', 'Quality Check') to match your shop's specific operations."
  },
];

const valueProps = [
  { icon: <Icons.Zap />, text: "Faster Turnaround" },
  { icon: <Icons.Layers />, text: "Organized Workflow" },
  { icon: <Icons.Smile />, text: "Better Satisfaction" },
  { icon: <Icons.CheckCircle />, text: "Reduced Manual Work" },
  { icon: <Icons.TrendingUp />, text: "Scalable System" },
];

const logos = [
  "TechFix", "RepairHub", "iCare Pro", "GadgetGuard", "QuickFix", "MobileMedic", "CircuitWorks", "DeviceDoctor"
];

// --- MAIN PAGE COMPONENT ---
export default function RepairTicketManagement() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-10 md:pt-16 md:pb-16 overflow-hidden">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold tracking-wide">
            Streamline Your Shop
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Repair Ticket <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Eliminate the chaos of paper tickets. Track repairs, assign technicians, and keep customers updated with a single, powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Start Free Trial
            </button>
          </div>
        </div> */}
        
        {/* Abstract background blobs */}
        {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div> */}
      </section>

      {/* 2. ALTERNATING FEATURES SECTIONS */}
      <div className="space-y-24 py-16">
        
        {/* Section 1: Text Left, Image Right */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Effortless Ticket Creation & Tracking
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Create detailed repair tickets in seconds. Capture device details, issue descriptions, and customer information in a clean interface. Track the lifecycle of every repair from intake to invoice without missing a beat.
              </p>
              <ul className="space-y-3">
                {['One-click status updates', 'Printable barcode labels', 'History logs'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3"><Icons.Plus /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full pl-0 lg:pl-12">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {/* Placeholder for your Table Image */}
                <Image 
                  src="https://www.slideteam.net/media/catalog/product/cache/1280x720/s/m/smart_meters_dashboard_for_effective_comprehensive_guide_on_iot_enabled_iot_ss_slide01.jpg" // Replace with your actual image path
                  alt="Repair Ticket Dashboard Table"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Image Left, Text Right */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 w-full pr-0 lg:pr-12">
               <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {/* Placeholder for your Technician Workflow Image */}
                <Image 
                  src="https://images.ctfassets.net/fevtq3bap7tj/4Z3xdca3bymwimUoa408Ck/8c3bf8a8d2335a9613131d03c650131b/Energy_Dashboard_2x.jpg.png" // Replace with your actual image path
                  alt="Technician Assignment Workflow"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Master Your Technician Workflow
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Assign tickets to specific technicians based on expertise or availability. Monitor workload distribution and track individual performance metrics to ensure your shop operates at peak efficiency.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">45m</div>
                  <div className="text-sm text-gray-500">Avg Repair Time</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-500">On-Time Completion</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Text Left, Image Right */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Transparency that Builds Trust
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Stop playing phone tag. Our system automatically notifies customers via SMS and email when their repair status changes. Build trust by keeping your customers in the loop every step of the way.
              </p>
             
            </div>
            <div className="lg:w-1/2 w-full pl-0 lg:pl-12">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {/* Placeholder for your Notifications/Chat Image */}
                <Image 
                  src="https://klipboard.io/wp-content/uploads/2019/07/OO01.3_stat_cards.png" // Replace with your actual image path
                  alt="Customer Notifications Interface"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 3. LOGO SLIDER (MARQUEE) */}
      <section className="py-12 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Trusted by 100+ Repair Shops</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex space-x-16">
            {[...logos, ...logos].map((logo, index) => (
              <span key={index} className="text-2xl font-bold text-gray-300 select-none">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Powerful features designed specifically for the modern repair business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((card, idx) => (
              <div key={idx} className="group p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className={`transform transition-transform duration-200 text-blue-600 ${openFaq === index ? 'rotate-45' : ''}`}>
                    <Icons.Plus />
                  </span>
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 py-4 border-t border-gray-100 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VALUE ICONS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {valueProps.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {item.icon}
                <span className="font-medium text-gray-900">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM CSS FOR MARQUEE ANIMATION */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}