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
  { label: "Pickup Drops", href: "/customer/pickupdrop", icon: Truck },
  { label: "Quotations", href: "/customer/quotations", icon: FileText },
  { label: "Self Check-In", href: "/customer/selfcheck", icon: UserCheck },
  { label: "Profile", href: "/customer/profile", icon: User }

];

export default function CustomerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out hidden lg:flex flex-col sticky top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-100 hover:shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:ring-opacity-50"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="flex-1 p-5">
        {/* Logo */}
        <div className="mb-8">
          {!isCollapsed ? (
            <Link
              href="/home"
              className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/images/lg1.png"
                alt="Storremanager Logo"
                className="h-16 w-auto"
              />
            </Link>
          ) : (
            <Link
              href="/home"
              className="flex justify-center transition-transform duration-200 hover:scale-110"
            >
              <img
                src="/images/np.png"
                alt="Storremanager Logo"
                className="h-8 w-8 object-contain"
              />
            </Link>
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
  );
}