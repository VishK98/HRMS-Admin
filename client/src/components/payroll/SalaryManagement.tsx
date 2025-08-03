import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  baseSalary: number;
  allowances: number;
  bonuses: number;
  totalSalary: number;
  status: "active" | "inactive";
  lastUpdated: string;
}

export const SalaryManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [salaryData, setSalaryData] = useState({
    baseSalary: 0,
    allowances: 0,
    bonuses: 0,
    totalSalary: 0
  });

  useEffect(() => {
    // Simulate API call to fetch employees
    const mockEmployees: Employee[] = [
      {
        id: "1",
        name: "John Doe",
        position: "Senior Developer",
        department: "Engineering",
        baseSalary: 8000,
        allowances: 1200,
        bonuses: 500,
        totalSalary: 9700,
        status: "active",
        lastUpdated: "2024-01-15"
      },
      {
        id: "2",
        name: "Jane Smith",
        position: "Marketing Manager",
        department: "Marketing",
        baseSalary: 7500,
        allowances: 1000,
        bonuses: 800,
        totalSalary: 9300,
        status: "active",
        lastUpdated: "2024-01-14"
      },
      {
        id: "3",
        name: "Mike Johnson",
        position: "HR Specialist",
        department: "Human Resources",
        baseSalary: 6000,
        allowances: 800,
        bonuses: 300,
        totalSalary: 7100,
        status: "active",
        lastUpdated: "2024-01-13"
      },
      {
        id: "4",
        name: "Sarah Wilson",
        position: "Sales Executive",
        department: "Sales",
        baseSalary: 5500,
        allowances: 600,
        bonuses: 1200,
        totalSalary: 7300,
        status: "active",
        lastUpdated: "2024-01-12"
      }
    ];
    setEmployees(mockEmployees);
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleEditSalary = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSalaryData({
      baseSalary: employee.baseSalary,
      allowances: employee.allowances,
      bonuses: employee.bonuses,
      totalSalary: employee.totalSalary
    });
    setIsEditModalOpen(true);
  };

  const handleSaveSalary = () => {
    if (selectedEmployee) {
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...salaryData, lastUpdated: new Date().toISOString().split('T')[0] }
          : emp
      );
      setEmployees(updatedEmployees);
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  const calculateTotalSalary = () => {
    return salaryData.baseSalary + salaryData.allowances + salaryData.bonuses;
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.totalSalary, 0);
  const averageSalary = employees.length > 0 ? totalPayroll / employees.length : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Monthly payroll budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per employee per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter(emp => emp.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              Currently employed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Management</CardTitle>
          <CardDescription>
            Manage employee salaries, allowances, and bonuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hover:bg-[#843C6D] hover:text-white transition-colors">All Departments</SelectItem>
                <SelectItem value="Engineering" className="hover:bg-[#843C6D] hover:text-white transition-colors">Engineering</SelectItem>
                <SelectItem value="Marketing" className="hover:bg-[#843C6D] hover:text-white transition-colors">Marketing</SelectItem>
                <SelectItem value="Sales" className="hover:bg-[#843C6D] hover:text-white transition-colors">Sales</SelectItem>
                <SelectItem value="Human Resources" className="hover:bg-[#843C6D] hover:text-white transition-colors">Human Resources</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>

          {/* Salary Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Bonuses</TableHead>
                  <TableHead>Total Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>${employee.baseSalary.toLocaleString()}</TableCell>
                    <TableCell>${employee.allowances.toLocaleString()}</TableCell>
                    <TableCell>${employee.bonuses.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">${employee.totalSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSalary(employee)}
                          className="hover:bg-[#843C6D] hover:text-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-[#843C6D] hover:text-white transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Salary Modal */}
      {isEditModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Edit Salary - {selectedEmployee.name}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="baseSalary">Base Salary</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={salaryData.baseSalary}
                  onChange={(e) => setSalaryData({
                    ...salaryData,
                    baseSalary: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="allowances">Allowances</Label>
                <Input
                  id="allowances"
                  type="number"
                  value={salaryData.allowances}
                  onChange={(e) => setSalaryData({
                    ...salaryData,
                    allowances: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="bonuses">Bonuses</Label>
                <Input
                  id="bonuses"
                  type="number"
                  value={salaryData.bonuses}
                  onChange={(e) => setSalaryData({
                    ...salaryData,
                    bonuses: Number(e.target.value)
                  })}
                />
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <Label>Total Salary</Label>
                <div className="text-xl font-bold">${calculateTotalSalary().toLocaleString()}</div>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button onClick={handleSaveSalary} className="flex-1">
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 