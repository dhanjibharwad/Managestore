"use client";

import { Receipt, TrendingUp, Briefcase, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardStats {
  activeJobs: number;
  completedJobs: number;
  pendingPayments: number;
  totalSpent: string;
}

export default function CustomerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    completedJobs: 0,
    pendingPayments: 0,
    totalSpent: "₹0"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/customer/dashboard-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statsConfig = [
    { title: "Active Jobs", value: stats.activeJobs, change: "- 0%", icon: Receipt },
    { title: "Completed Jobs", value: stats.completedJobs, change: "- 0%", icon: TrendingUp },
    { title: "Pending Payments", value: stats.pendingPayments, change: "- 0%", icon: Briefcase },
    { title: "Total Spent", value: stats.totalSpent, change: "- 0%", icon: IndianRupee },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((item, i) => {
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}