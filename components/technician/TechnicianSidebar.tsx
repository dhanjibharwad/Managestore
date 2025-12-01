"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/technician/dashboard" },
  { label: "Assigned Jobs", href: "/technician/assigned-jobs" },
  { label: "Job Report", href: "/technician/job-report" },
  { label: "Profile", href: "/technician/profile" },
];

export default function TechnicianSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg p-5 hidden lg:block">
      <h2 className="text-xl font-bold mb-8">Technician Panel</h2>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium ${
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
