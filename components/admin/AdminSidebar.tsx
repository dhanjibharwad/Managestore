"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Jobs", href: "/admin/jobs" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Technicians", href: "/admin/technicians" },
  { label: "Billing", href: "/admin/billing" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg p-5 hidden lg:block">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm ${
                pathname.startsWith(item.href)
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
