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

export interface Department {
  _id: string;
  name: string;
  description?: string;
  manager?: string;
  subCategories?: Array<{ _id: string; name: string }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Designation {
  _id: string;
  name: string;
  description?: string;
  level?: number;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Employee Service Functions
export const employeeService = {
  // Get employees with filters
  async getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await apiClient.request<any>(`/employees/company/${filters.companyId || ''}?${queryParams.toString()}`);
    
    console.log('Get employees response:', response); // Debug log
    
    if (!response) {
      throw new Error('No response from server');
    }
    
    // The response might be the data directly, or it might be wrapped
    let employees: Employee[] = [];
    let pagination = { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 };
    
    if (response.data && response.data.employees) {
      // Response is wrapped in { data: { employees: [...], pagination: {...} } }
      employees = response.data.employees;
      pagination = response.data.pagination || pagination;
    } else if (response.data && Array.isArray(response.data)) {
      // Response is { data: [...] }
      employees = response.data;
    } else if ((response as any).employees) {
      // Response is directly { employees: [...], pagination: {...} }
      employees = (response as any).employees;
      pagination = (response as any).pagination || pagination;
    } else if (Array.isArray(response)) {
      // Response is directly an array of employees
      employees = response;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    console.log('Employees from response:', employees); // Debug log
    
    return { 
      employees: employees, 
      pagination: pagination
    };
  },

  // Get employee by ID
  async getEmployee(id: string): Promise<Employee> {
    const response = await apiClient.request<any>(`/employees/${id}`);
    
    console.log('Get employee response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    return employee;
  },

  // Create new employee
  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.request<any>('/employees/register', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
    
    console.log('Create employee response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    return employee;
  },

  // Update employee
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.request<any>(`/employees/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData)
    });
    
    console.log('Update employee response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    return employee;
  },

  // Delete employee (deactivate)
  async deleteEmployee(id: string): Promise<void> {
    await apiClient.request(`/employees/${id}/deactivate`, {
      method: 'PUT'
    });
  },

  // Update reporting manager
  async updateReportingManager(employeeId: string, managerId: string | null): Promise<Employee> {
    const response = await apiClient.request<any>(`/employees/profile/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({ reportingManager: managerId })
    });
    
    console.log('Update reporting manager response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    return employee;
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
    const response = await apiClient.request<any>(`/employees/profile/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({ leaveBalance })
    });
    
    console.log('Update leave balance response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    return employee;
  },

  // Update salary
  async updateSalary(employeeId: string, salary: any): Promise<Employee> {
    const response = await apiClient.request<any>(`/employees/profile/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({ salary })
    });
    
    console.log('Update salary response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    return employee;
  },

  // Upload document (this might need a different endpoint)
  async uploadDocument(employeeId: string, documentType: string, file: File): Promise<Employee> {
    try {
      const formData = new FormData();
      formData.append(documentType, file); // Use documentType as field name

      const response = await apiClient.uploadRequest<any>(`/employees/${employeeId}/documents/upload`, formData);

      // Extract employee data from response
      let employee: Employee;
      if (response.data && response.data.data) {
        // Server returns { success: true, data: { employee } }
        employee = response.data.data;
      } else if (response.data) {
        // Direct employee data
        employee = response.data;
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response structure from server');
      }

      return employee;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Upload education document
  async uploadEducationDocument(employeeId: string, documentType: string, file: File): Promise<Employee> {
    try {
      const formData = new FormData();
      formData.append(documentType, file); // Use documentType as field name

      const response = await apiClient.uploadRequest<any>(`/employees/${employeeId}/education/upload`, formData);

      // Extract employee data from response
      let employee: Employee;
      if (response.data && response.data.data) {
        // Server returns { success: true, data: { employee } }
        employee = response.data.data;
      } else if (response.data) {
        // Direct employee data
        employee = response.data;
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response structure from server');
      }

      return employee;
    } catch (error) {
      console.error('Error uploading education document:', error);
      throw error;
    }
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

    console.log('Original employeeData:', employeeData);
    console.log('Clean data before processing:', cleanData);

    // Clean up problematic fields
    if (cleanData.reportingManager && typeof cleanData.reportingManager === 'object' && Object.keys(cleanData.reportingManager).length === 0) {
      console.log('Found empty reportingManager object, setting to null');
      cleanData.reportingManager = null;
    }

    // Clean up documents that might contain File objects
    if (cleanData.documents && typeof cleanData.documents === 'object') {
      Object.keys(cleanData.documents).forEach(key => {
        const value = cleanData.documents[key];
        if (value && typeof value === 'object' && value.name && value.size && value.type) {
          // This is a File object, remove it
          console.log(`Removing File object from documents.${key}`);
          delete cleanData.documents[key];
        } else if (value === null || value === undefined || value === '') {
          // Remove empty values
          console.log(`Removing empty value from documents.${key}`);
          delete cleanData.documents[key];
        }
      });
      
      // If documents object is empty, remove it
      if (Object.keys(cleanData.documents).length === 0) {
        console.log('Removing empty documents object');
        delete cleanData.documents;
      }
    }

    // Clean up nested objects that might be empty
    if (cleanData.address && typeof cleanData.address === 'object') {
      Object.keys(cleanData.address).forEach(key => {
        if (cleanData.address[key] && typeof cleanData.address[key] === 'object' && Object.keys(cleanData.address[key]).length === 0) {
          cleanData.address[key] = null;
        }
      });
    }

    if (cleanData.salary && typeof cleanData.salary === 'object') {
      Object.keys(cleanData.salary).forEach(key => {
        if (cleanData.salary[key] === undefined || cleanData.salary[key] === null) {
          delete cleanData.salary[key];
        }
      });
    }

    if (cleanData.bankDetails && typeof cleanData.bankDetails === 'object') {
      Object.keys(cleanData.bankDetails).forEach(key => {
        if (cleanData.bankDetails[key] === undefined || cleanData.bankDetails[key] === null || cleanData.bankDetails[key] === '') {
          delete cleanData.bankDetails[key];
        }
      });
    }

    console.log('Final clean data being sent to server:', cleanData);

    const response = await apiClient.request<any>(`/employees/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cleanData)
    });
    
    console.log('Comprehensive update response:', response); // Debug log
    
    // Handle different response structures
    let employee: Employee;
    
    if (response.data) {
      employee = response.data;
    } else if ((response as any).employee) {
      employee = (response as any).employee;
    } else {
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from server');
    }
    
    // Return the employee data from the response structure
    return employee;
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
    subcategory?: string;
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

  // Get departments for dropdown
  async getDepartments(companyId: string): Promise<Department[]> {
    try {
      const response = await apiClient.getDepartmentsByCompany(companyId);
      console.log('Departments response:', response); // Debug log
      
      if (response.success && response.data) {
        return (response.data as any).departments || [];
      } else {
        console.error('Failed to fetch departments:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  // Get designations for dropdown
  async getDesignations(companyId: string): Promise<Designation[]> {
    try {
      console.log("Fetching designations for company:", companyId);
      const response = await apiClient.getDesignationsByCompany(companyId);
      console.log("Designations response:", response);
      
      if (response.success && response.data) {
        const designations = (response.data as any).designations || [];
        console.log("Returning designations:", designations);
        return designations;
      } else {
        console.error('Failed to fetch designations:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      return [];
    }
  },

  // Get roles for dropdown
  getRoles(): Array<{ value: string; label: string }> {
    return [
      { value: 'employee', label: 'Employee' },
      { value: 'manager', label: 'Manager' }
    ];
  },

  // Get managers for reporting manager dropdown
  async getManagers(companyId: string): Promise<Employee[]> {
    try {
      const response = await this.getEmployees({ companyId });
      // Filter to only include active employees with manager role
      return response.employees.filter(emp => 
        emp.role === 'manager' && emp.status === 'active'
      );
    } catch (error) {
      console.error('Error fetching managers:', error);
      return [];
    }
  },

  // Get team members for a manager
  async getTeamMembersForManager(managerId: string, companyId: string): Promise<Employee[]> {
    try {
      const response = await this.getEmployees({ companyId });
      return response.employees.filter(emp => 
        emp.reportingManager?._id === managerId && emp.status === 'active'
      );
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  },
}; 