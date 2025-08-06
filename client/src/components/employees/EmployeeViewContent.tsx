import { Employee } from "@/types/employee";
import { InfoCard } from "./InfoCard";
import { Button } from "@/components/ui/button";
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
  Users,
  Eye,
  ExternalLink,
  Mail,
  Clock,
  Shield,
  FileText,
  Users2,
  StickyNote,
} from "lucide-react";
import { useState, useEffect } from "react";
import { employeeService, Department, Designation } from "@/services/employeeService";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EmployeeViewContentProps {
  employee: Employee;
  onEdit?: () => void;
  onClose?: () => void;
}

export const EmployeeViewContent = ({
  employee,
  onEdit,
  onClose,
}: EmployeeViewContentProps) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Debug: Log employee data to see what's being passed
  console.log('EmployeeViewContent - Employee data:', employee);
  console.log('EmployeeViewContent - Department:', employee.department);
  console.log('EmployeeViewContent - Subcategory:', employee.subcategory);

  // Fetch dynamic data on component mount
  useEffect(() => {
    if (user?.company?._id) {
      fetchDynamicData();
    }
  }, [user]);

  const fetchDynamicData = async () => {
    if (!user?.company?._id) {
      console.warn("No company ID available for fetching dynamic data");
      return;
    }
    
    try {
      setLoading(true);
      const [deptsData, desigsData, managersData, teamData] = await Promise.all([
        employeeService.getDepartments(user.company._id),
        employeeService.getDesignations(user.company._id),
        employeeService.getManagers(user.company._id),
        employeeService.getTeamMembers(employee._id, user.company._id),
      ]);
      setDepartments(deptsData || []);
      setDesignations(desigsData || []);
      setManagers(managersData || []);
      setTeamMembers(teamData || []);
    } catch (error) {
      console.error("Error fetching dynamic data:", error);
      // Set empty arrays to prevent undefined errors
      setDepartments([]);
      setDesignations([]);
      setManagers([]);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, text: "Active" },
      inactive: { variant: "secondary" as const, text: "Inactive" },
      terminated: { variant: "destructive" as const, text: "Terminated" },
      resigned: { variant: "destructive" as const, text: "Resigned" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === "manager" ? "default" : "secondary"}>
        {role === "manager" ? "Manager" : "Employee"}
      </Badge>
    );
  };

  const renderField = (label: string, value: any, Icon?: any) => {
    // Debug: Log field values
    if (label === "Department" || label === "Subcategory") {
      console.log(`renderField - ${label}:`, value);
    }
    
    return (
      <div className="flex items-center gap-2 text-sm">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="text-gray-900 break-words">{value || "Not specified"}</span>
      </div>
    );
  };

  const renderDocumentLink = (label: string, url: string) => {
    if (!url) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="font-medium text-gray-700">{label}:</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          View Document
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#843C6D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="relative bg-gradient-to-r from-[#521138] to-[#843C6D] rounded-lg px-4 py-3 text-white">
        <h3 className="text-lg font-bold">Employee Details</h3>
        <p className="text-white/80 text-xs">
          View detailed information about the employee
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Personal Information */}
        <InfoCard icon={User} title="Personal Information">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("First Name", employee.firstName)}
              {renderField("Last Name", employee.lastName)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("Email", employee.email, Mail)}
              {renderField("Phone", employee.phone, Phone)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("Gender", employee.gender?.charAt(0).toUpperCase() + employee.gender?.slice(1))}
              {renderField("Date of Birth", formatDate(employee.dateOfBirth), CalendarDays)}
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(employee.status)}
              {getRoleBadge(employee.role)}
            </div>
          </div>
        </InfoCard>

                 {/* Employment Information */}
         <InfoCard icon={Building} title="Employment Information">
           <div className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {renderField("Employee ID", employee.employeeId)}
               {renderField("Designation", employee.designation)}
             </div>
             <div className="flex items-center gap-2 text-sm">
               <span className="font-medium text-gray-700">Department:</span>
               <span className="text-gray-900 break-words">
                 {employee.department}
                 {employee.subcategory && (
                   <span className="text-gray-600 ml-2">
                     ({employee.subcategory})
                   </span>
                 )}
               </span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {renderField("Joining Date", formatDate(employee.joiningDate), CalendarDays)}
               {renderField("Team", employee.team, Users2)}
             </div>
             {employee.reportingManager && (
               <div className="flex items-center gap-2 text-sm">
                 <Users className="w-4 h-4 text-gray-500" />
                 <span className="font-medium text-gray-700">Reporting Manager:</span>
                 <span className="text-gray-900">
                   {managers.find(m => m._id === employee.reportingManager)?.firstName} {managers.find(m => m._id === employee.reportingManager)?.lastName}
                 </span>
               </div>
             )}
           </div>
         </InfoCard>

        {/* Team Members */}
        <InfoCard icon={Users2} title="Team Members">
          <div className="space-y-3">
            {teamMembers.length > 0 ? (
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#521138] to-[#843C6D] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.designation || 'Employee'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No team members assigned
              </div>
            )}
          </div>
        </InfoCard>

        {/* Leave Balance */}
        <InfoCard icon={CalendarDays} title="Leave Balance">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {renderField("Paid Leave", employee.leaveBalance?.paid)}
              {renderField("Casual Leave", employee.leaveBalance?.casual)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderField("Sick Leave", employee.leaveBalance?.sick)}
              {renderField("Short Leave", employee.leaveBalance?.short)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderField("Compensatory", employee.leaveBalance?.compensatory)}
              {renderField("Total", employee.leaveBalance?.total)}
            </div>
          </div>
        </InfoCard>

        {/* Salary Information */}
        <InfoCard icon={IndianRupee} title="Salary Information">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("Basic Salary", formatCurrency(employee.salary?.basic))}
              {renderField("HRA", formatCurrency(employee.salary?.hra))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("DA", formatCurrency(employee.salary?.da))}
              {renderField("Allowances", formatCurrency(employee.salary?.allowances))}
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <IndianRupee className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Total Salary:</span>
                <span className="text-green-600">
                  {formatCurrency(
                    (employee.salary?.basic || 0) +
                    (employee.salary?.hra || 0) +
                    (employee.salary?.da || 0) +
                    (employee.salary?.allowances || 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Emergency Contact */}
        <InfoCard icon={Heart} title="Emergency Contact">
          <div className="space-y-3">
            {renderField("Name", employee.emergencyContact?.name)}
            {renderField("Relationship", employee.emergencyContact?.relationship)}
            {renderField("Phone", employee.emergencyContact?.phone, Phone)}
          </div>
        </InfoCard>

        {/* Permanent Address */}
        <InfoCard icon={MapPin} title="Permanent Address">
          <div className="space-y-3">
            {renderField("Street", employee.address?.permanentAddress?.street)}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("City", employee.address?.permanentAddress?.city)}
              {renderField("State", employee.address?.permanentAddress?.state)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("Zip Code", employee.address?.permanentAddress?.zipCode)}
              {renderField("Country", employee.address?.permanentAddress?.country)}
            </div>
          </div>
        </InfoCard>

        {/* Current Address */}
        <InfoCard icon={MapPin} title="Current Address">
          <div className="space-y-3">
            {renderField("Street", employee.address?.street)}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("City", employee.address?.city)}
              {renderField("State", employee.address?.state)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("Zip Code", employee.address?.zipCode)}
              {renderField("Country", employee.address?.country)}
            </div>
          </div>
        </InfoCard>

        {/* Education */}
        <InfoCard icon={GraduationCap} title="Education">
          <div className="space-y-3">
            {renderDocumentLink("Degree Certificate", employee.education?.degreeCertificate)}
            {renderDocumentLink("Mark Sheet", employee.education?.markSheet)}
            {renderDocumentLink("Transfer Certificate", employee.education?.transferCertificate)}
            {renderDocumentLink("Character Certificate", employee.education?.characterCertificate)}
            {renderDocumentLink("Other Certificates", employee.education?.otherCertificates)}
          </div>
        </InfoCard>

        {/* Bank Details */}
        <InfoCard icon={CreditCard} title="Bank Details">
          <div className="space-y-3">
            {renderField("Account Number", employee.bankDetails?.accountNumber)}
            {renderField("Bank Name", employee.bankDetails?.bankName)}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderField("IFSC Code", employee.bankDetails?.ifscCode)}
              {renderField("Branch", employee.bankDetails?.branch)}
            </div>
          </div>
        </InfoCard>

        {/* Documents */}
        <InfoCard icon={IdCard} title="Documents">
          <div className="space-y-3">
            {renderDocumentLink("Aadhar Card", employee.documents?.aadhar)}
            {renderDocumentLink("PAN Card", employee.documents?.pan)}
            {renderDocumentLink("Passport", employee.documents?.passport)}
            {renderDocumentLink("Driving License", employee.documents?.drivingLicense)}
            {renderDocumentLink("Voter ID", employee.documents?.voterId)}
            {renderDocumentLink("Relieving Letter", employee.documents?.relievingLetter)}
            {renderDocumentLink("Experience Letter", employee.documents?.experienceLetter)}
            {renderDocumentLink("Last Payslip", employee.documents?.lastPayslip)}
            {renderDocumentLink("Passport Photo", employee.documents?.passportPhoto)}
            {renderDocumentLink("Offer Letter", employee.documents?.offerLetter)}
          </div>
        </InfoCard>

        {/* Additional Information */}
        <InfoCard icon={StickyNote} title="Additional Information">
          <div className="space-y-3">
            {renderField("Profile Complete", employee.isProfileComplete ? "Yes" : "No")}
            {renderField("Last Login", formatDate(employee.lastLogin), Clock)}
            {renderField("Created At", formatDate(employee.createdAt), CalendarDays)}
            {renderField("Updated At", formatDate(employee.updatedAt), CalendarDays)}
            {employee.notes && (
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                <span className="font-medium text-gray-700">Notes:</span>
                <div className="mt-1">{employee.notes}</div>
              </div>
            )}
          </div>
        </InfoCard>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onEdit && (
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            Edit Employee
          </Button>
        )}
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
}; 