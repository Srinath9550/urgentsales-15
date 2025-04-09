import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Home, Rocket, Zap, Award, Crown } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface OwnerPlanFeature {
  adListings: number;
  topUrgencyList: boolean;
  countdown: boolean;
  highImpactBanners: boolean;
  responseRate: string;
  notificationsToBuyers: number;
  higherPosition: boolean;
  verifiedTag: boolean;
  professionalPhotoshoot: boolean;
  titaniumTag: boolean;
  emailPromotion: boolean;
  propertyDescriptionByExperts: boolean;
  serviceManager: boolean;
  guaranteedBuyers: boolean;
  relationshipManager: boolean;
  socialMediaMarketing: boolean;
  privacyPhoneNumber: boolean;
  highImpactDisplay: string;
  planValidity: string;
}

interface OwnerPlan {
  id: string;
  name: string;
  originalPrice: string;
  price: string;
  numericPrice: number;
  discount?: string;
  gst: string;
  icon: React.ReactNode;
  features: OwnerPlanFeature;
  color: string;
  buttonColor: string;
  isFree?: boolean;
  isBestValue?: boolean;
}

const OwnerAdPackages = () => {
  const plans: OwnerPlan[] = [
    {
      id: "free",
      name: "Free Package",
      originalPrice: "Free",
      price: "Free",
      numericPrice: 0,
      gst: "",
      icon: <Home className="h-8 w-8 text-blue-600" />,
      features: {
        adListings: 3,
        topUrgencyList: false,
        countdown: false,
        highImpactBanners: false,
        responseRate: "Standard",
        notificationsToBuyers: 125,
        higherPosition: false,
        verifiedTag: false,
        professionalPhotoshoot: false,
        titaniumTag: false,
        emailPromotion: true,
        propertyDescriptionByExperts: false,
        serviceManager: false,
        guaranteedBuyers: false,
        relationshipManager: false,
        socialMediaMarketing: false,
        privacyPhoneNumber: true,
        highImpactDisplay: "7 Days",
        planValidity: "3 Months",
      },
      color: "blue",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      isFree: true,
    },
    {
      id: "quicksell",
      name: "Quick Sell Plan",
      originalPrice: "₹6,999",
      price: "₹4,999",
      numericPrice: 4999,
      discount: "28% OFF",
      gst: "+ 18% GST",
      icon: <Rocket className="h-8 w-8 text-pink-600" />,
      features: {
        adListings: 10,
        topUrgencyList: true,
        countdown: false,
        highImpactBanners: false,
        responseRate: "Medium",
        notificationsToBuyers: 300,
        higherPosition: true,
        verifiedTag: true,
        professionalPhotoshoot: false,
        titaniumTag: false,
        emailPromotion: true,
        propertyDescriptionByExperts: false,
        serviceManager: false,
        guaranteedBuyers: false,
        relationshipManager: false,
        socialMediaMarketing: false,
        privacyPhoneNumber: true,
        highImpactDisplay: "15 Days",
        planValidity: "3 Months",
      },
      color: "pink",
      buttonColor: "bg-pink-600 hover:bg-pink-700 text-white",
    },
    {
      id: "fasttrack",
      name: "FastTrack Plan",
      originalPrice: "₹9,999",
      price: "₹6,999",
      numericPrice: 6999,
      discount: "30% OFF",
      gst: "+ 18% GST",
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      features: {
        adListings: 15,
        topUrgencyList: true,
        countdown: true,
        highImpactBanners: false,
        responseRate: "High",
        notificationsToBuyers: 500,
        higherPosition: true,
        verifiedTag: true,
        professionalPhotoshoot: false,
        titaniumTag: false,
        emailPromotion: true,
        propertyDescriptionByExperts: false,
        serviceManager: false,
        guaranteedBuyers: false,
        relationshipManager: false,
        socialMediaMarketing: true,
        privacyPhoneNumber: true,
        highImpactDisplay: "30 Days",
        planValidity: "3 Months",
      },
      color: "orange",
      buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    {
      id: "top-urgency",
      name: "Top Urgency Plan",
      originalPrice: "₹12,999",
      price: "₹9,999",
      numericPrice: 9999,
      discount: "23% OFF",
      gst: "+ 18% GST",
      icon: <Award className="h-8 w-8 text-amber-600" />,
      features: {
        adListings: 25,
        topUrgencyList: true,
        countdown: true,
        highImpactBanners: true,
        responseRate: "Highest",
        notificationsToBuyers: 750,
        higherPosition: true,
        verifiedTag: true,
        professionalPhotoshoot: true,
        titaniumTag: true,
        emailPromotion: true,
        propertyDescriptionByExperts: true,
        serviceManager: false,
        guaranteedBuyers: false,
        relationshipManager: false,
        socialMediaMarketing: true,
        privacyPhoneNumber: true,
        highImpactDisplay: "45 Days",
        planValidity: "3 Months",
      },
      color: "amber",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
      isBestValue: true,
    },
    {
      id: "elite-urgency",
      name: "Elite Urgency Plan",
      originalPrice: "₹16,999",
      price: "₹14,999",
      numericPrice: 14999,
      discount: "12% OFF",
      gst: "+ 18% GST",
      icon: <Crown className="h-8 w-8 text-yellow-600" />,
      features: {
        adListings: 30,
        topUrgencyList: true,
        countdown: true,
        highImpactBanners: true,
        responseRate: "Priority",
        notificationsToBuyers: 1000,
        higherPosition: true,
        verifiedTag: true,
        professionalPhotoshoot: true,
        titaniumTag: true,
        emailPromotion: true,
        propertyDescriptionByExperts: true,
        serviceManager: true,
        guaranteedBuyers: true,
        relationshipManager: true,
        socialMediaMarketing: true,
        privacyPhoneNumber: true,
        highImpactDisplay: "60 Days",
        planValidity: "3 Months",
      },
      color: "yellow",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
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

  const handleSubscribe = (plan: OwnerPlan) => {
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
              Owner Plans & Pricing{" "}
              <span className="text-gray-500 text-sm">(With 18% GST Included)</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Choose the right plan to showcase your property and connect with potential buyers.
            </p>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg overflow-hidden shadow-sm ${
                  plan.isBestValue ? "border-amber-400 ring-2 ring-amber-200" : ""
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
                      <Badge className="bg-amber-500 ml-1">Best Value</Badge>
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
                      {plan.features.highImpactBanners ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>High Impact Banners on Search Results</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Response Rate</span>
                      <span className="font-medium">{plan.features.responseRate}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Notifications to Buyers</span>
                      <span className="font-medium">{plan.features.notificationsToBuyers}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.higherPosition ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Higher Position of Your Property In Search</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.verifiedTag ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Verified Tag on Property</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.professionalPhotoshoot ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Professional Property Photoshoot</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.titaniumTag ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Titanium Tag</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.emailPromotion ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Email Promotion</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.propertyDescriptionByExperts ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Property Description by Experts</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.serviceManager ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Service Manager</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.guaranteedBuyers ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Guaranteed Buyers or MoneyBack</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.relationshipManager ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Relationship Manager (RM)</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.socialMediaMarketing ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Social Media Marketing of Property</span>
                    </div>
                    
                    <div className="flex items-center">
                      {plan.features.privacyPhoneNumber ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span>Privacy of Your Phone Number</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>High Impact Display</span>
                      <span className="font-medium">{plan.features.highImpactDisplay}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Plan Validity</span>
                      <span className="font-medium">{plan.features.planValidity}</span>
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
                          ? "bg-amber-50 border-amber-300" 
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
                  <td className="border p-3 font-medium">High Impact Banners on Search Results</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.highImpactBanners ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Response Rate</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.responseRate}
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
                  <td className="border p-3 font-medium">Higher Position of Your Property In Search</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.higherPosition ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Verified Tag on Property</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.verifiedTag ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Professional Property Photoshoot</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.professionalPhotoshoot ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Titanium Tag</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.titaniumTag ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Email Promotion</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.emailPromotion ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Property Description by Experts</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.propertyDescriptionByExperts ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Service Manager</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.serviceManager ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Guaranteed Buyers or MoneyBack</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.guaranteedBuyers ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Relationship Manager (RM)</td>
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
                  <td className="border p-3 font-medium">Social Media Marketing of Property</td>
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
                  <td className="border p-3 font-medium">Privacy of Your Phone Number</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.privacyPhoneNumber ? (
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
                  <td className="border p-3 font-medium">Plan Validity</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="border p-3 text-center">
                      {plan.features.planValidity}
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OwnerAdPackages;