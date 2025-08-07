import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApprovalItemProps {
  name: string;
  type: string;
  duration?: string;
  date: string;
  status?: string;
  onApprove?: () => void;
  onReject?: () => void;
  loading?: boolean;
  className?: string;
}

export const ApprovalItem = ({
  name,
  type,
  duration,
  date,
  status,
  onApprove,
  onReject,
  loading = false,
  className
}: ApprovalItemProps) => {
  const getTypeColor = () => {
    switch (type.toLowerCase()) {
      case 'sick leave':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'vacation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'personal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'leave request':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={cn(
      "p-3 rounded-lg bg-muted/30 space-y-1 transition-all duration-200 hover:bg-muted/50",
      className
    )}>
      {loading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-5 bg-muted animate-pulse rounded w-16" />
          </div>
          <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-muted animate-pulse rounded w-16" />
            <div className="h-6 bg-muted animate-pulse rounded w-16" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm truncate">{name}</p>
            <Badge variant="outline" className={cn("text-xs", getTypeColor())}>
              {type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {duration && `${duration} • `}{date}
          </p>
          {status && (
            <p className="text-xs text-muted-foreground">
              Status: {status}
            </p>
          )}
          {(onApprove || onReject) && (
            <div className="flex gap-2 mt-2">
              {onApprove && (
                <Button
                  size="sm"
                  variant="default"
                  className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                  onClick={onApprove}
                >
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={onReject}
                >
                  Reject
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
