import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ReferralIcon, RupeesIcon, CheckCircleIcon, UsersIcon } from "../components/icons/custom-icons";

// Form schema
const referralFormSchema = z.object({
  referrerName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  referrerEmail: z.string().email({ message: "Please enter a valid email address" }),
  referrerPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  referredName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  referredEmail: z.string().email({ message: "Please enter a valid email address" }),
  referredPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  propertyInterest: z.string().optional(),
  budget: z.string().transform((val) => (val ? parseInt(val) : 0)).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type ReferralFormValues = z.infer<typeof referralFormSchema>;

export default function ClickAndEarnPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      referrerName: user ? user.name : "",
      referrerEmail: user ? user.email : "",
      referrerPhone: user ? (user.phone || "") : "",
      referredName: "",
      referredEmail: "",
      referredPhone: "",
      propertyInterest: "",
      budget: 0,
      location: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ReferralFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        referrerUserId: user?.id,
      };

      await apiRequest("/api/referrals", payload);

      setIsSuccess(true);
      toast({
        title: "Successfulluy Submitted",
        description: "Your post has been successfully submitted. Our team will contact your friend soon."
      });
      
      // Clear form
      form.reset();
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your post. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewReferrals = () => {
    if (user) {
      navigate(`/user/referrals`);
    } else {
      toast({
        title: "Login Required",
        description: "Please login to view your posts",
        variant: "default",
      });
      navigate("/auth");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Click & Earn  Program</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          post property with your friends and family to our platform and earn rewards for successful property deals!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center border-2 hover:border-primary hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <ReferralIcon className="w-8 h-8" />
            </div>
            <CardTitle>Refer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Share your property with friends looking for properties
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-2 hover:border-primary hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <CardTitle>Convert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We'll contact them and help with their property needs
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-2 hover:border-primary hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <RupeesIcon className="w-8 h-8" />
            </div>
            <CardTitle>Earn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Earn up to ₹10,000 for each successful property deal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Click and <Earn></Earn> Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="font-semibold mb-2">Property Sale</div>
            <div className="text-2xl font-bold text-primary mb-2">₹10,000</div>
            <div className="text-sm text-muted-foreground">Per successful transaction</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="font-semibold mb-2">Property Rental</div>
            <div className="text-2xl font-bold text-primary mb-2">₹5,000</div>
            <div className="text-sm text-muted-foreground">Per successful rental</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="font-semibold mb-2">Project Booking</div>
            <div className="text-2xl font-bold text-primary mb-2">₹15,000</div>
            <div className="text-sm text-muted-foreground">Per project apartment booking</div>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <Card className="max-w-2xl mx-auto border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Referral Submitted Successfully!</CardTitle>
            <CardDescription>
              Thank you for your referral. Our team will contact your friend soon.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => setIsSuccess(false)}>Submit Another Post</Button>
            <Button variant="outline" onClick={handleViewReferrals}>View Your Referrals</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Submit a Property</CardTitle>
                <CardDescription>
                  Fill out the form below to refer someone who is looking for a property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="referrerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="referrerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="referrerEmail"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Your Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Friend's Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="referredName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Friend's Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your friend's full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="referredPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Friend's Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Enter your friend's phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="referredEmail"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Friend's Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your friend's email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Property Details (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="propertyInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Interest</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="apartment">Apartment/Flat</SelectItem>
                                  <SelectItem value="house">House/Villa</SelectItem>
                                  <SelectItem value="plot">Plot/Land</SelectItem>
                                  <SelectItem value="commercial">Commercial Property</SelectItem>
                                  <SelectItem value="rental">Rental Property</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget (₹)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Enter budget amount" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter preferred location" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any specific requirements or additional information" 
                                  className="min-h-[100px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Referral"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium">Submit a referral</p>
                    <p className="text-sm text-muted-foreground">Fill out the form with your friend's details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium">We'll contact them</p>
                    <p className="text-sm text-muted-foreground">Our team will reach out to understand their needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium">Provide assistance</p>
                    <p className="text-sm text-muted-foreground">We'll help them find the perfect property</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium">You earn rewards</p>
                    <p className="text-sm text-muted-foreground">Get paid when your referral results in a successful deal</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Rewards are paid after successful property transaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Referral must be a new client to our platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Referral is valid for 6 months from submission date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Payment will be processed within 30 days of deal completion</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm font-medium">Need help with your referral?</p>
                  <p className="text-sm text-muted-foreground">Call us at <span className="font-medium text-primary">+91 9550425237</span></p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleViewReferrals} variant="outline" className="w-full">
                  {user ? "View Your Referrals" : "Login to View Referrals"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-12 mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How do I get paid?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Once your referral completes a property transaction, we'll contact you to confirm your payment details. 
                Payments are processed within 30 days of deal completion.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How many people can I refer?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                There is no limit to how many people you can refer. The more successful referrals you make, 
                the more rewards you can earn!
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How long is my referral valid?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your referral is valid for 6 months from the date of submission. If your referred friend 
                completes a transaction within this period, you'll earn the reward.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What if I have questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about your referral or the reward program, you can 
                contact our support team at <span className="text-primary">support@realestate.com</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}