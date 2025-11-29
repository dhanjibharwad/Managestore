// components/customer/CustomerSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Jobs", href: "/jobs" },
  { label: "Service History", href: "/service-history" },
  { label: "Profile", href: "/profile" },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg p-5 hidden lg:block">
      <h2 className="text-xl font-bold mb-8">Customer Panel</h2>

      <ul className="space-y-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(`/customer${item.href}`);

          return (
            <li key={item.href}>
              <Link
                href={`/customer${item.href}`}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
