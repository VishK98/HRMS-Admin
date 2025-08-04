import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { employeeService, EmployeeFilters, EmployeeStats } from '@/services/employeeService';
import { toast } from 'sonner';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Load employees
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployees(filters);
      setEmployees(response.employees);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load statistics
  const loadStats = useCallback(async () => {
    try {
      const statsData = await employeeService.getEmployeeStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  // Create employee
  const createEmployee = useCallback(async (employeeData: Partial<Employee>) => {
    try {
      const newEmployee = await employeeService.createEmployee(employeeData);
      toast.success('Employee created successfully');
      await loadEmployees();
      await loadStats();
      return newEmployee;
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Failed to create employee');
      throw error;
    }
  }, [loadEmployees, loadStats]);

  // Update employee
  const updateEmployee = useCallback(async (id: string, employeeData: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeeService.updateEmployee(id, employeeData);
      toast.success('Employee updated successfully');
      await loadEmployees();
      await loadStats();
      return updatedEmployee;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
      throw error;
    }
  }, [loadEmployees, loadStats]);

  // Delete employee
  const deleteEmployee = useCallback(async (id: string) => {
    try {
      await employeeService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      await loadEmployees();
      await loadStats();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
      throw error;
    }
  }, [loadEmployees, loadStats]);

  // Update reporting manager
  const updateReportingManager = useCallback(async (employeeId: string, managerId: string) => {
    try {
      const updatedEmployee = await employeeService.updateReportingManager(employeeId, managerId);
      toast.success('Reporting manager updated successfully');
      await loadEmployees();
      return updatedEmployee;
    } catch (error) {
      console.error('Error updating reporting manager:', error);
      toast.error('Failed to update reporting manager');
      throw error;
    }
  }, [loadEmployees]);

  // Get team members
  const getTeamMembers = useCallback((employeeId: string) => {
    return employees.filter((emp) => emp.reportingManager?._id === employeeId);
  }, [employees]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  // Update pagination
  const updatePagination = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  // Search employees
  const searchEmployees = useCallback(async (query: string) => {
    try {
      const results = await employeeService.searchEmployees(query);
      return results;
    } catch (error) {
      console.error('Error searching employees:', error);
      toast.error('Failed to search employees');
      return [];
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadEmployees();
    loadStats();
  }, [loadEmployees, loadStats]);

  return {
    employees,
    loading,
    stats,
    filters,
    pagination,
    loadEmployees,
    loadStats,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateReportingManager,
    getTeamMembers,
    updateFilters,
    updatePagination,
    searchEmployees,
  };
}; 