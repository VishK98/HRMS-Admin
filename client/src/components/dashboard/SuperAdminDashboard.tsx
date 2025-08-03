import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, Users, DollarSign, TrendingUp, 
  Activity, Plus, MoreHorizontal, ArrowUp, ArrowDown 
} from "lucide-react";
import { CompanyRegistration } from '@/components/companies/CompanyRegistration';
import { CompaniesList } from '@/components/companies/CompaniesList';
import { useAuth } from "@/contexts/AuthContext";

// Function to get dynamic greeting based on IST time
const getGreeting = () => {
  // Get current time in IST (UTC + 5:30)
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5:30 hours for IST
  const hour = istTime.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
};

type DashboardView = 'overview' | 'register-company' | 'companies-list';

const stats = [
  {
    title: "Total Companies",
    value: "24",
    change: "+2 this month",
    trend: "up",
    icon: Building2,
    color: "text-accent"
  },
  {
    title: "Total Employees",
    value: "1,248",
    change: "+48 this month",
    trend: "up",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Monthly Revenue",
    value: "$24,890",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "Last 30 days",
    trend: "stable",
    icon: Activity,
    color: "text-warning"
  }
];

const recentCompanies = [
  { name: "TechCorp Solutions", employees: 85, plan: "Premium", status: "active", joined: "2024-01-15" },
  { name: "Innovate Inc", employees: 42, plan: "Basic", status: "active", joined: "2024-01-12" },
  { name: "Global Dynamics", employees: 156, plan: "Enterprise", status: "active", joined: "2024-01-10" },
  { name: "StartupXYZ", employees: 15, plan: "Basic", status: "trial", joined: "2024-01-08" },
];

export const SuperAdminDashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const { user } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'register-company':
        return <CompanyRegistration />;
      case 'companies-list':
        return <CompaniesList />;
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{getGreeting()}</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('companies-list')}
                >
                  View Companies
                </Button>
                <Button 
                  variant="gradient" 
                  className="gap-2"
                  onClick={() => setCurrentView('register-company')}
                >
                  <Plus className="w-4 h-4" />
                  Add Company
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      {stat.trend === "up" && <ArrowUp className="w-3 h-3 text-success" />}
                      {stat.trend === "down" && <ArrowDown className="w-3 h-3 text-destructive" />}
                      <span>{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Companies */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Companies</CardTitle>
                      <CardDescription>Latest company registrations</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentView('companies-list')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCompanies.map((company) => (
                      <div key={company.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.employees} employees</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={company.status === 'active' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {company.status}
                          </Badge>
                          <Badge variant="outline">{company.plan}</Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions & System Status */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => setCurrentView('register-company')}
                    >
                      <Building2 className="w-4 h-4" />
                      Add New Company
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => setCurrentView('companies-list')}
                    >
                      <Users className="w-4 h-4" />
                      Manage Companies
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <DollarSign className="w-4 h-4" />
                      View Billing
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Analytics Report
                    </Button>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Platform health overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-success text-success-foreground">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <Badge className="bg-success text-success-foreground">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage</span>
                      <Badge className="bg-warning text-warning-foreground">85% Full</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup</span>
                      <Badge className="bg-success text-success-foreground">Updated</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {currentView !== 'overview' && (
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('overview')}
          >
            ← Back to Dashboard
          </Button>
          {currentView === 'register-company' && (
            <h1 className="text-2xl font-bold">Register New Company</h1>
          )}
          {currentView === 'companies-list' && (
            <h1 className="text-2xl font-bold">Manage Companies</h1>
          )}
        </div>
      )}
      
      {renderView()}
    </div>
  );
};