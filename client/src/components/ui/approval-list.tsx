import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { ApprovalItem } from "./approval-item";

interface ApprovalListProps {
  title?: string;
  description?: string;
  approvals: Array<{
    name: string;
    type: string;
    duration?: string;
    date: string;
    status?: string;
  }>;
  loading?: boolean;
  maxItems?: number;
  showCount?: boolean;
  onApprove?: (index: number) => void;
  onReject?: (index: number) => void;
  className?: string;
}

export const ApprovalList = ({
  title = "Pending Approvals",
  description = "Leave requests waiting for approval",
  approvals,
  loading = false,
  maxItems = 5,
  showCount = true,
  onApprove,
  onReject,
  className
}: ApprovalListProps) => {
  const displayApprovals = approvals.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showCount && (
            <Badge variant="outline" className="text-xs">
              {loading ? '...' : approvals.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: maxItems }).map((_, index) => (
              <ApprovalItem
                key={index}
                name=""
                type=""
                date=""
                loading={true}
              />
            ))
          ) : displayApprovals.length > 0 ? (
            displayApprovals.map((approval, index) => (
              <ApprovalItem
                key={index}
                name={approval.name}
                type={approval.type}
                duration={approval.duration}
                date={approval.date}
                status={approval.status}
                onApprove={onApprove ? () => onApprove(index) : undefined}
                onReject={onReject ? () => onReject(index) : undefined}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending approvals</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
