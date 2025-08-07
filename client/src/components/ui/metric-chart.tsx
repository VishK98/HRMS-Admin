import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricChartProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
  className?: string;
}

export const MetricChart = ({
  title,
  value,
  change,
  changeLabel,
  trend = 'neutral',
  icon,
  color = "text-primary",
  loading = false,
  className
}: MetricChartProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={cn("relative overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className={cn("w-5 h-5", color)}>{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            {(change !== undefined || changeLabel) && (
              <div className="flex items-center gap-2 mt-1">
                {getTrendIcon()}
                <span className={cn("text-xs", getTrendColor())}>
                  {change !== undefined && `${change > 0 ? '+' : ''}${change}%`}
                  {changeLabel && ` ${changeLabel}`}
                </span>
                {trend && (
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getTrendColor())}
                  >
                    {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
                  </Badge>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
