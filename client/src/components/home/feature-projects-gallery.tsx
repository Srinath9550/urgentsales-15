import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { formatImageUrl, handleImageError } from "@/lib/image-utils";

import { Project } from "@/types/property-types";

export default function FeatureProjectsGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const [manualScrolling, setManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Check for mobile devices on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Fetch featured projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Function to handle project card click
  const handleProjectClick = (projectId: number) => {
    window.scrollTo(0, 0);
    navigate(`/project/${projectId}`);
  };

  // Add scroll direction function
  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = isMobile ? 200 : 300;
    const currentScroll = scrollRef.current.scrollLeft;
    const newScroll = direction === "left" 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });

    setManualScrolling(true);

    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    manualScrollTimeoutRef.current = setTimeout(() => {
      setManualScrolling(false);
    }, 3000);
  };

  // Optimized smooth scroll effect - LEFT TO RIGHT direction
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const scrollSpeed = isMobile ? 1 : 2;

    const scroll = () => {
      if (!scrollContainer || manualScrolling) return;

      scrollPosition -= scrollSpeed;

      if (scrollPosition <= 0) {
        scrollPosition = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      if (!manualScrolling) {
        animationId = requestAnimationFrame(scroll);
      }
    };

    const handleTouchStart = () => {
      cancelAnimationFrame(animationId);
      setManualScrolling(true);
    };

    const handleTouchEnd = () => {
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
      manualScrollTimeoutRef.current = setTimeout(() => {
        setManualScrolling(false);
        animationId = requestAnimationFrame(scroll);
      }, 3000);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("touchstart", handleTouchStart);
    scrollContainer.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
        scrollContainer.removeEventListener("touchstart", handleTouchStart);
        scrollContainer.removeEventListener("touchend", handleTouchEnd);
      }
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, [manualScrolling, isMobile]);

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Featured Projects
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Explore our most prestigious and sought-after real estate developments
            </p>
          </div>
          <Button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/featured-projects");
            }}
            variant="outline"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white border-none text-xs sm:text-sm"
            size={isMobile ? "sm" : "default"}
          >
            View All Projects
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollToDirection("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 sm:p-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hidden sm:flex items-center justify-center"
            aria-label="Scroll left"
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
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => scrollToDirection("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 sm:p-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hidden sm:flex items-center justify-center"
            aria-label="Scroll right"
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
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-scroll scrollbar-hide whitespace-nowrap pb-4"
          >
            <div className="inline-flex gap-2 sm:gap-3 md:gap-4">
              {projects.map((project, index) => (
                <div
                  key={`${project.id}`}
                  className="inline-block w-44 sm:w-56 md:w-64 lg:w-72 h-32 sm:h-36 md:h-40 lg:h-48 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 relative group cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleProjectClick(project.id);
                    }
                  }}
                  aria-label={`View details of ${project.name} in ${project.location}`}
                >
                  <img
                    src={formatImageUrl(
                      project.imageUrls && project.imageUrls.length > 0 
                        ? project.imageUrls[0] 
                        : project.url || '', 
                      true
                    )}
                    alt={project.alt || project.title || project.name || 'Featured project'}
                    className="w-full h-full object-cover"
                    loading={index < 10 ? "eager" : "lazy"}
                    onError={(e) => handleImageError(e, undefined, true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                      {project.name || project.title || 'Featured Project'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-200 truncate">
                      {project.location || 'Premium Location'}
                    </p>
                    <span className="text-[10px] sm:text-xs text-white/80 mt-0.5 hidden group-hover:inline-block">
                      Click to view details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div 
                key={dot} 
                className="w-1.5 h-1.5 rounded-full bg-gray-300"
              />
            ))}
            <div className="w-2.5 h-1.5 rounded-full bg-blue-500 mx-0.5" />
            {[7, 8, 9, 10].map((dot) => (
              <div 
                key={dot} 
                className="w-1.5 h-1.5 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
