import { useState } from "react";
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, ArrowRight } from "lucide-react";

interface ReportingManagerSelectorProps {
  employee: Employee;
  allEmployees: Employee[];
  onUpdateReportingManager: (employeeId: string, managerId: string | null) => void;
}

export const ReportingManagerSelector = ({
  employee,
  allEmployees,
  onUpdateReportingManager,
}: ReportingManagerSelectorProps) => {
  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    employee.reportingManager?._id || "none"
  );

  // Filter out the current employee and get potential managers
  const potentialManagers = allEmployees.filter(
    (emp) => emp._id !== employee._id && emp.role === "manager"
  );

  // Get current team members (employees who report to this employee)
  const teamMembers = allEmployees.filter(
    (emp) => emp.reportingManager?._id === employee._id
  );

  const handleManagerChange = (managerId: string) => {
    setSelectedManagerId(managerId);
  };

  const handleSave = () => {
    const currentManagerId = employee.reportingManager?._id || "none";
    if (selectedManagerId !== currentManagerId) {
      const managerId = selectedManagerId === "none" ? null : selectedManagerId;
      onUpdateReportingManager(employee._id, managerId);
    }
  };

  const currentManager = employee.reportingManager;
  const selectedManager = selectedManagerId === "none" ? null : allEmployees.find((emp) => emp._id === selectedManagerId);

  return (
    <div className="space-y-6">
      {/* Current Reporting Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Reporting Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Manager */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <UserCheck className="h-4 w-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-xs text-gray-600">{employee.designation || "Employee"}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              {currentManager ? (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    {currentManager.firstName} {currentManager.lastName}
                  </p>
                  <p className="text-xs text-gray-600">Manager</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No Manager Assigned</p>
              )}
            </div>
          </div>

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Direct Reports ({teamMembers.length})</p>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member._id} className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{member.designation || "Employee"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Reporting Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Change Reporting Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manager-select" className="text-sm font-medium">
              Select New Manager
            </Label>
            <Select value={selectedManagerId} onValueChange={handleManagerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Manager</SelectItem>
                {potentialManagers.map((manager) => (
                  <SelectItem key={manager._id} value={manager._id}>
                    {manager.firstName} {manager.lastName} - {manager.designation || "Manager"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview of Change */}
          {selectedManager && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">New Reporting Structure:</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-xs text-gray-600">{employee.designation || "Employee"}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedManager.firstName} {selectedManager.lastName}
                  </p>
                  <p className="text-xs text-gray-600">{selectedManager.designation || "Manager"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedManagerId(employee.reportingManager?._id || "none")}
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedManagerId === (employee.reportingManager?._id || "none")}
              className="bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90"
            >
              Update Manager
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 