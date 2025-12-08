"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"], // bold serif like in image
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "/user/about-us",
      dropdown: [
        { name: "Our Story", href: "/user/about-us/" },
        { name: "Our Team", href: "/user/team-member/" },
        { name: "Our Gallery", href: "/user/gallery/" },
        { name: "FAQs", href: "/user/faqs/" },
        { name: "Blogs", href: "/user/blog/" },
      ]
    },
    {
      name: "Services",
      href: "/user/services",
      dropdown: [
        { name: "HRMS", href: "/user/services/emsservice" },
        { name: "CRM", href: "/user/services/crm" },
        { name: "Finance and Accounting", href: "/user/services/accounting" },
        { name: "Union Enterprise", href: "/user/services/unionservice" },
        { name: "Projects and tasks", href: "/user/services/taskmanage" },
        { name: "Sales and Purchase", href: "/user/services/sales" },
        { name: "Inventory", href: "/user/services/inventory" },
        { name: "E-commerce", href: "/user/services/ecom-market" },
        { name: "Communications", href: "/user/services/collab" },
        { name: "Document Management", href: "/user/services/document" },
        { name: "Service Operations", href: "/user/services/operations" },
        { name: "Planning and Resource", href: "/user/services/plan-resource" },
        { name: "Business Intelligence", href: "/user/services/bi-analytics" },
        { name: "Administration", href: "/user/services/administration" },
        { name: "Legal and Compliance", href: "/user/services/legal" },
        { name: "Asset Management", href: "/user/services/assets" },
        { name: "Subscriptions", href: "/user/services/subscription" },
      ]
    },
    { name: "Pricing", href: "/user/pricing" },
    { name: "Contact", href: "/user/contact-us" },
    { name: "Careers", href: "/user/careers" },
  ];

  return (
    <>
      
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 py-2"
            : "bg-transparent backdrop-blur-sm py-2"
          }`}
      >

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
<Link
  href="/"
  className="relative flex items-center z-50"
>
  <h1
    className={`${playfair.className} text-[30px] tracking-[0.05em] text-[#4A70A9] font-semibold`}
  >
    <span className="text-[38px] mr-[1px]">S</span>tore <span className="text-[38px] mr-[1px]">M</span>anager
  </h1>
</Link>


          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="relative px-5 py-2 text-gray-700 font-semibold transition-colors duration-300 ease-in-out flex items-center gap-1 group"

                >
                  <span className="relative z-10">
                    {item.name}
                  </span>
                  {item.dropdown && (
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                    />
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className={`absolute top-full left-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 ${
                    item.dropdown.length > 8 ? 'w-96' : 'w-64'
                  }`}>
                    <div className={`py-3 ${
                      item.dropdown.length > 8 ? 'grid grid-cols-2 gap-x-4' : ''
                    }`}>
                      {item.dropdown.map((dropItem, index) => (
                        <Link
                          key={dropItem.name}
                          href={dropItem.href}
                          className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200 text-sm font-medium"
                          onClick={() => setActiveDropdown(null)}
                          style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                          }}
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/user/auth/login"
              className="min-w-[140px] px-6 py-3 rounded-xl font-semibold text-md text-center text-gray-900 bg-white border-2 border-gray-900 shadow-md hover:bg-gray-700 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              Login
            </Link>

            <Link
              href="/user/services"
              className="min-w-[140px] px-6 py-3 rounded-xl font-semibold text-md text-center text-white bg-[#4A70A9] shadow-lg hover:bg-[#3A5F99] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-200" />
            <span className="relative z-10">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-40 lg:hidden transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block py-3 px-4 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50 hover:text-indigo-600 transition-all duration-200 transform hover:translate-x-1"
                  onClick={() => !item.dropdown && setIsOpen(false)}
                  style={{
                    animation: isOpen
                      ? `slideInRight 0.4s ease-out ${index * 0.1}s both`
                      : "none",
                  }}
                >
                  {item.name}
                </Link>

                {/* Mobile Dropdown */}
                {item.dropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((dropItem) => (
                      <Link
                        key={dropItem.name}
                        href={dropItem.href}
                        className="block py-2 px-4 text-sm text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        • {dropItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="block w-full text-center py-3 px-6 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/get-started"
              className="block w-full text-center py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={16} />
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile Menu Footer */}
          <div className="mt-auto pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              © 2025 Jashviro. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>


    </>
  );
}