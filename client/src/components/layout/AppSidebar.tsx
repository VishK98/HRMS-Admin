import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  Calendar,
  Clock,
  IndianRupee,
  Settings,
  BarChart3,
  LogOut,
  Home,
  Moon ,
  Plane ,
  SatelliteDish,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const superAdminItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Companies", url: "/companies", icon: Building2 },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Billing & Plans", url: "/billing", icon: IndianRupee },
  { title: "System Settings", url: "/system-settings", icon: Settings },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const adminItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Attendance", url: "/attendance", icon: Clock },
  { title: "Leave", url: "/leave", icon: Plane   },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Payroll", url: "/payroll", icon: IndianRupee },
  { title: "Broadcast", url: "/broadcast", icon: SatelliteDish },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const items = user?.role === "super_admin" ? superAdminItems : adminItems;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    cn(
      "w-full justify-start transition-all duration-200",
      active
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    );

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar-background">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">
                HRMS
              </h2>
              <p className="text-xs text-sidebar-foreground/70">
                {user?.role === "super_admin"
                  ? "Super Admin"
                  : user?.company_name}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed && (user?.role === 'super_admin' ? 'Platform Management' : 'HR Management')}
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info & Logout */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="mb-4 p-3 bg-sidebar-accent/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-sidebar-primary-foreground">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-sidebar-foreground/70">Online</span>
              </div>
            </div>
          )}
          
          {/* Enhanced Logout Button */}
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start transition-all duration-200 group",
              "text-red-600 hover:text-red-700 hover:bg-red-50",
              "border border-red-200 hover:border-red-300",
              "rounded-lg font-medium",
              collapsed && "justify-center"
            )}
          >
            <LogOut className={cn(
              "w-4 h-4 transition-transform duration-200",
              "group-hover:scale-110 group-hover:-translate-x-0.5"
            )} />
            {!collapsed && (
              <span className="ml-2">Sign Out</span>
            )}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
