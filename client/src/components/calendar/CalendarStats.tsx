import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  CalendarDays
} from "lucide-react";

export const CalendarStats = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    cancelledEvents: 0,
    totalAttendees: 0,
    averageEventDuration: 0,
    eventsByType: {
      meeting: 0,
      holiday: 0,
      review: 0,
      training: 0
    },
    eventsByLocation: {
      "Conference Room A": 0,
      "Conference Room B": 0,
      "HR Office": 0,
      "Training Room": 0,
      "Office Closed": 0
    },
    monthlyTrend: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "event_created",
      message: "Team Meeting scheduled for tomorrow",
      date: "2024-01-14",
      status: "completed"
    },
    {
      id: 2,
      type: "event_updated",
      message: "Performance Review rescheduled to next week",
      date: "2024-01-13",
      status: "completed"
    },
    {
      id: 3,
      type: "event_cancelled",
      message: "Training session cancelled due to low attendance",
      date: "2024-01-12",
      status: "cancelled"
    },
    {
      id: 4,
      type: "event_completed",
      message: "Monthly team sync completed successfully",
      date: "2024-01-11",
      status: "completed"
    }
  ]);

  useEffect(() => {
    // Simulate API call to fetch calendar statistics
    setStats({
      totalEvents: 45,
      upcomingEvents: 12,
      completedEvents: 28,
      cancelledEvents: 5,
      totalAttendees: 156,
      averageEventDuration: 1.5,
      eventsByType: {
        meeting: 20,
        holiday: 8,
        review: 10,
        training: 7
      },
      eventsByLocation: {
        "Conference Room A": 15,
        "Conference Room B": 8,
        "HR Office": 5,
        "Training Room": 7,
        "Office Closed": 10
      },
      monthlyTrend: 12.5
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "event_created":
        return <CalendarDays className="w-4 h-4 text-green-600" />;
      case "event_updated":
        return <Calendar className="w-4 h-4 text-[#843C6D]" />;
      case "event_cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "event_completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyTrend}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageEventDuration}h</div>
            <p className="text-xs text-muted-foreground">
              Per event
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Status and Type Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of events by status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completedEvents} events
                </span>
              </div>
              <Progress 
                value={(stats.completedEvents / stats.totalEvents) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Upcoming</span>
                <span className="text-sm text-muted-foreground">
                  {stats.upcomingEvents} events
                </span>
              </div>
              <Progress 
                value={(stats.upcomingEvents / stats.totalEvents) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cancelled</span>
                <span className="text-sm text-muted-foreground">
                  {stats.cancelledEvents} events
                </span>
              </div>
              <Progress 
                value={(stats.cancelledEvents / stats.totalEvents) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
            <CardDescription>
              Distribution of events by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.eventsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="capitalize">
                      {type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {count} events
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((count / stats.totalEvents) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Usage and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Usage</CardTitle>
            <CardDescription>
              Most used meeting locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.eventsByLocation)
                .sort(([,a], [,b]) => b - a)
                .map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {count} events
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round((count / stats.totalEvents) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest calendar activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
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
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
          <CardDescription>
            Event creation trend over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {stats.monthlyTrend >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
            <div>
              <div className="text-2xl font-bold">
                {stats.monthlyTrend >= 0 ? '+' : ''}{stats.monthlyTrend}%
              </div>
              <p className="text-xs text-muted-foreground">
                From last month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 