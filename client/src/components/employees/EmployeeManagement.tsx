import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Plus, Search, Filter, Download, Edit, Trash2, Eye, 
  Mail, Phone, MapPin, MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeModal } from "./EmployeeModal";
import { Employee } from "@/types/employee";
import { useAuth } from "@/contexts/AuthContext";
import { employeeService } from "@/services/employeeService";
import { toast } from "sonner";

export const EmployeeManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">("view");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Fetch employees from API
  useEffect(() => {
    if (user?.company?._id) {
      fetchEmployees();
    }
  }, [user]);

  // Filter employees when search term or status filter changes
  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('User object:', user); // Debug log
      console.log('Company ID:', user?.company?._id); // Debug log
      
      // Check if user is authenticated
      const token = localStorage.getItem('hrms_token');
      console.log('Token exists:', !!token); // Debug log
      
      if (!user?.company?._id) {
        throw new Error('User not authenticated or company not found');
      }
      
      console.log('Fetching employees for company:', user.company._id); // Debug log
      
      // Fetch employees using the employee service
      const response = await employeeService.getEmployees({
        companyId: user.company._id,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      
      console.log('Employee service response:', response); // Debug log
      
      setEmployees(response.employees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    const filtered = employees.filter(emp => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    setFilteredEmployees(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "inactive":
        return <Badge className="bg-destructive text-destructive-foreground">Inactive</Badge>;
      case "terminated":
        return <Badge className="bg-destructive text-destructive-foreground">Terminated</Badge>;
      case "resigned":
        return <Badge variant="secondary">Resigned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("delete");
    setModalOpen(true);
  };

  const handleSaveEmployee = async (updatedEmployee: Employee) => {
    try {
      console.log('Updating employee with data:', updatedEmployee); // Debug log
      
      // Use the employee service to update the employee
      const response = await employeeService.updateEmployeeComprehensive(
        updatedEmployee._id,
        updatedEmployee
      );
      
      console.log('Update response:', response); // Debug log
      
      // Ensure we have valid response data
      if (!response || !response._id) {
        throw new Error('Invalid response from server');
      }
      
      // Update the employee in the state
      setEmployees(prev => {
        console.log('Previous employees state:', prev); // Debug log
        const updated = prev.map(emp => emp._id === updatedEmployee._id ? response : emp);
        console.log('Updated employees state:', updated); // Debug log
        return updated;
      });
      
      setFilteredEmployees(prev => {
        console.log('Previous filtered employees state:', prev); // Debug log
        const updated = prev.map(emp => emp._id === updatedEmployee._id ? response : emp);
        console.log('Updated filtered employees state:', updated); // Debug log
        return updated;
      });
      
      // Show success notification
      toast.success("Employee updated successfully!");
      
      // Close modal after save
      setModalOpen(false);
      
      // Fallback: Refresh the employee list after a short delay to ensure data consistency
      setTimeout(() => {
        console.log('Refreshing employee list as fallback...'); // Debug log
        fetchEmployees();
      }, 1000);
      
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error("Failed to update employee");
      setError("Failed to update employee");
      
      // If update fails, refresh the list to ensure we have the latest data
      setTimeout(() => {
        fetchEmployees();
      }, 1000);
    }
  };

  const handleDeleteConfirm = async (employeeId: string) => {
    try {
      // Use the employee service to deactivate the employee
      await employeeService.updateEmployee(employeeId, { status: "terminated" });
      
      // Update the employee status in the state
      setEmployees(prev => prev.map(emp => emp._id === employeeId ? { ...emp, status: "terminated" } : emp));
      setFilteredEmployees(prev => prev.map(emp => emp._id === employeeId ? { ...emp, status: "terminated" } : emp));
      
      // Show success notification
      toast.success("Employee terminated successfully!");
      
      // Close modal after delete
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to terminate employee");
      setError("Failed to delete employee");
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">Manage your organization's workforce</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 hover:bg-[#843C6D] hover:text-white transition-colors">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchEmployees} className="mt-2">Retry</Button>
          </div>
        </div>
      )}

      {/* Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Search and filter employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter.replace("_", " ")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Employees
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("terminated")}>
                      Terminated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("resigned")}>
                      Resigned
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Employee Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Department & Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                            <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3" />
                              {employee.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {employee.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{employee.department}</p>
                            <div className="text-sm text-muted-foreground">
                              {employee.subcategory && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                                  {employee.subcategory}
                                </span>
                              )}
                              {employee.designation}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(employee.status)}
                        </TableCell>
                        <TableCell>
                          {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {employee.salary?.basic ? `$${employee.salary.basic.toLocaleString()}` : "N/A"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="gap-2" 
                                onClick={() => handleViewDetails(employee)}
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2" 
                                onClick={() => handleEditEmployee(employee)}
                              >
                                <Edit className="w-4 h-4" />
                                Edit Employee
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 text-destructive" 
                                onClick={() => handleDeleteEmployee(employee)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Employee
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No employees found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        onDelete={handleDeleteConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
