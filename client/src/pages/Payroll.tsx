import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, User, Users, FileText, BarChart3, IndianRupee, CreditCard, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";
import { SalaryManagement } from "@/components/payroll/SalaryManagement";
import { PayrollProcessing } from "@/components/payroll/PayrollProcessing";
import { PayrollReports } from "@/components/payroll/PayrollReports";

export default function Payroll() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "salary" | "processing" | "reports">("dashboard");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">
            Manage employee salaries, process payroll, and generate reports
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
            activeTab === "salary" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("salary")}
        >
          <IndianRupee className="w-4 h-4" />
          Salary Management
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "processing" 
              ? "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--secondary)] hover:text-black" 
              : "hover:bg-[var(--primary-hover)] hover:text-white"
          )}
          onClick={() => setActiveTab("processing")}
        >
          <CreditCard className="w-4 h-4" />
          Payroll Processing
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
          <FileText className="w-4 h-4" />
          Reports
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "dashboard" && <PayrollDashboard />}
        {activeTab === "salary" && <SalaryManagement />}
        {activeTab === "processing" && <PayrollProcessing />}
        {activeTab === "reports" && <PayrollReports />}
      </div>
    </div>
  );
} 