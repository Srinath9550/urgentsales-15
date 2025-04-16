import React, { useState } from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  ChevronRight,
  Star,
  Heart,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { formatImageUrl, handleImageError } from "@/lib/image-utils";

import { LuxuryProject } from "@/types/property-types";

export default function LuxuryProjects() {
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch luxury projects data
  const { data: luxuryProjects, isLoading } = useQuery<LuxuryProject[]>({
    queryKey: ["/api/projects/luxury"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Fallback to mock data
    placeholderData: [
      {
        id: "1",
        title: "The Pinnacle Residences",
        location: "Jubilee Hills",
        city: "Hyderabad",
        price: "₹ 4.5 Cr",
        bhkConfig: "4 BHK",
        imageUrl:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        builder: "Prestige Group",
        amenities: ["Infinity Pool", "Private Theater", "Spa", "Concierge"],
        rating: 4.9,
        featured: true,
        tags: ["Ultra Luxury", "Exclusive"],
        description:
          "Experience unparalleled luxury living at The Pinnacle Residences. These meticulously designed 4 BHK apartments offer panoramic city views, premium finishes, and world-class amenities tailored for the discerning homeowner.",
      },
      {
        id: "2",
        title: "Emerald Heights",
        location: "Banjara Hills",
        city: "Hyderabad",
        price: "₹ 3.8 Cr",
        priceRange: "onwards",
        bhkConfig: "3, 4 BHK",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        builder: "Lodha Group",
        amenities: ["Rooftop Garden", "Smart Home", "Wine Cellar", "Gym"],
        rating: 4.7,
        tags: ["Premium", "Smart Homes"],
        description:
          "Emerald Heights offers smart luxury living in the heart of Banjara Hills. These tech-enabled homes feature cutting-edge automation, sustainable design, and exclusive amenities that blend comfort with innovation.",
      },
      {
        id: "3",
        title: "The Grand Mansion",
        location: "Film Nagar",
        city: "Hyderabad",
        price: "₹ 6.2 Cr",
        bhkConfig: "5 BHK",
        imageUrl:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        builder: "Tata Housing",
        amenities: ["Private Pool", "Home Office", "Garden", "Security"],
        rating: 4.8,
        featured: true,
        tags: ["Ultra Luxury", "Celebrity Homes"],
        description:
          "The Grand Mansion sets a new standard for luxury living in Film Nagar. These exclusive 5 BHK villas feature private pools, expansive living spaces, and bespoke interiors designed for those who appreciate the finest things in life.",
      },
      {
        id: "4",
        title: "Azure Skyline",
        location: "Gachibowli",
        city: "Hyderabad",
        price: "₹ 3.2 Cr",
        priceRange: "onwards",
        bhkConfig: "3, 4 BHK",
        imageUrl:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        builder: "Raheja Developers",
        amenities: [
          "Sky Lounge",
          "Fitness Center",
          "Business Center",
          "EV Charging",
        ],
        rating: 4.6,
        tags: ["Premium", "Green Building"],
        description:
          "Azure Skyline combines luxury with sustainability in Gachibowli's tech corridor. These LEED-certified apartments feature energy-efficient systems, premium finishes, and amenities designed for modern urban professionals.",
      },
    ],
  });

  // Add this console log to debug the data
  console.log("Luxury projects data:", luxuryProjects);

  // Ensure luxuryProjects is always an array
  const projectsArray = Array.isArray(luxuryProjects) ? luxuryProjects : [];

  const handleSaveProject = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save projects",
        variant: "default",
      });
      return;
    }

    setSavedProjects((prev) => {
      if (prev.includes(projectId)) {
        toast({
          title: "Project Removed",
          description: "Project removed from your saved list",
          variant: "default",
        });
        return prev.filter((id) => id !== projectId);
      } else {
        toast({
          title: "Project Saved",
          description: "Project added to your saved list",
          variant: "default",
        });
        return [...prev, projectId];
      }
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Luxury Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exclusive luxury properties in prime locations, featuring
            premium amenities and world-class design for discerning homebuyers.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[1, 2].map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-6 bg-green-50 rounded-lg p-4"
              >
                <Skeleton className="w-full md:w-96 h-64 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projectsArray.map((project, index) => (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                className="block"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6 bg-green-50 hover:bg-green-100 transition-colors duration-300 rounded-lg overflow-hidden`}
                >
                <div className="relative w-full md:w-96 h-64 md:h-auto">
                  <img
                    src={formatImageUrl(
                      project.imageUrls && project.imageUrls.length > 0 
                        ? project.imageUrls[0] 
                        : project.imageUrl || '', 
                      true
                    )}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, undefined, true)}
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md">
                      Featured
                    </div>
                  )}
                  <button
                    onClick={(e) => handleSaveProject(e, project.id)}
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label={
                      savedProjects.includes(project.id)
                        ? "Remove from saved"
                        : "Save project"
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${savedProjects.includes(project.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                    />
                  </button>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>
                      {project.location}, {project.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-700">{project.bhkConfig}</span>
                    </div>

                    <div className="flex items-center text-sm font-medium text-primary">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span>{project.price}</span>
                      {project.priceRange && (
                        <span className="text-xs text-gray-500 ml-1">
                          onwards
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span>{project.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {project.description ||
                      `Exclusive luxury property in ${project.location} featuring premium amenities including ${project.amenities.slice(0, 2).join(", ")} and more.`}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {project.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{project.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      By {project.builder}
                    </div>
                    <Link href={`/project/${project.id}`}>
                      <Button size="sm" className="text-xs h-9" onClick={() => window.scrollTo(0, 0)}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/projects/luxury">
            <Button 
              className="px-8 bg-green-600 hover:bg-green-700"
              onClick={() => window.scrollTo(0, 0)}
            >
              View All Luxury Projects <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
