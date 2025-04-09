import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface OTPVerificationProps {
  userId: number;
  email: string;
  phone?: string;
  type: "email" | "whatsapp" | "sms";
  onVerified: () => void;
  onCancel: () => void;
}

export default function OTPVerification({
  userId,
  email,
  phone,
  type = "email",
  onVerified,
  onCancel,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if user is authenticated and matches the expected userId
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!user) {
        try {
          // If user is not authenticated in context but we have userId, attempt to check user
          const response = await fetch('/api/user');
          if (!response.ok) {
            console.warn('User not authenticated for OTP verification');
            toast({
              title: "Authentication issue",
              description: "Please try logging in again before verification",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
    };
    
    checkAuthStatus();
  }, [user, userId, toast]);

  const getRecipientContact = () => {
    if (type === "email") return email;
    return phone ? phone : "your phone";
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code sent to you",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationStatus("idle");

      // Now verify the OTP - credentials should be automatically included
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important to include credentials
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }
      
      const data = await response.json();

      if (data.verified) {
        setVerificationStatus("success");
        
        // First refresh the user data to ensure we have updated verification status
        try {
          await fetch('/api/user', { 
            method: 'GET',
            credentials: 'include'
          });
        } catch (refreshError) {
          console.warn("Failed to refresh user data:", refreshError);
        }
        
        toast({
          title: "Verification successful",
          description: `Your ${type} has been verified.`,
          variant: "default",
        });

        // Notify parent component about successful verification
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setVerificationStatus("error");
        toast({
          title: "Verification failed",
          description: data.message || "Invalid or expired OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);

      // First ensure the user is authenticated
      const userCheckResponse = await fetch('/api/user', {
        credentials: 'include'
      });
      
      if (!userCheckResponse.ok) {
        // If user is not authenticated, notify user
        toast({
          title: "Authentication required",
          description: "Please login before requesting a new OTP",
          variant: "destructive",
        });
        return;
      }

      // Now resend the OTP with proper authentication
      const response = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for authenticated request
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "OTP resent",
          description: `A new verification code has been sent to ${getRecipientContact()}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to resend OTP",
          description: data.message || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Failed to resend OTP",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verification Required</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to {getRecipientContact()}{" "}
          via {type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isVerifying || verificationStatus === "success"}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verificationStatus === "success" && (
          <div className="flex items-center justify-center text-green-600 gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Verification successful</span>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="flex items-center justify-center text-red-600 gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Invalid or expired code. Please try again.</span>
          </div>
        )}

        <div className="text-sm text-center">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOTP}
            disabled={isResending || isVerifying}
            className="text-primary hover:underline font-medium"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isVerifying || verificationStatus === "success"}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          disabled={
            otp.length !== 6 || isVerifying || verificationStatus === "success"
          }
          className="w-full sm:w-auto"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
