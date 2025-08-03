import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="hidden md:flex items-center gap-2 relative">
                  <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 w-64 bg-background/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-5">
                {/* Notification Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-muted/50 transition-colors"
                >
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
                </Button>

                {/* Admin Avatar */}
                <div className="flex items-center gap-3">
                  {/* Avatar Circle with Gradient */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br from-[#521138] to-[#843C6D]",
                      "text-white font-bold text-sm shadow-sm"
                    )}
                  >
                    <span>
                      {String(user?.company_name || user?.name || "OT")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>

                  {/* User Name and Role (hidden on small screens) */}
                  <div className="hidden md:block">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role?.replace("_", " ") || "User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
