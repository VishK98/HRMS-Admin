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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MapPin,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

interface ComprehensiveAnalyticsData {
  trends: Array<{
    date: string;
    newUsers: number;
    newCompanies: number;
    activeUsers: number;
    leaveRequests: number;
    attendanceCheckins: number;
    revenue: number;
  }>;
  geographicData: {
    usersByLocation: Array<{
      location: string;
      userCount: number;
      companyCount: number;
    }>;
    totalLocations: number;
  };
  performanceMetrics: {
    system: {
      cpuUsage: number;
      memoryUsage: number;
      diskUsage: number;
      networkUsage: number;
      uptime: number;
    };
    responseTime: {
      average: number;
      p95: number;
      p99: number;
      min: number;
      max: number;
    };
    throughput: {
      requestsPerSecond: number;
      concurrentUsers: number;
      peakConcurrentUsers: number;
      averageSessionDuration: number;
    };
  };
  engagementMetrics: {
    dailyActiveUsers: Array<{
      date: string;
      count: number;
    }>;
    retentionRates: {
      weekly: number;
      monthly: number;
    };
    featureUsage: {
      leaveRequests: number;
      attendanceCheckins: number;
    };
    totalUsers: number;
    activeUsersThisWeek: number;
    activeUsersThisMonth: number;
  };
  revenueAnalytics: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    revenueGrowth: number;
    averageRevenuePerUser: number;
    revenueByPlan: Array<{
      plan: string;
      count: number;
      revenue: number;
    }>;
    planPricing: Record<string, number>;
  };
  systemHealth: {
    overallScore: number;
    status: string;
    metrics: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
      uptime: number;
    };
    alerts: string[];
  };
  securityAnalytics: {
    securityScore: number;
    failedLogins: number;
    suspiciousActivities: Array<{
      type: string;
      count: number;
    }>;
    lastSecurityScan: string;
    recommendations: string[];
  };
  lastUpdated: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<ComprehensiveAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getComprehensiveAnalytics(timeRange);
      if (response.success && response.data) {
        setData(response.data as ComprehensiveAnalyticsData);
      } else {
        throw new Error(response.message || "Failed to fetch analytics data");
      }
    } catch (err: unknown) {
      console.error("Error fetching analytics data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics data";
      setError(errorMessage);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'fair': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading comprehensive analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Data Available</h3>
          <p className="text-sm text-gray-500 mt-2">Analytics data is not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Comprehensive Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Real-time insights and performance metrics for platform management
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
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
            <option value="5y">Last 5 years</option>
            <option value="10y">Last 10 years</option>
            <option value="all">All time</option>
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

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenueAnalytics.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getGrowthIcon(data.revenueAnalytics.revenueGrowth)}
              <span>{Math.abs(data.revenueAnalytics.revenueGrowth)}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.engagementMetrics.activeUsersThisWeek)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>This week • {Math.round(data.engagementMetrics.retentionRates.weekly)}% retention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemHealth.overallScore}%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getStatusIcon(data.systemHealth.status)}
              <span className={getStatusColor(data.systemHealth.status)}>{data.systemHealth.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.securityAnalytics.securityScore}%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>{data.securityAnalytics.failedLogins} failed attempts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Engagement
                </CardTitle>
                <CardDescription>User activity and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Users</div>
                      <div className="text-2xl font-bold">{formatNumber(data.engagementMetrics.totalUsers)}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Active This Month</div>
                      <div className="text-2xl font-bold">{formatNumber(data.engagementMetrics.activeUsersThisMonth)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Retention Rates</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weekly Retention</span>
                        <Badge variant="secondary">{Math.round(data.engagementMetrics.retentionRates.weekly)}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Monthly Retention</span>
                        <Badge variant="secondary">{Math.round(data.engagementMetrics.retentionRates.monthly)}%</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Feature Usage</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Leave Requests</span>
                        <Badge variant="secondary">{formatNumber(data.engagementMetrics.featureUsage.leaveRequests)}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Attendance Check-ins</span>
                        <Badge variant="secondary">{formatNumber(data.engagementMetrics.featureUsage.attendanceCheckins)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>Revenue breakdown and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">MRR</div>
                      <div className="text-2xl font-bold">{formatCurrency(data.revenueAnalytics.monthlyRecurringRevenue)}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">ARPU</div>
                      <div className="text-2xl font-bold">{formatCurrency(data.revenueAnalytics.averageRevenuePerUser)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Revenue by Plan</h4>
                    <div className="space-y-2">
                      {data.revenueAnalytics.revenueByPlan.map((plan, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{plan.plan}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{plan.count}</Badge>
                            <span className="text-sm font-medium">{formatCurrency(plan.revenue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Growth Trends
              </CardTitle>
              <CardDescription>30-day trend analysis of key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">New Users</div>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.trends.reduce((sum, day) => sum + day.newUsers, 0))}
                    </div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">New Companies</div>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.trends.reduce((sum, day) => sum + day.newCompanies, 0))}
                    </div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(data.trends.reduce((sum, day) => sum + day.revenue, 0))}
                    </div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Active Users</div>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.trends.reduce((sum, day) => sum + day.activeUsers, 0))}
                    </div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                </div>

                {/* Trend Chart Placeholder */}
                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive trend charts coming soon</p>
                    <p className="text-sm">Real-time trend visualization will be displayed here</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-medium mb-4">Recent Activity Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Leave Requests</div>
                      <div className="text-xl font-bold">
                        {formatNumber(data.trends.reduce((sum, day) => sum + day.leaveRequests, 0))}
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Attendance Check-ins</div>
                      <div className="text-xl font-bold">
                        {formatNumber(data.trends.reduce((sum, day) => sum + day.attendanceCheckins, 0))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Resource Usage</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">CPU Usage</span>
                          <span className={`text-sm font-medium ${getHealthColor(data.performanceMetrics.system.cpuUsage)}`}>
                            {data.performanceMetrics.system.cpuUsage}%
                          </span>
                        </div>
                        <Progress value={data.performanceMetrics.system.cpuUsage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Memory Usage</span>
                          <span className={`text-sm font-medium ${getHealthColor(data.performanceMetrics.system.memoryUsage)}`}>
                            {data.performanceMetrics.system.memoryUsage}%
                          </span>
                        </div>
                        <Progress value={data.performanceMetrics.system.memoryUsage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Disk Usage</span>
                          <span className={`text-sm font-medium ${getHealthColor(data.performanceMetrics.system.diskUsage)}`}>
                            {data.performanceMetrics.system.diskUsage}%
                          </span>
                        </div>
                        <Progress value={data.performanceMetrics.system.diskUsage} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Response Times</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average</span>
                        <span className="text-sm font-medium">{data.performanceMetrics.responseTime.average}ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">P95</span>
                        <span className="text-sm font-medium">{data.performanceMetrics.responseTime.p95}ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">P99</span>
                        <span className="text-sm font-medium">{data.performanceMetrics.responseTime.p99}ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Throughput Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Throughput Metrics
                </CardTitle>
                <CardDescription>Request handling and user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Requests/sec</div>
                      <div className="text-2xl font-bold">{data.performanceMetrics.throughput.requestsPerSecond}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Concurrent Users</div>
                      <div className="text-2xl font-bold">{data.performanceMetrics.throughput.concurrentUsers}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Session Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Peak Concurrent</span>
                        <span className="text-sm font-medium">{data.performanceMetrics.throughput.peakConcurrentUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Session Duration</span>
                        <span className="text-sm font-medium">{Math.round(data.performanceMetrics.throughput.averageSessionDuration / 60)} min</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">System Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm font-medium text-green-600">{data.performanceMetrics.system.uptime} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Network Usage</span>
                        <span className={`text-sm font-medium ${getHealthColor(data.performanceMetrics.system.networkUsage)}`}>
                          {data.performanceMetrics.system.networkUsage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Analytics
              </CardTitle>
              <CardDescription>Detailed revenue breakdown and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Revenue Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-2xl font-bold">{formatCurrency(data.revenueAnalytics.totalRevenue)}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Monthly Recurring</div>
                    <div className="text-2xl font-bold">{formatCurrency(data.revenueAnalytics.monthlyRecurringRevenue)}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Revenue Growth</div>
                    <div className="text-2xl font-bold">{data.revenueAnalytics.revenueGrowth}%</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">ARPU</div>
                    <div className="text-2xl font-bold">{formatCurrency(data.revenueAnalytics.averageRevenuePerUser)}</div>
                  </div>
                </div>

                {/* Revenue by Plan */}
                <div>
                  <h4 className="font-medium mb-4">Revenue by Subscription Plan</h4>
                  <div className="space-y-3">
                    {data.revenueAnalytics.revenueByPlan.map((plan, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <div className="font-medium capitalize">{plan.plan}</div>
                            <div className="text-sm text-muted-foreground">{plan.count} companies</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(plan.revenue)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(data.revenueAnalytics.planPricing[plan.plan] || 0)}/company
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Chart Placeholder */}
                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Revenue trend charts coming soon</p>
                    <p className="text-sm">Interactive revenue visualization will be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Security Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
                <CardDescription>Security metrics and threat analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Security Score</span>
                      <span className="text-2xl font-bold">{data.securityAnalytics.securityScore}%</span>
                    </div>
                    <Progress value={data.securityAnalytics.securityScore} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Security Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Failed Login Attempts</span>
                        <Badge variant="secondary">{data.securityAnalytics.failedLogins}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Security Scan</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(data.securityAnalytics.lastSecurityScan).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Suspicious Activities</h4>
                    <div className="space-y-2">
                      {data.securityAnalytics.suspiciousActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{activity.type}</span>
                          <Badge variant="outline">{activity.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Recommendations
                </CardTitle>
                <CardDescription>Actionable security improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.securityAnalytics.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>User and company distribution by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Locations</div>
                    <div className="text-2xl font-bold">{data.geographicData.totalLocations}</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Users</div>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.geographicData.usersByLocation.reduce((sum, loc) => sum + loc.userCount, 0))}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Companies</div>
                    <div className="text-2xl font-bold">
                      {formatNumber(data.geographicData.usersByLocation.reduce((sum, loc) => sum + loc.companyCount, 0))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Users by Location</h4>
                  <div className="space-y-3">
                    {data.geographicData.usersByLocation.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{location.location || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">{location.companyCount} companies</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatNumber(location.userCount)} users</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geographic Chart Placeholder */}
                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <p>Geographic visualization coming soon</p>
                    <p className="text-sm">Interactive map and location charts will be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 