import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight, Copy, Award } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

export default function SubmissionSuccess() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Parse the URL to get submission ID from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const submissionId = urlParams.get('id') || `URE${Math.floor(10000 + Math.random() * 90000)}`;
  const submissionType = urlParams.get('type') || 'property';

  // Simulate verification progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + 1, 30);
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Copy submission ID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-green-500 p-6 flex justify-center">
                <div className="bg-white rounded-full p-3">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>

              <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Submission Successful!
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {submissionType === 'project' ? 
                    'Your project details have been submitted for verification.' : 
                    'Your property listing has been submitted for verification and will be visible after admin approval.'}
                </p>

                {/* {submissionType !== 'project' && ( */}
                  {/* // <div className="bg-green-50 rounded-lg p-6 mb-8"> */}
                    {/* <div className="flex flex-col items-center">
                      <div className="text-green-600 font-bold text-4xl mb-2">
                        ₹55
                      </div>
                      <p className="text-green-700">Initial payment processed</p>
                    </div> */}
                  {/* // </div> */}
                {/* )} */}

                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Verification Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">
                    Our team is reviewing your submission. This process
                    typically takes 24-48 hours. Your {submissionType === 'project' ? 'project' : 'property'} will not be visible until approved.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold mb-4">Submission Details</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Submission ID:</span>
                    <div className="flex items-center">
                      <span className="font-mono mr-2">{submissionId}</span>
                      <button
                        onClick={copyToClipboard}
                        className="text-teal-500 hover:text-teal-600"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Submitted by:</span>
                    <span>{user?.name || "User"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* {submissionType !== 'project' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                      <Award className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="font-semibold text-blue-800 mb-1">
                          Additional ₹155 Reward
                        </h3>
                        <p className="text-sm text-blue-700">
                          After verification and posting of your property details
                          on our website, you'll receive an additional ₹155
                          reward.
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {submissionType === 'project' ? (
                    <Button
                      onClick={() => setLocation("/submit-project")}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Submit Another Project
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setLocation("/create-post")}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Submit Another Property
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  What's Next?
                </h2>

                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold mr-4">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Verification Process
                      </h3>
                      <p className="text-gray-600">
                        {submissionType === 'project' 
                          ? "Our team will verify the project details and images you've submitted. This typically takes 24-48 hours."
                          : "Our team will verify the property details and images you've submitted. This typically takes 24-48 hours."}
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold mr-4">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Publication
                      </h3>
                      <p className="text-gray-600">
                        {submissionType === 'project' 
                          ? "Once verified, your project will be published on our website, making it visible to potential investors and homebuyers."
                          : "Once verified, your property will be published on our website and app, making it visible to potential buyers and renters."}
                      </p>
                    </div>
                  </div>

                  {/* {submissionType === 'project' ? (
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold mr-4">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Get Featured
                        </h3>
                        <p className="text-gray-600">
                          After verification, your project could be selected to be featured
                          in our premium listings section.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold mr-4">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Additional Reward
                        </h3>
                        <p className="text-gray-600">
                          After publication, you'll receive the additional ₹155
                          reward in your account.
                        </p>
                      </div>
                    </div>
                  )} */}

                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold mr-4">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Track Inquiries
                      </h3>
                      <p className="text-gray-600">
                        {submissionType === 'project' 
                          ? "You can monitor interest and inquiries about your project submission from your dashboard."
                          : "You can track all inquiries and interactions with your property listing from your dashboard."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button
                    onClick={() => setLocation("/dashboard")}
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
