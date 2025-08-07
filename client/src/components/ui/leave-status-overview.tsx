import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, UserMinus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveStatusOverviewProps {
  totalEmployees: number;
  onLeaveCount: number;
  halfDayCount: number;
  shortLeaveCount: number;
  leaveRate: number;
  loading?: boolean;
  className?: string;
}

export const LeaveStatusOverview = ({
  totalEmployees,
  onLeaveCount,
  halfDayCount,
  shortLeaveCount,
  leaveRate,
  loading = false,
  className
}: LeaveStatusOverviewProps) => {
  const getLeaveColor = (rate: number) => {
    if (rate <= 10) return 'bg-green-500';
    if (rate <= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={cn("lg:col-span-2 mt-5", className)}>
      <CardHeader>
        <CardTitle>Today's Leave Status</CardTitle>
        <CardDescription>Real-time leave tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading leave data...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Leave Rate</span>
              <span className="text-sm text-muted-foreground">
                {onLeaveCount + halfDayCount + shortLeaveCount}/{totalEmployees} ({leaveRate.toFixed(1)}%)
              </span>
            </div>
            <Progress 
              value={leaveRate} 
              className={cn("h-2", getLeaveColor(leaveRate))} 
            />

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                <Calendar className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{onLeaveCount}</p>
                <p className="text-xs text-muted-foreground">On Leave</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{halfDayCount}</p>
                <p className="text-xs text-muted-foreground">Half Day</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <UserMinus className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{shortLeaveCount}</p>
                <p className="text-xs text-muted-foreground">Short Leave</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
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
