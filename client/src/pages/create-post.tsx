import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Form validation schema
const formSchema = z.object({
  // Clicker Details
  clickerName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  clickerPhone: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Please enter a valid 10-digit Indian mobile number",
  }),

  // Owner Details
  ownerName: z.string().optional(),
  ownerLocation: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" }),
  ownerPhone: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Please enter a valid 10-digit Indian mobile number",
  }),
  ownerPincode: z
    .string()
    .regex(/^\d{6}$/, { message: "Please enter a valid 6-digit pincode" }),

  // Property Details
  propertyType: z.enum(["house", "apartment", "villa", "plot", "commercial"]),
  propertyTitle: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" }),
  propertyDescription: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  propertyPrice: z.string().min(1, { message: "Price is required" }),
  termsAccepted: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePost() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Image upload states
  const [boardImage, setBoardImage] = useState<File | null>(null);
  const [buildingImage, setBuildingImage] = useState<File | null>(null);
  const [surroundingMedia, setSurroundingMedia] = useState<File | null>(null);
  const [surroundingMediaPreview, setSurroundingMediaPreview] = useState<
    string | null
  >(null);
  const [surroundingMediaType, setSurroundingMediaType] = useState<
    "image" | "video" | null
  >(null);
  const [boardImagePreview, setBoardImagePreview] = useState<string | null>(
    null,
  );
  const [buildingImagePreview, setBuildingImagePreview] = useState<
    string | null
  >(null);

  // Refs for file inputs
  const boardImageRef = useRef<HTMLInputElement>(null);
  const buildingImageRef = useRef<HTMLInputElement>(null);
  const surroundingImageRef = useRef<HTMLInputElement>(null);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clickerName: user?.name || "",
      clickerPhone: "",
      ownerName: "",
      ownerLocation: "",
      ownerPhone: "",
      ownerPincode: "",
      propertyType: "house",
      propertyTitle: "",
      propertyDescription: "",
      propertyPrice: "",
      termsAccepted: false,
    },
  });

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>
                You need to be logged in to create a property listing.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate("/auth")}>
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle image upload
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setType?: React.Dispatch<React.SetStateAction<"image" | "video" | null>>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // Determine media type
      if (setType) {
        setType(file.type.startsWith("video") ? "video" : "image");
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = (
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    inputRef: React.RefObject<HTMLInputElement>,
    setType?: React.Dispatch<React.SetStateAction<"image" | "video" | null>>,
  ) => {
    setImage(null);
    setPreview(null);
    if (setType) {
      setType(null);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Send OTP function
  const sendOTP = async () => {
    const phoneNumber = form.getValues("clickerPhone");
    if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
      form.setError("clickerPhone", {
        type: "manual",
        message: "Please enter a valid 10-digit Indian mobile number",
      });
      return;
    }

    // Simulate OTP sending
    setUploadProgress(25);
    setTimeout(() => {
      setOtpSent(true);
      setUploadProgress(50);
    }, 1500);
  };

  // Verify OTP function
  const verifyOTP = () => {
    if (otp.length !== 6) {
      return;
    }

    // Simulate OTP verification
    setUploadProgress(75);
    setTimeout(() => {
      setOtpVerified(true);
      setUploadProgress(100);
    }, 1500);
  };

  // Form submission
  const onSubmit = async (data: FormValues) => {
    if (!otpVerified) {
      alert("Please verify your WhatsApp number first");
      return;
    }

    if (!boardImage || !buildingImage || !surroundingMedia) {
      alert("Please upload all required images/videos");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate form submission with progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      // Simulate API call
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setSubmissionStatus("success");

        // Navigate to success page after 2 seconds
        setTimeout(() => {
          navigate("/submission-success");
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("Error submitting property:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Create Property Listing
              </h1>
              <p className="text-gray-600 mt-2">
                Fill in the details below to earn ₹55 instantly and ₹155 after
                verification
              </p>
            </div>

            {submissionStatus === "success" ? (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-green-800">
                    Submission Successful!
                  </CardTitle>
                  <CardDescription className="text-center text-green-700">
                    Your property listing has been submitted for verification.
                    You will receive ₹55 in your account shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-green-700 mb-4">
                    After verification, you will receive an additional ₹155.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    onClick={() => navigate("/tools/click-and-earn")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Back to Click & Earn
                  </Button>
                </CardFooter>
              </Card>
            ) : submissionStatus === "error" ? (
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-red-800">
                    Submission Failed
                  </CardTitle>
                  <CardDescription className="text-center text-red-700">
                    There was an error submitting your property listing. Please
                    try again.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <Button
                    onClick={() => setSubmissionStatus("idle")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Section 1: Clicker Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Details</CardTitle>
                      <CardDescription>
                        Enter your contact information for verification and
                        payment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="clickerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clickerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your WhatsApp Number*</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input
                                  placeholder="10-digit mobile number"
                                  {...field}
                                  disabled={otpVerified}
                                />
                              </FormControl>
                              {!otpSent ? (
                                <Button
                                  type="button"
                                  onClick={sendOTP}
                                  disabled={
                                    !form.getValues("clickerPhone") ||
                                    otpVerified
                                  }
                                >
                                  Send OTP
                                </Button>
                              ) : !otpVerified ? (
                                <div className="flex space-x-2">
                                  <Input
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-24"
                                  />
                                  <Button
                                    type="button"
                                    onClick={verifyOTP}
                                    disabled={otp.length !== 6}
                                  >
                                    Verify
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="text-green-600 border-green-600"
                                  disabled
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verified
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                            <p className="text-xs text-gray-500 mt-1">
                              This number will be used for WhatsApp
                              verification, PhonePe/UPI transactions, and
                              contact purposes.
                            </p>
                          </FormItem>
                        )}
                      />

                      {otpSent && !otpVerified && (
                        <div className="mt-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            Verifying your number...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Section 2: Owner Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Owner Details</CardTitle>
                      <CardDescription>
                        Enter information about the property owner
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter property owner's name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ownerLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Location*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter property location"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ownerPincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="6-digit pincode"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="ownerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Contact Number*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10-digit mobile number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Property Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Details</CardTitle>
                      <CardDescription>
                        Enter information about the property
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type*</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="plot">Plot/Land</option>
                                <option value="commercial">Commercial</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="propertyTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Title*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a descriptive title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="propertyDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Description*</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the property in detail"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="propertyPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Price*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter expected price"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Section 3: Images */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Images</CardTitle>
                      <CardDescription>
                        Upload clear images of the property (required)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Board Image */}
                        <div className="space-y-2">
                          <FormLabel>Sale Board Image*</FormLabel>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {boardImagePreview ? (
                              <div className="relative">
                                <img
                                  src={boardImagePreview}
                                  alt="Board preview"
                                  className="mx-auto h-40 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImage(
                                      setBoardImage,
                                      setBoardImagePreview,
                                      boardImageRef,
                                    )
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex flex-col items-center justify-center h-40 cursor-pointer"
                                onClick={() => boardImageRef.current?.click()}
                              >
                                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Click to upload board image
                                </p>
                              </div>
                            )}
                            <input
                              type="file"
                              ref={boardImageRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  e,
                                  setBoardImage,
                                  setBoardImagePreview,
                                )
                              }
                            />
                          </div>
                        </div>

                        {/* Building Image */}
                        <div className="space-y-2">
                          <FormLabel>Building/Property Image*</FormLabel>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {buildingImagePreview ? (
                              <div className="relative">
                                <img
                                  src={buildingImagePreview}
                                  alt="Building preview"
                                  className="mx-auto h-40 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImage(
                                      setBuildingImage,
                                      setBuildingImagePreview,
                                      buildingImageRef,
                                    )
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex flex-col items-center justify-center h-40 cursor-pointer"
                                onClick={() =>
                                  buildingImageRef.current?.click()
                                }
                              >
                                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Click to upload building image
                                </p>
                              </div>
                            )}
                            <input
                              type="file"
                              ref={buildingImageRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  e,
                                  setBuildingImage,
                                  setBuildingImagePreview,
                                )
                              }
                            />
                          </div>
                        </div>

                        {/* Surrounding Image/Video */}
                        <div className="space-y-2">
                          <FormLabel>Surrounding Area Image/Video*</FormLabel>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {surroundingMediaPreview ? (
                              <div className="relative">
                                {surroundingMediaType === "video" ? (
                                  <video
                                    src={surroundingMediaPreview}
                                    className="mx-auto h-40 object-cover rounded-md"
                                    controls
                                  />
                                ) : (
                                  <img
                                    src={surroundingMediaPreview}
                                    alt="Surrounding area preview"
                                    className="mx-auto h-40 object-cover rounded-md"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImage(
                                      setSurroundingMedia,
                                      setSurroundingMediaPreview,
                                      surroundingImageRef,
                                      setSurroundingMediaType,
                                    )
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex flex-col items-center justify-center h-40 cursor-pointer"
                                onClick={() =>
                                  surroundingImageRef.current?.click()
                                }
                              >
                                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Click to upload surrounding area image/video
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Supports JPG, PNG, MP4, MOV
                                </p>
                              </div>
                            )}
                            <input
                              type="file"
                              ref={surroundingImageRef}
                              className="hidden"
                              accept="image/*,video/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  e,
                                  setSurroundingMedia,
                                  setSurroundingMediaPreview,
                                  setSurroundingMediaType,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Terms & Conditions */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Terms & Conditions</CardTitle>
                      <CardDescription>
                        Please review and accept our terms before submitting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="h-4 w-4 mt-1"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I accept the{" "}
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-teal-600 underline"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowTermsModal(true);
                                  }}
                                >
                                  Terms and Conditions
                                </Button>
                              </FormLabel>
                              <FormMessage />
                              <p className="text-xs text-gray-500">
                                By submitting this form, you agree to our terms
                                of service, privacy policy, and the Click & Earn
                                program rules.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="w-full max-w-md bg-teal-600 hover:bg-teal-700"
                      disabled={
                        isSubmitting ||
                        !otpVerified ||
                        !form.getValues("termsAccepted")
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Property Listing"
                      )}
                    </Button>
                  </div>

                  {!form.getValues("termsAccepted") && otpVerified && (
                    <p className="text-center text-amber-600 text-sm mt-2">
                      Please accept the terms and conditions to enable
                      submission
                    </p>
                  )}

                  {isSubmitting && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Uploading your property listing...
                      </p>
                    </div>
                  )}
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none">
                <h3>Click & Earn Program Terms</h3>

                <p>
                  <strong>1. Program Overview</strong>
                </p>
                <p>
                  The Click & Earn program allows users to earn rewards by
                  submitting valid property listings. Users can earn ₹55 for
                  each approved submission and an additional ₹155 after
                  verification and posting of the property details on our
                  platform.
                </p>

                <p>
                  <strong>2. Eligibility</strong>
                </p>
                <ul>
                  <li>You must be at least 18 years old to participate.</li>
                  <li>
                    You must have a valid WhatsApp number for verification.
                  </li>
                  <li>You must have a valid UPI ID for receiving payments.</li>
                </ul>

                <p>
                  <strong>3. Submission Requirements</strong>
                </p>
                <ul>
                  <li>All property details must be accurate and complete.</li>
                  <li>
                    You must upload clear images of the property as specified.
                  </li>
                  <li>The property must have a visible "For Sale" board.</li>
                  <li>
                    You must have permission from the property owner to list the
                    property.
                  </li>
                  <li>Duplicate submissions will be rejected.</li>
                </ul>

                <p>
                  <strong>4. Verification Process</strong>
                </p>
                <ul>
                  <li>
                    All submissions undergo a verification process that
                    typically takes 24-48 hours.
                  </li>
                  <li>
                    Our team may contact you or the property owner for
                    additional information.
                  </li>
                  <li>
                    We reserve the right to reject submissions that don't meet
                    our quality standards.
                  </li>
                </ul>

                <p>
                  <strong>5. Payment Terms</strong>
                </p>
                <ul>
                  <li>
                    Initial payment of ₹55 will be processed after successful
                    submission.
                  </li>
                  <li>
                    Additional payment of ₹155 will be processed after
                    verification and posting.
                  </li>
                  <li>
                    Payments will be made to the UPI ID associated with your
                    account.
                  </li>
                  <li>Payment processing may take up to 7 business days.</li>
                </ul>

                <p>
                  <strong>6. User Responsibilities</strong>
                </p>
                <ul>
                  <li>
                    You are responsible for obtaining consent from property
                    owners before submission.
                  </li>
                  <li>You must not submit false or misleading information.</li>
                  <li>You must not infringe on any third-party rights.</li>
                  <li>
                    You must comply with all applicable laws and regulations.
                  </li>
                </ul>

                <p>
                  <strong>7. Program Modifications</strong>
                </p>
                <p>
                  We reserve the right to modify, suspend, or terminate the
                  Click & Earn program at any time without prior notice. Any
                  changes will be effective immediately upon posting on our
                  website.
                </p>

                <p>
                  <strong>8. Limitation of Liability</strong>
                </p>
                <p>
                  We are not liable for any direct, indirect, incidental,
                  special, or consequential damages arising out of or in any way
                  connected with your participation in the Click & Earn program.
                </p>

                <p>
                  <strong>9. Privacy Policy</strong>
                </p>
                <p>
                  All personal information collected through the Click & Earn
                  program is subject to our Privacy Policy. By participating in
                  the program, you consent to the collection, use, and
                  disclosure of your personal information as described in our
                  Privacy Policy.
                </p>

                <p>
                  <strong>10. Governing Law</strong>
                </p>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws of India. Any disputes arising under
                  these terms shall be subject to the exclusive jurisdiction of
                  the courts in India.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    form.setValue("termsAccepted", true);
                    setShowTermsModal(false);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 mr-2"
                >
                  Accept Terms
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTermsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
