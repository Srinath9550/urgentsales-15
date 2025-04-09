import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/property/property-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Filter,
  SlidersHorizontal,
  Search,
  MapPin,
  Home,
  Building,
  Bath,
  BedDouble,
  Grid2X2,
} from "lucide-react";

interface SearchFilters {
  propertyType?: string;
  forSaleOrRent?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  amenities?: string[];
  minArea?: number;
  maxArea?: number;
  sortBy?: string;
}

export default function SearchResults() {
  // Replace React Router hooks with wouter equivalents
  const [location, setLocation] = useLocation();
  const [_, params] = useRoute("/properties:rest*");
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Parse search params from URL
  const getSearchParams = () => {
    if (!location.includes("?")) return new URLSearchParams();
    return new URLSearchParams(location.split("?")[1]);
  };

  const searchParams = getSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: searchParams.get("propertyType") || "",
    forSaleOrRent: searchParams.get("forSaleOrRent") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minBedrooms: searchParams.get("minBedrooms")
      ? Number(searchParams.get("minBedrooms"))
      : undefined,
    maxBedrooms: searchParams.get("maxBedrooms")
      ? Number(searchParams.get("maxBedrooms"))
      : undefined,
    minBathrooms: searchParams.get("minBathrooms")
      ? Number(searchParams.get("minBathrooms"))
      : undefined,
    maxBathrooms: searchParams.get("maxBathrooms")
      ? Number(searchParams.get("maxBathrooms"))
      : undefined,
    amenities: searchParams.get("amenities")
      ? searchParams.get("amenities")?.split(",")
      : [],
    minArea: searchParams.get("minArea")
      ? Number(searchParams.get("minArea"))
      : undefined,
    maxArea: searchParams.get("maxArea")
      ? Number(searchParams.get("maxArea"))
      : undefined,
    sortBy: searchParams.get("sortBy") || "newest",
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 20000000,
  ]);

  const [areaRange, setAreaRange] = useState<[number, number]>([
    filters.minArea || 0,
    filters.maxArea || 10000,
  ]);

  // Fetch properties based on filters
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["api/properties/search", filters, currentPage],
    queryFn: async () => {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters.propertyType)
        queryParams.set("propertyType", filters.propertyType);
      if (filters.forSaleOrRent)
        queryParams.set("forSaleOrRent", filters.forSaleOrRent);
      if (filters.location) queryParams.set("location", filters.location);
      if (filters.minPrice)
        queryParams.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice)
        queryParams.set("maxPrice", String(filters.maxPrice));
      if (filters.minBedrooms)
        queryParams.set("minBedrooms", String(filters.minBedrooms));
      if (filters.maxBedrooms)
        queryParams.set("maxBedrooms", String(filters.maxBedrooms));
      if (filters.minBathrooms)
        queryParams.set("minBathrooms", String(filters.minBathrooms));
      if (filters.maxBathrooms)
        queryParams.set("maxBathrooms", String(filters.maxBathrooms));
      if (filters.amenities && filters.amenities.length > 0)
        queryParams.set("amenities", filters.amenities.join(","));
      if (filters.minArea) queryParams.set("minArea", String(filters.minArea));
      if (filters.maxArea) queryParams.set("maxArea", String(filters.maxArea));
      if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);

      queryParams.set("page", String(currentPage));
      queryParams.set("limit", "12"); // 12 properties per page

      try {
        const response = await apiRequest({
          url: `/api/properties/search?${queryParams.toString()}`,
          method: "GET",
          headers: {},
          body: null,
        });

        // Parse the response properly
        const data = response as unknown as {
          properties: Property[];
          total: number;
        };

        // If no properties found, try to fetch featured properties
        if (!data || !data.properties || data.properties.length === 0) {
          const featured = await apiRequest({
            url: "/api/properties/featured",
            method: "GET",
            headers: {},
            body: null,
          });

          // Convert array response to the expected format
          return {
            properties: (featured as unknown as Property[]) || [],
            total: (featured as unknown as Property[])?.length || 0,
          };
        }

        return data;
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to empty results
        return { properties: [], total: 0 };
      }
    },
  });

  // Update properties state when data changes
  useEffect(() => {
    if (searchResults) {
      setProperties((searchResults as any).properties || []);
      setTotalResults((searchResults as any).total || 0);
      setLoading(false);
    }
  }, [searchResults]);

  // Handle errors
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (!searchResults) {
      setLoading(false);
    }
  }, [isLoading, searchResults]);

  // Update URL params when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (filters.propertyType)
      newParams.set("propertyType", filters.propertyType);
    if (filters.forSaleOrRent)
      newParams.set("forSaleOrRent", filters.forSaleOrRent);
    if (filters.location) newParams.set("location", filters.location);
    if (filters.minPrice) newParams.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) newParams.set("maxPrice", String(filters.maxPrice));
    if (filters.minBedrooms)
      newParams.set("minBedrooms", String(filters.minBedrooms));
    if (filters.maxBedrooms)
      newParams.set("maxBedrooms", String(filters.maxBedrooms));
    if (filters.minBathrooms)
      newParams.set("minBathrooms", String(filters.minBathrooms));
    if (filters.maxBathrooms)
      newParams.set("maxBathrooms", String(filters.maxBathrooms));
    if (filters.amenities && filters.amenities.length > 0)
      newParams.set("amenities", filters.amenities.join(","));
    if (filters.minArea) newParams.set("minArea", String(filters.minArea));
    if (filters.maxArea) newParams.set("maxArea", String(filters.maxArea));
    if (filters.sortBy) newParams.set("sortBy", filters.sortBy);

    // Update URL without refreshing the page
    const newUrl = `/properties?${newParams.toString()}`;
    if (location !== newUrl) {
      setLocation(newUrl);
    }
  }, [filters, setLocation, location]);

  // Handle filter changes
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Apply price range filter
  const applyPriceRange = () => {
    updateFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  // Apply area range filter
  const applyAreaRange = () => {
    updateFilters({
      minArea: areaRange[0],
      maxArea: areaRange[1],
    });
  };

  // Handle amenity checkbox change
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || [];

    if (checked) {
      updateFilters({
        amenities: [...currentAmenities, amenity],
      });
    } else {
      updateFilters({
        amenities: currentAmenities.filter((a) => a !== amenity),
      });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      sortBy: "newest",
    });
    setPriceRange([0, 20000000]);
    setAreaRange([0, 10000]);
  };

  // Generate title based on filters
  const generateSearchTitle = () => {
    let title = "";

    if (filters.propertyType) {
      title += filters.propertyType + " ";
    } else {
      title += "Properties ";
    }

    if (filters.forSaleOrRent === "Sale") {
      title += "For Sale ";
    } else if (filters.forSaleOrRent === "Rent") {
      title += "For Rent ";
    }

    if (filters.location) {
      title += "in " + filters.location;
    }

    return title.trim() || "All Properties";
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate number of pages
  const totalPages = Math.ceil(totalResults / 12);

  // Generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          range.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          range.push(i);
        }
      }
    }

    return range;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Search Header */}
        <div className="bg-primary/10 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {generateSearchTitle()}
              </h1>

              <div className="mt-4 md:mt-0 flex items-center">
                <span className="text-gray-600 mr-4">
                  {loading
                    ? "Searching..."
                    : `${totalResults} properties found`}
                </span>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => updateFilters({ sortBy: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="area_low">Area: Low to High</SelectItem>
                    <SelectItem value="area_high">Area: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2 md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="grid grid-cols-4 gap-4 w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Location"
                    className="pl-10"
                    value={filters.location || ""}
                    onChange={(e) =>
                      updateFilters({ location: e.target.value })
                    }
                  />
                </div>

                <Select
                  value={filters.propertyType || ""}
                  onValueChange={(value) =>
                    updateFilters({ propertyType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All Types</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.forSaleOrRent || ""}
                  onValueChange={(value) =>
                    updateFilters({ forSaleOrRent: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Properties</SelectItem>
                    <SelectItem value="Sale">For Sale</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden md:block w-full md:w-64 shrink-0">
              <div className="bg-white rounded-lg border p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={["price", "bedrooms", "area", "amenities"]}
                >
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={priceRange}
                          min={0}
                          max={20000000}
                          step={100000}
                          value={priceRange}
                          onValueChange={(value) =>
                            setPriceRange(value as [number, number])
                          }
                          className="my-6"
                        />
                        <div className="flex items-center justify-between">
                          <div className="border rounded px-3 py-2 text-sm">
                            ₹{priceRange[0].toLocaleString()}
                          </div>
                          <div className="border rounded px-3 py-2 text-sm">
                            ₹{priceRange[1].toLocaleString()}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={applyPriceRange}
                        >
                          Apply
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bedrooms">
                    <AccordionTrigger>Bedrooms</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-5 gap-2">
                        <Button
                          variant={
                            filters.minBedrooms === undefined
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateFilters({
                              minBedrooms: undefined,
                              maxBedrooms: undefined,
                            })
                          }
                          className={
                            filters.minBedrooms === undefined
                              ? "bg-primary"
                              : ""
                          }
                        >
                          Any
                        </Button>
                        {[1, 2, 3, 4, "+5"].map((num, index) => (
                          <Button
                            key={num}
                            variant={
                              filters.minBedrooms === index + 1
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              if (num === "+5") {
                                updateFilters({
                                  minBedrooms: 5,
                                  maxBedrooms: undefined,
                                });
                              } else {
                                updateFilters({
                                  minBedrooms: index + 1,
                                  maxBedrooms: index + 1,
                                });
                              }
                            }}
                            className={
                              filters.minBedrooms === index + 1
                                ? "bg-primary"
                                : ""
                            }
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bathrooms">
                    <AccordionTrigger>Bathrooms</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-5 gap-2">
                        <Button
                          variant={
                            filters.minBathrooms === undefined
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateFilters({
                              minBathrooms: undefined,
                              maxBathrooms: undefined,
                            })
                          }
                          className={
                            filters.minBathrooms === undefined
                              ? "bg-primary"
                              : ""
                          }
                        >
                          Any
                        </Button>
                        {[1, 2, 3, 4, "+5"].map((num, index) => (
                          <Button
                            key={num}
                            variant={
                              filters.minBathrooms === index + 1
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              if (num === "+5") {
                                updateFilters({
                                  minBathrooms: 5,
                                  maxBathrooms: undefined,
                                });
                              } else {
                                updateFilters({
                                  minBathrooms: index + 1,
                                  maxBathrooms: index + 1,
                                });
                              }
                            }}
                            className={
                              filters.minBathrooms === index + 1
                                ? "bg-primary"
                                : ""
                            }
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="area">
                    <AccordionTrigger>Area (sq ft)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={areaRange}
                          min={0}
                          max={10000}
                          step={100}
                          value={areaRange}
                          onValueChange={(value) =>
                            setAreaRange(value as [number, number])
                          }
                          className="my-6"
                        />
                        <div className="flex items-center justify-between">
                          <div className="border rounded px-3 py-2 text-sm">
                            {areaRange[0].toLocaleString()} sq ft
                          </div>
                          <div className="border rounded px-3 py-2 text-sm">
                            {areaRange[1].toLocaleString()} sq ft
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={applyAreaRange}
                        >
                          Apply
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="amenities">
                    <AccordionTrigger>Amenities</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {[
                          "Parking",
                          "Garden",
                          "Swimming Pool",
                          "Gym",
                          "Security",
                          "Lift",
                          "Power Backup",
                          "Club House",
                        ].map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <Checkbox
                              id={`amenity-${amenity.toLowerCase().replace(" ", "-")}`}
                              checked={(filters.amenities || []).includes(
                                amenity,
                              )}
                              onCheckedChange={(checked) =>
                                handleAmenityChange(amenity, checked === true)
                              }
                            />
                            <label
                              htmlFor={`amenity-${amenity.toLowerCase().replace(" ", "-")}`}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Mobile Filters (Slide Down) */}
            {showFilters && (
              <div className="md:hidden w-full bg-white rounded-lg border p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      type="text"
                      placeholder="Enter location"
                      value={filters.location || ""}
                      onChange={(e) =>
                        updateFilters({ location: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Property Type
                      </label>
                      <Select
                        value={filters.propertyType || ""}
                        onValueChange={(value) =>
                          updateFilters({ propertyType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Property Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_types">All Types</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Property Status
                      </label>
                      <Select
                        value={filters.forSaleOrRent || ""}
                        onValueChange={(value) =>
                          updateFilters({ forSaleOrRent: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Property Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">
                            All Properties
                          </SelectItem>
                          <SelectItem value="Sale">For Sale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Price Range</label>
                      <span className="text-xs text-gray-500">
                        ₹{priceRange[0].toLocaleString()} - ₹
                        {priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={20000000}
                      step={100000}
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      className="my-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bedrooms</label>
                      <div className="flex space-x-1">
                        {["Any", "1", "2", "3", "4+"].map((num, index) => (
                          <Button
                            key={num}
                            variant={
                              (num === "Any" &&
                                filters.minBedrooms === undefined) ||
                              (num !== "Any" &&
                                filters.minBedrooms ===
                                  (num === "4+" ? 4 : Number(num)))
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={
                              (num === "Any" &&
                                filters.minBedrooms === undefined) ||
                              (num !== "Any" &&
                                filters.minBedrooms ===
                                  (num === "4+" ? 4 : Number(num)))
                                ? "bg-primary"
                                : ""
                            }
                            onClick={() => {
                              if (num === "Any") {
                                updateFilters({
                                  minBedrooms: undefined,
                                  maxBedrooms: undefined,
                                });
                              } else if (num === "4+") {
                                updateFilters({
                                  minBedrooms: 4,
                                  maxBedrooms: undefined,
                                });
                              } else {
                                updateFilters({
                                  minBedrooms: Number(num),
                                  maxBedrooms: Number(num),
                                });
                              }
                            }}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bathrooms</label>
                      <div className="flex space-x-1">
                        {["Any", "1", "2", "3+"].map((num, index) => (
                          <Button
                            key={num}
                            variant={
                              (num === "Any" &&
                                filters.minBathrooms === undefined) ||
                              (num !== "Any" &&
                                filters.minBathrooms ===
                                  (num === "3+" ? 3 : Number(num)))
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={
                              (num === "Any" &&
                                filters.minBathrooms === undefined) ||
                              (num !== "Any" &&
                                filters.minBathrooms ===
                                  (num === "3+" ? 3 : Number(num)))
                                ? "bg-primary"
                                : ""
                            }
                            onClick={() => {
                              if (num === "Any") {
                                updateFilters({
                                  minBathrooms: undefined,
                                  maxBathrooms: undefined,
                                });
                              } else if (num === "3+") {
                                updateFilters({
                                  minBathrooms: 3,
                                  maxBathrooms: undefined,
                                });
                              } else {
                                updateFilters({
                                  minBathrooms: Number(num),
                                  maxBathrooms: Number(num),
                                });
                              }
                            }}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="flex-1">
              {loading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 animate-pulse w-1/2 mb-4" />
                        <div className="h-5 bg-gray-200 animate-pulse w-1/3 mb-3" />
                        <div className="flex space-x-2">
                          <div className="h-8 bg-gray-200 animate-pulse w-12" />
                          <div className="h-8 bg-gray-200 animate-pulse w-12" />
                          <div className="h-8 bg-gray-200 animate-pulse w-12" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                // No results found
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search filters to find more properties
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                // Results grid
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-10">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => goToPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </Button>

                        {getPaginationRange().map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            onClick={() => goToPage(page)}
                            className={currentPage === page ? "bg-primary" : ""}
                          >
                            {page}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            goToPage(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
