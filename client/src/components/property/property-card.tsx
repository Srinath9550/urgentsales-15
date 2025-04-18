import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Bed, Bath, Building2 } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
// Import the image utility functions
import { formatImageUrl, formatImageUrlAsync, handleImageError } from "@/lib/image-utils";

interface PropertyCardProps {
  prop: Property;
  isAiRecommended?: boolean | null;
}

export function PropertyCard({ prop, isAiRecommended }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  useEffect(() => {
    if (prop.imageUrls?.[0]) {
      // Use the direct API endpoint for S3 images
      try {
        const imageKey = prop.imageUrls[0];
        
        // If it's already a full URL, use it as is
        if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
          setImageUrl(imageKey);
          return;
        }
        
        // If it already contains our API endpoint, use it directly
        if (imageKey.includes('/api/s3-image?key=')) {
          setImageUrl(imageKey);
          return;
        }
        
        // Otherwise, create a new API URL with the encoded key
        const apiUrl = `/api/s3-image?key=${encodeURIComponent(imageKey)}`;
        console.log(`Property ${prop.id} using image URL: ${apiUrl}`);
        setImageUrl(apiUrl);
      } catch (error) {
        console.error('Error formatting image URL:', error);
        setImageError(true);
      }
    }
  }, [prop.imageUrls, prop.id]);
  
  // Default placeholder image - use inline SVG for reliability
  const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPlByb3BlcnR5IEltYWdlPC90ZXh0Pjwvc3ZnPg==";
  

  
  // Get the first image URL or use a placeholder
  const getImageUrl = () => {
    if (imageError) {
      return placeholderImage;
    }
    
    if (!prop.imageUrls || !Array.isArray(prop.imageUrls) || prop.imageUrls.length === 0) {
      console.log(`Using placeholder for property ${prop.id} - no valid image URLs`);
      return placeholderImage;
    }
    
    // Get the first valid image URL
    const firstImage = prop.imageUrls.find(url => url && typeof url === 'string' && url.trim() !== '');
    
    if (!firstImage) {
      console.log(`Using placeholder for property ${prop.id} - no valid images in array`);
      return placeholderImage;
    }
    
    // Format the URL using our utility function
    const formattedUrl = formatImageUrl(firstImage);
    console.log(`Property ${prop.id} image URL: ${formattedUrl}`);
    return formattedUrl;
  };
  
  return (
    <Link href={`/property/${prop.id}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <div className="h-full w-full overflow-hidden">
            <div className="relative w-full h-full bg-gray-200">
              {/* Show skeleton loader while image is loading */}
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              
              <img
                src={imageError ? placeholderImage : imageUrl || placeholderImage}
                alt={prop.title}
                onClick={() => window.scrollTo(0, 0)}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 relative z-10"
                style={{ opacity: imageError ? 0 : 1 }}
                onLoad={() => {
                  console.log(`Image loaded successfully for property ${prop.id}`);
                }}
                onError={(e) => {
                  console.log(`Image error for property ${prop.id}:`, e);
                  setImageError(true);
                  handleImageError(e, placeholderImage);
                }}
              />
            </div>
            {prop.imageUrls && Array.isArray(prop.imageUrls) && prop.imageUrls.length > 1 && !imageError && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                +{prop.imageUrls.length - 1} more photos
              </div>
            )}
          </div>

          {/* Approval status badge - displays at the top center */}
          {prop.approvalStatus && (
            <Badge
              variant="secondary"
              className={`absolute top-2 transform -translate-x-1/2 left-1/2 z-10 ${
                prop.approvalStatus === "approved"
                  ? "bg-green-500 text-white"
                  : prop.approvalStatus === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
              }`}
            >
              {prop.approvalStatus === "approved"
                ? "✓ Approved"
                : prop.approvalStatus === "pending"
                  ? "Pending"
                  : "Rejected"}
            </Badge>
          )}

          {prop.premium && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-amber-500 text-white"
            >
              Premium
            </Badge>
          )}

          {prop.featured && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-blue-500 text-white"
            >
              Featured
            </Badge>
          )}

          {prop.discountedPrice && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 bg-red-500 text-white"
            >
              {Math.round(
                (1 - prop.discountedPrice / prop.price) * 100,
              )}
              % Off
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">
              {prop.title}
            </h3>
            <Badge variant="outline">{prop.propertyType}</Badge>
          </div>

          <p className="text-gray-500 text-sm mb-3">{prop.location}</p>

          <div className="flex items-center gap-4">
            {prop.bedrooms && (
              <span className="text-sm flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {prop.bedrooms} Beds
              </span>
            )}
            {prop.bathrooms && (
              <span className="text-sm flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {prop.bathrooms} Baths
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-semibold flex items-center">
              <IndianRupee className="h-4 w-4" />
              {prop.price.toLocaleString("en-IN")}
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
