import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle, XCircle, Search, User, Calendar, 
  MapPin, Timer, Table, Eye, Clock as ClockIcon, Users, 
  UserCheck, UserX, UserMinus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Employee } from "@/types/employee";

interface AttendanceRecord {
  _id: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  workingHours: number;
  overtime: number;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

interface AttendanceSummary {
  totalEmployees: number;
  present: number;
  absent: number;
  onLeave: number;
  late: number;
  halfDay: number;
}

export const CheckInOut = () => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees when component mounts
  useEffect(() => {
    if (user?.company?._id) {
      fetchEmployees();
      fetchAttendanceSummary();
    }
  }, [user]);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [searchTerm, employees]);

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

  const fetchAttendanceSummary = async () => {
    setSummaryLoading(true);
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Fetch attendance summary
      const attendanceResponse = await apiClient.request<AttendanceSummary>(
        `/attendance/summary?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      // Fetch total employees count for the company
      const employeesResponse = await apiClient.request<{ employees: Employee[] }>(
        `/employees/company/${user!.company!._id}`
      );
      
      const totalEmployees = employeesResponse.success ? employeesResponse.data!.employees.length : 0;
      
      if (attendanceResponse.success) {
        // Calculate summary from the response
        const summary = {
          totalEmployees: totalEmployees,
          present: attendanceResponse.data?.statusSummary?.find(s => s._id === 'present')?.count || 0,
          absent: attendanceResponse.data?.statusSummary?.find(s => s._id === 'absent')?.count || 0,
          onLeave: attendanceResponse.data?.statusSummary?.find(s => s._id === 'on_leave')?.count || 0,
          late: attendanceResponse.data?.statusSummary?.find(s => s._id === 'late')?.count || 0,
          halfDay: attendanceResponse.data?.statusSummary?.find(s => s._id === 'half_day')?.count || 0
        };
        setAttendanceSummary(summary);
      } else {
        // Set default summary if attendance API fails
        setAttendanceSummary({
          totalEmployees: totalEmployees,
          present: 0,
          absent: 0,
          onLeave: 0,
          late: 0,
          halfDay: 0
        });
      }
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
      // Set default summary if API fails
      setAttendanceSummary({
        totalEmployees: 0,
        present: 0,
        absent: 0,
        onLeave: 0,
        late: 0,
        halfDay: 0
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const refreshSummary = () => {
    fetchAttendanceSummary();
  };

  const fetchTodaysAttendance = async (empId: string) => {
    try {
      const response = await apiClient.request<AttendanceRecord>(
        `/attendance/today/${empId}`
      );
      
      if (response.success) {
        setAttendance(response.data!);
      } else {
        setAttendance(null);
      }
    } catch (err) {
      setAttendance(null);
    }
  };

  const handleEmployeeSelect = (emp: Employee) => {
    setEmployeeId(emp._id);
    setSearchTerm(`${emp.firstName} ${emp.lastName}`);
    setFilteredEmployees([]);
    fetchTodaysAttendance(emp._id);
  };

  const getStatusBadge = (status: string, hasCheckIn: boolean, hasCheckOut: boolean) => {
    if (hasCheckOut) {
      return <Badge className="bg-success">Completed</Badge>;
    } else if (hasCheckIn) {
      return <Badge className="bg-warning">In Progress</Badge>;
    } else {
      return <Badge variant="destructive">Not Started</Badge>;
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkIn || !checkOut) return "N/A";
    const duration = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Attendance Summary Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle>Today's Attendance Overview</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshSummary}
              disabled={summaryLoading}
              className="flex items-center gap-2"
            >
              {summaryLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {summaryLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          <CardDescription>Real-time attendance statistics for your company</CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading attendance data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Employees */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Total Employees</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-blue-800">
                          {attendanceSummary?.totalEmployees || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-blue-600">Active</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Present Employees */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Present</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-green-800">
                          {attendanceSummary?.present || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-600">
                          {attendanceSummary?.totalEmployees ? 
                            `${Math.round((attendanceSummary.present / attendanceSummary.totalEmployees) * 100)}%` : 
                            '0%'
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Absent Employees */}
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <UserX className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-medium text-red-700">Absent</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-red-800">
                          {attendanceSummary?.absent || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-red-600">
                          {attendanceSummary?.totalEmployees ? 
                            `${Math.round((attendanceSummary.absent / attendanceSummary.totalEmployees) * 100)}%` : 
                            '0%'
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* On Leave Employees */}
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <UserMinus className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700">On Leave</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-orange-800">
                          {attendanceSummary?.onLeave || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-orange-600">
                          {attendanceSummary?.totalEmployees ? 
                            `${Math.round((attendanceSummary.onLeave / attendanceSummary.totalEmployees) * 100)}%` : 
                            '0%'
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">Late</span>
                        </div>
                        <div className="mt-2 text-xl font-bold text-yellow-800">
                          {attendanceSummary?.late || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Timer className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700">Half Day</span>
                        </div>
                        <div className="mt-2 text-xl font-bold text-purple-800">
                          {attendanceSummary?.halfDay || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Employee Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Selection</CardTitle>
          <CardDescription>Select an employee to view attendance details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {filteredEmployees.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee._id}
                    className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                    <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {employeeId && (
            <div className="mt-4 p-3 bg-secondary rounded-md">
              <div className="font-medium">
                Selected: {employees.find(e => e._id === employeeId)?.firstName} {employees.find(e => e._id === employeeId)?.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {employees.find(e => e._id === employeeId)?.employeeId}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Details Table */}
      {employeeId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="w-5 h-5" />
              Attendance Details
            </CardTitle>
            <CardDescription>Comprehensive attendance information for selected employee</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            
            {attendance ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <div className="mt-2">
                        {getStatusBadge(attendance.status, !!attendance.checkIn, !!attendance.checkOut)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Working Hours</span>
                      </div>
                      <div className="mt-2 text-lg font-bold">
                        {attendance.workingHours > 0 ? `${attendance.workingHours.toFixed(2)}h` : "N/A"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Overtime</span>
                      </div>
                      <div className="mt-2 text-lg font-bold">
                        {attendance.overtime > 0 ? `${attendance.overtime.toFixed(2)}h` : "0h"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Date</span>
                      </div>
                      <div className="mt-2 text-sm">
                        {formatDate(attendance.checkIn)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Table */}
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left font-medium">Field</th>
                          <th className="p-3 text-left font-medium">Value</th>
                          <th className="p-3 text-left font-medium">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 font-medium">Employee ID</td>
                          <td className="p-3">{employees.find(e => e._id === employeeId)?.employeeId}</td>
                          <td className="p-3 text-muted-foreground">Unique identifier</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Employee Name</td>
                          <td className="p-3">
                            {employees.find(e => e._id === employeeId)?.firstName} {employees.find(e => e._id === employeeId)?.lastName}
                          </td>
                          <td className="p-3 text-muted-foreground">Full name</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Attendance Status</td>
                          <td className="p-3">
                            {getStatusBadge(attendance.status, !!attendance.checkIn, !!attendance.checkOut)}
                          </td>
                          <td className="p-3 text-muted-foreground">Current attendance state</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Check-in Time</td>
                          <td className="p-3">
                            {attendance.checkIn ? (
                              <div>
                                <div className="font-medium">{formatTime(attendance.checkIn)}</div>
                                <div className="text-xs text-muted-foreground">{formatDate(attendance.checkIn)}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Not checked in</span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground">Time employee started work</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Check-out Time</td>
                          <td className="p-3">
                            {attendance.checkOut ? (
                              <div>
                                <div className="font-medium">{formatTime(attendance.checkOut)}</div>
                                <div className="text-xs text-muted-foreground">{formatDate(attendance.checkOut)}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Not checked out</span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground">Time employee finished work</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Duration</td>
                          <td className="p-3 font-medium">
                            {calculateDuration(attendance.checkIn, attendance.checkOut)}
                          </td>
                          <td className="p-3 text-muted-foreground">Total time worked today</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Working Hours</td>
                          <td className="p-3 font-medium">
                            {attendance.workingHours > 0 ? `${attendance.workingHours.toFixed(2)} hours` : "N/A"}
                          </td>
                          <td className="p-3 text-muted-foreground">Calculated working hours</td>
                        </tr>
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Overtime Hours</td>
                          <td className="p-3 font-medium">
                            {attendance.overtime > 0 ? `${attendance.overtime.toFixed(2)} hours` : "0 hours"}
                          </td>
                          <td className="p-3 text-muted-foreground">Hours beyond standard workday</td>
                        </tr>
                        
                        {attendance.checkInLocation && (
                          <tr className="border-t">
                            <td className="p-3 font-medium">Check-in Location</td>
                            <td className="p-3">
                              <div className="text-sm">
                                <div>Lat: {attendance.checkInLocation.latitude.toFixed(6)}</div>
                                <div>Lng: {attendance.checkInLocation.longitude.toFixed(6)}</div>
                                {attendance.checkInLocation.address && (
                                  <div className="text-muted-foreground mt-1">
                                    {attendance.checkInLocation.address}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">GPS coordinates and address</td>
                          </tr>
                        )}
                        
                        {attendance.checkOutLocation && (
                          <tr className="border-t">
                            <td className="p-3 font-medium">Check-out Location</td>
                            <td className="p-3">
                              <div className="text-sm">
                                <div>Lat: {attendance.checkOutLocation.latitude.toFixed(6)}</div>
                                <div>Lng: {attendance.checkOutLocation.longitude.toFixed(6)}</div>
                                {attendance.checkOutLocation.address && (
                                  <div className="text-muted-foreground mt-1">
                                    {attendance.checkOutLocation.address}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">GPS coordinates and address</td>
                          </tr>
                        )}
                        
                        <tr className="border-t">
                          <td className="p-3 font-medium">Record ID</td>
                          <td className="p-3 font-mono text-xs">{attendance._id}</td>
                          <td className="p-3 text-muted-foreground">Database record identifier</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No attendance record found for today</p>
                  <p className="text-sm text-muted-foreground">The employee may not have checked in yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
