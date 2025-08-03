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
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { Department, SubCategory } from "@/types/broadcast";

interface DepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "add";
  department: Department | null;
  onSave: (department: Department) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export const DepartmentModal = ({
  open,
  onOpenChange,
  mode,
  department,
  onSave,
  onDelete,
  onCancel,
}: DepartmentModalProps) => {
  const [formData, setFormData] = useState<Partial<Department>>({
    name: "",
    description: "",
    manager: "",
    subCategories: [],
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subCategoryForm, setSubCategoryForm] = useState<Partial<SubCategory>>({
    name: "",
    description: "",
    isActive: true,
  });
  const [editingSubCategory, setEditingSubCategory] = useState<number | null>(null);

  useEffect(() => {
    if (department && mode !== "add") {
      setFormData({
        name: department.name,
        description: department.description || "",
        manager: department.manager || "",
        subCategories: department.subCategories || [],
        isActive: department.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        manager: "",
        subCategories: [],
        isActive: true,
      });
    }
    setErrors({});
    setSubCategoryForm({ name: "", description: "", isActive: true });
    setEditingSubCategory(null);
  }, [department, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const departmentData: Department = {
      _id: department?._id || "",
      name: formData.name!,
      description: formData.description,
      manager: formData.manager,
      subCategories: formData.subCategories || [],
      isActive: formData.isActive!,
      createdAt: department?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(departmentData);
  };

  const handleDelete = () => {
    if (department && onDelete) {
      onDelete(department._id);
    }
  };

  const handleAddSubCategory = () => {
    if (!subCategoryForm.name?.trim()) return;
    
    const newSubCategory: SubCategory = {
      name: subCategoryForm.name,
      description: subCategoryForm.description,
      isActive: subCategoryForm.isActive!,
    };
    
    setFormData(prev => ({
      ...prev,
      subCategories: [...(prev.subCategories || []), newSubCategory]
    }));
    
    setSubCategoryForm({ name: "", description: "", isActive: true });
  };

  const handleEditSubCategory = (index: number) => {
    const subCategory = formData.subCategories?.[index];
    if (subCategory) {
      setSubCategoryForm(subCategory);
      setEditingSubCategory(index);
    }
  };

  const handleUpdateSubCategory = () => {
    if (!subCategoryForm.name?.trim() || editingSubCategory === null) return;
    
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories?.map((sub, index) => 
        index === editingSubCategory 
          ? { ...subCategoryForm, name: subCategoryForm.name!, description: subCategoryForm.description, isActive: subCategoryForm.isActive! }
          : sub
      ) || []
    }));
    
    setSubCategoryForm({ name: "", description: "", isActive: true });
    setEditingSubCategory(null);
  };

  const handleDeleteSubCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCancelSubCategory = () => {
    setSubCategoryForm({ name: "", description: "", isActive: true });
    setEditingSubCategory(null);
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode && "Add New Department"}
            {isEditMode && "Edit Department"}
            {isViewMode && "Department Details"}
          </DialogTitle>
          <DialogDescription>
            {isAddMode && "Create a new department for your organization"}
            {isEditMode && "Update the department information"}
            {isViewMode && "View department details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter department name"
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

          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              placeholder="Enter manager name"
              disabled={isViewMode}
            />
          </div>

          {/* Subcategories Section */}
          {!isViewMode && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Sub Categories</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubCategory}
                  disabled={!subCategoryForm.name?.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub Category
                </Button>
              </div>

              {/* Subcategory Form */}
              <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="subCategoryName">Name *</Label>
                    <Input
                      id="subCategoryName"
                      value={subCategoryForm.name}
                      onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                      placeholder="Sub category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subCategoryDescription">Description</Label>
                    <Input
                      id="subCategoryDescription"
                      value={subCategoryForm.description}
                      onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                      placeholder="Description"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="subCategoryActive"
                    checked={subCategoryForm.isActive}
                    onCheckedChange={(checked) => setSubCategoryForm({ ...subCategoryForm, isActive: checked })}
                  />
                  <Label htmlFor="subCategoryActive">Active</Label>
                </div>
                <div className="flex space-x-2">
                  {editingSubCategory !== null ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUpdateSubCategory}
                        disabled={!subCategoryForm.name?.trim()}
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelSubCategory}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddSubCategory}
                      disabled={!subCategoryForm.name?.trim()}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </div>

              {/* Subcategories List */}
              {formData.subCategories && formData.subCategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Sub Categories</Label>
                  <div className="space-y-2">
                    {formData.subCategories.map((subCategory, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-background">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{subCategory.name}</span>
                            {subCategory.isActive ? (
                              <Badge variant="default" className="text-xs">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                          {subCategory.description && (
                            <p className="text-sm text-muted-foreground mt-1">{subCategory.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSubCategory(index)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubCategory(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View Subcategories */}
          {isViewMode && formData.subCategories && formData.subCategories.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <Label>Sub Categories</Label>
              <div className="space-y-2">
                {formData.subCategories.map((subCategory, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-muted/30">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{subCategory.name}</span>
                        {subCategory.isActive ? (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                      {subCategory.description && (
                        <p className="text-sm text-muted-foreground mt-1">{subCategory.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              disabled={isViewMode}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          {isViewMode && department && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{new Date(department.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm">{new Date(department.updatedAt).toLocaleDateString()}</span>
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