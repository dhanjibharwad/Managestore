"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  User,
  ChevronLeft,
  ChevronRight,
  Truck,
  UserCheck,
  LineChart,
  FileCheck,
  FileText
} from 'lucide-react';

const navItems = [
  { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/customer/jobs", icon: Briefcase },
  { label: "AMCS", href: "/customer/amcs", icon: FileCheck },
  { label: "Sales", href: "/customer/sales", icon: LineChart },
  { label: "Quotations", href: "/customer/quotations", icon: FileText },
  { label: "Pickup Drops", href: "/customer/pickupdrop", icon: Truck },
  
  { label: "Self Check-In", href: "/customer/selfcheck", icon: UserCheck },
  { label: "Profile", href: "/customer/profile", icon: User }

];

export default function CustomerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#4A70A9] text-white p-2 rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col sticky top-0 h-screen
          ${isCollapsed ? 'w-20' : 'w-64'}
          lg:relative lg:translate-x-0
          ${isMobileOpen ? 'fixed inset-y-0 left-0 z-50 translate-x-0' : 'fixed -translate-x-full lg:translate-x-0'}
        `}
      >
      {/* Toggle Button - Desktop Only */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:block absolute -right-3 top-6 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-100 hover:shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:ring-opacity-50"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Mobile Close Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Sidebar Content */}
      <div className="flex-1 p-5">
        {/* Logo */}
        <div className="mb-8 mt-4 lg:mt-0">
          {!isCollapsed ? (
            <img
              src="/images/lg1.png"
              alt="Storremanager Logo"
              className="h-16 w-auto"
            />
          ) : (
            <img
              src="/images/np.png"
              alt="Storremanager Logo"
              className="h-8 w-8 object-contain mx-auto"
            />
          )}
        </div>

        {/* Navigation Items */}
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive
                      ? 'bg-[#4A70A9] text-white shadow-md'
                      : 'text-gray-700 hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >

                    <Icon
                      className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'
                        }`}
                    />

                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <span className="absolute left-full ml-2 px-3 py-2 bg-[#4A70A9] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className={`border-t border-gray-200 p-5 ${isCollapsed ? 'text-center' : ''}`}>
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            StoreManager © 2026
          </div>
        ) : (
          <div className="text-xs text-gray-500 font-semibold">
            SM
          </div>
        )}
      </div>
    </aside>
    </>
  );
}