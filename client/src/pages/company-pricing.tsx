import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Building, Rocket, Zap, Award, Crown } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface CompanyPlanFeature {
  adListings: number;
  topUrgencyList: boolean;
  countdown: boolean;
  topProjects: boolean;
  featuredProjects: boolean;
  notificationsToBuyers: number;
  emailPromotions: boolean;
  trustedProjects: boolean;
  approvedProjects: boolean;
  socialMediaMarketing: boolean;
  highImpactDisplay: string;
  validFor: string;
}

interface CompanyPlan {
  id: string;
  name: string;
  originalPrice: string;
  price: string;
  numericPrice: number;
  discount?: string;
  gst: string;
  icon: React.ReactNode;
  features: CompanyPlanFeature;
  color: string;
  buttonColor: string;
  isFree?: boolean;
  isBestValue?: boolean;
}

const CompanyPricingPlans = () => {
  const plans: CompanyPlan[] = [
    {
      id: "free",
      name: "Free Plan",
      originalPrice: "Free",
      price: "Free",
      numericPrice: 0,
      gst: "",
      icon: <span className="text-3xl">🆓</span>,
      features: {
        adListings: 10,
        topUrgencyList: false,
        countdown: false,
        topProjects: false,
        featuredProjects: false,
        notificationsToBuyers: 125,
        emailPromotions: true,
        trustedProjects: false,
        approvedProjects: false,
        socialMediaMarketing: true,
        highImpactDisplay: "7 Days",
        validFor: "3 Months",
      },
      color: "blue",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      isFree: true,
    },
    {
      id: "quicksell",
      name: "QuickSell Plan",
      originalPrice: "₹24,999",
      price: "₹19,999",
      numericPrice: 19999,
      discount: "20% OFF",
      gst: "+ 18% GST",
      icon:<span className="text-2xl">🚀</span>,
      features: {
        adListings: 15,
        topUrgencyList: false,
        countdown: false,
        topProjects: false,
        featuredProjects: false,
        notificationsToBuyers: 300,
        emailPromotions: true,
        trustedProjects: false,
        approvedProjects: false,
        socialMediaMarketing: true,
        highImpactDisplay: "15 Days",
        validFor: "3 Months",
      },
      color: "indigo",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
    {
      id: "fasttrack",
      name: "FastTrack Plan",
      originalPrice: "₹34,999",
      price: "₹29,999",
      numericPrice: 29999,
      discount: "14% OFF",
      gst: "+ 18% GST",
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      features: {
        adListings: 20,
        topUrgencyList: true,
        countdown: false,
        topProjects: false,
        featuredProjects: true,
        notificationsToBuyers: 500,
        emailPromotions: true,
        trustedProjects: false,
        approvedProjects: false,
        socialMediaMarketing: true,
        highImpactDisplay: "30 Days",
        validFor: "3 Months",
      },
      color: "orange",
      buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    {
      id: "top-urgency",
      name: "Top Urgency Plan",
      originalPrice: "₹54,999",
      price: "₹49,999",
      numericPrice: 49999,
      discount: "9% OFF",
      gst: "+ 18% GST",
      icon: <Award className="h-8 w-8 text-amber-600" />,
      features: {
        adListings: 30,
        topUrgencyList: true,
        countdown: false,
        topProjects: true,
        featuredProjects: true,
        notificationsToBuyers: 750,
        emailPromotions: true,
        trustedProjects: false,
        approvedProjects: false,
        socialMediaMarketing: true,
        highImpactDisplay: "45 Days",
        validFor: "3 Months",
      },
      color: "amber",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      id: "elite-urgency",
      name: "Elite Urgency Plan",
      originalPrice: "₹64,999",
      price: "₹59,999",
      numericPrice: 59999,
      discount: "8% OFF",
      gst: "+ 18% GST",
      icon: <Crown className="h-8 w-8 text-yellow-600" />,
      features: {
        adListings: 40,
        topUrgencyList: true,
        countdown: true,
        topProjects: true,
        featuredProjects: true,
        notificationsToBuyers: 1000,
        emailPromotions: true,
        trustedProjects: true,
        approvedProjects: true,
        socialMediaMarketing: true,
        highImpactDisplay: "60 Days",
        validFor: "3 Months",
      },
      color: "yellow",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
      isBestValue: true,
    },
  ];

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      pink: "bg-pink-50 border-pink-200 text-pink-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      amber: "bg-amber-50 border-amber-200 text-amber-600",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    };
    return colorMap[color] || "bg-gray-50 border-gray-200 text-gray-600";
  };

  const handleSubscribe = (plan: CompanyPlan) => {
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
              Companies/Projects Plans & Pricing{" "}
              <span className="text-gray-500 text-sm">(With 18% GST Included)</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Choose the right plan to showcase your company projects and connect with potential buyers.
            </p>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg overflow-hidden shadow-sm ${
                  plan.isBestValue ? "border-yellow-400 ring-2 ring-yellow-200" : ""
                }`}
              >
                <div className={`p-4 ${getColorClass(plan.color)}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2">{plan.icon}</span>
                      <h3 className="font-bold">{plan.name}</h3>
                    </div>
                    {plan.discount && (
                     <Badge className="bg-green-500">{plan.discount}</Badge>
                    )}
                    {plan.isBestValue && (
                      <Badge className="bg-yellow-500 ml-1">Best Value</Badge>
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
                      <span>Ad Listings</span>
                      <span className="font-medium">{plan.features.adListings}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.topUrgencyList ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Top Urgency List</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.countdown ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Countdown</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.topProjects ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Top Projects</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.featuredProjects ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Featured Projects</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Notifications to Buyers</span>
                      <span className="font-medium">{plan.features.notificationsToBuyers}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.emailPromotions ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Email Promotions</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.trustedProjects ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Trusted Projects</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.approvedProjects ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Approved Projects</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.socialMediaMarketing ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Social Media Marketing</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>High Impact Display</span>
                      <span className="font-medium">{plan.features.highImpactDisplay}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Valid For</span>
                      <span className="font-medium">{plan.features.validFor}</span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full mt-6 ${plan.buttonColor}`}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.isFree ? "Get Free Plan" : "Subscribe Now"}
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
                  <th className="border p-3 bg-gray-50 text-left font-semibold">Features</th>
                  {plans.map((plan) => (
                    <th 
                      key={plan.id} 
                      className={`border p-3 text-center ${
                        plan.isBestValue 
                          ? "bg-yellow-50 border-yellow-300" 
                          : getColorClass(plan.color)
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-1">{plan.icon}</div>
                        <span className="font-bold">{plan.name}</span>
                        {plan.discount && (
                         <Badge className="bg-green-500 text-white my-2">{plan.discount}</Badge>
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
                  <td className="border p-3 font-medium">Ad Listings</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.adListings}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Top Urgency List</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.topUrgencyList ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Countdown</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.countdown ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Top Projects</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.topProjects ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Featured Projects</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.featuredProjects ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Notifications to Buyers</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.notificationsToBuyers}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Email Promotions</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.emailPromotions ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Trusted Projects</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.trustedProjects ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Approved Projects</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.approvedProjects ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Social Media Marketing</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.socialMediaMarketing ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">High Impact Display</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.highImpactDisplay}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Valid For</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.validFor}
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
                        {plan.isFree ? "Get Free Plan" : "Subscribe Now"}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyPricingPlans;