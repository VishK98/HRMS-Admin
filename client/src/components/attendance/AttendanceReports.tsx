import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Search, Download, Filter, BarChart3, PieChart, 
  Table as TableIcon, CalendarDays, FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Employee } from "@/types/employee";
import { RegularizationRequest } from "@/types/regularization";

interface AttendanceRecord {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department: string;
    designation: string;
  };
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  workingHours: number;
  overtime: number;
}

export const AttendanceReports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reportType, setReportType] = useState<"daily" | "monthly" | "custom">("daily");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [regularizationRequests, setRegularizationRequests] = useState<RegularizationRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"table" | "calendar">("table");
  const [showRegularizationTab, setShowRegularizationTab] = useState(false);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setStartDate(formattedToday);
    setEndDate(formattedToday);
    
    if (user?.company?._id) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.request<{ employees: Employee[] }>(
        `/employees/company/${user!.company!._id}`
      );
      
      if (response.success) {
        setEmployees(response.data!.employees);
      }
    } catch (err) {
      setError("Failed to fetch employees");
      console.error("Error fetching employees:", err);
    }
  };

  const fetchAttendanceReports = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = `/attendance/company?startDate=${startDate}&endDate=${endDate}`;
      
      if (selectedEmployee) {
        url += `&employeeId=${selectedEmployee}`;
      }
      
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }

      const response = await apiClient.request<AttendanceRecord[]>(url);
      
      if (response.success) {
        setAttendanceRecords(response.data!);
      } else {
        setError(response.message || "Failed to fetch attendance reports");
      }
    } catch (err) {
      setError("Failed to fetch attendance reports");
      console.error("Error fetching attendance reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegularizationRequests = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = `/regularization/requests/company?startDate=${startDate}&endDate=${endDate}`;
      
      if (selectedEmployee) {
        url += `&employeeId=${selectedEmployee}`;
      }
      
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }

      const response = await apiClient.request<RegularizationRequest[]>(url);
      
      if (response.success) {
        setRegularizationRequests(response.data!);
      } else {
        setError(response.message || "Failed to fetch regularization requests");
      }
    } catch (err) {
      setError("Failed to fetch regularization requests");
      console.error("Error fetching regularization requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleReportTypeChange = (type: "daily" | "monthly" | "custom") => {
    setReportType(type);
    
    const today = new Date();
    
    if (type === "daily") {
      const formattedDate = today.toISOString().split("T")[0];
      setStartDate(formattedDate);
      setEndDate(formattedDate);
    } else if (type === "monthly") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(firstDay.toISOString().split("T")[0]);
      setEndDate(lastDay.toISOString().split("T")[0]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-success">Present</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return <Badge className="bg-warning">Late</Badge>;
      case "half_day":
        return <Badge className="bg-info">Half Day</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRegularizationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-warning">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    let csvContent = "Date,Employee Name,Employee ID,Department,Check In,Check Out,Status,Working Hours,Overtime\n";
    
    attendanceRecords.forEach(record => {
      csvContent += `${record.date},${record.employee.firstName} ${record.employee.lastName},${record.employee.employeeId},${record.employee.department || ""},${record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : ""},${record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : ""},${record.status},${record.workingHours},${record.overtime}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRegularizationToCSV = () => {
    // Create CSV content
    let csvContent = "Date,Employee Name,Employee ID,Department,Reason,Status,Requested At,Approved At,Approved By\n";
    
    regularizationRequests.forEach(request => {
      csvContent += `${request.date},${request.employee.firstName} ${request.employee.lastName},${request.employee.employeeId},${request.employee.department || ""},"${request.reason}",${request.status},${new Date(request.requestedAt).toLocaleString()},${request.approvedAt ? new Date(request.approvedAt).toLocaleString() : ""},${request.approvedBy?.name || ""}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "regularization_requests_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Reports</CardTitle>
          <CardDescription>Generate and view attendance reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Report Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Report Type</Label>
              <div className="flex mt-1">
                <Button
                  variant={reportType === "daily" ? "default" : "outline"}
                  className="rounded-r-none"
                  onClick={() => handleReportTypeChange("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={reportType === "monthly" ? "default" : "outline"}
                  className="rounded-none"
                  onClick={() => handleReportTypeChange("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={reportType === "custom" ? "default" : "outline"}
                  className="rounded-l-none"
                  onClick={() => handleReportTypeChange("custom")}
                >
                  Custom
                </Button>
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                />
              </div>
            </div>
            
            {/* Generate Button */}
            <div className="flex items-end">
              <Button 
                onClick={showRegularizationTab ? fetchRegularizationRequests : fetchAttendanceReports} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="employeeFilter" className="text-sm font-medium">Employee</Label>
              <select
                id="employeeFilter"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
              >
                <option value="">All Employees</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName} ({employee.employeeId})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="statusFilter" className="text-sm font-medium">Status</Label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
              >
                <option value="all">All Statuses</option>
                {showRegularizationTab ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </>
                ) : (
                  <>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half_day">Half Day</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <Button 
                variant={showRegularizationTab ? "default" : "outline"} 
                onClick={() => setShowRegularizationTab(!showRegularizationTab)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showRegularizationTab ? "Attendance Reports" : "Regularization Requests"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report View Toggle */}
      {!showRegularizationTab && attendanceRecords.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={activeView === "table" ? "default" : "outline"}
              onClick={() => setActiveView("table")}
              className="gap-2"
            >
              <TableIcon className="w-4 h-4" />
              Table View
            </Button>
            <Button
              variant={activeView === "calendar" ? "default" : "outline"}
              onClick={() => setActiveView("calendar")}
              className="gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              Calendar View
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {attendanceRecords.length} records
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Report Content */}
      {showRegularizationTab ? (
        /* Regularization Requests View */
        <Card>
          <CardHeader>
            <CardTitle>Regularization Requests</CardTitle>
            <CardDescription>View and manage attendance regularization requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                onClick={exportRegularizationToCSV}
                disabled={regularizationRequests.length === 0}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
            
            {regularizationRequests.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Employee</th>
                        <th className="p-3 text-left font-medium">Employee ID</th>
                        <th className="p-3 text-left font-medium">Department</th>
                        <th className="p-3 text-left font-medium">Reason</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Requested At</th>
                        <th className="p-3 text-left font-medium">Approved By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regularizationRequests.map((request) => (
                        <tr key={request._id} className="border-t hover:bg-muted/50">
                          <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                          <td className="p-3">{request.employee.firstName} {request.employee.lastName}</td>
                          <td className="p-3">{request.employee.employeeId}</td>
                          <td className="p-3">{request.employee.department || "N/A"}</td>
                          <td className="p-3">{request.reason}</td>
                          <td className="p-3">{getRegularizationStatusBadge(request.status)}</td>
                          <td className="p-3">{new Date(request.requestedAt).toLocaleDateString()}</td>
                          <td className="p-3">{request.approvedBy?.name || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : !loading && !error ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Regularization Requests</h3>
                  <p className="mt-2 text-muted-foreground">
                    No regularization requests found for the selected date range.
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : attendanceRecords.length > 0 ? (
        activeView === "table" ? (
          /* Table View */
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Detailed attendance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  onClick={exportToCSV}
                  disabled={attendanceRecords.length === 0}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Employee</th>
                        <th className="p-3 text-left font-medium">Employee ID</th>
                        <th className="p-3 text-left font-medium">Department</th>
                        <th className="p-3 text-left font-medium">Check In</th>
                        <th className="p-3 text-left font-medium">Check Out</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Working Hours</th>
                        <th className="p-3 text-left font-medium">Overtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record) => (
                        <tr key={record._id} className="border-t hover:bg-muted/50">
                          <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="p-3">{record.employee.firstName} {record.employee.lastName}</td>
                          <td className="p-3">{record.employee.employeeId}</td>
                          <td className="p-3">{record.employee.department || "N/A"}</td>
                          <td className="p-3">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"}
                          </td>
                          <td className="p-3">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
                          </td>
                          <td className="p-3">{getStatusBadge(record.status)}</td>
                          <td className="p-3">{record.workingHours.toFixed(2)}h</td>
                          <td className="p-3">{record.overtime.toFixed(2)}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Calendar View */
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Attendance data in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceRecords.map((record) => (
                  <Card key={record._id} className="overflow-hidden">
                    <CardHeader className="bg-muted p-3">
                      <CardTitle className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Employee</span>
                          <span className="text-sm font-medium">
                            {record.employee.firstName} {record.employee.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <span className="text-sm">{getStatusBadge(record.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Check In</span>
                          <span className="text-sm">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Check Out</span>
                          <span className="text-sm">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Working Hours</span>
                          <span className="text-sm">{record.workingHours.toFixed(2)}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : !loading && !error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Attendance Data</h3>
            <p className="mt-2 text-muted-foreground">
              Select a date range and click "Generate Report" to view attendance data.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
