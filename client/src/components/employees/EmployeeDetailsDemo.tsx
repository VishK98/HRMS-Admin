import { useState } from "react";
import { Employee } from "@/types/employee";
import { EmployeeModal } from "./EmployeeModal";
import { ReportingManagerSelector } from "./ReportingManagerSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Edit, Eye, Trash2 } from "lucide-react";

// Mock data for demonstration
const mockEmployees: Employee[] = [
  {
    _id: "1",
    firstName: "Ajeet",
    lastName: "Dubey",
    email: "ajeet.dubey@company.com",
    phone: "+91 9876543210",
    employeeId: "EMP001",
    department: "Engineering",
    designation: "Senior Developer",
    role: "manager",
    status: "active",
    joiningDate: "2023-01-15",
    dateOfBirth: "1990-05-15",
    gender: "male",
    maritalStatus: "married",
    bloodGroup: "A+",
    salary: {
      basic: 50000,
      hra: 20000,
      da: 15000,
      specialAllowance: 10000,
      transportAllowance: 5000,
      medicalAllowance: 3000,
    },
    bankDetails: {
      bankName: "HDFC Bank",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      branchName: "Mumbai Main Branch",
    },
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      permanentAddress: {
        street: "456 Home Street",
        city: "Delhi",
        state: "Delhi",
        zipCode: "110001",
        country: "India",
      },
    },
    emergencyContact: {
      name: "Priya Dubey",
      relationship: "Spouse",
      phone: "+91 9876543211",
    },
    documents: {
      aadhar: "uploaded",
      pan: "uploaded",
      passport: "uploaded",
      drivingLicense: "uploaded",
      voterId: "uploaded",
    },
    education: {
      highestQualification: "Bachelor of Technology",
      institution: "IIT Delhi",
      yearOfCompletion: "2012",
      percentage: 85,
    },
    leaveBalance: {
      paid: 15,
      casual: 8,
      sick: 5,
      short: 2,
      compensatory: 3,
      total: 33,
    },
    isProfileComplete: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "2",
    firstName: "Vishesh",
    lastName: "Kumar",
    email: "vishesh.kumar@company.com",
    phone: "+91 9876543212",
    employeeId: "EMP002",
    department: "Engineering",
    designation: "Junior Developer",
    role: "employee",
    status: "active",
    joiningDate: "2023-06-01",
    dateOfBirth: "1995-08-20",
    gender: "male",
    maritalStatus: "single",
    bloodGroup: "B+",
    reportingManager: {
      _id: "1",
      firstName: "Ajeet",
      lastName: "Dubey",
      employeeId: "EMP001",
    },
    salary: {
      basic: 35000,
      hra: 14000,
      da: 10500,
      specialAllowance: 7000,
      transportAllowance: 3500,
      medicalAllowance: 2100,
    },
    bankDetails: {
      bankName: "ICICI Bank",
      accountNumber: "0987654321",
      ifscCode: "ICIC0000987",
      branchName: "Delhi Main Branch",
    },
    address: {
      street: "789 Work Street",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110002",
      country: "India",
    },
    emergencyContact: {
      name: "Rajesh Kumar",
      relationship: "Father",
      phone: "+91 9876543213",
    },
    documents: {
      aadhar: "uploaded",
      pan: "uploaded",
    },
    education: {
      highestQualification: "Bachelor of Engineering",
      institution: "Delhi University",
      yearOfCompletion: "2017",
      percentage: 78,
    },
    leaveBalance: {
      paid: 12,
      casual: 6,
      sick: 3,
      short: 1,
      compensatory: 2,
      total: 24,
    },
    isProfileComplete: true,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "3",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@company.com",
    phone: "+91 9876543214",
    employeeId: "EMP003",
    department: "HR",
    designation: "HR Manager",
    role: "manager",
    status: "active",
    joiningDate: "2022-03-10",
    dateOfBirth: "1988-12-10",
    gender: "female",
    maritalStatus: "married",
    bloodGroup: "O+",
    salary: {
      basic: 60000,
      hra: 24000,
      da: 18000,
      specialAllowance: 12000,
      transportAllowance: 6000,
      medicalAllowance: 3600,
    },
    bankDetails: {
      bankName: "SBI Bank",
      accountNumber: "1122334455",
      ifscCode: "SBIN0001122",
      branchName: "Bangalore Main Branch",
    },
    address: {
      street: "321 HR Street",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
    },
    emergencyContact: {
      name: "Amit Sharma",
      relationship: "Spouse",
      phone: "+91 9876543215",
    },
    documents: {
      aadhar: "uploaded",
      pan: "uploaded",
      passport: "uploaded",
    },
    education: {
      highestQualification: "Master of Business Administration",
      institution: "IIM Bangalore",
      yearOfCompletion: "2010",
      percentage: 82,
    },
    leaveBalance: {
      paid: 18,
      casual: 10,
      sick: 7,
      short: 3,
      compensatory: 4,
      total: 42,
    },
    isProfileComplete: true,
    createdAt: "2022-03-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

export const EmployeeDetailsDemo = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">("view");
  const [showReportingManager, setShowReportingManager] = useState(false);

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode("delete");
    setModalOpen(true);
  };

  const handleSaveEmployee = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === updatedEmployee._id ? updatedEmployee : emp))
    );
    setModalOpen(false);
  };

  const handleDeleteEmployeeConfirm = (employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
    setModalOpen(false);
  };

  const handleUpdateReportingManager = (employeeId: string, managerId: string) => {
    const manager = employees.find((emp) => emp._id === managerId);
    if (manager) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === employeeId
            ? {
                ...emp,
                reportingManager: {
                  _id: manager._id,
                  firstName: manager.firstName,
                  lastName: manager.lastName,
                  employeeId: manager.employeeId,
                },
              }
            : emp
        )
      );
    }
  };

  const getTeamMembers = (employeeId: string) => {
    return employees.filter((emp) => emp.reportingManager?._id === employeeId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <Button
          onClick={() => setShowReportingManager(!showReportingManager)}
          className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90"
        >
          <Users className="h-4 w-4 mr-2" />
          Manage Reporting Structure
        </Button>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {employee.firstName} {employee.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{employee.designation}</p>
                </div>
                <div className="flex items-center gap-1">
                  {employee.reportingManager && (
                    <UserCheck className="h-4 w-4 text-blue-600" title="Has Manager" />
                  )}
                  {getTeamMembers(employee._id).length > 0 && (
                    <Users className="h-4 w-4 text-green-600" title="Has Team Members" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  employee.status === "active" ? "bg-green-100 text-green-800" :
                  employee.status === "inactive" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {employee.status}
                </span>
              </div>
              {employee.reportingManager && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-medium">
                    {employee.reportingManager.firstName} {employee.reportingManager.lastName}
                  </span>
                </div>
              )}
              {getTeamMembers(employee._id).length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Team Members:</span>
                  <span className="font-medium">{getTeamMembers(employee._id).length}</span>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewEmployee(employee)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditEmployee(employee)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteEmployee(employee)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reporting Manager Management */}
      {showReportingManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reporting Structure Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee._id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">
                    {employee.firstName} {employee.lastName} - {employee.designation}
                  </h3>
                  <ReportingManagerSelector
                    employee={employee}
                    allEmployees={employees}
                    onUpdateReportingManager={handleUpdateReportingManager}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Modal */}
      {selectedEmployee && (
        <EmployeeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          employee={selectedEmployee}
          teamMembers={getTeamMembers(selectedEmployee._id)}
          onSave={handleSaveEmployee}
          onDelete={handleDeleteEmployeeConfirm}
        />
      )}
    </div>
  );
}; 