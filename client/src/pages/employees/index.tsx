import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Employee } from '@/types/employee';
import { employeeService, EmployeeFilters, EmployeeStats } from '@/services/employeeService';
import { EmployeeModal } from '@/components/employees';
import { ReportingManagerSelector } from '@/components/employees';
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
  Users,
  UserCheck,
  Edit,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  UserPlus,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeManagement() {
  const router = useRouter();
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
  const loadEmployees = async () => {
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
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const statsData = await employeeService.getEmployeeStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadEmployees();
    loadStats();
  }, [filters]);

  // Handle employee actions
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('delete');
    setModalOpen(true);
  };

  const handleSaveEmployee = async (updatedEmployee: Employee) => {
    try {
      if (modalMode === 'edit' && selectedEmployee) {
        // Updating existing employee
        await employeeService.updateEmployee(updatedEmployee._id, updatedEmployee);
        toast.success('Employee updated successfully');
      } else if (modalMode === 'edit' && !selectedEmployee) {
        // Creating new employee
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

  const handleUpdateReportingManager = async (employeeId: string, managerId: string) => {
    try {
      await employeeService.updateReportingManager(employeeId, managerId);
      toast.success('Reporting manager updated successfully');
      loadEmployees();
    } catch (error) {
      console.error('Error updating reporting manager:', error);
      toast.error('Failed to update reporting manager');
    }
  };

  const getTeamMembers = (employeeId: string) => {
    return employees.filter((emp) => emp.reportingManager?._id === employeeId);
  };

  const handleFilterChange = (key: keyof EmployeeFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage your organization's employees</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowReportingManager(!showReportingManager)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Reporting
          </Button>
          <Button
            onClick={() => {
              setSelectedEmployee(null);
              setModalMode('edit');
              setModalOpen(true);
            }}
            className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.managers}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.departmentStats.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">{stats.inactiveEmployees}</p>
                </div>
                <UserCheck className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  onChange={(e) => handleSearch(e.target.value)}
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
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
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
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
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
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={clearFilters}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <div className="text-sm text-gray-600">
              Showing {pagination.totalItems} employees
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#843C6D]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <Card key={employee._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {employee.firstName} {employee.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{employee.designation}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {employee.reportingManager && (
                      <UserCheck className="h-4 w-4 text-blue-600" title="Has Manager" />
                    )}
                    {getTeamMembers(employee._id).length > 0 && (
                      <Users className="h-4 w-4 text-green-600" title="Has Team Members" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    className={`${
                      employee.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : employee.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {employee.status}
                  </Badge>
                </div>
                {employee.reportingManager && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-medium">
                      {employee.reportingManager.firstName} {employee.reportingManager.lastName}
                    </span>
                  </div>
                )}
                {getTeamMembers(employee._id).length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Team Members:</span>
                    <span className="font-medium">{getTeamMembers(employee._id).length}</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewEmployee(employee)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEmployee(employee)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
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
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Reporting Manager Management */}
      {showReportingManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reporting Structure Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee._id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">
                    {employee.firstName} {employee.lastName} - {employee.designation}
                  </h3>
                  <ReportingManagerSelector
                    employee={employee}
                    allEmployees={employees}
                    onUpdateReportingManager={handleUpdateReportingManager}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Modal */}
      {selectedEmployee && (
        <EmployeeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          employee={selectedEmployee}
          teamMembers={getTeamMembers(selectedEmployee._id)}
          onSave={handleSaveEmployee}
          onDelete={handleDeleteEmployeeConfirm}
        />
      )}
    </div>
  );
} 