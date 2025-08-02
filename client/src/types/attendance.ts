export interface AttendanceRecord {
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
  checkIn: string;
  checkOut: string | null;
  status: string;
  workingHours: number;
  overtime: number;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
  };
  notes?: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  totalEmployees: number;
  present: number;
  absent: number;
  onLeave: number;
  late: number;
  halfDay: number;
}

export interface AttendanceFilters {
  startDate: string;
  endDate: string;
  department?: string;
  status?: string;
  employeeId?: string;
  includeLocation?: boolean;
} 