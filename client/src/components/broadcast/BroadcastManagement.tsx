import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignationManagement } from "./DesignationManagement";
import { DepartmentManagement } from "./DepartmentManagement";
import { HolidayManagement } from "./HolidayManagement";
import { AnnouncementManagement } from "./AnnouncementManagement";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const BroadcastManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("designations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has proper access
  useEffect(() => {
    if (!user?.company?._id) {
      setError("No company access found. Please contact your administrator.");
      toast.error("Company access required");
    } else {
      setError(null);
    }
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear any previous errors when switching tabs
    setError(null);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Broadcast Management</h1>
            <p className="text-muted-foreground">Manage designations, departments, holidays, and announcements</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-sm text-muted-foreground">Please ensure you have proper company access.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Broadcast Management</h1>
          <p className="text-muted-foreground">Manage designations, departments, holidays, and announcements</p>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Broadcast Settings</CardTitle>
          <CardDescription>
            Configure and manage all broadcast-related settings for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="designations">Designations</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="designations" className="mt-6">
              <DesignationManagement />
            </TabsContent>
            
            <TabsContent value="departments" className="mt-6">
              <DepartmentManagement />
            </TabsContent>
            
            <TabsContent value="holidays" className="mt-6">
              <HolidayManagement />
            </TabsContent>
            
            <TabsContent value="announcements" className="mt-6">
              <AnnouncementManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 