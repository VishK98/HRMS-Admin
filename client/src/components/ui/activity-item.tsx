import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  action: string;
  time: string;
  type: 'attendance' | 'leave' | 'task' | 'employee' | 'system' | 'security';
  loading?: boolean;
  className?: string;
}

export const ActivityItem = ({
  action,
  time,
  type,
  loading = false,
  className
}: ActivityItemProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'attendance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'leave':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'task':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'employee':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'security':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'attendance':
        return '🕐';
      case 'leave':
        return '📅';
      case 'task':
        return '✅';
      case 'employee':
        return '👤';
      case 'system':
        return '⚙️';
      case 'security':
        return '🔒';
      default:
        return '📝';
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors",
      className
    )}>
      {loading ? (
        <>
          <div className="w-2 h-2 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{action}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs capitalize flex items-center gap-1", getTypeColor())}
          >
            <span>{getTypeIcon()}</span>
            {type}
          </Badge>
        </>
      )}
    </div>
  );
};
