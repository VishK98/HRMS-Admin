import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  Building,
  User,
  IdCard,
  CreditCard,
  FileText,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  X,
  Star,
  Award,
  Target,
  TrendingUp,
  Shield,
  Heart,
  Briefcase,
  GraduationCap,
  BedDouble,
  Crown,
  Users2,
  CalendarDays,
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
          ...((prev[parent] as object) || {}),
          [field]: value,
        },
      };
    });
  };

  const renderViewContent = () => (
    <div className="space-y-8">
      {/* Enhanced Header with Purple Gradient Background */}
      <div className="relative bg-gradient-to-r from-[#521138] to-[#843C6D] rounded-lg px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {employee.firstName.toUpperCase()} {employee.lastName.toUpperCase()}
              </h3>
              <p className="text-white/80 text-xs">{employee.employeeId}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <Building className="h-3 w-3" />
                  <span className="text-xs">
                    {employee.department || "Not assigned"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3" />
                  <span className="text-xs">
                    {employee.designation || "Not assigned"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                employee.status === "active"
                  ? "bg-green-500 text-white"
                  : employee.status === "inactive"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-white"
              } border-0 text-xs`}
            >
              {employee.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats Row - Simple Black Professional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs font-medium text-gray-600">Joined</p>
                <p className="text-sm font-bold text-gray-900">
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="px-3 py-2">
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Basic Salary
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {employee.salary?.basic
                    ? `₹${employee.salary.basic.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs font-medium text-gray-600">Role</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {employee.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Performance
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {employee.performance?.rating
                    ? `${employee.performance.rating}/5`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Simple Black Professional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <User className="h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <Mail className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{employee.email}</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <Phone className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{employee.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <Calendar className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                DOB: {new Date(employee.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <Heart className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900 capitalize">
                Gender: {employee.gender}
              </span>
            </div>
            {employee.maritalStatus && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                <Shield className="h-3 w-3 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 capitalize">
                  Status: {employee.maritalStatus}
                </span>
              </div>
            )}
            {employee.bloodGroup && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                <AlertTriangle className="h-3 w-3 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Blood Group: {employee.bloodGroup}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <Building className="h-4 w-4" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="p-1.5 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">
                Department: {employee.department || "Not assigned"}
              </p>
              <p className="text-xs text-gray-600">
                Designation: {employee.designation || "Not assigned"}
              </p>
            </div>
            {employee.reportingManager && (
              <div className="p-1.5 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">
                  Reporting Manager
                </p>
                <p className="text-xs text-gray-600">
                  {employee.reportingManager.firstName}{" "}
                  {employee.reportingManager.lastName} (
                  {employee.reportingManager.employeeId})
                </p>
              </div>
            )}
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <Calendar className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                Joined:{" "}
                {employee.joiningDate
                  ? new Date(employee.joiningDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <Crown className="h-3 w-3 text-gray-600" />
              <span className="text-sm font-medium text-gray-900 capitalize">
                Role: {employee.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Team Information */}
        {employee.team && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <Users2 className="h-4 w-4" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-3">
              <div className="p-1.5 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">
                  Team: {employee.team.name}
                </p>
                <p className="text-xs text-gray-600">
                  {employee.team.members || 0} members
                </p>
              </div>
              {employee.team.lead && (
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Team Lead</p>
                  <p className="text-xs text-gray-600">
                    {employee.team.lead.firstName} {employee.team.lead.lastName}{" "}
                    ({employee.team.lead.employeeId})
                  </p>
                </div>
              )}
              {employee.team.projects && employee.team.projects.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1.5">
                    Active Projects
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {employee.team.projects.map((project, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-800 text-xs"
                      >
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance Information */}
        {employee.performance && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <TrendingUp className="h-4 w-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-3">
              {employee.performance.rating && (
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <Star className="h-3 w-3 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Rating: {employee.performance.rating}/5
                  </span>
                </div>
              )}
              {employee.performance.lastReview && (
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <Calendar className="h-3 w-3 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Last Review:{" "}
                    {new Date(
                      employee.performance.lastReview
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {employee.performance.achievements &&
                employee.performance.achievements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1.5">
                      Achievements
                    </p>
                    <div className="space-y-1">
                      {employee.performance.achievements.map(
                        (achievement, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 text-xs"
                          >
                            <Award className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-900">{achievement}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {/* Leave Balance Information */}
        {employee.leaveBalance && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <CalendarDays className="h-4 w-4" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-1.5 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">Paid Leave</p>
                  <p className="text-gray-900 font-bold">
                    {employee.leaveBalance.paid || 0} days
                  </p>
                </div>
                <div className="p-1.5 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">Casual Leave</p>
                  <p className="text-gray-900 font-bold">
                    {employee.leaveBalance.casual || 0} days
                  </p>
                </div>
                <div className="p-1.5 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">Sick Leave</p>
                  <p className="text-gray-900 font-bold">
                    {employee.leaveBalance.sick || 0} days
                  </p>
                </div>
                <div className="p-1.5 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">Short Leave</p>
                  <p className="text-gray-900 font-bold">
                    {employee.leaveBalance.short || 0} days
                  </p>
                </div>
                <div className="p-1.5 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">
                    Compensatory Off
                  </p>
                  <p className="text-gray-900 font-bold">
                    {employee.leaveBalance.compensatory || 0} days
                  </p>
                </div>
                <div className="p-1.5 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">Total Balance</p>
                  <p className="text-gray-900 font-bold">
                    {employee.leaveBalance.total || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Balance Card - Employee Leave Balance */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <BedDouble className="h-4 w-4" />
              Leave  Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Paid Leave</p>
                <p className="text-gray-900 font-bold">
                  {employee.leaveBalance?.paid || 0} days
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Casual Leave</p>
                <p className="text-gray-900 font-bold">
                  {employee.leaveBalance?.casual || 0} days
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Sick Leave</p>
                <p className="text-gray-900 font-bold">
                  {employee.leaveBalance?.sick || 0} days
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Short Leave</p>
                <p className="text-gray-900 font-bold">
                  {employee.leaveBalance?.short || 0} days
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Comp Off</p>
                <p className="text-gray-900 font-bold">
                  {employee.leaveBalance?.compensatory || 0} days
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Total Leave</p>
                <p className="text-gray-900 font-bold">
                  {employee.leaveBalance?.total || 0} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <IndianRupee className="h-4 w-4" />
              Salary Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Basic Pay</p>
                <p className="text-gray-900">
                  {employee.salary?.basic
                    ? `₹${employee.salary.basic.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">HRA</p>
                <p className="text-gray-900">
                  {employee.salary?.hra
                    ? `₹${employee.salary.hra.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">DA</p>
                <p className="text-gray-900">
                  {employee.salary?.da
                    ? `₹${employee.salary.da.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Special Allowance</p>
                <p className="text-gray-900">
                  {employee.salary?.specialAllowance
                    ? `₹${employee.salary.specialAllowance.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Transport Allowance</p>
                <p className="text-gray-900">
                  {employee.salary?.transportAllowance
                    ? `₹${employee.salary.transportAllowance.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Medical Allowance</p>
                <p className="text-gray-900">
                  {employee.salary?.medicalAllowance
                    ? `₹${employee.salary.medicalAllowance.toLocaleString()}`
                    : "Not set"}
                </p>
              </div>
            </div>
            {employee.salary?.totalSalary && (
              <div className="pt-2 border-t border-gray-200">
                <p className="font-bold text-sm text-gray-900">
                  Total: ₹{employee.salary.totalSalary.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <CreditCard className="h-4 w-4" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            {employee.bankDetails ? (
              <>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <CreditCard className="h-3 w-3 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Bank Name
                    </p>
                    <p className="text-xs text-gray-600">
                      {employee.bankDetails.bankName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <FileText className="h-3 w-3 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Account Number
                    </p>
                    <p className="text-xs text-gray-600">
                      {employee.bankDetails.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <IdCard className="h-3 w-3 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      IFSC Code
                    </p>
                    <p className="text-xs text-gray-600">
                      {employee.bankDetails.ifscCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <Building className="h-3 w-3 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Branch
                    </p>
                    <p className="text-xs text-gray-600">
                      {employee.bankDetails.branchName}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Bank details not provided
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Address */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <MapPin className="h-4 w-4" />
              Current Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="flex items-start gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
              <MapPin className="h-3 w-3 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {employee.address?.street || "Not provided"}
                </p>
                <p className="text-xs text-gray-600">
                  {employee.address?.city || ""}
                  {employee.address?.city && ", "}
                  {employee.address?.state || ""}{" "}
                  {employee.address?.zipCode || ""}
                </p>
                <p className="text-xs text-gray-600">
                  {employee.address?.country || ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permanent Address */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <MapPin className="h-4 w-4" />
              Permanent Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            {employee.address?.permanentAddress ? (
              <div className="flex items-start gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                <MapPin className="h-3 w-3 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {employee.address.permanentAddress.street || "Not provided"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {employee.address.permanentAddress.city || ""}
                    {employee.address.permanentAddress.city && ", "}
                    {employee.address.permanentAddress.state || ""}{" "}
                    {employee.address.permanentAddress.zipCode || ""}
                  </p>
                  <p className="text-xs text-gray-600">
                    {employee.address.permanentAddress.country || ""}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Permanent address not provided
              </p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <Phone className="h-4 w-4" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            {employee.emergencyContact ? (
              <>
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    {employee.emergencyContact.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {employee.emergencyContact.relationship}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <Phone className="h-3 w-3 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {employee.emergencyContact.phone}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Emergency contact not provided
              </p>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <IdCard className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Aadhar</p>
                <p className="text-gray-900">
                  {employee.documents?.aadhar || "Not provided"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">PAN</p>
                <p className="text-gray-900">
                  {employee.documents?.pan || "Not provided"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Passport</p>
                <p className="text-gray-900">
                  {employee.documents?.passport || "Not provided"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Driving License</p>
                <p className="text-gray-900">
                  {employee.documents?.drivingLicense || "Not provided"}
                </p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Voter ID</p>
                <p className="text-gray-900">
                  {employee.documents?.voterId || "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <GraduationCap className="h-4 w-4" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            {employee.education ? (
              <>
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    {employee.education.highestQualification}
                  </p>
                  <p className="text-xs text-gray-600">
                    {employee.education.institution}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                  <Calendar className="h-3 w-3 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Completed: {employee.education.yearOfCompletion}
                  </span>
                </div>
                {employee.education.percentage && (
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50">
                    <Target className="h-3 w-3 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Percentage: {employee.education.percentage}%
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Education details not provided
              </p>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        {employee.skills && employee.skills.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <UserCheck className="h-4 w-4" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Work Experience */}
        {employee.workExperience && employee.workExperience.length > 0 && (
          <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <Building className="h-4 w-4" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <div className="space-y-3">
                {employee.workExperience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {exp.position}
                        </p>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(exp.fromDate).toLocaleDateString()} -{" "}
                        {new Date(exp.toDate).toLocaleDateString()}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1.5">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Bottom Padding */}
      <div className="pb-1"></div>
    </div>
  );

  const renderEditContent = () => (
    <div className="space-y-8">
      {/* Edit Header */}
      <div className="relative bg-gradient-to-r from-[#521138] to-[#843C6D] rounded-lg px-4 py-3 text-white">
        <h3 className="text-lg font-bold">Edit Employee Information</h3>
        <p className="text-white/80 text-xs">Update the employee's details below</p>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <User className="h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-800 font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={editedEmployee.firstName}
                  onChange={e => handleInputChange("firstName", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-800 font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={editedEmployee.lastName}
                  onChange={e => handleInputChange("lastName", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedEmployee.email}
                onChange={e => handleInputChange("email", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-800 font-medium">Phone</Label>
              <Input
                id="phone"
                value={editedEmployee.phone}
                onChange={e => handleInputChange("phone", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-800 font-medium">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={editedEmployee.dateOfBirth ? new Date(editedEmployee.dateOfBirth).toISOString().split("T")[0] : ""}
                onChange={e => handleInputChange("dateOfBirth", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-800 font-medium">Gender</Label>
              <Input
                id="gender"
                value={editedEmployee.gender}
                onChange={e => handleInputChange("gender", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="text-gray-800 font-medium">Marital Status</Label>
              <Input
                id="maritalStatus"
                value={editedEmployee.maritalStatus || ""}
                onChange={e => handleInputChange("maritalStatus", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-gray-800 font-medium">Blood Group</Label>
              <Input
                id="bloodGroup"
                value={editedEmployee.bloodGroup || ""}
                onChange={e => handleInputChange("bloodGroup", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </CardContent>
        </Card>
  
        {/* Employment Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <Building className="h-4 w-4" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-800 font-medium">Department</Label>
              <Input
                id="department"
                value={editedEmployee.department || ""}
                onChange={e => handleInputChange("department", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-gray-800 font-medium">Designation</Label>
              <Input
                id="designation"
                value={editedEmployee.designation || ""}
                onChange={e => handleInputChange("designation", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-800 font-medium">Role</Label>
              <Input
                id="role"
                value={editedEmployee.role || ""}
                onChange={e => handleInputChange("role", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate" className="text-gray-800 font-medium">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={editedEmployee.joiningDate ? new Date(editedEmployee.joiningDate).toISOString().split("T")[0] : ""}
                onChange={e => handleInputChange("joiningDate", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            {/* Add more employment fields as needed */}
          </CardContent>
        </Card>
  
        {/* Leave Balance (Editable) */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <CalendarDays className="h-4 w-4" />
              Leave Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-2">
                <Label>Paid Leave</Label>
                <Input
                  type="number"
                  value={editedEmployee.leaveBalance?.paid || ""}
                  onChange={e => handleNestedInputChange("leaveBalance", "paid", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Casual Leave</Label>
                <Input
                  type="number"
                  value={editedEmployee.leaveBalance?.casual || ""}
                  onChange={e => handleNestedInputChange("leaveBalance", "casual", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Sick Leave</Label>
                <Input
                  type="number"
                  value={editedEmployee.leaveBalance?.sick || ""}
                  onChange={e => handleNestedInputChange("leaveBalance", "sick", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Short Leave</Label>
                <Input
                  type="number"
                  value={editedEmployee.leaveBalance?.short || ""}
                  onChange={e => handleNestedInputChange("leaveBalance", "short", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Comp Off</Label>
                <Input
                  type="number"
                  value={editedEmployee.leaveBalance?.compensatory || ""}
                  onChange={e => handleNestedInputChange("leaveBalance", "compensatory", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Leave</Label>
                <Input
                  type="number"
                  value={editedEmployee.leaveBalance?.total || ""}
                  onChange={e => handleNestedInputChange("leaveBalance", "total", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Salary Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <IndianRupee className="h-4 w-4" />
              Salary Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary" className="text-gray-800 font-medium">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={editedEmployee.salary?.basic || ""}
                  onChange={e => handleNestedInputChange("salary", "basic", e.target.value ? Number(e.target.value) : undefined)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hra" className="text-gray-800 font-medium">HRA</Label>
                <Input
                  id="hra"
                  type="number"
                  value={editedEmployee.salary?.hra || ""}
                  onChange={e => handleNestedInputChange("salary", "hra", e.target.value ? Number(e.target.value) : undefined)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="da" className="text-gray-800 font-medium">DA</Label>
                <Input
                  id="da"
                  type="number"
                  value={editedEmployee.salary?.da || ""}
                  onChange={e => handleNestedInputChange("salary", "da", e.target.value ? Number(e.target.value) : undefined)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialAllowance" className="text-gray-800 font-medium">Special Allowance</Label>
                <Input
                  id="specialAllowance"
                  type="number"
                  value={editedEmployee.salary?.specialAllowance || ""}
                  onChange={e => handleNestedInputChange("salary", "specialAllowance", e.target.value ? Number(e.target.value) : undefined)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportAllowance" className="text-gray-800 font-medium">Transport Allowance</Label>
                <Input
                  id="transportAllowance"
                  type="number"
                  value={editedEmployee.salary?.transportAllowance || ""}
                  onChange={e => handleNestedInputChange("salary", "transportAllowance", e.target.value ? Number(e.target.value) : undefined)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalAllowance" className="text-gray-800 font-medium">Medical Allowance</Label>
                <Input
                  id="medicalAllowance"
                  type="number"
                  value={editedEmployee.salary?.medicalAllowance || ""}
                  onChange={e => handleNestedInputChange("salary", "medicalAllowance", e.target.value ? Number(e.target.value) : undefined)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <CreditCard className="h-4 w-4" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-gray-800 font-medium">Bank Name</Label>
              <Input
                id="bankName"
                value={editedEmployee.bankDetails?.bankName || ""}
                onChange={e => handleNestedInputChange("bankDetails", "bankName", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-gray-800 font-medium">Account Number</Label>
              <Input
                id="accountNumber"
                value={editedEmployee.bankDetails?.accountNumber || ""}
                onChange={e => handleNestedInputChange("bankDetails", "accountNumber", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode" className="text-gray-800 font-medium">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={editedEmployee.bankDetails?.ifscCode || ""}
                onChange={e => handleNestedInputChange("bankDetails", "ifscCode", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName" className="text-gray-800 font-medium">Branch Name</Label>
              <Input
                id="branchName"
                value={editedEmployee.bankDetails?.branchName || ""}
                onChange={e => handleNestedInputChange("bankDetails", "branchName", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Address */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <MapPin className="h-4 w-4" />
              Current Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-gray-800 font-medium">Street</Label>
              <Input
                id="street"
                value={editedEmployee.address?.street || ""}
                onChange={e => handleNestedInputChange("address", "street", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-800 font-medium">City</Label>
                <Input
                  id="city"
                  value={editedEmployee.address?.city || ""}
                  onChange={e => handleNestedInputChange("address", "city", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-800 font-medium">State</Label>
                <Input
                  id="state"
                  value={editedEmployee.address?.state || ""}
                  onChange={e => handleNestedInputChange("address", "state", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-gray-800 font-medium">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={editedEmployee.address?.zipCode || ""}
                  onChange={e => handleNestedInputChange("address", "zipCode", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-800 font-medium">Country</Label>
                <Input
                  id="country"
                  value={editedEmployee.address?.country || ""}
                  onChange={e => handleNestedInputChange("address", "country", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <Phone className="h-4 w-4" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="emergencyName" className="text-gray-800 font-medium">Contact Name</Label>
              <Input
                id="emergencyName"
                value={editedEmployee.emergencyContact?.name || ""}
                onChange={e => handleNestedInputChange("emergencyContact", "name", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone" className="text-gray-800 font-medium">Contact Phone</Label>
              <Input
                id="emergencyPhone"
                value={editedEmployee.emergencyContact?.phone || ""}
                onChange={e => handleNestedInputChange("emergencyContact", "phone", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship" className="text-gray-800 font-medium">Relationship</Label>
              <Input
                id="emergencyRelationship"
                value={editedEmployee.emergencyContact?.relationship || ""}
                onChange={e => handleNestedInputChange("emergencyContact", "relationship", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <IdCard className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar" className="text-gray-800 font-medium">Aadhar</Label>
                <Input
                  id="aadhar"
                  value={editedEmployee.documents?.aadhar || ""}
                  onChange={e => handleNestedInputChange("documents", "aadhar", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-gray-800 font-medium">PAN</Label>
                <Input
                  id="pan"
                  value={editedEmployee.documents?.pan || ""}
                  onChange={e => handleNestedInputChange("documents", "pan", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passport" className="text-gray-800 font-medium">Passport</Label>
                <Input
                  id="passport"
                  value={editedEmployee.documents?.passport || ""}
                  onChange={e => handleNestedInputChange("documents", "passport", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drivingLicense" className="text-gray-800 font-medium">Driving License</Label>
                <Input
                  id="drivingLicense"
                  value={editedEmployee.documents?.drivingLicense || ""}
                  onChange={e => handleNestedInputChange("documents", "drivingLicense", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voterId" className="text-gray-800 font-medium">Voter ID</Label>
                <Input
                  id="voterId"
                  value={editedEmployee.documents?.voterId || ""}
                  onChange={e => handleNestedInputChange("documents", "voterId", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
              <GraduationCap className="h-4 w-4" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="highestQualification" className="text-gray-800 font-medium">Highest Qualification</Label>
              <Input
                id="highestQualification"
                value={editedEmployee.education?.highestQualification || ""}
                onChange={e => handleNestedInputChange("education", "highestQualification", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-gray-800 font-medium">Institution</Label>
              <Input
                id="institution"
                value={editedEmployee.education?.institution || ""}
                onChange={e => handleNestedInputChange("education", "institution", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearOfCompletion" className="text-gray-800 font-medium">Year of Completion</Label>
                <Input
                  id="yearOfCompletion"
                  value={editedEmployee.education?.yearOfCompletion || ""}
                  onChange={e => handleNestedInputChange("education", "yearOfCompletion", e.target.value)}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage" className="text-gray-800 font-medium">Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  value={editedEmployee.education?.percentage || ""}
                  onChange={e => handleNestedInputChange("education", "percentage", Number(e.target.value))}
                  className="border-gray-200 focus:border-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="hover:bg-gray-100">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90"
        >
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
        <Button variant="destructive" onClick={handleDelete}>
          Delete Employee
        </Button>
      </div>
    </div>
  );

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-base">
            {mode === "view" && "View detailed information about the employee"}
            {mode === "edit" && "Edit employee information"}
            {mode === "delete" && "Permanently remove this employee"}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] scrollbar-hide">
          {mode === "view" && renderViewContent()}
          {mode === "edit" && renderEditContent()}
          {mode === "delete" && renderDeleteContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
