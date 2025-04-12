import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Property } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FeaturedListings from "@/components/home/featured-listings";
import CommercialProjects from "@/components/home/commercial-projects";
import NewlyListedProperties from "@/components/home/newly-listed-properties";
import LuxuryProjects from "@/components/home/luxury-projects";
import RecommendedProperties from "@/components/home/recommended-properties";
import AffordableProjects from "@/components/home/affordable-projects";
import UpcomingProjects from "@/components/home/upcoming-projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/property/property-card";
import {
  MapPin,
  Sparkles,
  Filter,
  ChevronDown,
  Home,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TopPropertiesView() {
  const [_, navigate] = useLocation();
  const params = useParams<{ count?: string }>();
  const [searchParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const count = params.count || "10";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "premium";

  const [sortBy, setSortBy] = useState<string>("price-desc");
  const [selectedCity, setSelectedCity] = useState<string>(location);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  // Add location-based filtering
  const [userLocation, setUserLocation] = useState<string>("");

  useEffect(() => {
    // Get user's location from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`,
          );
          const data = await response.json();
          const city = data.results[0].components.city;
          setUserLocation(city);
          setSelectedCity(city);
        } catch (error) {
          console.error("Error getting location:", error);
        }
      });
    }
  }, []);

  // Query for properties based on location and category
  const {
    data: properties,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "/api/properties/top",
      { category, location: selectedCity || userLocation, limit: count },
    ],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey as [
        string,
        { category: string; location: string; limit: string },
      ];
      const searchParams = new URLSearchParams();

      if (params.category) searchParams.append("category", params.category);
      if (params.location) searchParams.append("location", params.location);
      if (params.limit) searchParams.append("limit", params.limit);

      const response = await fetch(
        `/api/properties/top?${searchParams.toString()}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch top properties");
      }
      return response.json();
    },
  });

  // Filter and sort properties
  const filteredProperties = properties
    ? properties
        .filter(
          (property: Property) =>
            (!selectedCity || property.location === selectedCity) &&
            property.price >= priceRange[0] &&
            property.price <= priceRange[1],
        )
        .sort((a: Property, b: Property) => {
          switch (sortBy) {
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            default:
              return 0;
          }
        })
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Add quick navigation function
  const handleQuickNav = (topCount: string) => {
    navigate(
      `/top-properties-view/${topCount}?category=top${topCount}&location=${selectedCity || userLocation}`,
    );
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Top Properties Section with Quick Navigation */}
        <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-6 sm:px-8">
            <div className="flex flex-col space-y-6 sm:space-y-8">
            <div className="mb-8 text-base text-gray-500">
            <button
              onClick={() => window.history.back()}
              className="hover:text-primary focus:outline-none text-lg"
            >
              ← Back
            </button>
          </div>
              {/* Header and Navigation */}
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col space-y-2">
                  <h2 className="text-lg font-semibold text-gray-600">
                    Quick Navigation:
                  </h2>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Top Properties{" "}
                    {selectedCity && `in ${selectedCity}`}
                  </h1>
                </div>

                {/* Quick Navigation */}
                <div className="flex flex-wrap items-center gap-1 xs:gap-2 sm:gap-3 -mx-1 px-1 overflow-x-auto scrollbar-hide w-full md:w-auto">
                  {["10", "20", "30", "50", "100"].map((topCount) => (
                    <Button
                      key={topCount}
                      variant="ghost"
                      onClick={() => handleQuickNav(topCount)}
                      className={`
                        flex-shrink-0 
                        flex 
                        items-center 
                        gap-1 
                        px-2 xs:px-3 sm:px-4 
                        py-1 xs:py-1.5 sm:py-2
                        rounded-full 
                        text-xs xs:text-sm sm:text-base
                        transition-all 
                        duration-200
                        min-w-[80px] xs:min-w-[90px] sm:min-w-[100px]
                        justify-center
                        ${
                          count === topCount
                            ? "bg-blue-700 text-white hover:bg-blue-800 shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow"
                        }
                      `}
                    >
                      <Sparkles
                        className={`
                          w-2 h-2
                          xs:w-3 xs:h-3
                          sm:w-4 sm:h-4
                          ${count === topCount ? "text-white" : "text-blue-600"}
                        `}
                      />
                      <span className="ml-1 xs:ml-1.5 sm:ml-2">Top {topCount}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                {/* Location Filter */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Location: {selectedCity || "All"}
                  </span>
                </div>

                {/* Sort Controls */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px] text-sm">
                    <SelectValue placeholder="Sort properties..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProperties?.map((property) => (
                  <PropertyCard
                    key={property.id}
                    prop={property}
                    isAiRecommended={property.premium || false}
                  />
                ))}
                {filteredProperties?.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      No properties found
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your filters or changing location
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Location-based sections with responsive spacing */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          <FeaturedListings />
          <CommercialProjects />
          <NewlyListedProperties />
          <LuxuryProjects />
          <RecommendedProperties />
          <AffordableProjects />
          <UpcomingProjects />
        </div>
      </main>

      <Footer />
    </div>
  );
}
