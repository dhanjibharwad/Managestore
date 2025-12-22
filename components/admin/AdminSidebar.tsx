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
  UserPlus,
  Warehouse,
  IdCard,
  ReceiptIndianRupee,
  ListTodo,
  ShoppingCart,
  Truck,
  LineChart,
  User,
  FileCheck,
  Menu,
  X
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
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-lg p-2 border border-gray-200 hover:bg-gray-100"
        aria-label="Toggle mobile menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col h-screen z-40 ${
          // Mobile styles
          isMobileOpen 
            ? 'fixed top-0 left-0 w-64'
            : 'fixed top-0 left-0 w-0 overflow-hidden md:relative md:w-auto md:overflow-visible'
        } ${
          // Desktop styles
          isCollapsed ? 'md:w-16 lg:w-20' : 'md:w-56 lg:w-64'
        }`}
      >
        {/* Toggle Button - Desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden md:block absolute -right-3 top-6 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-100 hover:shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-[#4A70A9] focus:ring-opacity-50"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="flex-1 p-3 md:p-5 overflow-y-auto">
          {/* Logo */}
          <div className="mb-6 md:mb-8 mt-12 md:mt-0">
            {!isCollapsed || isMobileOpen ? (
              <img 
                src="/images/lg1.png" 
                alt="BytePhase Logo" 
                className="h-12 md:h-16 w-auto"
              />
            ) : (
              <img 
                src="/images/np.png" 
                alt="Storremanager Logo" 
                className="h-6 w-6 md:h-8 md:w-8 object-contain mx-auto"
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
                      className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-[#4A70A9] text-white shadow-md'
                          : 'text-gray-700 hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]'
                      } ${isCollapsed && !isMobileOpen ? 'md:justify-center' : ''}`}
                      title={isCollapsed && !isMobileOpen ? item.label : ''}
                    >
                      <Icon 
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                          !isActive && 'group-hover:scale-110'
                        }`} 
                      />
                      
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate">{item.label}</span>
                      )}

                      {/* Tooltip for collapsed state - Desktop only */}
                      {isCollapsed && !isMobileOpen && (
                        <span className="hidden md:block absolute left-full ml-2 px-3 py-2 bg-[#4A70A9] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
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
      </aside>
    </>
  );
}
