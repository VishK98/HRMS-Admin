import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { ActivityItem } from "./activity-item";

interface ActivityFeedProps {
  title?: string;
  description?: string;
  activities: Array<{
    action: string;
    time: string;
    type: 'attendance' | 'leave' | 'task' | 'employee' | 'system' | 'security';
  }>;
  loading?: boolean;
  maxItems?: number;
  showCount?: boolean;
  className?: string;
}

export const ActivityFeed = ({
  title = "Recent Activities",
  description = "Latest updates and activities",
  activities,
  loading = false,
  maxItems = 5,
  showCount = true,
  className
}: ActivityFeedProps) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showCount && (
            <Badge variant="outline" className="text-xs">
              {loading ? '...' : activities.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: maxItems }).map((_, index) => (
              <ActivityItem
                key={index}
                action=""
                time=""
                type="system"
                loading={true}
              />
            ))
          ) : displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                action={activity.action}
                time={activity.time}
                type={activity.type}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
