import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, User, Users, FileText, BarChart3, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { LeaveSummary, LeaveRequest } from "@/types/leave";

export const LeaveDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current month dates
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // Fetch leave summary
      const summaryResponse = await apiClient.getLeaveSummary(startDate, endDate);
      if (summaryResponse.success) {
        setSummary(summaryResponse.data);
      }

      // Fetch recent leave requests (last 5)
      const requestsResponse = await apiClient.getLeaveRequests({
        startDate,
        endDate,
      });
      if (requestsResponse.success) {
        setRecentRequests(requestsResponse.data.slice(0, 5));
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const badgeStyles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
      cancelled: "bg-gray-100 text-gray-800 border border-gray-200",
    };

    const style = badgeStyles[status as keyof typeof badgeStyles] || "bg-gray-100 text-gray-800 border border-gray-200";

    return (
      <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${style}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLeaveTypeBadge = (leaveType: string) => {
    const colors: Record<string, string> = {
      paid: "bg-[#843C6D]/10 text-[#843C6D]",
      casual: "bg-green-100 text-green-800",
      short: "bg-yellow-100 text-yellow-800",
      sick: "bg-red-100 text-red-800",
      halfday: "bg-purple-100 text-purple-800",
    };

    return (
      <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${colors[leaveType] || "bg-gray-100 text-gray-800"}`}>
        {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
      </span>
    );
  };

  const getLeaveTypeColor = (leaveType: string) => {
    const colors: Record<string, string> = {
      paid: "bg-[#843C6D]",
      casual: "bg-green-500",
      short: "bg-yellow-500",
      sick: "bg-red-500",
      halfday: "bg-purple-500",
    };

    return colors[leaveType] || "bg-gray-500";
  };

  const getLeaveTypeBackground = (leaveType: string) => {
    const backgrounds: Record<string, string> = {
      paid: "bg-[#843C6D]/5",
      casual: "bg-green-50",
      short: "bg-yellow-50",
      sick: "bg-red-50",
      halfday: "bg-purple-50",
    };

    return backgrounds[leaveType] || "bg-gray-50";
  };

  const getLeaveTypeHover = (leaveType: string) => {
    const hovers: Record<string, string> = {
      paid: "hover:bg-[#843C6D]/10",
      casual: "hover:bg-green-100",
      short: "hover:bg-yellow-100",
      sick: "hover:bg-red-100",
      halfday: "hover:bg-purple-100",
    };

    return hovers[leaveType] || "hover:bg-gray-100";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      { bg: 'bg-[#843C6D]/20', text: 'text-[#843C6D]' },
      { bg: 'bg-green-500/20', text: 'text-green-700' },
      { bg: 'bg-purple-500/20', text: 'text-purple-700' },
      { bg: 'bg-red-500/20', text: 'text-red-700' },
      { bg: 'bg-indigo-500/20', text: 'text-indigo-700' },
      { bg: 'bg-pink-500/20', text: 'text-pink-700' },
      { bg: 'bg-yellow-500/20', text: 'text-yellow-700' },
      { bg: 'bg-teal-500/20', text: 'text-teal-700' },
      { bg: 'bg-orange-500/20', text: 'text-orange-700' },
      { bg: 'bg-cyan-500/20', text: 'text-cyan-700' }
    ];
    
    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
              <Button onClick={fetchDashboardData} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pendingRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.approvedRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalDays || 0}</div>
            <p className="text-xs text-muted-foreground">Days taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Distribution and Request Status Row */}
      <div className="grid gap-6 lg:grid-cols-2">
                 {/* Leave Distribution */}
         <Card>
           <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#843C6D]/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#843C6D]" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Leave Distribution</CardTitle>
                <CardDescription className="text-sm text-gray-600">Breakdown by leave type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                             {/* First Row - 3 cards */}
               <div className="grid grid-cols-3 gap-3">
                                   {summary?.leaveTypeBreakdown && Object.entries(summary.leaveTypeBreakdown).slice(0, 3).map(([type, count]) => (
                    <div key={type} className={`flex flex-col items-center p-4 rounded-lg transition-colors ${getLeaveTypeBackground(type)} ${getLeaveTypeHover(type)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getLeaveTypeColor(type)}`}></div>
                        <span className="text-sm font-medium capitalize text-gray-700">{type}</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {summary?.totalRequests ? Math.round((count / summary.totalRequests) * 100) : 0}%
                        </Badge>
                      </div>
                    </div>
                  ))}
               </div>
               
               {/* Second Row - 2 cards */}
               {summary?.leaveTypeBreakdown && Object.entries(summary.leaveTypeBreakdown).length > 3 && (
                 <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                                       {Object.entries(summary.leaveTypeBreakdown).slice(3, 5).map(([type, count]) => (
                      <div key={type} className={`flex flex-col items-center p-4 rounded-lg transition-colors ${getLeaveTypeBackground(type)} ${getLeaveTypeHover(type)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getLeaveTypeColor(type)}`}></div>
                          <span className="text-sm font-medium capitalize text-gray-700">{type}</span>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {summary?.totalRequests ? Math.round((count / summary.totalRequests) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
              
              {(!summary?.leaveTypeBreakdown || Object.keys(summary.leaveTypeBreakdown).length === 0) && (
                <div className="text-center py-6 text-gray-500">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No leave data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

                 {/* Request Status */}
         <Card>
           <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Request Status</CardTitle>
                <CardDescription className="text-sm text-gray-600">Current request statuses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
                             <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                 <div className="flex items-center gap-2 mb-2">
                   <Clock className="w-4 h-4 text-yellow-600" />
                   <span className="text-sm font-medium text-gray-700">Pending</span>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-gray-900">{summary?.pendingRequests || 0}</div>
                   <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs mt-1">Awaiting</Badge>
                 </div>
               </div>
               
               <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                 <div className="flex items-center gap-2 mb-2">
                   <CheckCircle className="w-4 h-4 text-green-600" />
                   <span className="text-sm font-medium text-gray-700">Approved</span>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-gray-900">{summary?.approvedRequests || 0}</div>
                   <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs mt-1">Completed</Badge>
                 </div>
               </div>
               
               <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                 <div className="flex items-center gap-2 mb-2">
                   <XCircle className="w-4 h-4 text-red-600" />
                   <span className="text-sm font-medium text-gray-700">Rejected</span>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-gray-900">{summary?.rejectedRequests || 0}</div>
                   <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs mt-1">Declined</Badge>
                 </div>
               </div>
               
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                 <div className="flex items-center gap-2 mb-2">
                   <FileText className="w-4 h-4 text-gray-600" />
                   <span className="text-sm font-medium text-gray-700">Cancelled</span>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-gray-900">{summary?.cancelledRequests || 0}</div>
                   <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs mt-1">Withdrawn</Badge>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
          <CardDescription>Latest leave requests from employees</CardDescription>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p>No recent leave requests</p>
            </div>
          ) : (
            <div className="space-y-4">
                             {recentRequests.map((request) => (
                 <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg">
                   <div className="flex items-center space-x-4">
                                           <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${getAvatarColor(request.employee.firstName + request.employee.lastName).bg} ${getAvatarColor(request.employee.firstName + request.employee.lastName).text}`}>
                          {getInitials(request.employee.firstName, request.employee.lastName)}
                        </div>
                      </div>
                     <div>
                       <p className="font-medium">
                         {request.employee.firstName} {request.employee.lastName}
                       </p>
                       <p className="text-sm text-muted-foreground">
                         {request.employee.employeeId} • {request.employee.department || "No Department"}
                       </p>
                       <p className="text-sm text-muted-foreground">
                         {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.days} days)
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2">
                     {getLeaveTypeBadge(request.leaveType)}
                     {getStatusBadge(request.status)}
                   </div>
                 </div>
               ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 