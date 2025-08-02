import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, Clock, CheckCircle, XCircle, User, Users, 
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

interface TodaysAttendance {
  _id: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  workingHours: number;
  overtime: number;
}

export const AttendanceDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [todaysAttendance, setTodaysAttendance] = useState<TodaysAttendance | null>(null);
  const [regularizationRequests, setRegularizationRequests] = useState<RegularizationRequest[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestDate, setRequestDate] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
          updatedAt: new Date().toISOString()
        }
      ];
      setRegularizationRequests(mockRequests);
    } catch (err) {
      console.error("Error fetching regularization requests:", err);
    }
  };

  const handleSubmitRequest = async () => {
    if (!requestDate || !requestReason) {
      setRequestError("Please fill in all required fields");
      return;
    }

    setRequestLoading(true);
    setRequestError(null);
    setSuccess(null);

    try {
      // Submit regularization request to backend
      const requestData = {
        employeeId: user?._id, // Assuming admin can submit for themselves
        date: requestDate,
        reason: requestReason
      };

      const response = await apiClient.createRegularizationRequest(requestData);

      if (response.success) {
        setSuccess("Request submitted successfully!");
        setRequestDate("");
        setRequestReason("");
        setShowRequestForm(false);
        // Refresh requests list
        fetchRegularizationRequests();
      } else {
        setRequestError(response.message || "Failed to submit request");
      }
    } catch (err) {
      setRequestError("Failed to submit request");
      console.error("Error submitting request:", err);
    } finally {
      setRequestLoading(false);
    }
  };

  const getStatusCount = (status: string) => {
    if (!summary) return 0;
    const statusItem = summary.statusSummary.find(item => item._id === status);
    return statusItem ? statusItem.count : 0;
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
      {/* Today's Status */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Status</CardTitle>
          <CardDescription>Your attendance status for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {todaysAttendance?.checkIn ? (
                <CheckCircle className="w-10 h-10 text-success" />
              ) : (
                <XCircle className="w-10 h-10 text-muted-foreground" />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {todaysAttendance?.checkIn ? "Checked In" : "Not Checked In"}
                </h3>
                {todaysAttendance?.checkIn && (
                  <p className="text-muted-foreground">
                    Checked in at {new Date(todaysAttendance.checkIn).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              {todaysAttendance?.checkOut ? (
                <Badge className="bg-success">Checked Out</Badge>
              ) : todaysAttendance?.checkIn ? (
                <Badge className="bg-warning">In Progress</Badge>
              ) : (
                <Badge variant="destructive">Not Checked In</Badge>
              )}
              {todaysAttendance?.workingHours > 0 && (
                <p className="mt-2 text-sm">
                  Working Hours: {todaysAttendance.workingHours.toFixed(2)}h
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Attendance Regularization Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Regularization Requests</CardTitle>
          <CardDescription>Manage and view attendance regularization requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recent Requests</h3>
            <Button onClick={() => setShowRequestForm(!showRequestForm)}>
              <FileText className="w-4 h-4 mr-2" />
              {showRequestForm ? "Cancel" : "New Request"}
            </Button>
          </div>

          {showRequestForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>New Regularization Request</CardTitle>
                <CardDescription>Submit a request for attendance regularization</CardDescription>
              </CardHeader>
              <CardContent>
                {requestError && (
                  <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
                    {requestError}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-success/10 text-success rounded-md">
                    {success}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="requestDate">Date</Label>
                    <Input
                      id="requestDate"
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requestReason">Reason</Label>
                    <Textarea
                      id="requestReason"
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="Enter reason for regularization request"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitRequest} disabled={requestLoading}>
                      {requestLoading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {regularizationRequests.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Reason</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Requested At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularizationRequests.map((request) => (
                      <tr key={request._id} className="border-t hover:bg-muted/50">
                        <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                        <td className="p-3">{request.reason}</td>
                        <td className="p-3">
                          <Badge 
                            variant={
                              request.status === "approved" ? "default" :
                              request.status === "rejected" ? "destructive" : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
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
                <p className="text-sm text-muted-foreground mt-1">
                  Submit a new request using the "New Request" button
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
