// app/(customer)/dashboard/page.tsx
import { Receipt, TrendingUp, Briefcase, DollarSign } from "lucide-react";

export default function CustomerDashboard() {
  const stats = [
    { title: "Active Jobs", value: 4, change: "- 0%", icon: Receipt },
    { title: "Completed Jobs", value: 28, change: "- 0%", icon: TrendingUp },
    { title: "Pending Payments", value: 2, change: "- 0%", icon: Briefcase },
    { title: "Total Spent", value: "₹12,450", change: "- 0%", icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {item.title}
                  </span>
                  <span className="text-cyan-500 text-xs font-medium">{item.change}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-400 mt-1">From 2025-11-04 - 2025-12-04</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}