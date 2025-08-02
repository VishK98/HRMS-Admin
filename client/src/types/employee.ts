export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department?: string;
  designation?: string;
  status: "active" | "inactive" | "terminated" | "resigned";
  joiningDate?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  salary?: {
    basic?: number;
    hra?: number;
    da?: number;
    allowances?: number;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  documents?: {
    aadhar?: string;
    pan?: string;
    passport?: string;
  };
  role: "employee" | "manager" | "admin";
  isProfileComplete: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
