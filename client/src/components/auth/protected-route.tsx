import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import OTPVerification from './otp-verification';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

/**
 * A component that protects routes by checking for authentication
 * and optionally verification status.
 */
export default function ProtectedRoute({ 
  children, 
  requireVerification = true 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  const [showVerification, setShowVerification] = React.useState(false);
  
  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      const returnUrl = encodeURIComponent(location);
      setLocation(`/auth?returnUrl=${returnUrl}`);
      return;
    }
    
    // If user needs verification and we're requiring verification
    if (!isLoading && user && user.needsVerification && requireVerification) {
      setShowVerification(true);
    } else {
      setShowVerification(false);
    }
  }, [user, isLoading, location, setLocation, requireVerification]);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Show verification component if user needs to verify
  if (showVerification && user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <OTPVerification
            userId={user.id}
            email={user.email}
            phone={user.phone}
            type={user.phone ? "whatsapp" : "email"}
            onVerified={() => setShowVerification(false)}
            onCancel={() => {
              // Just close the verification screen - user will still be logged in
              // but won't have access to protected features
              setShowVerification(false);
              
              // Redirect to homepage as fallback
              setLocation('/');
            }}
          />
        </div>
      </div>
    );
  }
  
  // If user is authenticated (and verified if required), render the protected content
  return <>{children}</>;
}