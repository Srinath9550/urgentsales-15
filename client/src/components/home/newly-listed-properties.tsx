import { useState } from "react";
import { Link } from "wouter";
import {
  Building2,
  MapPin,
  Grid3X3,
  Grid2X2,
  ArrowRight,
  BedDouble,
  Bath,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define sample property data for demonstration
const dummyProperties = [
  {
    id: 1,
    title: "Modern 3BHK Apartment with City View",
    price: 8500000,
    urgentPrice: 7990000, // Added urgent price
    location: "Whitefield, Bangalore",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isNew: true,
    isFeatured: false,
    isPremium: true,
  },
  {
    id: 2,
    title: "Spacious 4BHK Villa with Garden",
    price: 15800000,
    urgentPrice: 14200000, // Added urgent price
    location: "Kormangala, Bangalore",
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isNew: true,
    isFeatured: true,
    isPremium: false,
  },
  {
    id: 3,
    title: "Cozy 2BHK Apartment Near Metro",
    price: 5500000,
    urgentPrice: 5150000, // Added urgent price
    location: "HSR Layout, Bangalore",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    image:
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isNew: true,
    isFeatured: false,
    isPremium: false,
  },
  {
    id: 4,
    title: "Premium 3BHK with Community Pool",
    price: 9200000,
    urgentPrice: 8750000, // Added urgent price
    location: "Indiranagar, Bangalore",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1650,
    image:
      "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isNew: true,
    isFeatured: true,
    isPremium: true,
  },
  {
    id: 5,
    title: "Office Space in Premium Business Park",
    price: 12500000,
    urgentPrice: 11800000, // Added urgent price
    location: "Electronic City, Bangalore",
    propertyType: "Commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 2200,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isNew: true,
    isFeatured: false,
    isPremium: true,
  },
  {
    id: 6,
    title: "Budget 1BHK for Investment",
    price: 3200000,
    urgentPrice: 2990000, // Added urgent price
    location: "Banashankari, Bangalore",
    propertyType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    isNew: true,
    isFeatured: false,
    isPremium: false,
  },
];

export default function NewlyListedProperties() {
  const [gridView, setGridView] = useState<"grid3" | "grid5">("grid3");

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Newly Listed Properties
            </h2>
            <p className="text-gray-600 mt-2">
              Discover the latest properties added to our marketplace
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setGridView("grid3")}
              className={cn(
                "p-2 rounded-md transition-colors",
                gridView === "grid3"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100",
              )}
              aria-label="Show 3 columns grid"
            >
              <Grid2X2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setGridView("grid5")}
              className={cn(
                "p-2 rounded-md transition-colors",
                gridView === "grid5"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100",
              )}
              aria-label="Show 5 columns grid"
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "grid gap-6",
            gridView === "grid3"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          )}
        >
          {dummyProperties.map((property) => (
            <Link key={property.id} href={`/property/${property.id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </span>
                    {property.isPremium && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  {property.isFeatured && (
                    <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{property.propertyType}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto mb-3">
                    {property.bedrooms !== null && (
                      <div className="flex items-center text-gray-700 text-sm">
                        <BedDouble className="h-4 w-4 mr-1" />
                        <span>
                          {property.bedrooms}{" "}
                          {property.bedrooms === 1 ? "Bed" : "Beds"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-700 text-sm">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>
                        {property.bathrooms}{" "}
                        {property.bathrooms === 1 ? "Bath" : "Baths"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area} sqft</span>
                    </div>
                  </div>

                  {/* Redesigned price display section with left/right positioning */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      {/* Left side - Actual Price */}
                      <div className="flex flex-col items-start">
                        <div className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-t-md">
                          ACTUAL PRICE
                        </div>
                        <div className="line-through text-sm text-gray-500 mt-1">
                          ₹{property.price.toLocaleString("en-IN")}
                        </div>
                      </div>

                      {/* Right side - Urgent Price */}
                      <div className="flex flex-col items-end">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-t-md shadow-sm">
                          URGENT PRICE
                        </div>
                        <div className="font-bold text-primary text-lg mt-1 flex items-center">
                          <span className="text-sm mr-0.5">₹</span>
                          <span>
                            {property.urgentPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Savings badge - centered */}
                    <div className="mt-2 text-center">
                      <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                        Save ₹
                        {(property.price - property.urgentPrice).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" className="group">
            <Link href="/properties" onClick={() => window.scrollTo(0, 0)}>
              <span>View All Properties</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
