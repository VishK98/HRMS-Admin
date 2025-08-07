import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, User, Users, FileText, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LeaveDashboard } from "@/components/leave/LeaveDashboard";
import { LeaveRequests } from "@/components/leave/LeaveRequests";
import { LeaveReports } from "@/components/leave/LeaveReports";

export default function Leave() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests" | "reports">("dashboard");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">
            Manage employee leave requests, approvals, and reports
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b">
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "dashboard" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("dashboard")}
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "requests" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("requests")}
        >
          <FileText className="w-4 h-4" />
          Leave Requests
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "reports" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("reports")}
        >
          <Calendar className="w-4 h-4" />
          Reports
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "dashboard" && <LeaveDashboard />}
        {activeTab === "requests" && <LeaveRequests />}
        {activeTab === "reports" && <LeaveReports />}
      </div>
    </div>
  );
} 