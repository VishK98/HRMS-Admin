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
import { Holiday } from "@/types/broadcast";

interface HolidayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "add";
  holiday: Holiday | null;
  onSave: (holiday: Holiday) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export const HolidayModal = ({
  open,
  onOpenChange,
  mode,
  holiday,
  onSave,
  onDelete,
  onCancel,
}: HolidayModalProps) => {
  const [formData, setFormData] = useState<Partial<Holiday>>({
    name: "",
    date: "",
    description: "",
    type: "public",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (holiday && mode !== "add") {
      setFormData({
        name: holiday.name,
        date: holiday.date,
        description: holiday.description || "",
        type: holiday.type,
        isActive: holiday.isActive,
      });
    } else {
      setFormData({
        name: "",
        date: "",
        description: "",
        type: "public",
        isActive: true,
      });
    }
    setErrors({});
  }, [holiday, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (formData.date && new Date(formData.date) < new Date()) {
      newErrors.date = "Date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const holidayData: Holiday = {
      _id: holiday?._id || "",
      name: formData.name!,
      date: formData.date!,
      description: formData.description,
      type: formData.type!,
      isActive: formData.isActive!,
      createdAt: holiday?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(holidayData);
  };

  const handleDelete = () => {
    if (holiday && onDelete) {
      onDelete(holiday._id);
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
            {isAddMode && "Add New Holiday"}
            {isEditMode && "Edit Holiday"}
            {isViewMode && "Holiday Details"}
          </DialogTitle>
          <DialogDescription>
            {isAddMode && "Create a new holiday for your organization"}
            {isEditMode && "Update the holiday information"}
            {isViewMode && "View holiday details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter holiday name"
              disabled={isViewMode}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isViewMode}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public Holiday</SelectItem>
                  <SelectItem value="company">Company Holiday</SelectItem>
                  <SelectItem value="optional">Optional Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              disabled={isViewMode}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          {isViewMode && holiday && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{new Date(holiday.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm">{new Date(holiday.updatedAt).toLocaleDateString()}</span>
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