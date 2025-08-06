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
import { employeeService } from "@/services/employeeService";

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "delete";
  employee: Employee | null;
  teamMembers?: Employee[]; // For showing team members if employee is a manager
  onSave?: (updatedEmployee: Employee) => void;
  onDelete?: (employeeId: string) => void;
  onCancel?: () => void;
}

export const EmployeeModal = ({
  open,
  onOpenChange,
  mode,
  employee,
  teamMembers = [],
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

  const handleSave = async () => {
    try {
      if (mode === 'edit' && !employee) {
        // Creating new employee
        if (onSave && editedEmployee) {
          await onSave(editedEmployee);
        }
      } else if (mode === 'edit' && employee) {
        // Updating existing employee
        if (onSave && editedEmployee) {
          await onSave(editedEmployee);
        }
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
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

  const handleFileUpload = async (type: string, file: File | null) => {
    if (!editedEmployee || !editedEmployee._id) {
      console.error('No employee selected for file upload');
      return;
    }

    try {
      if (file) {
        console.log(`Uploading file for ${type}:`, file.name);
        
        let updatedEmployee: Employee;
        
        // Determine which section this file belongs to and upload accordingly
        if (type === "aadhar" || type === "pan" || type === "passport" || 
            type === "drivingLicense" || type === "voterId" || type === "relievingLetter" ||
            type === "experienceLetter" || type === "lastPayslip" || type === "passportPhoto" ||
            type === "offerLetter") {
          // Upload to documents endpoint
          updatedEmployee = await employeeService.uploadDocument(editedEmployee._id, type, file);
        } else if (type === "intermediate" || type === "undergraduate" || 
                   type === "postgraduate" || type === "other") {
          // Upload to education endpoint
          updatedEmployee = await employeeService.uploadEducationDocument(editedEmployee._id, type, file);
        } else {
          console.error(`Unknown file type: ${type}`);
          return;
        }
        
        // Update the edited employee with the response from server
        setEditedEmployee(prev => {
          if (prev && updatedEmployee) {
            // Preserve the _id from the original employee
            return {
              ...updatedEmployee,
              _id: prev._id || updatedEmployee._id
            };
          }
          return updatedEmployee;
        });
        
        console.log(`File uploaded successfully for ${type}`);
      } else {
        // Handle file removal - this would need a delete endpoint on the server
        console.log(`File removed for ${type}`);
        
        // For now, just update the local state to remove the file
        setEditedEmployee((prev) => {
          if (!prev) return null;
          
          if (type === "aadhar" || type === "pan" || type === "passport" || 
              type === "drivingLicense" || type === "voterId" || type === "relievingLetter" ||
              type === "experienceLetter" || type === "lastPayslip" || type === "passportPhoto" ||
              type === "offerLetter") {
            const newDocuments = { ...(prev.documents || {}) };
            delete newDocuments[type];
            return {
              ...prev,
              documents: newDocuments,
            };
          }
          
          return prev;
        });
      }
    } catch (error) {
      console.error(`Error uploading file for ${type}:`, error);
      // You might want to show a toast notification here
      alert(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
        return <EmployeeViewContent employee={employee} teamMembers={teamMembers} />;
      case "edit":
        return (
          <EmployeeEditContent
            editedEmployee={editedEmployee}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            handleFileUpload={handleFileUpload}
            onSave={handleSave}
            onCancel={onCancel || (() => onOpenChange(false))}
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
      </DialogContent>
    </Dialog>
  );
};
