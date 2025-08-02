import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Calendar, Download, Filter, 
  MapPin, Clock, Users, TrendingUp,
  FileText, BarChart3, PieChart, Settings,
  Loader2, AlertCircle, CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LeaveReport {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

interface ReportFilters {
  startDate: string;
  endDate: string;
  department?: string;
  status?: string;
  leaveType?: string;
  includeDetails: boolean;
  includeComments: boolean;
}

export const LeaveReports = () => {
  const { user } = useAuth();
  const [leaveReports, setLeaveReports] = useState<LeaveReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<LeaveReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    includeDetails: true,
    includeComments: true
  });
  const [showReportOptions, setShowReportOptions] = useState(false);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData: LeaveReport[] = [
        {
          id: "1",
          employeeName: "John Doe",
          employeeId: "EMP001",
          leaveType: "Annual Leave",
          startDate: "2025-08-05",
          endDate: "2025-08-07",
          days: 3,
          status: "approved",
          reason: "Family vacation",
          submittedDate: "2025-08-01",
          approvedBy: "Admin User",
          approvedDate: "2025-08-02"
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
          reason: "Medical appointment",
          submittedDate: "2025-07-30",
          approvedBy: "Admin User",
          approvedDate: "2025-07-31"
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
          reason: "Personal emergency",
          submittedDate: "2025-08-01",
          approvedBy: "Admin User",
          approvedDate: "2025-08-02",
          comments: "Insufficient notice period"
        },
        {
          id: "4",
          employeeName: "Sarah Wilson",
          employeeId: "EMP004",
          leaveType: "Annual Leave",
          startDate: "2025-08-15",
          endDate: "2025-08-20",
          days: 6,
          status: "pending",
          reason: "Summer vacation",
          submittedDate: "2025-08-02"
        },
        {
          id: "5",
          employeeName: "David Brown",
          employeeId: "EMP005",
          leaveType: "Sick Leave",
          startDate: "2025-08-04",
          endDate: "2025-08-05",
          days: 2,
          status: "approved",
          reason: "Not feeling well",
          submittedDate: "2025-08-03",
          approvedBy: "Admin User",
          approvedDate: "2025-08-03"
        }
      ];
      setLeaveReports(mockData);
      setFilteredReports(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter reports when search term or filters change
  useEffect(() => {
    let filtered = leaveReports;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.employeeName.toLowerCase().includes(searchLower) ||
        report.employeeId.toLowerCase().includes(searchLower) ||
        report.leaveType.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.leaveType) {
      filtered = filtered.filter(report => report.leaveType === filters.leaveType);
    }

    setFilteredReports(filtered);
  }, [leaveReports, searchTerm, filters.status, filters.leaveType]);

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

  const generateReport = async (format: 'csv' | 'pdf' | 'excel') => {
    if (filteredReports.length === 0) {
      setError("No reports to generate");
      return;
    }

    setExportLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(`${format.toUpperCase()} report generated successfully with ${filteredReports.length} records`);
    } catch (err: any) {
      console.error("Error generating report:", err);
      setError(`Failed to generate ${format.toUpperCase()} report: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const refreshData = () => {
    // Simulate refresh
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Data refreshed successfully");
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSummaryStats = () => {
    const totalReports = filteredReports.length;
    const approvedCount = filteredReports.filter(r => r.status === 'approved').length;
    const rejectedCount = filteredReports.filter(r => r.status === 'rejected').length;
    const pendingCount = filteredReports.filter(r => r.status === 'pending').length;
    
    const totalDays = filteredReports.reduce((sum, r) => sum + r.days, 0);
    const avgDays = totalReports > 0 ? totalDays / totalReports : 0;

    return {
      totalReports,
      approvedCount,
      rejectedCount,
      pendingCount,
      totalDays,
      avgDays
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
              <CardTitle>Leave Reports</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2"
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
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Report Options
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateReport('csv')}
                disabled={exportLoading || filteredReports.length === 0}
                className="flex items-center gap-2"
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
                disabled={exportLoading || filteredReports.length === 0}
                className="flex items-center gap-2"
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
            Generate comprehensive leave reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by employee name, ID, or leave type..."
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
                    id="includeDetails"
                    checked={filters.includeDetails}
                    onChange={(e) => setFilters({ ...filters, includeDetails: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="includeDetails" className="text-sm">Include Details</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeComments"
                    checked={filters.includeComments}
                    onChange={(e) => setFilters({ ...filters, includeComments: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="includeComments" className="text-sm">Include Comments</label>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Leave Type</label>
              <select
                value={filters.leaveType || ""}
                onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Total Reports</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-blue-800">
                  {stats.totalReports}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Approved</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-800">
                  {stats.approvedCount}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Avg Days</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-yellow-800">
                  {stats.avgDays.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Total Days</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-purple-800">
                  {stats.totalDays}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Leave Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Leave Reports</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredReports.length} of {leaveReports.length} reports
            </div>
          </div>
          <CardDescription>
            Detailed leave reports with filtering and export options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Loading leave reports...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left font-medium">Employee</th>
                      <th className="p-3 text-left font-medium">Leave Type</th>
                      <th className="p-3 text-left font-medium">Date Range</th>
                      <th className="p-3 text-left font-medium">Days</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Submitted</th>
                      <th className="p-3 text-left font-medium">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-t hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{report.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{report.employeeId}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{report.leaveType}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {formatDate(report.startDate)} - {formatDate(report.endDate)}
                          </div>
                        </td>
                        <td className="p-3 font-medium">
                          {report.days} days
                        </td>
                        <td className="p-3">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {formatDate(report.submittedDate)}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {report.approvedBy || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && filteredReports.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No leave reports found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 