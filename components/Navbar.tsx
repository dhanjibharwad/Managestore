"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Sparkles, User, LogOut, Settings, Shield } from "lucide-react";
import { 
  MdConfirmationNumber, 
  MdLeaderboard, 
  MdTask, 
  MdBuild,
  MdAssignment,
  MdCheckCircle,
  MdHistory,
  MdSchedule,
  MdPeople,
  MdVisibility,
  MdLocalShipping,
  MdBusinessCenter,
  MdInventory,
  MdShoppingCart,
  MdAccountBalanceWallet,
  MdPointOfSale,
  MdSecurity,
  MdPhotoLibrary,
  MdStorage,
  MdPalette,
  MdFeaturedPlayList
} from "react-icons/md";
import { Playfair_Display } from "next/font/google";
import { useRouter } from "next/navigation";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowProfileMenu(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'technician':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    // { name: "Contact", href: "/user/contact-us" },
    {
      name: "Services",
      href: "/home/allservice",
      dropdown: [
        // Ticket & Service
        { name: "Repair Tickets Management", href: "/user/services/repair-tickets", icon: MdConfirmationNumber },
        { name: "Annual Maintenance Contract", href: "/user/services/amc", icon: MdAssignment },
        { name: "Self Check-In", href: "/user/services/self-checkin", icon: MdCheckCircle },
        // { name: "Activity Logs", href: "/user/services/activity-logs", icon: MdHistory },
        // Operations & Tasks
        { name: "Task Management", href: "/user/services/task-management", icon: MdTask },
        { name: "Work Scheduler", href: "/user/services/work-scheduler", icon: MdSchedule },
        { name: "Employee Permissions", href: "/user/services/employee-permissions", icon: MdPeople },
        { name: "Show / Hide Modules", href: "/user/services/module-control", icon: MdVisibility },
        // CRM & Leads
        { name: "Lead Management", href: "/user/services/lead-management", icon: MdLeaderboard },
        { name: "Pickup Drop Management", href: "/user/services/pickup-drop", icon: MdLocalShipping },
        { name: "Outsource Management", href: "/user/services/outsource-management", icon: MdBusinessCenter },
        // Inventory & Finance
        { name: "Inventory Management", href: "/user/services/inventory-management", icon: MdInventory },
        { name: "Purchase Management", href: "/user/services/purchase-management", icon: MdShoppingCart },
        { name: "Expense Management", href: "/user/services/expense-management", icon: MdAccountBalanceWallet },
        { name: "Point of Sale (POS)", href: "/user/services/pos", icon: MdPointOfSale },
        // Security & Verification
        { name: "OTP for Delivery", href: "/user/services/otp-delivery", icon: MdSecurity },
        // { name: "Device Image Gallery", href: "/user/services/device-gallery", icon: MdPhotoLibrary },
        // { name: "Data Recovery Management", href: "/user/services/data-recovery", icon: MdStorage },
        // UI & System
        // { name: "Theme Change (Light / Dark)", href: "/user/services/theme", icon: MdPalette },
        // CTA
        { name: "All Features", href: "/features", icon: MdFeaturedPlayList }
      ]
    },
     { name: "Pricing", href: "/home/pricing" },
    { name: "Contact", href: "/home/contact" },
    { name: "Blog", href: "/home/blog" }, 
  ];

  return (
    <>
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 py-2"
            : "bg-transparent backdrop-blur-sm py-2"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="relative flex items-center z-50">
            <h1
              className={`${playfair.className} text-[20px] sm:text-[24px] md:text-[30px] tracking-[0.05em] text-blue-600 font-semibold`}
            >
              <span className="text-[24px] sm:text-[30px] md:text-[38px] mr-[1px]">S</span>TORE{" "}
              <span className="text-[24px] sm:text-[30px] md:text-[38px] mr-[1px]">M</span>ANAGER
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="relative px-3 lg:px-5 py-4 text-gray-700 font-semibold transition-colors duration-300 ease-in-out flex items-center gap-1 group text-sm lg:text-base"
                >
                  <span className="relative z-10">{item.name}</span>
                  {item.dropdown && (
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform duration-300 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>

                {item.dropdown && activeDropdown === item.name && (
                  <div
                    className={`absolute top-full left-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 ${
                      item.dropdown.length > 8 ? "w-96" : "w-64"
                    }`}
                  >
                    <div
                      className={`py-3 ${
                        item.dropdown.length > 8 ? "grid grid-cols-2 gap-x-4" : ""
                      }`}
                    >
                      {item.dropdown.map((dropItem, index) => {
                        const IconComponent = dropItem.icon;
                        return (
                          <Link
                            key={dropItem.name}
                            href={dropItem.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200 text-sm font-medium"
                            onClick={() => setActiveDropdown(null)}
                            style={{
                              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                            }}
                          >
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            {dropItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {loading ? (
              <div className="w-24 lg:w-32 h-8 lg:h-10 bg-gray-200 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <div className="w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex items-center justify-center">
                    <User size={16} className="lg:w-[18px] lg:h-[18px] text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs lg:text-sm font-semibold text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] lg:text-xs text-blue-100 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white transform transition-transform duration-300 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 lg:w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-slideDown">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.email}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/customer/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Shield size={18} />
                        <span className="font-medium">Dashboard</span>
                      </Link>

                      <hr className="my-2 border-gray-200" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="min-w-[100px] lg:min-w-[140px] px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold text-sm lg:text-md text-center text-gray-900 bg-white border-1 border-gray-900 shadow-md hover:bg-gray-700 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  Workspace login
                </Link>

                <Link
                  href="/extra/demopage"
                  className="min-w-[100px] lg:min-w-[140px] px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold text-sm lg:text-md text-center text-white bg-blue-500 shadow-lg hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                 Start Free Trial
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-200" />
            <span className="relative z-10">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 max-w-[85vw] bg-white z-40 md:hidden transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 sm:pt-24 px-4 sm:px-6 pb-6 overflow-y-auto">
          {user && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.email}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

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

                {item.dropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((dropItem) => {
                      const IconComponent = dropItem.icon;
                      return (
                        <Link
                          key={dropItem.name}
                          href={dropItem.href}
                          className="flex items-center gap-2 py-2 px-4 text-sm text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <IconComponent className="w-4 h-4" />
                          {dropItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {user && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="block py-3 px-4 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50 hover:text-indigo-600 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Shield size={18} />
                    Dashboard
                  </span>
                </Link>


              </>
            )}
          </div>

          <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full text-center py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-all duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full text-center py-3 px-6 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Workspace login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Get Started
                  </span>
                </Link>
              </>
            )}
          </div>

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

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
