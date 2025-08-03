import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, Megaphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DesignationManagement } from "@/components/broadcast/DesignationManagement";
import { DepartmentManagement } from "@/components/broadcast/DepartmentManagement";
import { HolidayManagement } from "@/components/broadcast/HolidayManagement";
import { AnnouncementManagement } from "@/components/broadcast/AnnouncementManagement";

export default function Broadcast() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"designations" | "departments" | "holidays" | "announcements">("designations");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Broadcast Management</h1>
        <p className="text-muted-foreground">Manage designations, departments, holidays, and announcements</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        <Button
          variant={activeTab === "designations" ? "default" : "ghost"}
          className="gap-2"
          onClick={() => setActiveTab("designations")}
        >
          <Users className="w-4 h-4" />
          Designations
        </Button>
        <Button
          variant={activeTab === "departments" ? "default" : "ghost"}
          className="gap-2"
          onClick={() => setActiveTab("departments")}
        >
          <Building2 className="w-4 h-4" />
          Departments
        </Button>
        <Button
          variant={activeTab === "holidays" ? "default" : "ghost"}
          className="gap-2"
          onClick={() => setActiveTab("holidays")}
        >
          <Calendar className="w-4 h-4" />
          Holidays
        </Button>
        <Button
          variant={activeTab === "announcements" ? "default" : "ghost"}
          className="gap-2"
          onClick={() => setActiveTab("announcements")}
        >
          <Megaphone className="w-4 h-4" />
          Announcements
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "designations" && <DesignationManagement />}
        {activeTab === "departments" && <DepartmentManagement />}
        {activeTab === "holidays" && <HolidayManagement />}
        {activeTab === "announcements" && <AnnouncementManagement />}
      </div>
    </div>
  );
} 