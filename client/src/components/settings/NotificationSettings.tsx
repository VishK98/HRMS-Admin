import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export const NotificationSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    // Email Notifications
    emailNotifications: true,
    emailAttendance: true,
    emailLeave: true,
    emailAnnouncements: true,
    emailReports: false,
    
    // Push Notifications
    pushNotifications: true,
    pushAttendance: true,
    pushLeave: true,
    pushAnnouncements: true,
    pushReports: false,
    
    // SMS Notifications
    smsNotifications: false,
    smsAttendance: false,
    smsLeave: false,
    smsAnnouncements: false,
    
    // In-App Notifications
    inAppNotifications: true,
    inAppAttendance: true,
    inAppLeave: true,
    inAppAnnouncements: true,
    inAppReports: true,
    
    // Frequency Settings
    notificationFrequency: "immediate", // immediate, daily, weekly
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiClient.updateProfile({
        notificationSettings,
      });
      
      if (response.success) {
        console.log("Notification settings updated successfully");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string, enabled: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: enabled,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Configure email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) => toggleCategory("emailNotifications", checked)}
            />
          </div>

          {notificationSettings.emailNotifications && (
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Attendance Updates
                </Label>
                <Switch
                  checked={notificationSettings.emailAttendance}
                  onCheckedChange={(checked) => toggleCategory("emailAttendance", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leave Requests
                </Label>
                <Switch
                  checked={notificationSettings.emailLeave}
                  onCheckedChange={(checked) => toggleCategory("emailLeave", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Announcements
                </Label>
                <Switch
                  checked={notificationSettings.emailAnnouncements}
                  onCheckedChange={(checked) => toggleCategory("emailAnnouncements", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </Label>
                <Switch
                  checked={notificationSettings.emailReports}
                  onCheckedChange={(checked) => toggleCategory("emailReports", checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Configure push notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your device
                </p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) => toggleCategory("pushNotifications", checked)}
            />
          </div>

          {notificationSettings.pushNotifications && (
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Attendance Updates
                </Label>
                <Switch
                  checked={notificationSettings.pushAttendance}
                  onCheckedChange={(checked) => toggleCategory("pushAttendance", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leave Requests
                </Label>
                <Switch
                  checked={notificationSettings.pushLeave}
                  onCheckedChange={(checked) => toggleCategory("pushLeave", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Announcements
                </Label>
                <Switch
                  checked={notificationSettings.pushAnnouncements}
                  onCheckedChange={(checked) => toggleCategory("pushAnnouncements", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </Label>
                <Switch
                  checked={notificationSettings.pushReports}
                  onCheckedChange={(checked) => toggleCategory("pushReports", checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Configure SMS notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base font-medium">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.smsNotifications}
              onCheckedChange={(checked) => toggleCategory("smsNotifications", checked)}
            />
          </div>

          {notificationSettings.smsNotifications && (
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Attendance Updates
                </Label>
                <Switch
                  checked={notificationSettings.smsAttendance}
                  onCheckedChange={(checked) => toggleCategory("smsAttendance", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leave Requests
                </Label>
                <Switch
                  checked={notificationSettings.smsLeave}
                  onCheckedChange={(checked) => toggleCategory("smsLeave", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Announcements
                </Label>
                <Switch
                  checked={notificationSettings.smsAnnouncements}
                  onCheckedChange={(checked) => toggleCategory("smsAnnouncements", checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Configure in-app notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <Label className="text-base font-medium">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the app
                </p>
              </div>
            </div>
            <Switch
              checked={notificationSettings.inAppNotifications}
              onCheckedChange={(checked) => toggleCategory("inAppNotifications", checked)}
            />
          </div>

          {notificationSettings.inAppNotifications && (
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Attendance Updates
                </Label>
                <Switch
                  checked={notificationSettings.inAppAttendance}
                  onCheckedChange={(checked) => toggleCategory("inAppAttendance", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Leave Requests
                </Label>
                <Switch
                  checked={notificationSettings.inAppLeave}
                  onCheckedChange={(checked) => toggleCategory("inAppLeave", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Announcements
                </Label>
                <Switch
                  checked={notificationSettings.inAppAnnouncements}
                  onCheckedChange={(checked) => toggleCategory("inAppAnnouncements", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </Label>
                <Switch
                  checked={notificationSettings.inAppReports}
                  onCheckedChange={(checked) => toggleCategory("inAppReports", checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Status
          </CardTitle>
          <CardDescription>
            Overview of your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {notificationSettings.emailNotifications ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span>Email Notifications</span>
              </div>
              <Badge variant={notificationSettings.emailNotifications ? "default" : "secondary"}>
                {notificationSettings.emailNotifications ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {notificationSettings.pushNotifications ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span>Push Notifications</span>
              </div>
              <Badge variant={notificationSettings.pushNotifications ? "default" : "secondary"}>
                {notificationSettings.pushNotifications ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {notificationSettings.smsNotifications ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span>SMS Notifications</span>
              </div>
              <Badge variant={notificationSettings.smsNotifications ? "default" : "secondary"}>
                {notificationSettings.smsNotifications ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {notificationSettings.inAppNotifications ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span>In-App Notifications</span>
              </div>
              <Badge variant={notificationSettings.inAppNotifications ? "default" : "secondary"}>
                {notificationSettings.inAppNotifications ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
}; 