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
    { title: "Total Companies", value: 32, color: "from-[#4A70A9] to-zinc-700" },
    { title: "Total Admins", value: 87, color: "from-[#4A70A9] to-zinc-700" },
    { title: "Monthly Revenue", value: "₹1,24,500", color: "from-[#4A70A9] to-zinc-700" },
    { title: "Active Subscriptions", value: 29, color: "from-[#4A70A9] to-zinc-700" },
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

  const COLORS = ["#4A70A9", "#6A85B6", "#2E3A47"];

  return (
    <div className="min-h-screen p-8">
      
      {/* Main Heading */}
      <h1 className="mt-2 mb-4 text-4xl sm:text-4xl font-semibold tracking-wide drop-shadow-md font-serif text-gray-700">
        Super Admin Dashboard
      </h1>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl text-white shadow-xl bg-gradient-to-br ${item.color} transform hover:scale-105 transition-all duration-300`}
          >
            <h4 className="text-sm opacity-90 font-serif tracking-wide">{item.title}</h4>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ===== Charts Section ===== */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-zinc-200 hover:shadow-xl transition">
          <h3 className="mt-1 mb-3 text-xl font-semibold tracking-wide font-serif text-gray-700">
            Monthly Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4D4D8" />
              <XAxis dataKey="month" stroke="#3F3F46" />
              <YAxis stroke="#3F3F46" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4A70A9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-zinc-200 hover:shadow-xl transition">
          <h3 className="mt-1 mb-3 text-xl font-semibold tracking-wide font-serif text-gray-700">
            Companies Joined Monthly
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companiesJoined}>
              <CartesianGrid stroke="#E4E4E7" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#3F3F46" />
              <YAxis stroke="#3F3F46" />
              <Tooltip />
              <Bar dataKey="companies" fill="#4A70A9" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-zinc-200 hover:shadow-xl transition">
          <h3 className="mt-1 mb-3 text-xl font-semibold tracking-wide font-serif text-gray-700">
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

      {/* ===== Recent Companies ===== */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-zinc-200">
        <h2 className="mt-2 mb-3 text-2xl font-semibold tracking-wide font-serif text-gray-700">
          Recently Joined Companies
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-100">
              <th className="py-3 text-left text-zinc-600">Company</th>
              <th className="text-left text-zinc-600">Owner</th>
              <th className="text-left text-zinc-600">Plan</th>
              <th className="text-left text-zinc-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">TechFix Solutions</td>
              <td>Rahul Mehta</td>
              <td className="text-[#4A70A9] font-semibold">Pro</td>
              <td>Dec 1</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">HomeCare Plus</td>
              <td>Ananya Sharma</td>
              <td className="text-[#4A70A9] font-semibold">Basic</td>
              <td>Nov 29</td>
            </tr>
            <tr>
              <td className="py-3">CoolTech Repairs</td>
              <td>Vikas Patel</td>
              <td className="text-[#4A70A9] font-semibold">Enterprise</td>
              <td>Nov 27</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== Recent Subscriptions ===== */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-zinc-200 mb-10">
        <h2 className="mt-2 mb-3 text-2xl font-semibold tracking-wide font-serif text-gray-700">
          Recent Subscription Payments
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-100">
              <th className="py-3 text-left text-zinc-600">Company</th>
              <th className="text-left text-zinc-600">Plan</th>
              <th className="text-left text-zinc-600">Amount</th>
              <th className="text-left text-zinc-600">Date</th>
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
