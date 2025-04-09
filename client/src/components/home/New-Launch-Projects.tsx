import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NewLaunchProjects() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  // Add state for manual scrolling control
  const [manualScrolling, setManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized dummy images with reliable URLs
  const images = [
    // Luxury Homes
    {
      id: 1,
      url: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Luxury Villa with Pool",
      projectId: "luxury-villa-001",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Modern Luxury Home",
      projectId: "modern-luxury-002",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Elegant Mansion",
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Waterfront Property",
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Luxury Interior",
    },

    // Apartments
    {
      id: 6,
      url: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Modern Apartment Building",
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "High-Rise Apartment",
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Studio Apartment",
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Apartment Interior",
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Luxury Condo",
    },

    // Commercial Properties
    {
      id: 11,
      url: "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Modern Office Space",
    },
    {
      id: 12,
      url: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Co-working Space",
    },
    {
      id: 13,
      url: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Retail Space",
    },
    {
      id: 14,
      url: "https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Commercial Building",
    },
    {
      id: 15,
      url: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Modern Mall",
    },

    // Vacation Properties
    {
      id: 16,
      url: "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Beach House",
    },
    {
      id: 17,
      url: "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Mountain Cabin",
    },
    {
      id: 18,
      url: "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Lakeside Cottage",
    },
    {
      id: 19,
      url: "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Island Villa",
    },
    {
      id: 20,
      url: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Vacation Rental",
    },

    // New Developments
    {
      id: 21,
      url: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "New Construction",
    },
    {
      id: 22,
      url: "https://images.pexels.com/photos/2138126/pexels-photo-2138126.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Development Project",
    },
    {
      id: 23,
      url: "https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Residential Development",
    },
    {
      id: 24,
      url: "https://images.pexels.com/photos/2227832/pexels-photo-2227832.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Upcoming Project",
    },
    {
      id: 25,
      url: "https://images.pexels.com/photos/2360569/pexels-photo-2360569.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      alt: "Architectural Model",
    },
  ];

  // Updated function to handle card click with scroll to top
  const handleCardClick = (projectId: string) => {
    window.scrollTo(0, 0);
    navigate(`/project-detail/${projectId}`);
  };

  // Add scroll direction function
  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    // Calculate the scroll amount (one image width + gap)
    const scrollAmount = 300; // Approximate width of image + gap

    // Get current scroll position
    const currentScroll = scrollRef.current.scrollLeft;

    // Calculate new scroll position
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    // Scroll smoothly to the new position
    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });

    // Set manual scrolling to true to pause auto-scrolling
    setManualScrolling(true);

    // Clear any existing timeout
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    // Resume auto-scrolling after delay
    manualScrollTimeoutRef.current = setTimeout(() => {
      setManualScrolling(false);
    }, 3000);
  };

  // Optimized smooth scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1.5; // Pixels per frame - smoother speed

    const scroll = () => {
      if (!scrollContainer || manualScrolling) return;

      scrollPosition += scrollSpeed;

      // Reset when reaching the end to create seamless loop
      const maxScroll =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(scroll);

    // Pause scrolling when user hovers over the container
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

    // Clean up
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

        {/* Gallery container with navigation arrows */}
        <div className="relative">
          {/* Left Arrow */}
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

          {/* Right Arrow */}
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

          {/* Scrolling gallery container */}
          <div
            ref={scrollRef}
            className="overflow-x-scroll scrollbar-hide whitespace-nowrap pb-4"
          >
            <div className="inline-flex gap-2 sm:gap-3 md:gap-4">
              {/* Double the images to create a seamless loop effect */}
              {[...images, ...images].map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className="inline-block w-44 sm:w-56 md:w-64 lg:w-72 h-32 sm:h-36 md:h-40 lg:h-48 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 relative cursor-pointer"
                  onClick={() => handleCardClick(image.projectId || `project-${image.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(image.projectId || `project-${image.id}`);
                    }
                  }}
                  aria-label={`View details for ${image.alt}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading={index < 10 ? "eager" : "lazy"}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
                    <p className="text-white text-xs sm:text-sm font-medium truncate">
                      {image.alt}
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
        
        {/* Mobile indicator dots */}
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
