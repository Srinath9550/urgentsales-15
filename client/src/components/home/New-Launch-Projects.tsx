import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatImageUrl, handleImageError } from "@/lib/image-utils";

interface Project {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export default function NewLaunchProjects() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [manualScrolling, setManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/new-launch');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (projectId: string) => {
    window.scrollTo(0, 0);
    navigate(`/project/${projectId}`);
  };

  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
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

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1.5;

    const scroll = () => {
      if (!scrollContainer || manualScrolling) return;

      scrollPosition += scrollSpeed;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
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

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, [manualScrolling]);

  if (loading) {
    return <div className="py-8 text-center">Loading projects...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              New Launch Projects
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Explore our newest properties and upcoming launches. Don't miss out 
              on these exciting opportunities.
            </p>
          </div>
          <Button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/NewLaunchProjects-view");
            }}
            variant="outline"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white border-none text-xs sm:text-sm"
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
                  className="inline-block w-44 sm:w-56 md:w-64 lg:w-72 h-32 sm:h-36 md:h-40 lg:h-48 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 relative cursor-pointer"
                  onClick={() => handleCardClick(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(project.id);
                    }
                  }}
                  aria-label={`View details for ${project.title}`}
                >
                  <img
                    src={formatImageUrl(project.imageUrl)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading={index < 10 ? "eager" : "lazy"}
                    onError={(e) => handleImageError(e)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
                    <p className="text-white text-xs sm:text-sm font-medium truncate">
                      {project.title}
                    </p>
                    <span className="text-white/80 text-[10px] sm:text-xs mt-0.5 hidden xs:inline-block">
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
