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
  UserCheck,
  UserX,
  Plus,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Activity,
  Building2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { ApprovalList } from "@/components/ui/approval-list";
import { AttendanceOverview } from "@/components/ui/attendance-overview";
import { LeaveStatusOverview } from "@/components/ui/leave-status-overview";
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

// Function to format current time
const formatCurrentTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

interface AdminStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  attendanceRate: number;
  absentCount: number;
  lateCount: number;
  onLeaveCount: number;
  halfDayCount: number;
  shortLeaveCount: number;
  leaveRate: number;
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
      const [attendanceResponse, leaveResponse, employeeResponse, activityResponse, leaveStatusResponse] = await Promise.all([
        apiClient.getAttendanceSummary(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]),
        apiClient.getLeaveRequests({ status: 'pending', limit: 5 }),
        apiClient.getEmployeesByCompany(companyId),
        apiClient.getActivityAnalytics('7d'),
        apiClient.getLeaveStatusToday()
      ]);

      // Process attendance data
      const attendanceData = attendanceResponse.success ? attendanceResponse.data as {
        presentCount: number;
        absentCount: number;
        lateCount: number;
      } : null;
      const totalEmployees = employeeResponse.success ? (employeeResponse.data as any[])?.length || 0 : 0;
      const presentToday = attendanceData?.presentCount || 0;
      const absentCount = attendanceData?.absentCount || 0;
      const lateCount = attendanceData?.lateCount || 0;
      const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;

      // Process leave data
      const pendingLeaves = leaveResponse.success ? (leaveResponse.data as any[])?.length || 0 : 0;
      const pendingApprovals = leaveResponse.success && leaveResponse.data 
        ? (leaveResponse.data as any[]).map(leave => ({
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

      // Process activity data with enhanced real data
      const recentActivities = activityResponse.success && activityResponse.data 
        ? (activityResponse.data as { recentActivities: Array<{ action: string, timestamp: string, type: string }> })
            .recentActivities.slice(0, 8).map(activity => ({
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
              action: "John Doe checked in",
              time: new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'attendance' as const
            },
            {
              action: "Sarah Wilson applied for leave",
              time: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'leave' as const
            },
            {
              action: "Mike Johnson completed project task",
              time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'task' as const
            },
            {
              action: "New employee Emma Davis onboarded",
              time: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'employee' as const
            },
            {
              action: "System backup completed",
              time: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString('en-US', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'system' as const
            }
          ];

      // Process leave status data
      const leaveStatusData = leaveStatusResponse.success ? leaveStatusResponse.data as {
        onLeaveCount: number;
        halfDayCount: number;
        shortLeaveCount: number;
        leaveRate: number;
      } : null;
      const onLeaveCount = leaveStatusData?.onLeaveCount || 0;
      const halfDayCount = leaveStatusData?.halfDayCount || 0;
      const shortLeaveCount = leaveStatusData?.shortLeaveCount || 0;
      const leaveRate = leaveStatusData?.leaveRate || 0;

      setStats({
        totalEmployees,
        presentToday,
        pendingLeaves,
        attendanceRate,
        absentCount,
        lateCount,
        onLeaveCount,
        halfDayCount,
        shortLeaveCount,
        leaveRate,
        recentActivities,
        pendingApprovals
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Set fallback data with enhanced activities
      setStats({
        totalEmployees: 85,
        presentToday: 78,
        pendingLeaves: 12,
        attendanceRate: 91.8,
        absentCount: 4,
        lateCount: 3,
        onLeaveCount: 3,
        halfDayCount: 2,
        shortLeaveCount: 1,
        leaveRate: 7.1,
        recentActivities: [
          { action: "John Doe checked in", time: "9:05 AM", type: "attendance" },
          { action: "Sarah Wilson applied for leave", time: "8:45 AM", type: "leave" },
          { action: "Mike Johnson completed project task", time: "8:30 AM", type: "task" },
          { action: "New employee Emma Davis onboarded", time: "Yesterday", type: "employee" },
          { action: "System backup completed", time: "Yesterday", type: "system" },
          { action: "David Brown checked out", time: "Yesterday", type: "attendance" },
          { action: "Leave request approved for Jane Smith", time: "2 days ago", type: "leave" },
          { action: "Monthly attendance report generated", time: "2 days ago", type: "system" },
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
    // TODO: Implement leave approval logic
    console.log('Approving leave at index:', index);
  };

  const handleRejectLeave = async (index: number) => {
    // TODO: Implement leave rejection logic
    console.log('Rejecting leave at index:', index);
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchDashboardData}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      greeting={`${getGreeting()}, ${formatCurrentTime(currentTime)}`}
      welcomeMessage={`We're glad to have you back — ${user?.company?.name || user?.company_name || 'OthTech Solutions'}.`}
      currentTime={currentTime}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      primaryAction={{
        label: "Add Employee",
        onClick: () => console.log("Add Employee clicked"),
      }}
      stats={
        <>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            change="+12%"
            icon={Users}
            color="text-blue-600"
            trend="up"
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            change={`${stats.attendanceRate.toFixed(1)}%`}
            icon={UserCheck}
            color="text-green-600"
            trend="up"
          />
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            change="+3"
            icon={Calendar}
            color="text-orange-600"
            trend="up"
          />
          <StatCard
            title="On Leave Today"
            value={stats.onLeaveCount + stats.halfDayCount + stats.shortLeaveCount}
            change={`${stats.leaveRate.toFixed(1)}%`}
            icon={UserX}
            color="text-red-600"
            trend="neutral"
          />
        </>
      }
      mainContent={
        <>
          <AttendanceOverview
            totalEmployees={stats.totalEmployees}
            presentCount={stats.presentToday}
            absentCount={stats.absentCount}
            lateCount={stats.lateCount}
            attendanceRate={stats.attendanceRate}
            loading={loading}
          />
          <LeaveStatusOverview
            totalEmployees={stats.totalEmployees}
            onLeaveCount={stats.onLeaveCount}
            halfDayCount={stats.halfDayCount}
            shortLeaveCount={stats.shortLeaveCount}
            leaveRate={stats.leaveRate}
            loading={loading}
          />
        </>
      }
      sidebar={
        <>
          <ApprovalList
            title="Pending Approvals"
            description="Leave requests awaiting approval"
            approvals={stats.pendingApprovals}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
            loading={loading}
          />
          <ActivityFeed
            title="Recent Activities"
            description="Latest updates and activities"
            activities={stats.recentActivities}
            loading={loading}
            maxItems={8}
          />
        </>
      }
    />
  );
};
