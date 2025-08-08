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
  Moon,
  Plane,
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
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const superAdminItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Companies", url: "/companies", icon: Building2 },
  { title: "System Health", url: "/system", icon: Shield },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Billing & Plans", url: "/billing", icon: IndianRupee },
  { title: "System Settings", url: "/system-settings", icon: Settings },
];

const adminItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Attendance", url: "/attendance", icon: Clock },
  { title: "Leave", url: "/leave", icon: Plane },
  { title: "Payroll", url: "/payroll", icon: IndianRupee },
  { title: "Calendar", url: "/calendar", icon: Calendar },
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

  const getNavCls = (active: boolean) => {
    const isSuperAdmin = user?.role === "super_admin";

    return cn(
      "w-full justify-start py-5 relative group",
      active
        ? "bg-[var(--theme-primary)] text-white shadow-lg"
        : cn(
            "text-sidebar-foreground",
            isSuperAdmin
              ? "hover:bg-[var(--theme-primary-hover)] hover:text-white border-l-4 border-transparent hover:border-l-[var(--theme-secondary)]"
              : "hover:bg-[var(--theme-primary-hover)] hover:text-white border-l-4 border-transparent hover:border-l-[var(--theme-secondary)]"
          )
    );
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar-background">
        {/* Header with Professional Logo */}
        <div className="border-b border-sidebar-border bg-gradient-to-r from-sidebar-background to-sidebar-accent/30">
          <div className="flex items-center justify-start py-2 pl-4">
            <Logo
              role={user?.role as "super_admin" | "admin"}
              collapsed={collapsed}
            />
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
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
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-5 h-5 transition-all duration-300 flex-shrink-0",
                            "group-hover:rotate-1 group-hover:opacity-80"
                          )}
                        />
                        {!collapsed && (
                          <span className="font-medium transition-all duration-300 group-hover:translate-x-0.5">
                            {item.title}
                          </span>
                        )}
                      </div>
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
            <div className="relative mb-5 bg-sidebar-accent/50 rounded-lg">
              {/* Online Badge */}
              <div className="absolute top-0.5 right-2 flex items-center gap-1 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-[var(--theme-primary)] rounded-full" />
                <span>Online</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "theme-gradient",
                    "text-white font-bold text-sm shadow-sm"
                  )}
                >
                  <span>
                    {String(user?.company_name || user?.name || "OT")
                      .charAt(0)
                      .toUpperCase()}
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
            </div>
          )}

          {/* Enhanced Logout Button */}
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start transition-all duration-300 group",
              "text-red-600 hover:text-red-700 hover:bg-red-50",
              "border border-red-200 hover:border-red-300",
              "rounded-lg font-medium hover:scale-[1.02]",
              "hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)]",
              collapsed && "justify-center"
            )}
          >
            <div className="flex items-center gap-3">
              <LogOut
                className={cn(
                  "w-4 h-4 transition-all duration-300 flex-shrink-0",
                  "group-hover:rotate-12 group-hover:opacity-80"
                )}
              />
              {!collapsed && (
                <span className="transition-all duration-300 group-hover:translate-x-0.5">
                  Sign Out
                </span>
              )}
            </div>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
