export interface RegularizationRequest {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: string;
    designation?: string;
  };
  date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reportingManager?: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  managerAction?: "pending" | "approved" | "rejected";
  managerActionDate?: string;
  managerComment?: string;
  createdAt: string;
  updatedAt: string;
}
