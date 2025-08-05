import { Employee } from "@/types/employee";
import { InfoCard } from "./InfoCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { Button } from "@/components/ui/button";
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
  Heart,
  Award,
  Target,
  Users,
  AlertTriangle,
  Save,
} from "lucide-react";

interface EmployeeEditContentProps {
  editedEmployee: Employee;
  handleInputChange: (field: keyof Employee, value: any) => void;
  handleNestedInputChange: (
    parent: keyof Employee,
    field: string,
    value: any
  ) => void;
  handleFileUpload?: (type: string, file: File | null) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const EmployeeEditContent = ({
  editedEmployee,
  handleInputChange,
  handleNestedInputChange,
  handleFileUpload,
  onSave,
  onCancel,
}: EmployeeEditContentProps) => {
  return (
    <div className="space-y-8">
      {/* Edit Header */}
      <div className="relative bg-gradient-to-r from-[#521138] to-[#843C6D] rounded-lg px-4 py-3 text-white">
        <h3 className="text-lg font-bold">Edit Employee Information</h3>
        <p className="text-white/80 text-xs">
          Update the employee's details below
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <InfoCard icon={User} title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-800 font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                value={editedEmployee.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-800 font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={editedEmployee.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={editedEmployee.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-800 font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              value={editedEmployee.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-800 font-medium">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={
                  editedEmployee.dateOfBirth
                    ? new Date(editedEmployee.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-800 font-medium">
                Gender
              </Label>
              <Select
                value={editedEmployee.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-gray-800">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="male"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Male
                  </SelectItem>
                  <SelectItem
                    value="female"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Female
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="maritalStatus"
                className="text-gray-800 font-medium"
              >
                Marital Status
              </Label>
              <Select
                value={editedEmployee.maritalStatus || ""}
                onValueChange={(value) => handleInputChange("maritalStatus", value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-gray-800">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="single"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Single
                  </SelectItem>
                  <SelectItem
                    value="married"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Married
                  </SelectItem>
                  <SelectItem
                    value="divorced"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Divorced
                  </SelectItem>
                  <SelectItem
                    value="widowed"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    Widowed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-gray-800 font-medium">
                Blood Group
              </Label>
              <Select
                value={editedEmployee.bloodGroup || ""}
                onValueChange={(value) => handleInputChange("bloodGroup", value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-gray-800">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="A+"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    A+
                  </SelectItem>
                  <SelectItem
                    value="A-"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    A-
                  </SelectItem>
                  <SelectItem
                    value="B+"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    B+
                  </SelectItem>
                  <SelectItem
                    value="B-"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    B-
                  </SelectItem>
                  <SelectItem
                    value="AB+"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    AB+
                  </SelectItem>
                  <SelectItem
                    value="AB-"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    AB-
                  </SelectItem>
                  <SelectItem
                    value="O+"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    O+
                  </SelectItem>
                  <SelectItem
                    value="O-"
                    className="hover:bg-[#843C6D] hover:text-white"
                  >
                    O-
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </InfoCard>

        {/* Employment Information */}
        <InfoCard icon={Building} title="Employment Information">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-800 font-medium">
              Department
            </Label>
            <Input
              id="department"
              value={editedEmployee.department || ""}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation" className="text-gray-800 font-medium">
              Designation
            </Label>
            <Input
              id="designation"
              value={editedEmployee.designation || ""}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-800 font-medium">
              Role
            </Label>
            <Input
              id="role"
              value={editedEmployee.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joiningDate" className="text-gray-800 font-medium">
              Joining Date
            </Label>
            <Input
              id="joiningDate"
              type="date"
              value={
                editedEmployee.joiningDate
                  ? new Date(editedEmployee.joiningDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) => handleInputChange("joiningDate", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-800 font-medium">
              Status
            </Label>
            <Select
              value={editedEmployee.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-gray-800">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  className="hover:bg-[#843C6D] hover:text-white"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="inactive"
                  className="hover:bg-[#843C6D] hover:text-white"
                >
                  Inactive
                </SelectItem>
                <SelectItem
                  value="terminated"
                  className="hover:bg-[#843C6D] hover:text-white"
                >
                  Terminated
                </SelectItem>
                <SelectItem
                  value="resigned"
                  className="hover:bg-[#843C6D] hover:text-white"
                >
                  Resigned
                </SelectItem>
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
                onChange={(e) =>
                  handleNestedInputChange(
                    "leaveBalance",
                    "paid",
                    Number(e.target.value)
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Casual Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.casual || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "leaveBalance",
                    "casual",
                    Number(e.target.value)
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Sick Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.sick || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "leaveBalance",
                    "sick",
                    Number(e.target.value)
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Short Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.short || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "leaveBalance",
                    "short",
                    Number(e.target.value)
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Comp Off</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.compensatory || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "leaveBalance",
                    "compensatory",
                    Number(e.target.value)
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Total Leave</Label>
              <Input
                type="number"
                value={editedEmployee.leaveBalance?.total || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "leaveBalance",
                    "total",
                    Number(e.target.value)
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
        </InfoCard>

        {/* Salary Information */}
        <InfoCard icon={IndianRupee} title="Salary Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="basicSalary"
                className="text-gray-800 font-medium"
              >
                Basic Salary
              </Label>
              <Input
                id="basicSalary"
                type="number"
                value={editedEmployee.salary?.basic || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "salary",
                    "basic",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hra" className="text-gray-800 font-medium">
                HRA
              </Label>
              <Input
                id="hra"
                type="number"
                value={editedEmployee.salary?.hra || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "salary",
                    "hra",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="da" className="text-gray-800 font-medium">
                DA
              </Label>
              <Input
                id="da"
                type="number"
                value={editedEmployee.salary?.da || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "salary",
                    "da",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="specialAllowance"
                className="text-gray-800 font-medium"
              >
                Special Allowance
              </Label>
              <Input
                id="specialAllowance"
                type="number"
                value={editedEmployee.salary?.specialAllowance || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "salary",
                    "specialAllowance",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="transportAllowance"
                className="text-gray-800 font-medium"
              >
                Transport Allowance
              </Label>
              <Input
                id="transportAllowance"
                type="number"
                value={editedEmployee.salary?.transportAllowance || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "salary",
                    "transportAllowance",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="medicalAllowance"
                className="text-gray-800 font-medium"
              >
                Medical Allowance
              </Label>
              <Input
                id="medicalAllowance"
                type="number"
                value={editedEmployee.salary?.medicalAllowance || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "salary",
                    "medicalAllowance",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Permanent Address, Current Address, Education, Bank Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Permanent Address */}
        <InfoCard icon={MapPin} title="Permanent Address">
          <div className="space-y-2">
            <Label htmlFor="permanentStreet" className="text-gray-800 font-medium">
              Street
            </Label>
            <Input
              id="permanentStreet"
              value={editedEmployee.address?.permanentAddress?.street || ""}
              onChange={(e) =>
                handleNestedInputChange("address", "permanentAddress", { ...editedEmployee.address?.permanentAddress, street: e.target.value })
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanentCity" className="text-gray-800 font-medium">
                City
              </Label>
              <Input
                id="permanentCity"
                value={editedEmployee.address?.permanentAddress?.city || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "permanentAddress", { ...editedEmployee.address?.permanentAddress, city: e.target.value })
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentState" className="text-gray-800 font-medium">
                State
              </Label>
              <Input
                id="permanentState"
                value={editedEmployee.address?.permanentAddress?.state || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "permanentAddress", { ...editedEmployee.address?.permanentAddress, state: e.target.value })
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanentZipCode" className="text-gray-800 font-medium">
                Zip Code
              </Label>
              <Input
                id="permanentZipCode"
                value={editedEmployee.address?.permanentAddress?.zipCode || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "permanentAddress", { ...editedEmployee.address?.permanentAddress, zipCode: e.target.value })
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentCountry" className="text-gray-800 font-medium">
                Country
              </Label>
              <Input
                id="permanentCountry"
                value={editedEmployee.address?.permanentAddress?.country || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "permanentAddress", { ...editedEmployee.address?.permanentAddress, country: e.target.value })
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
        </InfoCard>

        {/* Current Address */}
        <InfoCard icon={MapPin} title="Current Address">
          <div className="space-y-2">
            <Label htmlFor="currentStreet" className="text-gray-800 font-medium">
              Street
            </Label>
            <Input
              id="currentStreet"
              value={editedEmployee.address?.street || ""}
              onChange={(e) =>
                handleNestedInputChange("address", "street", e.target.value)
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentCity" className="text-gray-800 font-medium">
                City
              </Label>
              <Input
                id="currentCity"
                value={editedEmployee.address?.city || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "city", e.target.value)
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentState" className="text-gray-800 font-medium">
                State
              </Label>
              <Input
                id="currentState"
                value={editedEmployee.address?.state || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "state", e.target.value)
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentZipCode" className="text-gray-800 font-medium">
                Zip Code
              </Label>
              <Input
                id="currentZipCode"
                value={editedEmployee.address?.zipCode || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "zipCode", e.target.value)
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentCountry" className="text-gray-800 font-medium">
                Country
              </Label>
              <Input
                id="currentCountry"
                value={editedEmployee.address?.country || ""}
                onChange={(e) =>
                  handleNestedInputChange("address", "country", e.target.value)
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Education and Bank Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Education */}
        <InfoCard icon={GraduationCap} title="Education">
          <div className="grid grid-cols-2 gap-4">
            <FileUpload
              label="Intermediate Certificate (10+2)"
              icon="education"
              onFileChange={(file) => handleFileUpload?.("intermediate", file)}
            />
            <FileUpload
              label="Undergraduate Certificate (UG)"
              icon="education"
              onFileChange={(file) => handleFileUpload?.("undergraduate", file)}
            />
            <div className="col-start-1 col-end-3 flex justify-center">
              <div className="w-1/2">
                <FileUpload
                  label="Postgraduate Certificate (PG)"
                  icon="education"
                  onFileChange={(file) =>
                    handleFileUpload?.("postgraduate", file)
                  }
                />
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Bank Details */}
        <InfoCard icon={CreditCard} title="Bank Details">
          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-gray-800 font-medium">
              Bank Name
            </Label>
            <Input
              id="bankName"
              value={editedEmployee.bankDetails?.bankName || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "bankDetails",
                  "bankName",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="accountNumber"
              className="text-gray-800 font-medium"
            >
              Account Number
            </Label>
            <Input
              id="accountNumber"
              value={editedEmployee.bankDetails?.accountNumber || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "bankDetails",
                  "accountNumber",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifscCode" className="text-gray-800 font-medium">
              IFSC Code
            </Label>
            <Input
              id="ifscCode"
              value={editedEmployee.bankDetails?.ifscCode || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "bankDetails",
                  "ifscCode",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branchName" className="text-gray-800 font-medium">
              Branch Name
            </Label>
            <Input
              id="branchName"
              value={editedEmployee.bankDetails?.branchName || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "bankDetails",
                  "branchName",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
        </InfoCard>
      </div>

      {/* Emergency Contact */}
      <InfoCard icon={Phone} title="Emergency Contact">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName" className="text-gray-800 font-medium">
              Contact Name
            </Label>
            <Input
              id="emergencyName"
              value={editedEmployee.emergencyContact?.name || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "emergencyContact",
                  "name",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelationship" className="text-gray-800 font-medium">
              Relationship
            </Label>
            <Input
              id="emergencyRelationship"
              value={editedEmployee.emergencyContact?.relationship || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "emergencyContact",
                  "relationship",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone" className="text-gray-800 font-medium">
              Contact Phone
            </Label>
            <Input
              id="emergencyPhone"
              value={editedEmployee.emergencyContact?.phone || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  "emergencyContact",
                  "phone",
                  e.target.value
                )
              }
              className="border-gray-200 focus:border-gray-800"
            />
          </div>
        </div>
      </InfoCard>

      {/* Skills */}
      <InfoCard icon={Award} title="Skills">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">Technical Skills</Label>
            <Textarea
              value={editedEmployee.skills?.technical || ""}
              onChange={(e) =>
                handleNestedInputChange("skills", "technical", e.target.value)
              }
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter technical skills (e.g., JavaScript, React, Node.js)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">Soft Skills</Label>
            <Textarea
              value={editedEmployee.skills?.soft || ""}
              onChange={(e) =>
                handleNestedInputChange("skills", "soft", e.target.value)
              }
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter soft skills (e.g., Leadership, Communication, Teamwork)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">Languages</Label>
            <Textarea
              value={editedEmployee.skills?.languages || ""}
              onChange={(e) =>
                handleNestedInputChange("skills", "languages", e.target.value)
              }
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter languages known (e.g., English, Hindi, Spanish)"
              rows={2}
            />
          </div>
        </div>
      </InfoCard>

      {/* Performance */}
      <InfoCard icon={Target} title="Performance">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">Achievements</Label>
            <Textarea
              value={editedEmployee.performance?.achievements || ""}
              onChange={(e) =>
                handleNestedInputChange("performance", "achievements", e.target.value)
              }
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter achievements and accomplishments"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-800 font-medium">Goals</Label>
            <Textarea
              value={editedEmployee.performance?.goals || ""}
              onChange={(e) =>
                handleNestedInputChange("performance", "goals", e.target.value)
              }
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter performance goals and objectives"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Rating</Label>
              <Select
                value={editedEmployee.performance?.rating?.toString() || ""}
                onValueChange={(value) =>
                  handleNestedInputChange("performance", "rating", Number(value))
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-gray-800">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-800 font-medium">Review Date</Label>
              <Input
                type="date"
                value={
                  editedEmployee.performance?.reviewDate
                    ? new Date(editedEmployee.performance.reviewDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleNestedInputChange("performance", "reviewDate", e.target.value)
                }
                className="border-gray-200 focus:border-gray-800"
              />
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Team Information */}
      <InfoCard icon={Users} title="Team Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="team" className="text-gray-800 font-medium">
              Team
            </Label>
            <Input
              id="team"
              value={editedEmployee.team || ""}
              onChange={(e) => handleInputChange("team", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter team name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeId" className="text-gray-800 font-medium">
              Employee ID
            </Label>
            <Input
              id="employeeId"
              value={editedEmployee.employeeId || ""}
              onChange={(e) => handleInputChange("employeeId", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter employee ID"
            />
          </div>
        </div>
      </InfoCard>

      {/* Documents */}
      <InfoCard icon={IdCard} title="Documents">
        <div className="grid grid-cols-5 gap-4">
          <FileUpload
            label="Aadhar Card"
            onFileChange={(file) => handleFileUpload?.("aadhar", file)}
          />
          <FileUpload
            label="PAN Card"
            onFileChange={(file) => handleFileUpload?.("pan", file)}
          />
          <FileUpload
            label="Passport"
            onFileChange={(file) => handleFileUpload?.("passport", file)}
          />
          <FileUpload
            label="Driving License"
            onFileChange={(file) => handleFileUpload?.("drivingLicense", file)}
          />
          <FileUpload
            label="Voter ID"
            onFileChange={(file) => handleFileUpload?.("voterId", file)}
          />
          <FileUpload
            label="Relieving Letter"
            onFileChange={(file) => handleFileUpload?.("relievingLetter", file)}
          />
          <FileUpload
            label="Experience Letter"
            onFileChange={(file) =>
              handleFileUpload?.("experienceLetter", file)
            }
          />
          <FileUpload
            label="Last Month Payslip"
            onFileChange={(file) => handleFileUpload?.("lastPayslip", file)}
          />
          <FileUpload
            label="Passport Size Photo"
            onFileChange={(file) => handleFileUpload?.("passportPhoto", file)}
          />
          <FileUpload
            label="Offer Letter"
            onFileChange={(file) => handleFileUpload?.("offerLetter", file)}
          />
        </div>
      </InfoCard>

      {/* Additional Information */}
      <InfoCard icon={AlertTriangle} title="Additional Information">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-800 font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={editedEmployee.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="border-gray-200 focus:border-gray-800"
              placeholder="Enter any additional notes about the employee"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isProfileComplete" className="text-gray-800 font-medium">
                Profile Complete
              </Label>
              <Select
                value={editedEmployee.isProfileComplete?.toString() || "false"}
                onValueChange={(value) => handleInputChange("isProfileComplete", value === "true")}
              >
                <SelectTrigger className="border-gray-200 focus:border-gray-800">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Complete</SelectItem>
                  <SelectItem value="false">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastUpdated" className="text-gray-800 font-medium">
                Last Updated
              </Label>
              <Input
                id="lastUpdated"
                type="datetime-local"
                value={
                  editedEmployee.updatedAt
                    ? new Date(editedEmployee.updatedAt)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="border-gray-200 focus:border-gray-800"
                readOnly
              />
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Update Button Section - Positioned after all fields */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-4 rounded-b-lg">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90 transition-all duration-200 gap-2"
        >
          <Save className="w-4 h-4" />
          Update Employee
        </Button>
      </div>
    </div>
  );
};
