"use client";

import { useState, useEffect } from "react";
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
  AreaChart,
  Area,
} from "recharts";
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

interface Company {
  id: number;
  company_name: string;
  owner_name: string;
  email: string;
  subscription_plan: string;
  status: string;
  created_at: string;
  subscription_start_date: string;
  subscription_end_date: string;
}

interface Payment {
  id: string;
  companyName: string;
  plan: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesRes = await fetch('/api/super-admin/companies');
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(companiesData.companies || []);
        }
        
        // For now, keep payments empty until API is ready
        setPayments([]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCompanies([]);
        setPayments([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from real data
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const trialCompanies = companies.filter(c => c.status === 'trial').length;
  const inactiveCompanies = companies.filter(c => c.status === 'inactive').length;
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const monthlyRevenue = payments
    .filter(p => p.status === 'completed' && new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const stats: Array<{
    title: string;
    value: number | string;
    color: string;
    icon: typeof Building2;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  }> = [
    { 
      title: "Total Companies", 
      value: totalCompanies, 
      color: "from-blue-500 to-blue-600",
      icon: Building2,
      change: "+12%",
      changeType: "positive"
    },
    { 
      title: "Active Subscriptions", 
      value: activeCompanies, 
      color: "from-green-500 to-green-600",
      icon: CheckCircle,
      change: "+8%",
      changeType: "positive"
    },
    { 
      title: "Monthly Revenue", 
      value: `₹${monthlyRevenue.toLocaleString()}`, 
      color: "from-purple-500 to-purple-600",
      icon: DollarSign,
      change: "+15%",
      changeType: "positive"
    },
    { 
      title: "Inactive Companies", 
      value: inactiveCompanies, 
      color: "from-red-500 to-red-600",
      icon: AlertCircle,
      change: "-2%",
      changeType: "negative"
    },
  ];

  const revenueData = [
    { month: "Jul", revenue: 0, companies: 0 },
    { month: "Aug", revenue: 0, companies: 0 },
    { month: "Sep", revenue: 0, companies: 0 },
    { month: "Oct", revenue: 0, companies: 0 },
    { month: "Nov", revenue: 0, companies: 0 },
    { month: "Dec", revenue: monthlyRevenue, companies: totalCompanies },
  ];

  const planDistribution = [
    { name: "Free", value: companies.filter(c => c.subscription_plan?.toLowerCase() === 'free').length, color: "#6B7280" },
    { name: "Basic", value: companies.filter(c => c.subscription_plan?.toLowerCase() === 'basic').length, color: "#3B82F6" },
    { name: "Pro", value: companies.filter(c => c.subscription_plan?.toLowerCase() === 'pro').length, color: "#8B5CF6" },
    { name: "Enterprise", value: companies.filter(c => c.subscription_plan?.toLowerCase() === 'enterprise').length, color: "#10B981" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage all companies, subscriptions, and platform analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      item.changeType === 'positive' ? 'text-green-600' : 
                      item.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${item.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

        {/* Revenue & Companies Growth */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Revenue & Company Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                strokeWidth={3}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="companies" 
                stroke="#10B981" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Subscription Plans
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({name, value}) => `${name}: ${value}`}
              >
                {planDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Companies */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Companies
            </h2>
            <span className="text-sm text-gray-500">
              {companies.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            {companies.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Company</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Owner</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Plan</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.slice(0, 5).map((company) => (
                    <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-800">{company.company_name}</p>
                          <p className="text-xs text-gray-500">{company.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-700">{company.owner_name}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          company.subscription_plan?.toLowerCase() === 'enterprise' ? 'bg-green-100 text-green-800' :
                          company.subscription_plan?.toLowerCase() === 'pro' ? 'bg-purple-100 text-purple-800' :
                          company.subscription_plan?.toLowerCase() === 'basic' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {company.subscription_plan || 'Free'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          company.status === 'active' ? 'bg-green-100 text-green-800' :
                          company.status === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {company.status || 'inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No companies registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Payments
            </h2>
            <span className="text-sm text-gray-500">
              ₹{totalRevenue.toLocaleString()} total
            </span>
          </div>

          <div className="overflow-x-auto">
            {payments.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Company</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Plan</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-800">{payment.companyName}</p>
                          <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.plan === 'Enterprise' ? 'bg-green-100 text-green-800' :
                          payment.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                          payment.plan === 'Basic' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.plan}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-800">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No payments recorded yet</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}