import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Property } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NeighborhoodInsights from "@/components/property/neighborhood-insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { formatImageUrl, processImageUrls, handleImageError, DEFAULT_PLACEHOLDER } from "@/lib/image-utils";
import {
  MapPin,
  Bed,
  Droplet,
  Ruler,
  Calendar,
  Check,
  MapIcon,
  HomeIcon,
  Share2,
  Heart,
  Phone,
  Mail,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Sofa,
  Layout,
  Car,
  Compass,
  Wifi,
  Tv,
  Fan,
  ParkingSquare,
  Armchair,
  Fence,
  TreePine,
  Landmark,
  Warehouse,
  Factory,
  Store,
  ShieldCheck,
  Dumbbell,
  Waves,
  Utensils,
  Building,
  Key,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Utility function for ordinal suffixes
function getOrdinalSuffix(num: number) {
  if (isNaN(num)) return "";
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const [interestName, setInterestName] = useState("");
  const [interestEmail, setInterestEmail] = useState("");
  const [interestPhone, setInterestPhone] = useState("");
  const [interestMessage, setInterestMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [showFullscreenGallery, setShowFullscreenGallery] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>(
    {},
  );
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch property details
  const {
    data: property,
    isLoading,
    isError,
  } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  // Check if user is logged in and show login prompt after a short delay
  useEffect(() => {
    // Check if the user has dismissed the login prompt in this session
    const hasUserDismissedPrompt = sessionStorage.getItem(`dismissedLoginPrompt_${id}`);
    
    // We'll show the login prompt for non-registered users, but with a slight delay
    // and only if they haven't dismissed it before
    if (!user && !showLoginPrompt && !hasUserDismissedPrompt) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }
  }, [user, showLoginPrompt, id]);

  // Track property view with recommendation engine
  const trackInteractionMutation = useMutation({
    mutationFn: async ({
      propertyId,
      interactionType,
    }: {
      propertyId: number;
      interactionType: "view" | "save" | "inquiry";
    }) => {
      return apiRequest({
        url: "/api/recommendations/track",
        method: "POST",
        body: { propertyId, interactionType },
      });
    },
  });

  // Save/unsave property mutation
  const savePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }
        console.log(`Attempting to save property ${propertyId}`);
        return await apiRequest({
          url: `/api/properties/${propertyId}/save`,
          method: "POST",
        });
      } catch (error) {
        console.error(
          `Error in savePropertyMutation for property ${propertyId}:`,
          error,
        );
        throw error;
      }
    },
    onSuccess: () => {
      setIsFavorite(true);
      toast({
        title: "Property saved",
        description: "You can find it in your saved properties list",
      });
      // Track saving as an interaction for recommendations
      if (user && property) {
        trackInteractionMutation.mutate({
          propertyId: property.id,
          interactionType: "save",
        });
      }
      // Invalidate saved properties query to update the UI
      queryClient.invalidateQueries({ queryKey: ["/api/user/saved"] });
    },
    onError: (error: any) => {
      console.error("Save property error:", error);

      // Handle authentication errors
      if (error?.response?.status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to save properties.",
          variant: "destructive",
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
        }, 1500);
        return;
      }

      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const unsavePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }
        console.log(`Attempting to unsave property ${propertyId}`);
        return await apiRequest({
          url: `/api/properties/${propertyId}/save`,
          method: "DELETE",
        });
      } catch (error) {
        console.error(
          `Error in unsavePropertyMutation for property ${propertyId}:`,
          error,
        );
        throw error;
      }
    },
    onSuccess: () => {
      setIsFavorite(false);
      toast({
        title: "Property removed",
        description: "Property has been removed from your saved list",
      });
      // Invalidate saved properties query to update the UI
      queryClient.invalidateQueries({ queryKey: ["/api/user/saved"] });
    },
    onError: (error: any) => {
      console.error("Unsave property error:", error);

      // Handle authentication errors
      if (error?.response?.status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage saved properties.",
          variant: "destructive",
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
        }, 1500);
        return;
      }

      toast({
        title: "Error",
        description: "Failed to remove property. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if property is saved for logged-in user
  const { data: savedProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/user/saved"],
    enabled: !!user,
  });

  // Track view on component mount
  useEffect(() => {
    if (user && property) {
      trackInteractionMutation.mutate({
        propertyId: property.id,
        interactionType: "view",
      });

      // Check if property is already saved
      const isSaved = savedProperties.some((prop) => prop.id === property.id);
      setIsFavorite(isSaved);

      // Randomly show AI recommendation badge (in a real app, this would be based on more complex logic)
      setShowAiRecommendation(Math.random() > 0.7);
    }
  }, [user, property, savedProperties]);

  // Add event listener to handle carousel navigation
  useEffect(() => {
    const handleCarouselChange = () => {
      // Get the current index from the carousel if it exists
      const carousel = carouselRef.current;
      if (carousel) {
        // Get active element from carousel
        const activeSlide = carousel.querySelector('[data-state="active"]');
        if (activeSlide) {
          const slideIndex = Array.from(
            carousel.querySelectorAll("[data-carousel-item]"),
          ).indexOf(activeSlide);
          if (slideIndex !== -1 && slideIndex !== activeImageIndex) {
            setActiveImageIndex(slideIndex);
          }
        }
      }
    };

    // Add event listener for carousel changes
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("change", handleCarouselChange);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("change", handleCarouselChange);
      }
    };
  }, [activeImageIndex]);

  // Format the price in Indian currency format
  const formatPrice = (price?: number) => {
    if (!price) return "Price on request";

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const toggleFavorite = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save properties",
        variant: "destructive",
      });
      // Redirect to login page
      window.location.href =
        "/auth?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    if (property) {
      try {
        if (isFavorite) {
          console.log("Unsaving property:", property.id);
          unsavePropertyMutation.mutate(property.id);
        } else {
          console.log("Saving property:", property.id);
          savePropertyMutation.mutate(property.id);
        }
      } catch (error) {
        console.error("Error in toggleFavorite:", error);
        toast({
          title: "Error",
          description:
            "Failed to save property. Please try again or refresh the page.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Skeleton className="h-40 w-full rounded-xl" />
                </div>
                <div>
                  <Skeleton className="h-60 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use the default image from image-utils
  const defaultImage = DEFAULT_PLACEHOLDER;
  
  // Process image URLs to use the direct API endpoint
  const images = property.imageUrls && Array.isArray(property.imageUrls) 
    ? property.imageUrls
        .filter(url => url && typeof url === 'string' && url.trim() !== '')
        .map(url => {
          // If it's already a full URL, return it as is
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          }
          // Make sure we're not double-encoding an already encoded URL
          if (url.includes('/api/s3-image?key=')) {
            return url;
          }
          // Otherwise, use the API endpoint
          return `/api/s3-image?key=${encodeURIComponent(url)}`;
        })
    : [defaultImage];
    
  console.log(`Property ${property.id} has ${images.length} processed images:`, images);
  
  console.log(`Property ${property.id} has ${images.length} valid images:`, images);
      
  // Videos from property if available
  const videos = property.videoUrls && Array.isArray(property.videoUrls) ? property.videoUrls : [];

  const handleImageError = (index: number) => {
    setImageLoadError((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/properties" className="text-gray-500 hover:text-primary">
              Properties
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{property.title}</span>
          </div>

          {/* Property Title & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {property.location}, {property.city}
                </span>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Property Images */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-[400px] mb-2">
              <div className="w-full h-full relative group">
                <Carousel className="w-full h-full" ref={carouselRef}>
                  <CarouselContent className="h-[400px]">
                    {images.map((image, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="relative w-full h-full">
                          {/* Skeleton loader while image is loading */}
                          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                          
                          <img
                            src={image}
                            alt={`${property.title} - ${index + 1}`}
                            className="w-full h-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                            style={{ opacity: imageLoadError[index] ? 0 : 1 }}
                            onLoad={() => {
                              console.log(`Image loaded successfully at index ${index}:`, image);
                            }}
                            onError={(e) => {
                              console.log(`Error loading image at index ${index}:`, image);
                              handleImageError(index);
                              // Try with the API endpoint if it's not already using it
                              if (!image.includes('/api/s3-image') && property.imageUrls && property.imageUrls[index]) {
                                const apiUrl = `/api/s3-image?key=${encodeURIComponent(property.imageUrls[index])}`;
                                console.log(`Trying with API endpoint: ${apiUrl}`);
                                (e.target as HTMLImageElement).src = apiUrl;
                              } else {
                                // If that fails too, use the default placeholder
                                (e.target as HTMLImageElement).src = defaultImage;
                              }
                            }}
                          />
                          
                          {index === activeImageIndex && (
                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CarouselPrevious className="relative h-9 w-9 rounded-full" />
                    <CarouselNext className="relative h-9 w-9 rounded-full" />
                  </div>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-80 transition-opacity"
                    onClick={() => setShowFullscreenGallery(true)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                </Carousel>
              </div>

              {/* Badges */}
              {property.featured && (
                <Badge className="absolute top-4 left-4 z-10 bg-primary">
                  FEATURED
                </Badge>
              )}
              {showAiRecommendation && (
                <Badge className="absolute top-4 right-14 z-10 bg-indigo-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI RECOMMENDED</span>
                </Badge>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`h-16 w-24 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === index ? "border-primary" : "border-transparent hover:border-gray-300"}`}
                    onClick={() => {
                      setActiveImageIndex(index);
                      const slides = carouselRef.current?.querySelectorAll(
                        "[data-carousel-slide]",
                      );
                      if (slides && slides[index]) {
                        slides[index].scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }
                    }}
                  >
                    <div className="relative w-full h-full">
                      {/* Skeleton loader while thumbnail is loading */}
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      
                      <img
                        src={image}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover relative z-10"
                        style={{ opacity: imageLoadError[index] ? 0 : 1 }}
                        onLoad={() => {
                          console.log(`Thumbnail loaded successfully at index ${index}:`, image);
                        }}
                        onError={(e) => {
                          console.log(`Error loading thumbnail at index ${index}:`, image);
                          handleImageError(index);
                          handleImageError(e);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Gallery Modal */}
          {showFullscreenGallery && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
              <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 text-white bg-black bg-opacity-50 hover:bg-opacity-70"
                  onClick={() => setShowFullscreenGallery(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full">
                    {images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="h-full flex items-center justify-center p-4"
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Skeleton loader while image is loading */}
                          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                          
                          <img
                            src={image}
                            alt={`${property.title} - ${index + 1}`}
                            className="max-w-full max-h-full object-contain relative z-10"
                            style={{ opacity: imageLoadError[index] ? 0 : 1 }}
                            onLoad={() => {
                              console.log(`Fullscreen image loaded successfully at index ${index}:`, image);
                            }}
                            onError={(e) => {
                              console.log(`Error loading fullscreen image at index ${index}:`, image);
                              handleImageError(index);
                              handleImageError(e);
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <div className="absolute inset-y-0 left-4 flex items-center">
                    <CarouselPrevious className="relative h-10 w-10 rounded-full" />
                  </div>

                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <CarouselNext className="relative h-10 w-10 rounded-full" />
                  </div>
                </Carousel>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-4 py-2 rounded-full">
                  <span className="text-white text-sm">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Property Information */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap mb-6">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formatPrice(property.price)}
                        {property.pricePerUnit && property.area && (
                          <span className="text-base font-normal text-gray-500 ml-2">
                            (₹{Math.round(property.price / property.area).toLocaleString('en-IN')}/sq.ft)
                          </span>
                        )}
                      </h2>
                      <p className="text-gray-500">
                        {property.area && `${property.area} ${property.areaUnit || 'sq.ft'}`}
                        {property.bedrooms && ` · ${property.bedrooms} Beds`}
                        {property.bathrooms && ` · ${property.bathrooms} Baths`}
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-wrap md:justify-end">
                      <div className="flex items-center mr-4 text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Listed{" "}
                          {formatDistanceToNow(
                            new Date(property.createdAt || new Date()),
                            { addSuffix: true },
                          )}
                        </span>
                      </div>
                      
                      {/* Property badges */}
                      <div className="flex flex-wrap gap-2">
                        {property.userType && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            {property.userType === 'owner' ? 'Owner Direct' : 
                             property.userType === 'agent' ? 'Agent' : 
                             property.userType === 'builder' ? 'Builder' : property.userType}
                          </Badge>
                        )}
                        
                        {property.transactionType && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            {property.transactionType === 'new' ? 'New Property' :
                             property.transactionType === 'resale' ? 'Resale' :
                             property.transactionType === 'rent' ? 'For Rent' :
                             property.transactionType === 'under-construction' ? 'Under Construction' :
                             property.transactionType === 'ready-to-move' ? 'Ready to Move' :
                             property.transactionType}
                          </Badge>
                        )}
                        
                        {property.isUrgentSale && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200"
                          >
                            Urgent Sale
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Main Property Features */}
                    {property.bedrooms && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Bed className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">
                          {property.bedrooms}
                        </p>
                        <p className="text-gray-500 text-sm">Bedrooms</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Droplet className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">
                          {property.bathrooms}
                        </p>
                        <p className="text-gray-500 text-sm">Bathrooms</p>
                      </div>
                    )}
                    {property.area && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Ruler className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">
                          {property.area}
                        </p>
                        <p className="text-gray-500 text-sm">{property.areaUnit || 'Sq. Ft.'}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <HomeIcon className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                      <p className="text-gray-700 font-semibold capitalize">
                        {property.propertyType && property.propertyType.replace(/-/g, ' ')}
                      </p>
                      <p className="text-gray-500 text-sm">Property Type</p>
                    </div>
                    
                    {/* Additional property details */}
                    {property.furnishedStatus && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Sofa className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold capitalize">
                          {property.furnishedStatus.replace(/-/g, ' ')}
                        </p>
                        <p className="text-gray-500 text-sm">Furnishing</p>
                      </div>
                    )}
                    {property.balconies && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Layout className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">
                          {property.balconies}
                        </p>
                        <p className="text-gray-500 text-sm">Balconies</p>
                      </div>
                    )}
                    {property.parking && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Car className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold capitalize">
                          {property.parking.replace(/-/g, ' ')}
                        </p>
                        <p className="text-gray-500 text-sm">Parking</p>
                      </div>
                    )}
                    {property.facing && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Compass className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold capitalize">
                          {property.facing.replace(/-/g, ' ')}
                        </p>
                        <p className="text-gray-500 text-sm">Facing</p>
                      </div>
                    )}
                    
                    {/* Property Status */}
                    {property.possessionStatus && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Key className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold capitalize">
                          {property.possessionStatus.replace(/-/g, ' ')}
                        </p>
                        <p className="text-gray-500 text-sm">Possession</p>
                      </div>
                    )}
                    {property.constructionAge && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Building className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold capitalize">
                          {property.constructionAge.replace(/-/g, ' ')}
                        </p>
                        <p className="text-gray-500 text-sm">Construction Age</p>
                      </div>
                    )}
                    {property.floorNo && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Building className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold capitalize">
                          {property.floorNo === 'ground' ? 'Ground Floor' : 
                           property.floorNo === 'penthouse' ? 'Penthouse' : 
                           property.floorNo === 'lower-basement' ? 'Lower Basement' :
                           property.floorNo === 'upper-basement' ? 'Upper Basement' :
                           `${property.floorNo}${getOrdinalSuffix(parseInt(property.floorNo))} Floor`}
                        </p>
                        <p className="text-gray-500 text-sm">Floor</p>
                      </div>
                    )}
                    {property.totalFloors && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Building className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">
                          {property.totalFloors}
                        </p>
                        <p className="text-gray-500 text-sm">Total Floors</p>
                      </div>
                    )}
                  </div>

                  {/* Stacked sections instead of tabs */}
                  <div className="space-y-8">
                    {/* Description Section */}
                    <div className="pb-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <div className="w-1 h-6 bg-primary mr-3"></div>
                        Description
                      </h2>
                      <div className="space-y-4 text-gray-700">
                        <p>{property.description}</p>
                      </div>
                    </div>
                    {/* Features Section */}
                    <div className="pb-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <div className="w-1 h-6 bg-primary mr-3"></div>
                        Features
                      </h2>
                      <div className="space-y-6">
                        {/* Amenities Section */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {property.amenities && property.amenities.length > 0 ? (
                              property.amenities.map((amenity, index) => (
                                <div key={index} className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="capitalize">{amenity.replace(/-/g, ' ')}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 col-span-full">No amenities specified</p>
                            )}
                          </div>
                        </div>

                        {/* Property Details Section */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">Property Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4">
                            {/* Basic Property Information */}
                            {property.propertyType && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Property Type</div>
                                <div className="font-medium capitalize">{property.propertyType.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.propertyCategory && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Category</div>
                                <div className="font-medium capitalize">{property.propertyCategory.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.transactionType && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Transaction Type</div>
                                <div className="font-medium capitalize">{property.transactionType.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.area && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Area</div>
                                <div className="font-medium">
                                  {property.area} {property.areaUnit || 'sq.ft'}
                                </div>
                              </div>
                            )}
                            {property.pricePerUnit && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Price Per Unit</div>
                                <div className="font-medium">
                                  ₹{property.pricePerUnit.toLocaleString('en-IN')} per {property.areaUnit || 'sq.ft'}
                                </div>
                              </div>
                            )}
                            {property.totalPrice && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Total Price</div>
                                <div className="font-medium">
                                  ₹{property.totalPrice.toLocaleString('en-IN')}
                                </div>
                              </div>
                            )}
                            
                            {/* Property Configuration */}
                            {property.bedrooms && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Bedrooms</div>
                                <div className="font-medium">{property.bedrooms}</div>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Bathrooms</div>
                                <div className="font-medium">{property.bathrooms}</div>
                              </div>
                            )}
                            {property.balconies && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Balconies</div>
                                <div className="font-medium">{property.balconies}</div>
                              </div>
                            )}
                            {property.floorNo && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Floor</div>
                                <div className="font-medium capitalize">
                                  {property.floorNo === 'ground' ? 'Ground Floor' : 
                                   property.floorNo === 'penthouse' ? 'Penthouse' : 
                                   property.floorNo === 'lower-basement' ? 'Lower Basement' :
                                   property.floorNo === 'upper-basement' ? 'Upper Basement' :
                                   `${property.floorNo}${getOrdinalSuffix(parseInt(property.floorNo))} Floor`}
                                </div>
                              </div>
                            )}
                            {property.totalFloors && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Total Floors</div>
                                <div className="font-medium">{property.totalFloors}</div>
                              </div>
                            )}
                            {property.floorsAllowedForConstruction && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Floors Allowed</div>
                                <div className="font-medium">{property.floorsAllowedForConstruction}</div>
                              </div>
                            )}
                            
                            {/* Property Features */}
                            {property.furnishedStatus && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Furnishing</div>
                                <div className="font-medium capitalize">{property.furnishedStatus.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.facing && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Facing</div>
                                <div className="font-medium capitalize">{property.facing.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.parking && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Parking</div>
                                <div className="font-medium capitalize">{property.parking.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            
                            {/* Property Status */}
                            {property.possessionStatus && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Possession</div>
                                <div className="font-medium capitalize">{property.possessionStatus.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.availableFromMonth && property.availableFromYear && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Available From</div>
                                <div className="font-medium">{property.availableFromMonth} {property.availableFromYear}</div>
                              </div>
                            )}
                            {property.ownershipType && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Ownership</div>
                                <div className="font-medium capitalize">{property.ownershipType.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.constructionAge && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Age of Construction</div>
                                <div className="font-medium capitalize">{property.constructionAge.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.propertyAge && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Property Age</div>
                                <div className="font-medium capitalize">{property.propertyAge.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.yearBuilt && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Year Built</div>
                                <div className="font-medium">{property.yearBuilt}</div>
                              </div>
                            )}
                            
                            {/* Project Information */}
                            {property.projectName && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Project Name</div>
                                <div className="font-medium">{property.projectName}</div>
                              </div>
                            )}
                            {property.projectStatus && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Project Status</div>
                                <div className="font-medium capitalize">{property.projectStatus.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.launchDate && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Launch Date</div>
                                <div className="font-medium">{property.launchDate}</div>
                              </div>
                            )}
                            {property.reraRegistered && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">RERA Registered</div>
                                <div className="font-medium">{property.reraRegistered}</div>
                              </div>
                            )}
                            {property.reraNumber && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">RERA Number</div>
                                <div className="font-medium">{property.reraNumber}</div>
                              </div>
                            )}
                            
                            {/* Broker Information */}
                            {property.brokerage && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Brokerage</div>
                                <div className="font-medium">{property.brokerage}</div>
                              </div>
                            )}
                            {property.noBrokerResponses !== undefined && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Broker Responses</div>
                                <div className="font-medium">{property.noBrokerResponses ? 'Not Accepting' : 'Accepting'}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Additional Features Section */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">Additional Features</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4">
                            {/* Land Features */}
                            {property.boundaryWall && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Boundary Wall</div>
                                <div className="font-medium capitalize">{property.boundaryWall.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.roadWidth && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Road Width</div>
                                <div className="font-medium">{property.roadWidth} ft</div>
                              </div>
                            )}
                            {property.openSides && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Open Sides</div>
                                <div className="font-medium">{property.openSides}</div>
                              </div>
                            )}
                            
                            {/* Utilities */}
                            {property.electricityStatus && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Electricity</div>
                                <div className="font-medium capitalize">{property.electricityStatus.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.waterAvailability && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Water Supply</div>
                                <div className="font-medium capitalize">{property.waterAvailability.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            
                            {/* Interior Features */}
                            {property.flooringType && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Flooring</div>
                                <div className="font-medium capitalize">{property.flooringType.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.overlooking && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Overlooking</div>
                                <div className="font-medium capitalize">{property.overlooking.replace(/-/g, ' ')}</div>
                              </div>
                            )}
                            {property.preferredTenant && (
                              <div className="flex items-start">
                                <div className="w-40 text-gray-500">Preferred Tenant</div>
                                <div className="font-medium capitalize">{property.preferredTenant.replace(/-/g, ' ')}</div>
                              </div>
                            )}                          
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location Section */}
                    <div className="pb-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <div className="w-1 h-6 bg-primary mr-3"></div>
                        Location
                      </h2>
                      <div className="space-y-6">
                        {/* Map placeholder */}
                        <div className="rounded-lg overflow-hidden bg-gray-100 h-[300px] flex items-center justify-center mb-6">
                          <div className="text-center text-gray-500">
                            <MapIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p>Map location: {property.address}</p>
                          </div>
                        </div>
                        
                        {/* Location details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                            <div className="space-y-4">
                              <div className="flex items-start">
                                <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="font-medium">{property.address || property.location}</p>
                                  <p className="text-gray-500">{property.city}</p>
                                </div>
                              </div>
                              
                              {property.pincode && (
                                <div className="flex items-start">
                                  <div className="w-7 flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-gray-700">Pincode: {property.pincode}</p>
                                  </div>
                                </div>
                              )}
                              
                              {property.landmarks && (
                                <div className="flex items-start">
                                  <div className="w-7 flex-shrink-0">
                                    <Landmark className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-gray-700 font-medium">Landmarks</p>
                                    <p className="text-gray-600">{property.landmarks}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Nearby amenities or additional location info */}
                          <div>
                            {property.projectName && (
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-3">Project Details</h3>
                                <div className="flex items-start">
                                  <div className="w-7 flex-shrink-0">
                                    <Building className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-gray-700 font-medium">Project Name</p>
                                    <p className="text-gray-600">{property.projectName}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold mb-3">Access Details</h3>
                              {property.roadWidth && (
                                <div className="flex items-start mb-3">
                                  <div className="w-7 flex-shrink-0">
                                    <Car className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-gray-700 font-medium">Road Width</p>
                                    <p className="text-gray-600">{property.roadWidth} ft</p>
                                  </div>
                                </div>
                              )}
                              
                              {property.openSides && (
                                <div className="flex items-start">
                                  <div className="w-7 flex-shrink-0">
                                    <Compass className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-gray-700 font-medium">Open Sides</p>
                                    <p className="text-gray-600">{property.openSides} {parseInt(property.openSides) === 1 ? 'Side' : 'Sides'}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video & Virtual Tour Section */}
                    <div className="pb-6">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                        <div className="w-1 h-6 bg-primary mr-3"></div>
                        Video & Virtual Tour
                      </h2>
                      <div className="space-y-6">
                        {videos && videos.length > 0 ? (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Property Videos ({videos.length})</h3>
                            {videos.map((videoUrl, index) => (
                              <div key={index} className="rounded-lg overflow-hidden bg-gray-100 h-[300px] mb-4">
                                <video 
                                  src={formatImageUrl(videoUrl)} 
                                  controls 
                                  className="w-full h-full object-contain"
                                  poster={images && images.length > 0 ? images[0] : defaultImage}
                                >
                                  Your browser does not support the video tag.
                                </video>
                                {videos.length > 1 && (
                                  <p className="text-sm text-gray-500 mt-2 px-2">Video {index + 1} of {videos.length}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <p>No videos available for this property</p>
                          </div>
                        )}
                        
                        {property.virtualTourUrl ? (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Virtual Tour</h3>
                            <div className="rounded-lg overflow-hidden bg-gray-100 h-[300px]">
                              <iframe 
                                src={formatImageUrl(property.virtualTourUrl)} 
                                className="w-full h-full border-0"
                                allowFullScreen
                                title="Virtual Tour"
                                onError={(e) => {
                                  console.log("Error loading virtual tour:", property.virtualTourUrl);
                                  // Hide the iframe if it fails to load
                                  e.currentTarget.style.display = 'none';
                                  // Show an error message
                                  const errorDiv = document.createElement('div');
                                  errorDiv.className = 'flex items-center justify-center h-full bg-gray-100 text-gray-500';
                                  errorDiv.innerHTML = 'Virtual tour could not be loaded';
                                  e.currentTarget.parentNode?.appendChild(errorDiv);
                                }}
                              ></iframe>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Neighborhood Insights */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <NeighborhoodInsights
                    neighborhood={property.location}
                    city={property.city}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact & Details */}
            <div>
              <Card className="mb-6 sticky top-20">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Contact Property Owner
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {property.userId.toString().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Owner</p>
                        <p className="text-sm text-gray-500">
                          Direct owner - no broker fees
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {/* Only show direct contact info if user has been granted access through the interest form */}
                      {accessGranted ? (
                        <>
                          {/* Direct contact buttons for approved properties */}
                          <div className="mb-3 p-3 bg-green-50 border border-green-100 rounded-md">
                            <div className="flex items-center text-green-600 mb-2">
                              <Sparkles className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Verified Listing</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Contact information is now available:</p>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                <a href={`tel:${property.contactPhone || '+919876543210'}`} className="text-primary hover:underline">
                                  {property.contactPhone || '+91 9876543210'}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                <a href={`mailto:${property.contactEmail || 'seller@example.com'}`} className="text-primary hover:underline">
                                  {property.contactEmail || 'seller@example.com'}
                                </a>
                              </div>
                            </div>
                          </div>
                          {/* Direct contact buttons */}
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90" 
                            onClick={() => window.location.href = `tel:${property.contactPhone || '+919876543210'}`}
                          >
                            <Phone className="h-4 w-4 mr-2" /> Call Owner
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => window.location.href = `mailto:${property.contactEmail || 'seller@example.com'}`}
                          >
                            <Mail className="h-4 w-4 mr-2" /> Email Owner
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* For all properties, show interest form buttons by default */}
                          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                            <p className="text-sm text-gray-600">
                              This property's contact information is private. Submit your details to request access.
                            </p>
                          </div>
                          <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => setShowInterestForm(true)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            <span>Request Contact Info</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowInterestForm(true)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Express Interest</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 rounded-b-lg border-t">
                  <div className="w-full text-center text-sm text-gray-600">
                    <p>Property ID: #{property.id}</p>
                    <p>
                      Last updated:{" "}
                      {formatDistanceToNow(
                        new Date(property.createdAt || new Date()),
                        { addSuffix: true },
                      )}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Share Property Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowShareDialog(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Share Property</h3>
              <p className="text-gray-600 mt-1">
                Share this property with friends and family
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopySuccess("Copied!");
                      setTimeout(() => setCopySuccess(""), 2000);
                    }}
                  >
                    {copySuccess || "Copy"}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Share on Social Media
                </p>
                <div className="flex space-x-4 justify-center">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this property: ${property.title}`)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this property: ${property.title} ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                    </svg>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Property listing: ${property.title}`)}&body=${encodeURIComponent(`Check out this property I found: ${property.title}\n\n${window.location.href}`)}`}
                    className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={() => setShowShareDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interest Form Dialog */}
      {showInterestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInterestForm(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-4 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Express Interest</h3>
              <p className="text-gray-600 mt-1">
                This property listing is private. Submit your information to get
                access to contact details.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmittingInterest(true);

                try {
                  // Send actual API request to the property-interest endpoint
                  const response = await fetch('/api/property-interest', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: interestName,
                      email: interestEmail,
                      phone: interestPhone,
                      message: interestMessage,
                      propertyId: property?.id,
                      propertyTitle: property?.title,
                      propertyPrice: property?.price,
                      propertyLocation: property?.location
                    }),
                  });

                  const data = await response.json();
                  
                  if (response.ok) {
                    setAccessGranted(true);
                    setShowInterestForm(false);
                    toast({
                      title: "Interest Submitted Successfully",
                      description:
                        "Your request has been sent to the property owner and to urgentsale.in@gmail.com. Contact details are now available in the property card.",
                    });
                  } else {
                    toast({
                      title: "Error",
                      description: data.message || "Failed to submit your interest. Please try again.",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  console.error("Error submitting property interest:", error);
                  toast({
                    title: "Error",
                    description: "Failed to submit your interest. Please try again later.",
                    variant: "destructive",
                  });
                } finally {
                  setIsSubmittingInterest(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={interestName}
                  onChange={(e) => setInterestName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={interestEmail}
                  onChange={(e) => setInterestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={interestPhone}
                  onChange={(e) => setInterestPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Your contact number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  placeholder="Please let me know more about this property..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmittingInterest}
              >
                {isSubmittingInterest ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Interest"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to our terms and privacy
                policy. Your information will be sent to the property owner or
                manager.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Login Suggestion Dialog - Non-intrusive */}
      {showLoginPrompt && !user && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setShowLoginPrompt(false);
              // Remember user's preference when clicking X button
              sessionStorage.setItem(`dismissedLoginPrompt_${id}`, 'true');
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                Please login to view property details and contact information.
                Creating an account allows you to:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">Save properties to your favorites</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">Contact property owners and agents</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">
                  Receive personalized property recommendations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm">
                  Access detailed property information and analytics
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLoginPrompt(false);
                  // Remember user's preference in this session
                  sessionStorage.setItem(`dismissedLoginPrompt_${id}`, 'true');
                }}
                type="button"
                className="px-8 border-2"
              >
                <span>Not Now</span>
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
                }}
                type="button"
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                <span>Login / Register</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}