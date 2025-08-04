import axios from 'axios';
import { Employee } from '@/types/employee';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface EmployeeFilters {
  department?: string;
  status?: string;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  managerId?: string;
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

export const employeeService = {
  // Get all employees with filters
  async getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  // Get employee by ID
  async getEmployee(id: string): Promise<Employee> {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee
  async deleteEmployee(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Update employee's reporting manager
  async updateReportingManager(employeeId: string, managerId: string): Promise<Employee> {
    const response = await api.put(`/employees/${employeeId}/reporting-manager`, {
      managerId,
    });
    return response.data;
  },

  // Get team members for an employee
  async getTeamMembers(employeeId: string): Promise<Employee[]> {
    const response = await api.get(`/employees/${employeeId}/team-members`);
    return response.data;
  },

  // Get list of all managers
  async getManagers(): Promise<Employee[]> {
    const response = await api.get('/employees/managers/list');
    return response.data;
  },

  // Update employee's leave balance
  async updateLeaveBalance(employeeId: string, leaveBalance: any): Promise<Employee> {
    const response = await api.put(`/employees/${employeeId}/leave-balance`, {
      leaveBalance,
    });
    return response.data;
  },

  // Update employee's salary
  async updateSalary(employeeId: string, salary: any): Promise<Employee> {
    const response = await api.put(`/employees/${employeeId}/salary`, {
      salary,
    });
    return response.data;
  },

  // Upload employee document
  async uploadDocument(
    employeeId: string,
    documentType: string,
    file: File
  ): Promise<Employee> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await api.post(`/employees/${employeeId}/upload-document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get employee statistics
  async getEmployeeStats(): Promise<EmployeeStats> {
    const response = await api.get('/employees/stats/overview');
    return response.data;
  },

  // Search employees
  async searchEmployees(query: string): Promise<Employee[]> {
    const response = await api.get(`/employees?search=${encodeURIComponent(query)}`);
    return response.data.employees;
  },

  // Get employees by department
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    const response = await api.get(`/employees?department=${encodeURIComponent(department)}`);
    return response.data.employees;
  },

  // Get employees by status
  async getEmployeesByStatus(status: string): Promise<Employee[]> {
    const response = await api.get(`/employees?status=${encodeURIComponent(status)}`);
    return response.data.employees;
  },

  // Get employees by role
  async getEmployeesByRole(role: string): Promise<Employee[]> {
    const response = await api.get(`/employees?role=${encodeURIComponent(role)}`);
    return response.data.employees;
  },

  // Get employees by manager
  async getEmployeesByManager(managerId: string): Promise<Employee[]> {
    const response = await api.get(`/employees?managerId=${encodeURIComponent(managerId)}`);
    return response.data.employees;
  },
};

export default employeeService; 