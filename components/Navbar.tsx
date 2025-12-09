// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Menu, X, ChevronDown, Sparkles, Moon, Sun } from "lucide-react";
// import { Playfair_Display } from "next/font/google";
// import { useTheme } from "@/contexts/ThemeContext";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["700"], // bold serif like in image
// });

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const { theme, toggleTheme } = useTheme();

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);



//   const navItems = [
//     { name: "Home", href: "/" },
//     {
//       name: "About",
//       href: "/user/about-us",
//       dropdown: [
//           // { name: "Our Story", href: "/user/about-us/" },
//           // { name: "Our Team", href: "/user/team-member/" },
//           // { name: "Our Gallery", href: "/user/gallery/" },
//           // { name: "FAQs", href: "/user/faqs/" },
//         { name: "Blogs", href: "/user/blog/" },
//       ]
//     },
//     {
//       name: "Services",
//       href: "/user/services",
//       dropdown: [
//         { name: "Service 1", href: "/user/services/emsservice" },
//         { name: "Service 2", href: "/user/services/crm" },
//         { name: "Services 3", href: "/user/services/accounting" },
        
//       ]
//     },
//     // { name: "Pricing", href: "/user/pricing" },
//     { name: "Contact", href: "/user/contact-us" },
//     // { name: "Careers", href: "/user/careers" },
//   ];

//   return (
//     <>
      
//       <nav
//         className={`fixed left-0 w-full z-50 transition-all duration-500 ${scrolled
//             ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 py-2"
//             : "bg-transparent backdrop-blur-sm py-2"
//           }`}
//       >

//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
//           {/* Logo */}
// <Link
//   href="/"
//   className="relative flex items-center z-50"
// >
//   <h1
//     className={`${playfair.className} text-[30px] tracking-[0.05em] text-blue-600 dark:text-blue-400 font-semibold`}
//   >
//     <span className="text-[38px] mr-[1px]">S</span>TORE <span className="text-[38px] mr-[1px]">M</span>ANAGER
//   </h1>
// </Link>


//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-1">
//             {navItems.map((item) => (
//               <div
//                 key={item.name}
//                 className="relative"
//                 onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <Link
//                   href={item.href}
//                   className="relative px-5 py-4 text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-300 ease-in-out flex items-center gap-1 group"

//                 >
//                   <span className="relative z-10">
//                     {item.name}
//                   </span>
//                   {item.dropdown && (
//                     <ChevronDown
//                       size={16}
//                       className={`transform transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180" : ""
//                         }`}
//                     />
//                   )}
//                   <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
//                 </Link>

//                 {/* Dropdown Menu */}
//                 {item.dropdown && activeDropdown === item.name && (
//                   <div className={`absolute top-full left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${
//                     item.dropdown.length > 8 ? 'w-96' : 'w-64'
//                   }`}>
//                     <div className={`py-3 ${
//                       item.dropdown.length > 8 ? 'grid grid-cols-2 gap-x-4' : ''
//                     }`}>
//                       {item.dropdown.map((dropItem, index) => (
//                         <Link
//                           key={dropItem.name}
//                           href={dropItem.href}
//                           className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm font-medium"
//                           onClick={() => setActiveDropdown(null)}
//                           style={{
//                             animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
//                           }}
//                         >
//                           {dropItem.name}
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* CTA Button */}
//           <div className="hidden lg:flex items-center gap-3">
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             >
//               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//             <Link
//               href="/auth/login"
//               className="min-w-[140px] px-6 py-3 rounded-xl font-semibold text-md text-center text-gray-900 bg-white border-1 border-gray-900 shadow-md hover:bg-gray-700 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
//             >
//               Login
//             </Link>

//             <Link
//               href="/auth/register"
//               className="min-w-[140px] px-6 py-3 rounded-xl font-semibold text-md text-center text-white bg-blue-500 shadow-lg hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
//             >
//               Get Started
//             </Link>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="lg:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group z-50"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-50 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-200" />
//             <span className="relative z-10">
//               {isOpen ? <X size={26} /> : <Menu size={26} />}
//             </span>
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay */}
//       <div
//         className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//           }`}
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Mobile Menu */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-40 lg:hidden transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
//           }`}
//       >
//         <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
//           <div className="flex flex-col space-y-1">
//             {navItems.map((item, index) => (
//               <div key={item.name}>
//                 <Link
//                   href={item.href}
//                   className="block py-3 px-4 text-gray-700 font-medium rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50 hover:text-indigo-600 transition-all duration-200 transform hover:translate-x-1"
//                   onClick={() => !item.dropdown && setIsOpen(false)}
//                   style={{
//                     animation: isOpen
//                       ? `slideInRight 0.4s ease-out ${index * 0.1}s both`
//                       : "none",
//                   }}
//                 >
//                   {item.name}
//                 </Link>

//                 {/* Mobile Dropdown */}
//                 {item.dropdown && (
//                   <div className="ml-4 mt-1 space-y-1">
//                     {item.dropdown.map((dropItem) => (
//                       <Link
//                         key={dropItem.name}
//                         href={dropItem.href}
//                         className="block py-2 px-4 text-sm text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         • {dropItem.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 space-y-3">
//             <Link
//               href="/login"
//               className="block w-full text-center py-3 px-6 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200"
//               onClick={() => setIsOpen(false)}
//             >
//               Login
//             </Link>
//             <Link
//               href="/get-started"
//               className="block w-full text-center py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
//               onClick={() => setIsOpen(false)}
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <Sparkles size={16} />
//                 Get Started
//               </span>
//             </Link>
//           </div>

//           {/* Mobile Menu Footer */}
//           <div className="mt-auto pt-8 border-t border-gray-200">
//             <p className="text-center text-sm text-gray-500">
//               © 2025 Jashviro. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideInRight {
//           from {
//             opacity: 0;
//             transform: translateX(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes gradient {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }

//         .animate-gradient {
//           animation: gradient 3s ease infinite;
//         }

//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>


//     </>
//   );
// }


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Sparkles, Moon, Sun, User, LogOut, Settings, Shield } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Fetch current user on component mount
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

  // Close profile menu when clicking outside
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
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'technician':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "/user/about-us",
      dropdown: [
        { name: "Blogs", href: "/user/blog/" },
      ]
    },
    {
      name: "Services",
      href: "/user/services",
      dropdown: [
        { name: "Service 1", href: "/user/services/emsservice" },
        { name: "Service 2", href: "/user/services/crm" },
        { name: "Services 3", href: "/user/services/accounting" },
      ]
    },
    { name: "Contact", href: "/user/contact-us" },
  ];

  return (
    <>
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 py-2"
            : "bg-transparent backdrop-blur-sm py-2"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="relative flex items-center z-50">
            <h1
              className={`${playfair.className} text-[30px] tracking-[0.05em] text-blue-600 dark:text-blue-400 font-semibold`}
            >
              <span className="text-[38px] mr-[1px]">S</span>TORE{" "}
              <span className="text-[38px] mr-[1px]">M</span>ANAGER
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
                  className="relative px-5 py-4 text-gray-700 dark:text-gray-300 font-semibold transition-colors duration-300 ease-in-out flex items-center gap-1 group"
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

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div
                    className={`absolute top-full left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${
                      item.dropdown.length > 8 ? "w-96" : "w-64"
                    }`}
                  >
                    <div
                      className={`py-3 ${
                        item.dropdown.length > 8 ? "grid grid-cols-2 gap-x-4" : ""
                      }`}
                    >
                      {item.dropdown.map((dropItem, index) => (
                        <Link
                          key={dropItem.name}
                          href={dropItem.href}
                          className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm font-medium"
                          onClick={() => setActiveDropdown(null)}
                          style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
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

          {/* Right Side - Theme Toggle + Auth Buttons / User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Show Auth Buttons or User Profile */}
            {loading ? (
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
            ) : user ? (
              /* User Profile Menu */
              <div className="relative profile-menu-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-blue-100 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white transform transition-transform duration-300 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideDown">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
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

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Shield size={18} />
                        <span className="font-medium">Dashboard</span>
                      </Link>

                      <Link
                        href="/auth/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings size={18} />
                        <span className="font-medium">Settings</span>
                      </Link>

                      <hr className="my-2 border-gray-200 dark:border-gray-700" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <>
                <Link
                  href="/auth/login"
                  className="min-w-[140px] px-6 py-3 rounded-xl font-semibold text-md text-center text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-1 border-gray-900 dark:border-gray-700 shadow-md hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  className="min-w-[140px] px-6 py-3 rounded-xl font-semibold text-md text-center text-white bg-blue-500 shadow-lg hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 relative group z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-200" />
            <span className="relative z-10">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-40 lg:hidden transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
          {/* User Info in Mobile Menu */}
          {user && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:translate-x-1"
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
                        className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        • {dropItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile User Menu Items */}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Shield size={18} />
                    Dashboard
                  </span>
                </Link>

                <Link
                  href="/auth/profile"
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Settings size={18} />
                    Settings
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth Buttons or Logout */}
          <div className="mt-8 space-y-3">
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
                  className="block w-full text-center py-3 px-6 border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
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

          {/* Mobile Menu Footer */}
          <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
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