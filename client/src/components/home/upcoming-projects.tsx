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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
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
}

export default function UpcomingProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(6); // Changed to show 6 projects
  const [activeTab, setActiveTab] = useState("all");
  const [isTouching, setIsTouching] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProjects(2); // Show 2 on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleProjects(4); // Show 4 on tablets
      } else {
        setVisibleProjects(6); // Show 6 on desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch upcoming projects data
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/upcoming"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log("Projects data:", projects); // Add this for debugging

  // Filter projects based on active tab
  const filteredProjects = projects?.filter((project) => {
    if (activeTab === "all") return true;
    if (activeTab === "telangana") return project.state === "Telangana";
    if (activeTab === "andhra") return project.state === "Andhra Pradesh";
    if (activeTab === "featured") return project.featured;
    return true;
  });

  console.log("Filtered projects:", filteredProjects); // Add this for debugging
  console.log("Current index:", currentIndex); // Add this for debugging
  console.log("Visible projects:", visibleProjects); // Add this for debugging

  // Reset current index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const nextSlide = () => {
    if (filteredProjects && filteredProjects.length > visibleProjects) {
      setCurrentIndex((prevIndex) =>
        prevIndex + visibleProjects >= filteredProjects.length
          ? 0
          : prevIndex + visibleProjects,
      );
    }
  };

  const prevSlide = () => {
    if (filteredProjects && filteredProjects.length > visibleProjects) {
      setCurrentIndex((prevIndex) =>
        prevIndex - visibleProjects < 0
          ? Math.max(0, filteredProjects.length - visibleProjects)
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
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Upcoming Projects
              </h2>
              <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                UrgentSales
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Explore upcoming residential projects across top locations
            </p>
          </div>
          <Link href="/projects/luxury">
            <Button
              variant="link"
              className="text-primary flex items-center gap-1 p-0 h-auto mt-2 md:mt-0"
              onClick={() => window.scrollTo(0, 0)}
            >
              See all Projects <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Projects
            </TabsTrigger>
            <TabsTrigger value="telangana" className="text-xs sm:text-sm">
              Telangana
            </TabsTrigger>
            <TabsTrigger value="andhra" className="text-xs sm:text-sm">
              Andhra Pradesh
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-xs sm:text-sm">
              Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} forceMount>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
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
                {/* Always show navigation arrows when there are more projects than visible */}
                {filteredProjects &&
                  filteredProjects.length > visibleProjects && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 hidden md:block"
                        aria-label="Previous projects"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 hidden md:block"
                        aria-label="Next projects"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </>
                  )}

                {filteredProjects && filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Show only a slice of projects based on currentIndex and visibleProjects */}
                    {filteredProjects
                      .slice(currentIndex, currentIndex + visibleProjects)
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No projects found in this category.
                    </p>
                  </div>
                )}

                {/* Pagination indicators */}
                {filteredProjects &&
                  filteredProjects.length > visibleProjects && (
                    <div className="flex justify-center mt-6">
                      {Array.from({
                        length: Math.ceil(
                          filteredProjects.length / visibleProjects,
                        ),
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
          </TabsContent>
        </Tabs>

        {/* Mobile view all button */}
        <div className="mt-6 text-center md:hidden">
          <Link href="/projects">
            <Button variant="outline" className="w-full" onClick={() => window.scrollTo(0, 0)}>
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

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

  return (
    <Link href={`/project/${project.id}`} onClick={() => window.scrollTo(0, 0)}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 h-full group">
        <div className="relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
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
            <div className="flex items-center text-sm font-medium text-primary">
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
            <Button size="sm" variant="outline" className="text-xs h-7 px-2">
              Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Mock data for development and fallback
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Poulomi Avante",
    location: "Kokapeta",
    city: "Hyderabad",
    state: "Telangana",
    price: "₹ 1.78 Cr",
    bhkConfig: "3 BHK",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    builder: "Poulomi Estates Pvt Ltd",
    amenities: ["Gym", "Swimming Pool", "Club House"],
    possessionDate: "Dec 2024",
    featured: true,
    tags: ["Premium", "New Launch"],
  },
  {
    id: "2",
    title: "Aparna Sunstone",
    location: "Gopanpalli",
    city: "Hyderabad",
    state: "Telangana",
    price: "Price on request",
    bhkConfig: "3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500",
    builder: "Aparna Constructions and Estates",
    possessionDate: "Mar 2025",
    tags: ["Luxury"],
  },
  {
    id: "3",
    title: "Devi Homes Samruddhi",
    location: "Patancheru",
    city: "Hyderabad",
    state: "Telangana",
    price: "₹ 52.8 Lac",
    bhkConfig: "2, 3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
    builder: "Jai Sridevi Homes Pvt Ltd",
    priceRange: "onwards",
    possessionDate: "Jun 2024",
    tags: ["Affordable"],
  },
  {
    id: "4",
    title: "Aparna Synergy",
    location: "Gandi Maisamma",
    city: "Hyderabad",
    state: "Telangana",
    price: "Price on request",
    bhkConfig: "2, 3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?w=500",
    builder: "Aparna Constructions",
    possessionDate: "Sep 2024",
    featured: true,
    tags: ["Premium"],
  },
  {
    id: "5",
    title: "Paradise Homes",
    location: "Hayathnagar",
    city: "Hyderabad",
    state: "Telangana",
    price: "₹ 49.4 Lac",
    bhkConfig: "2, 3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=500",
    builder: "Modi Builders & Realtors Pvt Ltd",
    priceRange: "onwards",
    possessionDate: "Apr 2025",
    tags: ["Affordable"],
  },
  {
    id: "6",
    title: "Modi Edifice",
    location: "Bachupally",
    city: "Hyderabad",
    state: "Telangana",
    price: "₹ 76 Lac",
    bhkConfig: "3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=500",
    builder: "Modi Builders & Realtors Pvt Ltd",
    priceRange: "onwards",
    possessionDate: "Jan 2025",
  },
  {
    id: "7",
    title: "Vertex Lake View",
    location: "Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    price: "₹ 1.25 Cr",
    bhkConfig: "3, 4 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500",
    builder: "Vertex Homes",
    priceRange: "onwards",
    possessionDate: "Aug 2024",
    featured: true,
    tags: ["Premium", "Lake View"],
  },
  {
    id: "8",
    title: "Sai Vamsee Enclave",
    location: "Vijayawada",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    price: "₹ 65 Lac",
    bhkConfig: "2, 3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    builder: "Sai Developers",
    priceRange: "onwards",
    possessionDate: "Oct 2024",
    tags: ["River View"],
  },
  {
    id: "9",
    title: "Vasavi Urban Homes",
    location: "Mangalagiri",
    city: "Guntur",
    state: "Andhra Pradesh",
    price: "₹ 45.5 Lac",
    bhkConfig: "2 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500",
    builder: "Vasavi Builders",
    priceRange: "onwards",
    possessionDate: "Dec 2024",
    tags: ["Affordable"],
  },
  {
    id: "10",
    title: "Amaravati Grand",
    location: "Amaravati",
    city: "Amaravati",
    state: "Andhra Pradesh",
    price: "₹ 85 Lac",
    bhkConfig: "3 BHK",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500",
    builder: "Capital City Developers",
    priceRange: "onwards",
    possessionDate: "Mar 2025",
    featured: true,
    tags: ["Premium", "Capital Region"],
  },
];
