import { Employee } from "@/types/employee";
import { InfoCard } from "./InfoCard";
import { Badge } from "@/components/ui/badge";
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
  Users,
  UserCheck,
  UserX,
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
  FileText,
  GraduationCap as GraduationCapIcon,
} from "lucide-react";

interface EmployeeViewContentProps {
  employee: Employee;
  teamMembers?: Employee[]; // For showing team members if employee is a manager
}

export const EmployeeViewContent = ({ employee, teamMembers = [] }: EmployeeViewContentProps) => {
  return (
    <div className="space-y-8">
      {/* Employee Header */}
      <div className="relative bg-gradient-to-r from-[#521138] to-[#843C6D] rounded-lg px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {employee.firstName.toUpperCase()} {employee.lastName.toUpperCase()}
            </h3>
            <p className="text-white/80 text-sm">{employee.email}</p>
            {employee.reportingManager && (
              <p className="text-white/70 text-xs">
                Reports to: {employee.reportingManager.firstName} {employee.reportingManager.lastName}
              </p>
            )}
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard icon={Users} title="Department">
          <p className="text-gray-900 font-semibold">{employee.department || "Not assigned"}</p>
        </InfoCard>
        <InfoCard icon={Briefcase} title="Designation">
          <p className="text-gray-900 font-semibold">{employee.designation || "Not assigned"}</p>
        </InfoCard>
        <InfoCard icon={Calendar} title="Joining Date">
          <p className="text-gray-900 font-semibold">
            {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "Not provided"}
          </p>
        </InfoCard>
        <InfoCard icon={UserCheck} title="Employee ID">
          <p className="text-gray-900 font-semibold">{employee.employeeId || employee._id}</p>
        </InfoCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <InfoCard icon={User} title="Personal Information">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">{employee.phone}</span>
            </div>
            {employee.dateOfBirth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800">
                  {new Date(employee.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
            {employee.gender && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800 capitalize">{employee.gender}</span>
              </div>
            )}
            {employee.maritalStatus && (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800 capitalize">{employee.maritalStatus}</span>
              </div>
            )}
            {employee.bloodGroup && (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800">{employee.bloodGroup}</span>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Employment Information */}
        <InfoCard icon={Building} title="Employment Information">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">{employee.department || "Not assigned"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">{employee.designation || "Not assigned"}</span>
            </div>
            {employee.role && (
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800 capitalize">{employee.role}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">
                {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "Not provided"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800 capitalize">{employee.status}</span>
            </div>
            {employee.reportingManager && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800">
                  Manager: {employee.reportingManager.firstName} {employee.reportingManager.lastName}
                </span>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Team Members (if employee is a manager) */}
        {teamMembers.length > 0 && (
          <InfoCard icon={Users2} title="Team Members">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-gray-800 font-medium">Direct Reports ({teamMembers.length})</span>
              </div>
              {teamMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-gray-900 font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-gray-600 text-xs">{member.designation || "Not assigned"}</p>
                  </div>
                  <Badge
                    className={`${
                      member.status === "active"
                        ? "bg-green-500 text-white"
                        : member.status === "inactive"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    } border-0 text-xs`}
                  >
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Performance Information */}
        <InfoCard icon={TrendingUp} title="Performance Information">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">Rating: {employee.performance?.rating || "Not rated"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">Achievements: {employee.performance?.achievements?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-600" />
              <span className="text-gray-800">Goals: {employee.performance?.goals?.length || 0}</span>
            </div>
          </div>
        </InfoCard>

        {/* Leave Balance Information */}
        {employee.leaveBalance && (
          <InfoCard icon={CalendarDays} title="Leave Balance">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Paid Leave</p>
                <p className="text-gray-900 font-bold">{employee.leaveBalance.paid || 0} days</p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Casual Leave</p>
                <p className="text-gray-900 font-bold">{employee.leaveBalance.casual || 0} days</p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Sick Leave</p>
                <p className="text-gray-900 font-bold">{employee.leaveBalance.sick || 0} days</p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Short Leave</p>
                <p className="text-gray-900 font-bold">{employee.leaveBalance.short || 0} days</p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Comp Off</p>
                <p className="text-gray-900 font-bold">{employee.leaveBalance.compensatory || 0} days</p>
              </div>
              <div className="p-1.5 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">Total Leave</p>
                <p className="text-gray-900 font-bold">{employee.leaveBalance.total || 0} days</p>
              </div>
            </div>
          </InfoCard>
        )}

        {/* Salary Information */}
        {employee.salary && (
          <InfoCard icon={IndianRupee} title="Salary Information">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Salary:</span>
                <span className="text-gray-900 font-semibold">₹{employee.salary.basic?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HRA:</span>
                <span className="text-gray-900 font-semibold">₹{employee.salary.hra?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DA:</span>
                <span className="text-gray-900 font-semibold">₹{employee.salary.da?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Special Allowance:</span>
                <span className="text-gray-900 font-semibold">₹{employee.salary.specialAllowance?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Allowance:</span>
                <span className="text-gray-900 font-semibold">₹{employee.salary.transportAllowance?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical Allowance:</span>
                <span className="text-gray-900 font-semibold">₹{employee.salary.medicalAllowance?.toLocaleString() || 0}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-gray-900">
                    ₹{(
                      (employee.salary.basic || 0) +
                      (employee.salary.hra || 0) +
                      (employee.salary.da || 0) +
                      (employee.salary.specialAllowance || 0) +
                      (employee.salary.transportAllowance || 0) +
                      (employee.salary.medicalAllowance || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </InfoCard>
        )}

        {/* Bank Details */}
        <InfoCard icon={CreditCard} title="Bank Details">
          {employee.bankDetails ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="text-gray-900 font-semibold">{employee.bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="text-gray-900 font-semibold">{employee.bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC Code:</span>
                <span className="text-gray-900 font-semibold">{employee.bankDetails.ifscCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch:</span>
                <span className="text-gray-900 font-semibold">{employee.bankDetails.branchName}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Bank details not provided</p>
          )}
        </InfoCard>

        {/* Current Address */}
        <InfoCard icon={MapPin} title="Current Address">
          {employee.address ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">{employee.address.street}</p>
                  <p className="text-gray-600">
                    {employee.address.city}, {employee.address.state} {employee.address.zipCode}
                  </p>
                  <p className="text-gray-600">{employee.address.country}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Address not provided</p>
          )}
        </InfoCard>

        {/* Permanent Address */}
        {employee.address?.permanentAddress && (
          <InfoCard icon={MapPin} title="Permanent Address">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">{employee.address.permanentAddress.street}</p>
                  <p className="text-gray-600">
                    {employee.address.permanentAddress.city}, {employee.address.permanentAddress.state} {employee.address.permanentAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{employee.address.permanentAddress.country}</p>
                </div>
              </div>
            </div>
          </InfoCard>
        )}

        {/* Emergency Contact */}
        <InfoCard icon={Phone} title="Emergency Contact">
          {employee.emergencyContact ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900">{employee.emergencyContact.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900">{employee.emergencyContact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900">{employee.emergencyContact.relationship}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Emergency contact not provided</p>
          )}
        </InfoCard>

        {/* Documents */}
        <InfoCard icon={IdCard} title="Documents">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Aadhar</p>
              <p className="text-gray-900">{employee.documents?.aadhar ? "Uploaded" : "Not provided"}</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">PAN</p>
              <p className="text-gray-900">{employee.documents?.pan ? "Uploaded" : "Not provided"}</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Passport</p>
              <p className="text-gray-900">{employee.documents?.passport ? "Uploaded" : "Not provided"}</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Driving License</p>
              <p className="text-gray-900">{employee.documents?.drivingLicense ? "Uploaded" : "Not provided"}</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Voter ID</p>
              <p className="text-gray-900">{employee.documents?.voterId ? "Uploaded" : "Not provided"}</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Relieving Letter</p>
              <p className="text-gray-900">Not provided</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Experience Letter</p>
              <p className="text-gray-900">Not provided</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Last Month Payslip</p>
              <p className="text-gray-900">Not provided</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Passport Size Photo</p>
              <p className="text-gray-900">Not provided</p>
            </div>
            <div className="p-1.5 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">Offer Letter</p>
              <p className="text-gray-900">Not provided</p>
            </div>
          </div>
        </InfoCard>

        {/* Education */}
        <InfoCard icon={GraduationCap} title="Education">
          {employee.education ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900 font-semibold">{employee.education.highestQualification}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900">{employee.education.institution}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-gray-900">Completed: {employee.education.yearOfCompletion}</span>
              </div>
              {employee.education.percentage && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">Percentage: {employee.education.percentage}%</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Education details not provided</p>
          )}
        </InfoCard>

        {/* Skills */}
        <InfoCard icon={Target} title="Skills">
          {employee.skills && employee.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {employee.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Skills not provided</p>
          )}
        </InfoCard>

        {/* Work Experience */}
        <InfoCard icon={Briefcase} title="Work Experience" className="lg:col-span-2">
          {employee.workExperience && employee.workExperience.length > 0 ? (
            <div className="space-y-3">
              {employee.workExperience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h4 className="font-semibold text-gray-900">{exp.company}</h4>
                  <p className="text-sm text-gray-600">{exp.position}</p>
                  <p className="text-xs text-gray-500">
                    {exp.fromDate} - {exp.toDate || "Present"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Work experience not provided</p>
          )}
        </InfoCard>
      </div>

      {/* Bottom Padding */}
      <div className="pb-1"></div>
    </div>
  );
}; 