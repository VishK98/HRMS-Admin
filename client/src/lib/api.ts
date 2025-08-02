const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('hrms_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(updateData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Company management (Super Admin only)
  async registerCompany(companyData: any) {
    return this.request('/auth/register-company', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async getAllCompanies() {
    return this.request('/auth/companies');
  }

  async getCompanyById(companyId: string) {
    return this.request(`/auth/companies/${companyId}`);
  }

  async getUsersByCompany(companyId: string) {
    return this.request(`/auth/companies/${companyId}/users`);
  }

  // Regularization requests
  async createRegularizationRequest(requestData: any) {
    return this.request('/regularization/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getEmployeeRegularizationRequests(employeeId: string, startDate: string, endDate: string) {
    return this.request(`/regularization/requests/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`);
  }

  async getCompanyRegularizationRequests(startDate: string, endDate: string, filters?: any) {
    let url = `/regularization/requests/company?startDate=${startDate}&endDate=${endDate}`;
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `&${key}=${filters[key]}`;
        }
      });
    }
    return this.request(url);
  }

  async getRegularizationRequestById(requestId: string) {
    return this.request(`/regularization/requests/${requestId}`);
  }

  async updateRegularizationRequestStatus(requestId: string, status: 'approved' | 'rejected') {
    return this.request(`/regularization/requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteRegularizationRequest(requestId: string) {
    return this.request(`/regularization/requests/${requestId}`, {
      method: 'DELETE',
    });
  }

  // Attendance endpoints
  async checkIn(employeeId: string, location?: any) {
    const requestBody: any = { employeeId };
    if (location) {
      requestBody.location = location;
    }
    
    return this.request('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async checkOut(employeeId: string, location?: any) {
    const requestBody: any = { employeeId };
    if (location) {
      requestBody.location = location;
    }
    
    return this.request('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async getTodaysAttendance(employeeId: string) {
    return this.request(`/attendance/today/${employeeId}`);
  }

  async getAttendanceSummary(startDate: string, endDate: string) {
    return this.request(`/attendance/summary?startDate=${startDate}&endDate=${endDate}`);
  }

  async getCompanyAttendance(startDate: string, endDate: string, filters?: any) {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      ...(filters?.department && { department: filters.department }),
      ...(filters?.status && { status: filters.status }),
    });
    return this.request(`/attendance/company?${queryParams.toString()}`);
  }

  // Leave Management endpoints
  async createLeaveRequest(leaveData: any) {
    return this.request('/leave/requests', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async getLeaveRequests(filters?: any) {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.leaveType) queryParams.append('leaveType', filters.leaveType);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    if (filters?.employeeId) queryParams.append('employeeId', filters.employeeId);

    return this.request(`/leave/requests?${queryParams.toString()}`);
  }

  async getLeaveRequestById(leaveId: string) {
    return this.request(`/leave/requests/${leaveId}`);
  }

  async updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected' | 'cancelled', comments?: string) {
    return this.request(`/leave/requests/${leaveId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comments }),
    });
  }

  async updateManagerAction(leaveId: string, action: 'pending' | 'approved' | 'rejected', comment?: string) {
    return this.request(`/leave/requests/${leaveId}/manager-action`, {
      method: 'PUT',
      body: JSON.stringify({ action, comment }),
    });
  }

  async updateLeaveRequest(leaveId: string, updateData: any) {
    return this.request(`/leave/requests/${leaveId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteLeaveRequest(leaveId: string) {
    return this.request(`/leave/requests/${leaveId}`, {
      method: 'DELETE',
    });
  }

  async getEmployeeLeaveRequests(employeeId: string, startDate?: string, endDate?: string) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    return this.request(`/leave/requests/employee/${employeeId}?${queryParams.toString()}`);
  }

  async getLeaveSummary(startDate?: string, endDate?: string) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    return this.request(`/leave/summary?${queryParams.toString()}`);
  }
}

export const apiClient = new ApiClient(); 
