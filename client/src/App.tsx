import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Broadcast from "./pages/Broadcast";
import Settings from "./pages/Settings";
import Payroll from "./pages/Payroll";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Companies from "./pages/Companies";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedApp = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={
          <ProtectedRoute requiredRole="super_admin">
            <Analytics />
          </ProtectedRoute>
        } />
        {/* Super Admin Only Routes */}
        <Route path="/companies" element={
          <ProtectedRoute requiredRole="super_admin">
            <Companies />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute requiredRole="super_admin">
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/system" element={
          <ProtectedRoute requiredRole="super_admin">
            <div>System Health (Coming Soon)</div>
          </ProtectedRoute>
        } />
        <Route path="/security" element={
          <ProtectedRoute requiredRole="super_admin">
            <div>Security (Coming Soon)</div>
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute requiredRole="super_admin">
            <div>Billing & Plans (Coming Soon)</div>
          </ProtectedRoute>
        } />
        <Route path="/system-settings" element={
          <ProtectedRoute requiredRole="super_admin">
            <div>System Settings (Coming Soon)</div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ProtectedApp />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
