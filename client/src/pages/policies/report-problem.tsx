import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import FileUpload, { FileWithPreview } from "@/components/upload/file-upload";

const reportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  problemType: z.enum(["website", "property", "payment", "account", "other"]),
  propertyId: z.string().optional(),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  stepsToReproduce: z.string().optional(),
  deviceInfo: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportProblem() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: "",
      email: "",
      problemType: "website",
      propertyId: "",
      urgency: "medium",
      description: "",
      stepsToReproduce: "",
      deviceInfo: `${navigator.userAgent}`,
    },
  });

  const watchProblemType = form.watch("problemType");

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert the form data to the format expected by the API
      const formattedData = {
        name: data.name,
        email: data.email,
        category: data.problemType,
        severity: data.urgency,
        url: window.location.href,
        description:
          data.description +
          (data.stepsToReproduce
            ? "\n\nSteps to reproduce:\n" + data.stepsToReproduce
            : "") +
          (data.deviceInfo ? "\n\nDevice info:\n" + data.deviceInfo : ""),
      };

      // Send the data to the server
      const response = await fetch("/api/report-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      setIsSuccess(true);

      toast({
        title: "Problem reported successfully",
        description:
          "Thank you for reporting this issue. Our team will investigate and respond as soon as possible.",
      });

      // Reset form after 3 seconds of showing success message
      setTimeout(() => {
        form.reset();
        setFiles([]);
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error reporting problem:", error);
      toast({
        title: "Error reporting problem",
        description:
          "There was an error submitting your report. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesSelected = (selectedFiles: FileWithPreview[]) => {
    setFiles(selectedFiles);
  };

  const handleFileRemoved = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500">
            <button
              onClick={() => window.history.back()}
              className="hover:text-primary focus:outline-none"
            >
              ← Back
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Report a Problem
              </h1>
              <p className="text-gray-600">
                Encountered an issue with our platform? Please help us by
                reporting it in detail using the form below.
              </p>
            </div>
          </div>

          {isSuccess ? (
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Thank You for Your Report
              </h2>
              <p className="text-gray-600 mb-4">
                We've received your problem report and our technical team will
                investigate the issue. You'll receive a confirmation email at{" "}
                {form.getValues().email} shortly with details.
              </p>
              <p className="text-gray-700 font-medium mb-2">
                Reference #:{" "}
                {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
              <p className="text-gray-600 text-sm">
                A copy of your report has been sent to urgentsale.in@gmail.com
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your email address"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="problemType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select problem type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="website">
                              Website Issue
                            </SelectItem>
                            <SelectItem value="property">
                              Property Listing Issue
                            </SelectItem>
                            <SelectItem value="payment">
                              Payment Issue
                            </SelectItem>
                            <SelectItem value="account">
                              Account Issue
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select urgency level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              Low - Minor inconvenience
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium - Affects functionality
                            </SelectItem>
                            <SelectItem value="high">
                              High - Prevents core tasks
                            </SelectItem>
                            <SelectItem value="critical">
                              Critical - Security issue
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(watchProblemType === "property" ||
                  watchProblemType === "payment") && (
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {watchProblemType === "property"
                            ? "Property ID"
                            : "Transaction/Order ID"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              watchProblemType === "property"
                                ? "Enter property listing ID (if applicable)"
                                : "Enter transaction or order ID"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {watchProblemType === "property"
                            ? "You can find the property ID in the URL when viewing a property"
                            : "You can find this ID in your email receipt or transaction history"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe the issue in detail..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please include what you were trying to do when the
                        problem occurred
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stepsToReproduce"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Steps to Reproduce (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the steps someone could follow to encounter this issue..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Screenshots/Attachments (Optional)
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Upload screenshots or files that help illustrate the problem
                    (Max 5 files, 5MB each)
                  </p>
                  <FileUpload
                    onFilesSelected={handleFilesSelected}
                    onFileRemoved={handleFileRemoved}
                    initialFiles={files}
                    maxFiles={5}
                    allowMultiple={true}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="deviceInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        This helps our technical team reproduce and fix the
                        issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting Report..."
                    : "Submit Problem Report"}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Need Immediate Help?
            </h3>
            <p className="text-gray-600 mb-4">
              For urgent issues that require immediate attention, please contact
              our support team directly:
            </p>
            <div className="flex flex-col space-y-2">
              <p className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Email:</span>{" "}
                support@UrgentSales.in
              </p>
              <p className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Phone:</span> +91 9032561155
              </p>
              <p className="flex items-center text-gray-700">
                <span className="font-medium mr-2">WhatsApp:</span> +91
                9032381155
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
