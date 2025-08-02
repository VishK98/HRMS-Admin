import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, Calendar, User, 
  CheckCircle, XCircle, Clock, AlertCircle,
  Plus, FileText, Download, Settings, RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { LeaveRequest } from "@/types/leave";

// Remove the local interface since we're importing from types/leave

export const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");

  // Fetch leave requests from API
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLeaveRequests();
      if (response.success && response.data) {
        setLeaveRequests(response.data);
        setFilteredRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Filter requests when search term or filters change
  useEffect(() => {
    let filtered = leaveRequests;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.employee?.firstName?.toLowerCase().includes(searchLower) ||
        request.employee?.lastName?.toLowerCase().includes(searchLower) ||
        request.employee?.employeeId?.toLowerCase().includes(searchLower) ||
        request.leaveType.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (leaveTypeFilter) {
      filtered = filtered.filter(request => request.leaveType === leaveTypeFilter);
    }

    setFilteredRequests(filtered);
  }, [leaveRequests, searchTerm, statusFilter, leaveTypeFilter]);

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

  const getManagerActionBadge = (action: string) => {
    const actionConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" }
    };

    const config = actionConfig[action as keyof typeof actionConfig] || actionConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getLeaveTypeBadge = (leaveType: string) => {
    const typeConfig = {
      paid: { color: "bg-blue-100 text-blue-800", label: "Paid" },
      casual: { color: "bg-purple-100 text-purple-800", label: "Casual" },
      short: { color: "bg-orange-100 text-orange-800", label: "Short" },
      sick: { color: "bg-red-100 text-red-800", label: "Sick" },
      halfday: { color: "bg-gray-100 text-gray-800", label: "Half Day" }
    };

    const config = typeConfig[leaveType as keyof typeof typeConfig] || typeConfig.paid;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleApprove = (requestId: string) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved' as const, approvedBy: user?.name, approvedDate: new Date().toISOString() }
          : request
      )
    );
  };

  const handleReject = (requestId: string) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected' as const, approvedBy: user?.name, approvedDate: new Date().toISOString() }
          : request
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Leave Requests</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={fetchLeaveRequests}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
          <CardDescription>
            Manage and approve employee leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by employee name, ID, or leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="paid">Paid Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="short">Short Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="halfday">Half Day</option>
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Total Requests</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-blue-800">
                  {filteredRequests.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Pending</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-yellow-800">
                  {filteredRequests.filter(r => r.status === 'pending').length}
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
                  {filteredRequests.filter(r => r.status === 'approved').length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Rejected</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-red-800">
                  {filteredRequests.filter(r => r.status === 'rejected').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests List</CardTitle>
          <CardDescription>
            Review and manage employee leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <th className="p-3 text-left font-medium">Manager Action</th>
                    <th className="p-3 text-left font-medium">Submitted</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="border-t hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">
                            {request.employee?.firstName} {request.employee?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {request.employee?.employeeId}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {getLeaveTypeBadge(request.leaveType)}
                        {request.halfDayType && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {request.halfDayType === 'first' ? '1st Half' : '2nd Half'}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        {request.days} {request.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="p-3">
                        {getManagerActionBadge(request.managerAction)}
                        {request.reportingManager && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {request.reportingManager.firstName} {request.reportingManager.lastName}
                          </div>
                        )}
                        {request.managerActionDate && (
                          <div className="text-xs text-muted-foreground">
                            {formatDate(request.managerActionDate)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {formatDate(request.submittedDate)}
                      </td>
                      <td className="p-3">
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request._id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request._id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {request.status !== 'pending' && (
                          <div className="text-xs text-muted-foreground">
                            {request.approvedBy?.name && `By ${request.approvedBy.name}`}
                            {request.approvedDate && (
                              <div>{formatDate(request.approvedDate)}</div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRequests.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No leave requests found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 