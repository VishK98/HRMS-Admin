export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department?: string;
  designation?: string;
  reportingManager?: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  status: "active" | "inactive" | "terminated" | "resigned";
  joiningDate?: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  maritalStatus?: "single" | "married" | "divorced" | "widowed";
  bloodGroup?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  salary?: {
    basic?: number;
    hra?: number;
    da?: number;
    allowances?: number;
    specialAllowance?: number;
    transportAllowance?: number;
    medicalAllowance?: number;
    totalSalary?: number;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    permanentAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  documents?: {
    aadhar?: string;
    pan?: string;
    passport?: string;
    drivingLicense?: string;
    voterId?: string;
  };
  education?: {
    highestQualification: string;
    institution: string;
    yearOfCompletion: string;
    percentage?: number;
  };
  workExperience?: {
    company: string;
    position: string;
    fromDate: string;
    toDate: string;
    description?: string;
  }[];
  skills?: {
    technical?: string;
    soft?: string;
    languages?: string;
  };
  team?: string;
  performance?: {
    rating?: number;
    lastReview?: string;
    achievements?: string;
    goals?: string;
    reviewDate?: string;
  };
  notes?: string;
  leaveBalance?: {
    paid?: number;
    casual?: number;
    sick?: number;
    short?: number;
    compensatory?: number;
    total?: number;
  };
  role: "employee" | "manager" | "admin";
  isProfileComplete: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
