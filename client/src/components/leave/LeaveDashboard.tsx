import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, CheckCircle, XCircle, 
  User, Users, TrendingUp, AlertCircle,
  Plus, FileText, BarChart3, PieChart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LeaveSummary {
  totalEmployees: number;
  onLeave: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalLeaveDays: number;
  avgLeaveDays: number;
}

export const LeaveDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<LeaveSummary>({
    totalEmployees: 0,
    onLeave: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalLeaveDays: 0,
    avgLeaveDays: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSummary({
        totalEmployees: 25,
        onLeave: 3,
        pendingRequests: 5,
        approvedRequests: 12,
        rejectedRequests: 2,
        totalLeaveDays: 45,
        avgLeaveDays: 1.8
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const recentLeaveRequests = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      leaveType: "Annual Leave",
      startDate: "2025-08-05",
      endDate: "2025-08-07",
      days: 3,
      status: "pending",
      reason: "Family vacation"
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      leaveType: "Sick Leave",
      startDate: "2025-08-03",
      endDate: "2025-08-03",
      days: 1,
      status: "approved",
      reason: "Medical appointment"
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      leaveType: "Personal Leave",
      startDate: "2025-08-10",
      endDate: "2025-08-12",
      days: 3,
      status: "rejected",
      reason: "Personal emergency"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading leave dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Active employees in company
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently on Leave</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.onLeave}</div>
            <p className="text-xs text-muted-foreground">
              Employees currently on leave
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leave Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.totalLeaveDays}</div>
            <p className="text-xs text-muted-foreground">
              Days taken this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Leave Statistics
            </CardTitle>
            <CardDescription>
              Overview of leave requests and approvals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approved Requests</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">{summary.approvedRequests}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rejected Requests</span>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-red-600">{summary.rejectedRequests}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Leave Days</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-600">{summary.avgLeaveDays}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Leave Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by leave types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Annual Leave</span>
                <Badge variant="secondary">45%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sick Leave</span>
                <Badge variant="secondary">30%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Personal Leave</span>
                <Badge variant="secondary">15%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Other</span>
                <Badge variant="secondary">10%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Recent Leave Requests</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              View All
            </Button>
          </div>
          <CardDescription>
            Latest leave requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeaveRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{request.employeeName}</div>
                    <div className="text-sm text-muted-foreground">{request.employeeId}</div>
                    <div className="text-sm text-muted-foreground">{request.leaveType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{request.days} days</div>
                  <div className="mt-1">{getStatusBadge(request.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 