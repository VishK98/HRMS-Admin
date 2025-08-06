import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Eye,
  Trash2,
  Users,
  Building,
  Calendar,
  TrendingUp,
  UserPlus,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EmployeeModal } from '@/components/employees/EmployeeModal';
import { EmployeeViewContent } from '@/components/employees/EmployeeViewContent';
import { ReportingManagerSelector } from '@/components/employees/ReportingManagerSelector';
import { employeeService, Employee, EmployeeFilters } from '@/services/employeeService';

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  managers: number;
  employees: number;
  departmentStats: Array<{ _id: string; count: number }>;
  statusStats: Array<{ _id: string; count: number }>;
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [showReportingManager, setShowReportingManager] = useState(false);
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

  useEffect(() => {
    loadEmployees();
    loadStats();
  }, [loadEmployees, loadStats]);

  // Handle employee actions
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log('handleEditEmployee called with employee:', employee);
    console.log('Employee ID:', employee._id);
    setSelectedEmployee(employee);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSaveEmployee = async (updatedEmployee: Employee) => {
    try {
      console.log('handleSaveEmployee called with:', {
        modalMode,
        selectedEmployee,
        selectedEmployeeId: selectedEmployee?._id,
        updatedEmployee
      });
      
      if (modalMode === 'edit' && selectedEmployee) {
        // Updating existing employee
        console.log('Updating employee with ID:', selectedEmployee._id);
        await employeeService.updateEmployeeComprehensive(selectedEmployee._id, updatedEmployee);
        toast.success('Employee updated successfully');
      } else if (modalMode === 'edit' && !selectedEmployee) {
        // Creating new employee
        console.log('Creating new employee');
        await employeeService.createEmployee(updatedEmployee);
        toast.success('Employee created successfully');
      }
      setModalOpen(false);
      loadEmployees();
      loadStats();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    }
  };

  const handleDeleteEmployeeConfirm = async (employeeId: string) => {
    try {
      await employeeService.deleteEmployee(employeeId);
      toast.success('Employee deleted successfully');
      setModalOpen(false);
      loadEmployees();
      loadStats();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const handleReportingManagerUpdate = async (employeeId: string, managerId: string | null) => {
    try {
      await employeeService.updateReportingManager(employeeId, managerId);
      toast.success('Reporting manager updated successfully');
      loadEmployees();
    } catch (error) {
      console.error('Error updating reporting manager:', error);
      toast.error('Failed to update reporting manager');
    }
  };

  // Get team members for selected employee
  const getTeamMembers = (employee: Employee) => {
    return employees.filter(emp => 
      emp.reportingManager?._id === employee._id
    );
  };

  // Filter handlers
  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage all employee information and details</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateEmployee} className="bg-[#521138] hover:bg-[#843C6D]">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <Building className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.managers}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Settings className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departmentStats.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={filters.department || ''}
                onValueChange={(value) => handleFilterChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {stats?.departmentStats.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept._id} ({dept.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={filters.role || ''}
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#521138] to-[#843C6D] rounded-full flex items-center justify-center text-white font-bold">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteEmployee(employee)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Employee ID:</span>
                <span className="text-sm font-medium">{employee.employeeId || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department:</span>
                <span className="text-sm font-medium">{employee.department || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Designation:</span>
                <span className="text-sm font-medium">{employee.designation || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  variant={
                    employee.status === 'active' ? 'default' :
                    employee.status === 'inactive' ? 'secondary' :
                    'destructive'
                  }
                  className="text-xs"
                >
                  {employee.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {employee.role}
                </Badge>
              </div>
              {employee.reportingManager && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reports to:</span>
                  <span className="text-sm font-medium">
                    {employee.reportingManager.firstName} {employee.reportingManager.lastName}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowReportingManager(true);
                  }}
                >
                  Manage Team
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Employee Modal */}
      {modalOpen && modalMode !== 'view' && (
        <EmployeeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          employee={selectedEmployee}
          teamMembers={selectedEmployee ? getTeamMembers(selectedEmployee) : []}
          onSave={handleSaveEmployee}
          onDelete={handleDeleteEmployeeConfirm}
        />
      )}

      {/* Employee View Modal */}
      {modalOpen && modalMode === 'view' && selectedEmployee && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            <EmployeeViewContent
              employee={selectedEmployee}
              onEdit={() => {
                setModalMode('edit');
              }}
              onClose={() => setModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Reporting Manager Selector */}
      {showReportingManager && selectedEmployee && (
        <ReportingManagerSelector
          open={showReportingManager}
          onOpenChange={setShowReportingManager}
          employee={selectedEmployee}
          employees={employees}
          onUpdate={handleReportingManagerUpdate}
        />
      )}
    </div>
  );
} 