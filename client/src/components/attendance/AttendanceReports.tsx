import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Download, Filter, Search, 
  MapPin, Clock, Users, TrendingUp,
  FileText, BarChart3, PieChart, Settings,
  Loader2, AlertCircle, CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { AttendanceRecord } from "@/types/attendance";
import { AttendanceReportGenerator, ReportOptions } from "@/lib/reportGenerator";

interface ReportFilters {
  startDate: string;
  endDate: string;
  department?: string;
  status?: string;
  includeLocation: boolean;
  includeDistance: boolean;
}

export const AttendanceReports = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "2025-08-02",
    endDate: "2025-08-02",
    includeLocation: true,
    includeDistance: true
  });
  const [showReportOptions, setShowReportOptions] = useState(false);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (user?.company?._id) {
      console.log("User company ID:", user.company._id);
      fetchAttendanceRecords();
    }
  }, [user, filters.startDate, filters.endDate, filters.department, filters.status]);

  // Filter records when search term changes
  useEffect(() => {
    console.log("Filtering records. Total records:", attendanceRecords.length, "Search term:", searchTerm);
    filterRecords();
  }, [attendanceRecords, searchTerm]);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("=== DEBUG: Fetching Attendance Records ===");
      console.log("User:", user);
      console.log("Company ID:", user?.company?._id);
      console.log("Filters:", filters);
      
      // Clean up filters - only send defined values
      const apiFilters: any = {};
      if (filters.department && filters.department.trim()) {
        apiFilters.department = filters.department;
      }
      if (filters.status && filters.status.trim()) {
        apiFilters.status = filters.status;
      }
      
      const response = await apiClient.getCompanyAttendance(
        filters.startDate,
        filters.endDate,
        apiFilters
      );

      console.log("=== API Response ===");
      console.log("Response:", response);
      console.log("Success:", response.success);
      console.log("Data length:", response.data?.length || 0);
      console.log("Data:", response.data);

      if (response.success) {
        setAttendanceRecords(response.data || []);
        setSuccess(`Successfully loaded ${response.data?.length || 0} attendance records`);
      } else {
        setError(response.message || "Failed to fetch attendance records");
      }
    } catch (err: any) {
      console.error("=== ERROR: Fetching Attendance Records ===");
      console.error("Error:", err);
      console.error("Error message:", err.message);
      setError(err.message || "Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = attendanceRecords;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(record => {
        const employeeName = `${record.employee?.firstName || ''} ${record.employee?.lastName || ''}`.toLowerCase();
        const employeeId = (record.employee?.employeeId || '').toLowerCase();
        const department = (record.employee?.department || '').toLowerCase();
        
        return employeeName.includes(searchLower) || 
               employeeId.includes(searchLower) || 
               department.includes(searchLower);
      });
    }

    setFilteredRecords(filtered);
  };

  const generateReport = async (format: 'csv' | 'pdf' | 'excel') => {
    if (filteredRecords.length === 0) {
      setError("No records to generate report from");
      return;
    }

    setExportLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const options: ReportOptions = {
        includeLocation: filters.includeLocation,
        includeDistance: filters.includeDistance,
        format,
        dateRange: {
          startDate: filters.startDate,
          endDate: filters.endDate
        },
        filters: {
          department: filters.department,
          status: filters.status
        }
      };

      const reportGenerator = new AttendanceReportGenerator(filteredRecords, options);
      reportGenerator.downloadReport();
      
      setSuccess(`${format.toUpperCase()} report generated successfully with ${filteredRecords.length} records`);
    } catch (err: any) {
      console.error("Error generating report:", err);
      setError(`Failed to generate ${format.toUpperCase()} report: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const refreshData = () => {
    fetchAttendanceRecords();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-100 text-green-800", label: "Present" },
      absent: { color: "bg-red-100 text-red-800", label: "Absent" },
      late: { color: "bg-yellow-100 text-yellow-800", label: "Late" },
      half_day: { color: "bg-orange-100 text-orange-800", label: "Half Day" },
      on_leave: { color: "bg-[#843C6D]/10 text-[#843C6D]", label: "On Leave" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getLocationDistance = (record: AttendanceRecord) => {
    if (!record.checkInLocation || !record.checkOutLocation) return "N/A";
    
    const distance = calculateDistance(
      record.checkInLocation.latitude,
      record.checkInLocation.longitude,
      record.checkOutLocation.latitude,
      record.checkOutLocation.longitude
    );
    
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const getSummaryStats = () => {
    const totalRecords = filteredRecords.length;
    const presentCount = filteredRecords.filter(r => r.status === 'present').length;
    const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
    const lateCount = filteredRecords.filter(r => r.status === 'late').length;
    const halfDayCount = filteredRecords.filter(r => r.status === 'half_day').length;
    const onLeaveCount = filteredRecords.filter(r => r.status === 'on_leave').length;
    
    const totalWorkingHours = filteredRecords.reduce((sum, r) => sum + r.workingHours, 0);
    const avgWorkingHours = totalRecords > 0 ? totalWorkingHours / totalRecords : 0;
    
    const locationTrackedCount = filteredRecords.filter(r => 
      r.checkInLocation || r.checkOutLocation
    ).length;

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      halfDayCount,
      onLeaveCount,
      avgWorkingHours,
      locationTrackedCount
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <CardTitle>Attendance Reports</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2 hover:bg-[#843C6D] hover:text-white transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportOptions(!showReportOptions)}
                className="flex items-center gap-2 hover:bg-[#843C6D] hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                Report Options
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateReport('csv')}
                disabled={exportLoading || filteredRecords.length === 0}
                className="flex items-center gap-2 hover:bg-[#843C6D] hover:text-white transition-colors"
              >
                {exportLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {exportLoading ? "Exporting..." : "Export CSV"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateReport('pdf')}
                disabled={exportLoading || filteredRecords.length === 0}
                className="flex items-center gap-2 hover:bg-[#843C6D] hover:text-white transition-colors"
              >
                {exportLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exportLoading ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
          <CardDescription>
            Generate comprehensive attendance reports with location tracking data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar - Moved to top */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Report Options */}
          {showReportOptions && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-3">Report Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeLocation"
                    checked={filters.includeLocation}
                    onChange={(e) => setFilters({ ...filters, includeLocation: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="includeLocation">Include Location Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeDistance"
                    checked={filters.includeDistance}
                    onChange={(e) => setFilters({ ...filters, includeDistance: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="includeDistance">Include Distance Calculation</Label>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="All Departments"
                value={filters.department || ""}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                placeholder="All Status"
                value={filters.status || ""}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#843C6D]/5 border-[#843C6D]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#843C6D]" />
                  <span className="text-sm font-medium text-[#843C6D]">Total Records</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#843C6D]">
                  {stats.totalRecords}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Present</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-800">
                  {stats.presentCount}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Avg Working Hours</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-yellow-800">
                  {stats.avgWorkingHours.toFixed(1)}h
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Location Tracked</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-purple-800">
                  {stats.locationTrackedCount}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Attendance Records</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredRecords.length} of {attendanceRecords.length} records
            </div>
          </div>
          <CardDescription>
            Detailed attendance records with location tracking data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Loading attendance records...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left font-medium">Employee</th>
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Check-in</th>
                      <th className="p-3 text-left font-medium">Check-out</th>
                      <th className="p-3 text-left font-medium">Working Hours</th>
                      <th className="p-3 text-left font-medium">Overtime</th>
                      <th className="p-3 text-left font-medium">Location Data</th>
                      <th className="p-3 text-left font-medium">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record._id} className="border-t hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">
                              {record.employee.firstName} {record.employee.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {record.employee.employeeId}
                            </div>
                            {record.employee.department && (
                              <div className="text-xs text-muted-foreground">
                                {record.employee.department}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          {formatDate(record.date)}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{formatTime(record.checkIn)}</div>
                            {record.checkInLocation && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {record.checkInLocation.address || `${record.checkInLocation.latitude.toFixed(4)}, ${record.checkInLocation.longitude.toFixed(4)}`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{formatTime(record.checkOut)}</div>
                            {record.checkOutLocation && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {record.checkOutLocation.address || `${record.checkOutLocation.latitude.toFixed(4)}, ${record.checkOutLocation.longitude.toFixed(4)}`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-medium">
                          {record.workingHours > 0 ? `${record.workingHours.toFixed(2)}h` : "N/A"}
                        </td>
                        <td className="p-3 font-medium">
                          {record.overtime > 0 ? `${record.overtime.toFixed(2)}h` : "0h"}
                        </td>
                        <td className="p-3">
                          <div className="text-xs">
                            {record.checkInLocation && record.checkOutLocation ? (
                              <Badge variant="default" className="text-xs">Complete</Badge>
                            ) : record.checkInLocation || record.checkOutLocation ? (
                              <Badge variant="secondary" className="text-xs">Partial</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">None</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-medium">
                          {getLocationDistance(record)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && filteredRecords.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No attendance records found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or date range</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
