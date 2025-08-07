import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  Plus,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Activity,
  Building2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { ApprovalList } from "@/components/ui/approval-list";
import { AttendanceOverview } from "@/components/ui/attendance-overview";
import { DashboardLayout } from "@/components/ui/dashboard-layout";

// Function to get dynamic greeting based on IST time
const getGreeting = () => {
  const nowIST = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });

  const hour = parseInt(nowIST, 10);

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

interface AdminStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayroll: number;
  attendanceRate: number;
  absentCount: number;
  lateCount: number;
  recentActivities: Array<{
    action: string;
    time: string;
    type: 'attendance' | 'leave' | 'task' | 'employee' | 'system';
  }>;
  pendingApprovals: Array<{
    name: string;
    type: string;
    duration?: string;
    date: string;
    status?: string;
  }>;
}

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user has companyId
      const companyId = user?.companyId || user?.company?._id;
      if (!companyId) {
        console.error("No company ID found for user:", user);
        setError("User company information not found");
        setLoading(false);
        return;
      }

      // Fetch real data from server
      const [attendanceResponse, leaveResponse, employeeResponse, activityResponse] = await Promise.all([
        apiClient.getAttendanceSummary(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]),
        apiClient.getLeaveRequests({ status: 'pending', limit: 5 }),
        apiClient.getEmployeesByCompany(companyId),
        apiClient.getActivityAnalytics('7d')
      ]);

      // Process attendance data
      const attendanceData = attendanceResponse.success ? attendanceResponse.data : null;
      const totalEmployees = employeeResponse.success ? employeeResponse.data?.length || 0 : 0;
      const presentToday = attendanceData?.presentCount || 0;
      const absentCount = attendanceData?.absentCount || 0;
      const lateCount = attendanceData?.lateCount || 0;
      const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;

      // Process leave data
      const pendingLeaves = leaveResponse.success ? leaveResponse.data?.length || 0 : 0;
      const pendingApprovals = leaveResponse.success && leaveResponse.data 
        ? leaveResponse.data.map(leave => ({
            name: `${leave.employee?.firstName || ''} ${leave.employee?.lastName || ''}`,
            type: leave.leaveType || 'Leave Request',
            duration: `${leave.days || 0} days`,
            date: new Date(leave.startDate).toLocaleDateString('en-US', {
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            status: leave.status
          }))
        : [];

      // Process activity data
      const recentActivities = activityResponse.success && activityResponse.data?.recentActivities 
        ? activityResponse.data.recentActivities.slice(0, 5).map(activity => ({
            action: activity.action,
            time: new Date(activity.timestamp).toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            type: activity.type as 'attendance' | 'leave' | 'task' | 'employee' | 'system'
          }))
        : [
            {
              action: "System initialized",
              time: new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'system' as const
            }
          ];

      // Calculate monthly payroll (mock calculation)
      const monthlyPayroll = totalEmployees * 50000; // Average salary per employee

      setStats({
        totalEmployees,
        presentToday,
        pendingLeaves,
        monthlyPayroll,
        attendanceRate,
        absentCount,
        lateCount,
        recentActivities,
        pendingApprovals
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Set fallback data
      setStats({
        totalEmployees: 85,
        presentToday: 78,
        pendingLeaves: 12,
        monthlyPayroll: 4250000,
        attendanceRate: 91.8,
        absentCount: 4,
        lateCount: 3,
        recentActivities: [
          { action: "John Doe punched in", time: "9:05 AM", type: "attendance" },
          { action: "Sarah Wilson applied for leave", time: "8:45 AM", type: "leave" },
          { action: "Mike Johnson completed project", time: "Yesterday", type: "task" },
          { action: "New employee onboarded", time: "2 days ago", type: "employee" },
        ],
        pendingApprovals: [
          { name: "Sarah Wilson", type: "Sick Leave", duration: "2 days", date: "Jan 25-26" },
          { name: "Mike Johnson", type: "Vacation", duration: "5 days", date: "Feb 1-5" },
          { name: "Emma Davis", type: "Personal", duration: "1 day", date: "Jan 30" },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleApproveLeave = async (index: number) => {
    try {
      // In a real implementation, you would get the actual leave ID
      const leaveId = `leave-${index}`;
      await apiClient.updateLeaveStatus(leaveId, 'approved', 'Approved by admin');
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (index: number) => {
    try {
      // In a real implementation, you would get the actual leave ID
      const leaveId = `leave-${index}`;
      await apiClient.updateLeaveStatus(leaveId, 'rejected', 'Rejected by admin');
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stats cards
  const statsCards = (
    <>
      <StatCard
        title="Total Employees"
        value={stats?.totalEmployees || 0}
        change={`+${Math.floor(Math.random() * 5) + 1} this month`}
        icon={Users}
        color="text-blue-600"
        trend="up"
        loading={loading}
      />
      <StatCard
        title="Present Today"
        value={stats?.presentToday || 0}
        change={`${stats?.attendanceRate.toFixed(1) || 0}% attendance`}
        icon={UserCheck}
        color="text-green-600"
        trend={stats?.attendanceRate && stats.attendanceRate > 90 ? "up" : "neutral"}
        loading={loading}
      />
      <StatCard
        title="Pending Leaves"
        value={stats?.pendingLeaves || 0}
        change="Needs approval"
        icon={Calendar}
        color="text-orange-600"
        trend="neutral"
        loading={loading}
      />
      <StatCard
        title="Monthly Payroll"
        value={formatCurrency(stats?.monthlyPayroll || 0)}
        change="Processing"
        icon={DollarSign}
        color="text-purple-600"
        trend="up"
        loading={loading}
      />
    </>
  );

  // Main content
  const mainContent = (
    <AttendanceOverview
      totalEmployees={stats?.totalEmployees || 0}
      presentCount={stats?.presentToday || 0}
      absentCount={stats?.absentCount || 0}
      lateCount={stats?.lateCount || 0}
      attendanceRate={stats?.attendanceRate || 0}
      loading={loading}
    />
  );

  // Sidebar content
  const sidebarContent = (
    <ApprovalList
      approvals={stats?.pendingApprovals || []}
      loading={loading}
      onApprove={handleApproveLeave}
      onReject={handleRejectLeave}
    />
  );

  // Additional content
  const additionalContent = (
    <ActivityFeed
      activities={stats?.recentActivities || []}
      loading={loading}
    />
  );

  return (
    <DashboardLayout
      title="Admin Dashboard"
      greeting={getGreeting()}
      subtitle={`Welcome back, ${user?.name || 'Admin'} — Here's what's happening today`}
      currentTime={currentTime}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      primaryAction={{
        label: "Add Employee",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => console.log("Add Employee clicked")
      }}
      stats={statsCards}
      mainContent={mainContent}
      sidebar={sidebarContent}
      error={error}
      onRetry={fetchDashboardData}
      loading={loading}
    >
      {additionalContent}
    </DashboardLayout>
  );
};
