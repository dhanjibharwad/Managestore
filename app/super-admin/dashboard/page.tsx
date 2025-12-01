"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SuperAdminDashboard() {
  const stats = [
    { title: "Total Companies", value: 32, color: "from-purple-500 to-purple-700" },
    { title: "Total Admins", value: 87, color: "from-blue-500 to-blue-700" },
    { title: "Monthly Revenue", value: "₹1,24,500", color: "from-emerald-500 to-emerald-700" },
    { title: "Active Subscriptions", value: 29, color: "from-pink-500 to-pink-700" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 55000 },
    { month: "Feb", revenue: 72000 },
    { month: "Mar", revenue: 68000 },
    { month: "Apr", revenue: 90000 },
    { month: "May", revenue: 110000 },
    { month: "Jun", revenue: 124500 },
  ];

  const companiesJoined = [
    { month: "Jan", companies: 5 },
    { month: "Feb", companies: 7 },
    { month: "Mar", companies: 4 },
    { month: "Apr", companies: 8 },
    { month: "May", companies: 10 },
    { month: "Jun", companies: 6 },
  ];

  const planDistribution = [
    { name: "Basic", value: 12 },
    { name: "Pro", value: 14 },
    { name: "Enterprise", value: 6 },
  ];

  const COLORS = ["#8B5CF6", "#6366F1", "#EC4899"];

  return (
    <div className="min-h-screen p-8 bg-white">
      
      {/* Main Title */}
      <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-10">
        Super Admin Dashboard
      </h1>

      {/* ======= Stats Section ======= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl text-white shadow-xl bg-gradient-to-br ${item.color} transform hover:scale-105 transition-all duration-300`}
          >
            <h4 className="text-sm opacity-80">{item.title}</h4>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ======= Charts Section ======= */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Line Chart Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Monthly Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="month" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Companies Joined Monthly
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companiesJoined}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip />
              <Bar dataKey="companies" fill="#4F46E5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Plan Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={planDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {planDistribution.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Recent Companies ====== */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Recently Joined Companies
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="py-3 text-left text-slate-600">Company</th>
              <th className="text-left text-slate-600">Owner</th>
              <th className="text-left text-slate-600">Plan</th>
              <th className="text-left text-slate-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">TechFix Solutions</td>
              <td>Rahul Mehta</td>
              <td className="text-purple-600 font-semibold">Pro</td>
              <td>Dec 1</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">HomeCare Plus</td>
              <td>Ananya Sharma</td>
              <td className="text-blue-600 font-semibold">Basic</td>
              <td>Nov 29</td>
            </tr>
            <tr>
              <td className="py-3">CoolTech Repairs</td>
              <td>Vikas Patel</td>
              <td className="text-pink-600 font-semibold">Enterprise</td>
              <td>Nov 27</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ====== Recent Subscriptions ====== */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-10">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Recent Subscription Payments
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="py-3 text-left text-slate-600">Company</th>
              <th className="text-left text-slate-600">Plan</th>
              <th className="text-left text-slate-600">Amount</th>
              <th className="text-left text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">TechFix</td>
              <td>Pro</td>
              <td>₹999</td>
              <td>Dec 1</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">HomeCare Plus</td>
              <td>Basic</td>
              <td>₹499</td>
              <td>Nov 29</td>
            </tr>
            <tr>
              <td className="py-3">CoolTech Repairs</td>
              <td>Enterprise</td>
              <td>₹1,999</td>
              <td>Nov 27</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
