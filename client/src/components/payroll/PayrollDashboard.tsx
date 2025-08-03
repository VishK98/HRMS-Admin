import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export const PayrollDashboard = () => {
  const [payrollStats, setPayrollStats] = useState({
    totalPayroll: 0,
    processedPayroll: 0,
    pendingPayroll: 0,
    totalEmployees: 0,
    averageSalary: 0,
    monthlyGrowth: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "payroll_processed",
      message: "Payroll processed for 45 employees",
      amount: "₹125,000",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: 2,
      type: "salary_updated",
      message: "Salary updated for John Doe",
      amount: "₹5,500",
      status: "completed",
      date: "2024-01-14"
    },
    {
      id: 3,
      type: "bonus_paid",
      message: "Performance bonus paid to 12 employees",
      amount: "₹25,000",
      status: "completed",
      date: "2024-01-13"
    },
    {
      id: 4,
      type: "payroll_pending",
      message: "Payroll processing initiated",
      amount: "₹130,000",
      status: "pending",
      date: "2024-01-12"
    }
  ]);

  useEffect(() => {
    // Simulate API call to fetch payroll statistics
    setPayrollStats({
      totalPayroll: 125000,
      processedPayroll: 100000,
      pendingPayroll: 25000,
      totalEmployees: 45,
      averageSalary: 2778,
      monthlyGrowth: 8.5
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payroll_processed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "salary_updated":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "bonus_paid":
        return <IndianRupee className="w-4 h-4 text-purple-600" />;
      case "payroll_pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{payrollStats.totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{payrollStats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Payroll</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{payrollStats.processedPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((payrollStats.processedPayroll / payrollStats.totalPayroll) * 100)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payroll</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{payrollStats.pendingPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payrollStats.totalEmployees} employees pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{payrollStats.averageSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per employee per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payroll Processing Progress</CardTitle>
            <CardDescription>
              Current month payroll processing status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processed</span>
                <span className="text-sm text-muted-foreground">
                  ₹{payrollStats.processedPayroll.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(payrollStats.processedPayroll / payrollStats.totalPayroll) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm text-muted-foreground">
                  ₹{payrollStats.pendingPayroll.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(payrollStats.pendingPayroll / payrollStats.totalPayroll) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>
              Payroll growth compared to previous month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {payrollStats.monthlyGrowth >= 0 ? (
                <ArrowUpRight className="h-8 w-8 text-green-600" />
              ) : (
                <ArrowDownRight className="h-8 w-8 text-red-600" />
              )}
              <div>
                <div className="text-2xl font-bold">
                  {payrollStats.monthlyGrowth >= 0 ? '+' : ''}{payrollStats.monthlyGrowth}%
                </div>
                <p className="text-xs text-muted-foreground">
                  From last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest payroll and salary activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {activity.amount}
                  </span>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 