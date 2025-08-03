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
  Download, 
  Eye, 
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  BarChart3,
  PieChart,
  CheckCircle
} from "lucide-react";

interface PayrollReport {
  id: string;
  name: string;
  type: "monthly" | "quarterly" | "annual" | "custom";
  period: string;
  totalAmount: number;
  employeeCount: number;
  status: "generated" | "pending" | "failed";
  generatedAt: string;
  generatedBy: string;
}

export const PayrollReports = () => {
  const [reports, setReports] = useState<PayrollReport[]>([]);
  const [selectedReportType, setSelectedReportType] = useState("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch reports
    const mockReports: PayrollReport[] = [
      {
        id: "1",
        name: "Monthly Payroll Report - January 2024",
        type: "monthly",
        period: "January 2024",
        totalAmount: 125000,
        employeeCount: 45,
        status: "generated",
        generatedAt: "2024-01-15T10:30:00Z",
        generatedBy: "Admin User"
      },
      {
        id: "2",
        name: "Quarterly Payroll Report - Q4 2023",
        type: "quarterly",
        period: "Q4 2023",
        totalAmount: 350000,
        employeeCount: 42,
        status: "generated",
        generatedAt: "2024-01-01T09:15:00Z",
        generatedBy: "Admin User"
      },
      {
        id: "3",
        name: "Annual Payroll Report - 2023",
        type: "annual",
        period: "2023",
        totalAmount: 1250000,
        employeeCount: 40,
        status: "generated",
        generatedAt: "2024-01-01T08:00:00Z",
        generatedBy: "Admin User"
      },
      {
        id: "4",
        name: "Custom Payroll Report - Dec 2023",
        type: "custom",
        period: "December 2023",
        totalAmount: 118000,
        employeeCount: 42,
        status: "generated",
        generatedAt: "2023-12-15T14:20:00Z",
        generatedBy: "Admin User"
      }
    ];
    setReports(mockReports);
  }, []);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: PayrollReport = {
        id: Date.now().toString(),
        name: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Payroll Report - ${selectedPeriod}`,
        type: selectedReportType as any,
        period: selectedPeriod,
        totalAmount: 125000,
        employeeCount: 45,
        status: "generated",
        generatedAt: new Date().toISOString(),
        generatedBy: "Admin User"
      };
      
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      setSelectedPeriod("");
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "monthly":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "quarterly":
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      case "annual":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "custom":
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalReports = reports.length;
  const generatedReports = reports.filter(r => r.status === "generated").length;
  const totalAmount = reports.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              All time reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedReports}</div>
            <p className="text-xs text-muted-foreground">
              Successfully generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Average per report
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Create a new payroll report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  <SelectItem value="annual">Annual Report</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                placeholder="e.g., January 2024"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGenerateReport} 
                className="w-full"
                disabled={isGenerating || !selectedPeriod}
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Reports</CardTitle>
          <CardDescription>
            View and manage all generated payroll reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getReportTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>${report.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{report.employeeCount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(report.generatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>
              Generate common payroll reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              This Month's Payroll
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Last Quarter Summary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Annual Payroll Summary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Employee Salary Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>
              Export reports in different formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="w-4 h-4 mr-2" />
              Generate Charts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 