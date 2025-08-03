import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, User, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AttendanceDashboard } from "@/components/attendance/AttendanceDashboard";
import { CheckInOut } from "@/components/attendance/CheckInOut";
import { AttendanceReports } from "@/components/attendance/AttendanceReports";

export default function Attendance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "check" | "reports">("dashboard");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground">Track and manage employee attendance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "dashboard" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("dashboard")}
        >
          <Calendar className="w-4 h-4" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "check" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("check")}
        >
          <Clock className="w-4 h-4" />
          Check In/Out
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "reports" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("reports")}
        >
          <User className="w-4 h-4" />
          Reports
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "dashboard" && <AttendanceDashboard />}
        {activeTab === "check" && <CheckInOut />}
        {activeTab === "reports" && <AttendanceReports />}
      </div>
    </div>
  );
}
