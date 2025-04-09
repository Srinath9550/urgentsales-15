import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  X, 
  ChevronLeft, 
  ChevronRight,
  IndianRupee,
  Bed,
  Bath
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function RecommendationEngine() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedProperties, setDismissedProperties] = useState<number[]>([]);
  
  // Query recommended properties for logged in users
  const { data: recommendedProperties = [] } = useQuery<Property[]>({
    queryKey: ['/api/recommendations/ai'],
    enabled: !!user,
  });
  
  // Query featured properties for non-logged in users
  const { data: featuredProperties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/featured'],
  });
  
  // Filter out dismissed properties and prioritize premium
  const properties = (user ? recommendedProperties : featuredProperties)
    .filter(property => !dismissedProperties.includes(property.id))
    // Sort properties to prioritize premium listings first
    .sort((a, b) => {
      // First sort by subscription level (premium > paid > free)
      if (a.subscriptionLevel === 'premium' && b.subscriptionLevel !== 'premium') return -1;
      if (a.subscriptionLevel !== 'premium' && b.subscriptionLevel === 'premium') return 1;
      if (a.subscriptionLevel === 'paid' && b.subscriptionLevel === 'free') return -1;
      if (a.subscriptionLevel === 'free' && b.subscriptionLevel === 'paid') return 1;
      
      // Then sort by premium flag as backup
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      
      return 0;
    });
  
  // Close the recommendation panel if there are no properties left
  useEffect(() => {
    if (properties.length === 0 && isOpen) {
      setIsOpen(false);
    }
  }, [properties.length, isOpen]);
  
  // Auto-open the recommendation panel after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (properties.length > 0 && !isOpen) {
        setIsOpen(true);
      }
    }, 15000); // 15 seconds
    
    return () => clearTimeout(timer);
  }, [properties.length, isOpen]);

  // Go to next property
  const handleNext = () => {
    if (activeIndex < properties.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0); // Loop back to the first property
    }
  };

  // Go to previous property
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(properties.length - 1); // Loop to the last property
    }
  };

  // Dismiss a property
  const handleDismiss = (propertyId: number) => {
    setDismissedProperties(prev => [...prev, propertyId]);
    if (activeIndex >= properties.length - 1) {
      setActiveIndex(0);
    }
  };

  if (properties.length === 0) return null;
  
  const activeProperty = properties[activeIndex];
  if (!activeProperty) return null;
  
  return (
    <div
      className={`fixed z-40 bottom-0 right-24 transition-transform duration-300 transform ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Card className="w-80 shadow-lg border-t-4 border-t-primary">
        <div className="bg-primary/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <h3 className="text-sm font-medium">
              {user ? 'Recommended For You' : 'You May Like These'}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <CardContent className="p-0">
          {/* Property Info */}
          <div className="relative">
            <div className="h-36 bg-gray-200">
              <img
                src={activeProperty.imageUrls?.[0] || 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                alt={activeProperty.title}
                className="w-full h-full object-cover"
              />
              {/* Subscription badge */}
              {activeProperty.subscriptionLevel === 'premium' && (
                <Badge className="absolute top-2 right-2 bg-amber-500 border-amber-500">
                  Premium
                </Badge>
              )}
              {activeProperty.subscriptionLevel === 'paid' && (
                <Badge className="absolute top-2 right-2 bg-blue-500 border-blue-500">
                  Featured
                </Badge>
              )}
              
              {/* Navigation buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 rounded-full hover:bg-black/50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Pagination indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {properties.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === activeIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
                {properties.length > 5 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                )}
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-sm line-clamp-1">{activeProperty.title}</h3>
              <div className="flex items-center mt-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{activeProperty.location}</span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="font-medium text-sm flex items-center">
                  <IndianRupee className="h-3 w-3 mr-0.5" />
                  {activeProperty.price.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  {activeProperty.bedrooms && (
                    <span className="flex items-center" title="Bedrooms">
                      <Bed className="h-3 w-3 mr-0.5" />
                      {activeProperty.bedrooms}
                    </span>
                  )}
                  {activeProperty.bathrooms && (
                    <span className="flex items-center" title="Bathrooms">
                      <Bath className="h-3 w-3 mr-0.5" />
                      {activeProperty.bathrooms}
                    </span>
                  )}
                  <span className="flex items-center" title="Area">
                    {activeProperty.area}m²
                  </span>
                </div>
              </div>
              
              {/* Special features */}
              {activeProperty.premium && (
                <div className="mt-2 flex items-center text-xs text-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Trending property with high interest</span>
                </div>
              )}
              
              <div className="mt-3 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(activeProperty.id)}
                  className="text-xs px-2"
                >
                  Not interested
                </Button>
                
                <Link href={`/properties/${activeProperty.id}`}>
                  <Button size="sm" className="text-xs px-3 flex items-center">
                    View details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pull tab when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute -top-9 right-4 bg-primary text-white px-3 py-1.5 rounded-t-md flex items-center text-xs"
        >
          <Sparkles className="h-3 w-3 mr-1.5" />
          Recommendations
        </button>
      )}
    </div>
  );
}