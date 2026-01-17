'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Calendar, Search, Filter, MoreVertical, Eye, Edit, Trash2, Download } from 'lucide-react';

interface SubscriptionStats {
  plan: string;
  companies: number;
  revenue: number;
  percentage: number;
}

interface CompanySubscription {
  id: number;
  company_name: string;
  subscription_plan: string;
  status: string;
  subscription_start_date: string;
  subscription_end_date: string;
  created_at: string;
}

export default function SubscriptionsPage() {
  const [stats, setStats] = useState<SubscriptionStats[]>([]);
  const [companies, setCompanies] = useState<CompanySubscription[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, statusFilter, planFilter]);

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(company => company.status === statusFilter);
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(company => company.subscription_plan.toLowerCase() === planFilter);
    }

    setFilteredCompanies(filtered);
  };

  const fetchSubscriptionData = async () => {
    try {
      const res = await fetch('/api/super-admin/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
      }
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pro': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    if (!endDate) return null;
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Subscription Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.plan}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {stat.plan} Plan
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.companies}</div>
              <p className="text-xs text-muted-foreground">
                {stat.percentage}% of total companies
              </p>
              <div className="flex items-center mt-2">
                <DollarSign className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-sm text-green-600">
                  ${stat.revenue.toLocaleString()}/mo
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Company</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Start Date</th>
                  <th className="text-left py-3 px-4">End Date</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No subscription data found
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {company.company_name}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPlanColor(company.subscription_plan)}>
                          {company.subscription_plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={company.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        >
                          {company.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {company.subscription_start_date 
                          ? new Date(company.subscription_start_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {company.subscription_end_date 
                          ? new Date(company.subscription_end_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
