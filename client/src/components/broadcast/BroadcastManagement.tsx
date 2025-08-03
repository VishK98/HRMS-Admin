import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignationManagement } from "./DesignationManagement";
import { DepartmentManagement } from "./DepartmentManagement";
import { HolidayManagement } from "./HolidayManagement";
import { AnnouncementManagement } from "./AnnouncementManagement";

export const BroadcastManagement = () => {
  const [activeTab, setActiveTab] = useState("designations");

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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