import { Employee } from "@/types/employee";
import { InfoCard } from "./InfoCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building,
  CalendarDays,
  IndianRupee,
  CreditCard,
  MapPin,
  Phone,
  IdCard,
  GraduationCap,
} from "lucide-react";

interface EmployeeEditContentProps {
  editedEmployee: Employee;
  handleInputChange: (field: keyof Employee, value: any) => void;
  handleNestedInputChange: (parent: keyof Employee, field: string, value: any) => void;
}

export const EmployeeEditContent = ({
  editedEmployee,
  handleInputChange,
  handleNestedInputChange,
}: EmployeeEditContentProps) => {
  return (
    <div className="space-y-8">
      {/* Edit Header */}
      <div className="relative bg-gradient-to-r from-[#521138] to-[#843C6D] rounded-lg px-4 py-3 text-white">
        <h3 className="text-lg font-bold">Edit Employee Information</h3>
        <p className="text-white/80 text-xs">Update the employee's details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <InfoCard icon={User} title="Personal Information">
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
        </InfoCard>

        {/* Employment Information */}
        <InfoCard icon={Building} title="Employment Information">
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
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-800 font-medium">Status</Label>
            <Select
              value={editedEmployee.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-800">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active" className="hover:bg-[#843C6D] hover:text-white">Active</SelectItem>
                <SelectItem value="inactive" className="hover:bg-[#843C6D] hover:text-white">Inactive</SelectItem>
                <SelectItem value="terminated" className="hover:bg-[#843C6D] hover:text-white">Terminated</SelectItem>
                <SelectItem value="resigned" className="hover:bg-[#843C6D] hover:text-white">Resigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </InfoCard>

        {/* Leave Balance */}
        <InfoCard icon={CalendarDays} title="Leave Balance">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Paid Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.paid || ""}
                onChange={e => handleNestedInputChange("leaveBalance", "paid", Number(e.target.value))}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Casual Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.casual || ""}
                onChange={e => handleNestedInputChange("leaveBalance", "casual", Number(e.target.value))}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Sick Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.sick || ""}
                onChange={e => handleNestedInputChange("leaveBalance", "sick", Number(e.target.value))}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Short Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.short || ""}
                onChange={e => handleNestedInputChange("leaveBalance", "short", Number(e.target.value))}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Comp Off</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.compensatory || ""}
                onChange={e => handleNestedInputChange("leaveBalance", "compensatory", Number(e.target.value))}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Total Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.total || ""}
                onChange={e => handleNestedInputChange("leaveBalance", "total", Number(e.target.value))}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
        </InfoCard>

        {/* Salary Information */}
        <InfoCard icon={IndianRupee} title="Salary Information">
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
        </InfoCard>

        {/* Bank Details */}
        <InfoCard icon={CreditCard} title="Bank Details">
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
        </InfoCard>

        {/* Current Address */}
        <InfoCard icon={MapPin} title="Current Address">
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
        </InfoCard>

        {/* Emergency Contact */}
        <InfoCard icon={Phone} title="Emergency Contact">
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
        </InfoCard>

        {/* Documents */}
        <InfoCard icon={IdCard} title="Documents">
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
        </InfoCard>

        {/* Education */}
        <InfoCard icon={GraduationCap} title="Education">
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
        </InfoCard>
      </div>
    </div>
  );
}; 