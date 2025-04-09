import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "../property/property-card";
import { queryClient, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import {
  Loader2,
  Sparkles,
  Eye,
  ThumbsUp,
  MousePointerClick,
  Star,
  Brain,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RecommendedProperties() {
  const { user } = useAuth();
  const [showAiInfo, setShowAiInfo] = useState(false);

  const {
    data: recommendations = [],
    isLoading,
    error,
  } = useQuery<Property[]>({
    queryKey: ["/api/recommendations"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fallback to featured properties if user is not logged in or there was an error
  const { data: featuredProperties = [], isLoading: isFeaturedLoading } =
    useQuery<Property[]>({
      queryKey: ["/api/properties/featured"],
      queryFn: getQueryFn({ on401: "returnNull" }),
      enabled: !user || !!error,
    });

  const properties =
    user && recommendations?.length > 0 ? recommendations : featuredProperties;
  const isLoadingProperties =
    (user && isLoading) || (!user && isFeaturedLoading);
  const title =
    user && recommendations.length > 0
      ? "Recommended For You"
      : "Featured Properties";

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {user && (
            <div className="mt-2 md:mt-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <p className="text-gray-600">
                  Top Recommendations – Discover the Finest Newly Listed
                  Propertiess
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendation Education Card */}
        {user && showAiInfo && (
          <Card className="p-5 mb-8 bg-indigo-50 border-indigo-100">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  How AI Recommendations Work
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <Eye className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-medium mb-2">
                    Learning Your Preferences
                  </h4>
                  <p className="text-sm text-gray-600">
                    Our system tracks which properties you view and how long you
                    spend on each listing
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <ThumbsUp className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-medium mb-2">Pattern Recognition</h4>
                  <p className="text-sm text-gray-600">
                    The AI identifies patterns in the properties you like, save,
                    or inquire about
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-medium mb-2">Personalized Results</h4>
                  <p className="text-sm text-gray-600">
                    Properties that match your preferences are highlighted with
                    the AI Recommended badge
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                The more you interact with properties on our platform, the
                better our recommendations become. Your data is only used to
                improve your experience and is never shared with third parties.
              </p>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAiInfo(false)}
                  className="text-indigo-600 border-indigo-200"
                >
                  Got it
                </Button>
              </div>
            </div>
          </Card>
        )}

        {isLoadingProperties ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isAiRecommended={
                  !!user &&
                  recommendations.length > 0 &&
                  recommendations.some((r) => r.id === property.id)
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user
                ? "No recommendations available yet. Start browsing properties to get personalized recommendations!"
                : "No featured properties available at the moment."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
