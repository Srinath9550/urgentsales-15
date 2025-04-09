import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

// Updated to work with react-router-dom v6
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user verification is required but not completed
  if (user.needsVerification === true || (user.emailVerified === false && user.role !== 'admin')) {
    return <Navigate to="/auth?verification=required" replace />;
  }

  return <Outlet />;
}

// For routes that need admin role
export function AdminProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
