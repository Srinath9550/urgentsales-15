import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, User, Shield, Zap, Award } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface BuyerPlanFeature {
  sellerContacts: number;
  verifiedListings: boolean;
  prioritySupport: boolean;
  homeLoanAssistance: boolean;
  personalizedSuggestions: boolean;
  relationshipManager: boolean;
  premiumListings: boolean;
  propertyAlerts: boolean;
  virtualTour: boolean;
  legalAssistance: boolean;
  unlimitedCompanyContacts: boolean;
}

interface BuyerPlan {
  id: string;
  name: string;
  originalPrice: string;
  price: string;
  numericPrice: number;
  discount?: string;
  gst: string;
  icon: React.ReactNode;
  features: BuyerPlanFeature;
  color: string;
  buttonColor: string;
  isFree?: boolean;
  isBestValue?: boolean;
}

const BuyerPricingPlans = () => {
  const plans: BuyerPlan[] = [
    {
      id: "free",
      name: "Free Package",
      originalPrice: "Free",
      price: "Free",
      numericPrice: 0,
      gst: "",
      icon: <span className="text-3xl">🆓</span>,
      features: {
        sellerContacts: 5,
        verifiedListings: true,
        prioritySupport: false,
        homeLoanAssistance: false,
        personalizedSuggestions: true,
        relationshipManager: false,
        premiumListings: false,
        propertyAlerts: true,
        virtualTour: false,
        legalAssistance: true,
        unlimitedCompanyContacts: false
      },
      color: "blue",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      isFree: true,
    },
    {
      id: "standard",
      name: "Standard Plan",
      originalPrice: "₹2,499",
      price: "₹1,999",
      numericPrice: 1999,
      discount: "20% OFF",
      gst: "+ 18% GST",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      features: {
        sellerContacts: 25,
        verifiedListings: true,
        prioritySupport: true,
        homeLoanAssistance: true,
        personalizedSuggestions: true,
        relationshipManager: false,
        premiumListings: false,
        propertyAlerts: true,
        virtualTour: true,
        legalAssistance: true,
        unlimitedCompanyContacts: false
      },
      color: "green",
      buttonColor: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      id: "premium",
      name: "Premium Plan",
      originalPrice: "₹3,499",
      price: "₹2,999",
      numericPrice: 2999,
      discount: "14% OFF",
      gst: "+ 18% GST",
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      features: {
        sellerContacts: 50,
        verifiedListings: true,
        prioritySupport: true,
        homeLoanAssistance: true,
        personalizedSuggestions: true,
        relationshipManager: true,
        premiumListings: true,
        propertyAlerts: true,
        virtualTour: true,
        legalAssistance: true,
        unlimitedCompanyContacts: false
      },
      color: "purple",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
      isBestValue: true,
    },
    {
      id: "super",
      name: "Super Money Back Plan",
      originalPrice: "₹3,499",
      price: "₹2,999",
      numericPrice: 2999,
      discount: "14% OFF",
      gst: "+ 18% GST",
      icon: <Award className="h-8 w-8 text-amber-600" />,
      features: {
        sellerContacts: 50,
        verifiedListings: true,
        prioritySupport: true,
        homeLoanAssistance: true,
        personalizedSuggestions: true,
        relationshipManager: true,
        premiumListings: true,
        propertyAlerts: true,
        virtualTour: true,
        legalAssistance: true,
        unlimitedCompanyContacts: true
      },
      color: "amber",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
  ];

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      amber: "bg-amber-50 border-amber-200 text-amber-600",
    };
    return colorMap[color] || "bg-gray-50 border-gray-200 text-gray-600";
  };

  const handleSubscribe = (plan: BuyerPlan) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${plan.name} plan`);
    // You can add payment gateway integration or redirect to checkout page
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Buyer Plans & Pricing{" "}
              <span className="text-gray-500 text-sm">(With 18% GST Included)</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Choose the right plan to enhance your property search experience and connect with sellers.
            </p>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg overflow-hidden shadow-sm ${
                  plan.isBestValue ? "border-purple-400 ring-2 ring-purple-200" : ""
                }`}
              >
                <div className={`p-4 ${getColorClass(plan.color)}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2">{plan.icon}</span>
                      <h3 className="font-bold">{plan.name}</h3>
                    </div>
                    {plan.discount && (
                      <Badge className="bg-red-500">{plan.discount}</Badge>
                    )}
                    {plan.isBestValue && (
                      <Badge className="bg-purple-500 ml-1">Best Value</Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    {plan.originalPrice !== plan.price && (
                      <span className="text-gray-500 line-through text-sm mr-2">{plan.originalPrice}</span>
                    )}
                    <span className="text-xl font-bold">{plan.price}</span>
                    {plan.gst && <span className="text-sm ml-1">{plan.gst}</span>}
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Number of Seller Contacts</span>
                      <span className="font-medium">{plan.features.sellerContacts}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.verifiedListings ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Access to Verified Listings</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.prioritySupport ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Priority Customer Support</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.homeLoanAssistance ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Free Home Loan Assistance</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.personalizedSuggestions ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Personalized Property Suggestions</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.relationshipManager ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Dedicated Relationship Manager</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.premiumListings ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Access to Premium Listings</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.propertyAlerts ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Property Alerts & Notifications</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.virtualTour ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Virtual Tour of Properties</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.legalAssistance ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Legal & Documentation Assistance</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.unlimitedCompanyContacts ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Unlimited contacts for Companies and projects</span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full mt-6 ${plan.buttonColor}`}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.isFree ? "Free Subscribe" : "Subscribe Now"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-50 text-left font-semibold">Feature</th>
                  {plans.map((plan) => (
                    <th 
                      key={plan.id} 
                      className={`border p-3 text-center ${
                        plan.isBestValue 
                          ? "bg-purple-50 border-purple-300" 
                          : getColorClass(plan.color)
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-1">{plan.icon}</div>
                        <span className="font-bold">{plan.name}</span>
                        {plan.discount && (
                          <Badge className="bg-red-500 text-white my-1">{plan.discount}</Badge>
                        )}
                        <div className="mt-1">
                          {plan.originalPrice !== plan.price && (
                            <span className="text-gray-500 line-through text-sm block">{plan.originalPrice}</span>
                          )}
                          <span className="font-bold">{plan.price}</span>
                          {plan.gst && <p className="text-xs text-gray-600">{plan.gst}</p>}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Number of Seller Contacts</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.sellerContacts}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Access to Verified Listings</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.verifiedListings ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Priority Customer Support</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.prioritySupport ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Free Home Loan Assistance</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.homeLoanAssistance ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Personalized Property Suggestions</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.personalizedSuggestions ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Dedicated Relationship Manager</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.relationshipManager ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Access to Premium Listings</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.premiumListings ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Property Alerts & Notifications</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.propertyAlerts ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Virtual Tour of Properties</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.virtualTour ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Legal & Documentation Assistance</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.legalAssistance ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Unlimited contacts for Companies and projects</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.unlimitedCompanyContacts ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Subscribe</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      <Button 
                        className={`w-full ${plan.buttonColor}`}
                        onClick={() => handleSubscribe(plan)}
                      >
                        {plan.isFree ? "Free Subscribe" : "Subscribe Now"}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16 bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">What is the difference between Premium and Super Money Back plans?</h3>
                <p className="text-gray-600 mt-1">
                  The Super Money Back Plan includes all Premium features plus unlimited contacts for Companies and projects, giving you complete access to all developer projects.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">How do I upgrade my buyer plan?</h3>
                <p className="text-gray-600 mt-1">
                  You can upgrade your plan at any time from your account dashboard. The remaining value of your current plan will be prorated and applied to your new plan.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">What does "Dedicated Relationship Manager" mean?</h3>
                <p className="text-gray-600 mt-1">
                  A dedicated relationship manager is a personal point of contact who will assist you throughout your property search journey, providing personalized recommendations and support.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-gray-600 mt-1">
                  We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 7 days of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BuyerPricingPlans;