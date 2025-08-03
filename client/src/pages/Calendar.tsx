import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Filter, Search, Users, Clock, CheckCircle, AlertCircle, CalendarDays, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventManagement } from "@/components/calendar/EventManagement";
import { CalendarStats } from "@/components/calendar/CalendarStats";

export default function Calendar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"view" | "events" | "stats">("view");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar Management</h1>
          <p className="text-muted-foreground">
            Manage events, meetings, and important dates
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b">
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "view" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("view")}
        >
          <CalendarDays className="w-4 h-4" />
          Calendar View
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "events" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("events")}
        >
          <CalendarDays className="w-4 h-4" />
          Event Management
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "gap-2 transition-all duration-200",
            activeTab === "stats" 
              ? "bg-[#843C6D] text-white shadow-sm hover:bg-[#d4a81a] hover:text-black" 
              : "hover:bg-[#521149] hover:text-white"
          )}
          onClick={() => setActiveTab("stats")}
        >
          <Users className="w-4 h-4" />
          Statistics
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "view" && <CalendarView />}
        {activeTab === "events" && <EventManagement />}
        {activeTab === "stats" && <CalendarStats />}
      </div>
    </div>
  );
} 