import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Bed, Bath, Building2 } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
  isAiRecommended?: boolean | null;
}

export function PropertyCard({ property, isAiRecommended }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        <div className="relative h-48">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <div className="h-full w-full overflow-hidden">
              <img
                src={property.imageUrls[0]}
                alt={property.title}
                onClick={() => window.scrollTo(0, 0)}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback to placeholder on error
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                }}
              />
              {property.imageUrls.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                  +{property.imageUrls.length - 1} more photos
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Approval status badge - displays at the top center */}
          {property.approvalStatus && (
            <Badge
              variant="secondary"
              className={`absolute top-2 transform -translate-x-1/2 left-1/2 z-10 ${
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
            </Badge>
          )}

          {property.premium && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-amber-500 text-white"
            >
              Premium
            </Badge>
          )}

          {property.featured && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-blue-500 text-white"
            >
              Featured
            </Badge>
          )}

          {property.discountedPrice && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 bg-red-500 text-white"
            >
              {Math.round(
                (1 - property.discountedPrice / property.price) * 100,
              )}
              % Off
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">
              {property.title}
            </h3>
            <Badge variant="outline">{property.propertyType}</Badge>
          </div>

          <p className="text-gray-500 text-sm mb-3">{property.location}</p>

          <div className="flex items-center gap-4">
            {property.bedrooms && (
              <span className="text-sm flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="text-sm flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms} Baths
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-semibold flex items-center">
              <IndianRupee className="h-4 w-4" />
              {property.price.toLocaleString("en-IN")}
            </span>
            {isAiRecommended && (
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-800"
              >
                AI Recommended
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PropertyCard;
