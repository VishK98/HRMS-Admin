import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";
import { EmployeeViewContent } from "./EmployeeViewContent";
import { EmployeeEditContent } from "./EmployeeEditContent";
import { EmployeeDeleteContent } from "./EmployeeDeleteContent";

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "delete";
  employee: Employee | null;
  onSave?: (updatedEmployee: Employee) => void;
  onDelete?: (employeeId: string) => void;
  onCancel?: () => void;
}

export const EmployeeModal = ({
  open,
  onOpenChange,
  mode,
  employee,
  onSave,
  onDelete,
  onCancel,
}: EmployeeModalProps) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);

  // Update editedEmployee when employee prop changes
  useEffect(() => {
    if (employee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee]);

  if (!employee || !editedEmployee) return null;

  const handleSave = () => {
    if (onSave && editedEmployee) {
      onSave(editedEmployee);
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete && employee._id) {
      onDelete(employee._id);
    }
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof Employee, value: any) => {
    setEditedEmployee((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleNestedInputChange = (
    parent: keyof Employee,
    field: string,
    value: any
  ) => {
    setEditedEmployee((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent] as object || {}),
          [field]: value,
        },
      };
    });
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Employee Details";
      case "edit":
        return "Edit Employee";
      case "delete":
        return "Delete Employee";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "view":
        return "View detailed information about the employee";
      case "edit":
        return "Edit employee information";
      case "delete":
        return "Permanently remove this employee";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (mode) {
      case "view":
        return <EmployeeViewContent employee={employee} />;
      case "edit":
        return (
          <EmployeeEditContent
            editedEmployee={editedEmployee}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case "delete":
        return (
          <EmployeeDeleteContent
            employee={employee}
            onCancel={onCancel || (() => onOpenChange(false))}
            onDelete={handleDelete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-base">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] scrollbar-hide">
          {renderContent()}
        </div>

        {/* Action Buttons for Edit Mode */}
        {mode === "edit" && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel || (() => onOpenChange(false))} className="hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90"
            >
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
