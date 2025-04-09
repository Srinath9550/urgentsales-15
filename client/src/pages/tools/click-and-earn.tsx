import { useState } from "react";
import {
  Gift,
  Award,
  TrendingUp,
  Users,
  Share2,
  CheckCircle,
  Camera,
  Clipboard,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

// Remove the problematic import
// import { toast } from "@/components/ui/use-toast";

export default function ClickAndEarn() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showLoginPrompt, setShowLoginPrompt] = useState(!user);
  const [activeTab, setActiveTab] = useState("how-it-works");
  // Add a state for notifications
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    title: string;
  }>({
    show: false,
    message: "",
    title: "",
  });

  // Function to show notifications
  const showNotification = (title: string, message: string) => {
    setNotification({
      show: true,
      title,
      message,
    });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Handle activity clicks
  const handleActivityClick = (activity: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      // Replace toast with our custom notification
      showNotification("Login Required", "You need to login to earn rewards");
    } else {
      console.log(`User clicked on activity: ${activity}`);

      if (activity === "Create Post") {
        // Add a console log to debug
        console.log("Navigating to click-and-earn form page");
        // Make sure the path is correct and matches your routing configuration
        navigate("/click-and-earn");
      } else if (activity === "Update Profile") {
        navigate("/profile");
      } else if (activity === "Browse Properties") {
        navigate("/properties");
      } else {
        // Replace toast with our custom notification
        showNotification("Action Initiated", `You've started: ${activity}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-white">
        {/* Add notification component */}
        {notification.show && (
          <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 animate-fade-in">
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h3>
                <div className="mt-1 text-sm text-gray-500">
                  <p>{notification.message}</p>
                </div>
              </div>
              <button
                type="button"
                className="ml-auto bg-white rounded-md text-gray-400 hover:text-gray-500"
                onClick={() =>
                  setNotification((prev) => ({ ...prev, show: false }))
                }
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Click & Earn - Get ₹215
                </h1>
                <p className="text-xl mb-8 text-teal-50">
                  Earn money by creating property listings and generating sales
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-white text-teal-600 hover:bg-teal-50"
                    size="lg"
                    onClick={() => navigate("/create-post")}
                  >
                    Start Earning Now
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Main image */}
                  <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-3">
                    <div className="bg-gray-100 rounded-md p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-teal-500 mb-2">
                          ₹215
                        </div>
                        <div className="text-gray-600">Total Earnings</div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -left-6 bg-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow transform -rotate-6 text-sm font-bold">
                    ₹55 per post
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-green-400 text-green-800 px-4 py-2 rounded-lg shadow transform rotate-6 text-sm font-bold">
                    ₹160 after verification
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {showLoginPrompt && !user && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 max-w-4xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-yellow-700 underline"
                      onClick={() => navigate("/auth")}
                    >
                      login
                    </Button>{" "}
                    or{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-yellow-700 underline"
                      onClick={() => navigate("/auth?tab=register")}
                    >
                      register
                    </Button>{" "}
                    to start earning rewards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex border-b border-gray-200 mb-8">
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === "how-it-works" ? "text-teal-600 border-b-2 border-teal-500" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("how-it-works")}
              >
                How It Works
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === "earnings" ? "text-teal-600 border-b-2 border-teal-500" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("earnings")}
              >
                Earnings Breakdown
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === "faq" ? "text-teal-600 border-b-2 border-teal-500" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("faq")}
              >
                FAQ
              </button>
            </div>

            {/* How It Works Tab */}
            {activeTab === "how-it-works" && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  How to Earn with Us
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* Step 1 */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden flex">
                    <div className="bg-teal-500 p-6 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">
                        Create Property Listings
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Post details of properties for sale or rent and earn ₹55
                        for each approved listing.
                      </p>
                      <Button
                        variant="outline"
                        className="text-teal-600 border-teal-600 hover:bg-teal-50"
                        onClick={() => navigate("/create-post")}
                      >
                        Create Listing
                      </Button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden flex">
                    <div className="bg-teal-500 p-6 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">
                        Property Verification
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Earn an additional ₹160 after your property details are
                        verified and posted on our website.
                      </p>
                      <Button
                        variant="outline"
                        className="text-teal-600 border-teal-600 hover:bg-teal-50"
                        onClick={() => navigate("/properties")}
                      >
                        Browse Properties
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Process Flow */}
                <div className="bg-gray-50 rounded-xl p-8 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    The Process
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Camera className="h-8 w-8 text-teal-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Upload Details</h4>
                      <p className="text-gray-600 text-sm">
                        Add property information, photos, and contact details
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <CheckCircle className="h-8 w-8 text-teal-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Verification</h4>
                      <p className="text-gray-600 text-sm">
                        Our team verifies the listing information
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Award className="h-8 w-8 text-teal-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Get Paid</h4>
                      <p className="text-gray-600 text-sm">
                        Receive payment for approved listings and successful
                        sales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Earnings Breakdown Tab */}
            {activeTab === "earnings" && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Earnings Breakdown
                </h2>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-6 text-center">
                      How You Earn ₹215
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-teal-50 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-teal-100 p-3 rounded-full mr-4">
                            <Camera className="h-6 w-6 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">₹55</h4>
                            <p className="text-gray-600">
                              Per Approved Listing
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Complete property details</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Clear photos (min. 4 photos)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Accurate location information</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-green-100 p-3 rounded-full mr-4">
                            <Award className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">₹160</h4>
                            <p className="text-gray-600">
                              After Verification & Posting
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>When your property details are verified</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              After your listing is published on our website
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>
                              Additional rewards for premium property listings
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-6">Payment Terms</h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Payment Timeline</h4>
                          <p className="text-gray-600 text-sm">
                            Listing payments are processed within 7 days of
                            approval. Sale/rental commissions are paid within 15
                            days of transaction completion.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <ExternalLink className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Payment Methods</h4>
                          <p className="text-gray-600 text-sm">
                            Direct bank transfer, UPI, or wallet credits.
                            Minimum payout amount is ₹100.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clipboard className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Documentation</h4>
                          <p className="text-gray-600 text-sm">
                            You'll need to provide PAN details for payments
                            exceeding ₹5,000 in a financial year.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-2 rounded-full mr-4 flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Important Note</h4>
                      <p className="text-sm text-gray-600">
                        All listings are subject to verification. Fraudulent or
                        duplicate listings will be rejected and may result in
                        account suspension. Quality is our priority!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                      <span className="font-medium text-gray-900">
                        How soon will I get paid after posting a property?
                      </span>
                      <svg
                        className="h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">
                        After your property listing is approved (typically
                        within 24-48 hours), payment will be processed within 7
                        working days to your registered account.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                      <span className="font-medium text-gray-900">
                        What type of properties can I list?
                      </span>
                      <svg
                        className="h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">
                        You can list residential properties (apartments, houses,
                        villas), commercial properties (offices, shops,
                        warehouses), and land/plots for sale or rent.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                      <span className="font-medium text-gray-900">
                        How do I know if my listing led to a sale?
                      </span>
                      <svg
                        className="h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">
                        Our system tracks all inquiries and transactions through
                        the platform. When a buyer/renter completes a
                        transaction that originated from your listing, you'll be
                        notified and credited automatically.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                      <span className="font-medium text-gray-900">
                        Is there a limit to how many properties I can list?
                      </span>
                      <svg
                        className="h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">
                        No, there's no limit to the number of properties you can
                        list. However, each listing must be unique and meet our
                        quality standards to be approved and eligible for
                        payment.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button className="flex justify-between items-center w-full px-6 py-4 text-left">
                      <span className="font-medium text-gray-900">
                        What happens if my listing is rejected?
                      </span>
                      <svg
                        className="h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">
                        If your listing is rejected, you'll receive feedback
                        explaining why. You can make the necessary improvements
                        and resubmit the listing for review.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-lg mb-4">
                    Still have questions?
                  </h3>
                  <Button
                    onClick={() => navigate("/contact")}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-teal-50 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already earning money by listing
                properties on our platform.
              </p>
              <Button
                className="bg-white text-teal-600 hover:bg-teal-50"
                size="lg"
                onClick={() => navigate("/create-post")}
              >
                Create Your First Listing
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}