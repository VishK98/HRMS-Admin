import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DepartmentModal } from "./DepartmentModal";
import { Department } from "@/types/broadcast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export const DepartmentManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Fetch departments from API
  useEffect(() => {
    if (user?.company?._id) {
      fetchDepartments();
    }
  }, [user]);

  // Filter departments when search term or status filter changes
  useEffect(() => {
    filterDepartments();
  }, [departments, searchTerm, statusFilter]);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch departments from the API
      const response = await apiClient.getDepartmentsByCompany(user!.company!._id);
      
      if (response.success) {
        setDepartments(response.data!.departments);
      } else {
        setError(response.message || "Failed to fetch departments");
      }
    } catch (err) {
      setError("Failed to fetch departments");
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterDepartments = () => {
    const filtered = departments.filter(department => {
      const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           department.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || department.isActive === (statusFilter === "active");
      return matchesSearch && matchesStatus;
    });
    
    setFilteredDepartments(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-[#843C6D]/10 text-[#843C6D] border border-[#843C6D]/20">Active</Badge> :
      <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Inactive</Badge>;
  };

  const handleViewDetails = (department: Department) => {
    setSelectedDepartment(department);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleSaveDepartment = async (department: Department) => {
    try {
      let response;
      if (modalMode === "add") {
        // Create new department
        response = await apiClient.createDepartment({ ...department, companyId: user!.company!._id });
      } else {
        // Update existing department
        response = await apiClient.updateDepartment(department._id, department);
      }
      
      if (response.success) {
        if (modalMode === "add") {
          setDepartments(prev => [...prev, response.data!]);
        } else {
          setDepartments(prev => prev.map(dept => dept._id === department._id ? response.data! : dept));
        }
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to save department");
      }
    } catch (err) {
      setError("Failed to save department");
      console.error("Error saving department:", err);
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      const response = await apiClient.deleteDepartment(departmentId);
      
      if (response.success) {
        setDepartments(prev => prev.filter(dept => dept._id !== departmentId));
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to delete department");
      }
    } catch (err) {
      setError("Failed to delete department");
      console.error("Error deleting department:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchDepartments} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Department Management</h2>
          <p className="text-muted-foreground">Manage organizational departments</p>
        </div>
        <Button onClick={handleAddDepartment} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Search and filter departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-[#843C6D] hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Departments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Department Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Sub Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department._id}>
                    <TableCell>
                      <div className="font-medium">{department.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {department.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{department.manager || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {department.subCategories && department.subCategories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {department.subCategories.slice(0, 2).map((sub, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {sub.name}
                              </Badge>
                            ))}
                            {department.subCategories.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{department.subCategories.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(department.isActive)}
                    </TableCell>
                    <TableCell>
                      {new Date(department.createdAt).toLocaleDateString()}
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
                            onClick={() => handleViewDetails(department)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2" 
                            onClick={() => handleEditDepartment(department)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Department
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive" 
                            onClick={() => handleDeleteDepartment(department._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Department
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No departments found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Modal */}
      <DepartmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        department={selectedDepartment}
        onSave={handleSaveDepartment}
        onDelete={handleDeleteDepartment}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}; 