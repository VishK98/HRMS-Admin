import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Building2, Users, Globe, Phone, Mail } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Company {
  _id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  industry?: string;
  employeeCount: number;
  isActive: boolean;
  subscription: {
    plan: string;
    startDate: string;
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const CompaniesList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getAllCompanies();
      
      if (response.success && response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch companies');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'default';
      case 'enterprise':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            Manage all registered companies in the system
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {companies.length} Companies
        </Badge>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
            <p className="text-muted-foreground text-center">
              No companies have been registered yet. Register a new company to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {company.code}
                      </Badge>
                      <Badge 
                        variant={company.isActive ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {company.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={getSubscriptionBadgeVariant(company.subscription.plan)}
                    className="text-xs"
                  >
                    {company.subscription.plan}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{company.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{company.phone}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{company.website}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Address:</span>
                    <p className="text-muted-foreground">
                      {company.address.street}, {company.address.city}, {company.address.state} {company.address.zipCode}
                    </p>
                  </div>
                  
                  {company.industry && (
                    <div className="text-sm">
                      <span className="font-medium">Industry:</span>
                      <p className="text-muted-foreground">{company.industry}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {company.employeeCount} employees
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined {formatDate(company.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 