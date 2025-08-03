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
import { DesignationModal } from "./DesignationModal";
import { Designation } from "@/types/broadcast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export const DesignationManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("view");
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);

  // Fetch designations from API
  useEffect(() => {
    if (user?.company?._id) {
      fetchDesignations();
    }
  }, [user]);

  // Filter designations when search term or status filter changes
  useEffect(() => {
    filterDesignations();
  }, [designations, searchTerm, statusFilter]);

  const fetchDesignations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch designations from the API
      const response = await apiClient.getDesignationsByCompany(user!.company!._id);
      
      if (response.success && response.data) {
        const data = response.data as { designations: Designation[] };
        setDesignations(data.designations || []);
      } else {
        setError(response.message || "Failed to fetch designations");
      }
    } catch (err) {
      setError("Failed to fetch designations");
      console.error("Error fetching designations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterDesignations = () => {
    const filtered = designations.filter(designation => {
      const matchesSearch = designation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           designation.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || designation.isActive === (statusFilter === "active");
      return matchesSearch && matchesStatus;
    });
    
    setFilteredDesignations(filtered);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-[#843C6D]/10 text-[#843C6D] border border-[#843C6D]/20">Active</Badge> :
      <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Inactive</Badge>;
  };

  const handleViewDetails = (designation: Designation) => {
    setSelectedDesignation(designation);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditDesignation = (designation: Designation) => {
    setSelectedDesignation(designation);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddDesignation = () => {
    console.log("Add designation clicked");
    console.log("Current user:", user);
    console.log("User company:", user?.company);
    
    if (!user?.company?._id) {
      setError("No company ID found. Please contact your administrator.");
      return;
    }
    
    setSelectedDesignation(null);
    setModalMode("add");
    setModalOpen(true);
    console.log("Modal state set:", { modalOpen: true, modalMode: "add" });
  };

  const handleSaveDesignation = async (designation: Designation) => {
    try {
      let response;
      if (modalMode === "add") {
        // Create new designation
        response = await apiClient.createDesignation({ ...designation, companyId: user!.company!._id });
      } else {
        // Update existing designation
        response = await apiClient.updateDesignation(designation._id, designation);
      }
      
      if (response.success) {
        if (modalMode === "add") {
          setDesignations(prev => [...prev, response.data!]);
        } else {
          setDesignations(prev => prev.map(des => des._id === designation._id ? response.data! : des));
        }
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to save designation");
      }
    } catch (err) {
      setError("Failed to save designation");
      console.error("Error saving designation:", err);
    }
  };

  const handleDeleteDesignation = async (designationId: string) => {
    try {
      const response = await apiClient.deleteDesignation(designationId);
      
      if (response.success) {
        setDesignations(prev => prev.filter(des => des._id !== designationId));
        setModalOpen(false);
      } else {
        setError(response.message || "Failed to delete designation");
      }
    } catch (err) {
      setError("Failed to delete designation");
      console.error("Error deleting designation:", err);
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
          <Button onClick={fetchDesignations} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Designation Management</h2>
          <p className="text-muted-foreground">Manage job titles and positions</p>
        </div>
        <Button onClick={handleAddDesignation} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Designation
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Designations</CardTitle>
          <CardDescription>Search and filter designations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search designations..."
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
                  All Designations
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

          {/* Designation Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDesignations.map((designation) => (
                  <TableRow key={designation._id}>
                    <TableCell>
                      <div className="font-medium">{designation.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {designation.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{designation.level || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{designation.department || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(designation.isActive)}
                    </TableCell>
                    <TableCell>
                      {new Date(designation.createdAt).toLocaleDateString()}
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
                            onClick={() => handleViewDetails(designation)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2" 
                            onClick={() => handleEditDesignation(designation)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Designation
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive" 
                            onClick={() => handleDeleteDesignation(designation._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Designation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDesignations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No designations found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Designation Modal */}
      <DesignationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        designation={selectedDesignation}
        onSave={handleSaveDesignation}
        onDelete={handleDeleteDesignation}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}; 