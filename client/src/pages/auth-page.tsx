import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertUserSchema,
  verificationMethods,
  userRoles,
} from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Loader2, Check, MapPin, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Import our custom verification components
import OTPVerification from "@/components/auth/otp-verification";
import VerificationMethodSelector from "@/components/auth/verification-method-selector";

// Extend the insert schema with additional validation
const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = insertUserSchema
  .extend({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
    role: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Create schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  confirmPassword: z.string(),
  resetToken: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [_, setLocation] = useLocation();
  const { user, login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  // Helper function to navigate with wouter
  const navigate = (path: string) => setLocation(path);

  // Track the registration flow state
  const [registrationState, setRegistrationState] = useState<
    "form" | "verification-method" | "verification"
  >("form");
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState<
    "email" | "whatsapp" | "sms"
  >("email");
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phone: "",
      role: "user",
    },
  });
  
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Forgot password states
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  
  // Create forms for forgot password functionality
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      resetToken: "",
    },
  });

  // Redirect if already logged in and check for reset token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verificationRequired = urlParams.get('verification') === 'required';
    const resetTokenFromUrl = urlParams.get('token');
    
    // Check if there's a reset token in the URL
    if (resetTokenFromUrl) {
      setResetToken(resetTokenFromUrl);
      setShowForgotPasswordDialog(true);
      setForgotPasswordSuccess(true);
      
      // Set token value in the reset password form
      resetPasswordForm.setValue('resetToken', resetTokenFromUrl);
      return;
    }
    
    // Handle verification required parameter - show verification UI if needed
    if (verificationRequired && user) {
      setRegisteredUser(user);
      setSelectedVerificationMethod("email");
      setRegistrationState("verification");
      return;
    }
    
    // If user is already logged in and doesn't need verification, redirect to dashboard
    if (user && !verificationRequired && !user.needsVerification) {
      navigate('/');
    }
  }, [user, navigate, resetPasswordForm]);

    // Add these state variables with your other useState declarations
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      // Add this state variable with your other useState declarations
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoginLoading(true);
      setAuthError(null);
      
      // Call login but get the full response data
      const userData = await login(data) as any;
      
      // Check if user needs verification
      if (userData && userData.needsVerification === true) {
        // User needs to verify their email
        toast({
          title: "Verification required",
          description: "Please verify your account to access all features.",
        });
        
        // Set registration state and verification method for OTP verification
        setRegisteredUser(userData);
        setSelectedVerificationMethod("email");
        setRegistrationState("verification");
        
        // Return early
        return;
      }
      
      // If we got here, user is verified and login was successful
      // Success toast
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });

      // Create property recommendation notification
      try {
        await fetch("/api/notifications/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Property Recommendations",
            message:
              "We have some new property recommendations based on your preferences",
            type: "property",
            linkTo: "/",
          }),
        });
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }

      // Navigate to homepage instead of dashboard
      navigate("/");
    } catch (error: any) {
      // Check if this is an existing account error
      if (error?.message?.includes("account with this email already exists")) {
        setAuthError("This email is already associated with an account. Please use a different email or try resetting your password.");
        toast({
          title: "Existing account detected",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        // Switch to login tab
        setActiveTab("login");
      } else {
        setAuthError("Login failed. Please check your credentials.");
        console.error("Login error:", error);

        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsRegisterLoading(true);
      setAuthError(null);

      // Remove confirmPassword as it's not in the API schema
      const { confirmPassword, ...registerData } = data;

      // If phone is provided, show verification method selection
      if (data.phone) {
        setRegisteredUser({
          ...registerData,
        });
        setRegistrationState("verification-method");
      } else {
        // No phone provided, use email verification directly
        await signupWithVerification(registerData, "email");
      }
    } catch (error: any) {
      // Check if this is an existing account error
      if (error?.message?.includes("Email already in use") || 
          error?.message?.includes("Username already exists")) {
        setAuthError("An account with this email or username already exists. Please try logging in instead.");
        toast({
          title: "Account already exists",
          description: "Please use different credentials or try logging in with your existing account.",
          variant: "destructive",
        });
        // Switch to login tab
        setActiveTab("login");
      } else {
        setAuthError("Registration failed. Please try again.");
        console.error("Registration error:", error);
        
        toast({
          title: "Registration failed",
          description: error?.message || "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const signupWithVerification = async (
    userData: any,
    verificationMethod: "email" | "whatsapp" | "sms",
  ) => {
    try {
      setIsRegisterLoading(true);

      // Add verification method to the request
      const response = await signup({
        ...userData,
        verificationMethod,
      });

      // Store the registered user for the verification step
      setRegisteredUser(response);
      setSelectedVerificationMethod(verificationMethod);

      // Show OTP verification UI
      setRegistrationState("verification");

      // Show toast for OTP sent
      const recipient =
        verificationMethod === "email" ? userData.email : userData.phone;
      toast({
        title: "Verification required",
        description: `A verification code has been sent to ${recipient}`,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Check for specific error cases
      if (error?.message?.includes("Email already in use") || 
          error?.message?.includes("Username already exists")) {
        setAuthError("An account with this email or username already exists. Please try logging in instead.");
        toast({
          title: "Account already exists",
          description: "Please use different credentials or try logging in with your existing account.",
          variant: "destructive",
        });
        
        // Switch to login tab and exit verification flow
        setActiveTab("login");
        setRegistrationState("form");
      } else {
        setAuthError(error?.message || "Registration failed. Please try again.");
        toast({
          title: "Registration failed",
          description: error?.message || "Please try again later",
          variant: "destructive",
        });
        
        // Go back to form on error
        setRegistrationState("form");
      }
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleVerificationMethodSelected = (
    method: "email" | "whatsapp" | "sms",
  ) => {
    setSelectedVerificationMethod(method);
    signupWithVerification(registeredUser, method);
  };

  const handleVerificationCompleted = async () => {
    // First notify the user of successful verification
    toast({
      title: "Account verified",
      description: "Your account has been verified successfully.",
    });

    try {
      // 1. First, fetch the current user to make sure we have the latest data
      const userResponse = await fetch("/api/user", {
        credentials: "include"
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("User verification completed, received user data:", userData);
        
        // 2. If we had registration data, refresh the session by logging in again
        if (registeredUser && registeredUser.username && registerForm.getValues().password) {
          try {
            // Re-login to refresh the session with the verified account
            await login({
              username: registeredUser.username,
              password: registerForm.getValues().password
            });
            
            console.log("Successfully refreshed login after verification");
          } catch (loginError) {
            console.error("Failed to refresh login after verification:", loginError);
          }
        }
        
        // 3. Try to create welcome notification
        try {
          await fetch("/api/notifications/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              title: "Welcome to Urgent Sales",
              message: "Check out personalized property recommendations based on your preferences",
              type: "system",
              linkTo: "/",
            }),
          });
        } catch (notifError) {
          console.error("Failed to create notification:", notifError);
          // Continue even if notification fails
        }
        
        // 4. Redirect to homepage with clean navigation (not direct location change)
        setTimeout(() => {
          navigate("/");
        }, 1500);
        return;
      } else {
        console.warn("User verification completed but couldn't fetch user data:", 
          await userResponse.text());
      }
    } catch (error) {
      console.error("Error in verification completion:", error);
    }

    // Fallback: Redirect to homepage even if the improved flow fails
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleVerificationCancelled = () => {
    setRegistrationState("form");
    setRegisteredUser(null);
  };
  
  // Handle forgot password request
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsForgotPasswordLoading(true);
      setAuthError(null);
      
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process request");
      }
      
      // Show success message
      setForgotPasswordSuccess(true);
      
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
    } catch (error) {
      console.error("Forgot password error:", error);
      setAuthError("Failed to process your request. Please try again.");
      
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };
  
  // Handle password reset with token
  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsResetPasswordLoading(true);
      setAuthError(null);
      
      // The token should come from URL param, but we're using the form for simplicity
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: data.resetToken,
          newPassword: data.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      
      // Close the dialog and clear form
      setShowForgotPasswordDialog(false);
      forgotPasswordForm.reset();
      resetPasswordForm.reset();
      setForgotPasswordSuccess(false);
      
    } catch (error) {
      console.error("Reset password error:", error);
      setAuthError("Failed to reset password. Please try again.");
      
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
              {registrationState === "verification-method" && registeredUser ? (
                <VerificationMethodSelector
                  email={registeredUser.email}
                  phone={registeredUser.phone}
                  onMethodSelected={handleVerificationMethodSelected}
                  onCancel={handleVerificationCancelled}
                />
              ) : registrationState === "verification" && registeredUser ? (
                <OTPVerification
                  userId={registeredUser.id}
                  email={registeredUser.email}
                  phone={registeredUser.phone}
                  type={selectedVerificationMethod}
                  onVerified={handleVerificationCompleted}
                  onCancel={handleVerificationCancelled}
                />
              ) : (
                <div className="w-full shadow-lg rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/90 to-primary text-white pb-10 pt-6 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-80 z-0"></div>
                    <div className="relative z-10">
                      <h1 className="text-2xl font-bold">
                        <span className="block md:inline">Welcome to </span>
                        <span className="block md:inline">Urgent Sales</span>
                      </h1>
                      <p className="text-white/80 mt-1">
                        Your one-stop destination for all your real estate needs
                      </p>
                    </div>
                    <div className="flex space-x-2 relative z-10 mt-4">
                      <Button
                        variant={activeTab === "login" ? "default" : "outline"}
                        onClick={() => setActiveTab("login")}
                        className={
                          activeTab === "login"
                            ? "bg-white text-primary"
                            : "bg-transparent text-white border-white/30 "
                        }
                      >
                        Login
                      </Button>
                      <Button
                        variant={
                          activeTab === "register" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("register")}
                        className={
                          activeTab === "register"
                            ? "bg-white text-primary"
                            : "bg-transparent text-white border-white/30 "
                        }
                      >
                        Register
                      </Button>
                    </div>
                  </div>

                  {activeTab === "login" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            Login to your account
                          </h2>
                          <p className="text-gray-500">
                            Enter your credentials to access your account
                          </p>
                        </div>
                        <form
                          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              {...loginForm.register("username")}
                              placeholder="Enter your username"
                            />
                            {loginForm.formState.errors.username && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showLoginPassword ? "text" : "password"}
                                {...loginForm.register("password")}
                                placeholder="Enter your password"
                                className="pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showLoginPassword ? "Hide password" : "Show password"}
                              >
                                {showLoginPassword ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                    <line x1="2" x2="22" y1="2" y2="22"></line>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                )}
                              </button>
                            </div>
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label
                                htmlFor="remember"
                                className="text-sm font-normal"
                              >
                                Remember me
                              </Label>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowForgotPasswordDialog(true)}
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </button>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 mt-4"
                            disabled={isLoginLoading}
                          >
                            {isLoginLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                              </>
                            ) : (
                              "Login"
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}

                  {activeTab === "register" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            Create an account
                          </h2>
                          <p className="text-gray-500">
                            Enter your details to create a new account
                          </p>
                        </div>
                        <form
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="reg-name">Full Name</Label>
                            <Input
                              id="reg-name"
                              {...registerForm.register("name")}
                              placeholder="Enter your full name"
                            />
                            {registerForm.formState.errors.name && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input
                              id="reg-email"
                              type="email"
                              {...registerForm.register("email")}
                              placeholder="Enter your email address"
                            />
                            {registerForm.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-phone">Phone Number</Label>
                            <Input
                              id="reg-phone"
                              {...registerForm.register("phone")}
                              placeholder="Enter your phone number"
                            />
                            {registerForm.formState.errors.phone && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          {/* Role selection field - NEW */}
                          <div className="space-y-2">
                            <Label htmlFor="reg-role">Account Type</Label>
                            <Select
                              onValueChange={(value) =>
                                registerForm.setValue("role", value)
                              }
                              defaultValue="user"
                            >
                              <SelectTrigger id="reg-role">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">
                                  Regular User
                                </SelectItem>
                                <SelectItem value="owner">
                                  Property Owner
                                </SelectItem>
                                <SelectItem value="agent">
                                  Real Estate Agent
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                              Select the type of account you want to create
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="reg-username">Username</Label>
                            <Input
                              id="reg-username"
                              {...registerForm.register("username")}
                              placeholder="Create a username"
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <div className="relative">
                              <Input
                                id="reg-password"
                                type={showPassword ? "text" : "password"}
                                {...registerForm.register("password")}
                                placeholder="Create a password"
                                className="pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                    <line x1="2" x2="22" y1="2" y2="22"></line>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                )}
                              </button>
                            </div>
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-confirm-password">
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="reg-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                {...registerForm.register("confirmPassword")}
                                placeholder="Confirm your password"
                                className="pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              >
                                {showConfirmPassword ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                    <line x1="2" x2="22" y1="2" y2="22"></line>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                )}
                              </button>
                            </div>
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-red-500">
                                {
                                  registerForm.formState.errors.confirmPassword
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            onClick={() => window.scrollTo(0, 0)}
                            className="w-full bg-primary hover:bg-primary/90 mt-6"
                            disabled={isRegisterLoading}
                          >
                            {isRegisterLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              "Register"
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 hidden md:block">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-4">
                  Welcome to Urgent Sales
                </h2>
                <p className="text-lg mb-6">
                India’s trusted real estate platform connecting buyers, sellers, and verified brokers for fast, transparent property deals.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-3">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-1">
                        Save Time
                      </h3>
                      <p className="text-blue-100">
                      Skip the delays — connect with verified buyers, sellers, and brokers faster on UrgentSales.in.

                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-3">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Rely on a Trusted Portal </h3>
                      <p className="text-blue-100">
                      Thousands choose UrgentSales.in for its transparency, reliability, and broker-supported property deals across India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Location-Based Properties
                      </h3>
                      <p className="text-blue-100">
                        Find properties near your preferred location
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {forgotPasswordSuccess && resetToken
                ? "Reset Your Password"
                : forgotPasswordSuccess
                ? "Check Your Email"
                : "Forgot Password"}
            </DialogTitle>
            <DialogDescription>
              {forgotPasswordSuccess && resetToken
                ? "Enter your new password below."
                : forgotPasswordSuccess
                ? "We've sent a password reset link to your email. Please check your inbox and spam folder."
                : "Enter your email address and we'll send you a link to reset your password."}
            </DialogDescription>
          </DialogHeader>
          
          {forgotPasswordSuccess && resetToken ? (
            // Reset password form (when token is available)
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-password">New Password</Label>
                <Input
                  id="reset-password"
                  type="password"
                  {...resetPasswordForm.register("password")}
                  placeholder="Enter your new password"
                />
                {resetPasswordForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {resetPasswordForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reset-confirmPassword">Confirm Password</Label>
                <Input
                  id="reset-confirmPassword"
                  type="password"
                  {...resetPasswordForm.register("confirmPassword")}
                  placeholder="Confirm your new password"
                />
                {resetPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {resetPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              
              <Input
                type="hidden"
                {...resetPasswordForm.register("resetToken")}
                value={resetToken || ""}
              />
              
              <DialogFooter className="sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForgotPasswordSuccess(false);
                    setResetToken(null);
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" disabled={isResetPasswordLoading}>
                  {isResetPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : forgotPasswordSuccess ? (
            // Success message (when email is sent)
            <div className="py-6 flex flex-col items-center justify-center">
              <Mail className="h-16 w-16 text-primary mb-4" />
              <p className="text-center mb-2 font-medium">
                Password Reset Email Sent
              </p>
              <p className="text-center mb-4 text-sm text-gray-600">
                If an account exists with this email, you'll receive a password reset link shortly.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm">
                <p className="mb-1 font-medium text-blue-700">Important instructions:</p>
                <ol className="list-decimal pl-5 text-blue-700">
                  <li>Check your email inbox at <span className="font-semibold">{forgotPasswordForm.getValues().email}</span></li>
                  <li>Look for an email from <span className="font-semibold">urgentsale.in@gmail.com</span></li>
                  <li>Click on the reset password link in the email</li>
                  <li>You'll be redirected back to set a new password</li>
                </ol>
              </div>
              <Button 
                onClick={() => setShowForgotPasswordDialog(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          ) : (
            // Initial forgot password form
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  {...forgotPasswordForm.register("email")}
                  placeholder="Enter your email address"
                />
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {forgotPasswordForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isForgotPasswordLoading}>
                  {isForgotPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
