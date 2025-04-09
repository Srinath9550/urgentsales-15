import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function FeatureProjectsGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  // Add state for manual scrolling control
  const [manualScrolling, setManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Optimized dummy featured project images with reliable sources
  const projects = [
    // Luxury Projects
    {
      id: 1,
      url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Parkview Residences",
      name: "Parkview Residences",
      location: "Bangalore",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "The Grand Towers",
      name: "The Grand Towers",
      location: "Mumbai",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Horizon Villas",
      name: "Horizon Villas",
      location: "Goa",
    },
    {
      id: 4,
      url: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Emerald Heights",
      name: "Emerald Heights",
      location: "Delhi",
    },
    {
      id: 5,
      url: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Lakeside Apartments",
      name: "Lakeside Apartments",
      location: "Pune",
    },

    // Modern Developments
    {
      id: 6,
      url: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Urban Square",
      name: "Urban Square",
      location: "Hyderabad",
    },
    {
      id: 7,
      url: "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Metro Heights",
      name: "Metro Heights",
      location: "Chennai",
    },
    {
      id: 8,
      url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Skyline Residences",
      name: "Skyline Residences",
      location: "Kolkata",
    },
    {
      id: 9,
      url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Green Valley",
      name: "Green Valley",
      location: "Ahmedabad",
    },
    {
      id: 10,
      url: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Sunset Boulevard",
      name: "Sunset Boulevard",
      location: "Jaipur",
    },

    // Eco-friendly Projects
    {
      id: 11,
      url: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Eco Gardens",
      name: "Eco Gardens",
      location: "Mysore",
    },
    {
      id: 12,
      url: "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Green Terraces",
      name: "Green Terraces",
      location: "Kochi",
    },
    {
      id: 13,
      url: "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Nature's Haven",
      name: "Nature's Haven",
      location: "Chandigarh",
    },
    {
      id: 14,
      url: "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Sustainable Living",
      name: "Sustainable Living",
      location: "Indore",
    },
    {
      id: 15,
      url: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Eco Homes",
      name: "Eco Homes",
      location: "Bhopal",
    },

    // Smart Home Projects
    {
      id: 16,
      url: "https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Smart City",
      name: "Smart City",
      location: "Surat",
    },
    {
      id: 17,
      url: "https://images.pexels.com/photos/2227832/pexels-photo-2227832.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Tech Homes",
      name: "Tech Homes",
      location: "Nagpur",
    },
    {
      id: 18,
      url: "https://images.pexels.com/photos/2360569/pexels-photo-2360569.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Digital Living",
      name: "Digital Living",
      location: "Lucknow",
    },
    {
      id: 19,
      url: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Future Residences",
      name: "Future Residences",
      location: "Coimbatore",
    },
    {
      id: 20,
      url: "https://images.pexels.com/photos/2138126/pexels-photo-2138126.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Connected Homes",
      name: "Connected Homes",
      location: "Visakhapatnam",
    },

    // Luxury Villas
    {
      id: 21,
      url: "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Royal Villas",
      name: "Royal Villas",
      location: "Gurgaon",
    },
    {
      id: 22,
      url: "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Elite Estates",
      name: "Elite Estates",
      location: "Noida",
    },
    {
      id: 23,
      url: "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Premium Homes",
      name: "Premium Homes",
      location: "Thane",
    },
    {
      id: 24,
      url: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Luxury Living",
      name: "Luxury Living",
      location: "Faridabad",
    },
    {
      id: 25,
      url: "https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?auto=compress&cs=tinysrgb&w=600&h=350",
      alt: "Prestige Villas",
      name: "Prestige Villas",
      location: "Vadodara",
    },
  ];

  // Function to handle project card click
  const handleProjectClick = (projectId: number) => {
    // Navigate to the project detail page with the specific project ID
    window.scrollTo(0, 0);
    navigate(`/project-detail/${projectId}`);
  };

  // Add scroll direction function
  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    // Calculate the scroll amount (one project card width + gap)
    const scrollAmount = isMobile ? 200 : 300; // Smaller scroll amount on mobile

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

  // Optimized smooth scroll effect - LEFT TO RIGHT direction
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const scrollSpeed = isMobile ? 1 : 2; // Slower scroll on mobile

    const scroll = () => {
      if (!scrollContainer || manualScrolling) return;

      scrollPosition -= scrollSpeed;

      // Reset when reaching the beginning to create seamless loop
      if (scrollPosition <= 0) {
        scrollPosition =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
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

    // Touch events for mobile
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

    // Clean up
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
  }, [manualScrolling, isMobile]); // Add isMobile as dependency

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Featured Projects
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Explore our most prestigious and sought-after real estate
              developments
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

          {/* Scrolling gallery container - reversed direction */}
          <div
            ref={scrollRef}
            className="overflow-x-scroll scrollbar-hide whitespace-nowrap pb-4"
          >
            <div className="inline-flex gap-2 sm:gap-3 md:gap-4">
              {/* Double the projects to create a seamless loop effect */}
              {[...projects, ...projects].map((project, index) => (
                <div
                  key={`${project.id}-${index}`}
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
                    src={project.url}
                    alt={project.alt}
                    className="w-full h-full object-cover"
                    loading={index < 10 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-200 truncate">
                      {project.location}
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
