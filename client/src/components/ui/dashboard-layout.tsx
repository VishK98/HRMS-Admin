import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  title: string;
  greeting?: string;
  welcomeMessage?: string;
  currentTime?: Date;
  onRefresh?: () => void;
  refreshing?: boolean;
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  };
  secondaryActions?: Array<{
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  }>;
  stats?: ReactNode;
  mainContent?: ReactNode;
  sidebar?: ReactNode;
  error?: string | null;
  onRetry?: () => void;
  loading?: boolean;
  className?: string;
}

export const DashboardLayout = ({
  title,
  greeting,
  welcomeMessage,
  currentTime,
  onRefresh,
  refreshing = false,
  primaryAction,
  secondaryActions = [],
  stats,
  mainContent,
  sidebar,
  error,
  onRetry,
  loading = false,
  className
}: DashboardLayoutProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              {onRetry && (
                <Button onClick={onRetry}>Retry</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-foreground">
              {greeting || title}
            </h1>
          </div>
          {welcomeMessage && (
            <p className="text-lg text-muted-foreground">{welcomeMessage}</p>
          )}

        </div>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              Refresh
            </Button>
          )}
          {secondaryActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
              className="gap-2"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
          {primaryAction && (
            <Button 
              variant={primaryAction.variant || "default"}
              onClick={primaryAction.onClick}
              className="gap-2 bg-gradient-to-r from-[#521138] to-[#843C6D] text-white hover:from-[#521138]/90 hover:to-[#843C6D]/90 transition-all duration-200"
            >
              {primaryAction.icon || <Plus className="w-4 h-4" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats}
        </div>
      )}

      {/* Main Content */}
      {mainContent && (
        <div className={cn(
          "grid gap-6",
          sidebar ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <div className={cn(sidebar && "lg:col-span-2")}>
            {mainContent}
          </div>
          {sidebar && (
            <div className="space-y-6">
              {sidebar}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
