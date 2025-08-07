import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserCheck, UserX, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceOverviewProps {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  loading?: boolean;
  className?: string;
}

export const AttendanceOverview = ({
  totalEmployees,
  presentCount,
  absentCount,
  lateCount,
  attendanceRate,
  loading = false,
  className
}: AttendanceOverviewProps) => {
  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={cn("lg:col-span-2", className)}>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription>Real-time attendance tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted animate-pulse rounded w-32" />
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
            </div>
            <div className="h-2 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="w-6 h-6 bg-muted animate-pulse rounded mx-auto mb-2" />
                  <div className="h-6 bg-muted animate-pulse rounded mx-auto mb-1" />
                  <div className="h-3 bg-muted animate-pulse rounded mx-auto w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Attendance Rate</span>
              <span className="text-sm text-muted-foreground">
                {presentCount}/{totalEmployees} ({attendanceRate.toFixed(1)}%)
              </span>
            </div>
            <Progress 
              value={attendanceRate} 
              className={cn("h-2", getAttendanceColor(attendanceRate))} 
            />

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                <UserX className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Employees</span>
              </div>
              <span className="text-sm font-medium">{totalEmployees}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
