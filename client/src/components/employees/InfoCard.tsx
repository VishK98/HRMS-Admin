import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

export const InfoCard = ({ icon: Icon, title, children, className = "" }: InfoCardProps) => {
  return (
    <Card className={`bg-white border border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <CardTitle className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 py-3">
        {children}
      </CardContent>
    </Card>
  );
}; 