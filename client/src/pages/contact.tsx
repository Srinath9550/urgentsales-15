import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Building,
  CheckCircle2,
  Sparkles,
  Smartphone,
} from "lucide-react";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      // Send the form data to the server
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();

      // Show success message
      toast({
        title: "Message Sent Successfully",
        description: `Thank you for contacting us!  We'll respond to ${data.email} shortly.`,
        variant: "default",
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600">
                We're here to help you with any questions about properties,
                listing process, or our services. Reach out to our team and
                we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mr-4 shadow-inner">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Address</h3>
                </div>
                <div className="space-y-3 pl-2">
                  <p className="text-gray-600 mb-2">
                    #301, Madhavaram Towers,
                  </p>
                  <p className="text-gray-600 mb-2">
                    Kukatpally Y Junction, Moosapet,
                  </p>
                  <p className="text-gray-600 mb-2">
                    Hyderabad, Telangana
                  </p>
                  <p className="text-gray-600 mb-2">
                    India - 500018
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Emails</h3>
                </div>
                <p className="text-gray-600 mb-2">General Inquiries:</p>
                <p className="text-primary font-medium mb-3">
                  <a href="mailto:info@UrgentSales.in" className="hover:underline">
                    info@UrgentSales.in
                  </a>
                </p>
                <p className="text-gray-600 mb-2">Support:</p>
                <p className="text-primary font-medium mb-3">
                <a href="support@UrgentSales.in" className="hover:underline">
                  support@UrgentSales.in
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Connect</h3>
                </div>
                <p className="text-gray-600 mb-2">Customer Support:</p>
                <p className="text-primary font-medium mb-3">
                  <a 
                    href="tel:+919032561155"
                    className="hover:underline"
                  >
                    +91 9032561155
                  </a>
                </p>
                <p className="text-gray-600 mb-2">What'sapp Assistance:</p>
                <p className="text-primary font-medium">
                  <a 
                    href="https://wa.me/919032381155"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 9032381155
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Sales Contact Information */}
        <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Clock className="h-4 w-4" />
                <span>Priority Support</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Urgency Sales Contact</h2>
              <p className="text-gray-600 max-w-1xl mx-auto">
                Need to sell your property quickly? Our Urgency Sales team is  here to help you list and sell your property
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Badge className="bg-red-600 text-white mr-3">
                      <Sparkles className="h-3 w-3 mr-1" />
                    </Badge>
                    <h3 className="text-xl font-semibold">
                      Dedicated Urgency Sales Support
                    </h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Urgency Sales Hotline</p>
                        <p className="text-gray-600">
                          <a href="tel:+919032561155" className="hover:underline">
                            +91 9032561155
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Urgent Inquiries</p>
                        <p className="text-gray-600">
                          <a href="mailto:info@UrgentSales.in" className="hover:underline">
                            info@UrgentSales.in
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-3 mt-0.5" viewBox="0 0 448 512" fill="currentColor">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                      <div>
                        <p className="font-medium">WhatsApp Support</p>
                        <a 
                          href="https://wa.me/919032381155"
                          className="text-gray-600 hover:text-red-600 transition-colors"
                        >
                          +91 9032381155
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold mb-3">
                      Urgency Sales Benefits:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <span>
                          Priority listing verification (24 hour turnaround)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <span>Featured placement in Urgency Sales section</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <span>
                          Dedicated sales representative for your property
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-100 p-8">
                  <img
                    src="https://media.istockphoto.com/vectors/urgent-rubber-stamp-ink-imprint-icon-vector-id476438610?k=6&m=476438610&s=612x612&w=0&h=_XN-fjgNgSsTfIyDwqlPcjSi-qlLq8Vhg2QdrhBKUC0="
                    alt="Urgency Sales Team"
                    className="rounded-lg shadow-md mb-6 w-full h-48 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-4">
                    Schedule an Urgency Consultation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our Urgency Sales specialists will guide you through the
                    entire process of listing, marketing, and selling your
                    property within your desired timeframe.
                  </p>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => (window.location.href = "tel:+919032561155")}
                  >
                    Call Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Have a question or need assistance? Fill out the form below
                  and our team will get back to you as soon as possible.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Full Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                required
                                {...field}
                              />
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
                            <FormLabel>
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Example@gmail.com"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+91 1234567894"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Subject <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Property Inquiry"
                                required
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
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Message <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help you..."
                              className="min-h-32 resize-none"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-primary text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">Business Hours</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Monday - Saturday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sunday</span>
                      <span>Closed</span>
                    </div>
                    <div className="border-t border-gray-200"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Urgency Sales Support</span>
                      <span className="text-red-600">
                        9:00 AM - 9:00 PM (Daily)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">Download Our App</h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Get instant property alerts, chat with agents, and browse
                    listings on the go with our mobile app.
                  </p>

                  <div className="flex space-x-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                      alt="Get it on Google Play"
                      className="h-10"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                      alt="Download on App Store"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
