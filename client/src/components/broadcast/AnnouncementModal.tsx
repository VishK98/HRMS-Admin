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
import { Announcement } from "@/types/broadcast";

interface AnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "add";
  announcement: Announcement | null;
  onSave: (announcement: Announcement) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export const AnnouncementModal = ({
  open,
  onOpenChange,
  mode,
  announcement,
  onSave,
  onDelete,
  onCancel,
}: AnnouncementModalProps) => {
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    type: "general",
    targetAudience: "all",
    targetIds: [],
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (announcement && mode !== "add") {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        targetAudience: announcement.targetAudience,
        targetIds: announcement.targetIds || [],
        startDate: announcement.startDate || "",
        endDate: announcement.endDate || "",
        isActive: announcement.isActive,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        type: "general",
        targetAudience: "all",
        targetIds: [],
        startDate: "",
        endDate: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [announcement, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const announcementData: Announcement = {
      _id: announcement?._id || "",
      title: formData.title!,
      content: formData.content!,
      type: formData.type!,
      targetAudience: formData.targetAudience!,
      targetIds: formData.targetIds,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive!,
      createdAt: announcement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(announcementData);
  };

  const handleDelete = () => {
    if (announcement && onDelete) {
      onDelete(announcement._id);
    }
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode && "Add New Announcement"}
            {isEditMode && "Edit Announcement"}
            {isViewMode && "Announcement Details"}
          </DialogTitle>
          <DialogDescription>
            {isAddMode && "Create a new announcement for your organization"}
            {isEditMode && "Update the announcement information"}
            {isViewMode && "View announcement details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              disabled={isViewMode}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => setFormData({ ...formData, targetAudience: value as any })}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="designation">Designation</SelectItem>
                  <SelectItem value="specific">Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter announcement content"
              disabled={isViewMode}
              rows={4}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={isViewMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isViewMode}
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
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

          {isViewMode && announcement && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm">{new Date(announcement.updatedAt).toLocaleDateString()}</span>
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