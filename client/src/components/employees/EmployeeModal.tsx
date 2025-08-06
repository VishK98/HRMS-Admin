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
import { toast } from "sonner";

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
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});

  // Update editedEmployee when employee prop changes
  useEffect(() => {
    if (employee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee]);

  if (!employee || !editedEmployee) return null;

  const handleSave = async () => {
    try {
      // First, upload all selected files
      if (Object.keys(selectedFiles).length > 0 && editedEmployee?._id) {
        const loadingToast = toast.loading('Uploading documents...');
        
        try {
          // Upload all files
          for (const [type, file] of Object.entries(selectedFiles)) {
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
              continue;
            }
            
            // Update the edited employee with the response from server
            setEditedEmployee(prev => {
              if (prev && updatedEmployee) {
                return {
                  ...updatedEmployee,
                  _id: prev._id || updatedEmployee._id
                };
              }
              return updatedEmployee;
            });
          }
          
          toast.dismiss(loadingToast);
          toast.success('Documents uploaded successfully!');
          
        } catch (error) {
          toast.dismiss(loadingToast);
          console.error('Error uploading files:', error);
          toast.error('Failed to upload some documents');
        }
      }
      
      // Then save the employee details
      if (mode === 'edit' && !employee) {
        // Creating new employee
        if (onSave && editedEmployee) {
          await onSave(editedEmployee);
        }
      } else if (mode === 'edit' && employee) {
        // Updating existing employee
        if (onSave && editedEmployee) {
          await onSave(editedEmployee);
          toast.success('Employee details updated successfully!');
        }
      }
      
      // Clear selected files
      setSelectedFiles({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to update employee details');
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

  const handleFilesSelected = (files: { [key: string]: File }) => {
    setSelectedFiles(files);
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
            onFilesSelected={handleFilesSelected}
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
