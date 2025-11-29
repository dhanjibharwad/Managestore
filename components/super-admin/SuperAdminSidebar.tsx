"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Companies", href: "/super-admin/companies" },
  { label: "Subscriptions", href: "/super-admin/subscriptions" },
  { label: "Usage", href: "/super-admin/usage" },
  { label: "Admins", href: "/super-admin/admins" },
  { label: "Settings", href: "/super-admin/settings" },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg p-5 hidden lg:block">
      <h2 className="text-xl font-bold mb-8">Super Admin</h2>

      <ul className="space-y-2">
        {menu.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
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
