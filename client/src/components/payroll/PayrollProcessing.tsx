import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Play, 
  Pause, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react";

interface PayrollRun {
  id: string;
  period: string;
  status: "pending" | "processing" | "completed" | "failed";
  totalEmployees: number;
  processedEmployees: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  processedAt?: string;
  createdBy: string;
}

export const PayrollProcessing = () => {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [currentRun, setCurrentRun] = useState<PayrollRun | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const [newRunData, setNewRunData] = useState({
    period: "",
    startDate: "",
    endDate: "",
    totalEmployees: 0
  });

  useEffect(() => {
    // Simulate API call to fetch payroll runs
    const mockPayrollRuns: PayrollRun[] = [
      {
        id: "1",
        period: "January 2024",
        status: "completed",
        totalEmployees: 45,
        processedEmployees: 45,
        totalAmount: 125000,
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        processedAt: "2024-01-15T10:30:00Z",
        createdBy: "Admin User"
      },
      {
        id: "2",
        period: "December 2023",
        status: "completed",
        totalEmployees: 42,
        processedEmployees: 42,
        totalAmount: 118000,
        startDate: "2023-12-01",
        endDate: "2023-12-31",
        processedAt: "2023-12-15T09:15:00Z",
        createdBy: "Admin User"
      },
      {
        id: "3",
        period: "February 2024",
        status: "processing",
        totalEmployees: 45,
        processedEmployees: 23,
        totalAmount: 125000,
        startDate: "2024-02-01",
        endDate: "2024-02-29",
        createdBy: "Admin User"
      },
      {
        id: "4",
        period: "March 2024",
        status: "pending",
        totalEmployees: 45,
        processedEmployees: 0,
        totalAmount: 125000,
        startDate: "2024-03-01",
        endDate: "2024-03-31",
        createdBy: "Admin User"
      }
    ];
    setPayrollRuns(mockPayrollRuns);
  }, []);

  const handleStartProcessing = (run: PayrollRun) => {
    setCurrentRun(run);
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Update the run status
          setPayrollRuns(prevRuns => 
            prevRuns.map(r => 
              r.id === run.id 
                ? { ...r, status: "completed", processedAt: new Date().toISOString() }
                : r
            )
          );
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleCreateNewRun = () => {
    const newRun: PayrollRun = {
      id: Date.now().toString(),
      period: newRunData.period,
      status: "pending",
      totalEmployees: newRunData.totalEmployees,
      processedEmployees: 0,
      totalAmount: 125000, // This would be calculated based on employee data
      startDate: newRunData.startDate,
      endDate: newRunData.endDate,
      createdBy: "Admin User"
    };
    setPayrollRuns(prev => [newRun, ...prev]);
    setNewRunData({ period: "", startDate: "", endDate: "", totalEmployees: 0 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-[#843C6D]/10 text-[#843C6D]";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-[#843C6D]" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const completedRuns = payrollRuns.filter(run => run.status === "completed");
  const pendingRuns = payrollRuns.filter(run => run.status === "pending");
  const processingRuns = payrollRuns.filter(run => run.status === "processing");

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollRuns.length}</div>
            <p className="text-xs text-muted-foreground">
              All time payroll runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRuns.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRuns.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingRuns.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Payroll Run */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Payroll Run</CardTitle>
          <CardDescription>
            Initiate a new payroll processing cycle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="period">Payroll Period</Label>
              <Input
                id="period"
                placeholder="e.g., January 2024"
                value={newRunData.period}
                onChange={(e) => setNewRunData({ ...newRunData, period: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newRunData.startDate}
                onChange={(e) => setNewRunData({ ...newRunData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newRunData.endDate}
                onChange={(e) => setNewRunData({ ...newRunData, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateNewRun} className="w-full">
                Create Run
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && currentRun && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Payroll</CardTitle>
            <CardDescription>
              Processing {currentRun.period} payroll run
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Processing {currentRun.processedEmployees} of {currentRun.totalEmployees} employees</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payroll Runs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Runs</CardTitle>
          <CardDescription>
            View and manage all payroll processing runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Processed At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.period}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(run.status)}
                        <Badge className={getStatusColor(run.status)}>
                          {run.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {run.processedEmployees} / {run.totalEmployees}
                    </TableCell>
                    <TableCell>${run.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(run.startDate).toLocaleDateString()} - {new Date(run.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {run.processedAt ? new Date(run.processedAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {run.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartProcessing(run)}
                            disabled={isProcessing}
                            className="hover:bg-[#843C6D] hover:text-white transition-colors"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {run.status === "completed" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-[#843C6D] hover:text-white transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-[#843C6D] hover:text-white transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 