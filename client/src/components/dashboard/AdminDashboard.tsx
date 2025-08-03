import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Function to get dynamic greeting based on IST time
const getGreeting = () => {
  const nowIST = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });

  const hour = parseInt(nowIST, 10);

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

const stats = [
  {
    title: "Total Employees",
    value: "85",
    change: "+3 this month",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Present Today",
    value: "78",
    change: "91.8% attendance",
    icon: UserCheck,
    color: "text-success",
  },
  {
    title: "Pending Leaves",
    value: "12",
    change: "Needs approval",
    icon: Calendar,
    color: "text-warning",
  },
  {
    title: "Monthly Payroll",
    value: "$45,890",
    change: "Processing",
    icon: DollarSign,
    color: "text-accent",
  },
];

const recentActivities = [
  { action: "John Doe punched in", time: "9:05 AM", type: "attendance" },
  { action: "Sarah Wilson applied for leave", time: "8:45 AM", type: "leave" },
  { action: "Mike Johnson completed project", time: "Yesterday", type: "task" },
  { action: "New employee onboarded", time: "2 days ago", type: "employee" },
];

const pendingApprovals = [
  {
    name: "Sarah Wilson",
    type: "Sick Leave",
    duration: "2 days",
    date: "Jan 25-26",
  },
  {
    name: "Mike Johnson",
    type: "Vacation",
    duration: "5 days",
    date: "Feb 1-5",
  },
  { name: "Emma Davis", type: "Personal", duration: "1 day", date: "Jan 30" },
];

export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground">Glad You’re Back — Welcome to {user?.name}</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90 transition-all duration-200">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>Real-time attendance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm text-muted-foreground">
                  78/85 (91.8%)
                </span>
              </div>
              <Progress value={91.8} className="h-2" />

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <UserCheck className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-success">78</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <UserX className="w-6 h-6 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-destructive">4</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-warning">3</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>
                  Leave requests waiting for approval
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/30 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{approval.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {approval.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {approval.duration} • {approval.date}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="success"
                      className="h-6 px-2 text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
