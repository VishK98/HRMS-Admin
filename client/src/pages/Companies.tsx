import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Loader2, AlertCircle, Building2, Search, Filter, Eye, Edit, Trash2, Plus, Users, Globe, Phone, Mail, Calendar, MapPin, ExternalLink, MoreHorizontal } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { CompanyRegistration } from '@/components/companies/CompanyRegistration';

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

interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  totalRevenue: number;
  averageEmployees: number;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchCompanyStats();
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

  const fetchCompanyStats = async () => {
    try {
      const response = await apiClient.getSuperAdminCompanyStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch company stats:', error);
    }
  };

  const fetchCompanyUsers = async (companyId: string) => {
    try {
      setIsLoadingUsers(true);
      const response = await apiClient.getUsersByCompany(companyId);
      if (response.success && response.data) {
        setCompanyUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch company users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || company.isActive === (statusFilter === 'active');
    const matchesPlan = planFilter === 'all' || company.subscription.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'default';
      case 'enterprise':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCompanySelect = async (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
    await fetchCompanyUsers(company._id);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    fetchCompanies();
    fetchCompanyStats();
  };

  // Action handlers
  const handleViewCompany = async (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
    // Fetch users for this company
    await fetchCompanyUsers(company._id);
  };

  const handleEditCompany = (company: Company) => {
    // TODO: Implement edit company functionality
    console.log('Edit company:', company);
  };

  const handleDeleteCompany = (company: Company) => {
    // TODO: Implement delete company functionality
    console.log('Delete company:', company);
  };

  const handleToggleCompanyStatus = (company: Company) => {
    // TODO: Implement toggle company status functionality
    console.log('Toggle company status:', company);
  };

  const handleViewCompanyUsers = async (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
    // Fetch users for this company
    await fetchCompanyUsers(company._id);
    // The dialog will show the users tab by default
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            Manage all registered companies in the system
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {companies.length} Companies
          </Badge>
          <Button onClick={() => setShowRegistration(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Register Company
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">
                Registered companies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCompanies}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                Monthly revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.averageEmployees || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Per company
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plan</label>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
          <CardDescription>
            All registered companies in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
              <p className="text-muted-foreground text-center">
                No companies match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">{company.code}</div>
                          {company.industry && (
                            <div className="text-xs text-muted-foreground">{company.industry}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{company.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{company.phone}</span>
                          </div>
                          {company.website && (
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{company.website}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{company.employeeCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(company.subscription.plan)}>
                          {company.subscription.plan}
                        </Badge>
                      </TableCell>
                                             <TableCell>
                                                   <Badge 
                            className={company.isActive 
                              ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]' 
                              : 'bg-destructive text-white hover:bg-destructive/90'
                            }
                          >
                            {company.isActive ? 'Active' : 'Deactive'}
                          </Badge>
                       </TableCell>
                      <TableCell>
                        {formatDate(company.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleViewCompany(company)}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleViewCompanyUsers(company)}
                            >
                              <Users className="w-4 h-4" />
                              View Users
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleEditCompany(company)}
                            >
                              <Edit className="w-4 h-4" />
                              Edit Company
                            </DropdownMenuItem>
                                                         <DropdownMenuItem
                               className="gap-2"
                               onClick={() => handleToggleCompanyStatus(company)}
                             >
                                                               <Badge 
                                  className={`${
                                    company.isActive 
                                      ? 'bg-[var(--primary)] text-white' 
                                      : 'bg-destructive text-white'
                                  }`}
                                >
                                  {company.isActive ? 'A' : 'D'}
                                </Badge>
                               {company.isActive ? 'Deactivate' : 'Activate'}
                             </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDeleteCompany(company)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                                             </TableCell>
                     </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Details Dialog */}
      {selectedCompany && (
        <Dialog open={showCompanyDetails} onOpenChange={setShowCompanyDetails}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{selectedCompany.name}</DialogTitle>
                  <DialogDescription className="text-sm">
                    Company Code: {selectedCompany.code} • {selectedCompany.industry || 'Industry not specified'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Details
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users ({companyUsers.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                {/* Company Overview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Company Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                            <p className="text-sm font-semibold">{selectedCompany.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <Mail className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-sm font-semibold">{selectedCompany.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <Phone className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <p className="text-sm font-semibold">{selectedCompany.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <ExternalLink className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Website</label>
                            <p className="text-sm font-semibold">
                              {selectedCompany.website ? (
                                <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {selectedCompany.website}
                                </a>
                              ) : (
                                'Not provided'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Company Code</label>
                            <p className="text-sm font-semibold">{selectedCompany.code}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-50 rounded-lg">
                            <Building2 className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Industry</label>
                            <p className="text-sm font-semibold">{selectedCompany.industry || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-50 rounded-lg">
                            <Badge variant={getPlanBadgeVariant(selectedCompany.subscription.plan)}>
                              {selectedCompany.subscription.plan}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Subscription Plan</label>
                            <p className="text-sm font-semibold capitalize">{selectedCompany.subscription.plan}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg">
                                                  <Badge 
                        className={selectedCompany.isActive 
                          ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]' 
                          : 'bg-destructive text-white hover:bg-destructive/90'
                        }
                      >
                        {selectedCompany.isActive ? 'Active' : 'Deactive'}
                      </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                            <p className="text-sm font-semibold">{selectedCompany.isActive ? 'Active' : 'Inactive'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Address Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                        <p className="text-sm font-semibold mt-1">
                          {selectedCompany.address.street}, {selectedCompany.address.city}, {selectedCompany.address.state} {selectedCompany.address.zipCode}, {selectedCompany.address.country}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Timestamps Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Timestamps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Created</label>
                          <p className="text-sm font-semibold">{formatDate(selectedCompany.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                          <p className="text-sm font-semibold">{formatDate(selectedCompany.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                {isLoadingUsers ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : companyUsers.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        No users have been registered for this company yet. Users will appear here once they register or are added by an admin.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Company Users ({companyUsers.length})
                      </CardTitle>
                      <CardDescription>
                        All registered users for {selectedCompany.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Employee ID</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {companyUsers.map((user) => (
                              <TableRow key={user._id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="text-sm font-medium text-primary">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                                      <p className="text-xs text-muted-foreground">{user.department || 'No department'}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{user.email}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={user.role === 'admin' ? 'default' : user.role === 'super_admin' ? 'secondary' : 'outline'}
                                    className="capitalize"
                                  >
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                                                     <Badge 
                                     variant={user.status === 'active' ? 'default' : 'secondary'}
                                     className={user.status === 'active' ? 'bg-[var(--primary)] text-white' : 'bg-muted text-muted-foreground'}
                                   >
                                     {user.status}
                                   </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm font-mono">{user.employeeId || 'N/A'}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Company Registration Dialog */}
      {showRegistration && (
        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Company</DialogTitle>
              <DialogDescription>
                Register a new company and create an admin account for them
              </DialogDescription>
            </DialogHeader>
            <CompanyRegistration onSuccess={handleRegistrationSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
