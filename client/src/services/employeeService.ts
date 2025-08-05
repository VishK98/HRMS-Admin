import { apiClient } from '@/lib/api';
import { Employee } from '@/types/employee';

export interface EmployeeFilters {
  department?: string;
  status?: string;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  managerId?: string;
  companyId?: string;
}

export interface EmployeeResponse {
  employees: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  managers: number;
  employees: number;
  departmentStats: Array<{ _id: string; count: number }>;
  statusStats: Array<{ _id: string; count: number }>;
}

// Employee Service Functions
export const employeeService = {
  // Get all employees with filters
  async getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeResponse> {
    const { companyId, ...otherFilters } = filters;
    
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    const params = new URLSearchParams();
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = `/employees/company/${companyId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.request<EmployeeResponse>(url);
    return response.data!;
  },

  // Get employee by ID
  async getEmployee(id: string): Promise<Employee> {
    const response = await apiClient.request<Employee>(`/employees/${id}`);
    return response.data!;
  },

  // Create new employee
  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.request<Employee>('/employees/register', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
    return response.data!;
  },

  // Update employee
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.request<Employee>(`/employees/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData)
    });
    return response.data!;
  },

  // Delete employee (deactivate)
  async deleteEmployee(id: string): Promise<void> {
    await apiClient.request(`/employees/${id}/deactivate`, {
      method: 'PUT'
    });
  },

  // Update reporting manager
  async updateReportingManager(employeeId: string, managerId: string | null): Promise<Employee> {
    const response = await apiClient.request<Employee>(`/employees/profile/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({ reportingManager: managerId })
    });
    return response.data!;
  },

  // Get team members (this might need a different endpoint)
  async getTeamMembers(employeeId: string): Promise<Employee[]> {
    // This endpoint might not exist on the server, returning empty array for now
    console.warn('getTeamMembers endpoint not implemented on server');
    return [];
  },

  // Get managers list (this might need a different endpoint)
  async getManagersList(): Promise<Employee[]> {
    // This endpoint might not exist on the server, returning empty array for now
    console.warn('getManagersList endpoint not implemented on server');
    return [];
  },

  // Update leave balance
  async updateLeaveBalance(employeeId: string, leaveBalance: any): Promise<Employee> {
    const response = await apiClient.request<Employee>(`/employees/profile/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({ leaveBalance })
    });
    return response.data!;
  },

  // Update salary
  async updateSalary(employeeId: string, salary: any): Promise<Employee> {
    const response = await apiClient.request<Employee>(`/employees/profile/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({ salary })
    });
    return response.data!;
  },

  // Upload document (this might need a different endpoint)
  async uploadDocument(employeeId: string, documentType: string, file: File): Promise<Employee> {
    // This endpoint might not exist on the server
    console.warn('uploadDocument endpoint not implemented on server');
    throw new Error('Document upload not implemented');
  },

  // Get employee statistics
  async getEmployeeStats(): Promise<EmployeeStats> {
    // This would need companyId, but we don't have it in the current context
    console.warn('getEmployeeStats needs companyId parameter');
    throw new Error('Company ID required for employee stats');
  },

  // Comprehensive update function for all employee fields
  async updateEmployeeComprehensive(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    // Remove undefined values to avoid overwriting with null
    const cleanData = Object.fromEntries(
      Object.entries(employeeData).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.request<Employee>(`/employees/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cleanData)
    });
    return response.data!;
  },

  // Update specific sections
  async updatePersonalInfo(id: string, personalData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    bloodGroup?: string;
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, personalData);
  },

  async updateEmploymentInfo(id: string, employmentData: {
    employeeId?: string;
    department?: string;
    designation?: string;
    role?: string;
    status?: string;
    joiningDate?: string;
    team?: string;
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, employmentData);
  },

  async updateContactInfo(id: string, contactData: {
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
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
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, contactData);
  },

  async updateSalaryInfo(id: string, salaryData: {
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
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, salaryData);
  },

  async updateLeaveInfo(id: string, leaveData: {
    leaveBalance?: {
      paid?: number;
      casual?: number;
      sick?: number;
      short?: number;
      compensatory?: number;
      total?: number;
    };
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, leaveData);
  },

  async updateEducationInfo(id: string, educationData: {
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
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, educationData);
  },

  async updateSkillsInfo(id: string, skillsData: {
    skills?: {
      technical?: string;
      soft?: string;
      languages?: string;
    };
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, skillsData);
  },

  async updatePerformanceInfo(id: string, performanceData: {
    performance?: {
      rating?: number;
      lastReview?: string;
      achievements?: string;
      goals?: string;
      reviewDate?: string;
    };
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, performanceData);
  },

  async updateDocumentsInfo(id: string, documentsData: {
    documents?: {
      aadhar?: string;
      pan?: string;
      passport?: string;
      drivingLicense?: string;
      voterId?: string;
      relievingLetter?: string;
      experienceLetter?: string;
      lastPayslip?: string;
      passportPhoto?: string;
      offerLetter?: string;
    };
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, documentsData);
  },

  async updateAdditionalInfo(id: string, additionalData: {
    notes?: string;
    isProfileComplete?: boolean;
  }): Promise<Employee> {
    return this.updateEmployeeComprehensive(id, additionalData);
  },
}; 