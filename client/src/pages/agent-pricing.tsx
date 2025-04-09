import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const AgentPricingPlans = () => {
  const plans = [
    {
      name: "Free Package",
      originalPrice: "Free",
      price: "Free",
      icon: "🆓", // Real estate house icon for free package
      features: {
        adListings: 5,
        responseRate: "Standard",
        positionOnSearch: "Standard",
        notificationsToBuyers: 125,
        accessToAdReplies: true,
        certifiedAgentTag: false,
        autoRefresh: false,
        verified: false,
        emailPromotion: false,
        trustedAgent: false,
        featuredAgent: false,
        personalRelationshipManager: false,
        googleAdsPromotion: false,
        highImpactDisplay: "7 Days",
        validFor: "3 Months",
      },
      color: "blue",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      isFree: true,
    },
    {
      name: "Express Agent Plan",
      originalPrice: "₹12,999",
      price: "₹9,999",
      discount: "23% OFF",
      gst: "+ 18% GST",
      icon: "🚀", // Changed to a star icon to represent express/premium service
      features: {
        adListings: 20,
        responseRate: "Medium",
        positionOnSearch: "High",
        notificationsToBuyers: 300,
        accessToAdReplies: true,
        certifiedAgentTag: false,
        autoRefresh: true,
        verified: true,
        emailPromotion: true,
        trustedAgent: false,
        featuredAgent: false,
        personalRelationshipManager: false,
        googleAdsPromotion: false,
        highImpactDisplay: "15 Days",
        validFor: "3 Months",
      },
      color: "indigo",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
    {
      name: "Prime Agent Plan",
      originalPrice: "₹19,999",
      price: "₹14,999",
      discount: "25% OFF",
      gst: "+ 18% GST",
      icon: "💎", // Diamond icon representing premium/prime status
      features: {
        adListings: 30,
        responseRate: "High",
        positionOnSearch: "Higher",
        notificationsToBuyers: 500,
        accessToAdReplies: true,
        certifiedAgentTag: false,
        autoRefresh: true,
        verified: true,
        emailPromotion: true,
        trustedAgent: false,
        featuredAgent: true,
        personalRelationshipManager: false,
        googleAdsPromotion: true,
        highImpactDisplay: "30 Days",
        validFor: "3 Months",
      },
      color: "orange",
      buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    {
      name: "VIP Agent Plan",
      originalPrice: "₹29,999",
      price: "₹24,999",
      discount: "17% OFF",
      gst: "+ 18% GST",
      icon: "⭐", // VIP star icon representing premium VIP status
      features: {
        adListings: 50,
        responseRate: "Highest",
        positionOnSearch: "Top",
        notificationsToBuyers: 750,
        accessToAdReplies: true,
        certifiedAgentTag: true,
        autoRefresh: true,
        verified: true,
        emailPromotion: true,
        trustedAgent: false,
        featuredAgent: true,
        personalRelationshipManager: false,
        googleAdsPromotion: true,
        highImpactDisplay: "45 Days",
        validFor: "3 Months",
      },
      color: "amber",
      buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      name: "Platinum Agent Plan",
      originalPrice: "₹44,999",
      price: "₹34,999",
      discount: "22% OFF",
      gst: "+ 18% GST",
      icon: "👑",
      features: {
        adListings: 100,
        responseRate: "Priority",
        positionOnSearch: "Top Priority",
        notificationsToBuyers: 1000,
        accessToAdReplies: true,
        certifiedAgentTag: true,
        autoRefresh: true,
        verified: true,
        emailPromotion: true,
        trustedAgent: true,
        featuredAgent: true,
        personalRelationshipManager: true,
        googleAdsPromotion: true,
        highImpactDisplay: "60 Days",
        validFor: "3 Months",
      },
      color: "yellow",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
  ];

  const getColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      pink: "bg-pink-50 border-pink-200 text-pink-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      amber: "bg-amber-50 border-amber-200 text-amber-600",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    };
    return colorMap[color] || "bg-gray-50 border-gray-200 text-gray-600";
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Agent Subscription Plans <span className="text-gray-500 text-sm">(With 18% GST Included)</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Choose the right plan to boost your real estate business and connect with more clients.
            </p>
          </div>

          {/* Responsive Grid for Mobile and Tablet, Table for Desktop */}
          <div className="md:hidden">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`mb-6 p-6 rounded-lg shadow-md ${getColorClass(plan.color)} border`}
              >
                <div className="flex flex-col items-center mb-4">
                  <span className="text-3xl mb-2">{plan.icon}</span>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  {plan.discount && (
                   <Badge className="bg-green-500">{plan.discount}</Badge>
                  )}
                  <div className="mt-2 text-center">
                    {plan.originalPrice !== plan.price && (
                      <span className="text-gray-500 line-through text-sm">{plan.originalPrice}</span>
                    )}
                    <span className="font-bold text-lg">{plan.price}</span>
                    {plan.gst && <p className="text-xs text-gray-600">{plan.gst}</p>}
                  </div>
                </div>

                <ul className="space-y-3">
                  {Object.entries(plan.features).map(([feature, value]) => (
                    <li key={feature} className="flex items-center">
                      {typeof value === "boolean" ? (
                        value ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        )
                      ) : (
                        <span className="w-5 h-5 mr-2"></span>
                      )}
                      <span className="capitalize">
                        {feature.replace(/([A-Z])/g, " $1").trim()}:{' '}
                        {typeof value === "boolean" ? "" : value}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button className={`w-full mt-4 ${plan.buttonColor}`}>
                  {plan.isFree ? "Get Free Plan" : "Subscribe Now"}
                </Button>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-100 text-left font-semibold">Features</th>
                  {plans.map((plan, index) => (
                    <th
                      key={index}
                      className={`border p-3 text-center ${getColorClass(plan.color)} ${
                        plan.name === "Platinum Agent Plan" ? "bg-yellow-100 border-yellow-300" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{plan.icon}</span>
                        <span className="font-bold">{plan.name}</span>
                        {plan.discount && (
                          <Badge className="bg-green-500 text-white my-2">{plan.discount}</Badge>
                        )}
                        <div className="mt-1">
                          {plan.originalPrice !== plan.price && (
                            <span className="text-gray-500 line-through text-sm">{plan.originalPrice}</span>
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
                {Object.keys(plans[0].features).map((feature) => (
                  <tr key={feature}>
                    <td className="border p-3 font-medium capitalize">
                      {feature.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    {plans.map((plan, index) => (
                      <td key={index} className="border p-3 text-center">
                        {typeof plan.features[feature] === "boolean" ? (
                          plan.features[feature] ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          plan.features[feature]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="border p-3 font-medium">Subscribe</td>
                  {plans.map((plan, index) => (
                    <td key={index} className="border p-3 text-center">
                      <Button className={`w-full ${plan.buttonColor}`}>
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

export default AgentPricingPlans;