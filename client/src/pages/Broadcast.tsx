import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, Megaphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
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
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "designations" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("designations")}
        >
          <Users className="w-4 h-4" />
          Designations
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "departments" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("departments")}
        >
          <Building2 className="w-4 h-4" />
          Departments
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "holidays" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("holidays")}
        >
          <Calendar className="w-4 h-4" />
          Holidays
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "announcements" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
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