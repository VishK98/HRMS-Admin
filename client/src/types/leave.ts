export interface LeaveRequest {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: string;
    designation?: string;
  };
  company: string;
  leaveType: 'paid' | 'casual' | 'short' | 'sick' | 'halfday';
  halfDayType?: 'first' | 'second';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  approvedDate?: string;
  comments?: string;
  // Manager approval fields
  reportingManager?: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: string;
    designation?: string;
  };
  managerAction: "pending" | "approved" | "rejected";
  managerActionDate?: string;
  managerComment?: string;
  submittedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  cancelledRequests: number;
  totalDays: number;
  avgDays: string;
  leaveTypeBreakdown: {
    paid: number;
    casual: number;
    short: number;
    sick: number;
    halfday: number;
  };
}

export interface LeaveFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  leaveType?: 'paid' | 'casual' | 'short' | 'sick' | 'halfday';
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

export interface CreateLeaveRequestData {
  employeeId: string;
  leaveType: 'paid' | 'casual' | 'short' | 'sick' | 'halfday';
  halfDayType?: 'first' | 'second';
  startDate: string;
  endDate: string;
  reason: string;
  days?: number;
}

export interface UpdateLeaveStatusData {
  status: 'approved' | 'rejected' | 'cancelled';
  comments?: string;
} 