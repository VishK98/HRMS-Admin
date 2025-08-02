import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, Filter, Calendar, User, 
  CheckCircle, XCircle, Clock, AlertCircle,
  Plus, FileText, Download, Settings, RefreshCw, Eye, X, MoreHorizontal
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { LeaveRequest } from "@/types/leave";
import { useToast } from "@/hooks/use-toast";

// Remove the local interface since we're importing from types/leave

export const LeaveRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Fixed at 5 items per page

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
      console.log("Searching for:", searchLower);
      console.log("Available requests:", leaveRequests.length);
      
      filtered = filtered.filter(request => {
        const employeeName = `${request.employee?.firstName || ''} ${request.employee?.lastName || ''}`.toLowerCase();
        const employeeId = (request.employee?.employeeId || '').toLowerCase();
        const leaveType = (request.leaveType || '').toLowerCase();
        const reason = (request.reason || '').toLowerCase();
        
        // Check if any part of the search term matches
        const searchTerms = searchLower.split(' ').filter(term => term.length > 0);
        
        const matches = searchTerms.some(term => 
          employeeName.includes(term) ||
          employeeId.includes(term) ||
          leaveType.includes(term) ||
          reason.includes(term)
        );
        
        if (matches) {
          console.log("Match found:", employeeName, leaveType, reason);
        }
        
        return matches;
      });
      
      console.log("Filtered results:", filtered.length);
    }

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (leaveTypeFilter) {
      filtered = filtered.filter(request => request.leaveType === leaveTypeFilter);
    }

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page when filters change
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
    // Find the leave request to check manager status
    const leaveRequest = leaveRequests.find(request => request._id === requestId);
    
    if (leaveRequest?.managerAction === 'pending') {
      toast({
        title: "Manager Approval Required",
        description: "Please wait for the manager to approve this leave request first.",
        variant: "destructive",
      });
      return;
    }

    setLeaveRequests(prev => 
      prev.map(request => 
        request._id === requestId 
          ? { ...request, status: 'approved' as const, approvedBy: user?.name, approvedDate: new Date().toISOString() }
          : request
      )
    );

    toast({
      title: "Leave Request Approved",
      description: "The leave request has been successfully approved.",
    });
  };

  const handleReject = (requestId: string) => {
    // Find the leave request to check manager status
    const leaveRequest = leaveRequests.find(request => request._id === requestId);
    
    if (leaveRequest?.managerAction === 'pending') {
      toast({
        title: "Manager Approval Required",
        description: "Please wait for the manager to approve this leave request first.",
        variant: "destructive",
      });
      return;
    }

    setLeaveRequests(prev => 
      prev.map(request => 
        request._id === requestId 
          ? { ...request, status: 'rejected' as const, approvedBy: user?.name, approvedDate: new Date().toISOString() }
          : request
      )
    );

    toast({
      title: "Leave Request Rejected",
      description: "The leave request has been rejected.",
      variant: "destructive",
    });
  };

  const handleView = (request: LeaveRequest) => {
    setSelectedLeave(request);
    setIsViewModalOpen(true);
    
    // Auto-close modal after 3 seconds
    setTimeout(() => {
      setIsViewModalOpen(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                                {/* Enhanced Search and Filters */}
           <div className="space-y-4 mb-6">
             {/* Search Bar */}
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
               <Input
                 placeholder="Search by employee name, ID, leave type, or reason..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9 pr-4 h-10"
               />
               {searchTerm && (
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setSearchTerm("")}
                   className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                 >
                   <X className="w-4 h-4" />
                 </Button>
               )}
             </div>

             {/* Search Results Summary - Moved here */}
             {searchTerm.trim() && (
               <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Search className="w-4 h-4 text-blue-600" />
                     <span className="text-sm font-medium text-blue-800">
                       Search Results for "{searchTerm}"
                     </span>
                   </div>
                   <Badge variant="secondary" className="text-xs">
                     {filteredRequests.length} result{filteredRequests.length !== 1 ? 's' : ''}
                   </Badge>
                 </div>
                 {filteredRequests.length > 0 && (
                   <div className="mt-2 text-xs text-blue-700">
                     Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} results
                   </div>
                 )}
               </div>
             )}
             
             {/* Filters */}
             <div className="flex flex-wrap gap-3">
               <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-muted-foreground" />
                 <span className="text-sm font-medium text-muted-foreground">Filters:</span>
               </div>
               <select
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
                 className="px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
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
                 className="px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
               >
                 <option value="">All Types</option>
                 <option value="paid">Paid Leave</option>
                 <option value="casual">Casual Leave</option>
                 <option value="short">Short Leave</option>
                 <option value="sick">Sick Leave</option>
                 <option value="halfday">Half Day</option>
               </select>
               {(statusFilter || leaveTypeFilter) && (
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     setStatusFilter("");
                     setLeaveTypeFilter("");
                   }}
                   className="text-xs"
                 >
                   Clear Filters
                 </Button>
               )}
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
               <div className="flex items-center justify-between">
                 <div>
                   <CardTitle>Leave Requests List</CardTitle>
                   <CardDescription>
                     Review and manage employee leave requests
                   </CardDescription>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <span>Total: {filteredRequests.length}</span>
                   <span>•</span>
                   <span>Page {currentPage} of {totalPages}</span>
                 </div>
               </div>
             </CardHeader>
                           <CardContent>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <tr>
                          <th className="p-4 text-left font-semibold text-gray-700">Employee</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Leave Type</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Date Range</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Days</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Manager Action</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Submitted</th>
                          <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRequests.map((request) => (
                          <tr key={request._id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                            <td className="p-4">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {request.employee?.firstName} {request.employee?.lastName}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: {request.employee?.employeeId}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {getLeaveTypeBadge(request.leaveType)}
                                {request.halfDayType && (
                                  <div className="text-xs text-gray-500">
                                    {request.halfDayType === 'first' ? '1st Half' : '2nd Half'}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatDate(request.startDate)} - {formatDate(request.endDate)}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-gray-900">
                                {request.days} {request.days === 1 ? 'day' : 'days'}
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(request.status)}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {getManagerActionBadge(request.managerAction)}
                                {request.reportingManager && (
                                  <div className="text-xs text-gray-500">
                                    {request.reportingManager.firstName} {request.reportingManager.lastName}
                                  </div>
                                )}
                                {request.managerActionDate && (
                                  <div className="text-xs text-gray-500">
                                    {formatDate(request.managerActionDate)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                              {formatDate(request.submittedDate)}
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    className="gap-2" 
                                    onClick={() => handleView(request)}
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {request.status === 'pending' && (
                                    <>
                                      <DropdownMenuItem 
                                        className="gap-2 text-green-600" 
                                        onClick={() => handleApprove(request._id)}
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve Request
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="gap-2 text-destructive" 
                                        onClick={() => handleReject(request._id)}
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Reject Request
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {request.status === 'approved' && request.managerAction === 'approved' && (
                                <div className="mt-2">
                                  <div className="bg-green-50 border border-green-200 rounded-md p-2">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-xs font-medium text-green-800">
                                        Completely Approved
                                      </span>
                                    </div>
                                    <div className="text-xs text-green-700 mt-1">
                                      {request.approvedBy?.name && `By ${request.approvedBy.name}`}
                                      {request.approvedDate && (
                                        <div>{formatDate(request.approvedDate)}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {request.status !== 'pending' && request.status !== 'approved' && (
                                <div className="text-xs text-muted-foreground mt-2">
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
             <div className="flex items-center justify-center h-48">
               <div className="text-center">
                 <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 mb-2">
                   {searchTerm.trim() ? 'No matching leave requests' : 'No leave requests found'}
                 </h3>
                 <p className="text-sm text-gray-500 mb-4">
                   {searchTerm.trim() 
                     ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                     : 'There are no leave requests to display at the moment.'
                   }
                 </p>
                 {searchTerm.trim() && (
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setSearchTerm("")}
                     className="gap-2"
                   >
                     <X className="w-4 h-4" />
                     Clear Search
                   </Button>
                 )}
               </div>
             </div>
           )}

           {/* Enhanced Pagination */}
           {filteredRequests.length > 0 && (
             <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg border">
               <div className="text-sm text-gray-600">
                 Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                 <span className="font-semibold">{Math.min(endIndex, filteredRequests.length)}</span> of{' '}
                 <span className="font-semibold">{filteredRequests.length}</span> results
               </div>
               <div className="flex items-center gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={currentPage === 1}
                   className="px-3 py-2"
                 >
                   Previous
                 </Button>
                 <div className="flex items-center gap-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                     <Button
                       key={page}
                       variant={currentPage === page ? "default" : "outline"}
                       size="sm"
                       onClick={() => handlePageChange(page)}
                       className="px-3 py-2 w-10 h-10"
                     >
                       {page}
                     </Button>
                   ))}
                 </div>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={currentPage === totalPages}
                   className="px-3 py-2"
                 >
                   Next
                 </Button>
               </div>
             </div>
           )}
        </CardContent>
      </Card>

      {/* View Leave Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Leave Request Details
              </DialogTitle>
              <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <DialogDescription>
              Complete information about the leave request
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Employee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee Name</label>
                    <p className="text-sm">{selectedLeave.employee?.firstName} {selectedLeave.employee?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="text-sm">{selectedLeave.employee?.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-sm">{selectedLeave.employee?.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Designation</label>
                    <p className="text-sm">{selectedLeave.employee?.designation || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Leave Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Leave Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Leave Type</label>
                    <div className="mt-1">
                      {getLeaveTypeBadge(selectedLeave.leaveType)}
                      {selectedLeave.halfDayType && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {selectedLeave.halfDayType === 'first' ? '1st Half' : '2nd Half'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedLeave.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <p className="text-sm">{formatDate(selectedLeave.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">End Date</label>
                    <p className="text-sm">{formatDate(selectedLeave.endDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Days</label>
                    <p className="text-sm font-medium">{selectedLeave.days} {selectedLeave.days === 1 ? 'day' : 'days'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                    <p className="text-sm">{formatDateTime(selectedLeave.submittedDate)}</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Reason</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm">{selectedLeave.reason}</p>
                </div>
              </div>

              {/* Manager Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Manager Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reporting Manager</label>
                    <p className="text-sm">
                      {selectedLeave.reportingManager 
                        ? `${selectedLeave.reportingManager.firstName} ${selectedLeave.reportingManager.lastName}`
                        : 'Not assigned'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Manager Action</label>
                    <div className="mt-1">
                      {getManagerActionBadge(selectedLeave.managerAction)}
                    </div>
                  </div>
                  {selectedLeave.managerActionDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Manager Action Date</label>
                      <p className="text-sm">{formatDateTime(selectedLeave.managerActionDate)}</p>
                    </div>
                  )}
                  {selectedLeave.managerComment && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Manager Comment</label>
                      <div className="bg-muted p-3 rounded-md mt-1">
                        <p className="text-sm">{selectedLeave.managerComment}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Information */}
              {(selectedLeave.approvedBy || selectedLeave.approvedDate || selectedLeave.comments) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Approval Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLeave.approvedBy && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                        <p className="text-sm">{selectedLeave.approvedBy.name}</p>
                      </div>
                    )}
                    {selectedLeave.approvedDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Approval Date</label>
                        <p className="text-sm">{formatDateTime(selectedLeave.approvedDate)}</p>
                      </div>
                    )}
                    {selectedLeave.comments && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Comments</label>
                        <div className="bg-muted p-3 rounded-md mt-1">
                          <p className="text-sm">{selectedLeave.comments}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-sm">{formatDateTime(selectedLeave.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{formatDateTime(selectedLeave.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 