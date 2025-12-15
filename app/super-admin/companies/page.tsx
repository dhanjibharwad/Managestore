'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Building2, User, Mail, Phone, Globe } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'inactive' | 'active' | 'suspended'>('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/super-admin/companies');
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (companyId: number, status: 'active' | 'suspended') => {
    try {
      const res = await fetch(`/api/super-admin/companies/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        fetchCompanies(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update company status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredCompanies = companies.filter(company => 
    filter === 'all' || company.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company Management</h1>
        <div className="flex gap-2">
          {['all', 'inactive', 'active', 'suspended'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status as any)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500">No companies found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{company.company_name}</CardTitle>
                      <p className="text-sm text-gray-600">ID: {company.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(company.status)}>
                      {getStatusIcon(company.status)}
                      <span className="ml-1 capitalize">{company.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Owner:</span>
                    <span className="text-sm">{company.owner_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{company.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{company.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Country:</span>
                    <span className="text-sm">{company.country}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">
                      {company.subscription_plan} Plan
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Registered: {new Date(company.created_at).toLocaleDateString()}
                    </span>
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
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
