import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Designation, Department } from "@/types/broadcast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

interface DesignationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "add";
  designation: Designation | null;
  onSave: (designation: Designation) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export const DesignationModal = ({
  open,
  onOpenChange,
  mode,
  designation,
  onSave,
  onDelete,
  onCancel,
}: DesignationModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Designation>>({
    name: "",
    description: "",
    level: 1,
    department: "",
    isActive: true,
  });
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Fetch departments when modal opens
  useEffect(() => {
    console.log("Modal useEffect triggered:", { open, user: user?.company?._id });
    if (open && user?.company?._id) {
      fetchDepartments();
    } else if (open && !user?.company?._id) {
      console.error("No company ID found for user:", user);
    }
  }, [open, user]);

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    
    try {
      console.log("Fetching departments for company:", user!.company!._id);
      console.log("Token available:", !!localStorage.getItem('hrms_token'));
      
      const response = await apiClient.getDepartmentsByCompany(user!.company!._id);
      console.log("Departments response:", response);
      
      if (response.success) {
        const departments = (response.data as any)?.departments || [];
        console.log("Setting departments:", departments);
        setDepartments(departments);
      } else {
        console.error("Failed to fetch departments:", response.message);
        setDepartments([]);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    if (designation && mode !== "add") {
      console.log("Setting form data for edit:", designation);
      // For editing, we need to find the department ID that matches the department name
      const departmentId = departments.find(dept => dept.name === designation.department)?._id || "";
      setFormData({
        name: designation.name,
        description: designation.description || "",
        level: designation.level || 1,
        department: designation.department || "",
        isActive: designation.isActive,
      });
      setSelectedDepartmentId(departmentId);
    } else {
      console.log("Setting form data for add");
      setFormData({
        name: "",
        description: "",
        level: 1,
        department: "",
        isActive: true,
      });
      setSelectedDepartmentId("");
    }
    setErrors({});
  }, [designation, mode, departments]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.level && (formData.level < 1 || formData.level > 10)) {
      newErrors.level = "Level must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    console.log("Validation result:", validateForm());
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    console.log("Creating designation data...");
    console.log("Form data department:", formData.department);
    console.log("Selected department ID:", selectedDepartmentId);
    
    const designationData: Designation = {
      _id: designation?._id || "",
      name: formData.name!,
      description: formData.description,
      level: formData.level,
      department: formData.department,
      isActive: formData.isActive!,
      createdAt: designation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Calling onSave with data:", designationData);
    onSave(designationData);
  };

  const handleDelete = () => {
    if (designation && onDelete) {
      onDelete(designation._id);
    }
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  if (!open) {
    return null;
  }

  // Add error boundary
  try {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode && "Add New Designation"}
            {isEditMode && "Edit Designation"}
            {isViewMode && "Designation Details"}
          </DialogTitle>
          <DialogDescription>
            {isAddMode && "Create a new job designation for your organization"}
            {isEditMode && "Update the designation information"}
            {isViewMode && "View designation details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter designation name"
              disabled={isViewMode}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="10"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                disabled={isViewMode}
                className={errors.level ? "border-destructive" : ""}
              />
              {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartmentId}
                onValueChange={(value) => {
                  const selectedDept = departments.find(dept => dept._id === value);
                  console.log("Selected department:", selectedDept);
                  setSelectedDepartmentId(value);
                  setFormData({ ...formData, department: selectedDept?.name || "" });
                }}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-departments" disabled>
                      {loadingDepartments ? "Loading departments..." : "No departments available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!loadingDepartments && departments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No departments found. Please add departments first.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              disabled={isViewMode}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          {isViewMode && designation && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{new Date(designation.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm">{new Date(designation.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            {isViewMode ? (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Close
                </Button>
                <Button onClick={() => onOpenChange(false)}>
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                {isEditMode && onDelete && (
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
                <Button type="submit">
                  {isAddMode ? "Create" : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
  } catch (error) {
    console.error("Error rendering DesignationModal:", error);
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              An error occurred while loading the designation modal.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p className="text-destructive">Failed to load designation modal. Please try again.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}; 