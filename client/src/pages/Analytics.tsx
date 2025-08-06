import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Activity,
  Calendar,
  DollarSign,
  Clock,
  Globe,
  Database,
  Server,
  Zap,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  BarChart,
  PieChart,
  LineChart,
  Target,
  Award,
  TrendingUpIcon,
  TrendingDownIcon,
  Minus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

interface AnalyticsData {
  overview: {
    totalCompanies: number;
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    growthRate: number;
  };
  userAnalytics: {
    usersByRole: Array<{ role: string; count: number }>;
    usersByDepartment: Array<{ department: string; count: number }>;
    usersByCompany: Array<{ company: string; count: number }>;
    newUsersThisMonth: number;
    activeUsersThisWeek: number;
  };
  companyAnalytics: {
    companiesByPlan: Array<{ plan: string; count: number }>;
    companiesByStatus: Array<{ status: string; count: number }>;
    newCompaniesThisMonth: number;
    revenueByPlan: Array<{ plan: string; revenue: number }>;
  };
  systemAnalytics: {
    performance: {
      avgResponseTime: number;
      uptime: number;
      errorRate: number;
      activeConnections: number;
    };
    usage: {
      cpuUsage: number;
      memoryUsage: number;
      diskUsage: number;
      networkUsage: number;
    };
    trends: Array<{
      date: string;
      users: number;
      companies: number;
      revenue: number;
    }>;
  };
  activityAnalytics: {
    recentActivities: Array<{
      action: string;
      timestamp: string;
      type: string;
      user: string;
    }>;
    topActions: Array<{ action: string; count: number }>;
    peakUsageHours: Array<{ hour: number; users: number }>;
  };
}

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overview, userAnalytics, companyAnalytics, systemAnalytics, activityAnalytics] = await Promise.all([
        apiClient.getAnalyticsOverview(timeRange),
        apiClient.getUserAnalytics(timeRange),
        apiClient.getCompanyAnalytics(timeRange),
        apiClient.getSystemAnalytics(timeRange),
        apiClient.getActivityAnalytics(timeRange),
      ]);

      const combinedData: AnalyticsData = {
        overview: overview.success ? overview.data : {
          totalCompanies: 0,
          totalUsers: 0,
          activeUsers: 0,
          totalRevenue: 0,
          growthRate: 0,
        },
        userAnalytics: userAnalytics.success ? userAnalytics.data : {
          usersByRole: [],
          usersByDepartment: [],
          usersByCompany: [],
          newUsersThisMonth: 0,
          activeUsersThisWeek: 0,
        },
        companyAnalytics: companyAnalytics.success ? companyAnalytics.data : {
          companiesByPlan: [],
          companiesByStatus: [],
          newCompaniesThisMonth: 0,
          revenueByPlan: [],
        },
        systemAnalytics: systemAnalytics.success ? systemAnalytics.data : {
          performance: {
            avgResponseTime: 0,
            uptime: 0,
            errorRate: 0,
            activeConnections: 0,
          },
          usage: {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            networkUsage: 0,
          },
          trends: [],
        },
        activityAnalytics: activityAnalytics.success ? activityAnalytics.data : {
          recentActivities: [],
          topActions: [],
          peakUsageHours: [],
        },
      };

      setData(combinedData);
    } catch (err: any) {
      console.error("Error fetching analytics data:", err);
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, refreshKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (rate < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return "text-red-500";
    if (value >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if the error is due to insufficient permissions
    const isPermissionError = error.includes('Super admin access required') || 
                             error.includes('Failed to fetch analytics') ||
                             error.includes('403') ||
                             error.includes('401');
    
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600">
            {isPermissionError ? 'Access Restricted' : 'Error Loading Analytics'}
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {isPermissionError 
              ? 'Analytics dashboard requires super admin privileges. Please log in with super admin credentials to access this feature.'
              : error
            }
          </p>
          {isPermissionError && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700 font-medium">Super Admin Credentials:</p>
              <p className="text-xs text-blue-600">Email: admin@othtech.com</p>
              <p className="text-xs text-blue-600">Password: admin@123</p>
            </div>
          )}
          <Button onClick={() => setRefreshKey(prev => prev + 1)} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={() => setRefreshKey(prev => prev + 1)} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.overview.totalCompanies || 0)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getGrowthIcon(data?.overview.growthRate || 0)}
              <span>{Math.abs(data?.overview.growthRate || 0)}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.overview.totalUsers || 0)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getGrowthIcon(data?.overview.growthRate || 0)}
              <span>{Math.abs(data?.overview.growthRate || 0)}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data?.overview.activeUsers || 0)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>This week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.overview.totalRevenue || 0)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getGrowthIcon(data?.overview.growthRate || 0)}
              <span>{Math.abs(data?.overview.growthRate || 0)}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>{data?.systemAnalytics.performance.uptime || 0}% uptime</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Analytics */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Analytics
            </CardTitle>
            <CardDescription>
              User distribution and activity metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">New Users (This Month)</div>
                  <div className="text-2xl font-bold">{formatNumber(data?.userAnalytics.newUsersThisMonth || 0)}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Active Users (This Week)</div>
                  <div className="text-2xl font-bold">{formatNumber(data?.userAnalytics.activeUsersThisWeek || 0)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Users by Role</h4>
                <div className="space-y-2">
                  {data?.userAnalytics.usersByRole.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.role}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Analytics */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Analytics
            </CardTitle>
            <CardDescription>
              Company distribution and revenue metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">New Companies (This Month)</div>
                  <div className="text-2xl font-bold">{formatNumber(data?.companyAnalytics.newCompaniesThisMonth || 0)}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-2xl font-bold">{formatCurrency(data?.overview.totalRevenue || 0)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Companies by Plan</h4>
                <div className="space-y-2">
                  {data?.companyAnalytics.companiesByPlan.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{item.plan}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Performance
            </CardTitle>
            <CardDescription>
              Real-time system metrics and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  <div className="text-2xl font-bold">{data?.systemAnalytics.performance.avgResponseTime || 0}ms</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Uptime</div>
                  <div className="text-2xl font-bold text-green-600">{data?.systemAnalytics.performance.uptime || 0}%</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Resource Usage</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">CPU Usage</span>
                      <span className={`text-sm font-medium ${getHealthColor(data?.systemAnalytics.usage.cpuUsage || 0)}`}>
                        {data?.systemAnalytics.usage.cpuUsage || 0}%
                      </span>
                    </div>
                    <Progress value={data?.systemAnalytics.usage.cpuUsage || 0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Memory Usage</span>
                      <span className={`text-sm font-medium ${getHealthColor(data?.systemAnalytics.usage.memoryUsage || 0)}`}>
                        {data?.systemAnalytics.usage.memoryUsage || 0}%
                      </span>
                    </div>
                    <Progress value={data?.systemAnalytics.usage.memoryUsage || 0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Disk Usage</span>
                      <span className={`text-sm font-medium ${getHealthColor(data?.systemAnalytics.usage.diskUsage || 0)}`}>
                        {data?.systemAnalytics.usage.diskUsage || 0}%
                      </span>
                    </div>
                    <Progress value={data?.systemAnalytics.usage.diskUsage || 0} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest system activities and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.activityAnalytics.recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends and Charts Placeholder */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Trends
          </CardTitle>
          <CardDescription>
            Platform growth and usage trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Chart visualization coming soon</p>
              <p className="text-sm">Real-time trend data will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 