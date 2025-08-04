import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface EmployeeDeleteContentProps {
  employee: Employee;
  onCancel: () => void;
  onDelete: () => void;
}

export const EmployeeDeleteContent = ({
  employee,
  onCancel,
  onDelete,
}: EmployeeDeleteContentProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-destructive/10 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div>
          <h3 className="font-medium text-destructive">Delete Employee</h3>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {employee.firstName} {employee.lastName}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete Employee
        </Button>
      </div>
    </div>
  );
}; 