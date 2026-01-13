"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Wrench, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  UserPlus,
  Warehouse,
  IdCard,
  ReceiptIndianRupee,
  ListTodo,
  ShoppingCart,
  Truck,
  LineChart,
  User,
  FileCheck
} from 'lucide-react';

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase }, 
  // { label: "Technicians", href: "/admin/technicians", icon: Wrench },
  // { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "AMCS", href: "/admin/amcs", icon: FileCheck },
   { label: "Billing", href: "/admin/billing", icon: ReceiptIndianRupee },
  { label: "Customers", href: "/admin/customers", icon: Users },
   { label: "Sales", href: "/admin/sales", icon: LineChart }, 
   { label: "Quotations", href: "/admin/quotations", icon: FileText  },
    { label: "Purchase", href: "/admin/purchase", icon: ShoppingCart  },
    { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
   { label: "Reports", href: "/admin/reports", icon: FileText },
   { label: "Employees", href: "/admin/employees", icon: IdCard },
    { label: "Tasks", href: "/admin/tasks", icon: ListTodo },
   { label: "Leads", href: "/admin/leads", icon: UserPlus },
   { label: "Expenses", href: "/admin/expenses", icon: Wrench },
   { label: "Pickup Drops", href: "/admin/pickupdrop", icon: Truck },
    { label: "Profile", href: "/admin/profile", icon: User }
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md rounded-full p-2 border border-gray-200 hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      <aside 
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col h-screen overflow-hidden ${
          // Desktop behavior
          'hidden lg:flex lg:sticky lg:top-0'
        } ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        } ${
          // Mobile behavior
          isMobileOpen 
            ? 'fixed top-0 left-0 z-50 w-64 lg:relative lg:translate-x-0' 
            : 'fixed top-0 -left-64 z-50 w-64 lg:relative lg:translate-x-0'
        }`}
      >
      {/* Desktop Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`hidden lg:block absolute top-6 bg-white shadow-md rounded-full p-2 border border-gray-200 hover:bg-gray-100 hover:shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:ring-opacity-50 ${
          isCollapsed ? 'left-1/2 transform -translate-x-1/2' : 'right-2'
        }`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Logo Section - Fixed */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="border-b border-gray-100 flex justify-center items-center p-4">
          <img 
            src="/images/lg1.png" 
            alt="BytePhase Logo" 
            className="h-10 w-auto"
          />
        </div>
      )}

      {/* Scrollable Navigation */}
      <div className={`flex-1 overflow-hidden ${
        isCollapsed && !isMobileOpen ? 'pt-16' : ''
      }`}>
        <nav className="h-full">
          <div className={`h-full py-2 ${
            isCollapsed && !isMobileOpen
              ? 'px-0 overflow-y-auto overflow-x-hidden scrollbar-hide' 
              : 'px-4 overflow-y-auto overflow-x-hidden'
          }`}>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center font-medium transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-[#4A70A9] text-white shadow-md'
                          : 'text-gray-700 hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]'
                      } ${
                        isCollapsed && !isMobileOpen
                          ? 'w-12 h-12 mx-2 justify-center rounded-lg' 
                          : 'w-full gap-3 px-3 py-2.5 rounded-lg'
                      }`}
                      onClick={() => {
                        if (isMobileOpen) {
                          setIsMobileOpen(false);
                        }
                      }}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon 
                        className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" 
                      />
                      
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate text-sm">{item.label}</span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && !isMobileOpen && (
                        <span className="absolute left-full ml-2 px-2 py-1.5 bg-[#4A70A9] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer - Fixed */}
      <div className={`border-t border-gray-200 flex justify-center items-center ${
        isCollapsed && !isMobileOpen ? 'p-2' : 'p-4'
      }`}>
        {(!isCollapsed || isMobileOpen) ? (
          <div className="text-xs text-gray-500">
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
