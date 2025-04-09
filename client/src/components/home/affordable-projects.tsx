import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  MapPin,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Tag,
  Heart,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface AffordableProject {
  id: string;
  title: string;
  location: string;
  city: string;
  state?: string;
  price: string;
  bhkConfig: string;
  imageUrl: string;
  builder: string;
  priceRange?: string;
  amenities?: string[];
  launchDate?: string;
  possessionDate?: string;
  featured?: boolean;
  tags?: string[];
  contactNumber?: string;
  description?: string;
}

export default function AffordableProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(4); // Show 4 cards by default
  const [isTouching, setIsTouching] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProjects(1); // Show 1 on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleProjects(2); // Show 2 on tablets
      } else if (window.innerWidth < 1280) {
        setVisibleProjects(3); // Show 3 on small desktops
      } else {
        setVisibleProjects(4); // Show 4 on large desktops
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch affordable projects data
  const { data: affordableProjects, isLoading } = useQuery<AffordableProject[]>(
    {
      queryKey: ["/api/projects/affordable"],
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Fallback to mock data
      placeholderData: [
        {
          id: "1",
          title: "Green Valley Homes",
          location: "Kompally",
          city: "Hyderabad",
          state: "Telangana",
          price: "₹ 45 Lac",
          priceRange: "onwards",
          bhkConfig: "2 BHK",
          imageUrl:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
          builder: "Greentech Builders",
          amenities: ["Garden", "Gym", "Children's Play Area"],
          possessionDate: "Dec 2024",
          tags: ["Affordable", "PMAY"],
          contactNumber: "+91 9876543210",
          description:
            "Affordable 2 BHK apartments with modern amenities in a well-connected location.",
        },
        {
          id: "2",
          title: "Sunshine Apartments",
          location: "Miyapur",
          city: "Hyderabad",
          state: "Telangana",
          price: "₹ 38 Lac",
          bhkConfig: "1, 2 BHK",
          imageUrl:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
          builder: "Sunshine Developers",
          amenities: ["Security", "Power Backup", "Parking"],
          possessionDate: "Jun 2025",
          tags: ["Budget Friendly"],
          contactNumber: "+91 9876543211",
          description:
            "Budget-friendly apartments with essential amenities for first-time homebuyers.",
        },
        {
          id: "3",
          title: "Urban Nest",
          location: "Bachupally",
          city: "Hyderabad",
          state: "Telangana",
          price: "₹ 42 Lac",
          priceRange: "onwards",
          bhkConfig: "2 BHK",
          imageUrl:
            "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800",
          builder: "Urban Developers",
          amenities: ["Community Hall", "Jogging Track", "Garden"],
          possessionDate: "Mar 2025",
          featured: true,
          tags: ["Affordable", "Gated Community"],
          contactNumber: "+91 9876543212",
          description:
            "Affordable gated community with spacious 2 BHK apartments and modern amenities.",
        },
        {
          id: "4",
          title: "Harmony Heights",
          location: "Shamirpet",
          city: "Hyderabad",
          state: "Telangana",
          price: "₹ 35 Lac",
          bhkConfig: "1, 2 BHK",
          imageUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
          builder: "Harmony Builders",
          amenities: ["Park", "24/7 Water Supply", "Security"],
          possessionDate: "Sep 2024",
          tags: ["Budget Friendly", "Ready to Move"],
          contactNumber: "+91 9876543213",
          description:
            "Ready-to-move budget apartments with essential amenities for small families.",
        },
        {
          id: "5",
          title: "Meadow View",
          location: "Patancheru",
          city: "Hyderabad",
          state: "Telangana",
          price: "₹ 48 Lac",
          priceRange: "onwards",
          bhkConfig: "2, 3 BHK",
          imageUrl:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          builder: "Meadow Constructions",
          amenities: ["Swimming Pool", "Gym", "Children's Play Area"],
          possessionDate: "Dec 2025",
          tags: ["Affordable", "Family-Friendly"],
          contactNumber: "+91 9876543214",
          description:
            "Family-friendly affordable apartments with premium amenities in a serene location.",
        },
        {
          id: "6",
          title: "Serene Spaces",
          location: "Medchal",
          city: "Hyderabad",
          state: "Telangana",
          price: "₹ 40 Lac",
          bhkConfig: "2 BHK",
          imageUrl:
            "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800",
          builder: "Serene Developers",
          amenities: ["Garden", "Security", "Parking"],
          possessionDate: "Aug 2025",
          tags: ["Budget Friendly", "Green Surroundings"],
          contactNumber: "+91 9876543215",
          description:
            "Budget-friendly apartments surrounded by greenery with essential amenities.",
        },
      ],
    },
  );

  // Ensure affordableProjects is always an array
  const projectsArray = Array.isArray(affordableProjects)
    ? affordableProjects
    : [];

  // Navigation functions
  const nextSlide = () => {
    if (projectsArray.length > visibleProjects) {
      setCurrentIndex((prevIndex) =>
        prevIndex + visibleProjects >= projectsArray.length
          ? 0
          : prevIndex + visibleProjects,
      );
    }
  };

  const prevSlide = () => {
    if (projectsArray.length > visibleProjects) {
      setCurrentIndex((prevIndex) =>
        prevIndex - visibleProjects < 0
          ? Math.max(0, projectsArray.length - visibleProjects)
          : prevIndex - visibleProjects,
      );
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTouching) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide();
    } else if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide();
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Affordable Projects
              </h2>
              <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                Budget Friendly
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Quality homes at affordable prices across prime locations
            </p>
          </div>
          <Link href="/projects/affordable">
            <Button
              variant="link"
              className="text-primary flex items-center gap-1 p-0 h-auto mt-2 md:mt-0"
              onClick={() => window.scrollTo(0, 0)}
            >
              See all Affordable Projects <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(visibleProjects)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div
            className="relative"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Navigation arrows */}
            {projectsArray.length > visibleProjects && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors hidden md:block"
                  aria-label="Previous projects"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors hidden md:block"
                  aria-label="Next projects"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </>
            )}

            {/* Fixed: Changed to a simple grid layout for reliable display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projectsArray
                .slice(currentIndex, currentIndex + visibleProjects)
                .map((project) => (
                  <div key={project.id}>
                    <ProjectCard project={project} />
                  </div>
                ))}
            </div>

            {/* Pagination indicators */}
            {projectsArray.length > visibleProjects && (
              <div className="flex justify-center mt-6">
                {Array.from({
                  length: Math.ceil(projectsArray.length / visibleProjects),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i * visibleProjects)}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      Math.floor(currentIndex / visibleProjects) === i
                        ? "bg-primary"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: AffordableProject;
}

function ProjectCard({ project }: ProjectCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveProject = (e: React.MouseEvent) => {
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

    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Project Removed" : "Project Saved",
      description: isSaved
        ? "Project removed from your saved list"
        : "Project added to your saved list",
      variant: "default",
    });
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (project.contactNumber) {
      window.location.href = `tel:${project.contactNumber}`;
    } else {
      toast({
        title: "Contact Information",
        description: "Contact details are not available for this project.",
        variant: "default",
      });
    }
  };

  return (
    <Link href={`/project/${project.id}`}>
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback image if the original fails to load
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500";
            }}
          />
          {project.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md">
              Featured
            </div>
          )}
          <button
            onClick={handleSaveProject}
            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isSaved ? "Remove from saved" : "Save project"}
          >
            <Heart
              className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-500"}`}
            />
          </button>

          {/* Contact Now button that appears on hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleContactClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-md flex items-center justify-center gap-1 text-sm font-medium transition-colors"
            >
              <Phone className="h-3.5 w-3.5" /> Contact Now
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {project.title}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">
              {project.location}, {project.city}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm">
              <Building2 className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className="text-gray-700">{project.bhkConfig} Flats</span>
            </div>

            <div className="flex items-center text-sm font-medium text-green-600">
              <IndianRupee className="h-3.5 w-3.5 mr-1" />
              <span>{project.price}</span>
              {project.priceRange && (
                <span className="text-xs text-gray-500 ml-1">onwards</span>
              )}
            </div>

            {project.possessionDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                <span>Possession: {project.possessionDate}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="text-xs text-gray-500">By {project.builder}</div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={() => window.scrollTo(0, 0)}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
