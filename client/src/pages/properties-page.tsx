import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property, propertyTypes, propertyStatus } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PropertyCard from "@/components/property/property-card";
import PropertySearch from "@/components/property/property-search";
import { getQueryFn } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Home,
  Building2,
  Building,
  Warehouse,
  Trees,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  SquareStack,
  Grid2X2,
  Calendar,
  ShowerHead,
  Wifi,
  Car,
  UtensilsCrossed,
  AirVent,
  Droplets,
} from "lucide-react";

// Common amenities
const commonAmenities = [
  { id: "parking", label: "Parking", icon: <Car className="h-4 w-4" /> },
  {
    id: "ac",
    label: "Air Conditioning",
    icon: <AirVent className="h-4 w-4" />,
  },
  {
    id: "pool",
    label: "Swimming Pool",
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    id: "wifi",
    label: "High-Speed Internet",
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    id: "furnished",
    label: "Furnished",
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
  { id: "gym", label: "Gym", icon: <ShowerHead className="h-4 w-4" /> },
];

// Property type icons
const propertyTypeIcons: Record<string, React.ReactNode> = {
  apartment: <Building2 className="h-5 w-5" />,
  house: <Home className="h-5 w-5" />,
  villa: <Building className="h-5 w-5" />,
  plot: <Trees className="h-5 w-5" />,
  commercial: <Warehouse className="h-5 w-5" />,
  office: <Grid2X2 className="h-5 w-5" />,
  retail: <ShoppingBag className="h-5 w-5" />,
  warehouse: <Warehouse className="h-5 w-5" />,
  farmland: <Trees className="h-5 w-5" />,
};

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2h12l3 7H3l3-7Z" />
      <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
      <path d="M9 13v5" />
      <path d="M15 13v5" />
    </svg>
  );
}

export default function PropertiesPage() {
  const [locationPath] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryTab, setCategoryTab] = useState<string>("all");

  // Advanced filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]); // 0 to 1 Crore
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]); // 0 to 10,000 sq ft
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const [maxBedrooms, setMaxBedrooms] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  // Function to update URL with filter params without navigation
  const updateSearchParamsWithoutNavigate = () => {
    const newParams = new URLSearchParams(searchParams);

    // Set price range
    if (priceRange[0] > 0) {
      newParams.set("minPrice", priceRange[0].toString());
    } else {
      newParams.delete("minPrice");
    }

    if (priceRange[1] < 10000000) {
      newParams.set("maxPrice", priceRange[1].toString());
    } else {
      newParams.delete("maxPrice");
    }

    // Set area range
    if (areaRange[0] > 0) {
      newParams.set("minArea", areaRange[0].toString());
    } else {
      newParams.delete("minArea");
    }

    if (areaRange[1] < 10000) {
      newParams.set("maxArea", areaRange[1].toString());
    } else {
      newParams.delete("maxArea");
    }

    // Set bedrooms
    if (minBedrooms !== null) {
      newParams.set("minBedrooms", minBedrooms.toString());
    } else {
      newParams.delete("minBedrooms");
    }

    if (maxBedrooms !== null) {
      newParams.set("maxBedrooms", maxBedrooms.toString());
    } else {
      newParams.delete("maxBedrooms");
    }

    // Set category
    if (categoryTab !== "all") {
      if (categoryTab === "for_sale" || categoryTab === "for_rent") {
        newParams.set("rentOrSale", categoryTab);
        newParams.delete("status");
      } else {
        newParams.set("status", categoryTab);
        newParams.delete("rentOrSale");
      }
    } else {
      newParams.delete("rentOrSale");
      newParams.delete("status");
    }

    // Set amenities
    if (selectedAmenities.length > 0) {
      newParams.set("amenities", selectedAmenities.join(","));
    } else {
      newParams.delete("amenities");
    }

    setSearchParams(newParams);
    setFilterActive(true);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 10000000]);
    setAreaRange([0, 10000]);
    setMinBedrooms(null);
    setMaxBedrooms(null);
    setSelectedAmenities([]);
    setCategoryTab("all");

    // Remove filter params from URL
    const newParams = new URLSearchParams(searchParams);
    [
      "minPrice",
      "maxPrice",
      "minArea",
      "maxArea",
      "minBedrooms",
      "maxBedrooms",
      "rentOrSale",
      "status",
      "amenities",
    ].forEach((param) => {
      newParams.delete(param);
    });

    setSearchParams(newParams);
    setFilterActive(false);
  };

  // Parse URL parameters on component mount or location change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);

    // Initialize filter states from URL params
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    const minArea = params.get("minArea");
    const maxArea = params.get("maxArea");
    const minBedroomsParam = params.get("minBedrooms");
    const maxBedroomsParam = params.get("maxBedrooms");
    const rentOrSale = params.get("rentOrSale");
    const status = params.get("status");
    const amenitiesParam = params.get("amenities");

    // Set price range
    setPriceRange([
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : 10000000,
    ]);

    // Set area range
    setAreaRange([
      minArea ? parseInt(minArea) : 0,
      maxArea ? parseInt(maxArea) : 10000,
    ]);

    // Set bedrooms
    setMinBedrooms(minBedroomsParam ? parseInt(minBedroomsParam) : null);
    setMaxBedrooms(maxBedroomsParam ? parseInt(maxBedroomsParam) : null);

    // Set category tab
    if (rentOrSale) {
      setCategoryTab(rentOrSale);
    } else if (status) {
      setCategoryTab(status);
    } else {
      setCategoryTab("all");
    }

    // Set amenities
    if (amenitiesParam) {
      setSelectedAmenities(amenitiesParam.split(","));
    } else {
      setSelectedAmenities([]);
    }

    // Check if any filter is active
    setFilterActive(
      !!minPrice ||
        !!maxPrice ||
        !!minArea ||
        !!maxArea ||
        !!minBedroomsParam ||
        !!maxBedroomsParam ||
        !!rentOrSale ||
        !!status ||
        !!amenitiesParam,
    );
  }, [locationPath]);

  // Build query string for the API call
  const queryString = searchParams.toString();

  // Fetch properties based on search parameters
  const { data: propertiesResponse, isLoading } = useQuery<{
    properties: Property[];
  }>({
    queryKey: [`/api/properties/search?${queryString}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Extract properties array from response
  const properties = propertiesResponse?.properties;

  const sortProperties = (properties: Property[] | undefined) => {
    if (!properties || !Array.isArray(properties)) return [];

    return [...properties].sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt || new Date()).getTime() -
          new Date(a.createdAt || new Date()).getTime()
        );
      } else if (sortOrder === "oldest") {
        return (
          new Date(a.createdAt || new Date()).getTime() -
          new Date(b.createdAt || new Date()).getTime()
        );
      } else if (sortOrder === "price-high") {
        return b.price - a.price;
      } else if (sortOrder === "price-low") {
        return a.price - b.price;
      } else if (sortOrder === "area-high") {
        return b.area - a.area;
      } else if (sortOrder === "area-low") {
        return a.area - b.area;
      }
      return 0;
    });
  };

  const sortedProperties = sortProperties(properties);

  // Format price for display
  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  // Format area for display
  const formatArea = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k sq.ft.`;
    } else {
      return `${value} sq.ft.`;
    }
  };

  // Toggle amenity selection
  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId],
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Left sidebar for filters on larger screens */}
            <div className="hidden md:block sticky top-20 w-64 bg-white rounded-xl shadow-sm p-5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  disabled={!filterActive}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-5">
                <Accordion type="single" collapsible defaultValue="category">
                  <AccordionItem value="category">
                    <AccordionTrigger>Property Category</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant={
                              categoryTab === "all" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCategoryTab("all")}
                            className="justify-start"
                          >
                            All Properties
                          </Button>
                          <Button
                            variant={
                              categoryTab === "for_sale" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCategoryTab("for_sale")}
                            className="justify-start"
                          >
                            For Sale
                          </Button>

                          <Button
                            variant={
                              categoryTab === "premium" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCategoryTab("premium")}
                            className="justify-start"
                          >
                            Premium Properties
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="type">
                    <AccordionTrigger>Property Type</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-1 gap-2">
                          {propertyTypes.map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`type-${type}`}
                                checked={
                                  searchParams.get("propertyType") === type
                                }
                                onCheckedChange={(checked) => {
                                  const newParams = new URLSearchParams(
                                    searchParams,
                                  );
                                  if (checked) {
                                    newParams.set("propertyType", type);
                                  } else {
                                    newParams.delete("propertyType");
                                  }
                                  setSearchParams(newParams);
                                }}
                              />
                              <Label
                                htmlFor={`type-${type}`}
                                className="flex items-center"
                              >
                                {propertyTypeIcons[type] && (
                                  <span className="mr-2 text-gray-500">
                                    {propertyTypeIcons[type]}
                                  </span>
                                )}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-2">
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            max={10000000}
                            step={100000}
                            onValueChange={(values) =>
                              setPriceRange(values as [number, number])
                            }
                          />
                          <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bedrooms">
                    <AccordionTrigger>Bedrooms</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Min Bedrooms</Label>
                            <Select
                              value={minBedrooms?.toString() || ""}
                              onValueChange={(value) =>
                                setMinBedrooms(value ? parseInt(value) : null)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                                <SelectItem value="5">5+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Max Bedrooms</Label>
                            <Select
                              value={maxBedrooms?.toString() || ""}
                              onValueChange={(value) =>
                                setMaxBedrooms(value ? parseInt(value) : null)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="area">
                    <AccordionTrigger>Area (sq.ft.)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-2">
                        <div className="px-2">
                          <Slider
                            value={areaRange}
                            max={10000}
                            step={100}
                            onValueChange={(values) =>
                              setAreaRange(values as [number, number])
                            }
                          />
                          <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span>{formatArea(areaRange[0])}</span>
                            <span>{formatArea(areaRange[1])}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="amenities">
                    <AccordionTrigger>Amenities</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {commonAmenities.map((amenity) => (
                          <div
                            key={amenity.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`amenity-${amenity.id}`}
                              checked={selectedAmenities.includes(amenity.id)}
                              onCheckedChange={(checked) =>
                                toggleAmenity(amenity.id)
                              }
                            />
                            <Label
                              htmlFor={`amenity-${amenity.id}`}
                              className="flex items-center"
                            >
                              <span className="mr-2 text-gray-500">
                                {amenity.icon}
                              </span>
                              {amenity.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button
                  className="w-full mt-4"
                  onClick={updateSearchParamsWithoutNavigate}
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Find Your Dream Property
                  </h1>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => {
                    // Show mobile filters
                    // This would typically open a drawer or modal
                  }}
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <PropertySearch showAdvanced={false} />
              </div>

              {/* Categories Tabs - showing main property categories */}
              <div className="mb-6">
                <Tabs
                  value={categoryTab}
                  onValueChange={setCategoryTab}
                  className="w-full"
                >
                  <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
                    <TabsTrigger value="all">All Properties</TabsTrigger>
                    <TabsTrigger value="for_sale">For Sale</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Active filters display */}
              {filterActive && (
                <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Active Filters:
                  </span>

                  {searchParams.get("propertyType") && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {(searchParams.get("propertyType") || "")
                        .charAt(0)
                        .toUpperCase() +
                        (searchParams.get("propertyType") || "").slice(1)}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete("propertyType");
                          setSearchParams(newParams);
                        }}
                      />
                    </Badge>
                  )}

                  {searchParams.get("city") && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      {searchParams.get("city")}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete("city");
                          setSearchParams(newParams);
                        }}
                      />
                    </Badge>
                  )}

                  {(searchParams.get("minPrice") ||
                    searchParams.get("maxPrice")) && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Price:{" "}
                      {searchParams.get("minPrice")
                        ? formatPrice(
                            parseInt(searchParams.get("minPrice") || "0"),
                          )
                        : "₹0"}{" "}
                      -
                      {searchParams.get("maxPrice")
                        ? formatPrice(
                            parseInt(
                              searchParams.get("maxPrice") || "10000000",
                            ),
                          )
                        : "₹1 Cr"}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete("minPrice");
                          newParams.delete("maxPrice");
                          setSearchParams(newParams);
                          setPriceRange([0, 10000000]);
                        }}
                      />
                    </Badge>
                  )}

                  {(searchParams.get("minBedrooms") ||
                    searchParams.get("maxBedrooms")) && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Bed className="h-3 w-3" />
                      {searchParams.get("minBedrooms")
                        ? `${searchParams.get("minBedrooms")}+`
                        : "Any"}
                      {searchParams.get("maxBedrooms")
                        ? ` to ${searchParams.get("maxBedrooms")}`
                        : ""}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete("minBedrooms");
                          newParams.delete("maxBedrooms");
                          setSearchParams(newParams);
                          setMinBedrooms(null);
                          setMaxBedrooms(null);
                        }}
                      />
                    </Badge>
                  )}

                  {(searchParams.get("minArea") ||
                    searchParams.get("maxArea")) && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <SquareStack className="h-3 w-3" />
                      {searchParams.get("minArea")
                        ? formatArea(
                            parseInt(searchParams.get("minArea") || "0"),
                          )
                        : "0"}{" "}
                      -
                      {searchParams.get("maxArea")
                        ? formatArea(
                            parseInt(searchParams.get("maxArea") || "10000"),
                          )
                        : "10k sq.ft"}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete("minArea");
                          newParams.delete("maxArea");
                          setSearchParams(newParams);
                          setAreaRange([0, 10000]);
                        }}
                      />
                    </Badge>
                  )}

                  {selectedAmenities.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Amenities: {selectedAmenities.length}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete("amenities");
                          setSearchParams(newParams);
                          setSelectedAmenities([]);
                        }}
                      />
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="ml-auto text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Results with sorting and view options */}
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {isLoading ? (
                        <Skeleton className="h-7 w-32" />
                      ) : (
                        `${sortedProperties.length} Properties Found`
                      )}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-1 md:flex-none">
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="price-high">
                            Price (High to Low)
                          </SelectItem>
                          <SelectItem value="price-low">
                            Price (Low to High)
                          </SelectItem>
                          <SelectItem value="area-high">
                            Area (High to Low)
                          </SelectItem>
                          <SelectItem value="area-low">
                            Area (Low to High)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-r-none"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid2X2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-l-none"
                        onClick={() => setViewMode("list")}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div
                    className={`grid grid-cols-1 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-6`}
                  >
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                        >
                          <div className="relative pb-[60%]">
                            <Skeleton className="absolute inset-0 h-full w-full" />
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <Skeleton className="h-6 w-40" />
                              <Skeleton className="h-6 w-20" />
                            </div>
                            <Skeleton className="h-4 w-32 mb-3" />
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-4">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                              </div>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : sortedProperties.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedProperties.map((property) => (
                        <div
                          key={property.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col md:flex-row"
                        >
                          <div className="relative md:w-72 h-48 md:h-auto">
                            {property.imageUrls &&
                            property.imageUrls.length > 0 ? (
                              <img
                                src={property.imageUrls[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-gray-400" />
                              </div>
                            )}

                            {property.approvalStatus && (
                              <span
                                className={`absolute top-2 transform -translate-x-1/2 left-1/2 z-10 text-xs font-medium px-2 py-1 rounded ${
                                  property.approvalStatus === "approved"
                                    ? "bg-green-500 text-white"
                                    : property.approvalStatus === "pending"
                                      ? "bg-yellow-500 text-white"
                                      : "bg-red-500 text-white"
                                }`}
                              >
                                {property.approvalStatus === "approved"
                                  ? "✓ Approved"
                                  : property.approvalStatus === "pending"
                                    ? "Pending"
                                    : "Rejected"}
                              </span>
                            )}

                            {property.premium && (
                              <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded">
                                Premium
                              </span>
                            )}

                            {property.featured && (
                              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>

                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">
                                  {property.title}
                                </h3>
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {property.city}, {property.address}
                                </div>
                              </div>
                              <div className="text-lg font-bold text-primary">
                                {formatPrice(property.price)}
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {property.description}
                            </p>

                            <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                              {property.bedrooms && (
                                <div className="flex items-center">
                                  <Bed className="h-4 w-4 mr-1" />
                                  {property.bedrooms} Beds
                                </div>
                              )}

                              {property.bathrooms && (
                                <div className="flex items-center">
                                  <Bath className="h-4 w-4 mr-1" />
                                  {property.bathrooms} Baths
                                </div>
                              )}

                              <div className="flex items-center">
                                <SquareStack className="h-4 w-4 mr-1" />
                                {property.area} sq.ft
                              </div>

                              {property.yearBuilt && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Built {property.yearBuilt}
                                </div>
                              )}
                            </div>

                            {property.amenities &&
                              property.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {property.amenities
                                    .slice(0, 3)
                                    .map((amenity) => (
                                      <Badge
                                        key={amenity}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {amenity}
                                      </Badge>
                                    ))}
                                  {property.amenities.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{property.amenities.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <Badge variant="default">{"For Sale"}</Badge>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  (window.location.href = `/properties/${property.id}`)
                                }
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full text-gray-500">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No Properties Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search filters for more results.
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
