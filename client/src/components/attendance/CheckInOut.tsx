import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle, XCircle, Search, User, Calendar, 
  MapPin, Timer
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Employee } from "@/types/employee";

interface AttendanceRecord {
  _id: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  workingHours: number;
  overtime: number;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export const CheckInOut = () => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees when component mounts
  useEffect(() => {
    if (user?.company?._id) {
      fetchEmployees();
    }
  }, [user]);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.request<{ employees: Employee[] }>(
        `/employees/company/${user!.company!._id}`
      );
      
      if (response.success) {
        setEmployees(response.data!.employees);
      }
    } catch (err) {
      setError("Failed to fetch employees");
      console.error("Error fetching employees:", err);
    }
  };

  const fetchTodaysAttendance = async (empId: string) => {
    try {
      const response = await apiClient.request<AttendanceRecord>(
        `/attendance/today/${empId}`
      );
      
      if (response.success) {
        setAttendance(response.data!);
      } else {
        setAttendance(null);
      }
    } catch (err) {
      setAttendance(null);
    }
  };

  const handleEmployeeSelect = (emp: Employee) => {
    setEmployeeId(emp._id);
    setSearchTerm(`${emp.firstName} ${emp.lastName}`);
    setFilteredEmployees([]);
    fetchTodaysAttendance(emp._id);
  };

  return (
    <div className="space-y-6">
      {/* Employee Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Selection</CardTitle>
          <CardDescription>Select an employee to view attendance details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {filteredEmployees.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee._id}
                    className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                    <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {employeeId && (
            <div className="mt-4 p-3 bg-secondary rounded-md">
              <div className="font-medium">
                Selected: {employees.find(e => e._id === employeeId)?.firstName} {employees.find(e => e._id === employeeId)?.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {employees.find(e => e._id === employeeId)?.employeeId}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>View employee attendance information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          
          {attendance ? (
            <div className="space-y-6">
              <div className="p-4 bg-secondary rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Today's Attendance</h3>
                    <div className="flex items-center gap-2 mt-2">
                      {attendance.checkIn ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span>
                        {attendance.checkIn 
                          ? `Checked in at ${new Date(attendance.checkIn).toLocaleTimeString()}` 
                          : "Not checked in"}
                      </span>
                    </div>
                    
                    {attendance.checkOut && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span>
                          Checked out at {new Date(attendance.checkOut).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      className={
                        attendance.checkOut 
                          ? "bg-success" 
                          : attendance.checkIn 
                            ? "bg-warning" 
                            : "bg-destructive"
                      }
                    >
                      {attendance.checkOut 
                        ? "Checked Out" 
                        : attendance.checkIn 
                          ? "In Progress" 
                          : "Not Checked In"}
                    </Badge>
                    
                    {attendance.workingHours > 0 && (
                      <p className="mt-2 text-sm">
                        Working Hours: {attendance.workingHours.toFixed(2)}h
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Location Information */}
              {(attendance.checkInLocation || attendance.checkOutLocation) && (
                <div className="space-y-4">
                  {attendance.checkInLocation && (
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">Check-in Location</span>
                      </div>
                      <p className="text-sm">
                        Latitude: {attendance.checkInLocation.latitude.toFixed(6)}, 
                        Longitude: {attendance.checkInLocation.longitude.toFixed(6)}
                      </p>
                      {attendance.checkInLocation.address && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {attendance.checkInLocation.address}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {attendance.checkOutLocation && (
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">Check-out Location</span>
                      </div>
                      <p className="text-sm">
                        Latitude: {attendance.checkOutLocation.latitude.toFixed(6)}, 
                        Longitude: {attendance.checkOutLocation.longitude.toFixed(6)}
                      </p>
                      {attendance.checkOutLocation.address && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {attendance.checkOutLocation.address}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Timestamp Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-primary" />
                    <span className="font-medium">Check-in Time</span>
                  </div>
                  <p className="text-sm">
                    {attendance.checkIn 
                      ? new Date(attendance.checkIn).toLocaleString() 
                      : "Not checked in"}
                  </p>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-primary" />
                    <span className="font-medium">Check-out Time</span>
                  </div>
                  <p className="text-sm">
                    {attendance.checkOut 
                      ? new Date(attendance.checkOut).toLocaleString() 
                      : "Not checked out"}
                  </p>
                </div>
              </div>
            </div>
          ) : employeeId ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No attendance record found for today</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Select an employee to view attendance details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
