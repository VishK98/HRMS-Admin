import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'super_admin' | 'admin';
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/' 
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. This feature requires {requiredRole === 'super_admin' ? 'super admin' : 'admin'} privileges.
          </p>
          {requiredRole === 'super_admin' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Super Admin Credentials:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Email:</strong> admin@othtech.com</p>
                <p><strong>Password:</strong> admin@123</p>
              </div>
            </div>
          )}
          <Button onClick={() => window.history.back()} variant="outline" className="mr-2">
            Go Back
          </Button>
          <Button onClick={() => window.location.href = fallbackPath}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 