import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Building2, Bell, Shield, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CompanySettings } from "@/components/settings/CompanySettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { DataSettings } from "@/components/settings/DataSettings";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"company" | "notifications" | "security" | "data">("company");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings Management</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "company" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("company")}
        >
          <Building2 className="w-4 h-4" />
          Company
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "notifications" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell className="w-4 h-4" />
          Notifications
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "security" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("security")}
        >
          <Shield className="w-4 h-4" />
          Security
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "data" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("data")}
        >
          <Database className="w-4 h-4" />
          Data
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "company" && <CompanySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "data" && <DataSettings />}
      </div>
    </div>
  );
} 