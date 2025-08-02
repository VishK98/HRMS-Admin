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
}

export const apiClient = new ApiClient(); 