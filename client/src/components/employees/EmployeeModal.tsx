import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, Phone, MapPin, Calendar, DollarSign, Building, User, IdCard, 
  CreditCard, FileText, Users, UserCheck, UserX, AlertTriangle 
} from "lucide-react";
import { Employee } from "@/types/employee";

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
  onCancel
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
    setEditedEmployee(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNestedInputChange = (parent: keyof Employee, field: string, value: any) => {
    setEditedEmployee(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent] as object || {}),
          [field]: value
        }
      };
    });
  };

  const renderViewContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h3>
            <p className="text-muted-foreground">{employee.employeeId}</p>
          </div>
        </div>
        <Badge className={employee.status === "active" ? "bg-success text-success-foreground" : employee.status === "inactive" ? "bg-destructive text-destructive-foreground" : "bg-warning"}>
          {employee.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(employee.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{employee.gender}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{employee.department}</p>
              <p className="text-sm text-muted-foreground">{employee.designation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined: {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{employee.salary?.basic ? `$${employee.salary.basic.toLocaleString()}` : "Not set"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{employee.address?.street || "Not provided"}</p>
            <p>{employee.address?.city || ""}{employee.address?.city && ", "}{employee.address?.state || ""} {employee.address?.zipCode || ""}</p>
            <p>{employee.address?.country || ""}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Aadhar: {employee.documents?.aadhar || "Not provided"}</p>
            <p>PAN: {employee.documents?.pan || "Not provided"}</p>
            <p>Passport: {employee.documents?.passport || "Not provided"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEditContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={editedEmployee.firstName} 
            onChange={(e) => handleInputChange("firstName", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={editedEmployee.lastName} 
            onChange={(e) => handleInputChange("lastName", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={editedEmployee.email} 
            onChange={(e) => handleInputChange("email", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            value={editedEmployee.phone} 
            onChange={(e) => handleInputChange("phone", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input 
            id="department" 
            value={editedEmployee.department || ""} 
            onChange={(e) => handleInputChange("department", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input 
            id="designation" 
            value={editedEmployee.designation || ""} 
            onChange={(e) => handleInputChange("designation", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={editedEmployee.status} 
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
              <SelectItem value="resigned">Resigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="joiningDate">Joining Date</Label>
          <Input 
            id="joiningDate" 
            type="date" 
            value={editedEmployee.joiningDate ? new Date(editedEmployee.joiningDate).toISOString().split('T')[0] : ""} 
            onChange={(e) => handleInputChange("joiningDate", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basicSalary">Basic Salary</Label>
          <Input 
            id="basicSalary" 
            type="number" 
            value={editedEmployee.salary?.basic || ""} 
            onChange={(e) => handleNestedInputChange("salary", "basic", e.target.value ? Number(e.target.value) : undefined)} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address" 
          value={editedEmployee.address?.street || ""} 
          onChange={(e) => handleNestedInputChange("address", "street", e.target.value)} 
          placeholder="Enter full address"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderDeleteContent = () => (
    <div className="space-y-6">
      <div className="bg-destructive/10 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div>
          <h3 className="font-medium text-destructive">Delete Employee</h3>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium">{employee.firstName} {employee.lastName}</span>? 
            This action cannot be undone.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Employee
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (mode) {
      case "view": return "Employee Details";
      case "edit": return "Edit Employee";
      case "delete": return "Delete Employee";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "view" && "View detailed information about the employee"}
            {mode === "edit" && "Edit employee information"}
            {mode === "delete" && "Permanently remove this employee"}
          </DialogDescription>
        </DialogHeader>
        
        {mode === "view" && renderViewContent()}
        {mode === "edit" && renderEditContent()}
        {mode === "delete" && renderDeleteContent()}
      </DialogContent>
    </Dialog>
  );
};
