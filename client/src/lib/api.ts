const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("hrms_token");
    return {
      "Content-Type": "application/json",
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

    console.log("Making request to:", url); // Debug log
    console.log("Request headers:", config.headers); // Debug log

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log("Response status:", response.status); // Debug log
      console.log("Response data:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("Request error:", error); // Debug log
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  // Method for FormData uploads (without Content-Type header)
  async uploadRequest<T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("hrms_token");

    const config: RequestInit = {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...options.headers,
      },
    };

    console.log("Making upload request to:", url); // Debug log

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log("Upload response status:", response.status); // Debug log
      console.log("Upload response data:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      return data;
    } catch (error) {
      console.error("Upload request error:", error); // Debug log
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async updateProfile(updateData: any) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  // Company management (Super Admin only)
  async registerCompany(companyData: any) {
    return this.request("/auth/register-company", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
  }

  async getCompanyById(companyId: string) {
    return this.request(`/auth/companies/${companyId}`);
  }

  // async getUsersByCompany(companyId: string) {
  //   return this.request(`/auth/companies/${companyId}/users`);
  // }

  // Regularization requests
  async createRegularizationRequest(requestData: any) {
    return this.request("/regularization/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async getEmployeeRegularizationRequests(
    employeeId: string,
    startDate: string,
    endDate: string
  ) {
    return this.request(
      `/regularization/requests/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`
    );
  }

  async getCompanyRegularizationRequests(
    startDate: string,
    endDate: string,
    filters?: any
  ) {
    let url = `/regularization/requests/company?startDate=${startDate}&endDate=${endDate}`;
    if (filters) {
      Object.keys(filters).forEach((key) => {
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

  async updateRegularizationRequestStatus(
    requestId: string,
    status: "approved" | "rejected"
  ) {
    return this.request(`/regularization/requests/${requestId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async deleteRegularizationRequest(requestId: string) {
    return this.request(`/regularization/requests/${requestId}`, {
      method: "DELETE",
    });
  }

  // Attendance endpoints
  async checkIn(employeeId: string, location?: any) {
    const requestBody: any = { employeeId };
    if (location) {
      requestBody.location = location;
    }

    return this.request("/attendance/check-in", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  async checkOut(employeeId: string, location?: any) {
    const requestBody: any = { employeeId };
    if (location) {
      requestBody.location = location;
    }

    return this.request("/attendance/check-out", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  async getTodaysAttendance(employeeId: string) {
    return this.request(`/attendance/today/${employeeId}`);
  }

  async getAttendanceSummary(
    startDate: string,
    endDate: string,
    employeeId?: string
  ) {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      ...(employeeId ? { employeeId } : {}),
    });
    return this.request(`/attendance/summary?${queryParams}`);
  }

  async getCompanyAttendance(
    startDate: string,
    endDate: string,
    filters?: any
  ) {
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
    return this.request("/leave/requests", {
      method: "POST",
      body: JSON.stringify(leaveData),
    });
  }

  async getLeaveRequests(filters?: any) {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.leaveType) queryParams.append("leaveType", filters.leaveType);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);
    if (filters?.employeeId)
      queryParams.append("employeeId", filters.employeeId);

    return this.request(`/leave/requests?${queryParams.toString()}`);
  }

  async getLeaveRequestById(leaveId: string) {
    return this.request(`/leave/requests/${leaveId}`);
  }

  async updateLeaveStatus(
    leaveId: string,
    status: "approved" | "rejected" | "cancelled",
    comments?: string
  ) {
    return this.request(`/leave/requests/${leaveId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, comments }),
    });
  }

  async updateManagerAction(
    leaveId: string,
    action: "pending" | "approved" | "rejected",
    comment?: string
  ) {
    return this.request(`/leave/requests/${leaveId}/manager-action`, {
      method: "PUT",
      body: JSON.stringify({ action, comment }),
    });
  }

  async updateLeaveRequest(leaveId: string, updateData: any) {
    return this.request(`/leave/requests/${leaveId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteLeaveRequest(leaveId: string) {
    return this.request(`/leave/requests/${leaveId}`, {
      method: "DELETE",
    });
  }

  async getEmployeeLeaveRequests(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    return this.request(
      `/leave/requests/employee/${employeeId}?${queryParams.toString()}`
    );
  }

  async getLeaveSummary(startDate?: string, endDate?: string) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    return this.request(`/leave/summary?${queryParams.toString()}`);
  }

  // Employee Management
  async getEmployeesByCompany(companyId: string) {
    return this.request(`/employees/company/${companyId}`);
  }

  async getEmployeeById(employeeId: string) {
    return this.request(`/employees/${employeeId}`);
  }

  async createEmployee(employeeData: any) {
    return this.uploadRequest("/employees", employeeData);
  }

  async updateEmployee(employeeId: string, updateData: any) {
    return this.uploadRequest(`/employees/${employeeId}`, updateData);
  }

  async deleteEmployee(employeeId: string) {
    return this.request(`/employees/${employeeId}`, {
      method: "DELETE",
    });
  }

  async uploadEmployeeDocument(
    employeeId: string,
    documentType: string,
    file: File
  ) {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", documentType);

    return this.uploadRequest(`/employees/${employeeId}/documents`, formData);
  }

  async uploadEmployeeEducation(
    employeeId: string,
    educationType: string,
    file: File
  ) {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("educationType", educationType);

    return this.uploadRequest(`/employees/${employeeId}/education`, formData);
  }

  // Designations
  async getDesignationsByCompany(companyId: string) {
    return this.request(`/designations/company/${companyId}`);
  }

  async createDesignation(designationData: any) {
    console.log("API createDesignation called with:", designationData);
    const response = await this.request("/designations", {
      method: "POST",
      body: JSON.stringify(designationData),
    });
    console.log("API createDesignation response:", response);
    return response;
  }

  async updateDesignation(designationId: string, updateData: any) {
    return this.request(`/designations/${designationId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteDesignation(designationId: string) {
    return this.request(`/designations/${designationId}`, {
      method: "DELETE",
    });
  }

  // Departments
  async getDepartmentsByCompany(companyId: string) {
    return this.request(`/departments/company/${companyId}`);
  }

  async createDepartment(departmentData: any) {
    return this.request("/departments", {
      method: "POST",
      body: JSON.stringify(departmentData),
    });
  }

  async updateDepartment(departmentId: string, updateData: any) {
    return this.request(`/departments/${departmentId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteDepartment(departmentId: string) {
    return this.request(`/departments/${departmentId}`, {
      method: "DELETE",
    });
  }

  async addSubCategory(departmentId: string, subCategoryData: any) {
    return this.request(`/departments/${departmentId}/subcategories`, {
      method: "POST",
      body: JSON.stringify(subCategoryData),
    });
  }

  // Holidays
  async getHolidaysByCompany(companyId: string) {
    return this.request(`/holidays/company/${companyId}`);
  }

  async createHoliday(holidayData: any) {
    return this.request("/holidays", {
      method: "POST",
      body: JSON.stringify(holidayData),
    });
  }

  async updateHoliday(holidayId: string, updateData: any) {
    return this.request(`/holidays/${holidayId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteHoliday(holidayId: string) {
    return this.request(`/holidays/${holidayId}`, {
      method: "DELETE",
    });
  }

  // Announcements
  async getAnnouncementsByCompany(companyId: string) {
    return this.request(`/announcements/company/${companyId}`);
  }

  async createAnnouncement(announcementData: any) {
    return this.request("/announcements", {
      method: "POST",
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(announcementId: string, updateData: any) {
    return this.request(`/announcements/${announcementId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteAnnouncement(announcementId: string) {
    return this.request(`/announcements/${announcementId}`, {
      method: "DELETE",
    });
  }

  // Super Admin endpoints
  async getSuperAdminCompanyStats() {
    return this.request("/companies/stats");
  }

  async getSuperAdminUserStats() {
    return this.request("/auth/stats");
  }

  async getSystemHealth() {
    return this.request("/system/health");
  }

  async getAllCompanies() {
    return this.request("/companies/all");
  }

  async getAllUsers() {
    return this.request("/auth/all");
  }

  async getUsersByCompany(companyId: string) {
    return this.request(`/auth/companies/${companyId}/users`);
  }

  // Analytics endpoints
  async getAnalyticsOverview(timeRange: string) {
    return this.request(`/analytics/overview?timeRange=${timeRange}`);
  }

  async getUserAnalytics(timeRange: string) {
    return this.request(`/analytics/users?timeRange=${timeRange}`);
  }

  async getCompanyAnalytics(timeRange: string) {
    return this.request(`/analytics/companies?timeRange=${timeRange}`);
  }

  async getSystemAnalytics(timeRange: string) {
    return this.request(`/analytics/system?timeRange=${timeRange}`);
  }

  async getComprehensiveAnalytics(timeRange: string) {
    return this.request(`/analytics/comprehensive?timeRange=${timeRange}`);
  }

  // Super Admin Activity Analytics
  async getSuperAdminActivityAnalytics(timeRange: string) {
    return this.request(`/analytics/activities?timeRange=${timeRange}`);
  }

  // Admin Dashboard endpoints
  async getAdminEmployeesByCompany(companyId: string, filters?: any) {
    if (!companyId) {
      console.error("Company ID is required for getEmployeesByCompany");
      return {
        success: false,
        message: "Company ID is required",
        data: [],
      };
    }

    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `/admin/employees/company/${companyId}${
      queryString ? `?${queryString}` : ""
    }`;
    return this.request(url);
  }

  async getAdminAttendanceSummary(startDate: string, endDate: string) {
    return this.request(
      `/admin/attendance/summary?startDate=${startDate}&endDate=${endDate}`
    );
  }

  async getAdminLeaveRequests(filters?: Record<string, unknown>) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `/admin/leave/requests${queryString ? `?${queryString}` : ""}`;
    return this.request(url);
  }

  async getAdminActivityAnalytics(timeRange: string) {
    return this.request(`/admin/analytics/activities?timeRange=${timeRange}`);
  }

  async getAdminCompanyStats() {
    return this.request("/admin/company/stats");
  }

  async getLeaveStatusToday() {
    return this.request("/admin/leave/status/today");
  }
}

export const apiClient = new ApiClient();
