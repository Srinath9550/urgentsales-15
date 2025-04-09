import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  X,
  Zap,
  Building,
  ShieldCheck,
  Droplets,
  ParkingSquare,
  Waves,
  Dumbbell,
  Landmark,
  TreePine,
  Wifi,
  Utensils,
  Building2,
  LandPlot,
  Hotel,
  Warehouse,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface PropertySearchProps {
  className?: string;
  showAdvanced?: boolean;
}

const propertyTypes = [
  "apartment",
  "villa",
  "independent-house",
  "plot",
  "commercial-office",
  "shop",
  "warehouse",
  "land",
] as const;

const bedroomOptions = [
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5", label: "5 Bedrooms" },
  { value: "6+", label: "6+ Bedrooms" },
];

const bathroomOptions = [
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "4+", label: "4+ Bathrooms" },
];

const furnishedStatusOptions = [
  { value: "furnished", label: "Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
];

const facingOptions = [
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "north-east", label: "North-East" },
  { value: "north-west", label: "North-West" },
  { value: "south-east", label: "South-East" },
  { value: "south-west", label: "South-West" },
];

const constructionAgeOptions = [
  { value: "new", label: "New Construction" },
  { value: "less-than-5", label: "Less than 5 Years" },
  { value: "5-to-10", label: "5 to 10 Years" },
  { value: "greater-than-10", label: "Greater than 10 Years" },
];

const amenitiesOptions = [
  {
    value: "power-backup",
    label: "Power Backup",
    icon: <Zap className="h-4 w-4" />,
  },
  { value: "lift", label: "Lift", icon: <Building className="h-4 w-4" /> },
  {
    value: "security",
    label: "24/7 Security",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    value: "water-supply",
    label: "24/7 Water Supply",
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    value: "parking",
    label: "Parking",
    icon: <ParkingSquare className="h-4 w-4" />,
  },
  {
    value: "swimming-pool",
    label: "Swimming Pool",
    icon: <Waves className="h-4 w-4" />,
  },
  { value: "gym", label: "Gym", icon: <Dumbbell className="h-4 w-4" /> },
  {
    value: "club-house",
    label: "Club House",
    icon: <Landmark className="h-4 w-4" />,
  },
  {
    value: "play-area",
    label: "Play Area",
    icon: <Landmark className="h-4 w-4" />,
  },
  {
    value: "garden",
    label: "Garden/Park",
    icon: <TreePine className="h-4 w-4" />,
  },
  { value: "wifi", label: "Wi-Fi", icon: <Wifi className="h-4 w-4" /> },
  {
    value: "modular-kitchen",
    label: "Modular Kitchen",
    icon: <Utensils className="h-4 w-4" />,
  },
];

export default function PropertySearch({
  className = "",
  showAdvanced = false,
}: PropertySearchProps) {
  const [locationValue, setLocationValue] = useState("");
  const [propertyType, setPropertyType] = useState<
    (typeof propertyTypes)[number] | ""
  >("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [saleType, setSaleType] = useState<"all" | "Sale" | "Agent">("all");
  const [searchTab, setSearchTab] = useState<
    "residential" | "commercial" | "land"
  >("residential");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [areaRange, setAreaRange] = useState([0, 10000]);
  const [areaUnit, setAreaUnit] = useState<"sqft" | "sqyd" | "acres" | "gunta">(
    "sqft",
  );
  const [amenities, setAmenities] = useState<string[]>([]);
  const [furnishedStatus, setFurnishedStatus] = useState("");
  const [facing, setFacing] = useState("");
  const [constructionAge, setConstructionAge] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [_, setUrlLocation] = useLocation();
  const [searchInputValue, setSearchInputValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const formatPrice = useCallback((value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  }, []);

  const getDisplayString = useCallback(() => {
    const parts = [];

    if (locationValue) parts.push(locationValue);
    if (propertyType) parts.push(propertyType);
    if (saleType !== "all") {
      parts.push(
        saleType === "Sale"
          ? "For Sale"
          : saleType === "Agent"
            ? "For Agent"
            : "",
      );
    }
    if (bedrooms > 0) parts.push(`${bedrooms}+ beds`);
    if (bathrooms) parts.push(`${bathrooms} bath`);
    if (furnishedStatus) parts.push(furnishedStatus);
    if (facing) parts.push(`Facing ${facing}`);
    if (constructionAge) {
      const ageLabel = constructionAgeOptions.find(
        (o) => o.value === constructionAge,
      )?.label;
      if (ageLabel) parts.push(ageLabel);
    }
    if (urgentOnly) parts.push("Urgent Sale");
    if (areaRange[0] > 0 || areaRange[1] < 10000) {
      parts.push(`${areaRange[0]}-${areaRange[1]} ${areaUnit}`);
    }
    if (minPrice > 0 || maxPrice < 10000000) {
      parts.push(`${formatPrice(minPrice)}-${formatPrice(maxPrice)}`);
    }

    return parts.join(", ");
  }, [
    locationValue,
    propertyType,
    saleType,
    bedrooms,
    bathrooms,
    furnishedStatus,
    facing,
    constructionAge,
    urgentOnly,
    areaRange,
    areaUnit,
    minPrice,
    maxPrice,
    formatPrice,
  ]);

  useEffect(() => {
    if (!isManualEdit) {
      setSearchInputValue(getDisplayString());
    }
  }, [getDisplayString, isManualEdit]);

  const generateSuggestions = useCallback((input: string) => {
    if (input.length < 1) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    // Andhra Pradesh and Telangana cities, towns, and villages
const locations = [
  // Andhra Pradesh
  "Vijayawada", "Visakhapatnam", "Guntur", "Nellore", "Kurnool", "Tirupati", 
  "Rajahmundry", "Kakinada", "Anantapur", "Kadapa", "Eluru", "Ongole", 
  "Srikakulam", "Chittoor", "Machilipatnam", "Tenali", "Adoni", "Hindupur",
  "Bhimavaram", "Madanapalle", "Proddatur", "Nandyal", "Tadepalligudem", 
  "Gudivada", "Dharmavaram", "Narasaraopet", "Tadpatri", "Chilakaluripeta",
  // Telangana
  "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam",
  "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Jagtial",
  "Siddipet", "Sangareddy", "Kamareddy", "Wanaparthy", "Gadwal", "Vikarabad",
  "Mancherial", "Bhadrachalam", "Tandur", "Kothagudem", "Medak", "Peddapalli",
  // Villages/Towns (sample)
  "Kondapur", "Gachibowli", "Madhapur", "Banjara Hills", "Jubilee Hills",
  "Amaravathi", "Ponnur", "Mangalagiri", "Sattenapalle", "Puttaparthi",
];
    const propertySuggestions = propertyTypes.map(
      (type) => type.charAt(0).toUpperCase() + type.slice(1),
    );
    const filterSuggestions = [
      "For Sale",
      "For Agent",
      "Urgent Sale",
      "3+ Bedrooms",
      "2 Bathrooms",
      "Furnished",
      "New Construction",
      "Facing North",
    ];

    const lowerInput = input.toLowerCase();
    const filteredSuggestions = [
      ...locations.map((loc) => `${loc}`).filter((loc) =>
        loc.toLowerCase().includes(lowerInput),
      ),
      ...propertySuggestions.map((prop) => `${prop}`).filter((prop) =>
        prop.toLowerCase().includes(lowerInput),
      ),
      ...filterSuggestions.filter((filter) =>
        filter.toLowerCase().includes(lowerInput),
      ),
    ].slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  }, []);

  const parseInputString = (input: string) => {
    if (input === "") {
      resetFilters();
      return;
    }

    const parts = input.split(",").map((part) => part.trim());
    let newLocation = "";
    let newPropertyType = propertyType;
    let newSaleType = saleType;
    let newBedrooms = bedrooms;
    let newBathrooms = bathrooms;
    let newFurnishedStatus = furnishedStatus;
    let newFacing = facing;
    let newConstructionAge = constructionAge;
    let newUrgentOnly = urgentOnly;
    let newMinPrice = minPrice;
    let newMaxPrice = maxPrice;
    let newAreaRange = [...areaRange];
    let newAreaUnit = areaUnit;
    let newAmenities = [...amenities];

    parts.forEach((part) => {
      const matchedPropertyType = propertyTypes.find((type) =>
        part.toLowerCase().includes(type.toLowerCase()),
      );
      if (matchedPropertyType) {
        newPropertyType = matchedPropertyType;
        return;
      }

      if (part.match(/for\s+(sale|agent)/i)) {
        const typeMatch = part.match(/sale|agent/i);
        if (typeMatch) {
          const type = typeMatch[0].toLowerCase();
          newSaleType = type === "sale" ? "Sale" : "Agent";
        }
        return;
      }

      const bedroomMatch = part.match(
        /(\d+)\s*\+?\s*(bed|beds|bedroom|bedrooms)/i,
      );
      if (bedroomMatch) {
        newBedrooms = parseInt(bedroomMatch[1]);
        return;
      }

      const bathroomMatch = part.match(
        /(\d+)\s*\+?\s*(bath|baths|bathroom|bathrooms)/i,
      );
      if (bathroomMatch) {
        newBathrooms = bathroomMatch[1];
        return;
      }

      const furnishedMatch = part.match(
        /(furnished|unfurnished|semi-furnished)/i,
      );
      if (furnishedMatch) {
        newFurnishedStatus = furnishedMatch[0].toLowerCase();
        return;
      }

      const facingMatch = facingOptions.find((option) =>
        part.toLowerCase().includes(option.value.toLowerCase()),
      );
      if (facingMatch) {
        newFacing = facingMatch.value;
        return;
      }

      const ageMatch = constructionAgeOptions.find(
        (option) =>
          part.toLowerCase().includes(option.value.toLowerCase()) ||
          part.toLowerCase().includes(option.label.toLowerCase()),
      );
      if (ageMatch) {
        newConstructionAge = ageMatch.value;
        return;
      }

      if (part.match(/urgent/i)) {
        newUrgentOnly = true;
        return;
      }

      const priceMatch = part.match(
        /₹(\d+(?:,\d+)*(?:\.\d+)?\s*(?:lac|cr)?)\s*-\s*₹(\d+(?:,\d+)*(?:\.\d+)?\s*(?:lac|cr)?)/i,
      );
      if (priceMatch) {
        const parsePrice = (priceStr: string) => {
          if (priceStr.toLowerCase().includes("cr")) {
            return Math.round(parseFloat(priceStr) * 10000000);
          } else if (priceStr.toLowerCase().includes("lac")) {
            return Math.round(parseFloat(priceStr) * 100000);
          }
          return parseInt(priceStr.replace(/,/g, ""));
        };

        newMinPrice = parsePrice(priceMatch[1]);
        newMaxPrice = parsePrice(priceMatch[2]);
        return;
      }

      const areaMatch = part.match(
        /(\d+)\s*-\s*(\d+)\s*(sqft|sqyd|acres|gunta)/i,
      );
      if (areaMatch) {
        newAreaRange = [parseInt(areaMatch[1]), parseInt(areaMatch[2])];
        newAreaUnit = areaMatch[3].toLowerCase() as any;
        return;
      }

      if (!newLocation && part) {
        newLocation = part;
      }
    });

    setLocationValue(newLocation);
    setPropertyType(newPropertyType);
    setSaleType(newSaleType);
    setBedrooms(newBedrooms);
    setBathrooms(newBathrooms);
    setFurnishedStatus(newFurnishedStatus);
    setFacing(newFacing);
    setConstructionAge(newConstructionAge);
    setUrgentOnly(newUrgentOnly);
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setAreaRange(newAreaRange);
    setAreaUnit(newAreaUnit);
    setAmenities(newAmenities);
    setIsManualEdit(false);
    setShowSuggestions(false);
  };

  const resetFilters = () => {
    setLocationValue("");
    setPropertyType("");
    setMinPrice(0);
    setMaxPrice(10000000);
    setBedrooms(0);
    setBathrooms("");
    setSaleType("all");
    setSearchTab("residential");
    setAreaRange([0, 10000]);
    setAreaUnit("sqft");
    setAmenities([]);
    setFurnishedStatus("");
    setFacing("");
    setConstructionAge("");
    setUrgentOnly(false);
    setSearchInputValue("");
    setIsManualEdit(false);
    setShowSuggestions(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isSelectDropdown =
        (event.target as Element).closest('[role="combobox"]') ||
        (event.target as Element).closest('[role="option"]') ||
        (event.target as Element).closest(".select-content");

      if (isSelectDropdown) {
        return;
      }

      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[data-filter-toggle="true"]') &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isFilterOpen) {
        handleSearch();
        setIsFilterOpen(false);
      } else if (e.key === "Escape" && (isFilterOpen || showSuggestions)) {
        setIsFilterOpen(false);
        setShowSuggestions(false);
      } else if (
        e.key === "Delete" &&
        document.activeElement?.tagName === "INPUT"
      ) {
        const activeElement = document.activeElement as HTMLInputElement;
        if (activeElement.value === "") {
          const name = activeElement.name;
          switch (name) {
            case "minPrice":
              setMinPrice(0);
              break;
            case "maxPrice":
              setMaxPrice(10000000);
              break;
            case "minArea":
              setAreaRange([0, areaRange[1]]);
              break;
            case "maxArea":
              setAreaRange([areaRange[0], 10000]);
              break;
            default:
              break;
          }
        }
      } else if (
        e.key === "ArrowDown" &&
        showSuggestions &&
        suggestions.length > 0
      ) {
        e.preventDefault();
        const suggestionElements = suggestionsRef.current?.querySelectorAll('button');
        if (suggestionElements && suggestionElements.length > 0) {
          (suggestionElements[0] as HTMLElement).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen, showSuggestions, suggestions, areaRange]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          if (response.ok) {
            const data = await response.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.state;

            if (city) {
              setLocationValue(city);
            } else {
              setLocationValue(
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              );
            }
          } else {
            setLocationValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error("Error getting location:", error);
          alert("Unable to fetch your location details");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocationLoading(false);
        alert(
          "Unable to get your location. Please enable location services and try again.",
        );
      },
    );
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (locationValue) {
      queryParams.append("city", locationValue);
    }

    if (propertyType) {
      queryParams.append("propertyType", propertyType);
    }

    if (saleType !== "all") {
      queryParams.append("saleType", saleType);
    }

    if (searchTab) {
      queryParams.append("category", searchTab);
    }

    if (minPrice > 0) {
      queryParams.append("minPrice", minPrice.toString());
    }

    if (maxPrice < 10000000) {
      queryParams.append("maxPrice", maxPrice.toString());
    }

    if (areaRange[0] > 0) {
      queryParams.append("minArea", areaRange[0].toString());
    }
    if (areaRange[1] < 10000) {
      queryParams.append("maxArea", areaRange[1].toString());
    }
    if (areaUnit !== "sqft") {
      queryParams.append("areaUnit", areaUnit);
    }

    if (bedrooms > 0) {
      queryParams.append("minBedrooms", bedrooms.toString());
    }

    if (bathrooms) {
      queryParams.append("bathrooms", bathrooms);
    }

    if (furnishedStatus) {
      queryParams.append("furnishedStatus", furnishedStatus);
    }

    if (facing) {
      queryParams.append("facing", facing);
    }

    if (constructionAge) {
      queryParams.append("constructionAge", constructionAge);
    }

    if (urgentOnly) {
      queryParams.append("urgentOnly", "true");
    }

    if (amenities.length > 0) {
      queryParams.append("amenities", amenities.join(","));
    }

    queryParams.append("includeFree", "true");

    setUrlLocation(`/properties?${queryParams.toString()}`);
    setIsManualEdit(false);
    setShowSuggestions(false);
  };

  const redirectToFilter = (filterType: string) => {
    const queryParams = new URLSearchParams();

    switch (filterType) {
      case "luxury":
        queryParams.append("minPrice", "10000000");
        queryParams.append("propertyType", "villa");
        queryParams.append("category", "residential");
        queryParams.append(
          "amenities",
          "swimming-pool,gym,club-house,security",
        );
        break;

      case "apartments":
        queryParams.append("propertyType", "apartment");
        queryParams.append("category", "residential");
        queryParams.append("saleType", "Sale");
        break;

      case "villas":
        queryParams.append("propertyType", "villa");
        queryParams.append("category", "residential");
        break;

      case "plots":
        queryParams.append("category", "land");
        break;

      case "commercial":
        queryParams.append("category", "commercial");
        break;

      case "new-constructions":
        queryParams.append("constructionAge", "new");
        break;

      case "urgent-sale":
        queryParams.append("urgentOnly", "true");
        break;

      case "family-homes":
        queryParams.append("minBedrooms", "3");
        queryParams.append("amenities", "play-area,garden,security");
        queryParams.append("category", "residential");
        break;

      case "upcoming":
        queryParams.append("projectStatus", "upcoming");
        queryParams.append("constructionAge", "new");
        queryParams.append("possessionDate", "future");
        queryParams.append("sortBy", "possessionDate");
        queryParams.append("includeFree", "true");
        break;

      default:
        break;
    }

    queryParams.append("includeFree", "true");
    setUrlLocation(`/properties?${queryParams.toString()}`);
    setIsManualEdit(false);
    setShowSuggestions(false);
  };

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-xl shadow-lg p-2 sm:p-4 max-w-4xl mx-auto ${className} relative`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={[
                    "Enter location, property type, filters...",
                    "Search in Hyderabad...",
                    "Search in Vijayawada...",
                    "Search in Vizag...",
                    "Search in Warangal...",
                    "Search Apartments for Sale...",
                    "Search Villas with 3+ beds...",
                    "Search Commercial Properties...",
                  ][Math.floor((Date.now() / 2000) % 8)]}
                  className="pl-10 pr-4 py-4 sm:py-6 text-gray-700 bg-gray-50 rounded-r-none text-sm sm:text-base"
                  value={searchInputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInputValue(value);
                    setIsManualEdit(true);
                    generateSuggestions(value);
                  }}
                  onFocus={() => {
                    if (searchInputValue.length >= 2) {
                      generateSuggestions(searchInputValue);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      parseInputString(e.currentTarget.value);
                      handleSearch();
                      setShowSuggestions(false);
                    } else if (e.key === "Escape") {
                      setShowSuggestions(false);
                    } else if (
                      e.key === "ArrowDown" &&
                      showSuggestions &&
                      suggestions.length > 0
                    ) {
                      e.preventDefault();
                      const suggestionElements =
                        suggestionsRef.current?.querySelectorAll("button");
                      if (suggestionElements && suggestionElements.length > 0) {
                        (suggestionElements[0] as HTMLElement).focus();
                      }
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (
                        !suggestionsRef.current?.contains(document.activeElement)
                      ) {
                        setShowSuggestions(false);
                        if (isManualEdit) {
                          parseInputString(searchInputValue);
                        }
                      }
                    }, 200);
                  }}
                />
                <Button
                  variant="outline"
                  className="rounded-l-none border-l-0 px-2 sm:px-3 py-4 sm:py-6 bg-gray-50 hover:bg-gray-100"
                  onClick={getUserLocation}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? (
                    <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary border-t-transparent rounded-full mr-0"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="8"></circle>
                      <line x1="12" y1="2" x2="12" y2="4"></line>
                      <line x1="12" y1="20" x2="12" y2="22"></line>
                      <line x1="2" y1="12" x2="4" y2="12"></line>
                      <line x1="20" y1="12" x2="22" y2="12"></line>
                    </svg>
                  )}
                </Button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg top-full mt-1 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-200 border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchInputValue(suggestion);
                        setShowSuggestions(false);
                        parseInputString(suggestion);
                        setIsManualEdit(false);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row space-x-2">
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              className={`min-w-[40px] sm:min-w-[50px] py-4 sm:py-6 relative ${
                isFilterOpen ? "bg-primary text-white" : ""
              }`}
              onClick={toggleFilter}
              data-filter-toggle="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:mr-2"
              >
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              <span className="hidden sm:inline">Filters</span>
            </Button>

            <div className="relative min-w-[100px] sm:min-w-[130px]">
              <Select
                value={propertyType}
                onValueChange={(value: (typeof propertyTypes)[number]) => {
                  setPropertyType(value);
                  setIsManualEdit(false);
                }}
              >
                <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-700 h-10 sm:h-12 text-xs sm:text-sm">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="
                py-2 sm:py-4 md:py-6 
                px-3 sm:px-3 md:px-4 
                whitespace-nowrap 
                flex items-center justify-center 
                bg-blue-800 hover:bg-blue-700 
                text-white
                rounded-full sm:rounded-lg
                transition-all duration-200
                min-w-[40px] min-h-[40px] sm:min-w-[60px] md:min-w-[80px]
                shadow-md hover:shadow-lg
                active:scale-95
              "
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline ml-1 sm:ml-2">Search</span>
            </Button>
          </div>
        </div>

        <div className="mt-2 sm:mt-4 grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-1 sm:gap-2 px-1 sm:px-2">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center bg-amber-50"
            onClick={() => redirectToFilter("urgent-sale")}
          >
            <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">
              Urgent Sale
            </span>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center"
            onClick={() => redirectToFilter("apartments")}
          >
            <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">
              Apartments
            </span>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center"
            onClick={() => redirectToFilter("villas")}
          >
            <Building className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">Villas</span>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center"
            onClick={() => redirectToFilter("plots")}
          >
            <LandPlot className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">
              Land/Plots
            </span>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center"
            onClick={() => redirectToFilter("commercial")}
          >
            <Building className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">
              Commercial
            </span>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center"
            onClick={() => redirectToFilter("luxury")}
          >
            <Hotel className="h-4 w-4 sm:h-6 sm:w-6 text-red-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">Luxury</span>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center"
            onClick={() => redirectToFilter("new-launch")}
          >
            <Warehouse className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">
              New Launch
            </span>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow p-1 sm:p-3 text-center flex flex-col items-center bg-blue-50"
            onClick={() => redirectToFilter("upcoming")}
          >
            <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 mb-0 sm:mb-1" />
            <span className="text-[10px] sm:text-xs font-medium">Upcoming</span>
          </Card>
        </div>
      </div>

      {isFilterOpen && (
        <div
          ref={filterMenuRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-3 sm:p-5 z-50 transition-all duration-200 ease-in-out overflow-y-auto max-h-[80vh] sm:max-h-[70vh]"
          style={{
            opacity: 1,
            transform: "translateY(0)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tabs
            value={searchTab}
            onValueChange={(value) =>
              setSearchTab(value as "residential" | "commercial" | "land")
            }
            className="mb-4 sm:mb-6"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="residential" className="text-xs sm:text-sm">
                Residential
              </TabsTrigger>
              <TabsTrigger value="commercial" className="text-xs sm:text-sm">
                Commercial
              </TabsTrigger>
              <TabsTrigger value="land" className="text-xs sm:text-sm">
                Land / Plot
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Transaction Type
              </h4>
              <Select
                value={saleType}
                onValueChange={(value: "all" | "Sale" | "Agent") => {
                  setSaleType(value);
                  setIsManualEdit(false);
                }}
              >
                <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Agent">For Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice || ""}
                  onChange={(e) => {
                    setMinPrice(Number(e.target.value) || 0);
                    setIsManualEdit(false);
                  }}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                  name="minPrice"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice || ""}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value) || 10000000);
                    setIsManualEdit(false);
                  }}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                  name="maxPrice"
                />
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Area Range
              </h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={areaRange[0] || ""}
                  onChange={(e) => {
                    setAreaRange([Number(e.target.value) || 0, areaRange[1]]);
                    setIsManualEdit(false);
                  }}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                  name="minArea"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={areaRange[1] || ""}
                  onChange={(e) => {
                    setAreaRange([areaRange[0], Number(e.target.value) || 10000]);
                    setIsManualEdit(false);
                  }}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                  name="maxArea"
                />
              </div>
              <div className="flex justify-between mt-1">
                <Select
                  value={areaUnit}
                  onValueChange={(
                    value: "sqft" | "sqyd" | "acres" | "gunta",
                  ) => {
                    setAreaUnit(value);
                    setIsManualEdit(false);
                  }}
                >
                  <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-[10px] sm:text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">sq.ft</SelectItem>
                    <SelectItem value="sqyd">sq.yd</SelectItem>
                    <SelectItem value="acres">acres</SelectItem>
                    <SelectItem value="gunta">gunta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Bedrooms
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                {bedroomOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      bedrooms.toString() === option.value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-[10px] sm:text-xs px-1 sm:px-2 py-0 sm:py-1 h-7 sm:h-8"
                    onClick={() => {
                      setBedrooms(parseInt(option.value));
                      setIsManualEdit(false);
                    }}
                  >
                    {option.value}
                  </Button>
                ))}
              </div>
            </div>

            {searchTab === "residential" && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                  Bathrooms
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {bathroomOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        bathrooms === option.value ? "default" : "outline"
                      }
                      size="sm"
                      className="text-[10px] sm:text-xs px-1 sm:px-2 py-0 sm:py-1 h-7 sm:h-8"
                      onClick={() => {
                        setBathrooms(option.value);
                        setIsManualEdit(false);
                      }}
                    >
                      {option.value}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {(searchTab === "residential" || searchTab === "commercial") && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                  Furnished Status
                </h4>
                <div className="grid grid-cols-3 gap-1">
                  {furnishedStatusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        furnishedStatus === option.value ? "default" : "outline"
                      }
                      size="sm"
                      className="text-[10px] sm:text-xs px-1 sm:px-2 py-0 sm:py-1 h-7 sm:h-8"
                      onClick={() => {
                        setFurnishedStatus(option.value);
                        setIsManualEdit(false);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Construction Age
              </h4>
              <Select
                value={constructionAge}
                onValueChange={(value) => {
                  setConstructionAge(value);
                  setIsManualEdit(false);
                }}
              >
                <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {constructionAgeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Facing
              </h4>
              <Select
                value={facing}
                onValueChange={(value) => {
                  setFacing(value);
                  setIsManualEdit(false);
                }}
              >
                <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {facingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm text-gray-700">
                Listing Type
              </h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent-sale"
                  checked={urgentOnly}
                  onCheckedChange={(checked) => {
                    setUrgentOnly(checked === true);
                    setIsManualEdit(false);
                  }}
                />
                <Label
                  htmlFor="urgent-sale"
                  className="text-xs sm:text-sm font-medium cursor-pointer"
                >
                  Urgent Sale Only
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <h4 className="font-medium text-xs sm:text-sm text-gray-700 mb-2">
              Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {amenitiesOptions.map((amenity) => (
                <div
                  key={amenity.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`amenity-${amenity.value}`}
                    checked={amenities.includes(amenity.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAmenities([...amenities, amenity.value]);
                      } else {
                        setAmenities(
                          amenities.filter((a) => a !== amenity.value),
                        );
                      }
                      setIsManualEdit(false);
                    }}
                  />
                  <Label
                    htmlFor={`amenity-${amenity.value}`}
                    className="text-xs sm:text-sm font-medium cursor-pointer flex items-center"
                  >
                    {amenity.icon}
                    <span className="ml-1">{amenity.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9 sm:h-10"
            >
              Reset Filters
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(false)}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9 sm:h-10"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                Close
              </Button>
              <Button
                className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 text-xs sm:text-sm h-9 sm:h-10"
                onClick={() => {
                  handleSearch();
                  setIsFilterOpen(false);
                }}
              >
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}