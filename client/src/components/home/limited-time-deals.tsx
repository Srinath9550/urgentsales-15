import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, BedDouble, Bath, Square } from "lucide-react";

// Type for property deals
interface LimitedTimeDeal {
  id: number;
  title: string;
  location: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  imageUrl: string;
  endTime: Date; // When the deal expires
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export default function LimitedTimeDeals() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    [key: number]: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  }>({});

  // Add these state variables at the component level
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [manualScrolling, setManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Updated deals with more varied end times
  const deals: LimitedTimeDeal[] = [
    // Andhra Pradesh Properties
    {
      id: 1,
      title: "Luxury Villa in Amaravati",
      location: "Amaravati, Andhra Pradesh",
      originalPrice: 8500000,
      discountedPrice: 7225000,
      discountPercentage: 15,
      imageUrl:
        "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000,
      ), // 1 day and 7 hours
      propertyType: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
    },
    {
      id: 2,
      title: "Beachfront Property in Visakhapatnam",
      location: "Visakhapatnam, Andhra Pradesh",
      originalPrice: 12000000,
      discountedPrice: 9600000,
      discountPercentage: 20,
      imageUrl:
        "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
      ), // 3 days and 2 hours
      propertyType: "Villa",
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
    },
    {
      id: 3,
      title: "Modern Apartment in Vijayawada",
      location: "Vijayawada, Andhra Pradesh",
      originalPrice: 5500000,
      discountedPrice: 4675000,
      discountPercentage: 15,
      imageUrl:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
    },
    {
      id: 4,
      title: "Riverside Bungalow in Rajahmundry",
      location: "Rajahmundry, Andhra Pradesh",
      originalPrice: 7500000,
      discountedPrice: 6000000,
      discountPercentage: 20,
      imageUrl:
        "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
      ), // 4 days and 5 hours
      propertyType: "House",
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
    },
    {
      id: 5,
      title: "Hillview Villa in Tirupati",
      location: "Tirupati, Andhra Pradesh",
      originalPrice: 9000000,
      discountedPrice: 7650000,
      discountPercentage: 15,
      imageUrl:
        "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
      ), // 2 days and 9 hours
      propertyType: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      area: 3000,
    },
    // ... other properties with varied end times
    {
      id: 6,
      title: "Commercial Space in Nellore",
      location: "Nellore, Andhra Pradesh",
      originalPrice: 15000000,
      discountedPrice: 12750000,
      discountPercentage: 15,
      imageUrl:
        "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
      ), // 5 days and 3 hours
      propertyType: "Commercial",
      area: 5000,
    },
    {
      id: 7,
      title: "Luxury Apartment in Guntur",
      location: "Guntur, Andhra Pradesh",
      originalPrice: 6500000,
      discountedPrice: 5200000,
      discountPercentage: 20,
      imageUrl:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
      endTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 1700,
    },
    // ... remaining properties with varied end times
  ];

  // Calculate time left for each deal with days included
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newTimeLeft: {
        [key: number]: {
          days: number;
          hours: number;
          minutes: number;
          seconds: number;
        };
      } = {};

      deals.forEach((deal) => {
        const difference = deal.endTime.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          newTimeLeft[deal.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeft[deal.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Completely revised smooth scrolling implementation using requestAnimationFrame
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const scrollContent = scrollContentRef.current;

    if (!scrollContainer || !scrollContent) return;

    // Calculate total width and visible width
    const calculateDimensions = () => {
      if (!scrollContainer || !scrollContent)
        return { totalWidth: 0, visibleWidth: 0 };

      const totalWidth = scrollContent.scrollWidth;
      const visibleWidth = scrollContainer.clientWidth;

      return { totalWidth, visibleWidth };
    };

    let { totalWidth, visibleWidth } = calculateDimensions();

    // Set up variables for smooth scrolling
    let scrollPosition = 0;
    let lastTimestamp = 0;
    let isResetting = false;
    let resetStartPosition = 0;
    let resetProgress = 0;

    // Calculate scroll speed based on screen size
    const getScrollSpeed = () => {
      const baseSpeed = 1.2; // Increased from 0.6 for faster scrolling
      const screenWidth = window.innerWidth;

      // Slower on mobile, faster on desktop, but keep it smooth
      if (screenWidth < 640) return baseSpeed * 0.6; // Increased from 0.5
      if (screenWidth < 1024) return baseSpeed * 0.8; // Increased from 0.7
      return baseSpeed;
    };

    let scrollSpeed = getScrollSpeed();

    // Animation function using requestAnimationFrame for smooth scrolling
    const animate = (timestamp: number) => {
      if (!scrollContainer || !scrollContent || manualScrolling) return;

      // First frame initialization
      if (!lastTimestamp) lastTimestamp = timestamp;

      // Calculate delta time for frame-rate independent animation
      const deltaTime = Math.min(timestamp - lastTimestamp, 50); // Cap delta time to prevent jumps after tab switch
      lastTimestamp = timestamp;

      if (isResetting) {
        // Handle smooth reset animation
        resetProgress += 0.05; // Control reset speed

        if (resetProgress >= 1) {
          // Reset complete
          scrollPosition = 0;
          isResetting = false;
          resetProgress = 0;
        } else {
          // Smooth transition using easeOutCubic
          const t = 1 - Math.pow(1 - resetProgress, 3);
          scrollPosition = resetStartPosition * (1 - t);
        }
      } else {
        // Normal scrolling
        scrollPosition += (scrollSpeed * deltaTime) / 16.67; // normalize to 60fps

        // Check if we need to reset
        const oneThirdPoint = totalWidth / 3;

        if (scrollPosition >= oneThirdPoint) {
          // Start reset animation
          isResetting = true;
          resetStartPosition = scrollPosition;
          resetProgress = 0;
        }
      }

      // Apply the scroll position with transform for better performance
      scrollContent.style.transform = `translateX(-${scrollPosition}px)`;

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Pause animation on hover or touch
    const pauseAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // Resume animation
    const resumeAnimation = () => {
      if (!animationRef.current && !manualScrolling) {
        lastTimestamp = 0; // Reset timestamp for smooth restart
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Handle window resize
    const handleResize = () => {
      // Recalculate dimensions
      const dimensions = calculateDimensions();
      totalWidth = dimensions.totalWidth;
      visibleWidth = dimensions.visibleWidth;

      // Update scroll speed based on new screen size
      scrollSpeed = getScrollSpeed();

      // Reset position if needed
      if (scrollPosition > totalWidth / 3) {
        scrollPosition = 0;
        isResetting = false;
      }
    };

    // Add event listeners
    scrollContainer.addEventListener("mouseenter", pauseAnimation);
    scrollContainer.addEventListener("mouseleave", resumeAnimation);
    scrollContainer.addEventListener("touchstart", pauseAnimation, {
      passive: true,
    });
    scrollContainer.addEventListener("touchend", resumeAnimation);
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      scrollContainer.removeEventListener("mouseenter", pauseAnimation);
      scrollContainer.removeEventListener("mouseleave", resumeAnimation);
      scrollContainer.removeEventListener("touchstart", pauseAnimation);
      scrollContainer.removeEventListener("touchend", resumeAnimation);
      window.removeEventListener("resize", handleResize);
    };
  }, [manualScrolling]);

  // Add these manual scrolling handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current || !scrollContentRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollContentRef.current.scrollLeft);
    setManualScrolling(true);

    // Clear any existing timeout
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Set a timeout to resume automatic scrolling after manual interaction
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    manualScrollTimeoutRef.current = setTimeout(() => {
      setManualScrolling(false);
    }, 3000); // Resume auto-scrolling after 3 seconds of inactivity
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current || !scrollContentRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling

    // Get the current transform value
    const transformValue = scrollContentRef.current.style.transform;
    const currentTranslateX = transformValue
      ? parseInt(transformValue.replace("translateX(", "").replace("px)", ""))
      : 0;

    // Apply new transform
    const newTranslateX = Math.max(
      currentTranslateX - walk,
      -scrollContentRef.current.scrollWidth + scrollRef.current.clientWidth,
    );
    scrollContentRef.current.style.transform = `translateX(${newTranslateX}px)`;

    // Update startX for the next move event
    setStartX(x);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current || !scrollContentRef.current) return;

    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setManualScrolling(true);

    // Clear any existing timeout
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current || !scrollContentRef.current) return;

    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    // Get the current transform value
    const transformValue = scrollContentRef.current.style.transform;
    const currentTranslateX = transformValue
      ? parseInt(transformValue.replace("translateX(", "").replace("px)", ""))
      : 0;

    // Apply new transform with boundaries
    const newTranslateX = Math.max(
      currentTranslateX - walk,
      -scrollContentRef.current.scrollWidth + scrollRef.current.clientWidth,
    );
    scrollContentRef.current.style.transform = `translateX(${newTranslateX}px)`;

    // Update startX for the next move event
    setStartX(x);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Set a timeout to resume automatic scrolling after manual interaction
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    manualScrollTimeoutRef.current = setTimeout(() => {
      setManualScrolling(false);
    }, 3000); // Resume auto-scrolling after 3 seconds of inactivity
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  };

  // Helper function to format time left
  const formatTimeLeft = (dealId: number) => {
    const time = timeLeft[dealId];
    if (!time) return "Ending soon";

    if (time.days > 0) {
      return `${time.days}d ${time.hours}h left`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m left`;
    } else {
      return `${time.minutes}m ${time.seconds}s left`;
    }
  };

  // Add this function after the other handler functions
  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollRef.current || !scrollContentRef.current) return;

    // Get the current transform value
    const transformValue = scrollContentRef.current.style.transform;
    const currentTranslateX = transformValue
      ? parseInt(transformValue.replace("translateX(", "").replace("px)", ""))
      : 0;

    // Calculate the width of a single card plus gap
    const cardWidth = 260; // w-64 = 16rem = 256px + gap

    // Calculate new position
    const newTranslateX =
      direction === "left"
        ? Math.min(currentTranslateX + cardWidth, 0)
        : Math.max(
            currentTranslateX - cardWidth,
            -scrollContentRef.current.scrollWidth +
              scrollRef.current.clientWidth,
          );

    // Apply smooth transition
    scrollContentRef.current.style.transition = "transform 0.3s ease-out";
    scrollContentRef.current.style.transform = `translateX(${newTranslateX}px)`;

    // Reset transition after animation completes
    setTimeout(() => {
      if (scrollContentRef.current) {
        scrollContentRef.current.style.transition = isDragging
          ? "none"
          : "transform 0.1s ease-out";
      }
    }, 300);

    // Pause auto-scrolling temporarily
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

  // Then update the return statement to include the arrows
  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-red-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-6 md:mb-10">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              🚨 Limited-Time Deals – Act Fast!
            </h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            Buy properties at exclusive discounts in Andhra Pradesh and
            Telangana before time runs out! These special offers are available
            for a very limited time only.
          </p>
        </div>

        {/* Improved scrolling container with navigation arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scrollToDirection("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hidden sm:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollToDirection("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hidden sm:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="overflow-hidden relative pb-4 cursor-grab active:cursor-grabbing"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={scrollContentRef}
              className="flex gap-2 md:gap-3"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              {/* Triple the deals to ensure seamless looping */}
              {[...deals, ...deals, ...deals].map((deal, index) => (
                <div
                  key={`${deal.id}-${index}`}
                  className="flex-shrink-0 w-48 sm:w-56 md:w-64 h-auto rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/properties/${deal.id}`)}
                  style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* Property Image with Countdown Overlay */}
                  <div className="relative">
                    <img
                      src={deal.imageUrl}
                      alt={deal.title}
                      className="w-full h-32 sm:h-36 md:h-40 object-cover"
                      loading={index < 20 ? "eager" : "lazy"}
                      decoding="async"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-0 left-0 bg-red-600 text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-br-lg font-bold text-xs">
                      {deal.discountPercentage}% OFF
                    </div>

                    {/* Countdown Timer */}
                    {timeLeft[deal.id] && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] sm:text-xs">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>
                          {timeLeft[deal.id].days > 0
                            ? `${timeLeft[deal.id].days}d:${String(timeLeft[deal.id].hours).padStart(2, "0")}h`
                            : `${String(timeLeft[deal.id].hours).padStart(2, "0")}:${String(timeLeft[deal.id].minutes).padStart(2, "0")}:${String(timeLeft[deal.id].seconds).padStart(2, "0")}`}
                        </span>
                      </div>
                    )}

                    {/* Flash Sale Badge */}
                    <div className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-tl-lg font-medium text-[10px] sm:text-xs">
                      Urgent Deal
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-1.5 sm:p-2 md:p-3 pb-2 sm:pb-3">
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1">
                      {deal.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 flex items-center">
                      <span className="line-clamp-1">{deal.location}</span>
                    </p>

                    {/* Property Specs with Icons */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                      <span>{deal.propertyType}</span>
                      {deal.bedrooms && (
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <BedDouble className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
                          <span>{deal.bedrooms} Beds</span>
                        </div>
                      )}
                      {deal.bathrooms && (
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Bath className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
                          <span>{deal.bathrooms} Baths</span>
                        </div>
                      )}
                      {deal.area && (
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Square className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
                          <span>{deal.area} sq.ft</span>
                        </div>
                      )}
                    </div>

                    {/* Price with Countdown */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-primary">
                          {formatPrice(deal.discountedPrice)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                          {formatPrice(deal.originalPrice)}
                        </span>
                      </div>

                      {/* Countdown Label with more varied display */}
                      <div className="text-[10px] sm:text-xs font-medium text-red-600 flex items-center gap-0.5 sm:gap-1">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>{formatTimeLeft(deal.id)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Button
            onClick={() => navigate("/limited-deals")}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-2 rounded-md font-medium flex items-center gap-2 text-sm sm:text-base"
          >
            Grab the Best Deals Now
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
