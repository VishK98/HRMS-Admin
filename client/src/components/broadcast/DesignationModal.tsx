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
import { Designation } from "@/types/broadcast";

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
  const [formData, setFormData] = useState<Partial<Designation>>({
    name: "",
    description: "",
    level: 1,
    department: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (designation && mode !== "add") {
      setFormData({
        name: designation.name,
        description: designation.description || "",
        level: designation.level || 1,
        department: designation.department || "",
        isActive: designation.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        level: 1,
        department: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [designation, mode]);

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
    
    if (!validateForm()) return;

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
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Enter department"
                disabled={isViewMode}
              />
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
        </form>

        <DialogFooter>
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
              <Button onClick={handleSubmit}>
                {isAddMode ? "Create" : "Save Changes"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 