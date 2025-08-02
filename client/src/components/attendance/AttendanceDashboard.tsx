import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, User, Users, 
  FileText, Clock as ClockIcon, AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { RegularizationRequest } from "@/types/regularization";

interface AttendanceSummary {
  statusSummary: {
    _id: string;
    count: number;
  }[];
  totals: {
    totalWorkingHours: number;
    totalOvertime: number;
  };
}

export const AttendanceDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [regularizationRequests, setRegularizationRequests] = useState<RegularizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchRegularizationRequests();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch attendance summary for the current month
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1, 0);
      
      const summaryResponse = await apiClient.request<AttendanceSummary>(
        `/attendance/summary?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      if (summaryResponse.success) {
        setSummary(summaryResponse.data!);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegularizationRequests = async () => {
    try {
      // For admin dashboard, we might want to show all requests for the company
      // or just the requests for the current admin user if they are also an employee
      // For now, we'll use mock data since we don't have a specific endpoint for this
      // In a real implementation, you would fetch from the API:
      // const response = await apiClient.getCompanyRegularizationRequests(startDate, endDate);
      // setRegularizationRequests(response.data);
      
      // Mock data for demonstration
      const mockRequests: RegularizationRequest[] = [
        {
          _id: "1",
          employee: {
            _id: "emp1",
            firstName: "John",
            lastName: "Doe",
            employeeId: "EMP001"
          },
          date: new Date().toISOString(),
          reason: "Late due to traffic",
          status: "pending",
          requestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reportingManager: {
            _id: "mgr1",
            firstName: "Sarah",
            lastName: "Johnson",
            employeeId: "MGR001"
          },
          managerAction: "pending", // pending, approved, rejected
          managerActionDate: null,
          managerComment: null
        },
        {
          _id: "2",
          employee: {
            _id: "emp2",
            firstName: "Mike",
            lastName: "Wilson",
            employeeId: "EMP002"
          },
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          reason: "Medical appointment",
          status: "approved",
          requestedAt: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
          reportingManager: {
            _id: "mgr1",
            firstName: "Sarah",
            lastName: "Johnson",
            employeeId: "MGR001"
          },
          managerAction: "approved",
          managerActionDate: new Date(Date.now() - 43200000).toISOString(),
          managerComment: "Approved - Valid medical reason"
        },
        {
          _id: "3",
          employee: {
            _id: "emp3",
            firstName: "Lisa",
            lastName: "Brown",
            employeeId: "EMP003"
          },
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          reason: "Personal emergency",
          status: "rejected",
          requestedAt: new Date(Date.now() - 172800000).toISOString(),
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          reportingManager: {
            _id: "mgr2",
            firstName: "David",
            lastName: "Smith",
            employeeId: "MGR002"
          },
          managerAction: "rejected",
          managerActionDate: new Date(Date.now() - 86400000).toISOString(),
          managerComment: "Rejected - No supporting documents provided"
        }
      ];
      setRegularizationRequests(mockRequests);
    } catch (err) {
      console.error("Error fetching regularization requests:", err);
    }
  };

  const getStatusCount = (status: string) => {
    if (!summary) return 0;
    const statusItem = summary.statusSummary.find(item => item._id === status);
    return statusItem ? statusItem.count : 0;
  };

  const getManagerActionBadge = (action: string) => {
    switch (action) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-warning">Pending</Badge>;
      default:
        return <Badge variant="outline">Not Reviewed</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("present")}</div>
            <p className="text-xs text-muted-foreground">Employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("absent")}</div>
            <p className="text-xs text-muted-foreground">Employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("late")}</div>
            <p className="text-xs text-muted-foreground">Employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Half Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("half_day")}</div>
            <p className="text-xs text-muted-foreground">Employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Short Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusCount("short_leave")}</div>
            <p className="text-xs text-muted-foreground">Employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Regularization Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Regularization Requests</CardTitle>
          <CardDescription>View attendance regularization requests and manager actions (manager actions are handled via mobile app)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Requests</h3>
          </div>

          {regularizationRequests.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Employee</th>
                      <th className="p-3 text-left font-medium">Reason</th>
                      <th className="p-3 text-left font-medium">Reporting Manager</th>
                      <th className="p-3 text-left font-medium">Manager Action</th>
                      <th className="p-3 text-left font-medium">Manager Comment</th>
                      <th className="p-3 text-left font-medium">Requested At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularizationRequests.map((request) => (
                      <tr key={request._id} className="border-t hover:bg-muted/50">
                        <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          {request.employee.firstName} {request.employee.lastName}
                          <br />
                          <span className="text-xs text-muted-foreground">{request.employee.employeeId}</span>
                        </td>
                        <td className="p-3">{request.reason}</td>
                        <td className="p-3">
                          {request.reportingManager?.firstName} {request.reportingManager?.lastName}
                          <br />
                          <span className="text-xs text-muted-foreground">{request.reportingManager?.employeeId}</span>
                        </td>
                        <td className="p-3">
                          {getManagerActionBadge(request.managerAction || "pending")}
                          {request.managerActionDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(request.managerActionDate).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          {request.managerComment ? (
                            <span className="text-sm">{request.managerComment}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No comment</span>
                          )}
                        </td>
                        <td className="p-3">{new Date(request.requestedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No regularization requests found</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
