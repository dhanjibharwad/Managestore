'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Building2, User, Mail, Phone, Globe, Search, Filter, Eye, Edit, Trash2, Calendar, Users, CreditCard, MoreVertical } from 'lucide-react';

interface Company {
  id: number;
  company_name: string;
  owner_name: string;
  email: string;
  phone: string;
  country: string;
  subscription_plan: string;
  status: 'inactive' | 'active' | 'suspended';
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'inactive' | 'active' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [approving, setApproving] = useState<number | null>(null);
  const [resendingInvite, setResendingInvite] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, filter, searchTerm]);

  const filterCompanies = () => {
    let filtered = companies;

    if (filter !== 'all') {
      filtered = filtered.filter(company => company.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/super-admin/companies');
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (companyId: number, status: 'active' | 'suspended') => {
    try {
      if (status === 'active') {
        setApproving(companyId);
      }
      
      const res = await fetch(`/api/super-admin/companies/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sendInvite: status === 'active' })
      });
      
      if (res.ok) {
        fetchCompanies();
      }
    } catch (error) {
      console.error('Failed to update company status:', error);
    } finally {
      setApproving(null);
    }
  };

  const handleResendInvite = async (companyId: number) => {
    try {
      setResendingInvite(companyId);
      
      const res = await fetch(`/api/super-admin/companies/${companyId}/resend-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        // Show success message or toast
        console.log('Invitation resent successfully');
      }
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    } finally {
      setResendingInvite(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'free': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pro': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enterprise': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompanyStats = () => {
    return {
      total: companies.length,
      active: companies.filter(c => c.status === 'active').length,
      inactive: companies.filter(c => c.status === 'inactive').length,
      suspended: companies.filter(c => c.status === 'suspended').length
    };
  };

  const stats = getCompanyStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
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
      {/* Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all registered companies</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inactive}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search companies, owners, or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'inactive', 'active', 'suspended'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status as any)}
                className="capitalize"
              >
                {status === 'all' ? 'All' : status}
                {status !== 'all' && (
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {status === 'inactive' ? stats.inactive : 
                     status === 'active' ? stats.active : stats.suspended}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Display */}
      {viewMode === 'cards' ? (
        <div className="grid gap-6">
          {filteredCompanies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Building2 className="w-12 h-12 mb-4 text-gray-300" />
                <p>No companies found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {company.company_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{company.company_name}</CardTitle>
                        <p className="text-sm text-gray-500">Company ID: {company.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(company.status)} border font-medium`}>
                        {getStatusIcon(company.status)}
                        <span className="ml-1 capitalize">{company.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Company Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Owner</p>
                        <p className="font-medium text-gray-900">{company.owner_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="font-medium text-gray-900 truncate">{company.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="font-medium text-gray-900">{company.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
                        <p className="font-medium text-gray-900">{company.country || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <Badge className={`${getPlanColor(company.subscription_plan)} border font-medium`}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        {company.subscription_plan || 'Free'} Plan
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Registered {new Date(company.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {company.status === 'inactive' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(company.id, 'suspended')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(company.id, 'active')}
                          disabled={approving === company.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {approving === company.id ? (
                            <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          {approving === company.id ? 'Approving...' : 'Approve'}
                        </Button>
                      </div>
                    )}
                    
                    {company.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendInvite(company.id)}
                        disabled={resendingInvite === company.id}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        {resendingInvite === company.id ? (
                          <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        ) : (
                          <Mail className="w-4 h-4 mr-1" />
                        )}
                        {resendingInvite === company.id ? 'Sending...' : 'Resend Invite'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Company</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Owner</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Plan</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Building2 className="w-12 h-12 mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No companies found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {company.company_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{company.company_name}</p>
                              <p className="text-sm text-gray-500">ID: {company.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">{company.owner_name}</p>
                          <p className="text-sm text-gray-500">{company.country || 'Not specified'}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-900">{company.email}</p>
                          <p className="text-sm text-gray-500">{company.phone || 'Not provided'}</p>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={`${getPlanColor(company.subscription_plan)} border font-medium`}>
                            {company.subscription_plan || 'Free'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={`${getStatusColor(company.status)} border font-medium`}>
                            {getStatusIcon(company.status)}
                            <span className="ml-1 capitalize">{company.status}</span>
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(company.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
