import { useAuth } from "@/contexts/AuthContext";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  return <AdminDashboard />;
};

export default Dashboard;