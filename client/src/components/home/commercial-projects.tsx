import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  ChevronRight,
  IndianRupee,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { CommercialProperty } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatImageUrl, handleImageError } from "@/lib/image-utils";

export default function CommercialProjects() {
  // Fetch commercial properties data
  const { data: commercialProperties, isLoading } = useQuery<CommercialProperty[]>({
    queryKey: ["/api/properties/commercial"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Commercial Projects
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Prime commercial properties for your business needs
            </p>
          </div>
          <Link href="/properties?type=commercial">
            <Button
              variant="outline"
              className="gap-2 text-sm sm:text-base"
              onClick={() => window.scrollTo(0, 0)}
            >
              View All
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="mb-6 sm:mb-8">
          <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Locations
            </TabsTrigger>
            <TabsTrigger value="telangana" className="text-xs sm:text-sm">
              Telangana
            </TabsTrigger>
            <TabsTrigger value="andhra" className="text-xs sm:text-sm">
              Andhra Pradesh
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <PropertyCarousel
              properties={commercialProperties || mockCommercialProperties}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="telangana">
            <PropertyCarousel
              properties={(
                commercialProperties || mockCommercialProperties
              ).filter((p) => p.state === "Telangana")}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="andhra">
            <PropertyCarousel
              properties={(
                commercialProperties || mockCommercialProperties
              ).filter((p) => p.state === "Andhra Pradesh")}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface PropertyCarouselProps {
  properties: CommercialProperty[];
  isLoading: boolean;
}

function PropertyCarousel({ properties, isLoading }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Determine how many cards to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else {
        setCardsToShow(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse events for desktop dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current || isTransitioning) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjusted for smoother feel
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!carouselRef.current) return;
    
    // Snap to nearest card with smooth animation
    const cardWidth = carouselRef.current.offsetWidth / cardsToShow;
    const scrollPosition = carouselRef.current.scrollLeft;
    const nearestCardIndex = Math.round(scrollPosition / cardWidth);
    
    setIsTransitioning(true);
    carouselRef.current.scrollTo({
      left: nearestCardIndex * cardWidth,
      behavior: 'smooth'
    });
    
    // Update current index for pagination dots
    setCurrentIndex(Math.min(nearestCardIndex, properties.length - cardsToShow));
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the CSS transition duration
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Touch events for mobile dragging with improved smoothness
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current || isTransitioning) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    handleMouseUp(); // Reuse the same logic
  };

  // Smooth navigation with animation
  const nextSlide = () => {
    if (!carouselRef.current || isTransitioning) return;
    const cardWidth = carouselRef.current.offsetWidth / cardsToShow;
    const newIndex = Math.min(currentIndex + cardsToShow, properties.length - cardsToShow);
    
    setIsTransitioning(true);
    carouselRef.current.scrollTo({
      left: newIndex * (cardWidth / cardsToShow),
      behavior: 'smooth'
    });
    
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    if (!carouselRef.current || isTransitioning) return;
    const cardWidth = carouselRef.current.offsetWidth / cardsToShow;
    const newIndex = Math.max(0, currentIndex - cardsToShow);
    
    setIsTransitioning(true);
    carouselRef.current.scrollTo({
      left: newIndex * (cardWidth / cardsToShow),
      behavior: 'smooth'
    });
    
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {[...Array(cardsToShow)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <Skeleton className="h-36 sm:h-44 md:h-48 w-full" />
            <div className="p-3 sm:p-4">
              <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
              <Skeleton className="h-3 sm:h-4 w-1/2 mb-3 sm:mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 sm:h-5 w-1/3" />
                <Skeleton className="h-6 sm:h-8 w-16 sm:w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-500 text-sm sm:text-base">
          No commercial properties available in this region.
        </p>
      </div>
    );
  }

  const visibleProperties = properties.slice(
    currentIndex,
    currentIndex + cardsToShow,
  );

  // If we have fewer properties than cards to show and we're at the end
  if (
    visibleProperties.length < cardsToShow &&
    properties.length > cardsToShow
  ) {
    const remaining = cardsToShow - visibleProperties.length;
    visibleProperties.push(...properties.slice(0, remaining));
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-0">
      {/* Navigation Arrows */}
      {properties.length > cardsToShow && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-10 bg-white rounded-full p-1 sm:p-2 shadow-md hover:bg-gray-100 transition-all duration-300 ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Previous properties"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-10 bg-white rounded-full p-1 sm:p-2 shadow-md hover:bg-gray-100 transition-all duration-300 ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Next properties"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
          </button>
        </>
      )}

      {/* Scrollable Container with enhanced smooth scrolling */}
      <div 
        ref={carouselRef}
        className={`overflow-x-auto hide-scrollbar flex space-x-4 sm:space-x-6 md:space-x-8 pb-4 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isTransitioning ? 'pointer-events-none' : ''}`}
        style={{ 
          scrollBehavior: 'smooth', 
          WebkitOverflowScrolling: 'touch',
          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="flex-none w-full sm:w-1/2 px-2 transition-transform duration-500 ease-out"
          >
            <CommercialPropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Swipe Indicator - Visual cue for mobile users */}
      <div className="mt-2 text-center text-xs text-gray-500 sm:hidden">
        <span>← Swipe to view more →</span>
      </div>

      {/* Pagination Dots with smooth transitions */}
      {properties.length > cardsToShow && (
        <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
          {Array.from({
            length: Math.ceil(properties.length / cardsToShow),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (carouselRef.current && !isTransitioning) {
                  const cardWidth = carouselRef.current.offsetWidth / cardsToShow;
                  setIsTransitioning(true);
                  carouselRef.current.scrollTo({
                    left: i * cardsToShow * (cardWidth / cardsToShow),
                    behavior: 'smooth'
                  });
                  setCurrentIndex(i * cardsToShow);
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 500);
                }
              }}
              disabled={isTransitioning}
              className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full transition-all duration-300 ${
                i === Math.floor(currentIndex / cardsToShow)
                  ? "bg-primary scale-125"
                  : "bg-gray-300"
              } ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommercialPropertyCardProps {
  property: CommercialProperty;
}

function CommercialPropertyCard({ property }: CommercialPropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const placeholderImage = "/placeholder-property.jpg";
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="relative w-full h-32 sm:h-40 md:h-44">
          {/* Skeleton loader while image is loading */}
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          
          <img
            src={imageError ? placeholderImage : formatImageUrl(property.imageUrl)}
            alt={property.title}
            className="w-full h-full object-cover relative z-10"
            onLoad={() => {
              console.log(`Commercial property image loaded successfully:`, property.imageUrl);
            }}
            onError={(e) => {
              console.log(`Error loading commercial property image:`, property.imageUrl);
              setImageError(true);
              handleImageError(e, placeholderImage);
            }}
          />
        </div>
        <div className="absolute top-0 left-0 bg-black/70 text-white p-1 sm:p-2">
          <div className="text-xs sm:text-sm font-medium">
            {property.propertyType}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
        <h3 className="text-base sm:text-lg font-semibold truncate">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 text-xs sm:text-sm">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">
            Locality: {property.locality}, {property.city}
          </span>
        </div>

        <div className="flex items-center text-primary font-semibold text-sm sm:text-base">
          <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span>{property.price} Cr onwards</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
          <div>Posted: {property.postedDate}</div>
          <div className="hidden xs:block">Builder: {property.builder}</div>
        </div>

        <div className="flex justify-end pt-1">
          <Link href={`/project-detail/${property.id}`}>
            <Button
              size="sm"
              onClick={() => window.scrollTo(0, 0)}
              className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm py-1 sm:py-2 h-auto"
            >
              See Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Mock data for development and fallback
const mockCommercialProperties: CommercialProperty[] = [
  {
    id: "c1",
    title: "Office Spaces, Shops & Showrooms",
    propertyType: "Commercial",
    locality: "Malkajgiri",
    city: "Hyderabad",
    state: "Telangana",
    price: "1.04",
    pricePerSqFt: "7,500",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    postedDate: "Dec 31, '24",
    builder: "Jain Construction",
    featured: true,
    possession: "Ready to Move",
    area: "1200-2500 sq.ft",
    amenities: ["24/7 Security", "Power Backup", "Parking"],
  },
  {
    id: "c2",
    title: "Premium Retail Spaces",
    propertyType: "Commercial",
    locality: "Gachibowli",
    city: "Hyderabad",
    state: "Telangana",
    price: "2.15",
    pricePerSqFt: "9,200",
    imageUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    postedDate: "Dec 28, '24",
    builder: "Prestige Group",
    featured: false,
    possession: "Q2 2025",
    area: "800-1500 sq.ft",
    amenities: ["Food Court", "Elevator", "CCTV"],
  },
  {
    id: "c3",
    title: "IT Park Office Spaces",
    propertyType: "Commercial",
    locality: "HITEC City",
    city: "Hyderabad",
    state: "Telangana",
    price: "3.50",
    pricePerSqFt: "11,000",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    postedDate: "Dec 25, '24",
    builder: "DLF Commercial",
    featured: true,
    possession: "Ready to Move",
    area: "5000-15000 sq.ft",
    amenities: ["Conference Room", "Cafeteria", "Gym"],
  },
  {
    id: "c4",
    title: "Amaravati Business Hub",
    propertyType: "Commercial",
    locality: "Amaravati",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    price: "1.75",
    pricePerSqFt: "6,800",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    postedDate: "Dec 20, '24",
    builder: "Amaravati Developers",
    featured: true,
    possession: "Q3 2025",
    area: "1000-3000 sq.ft",
    amenities: ["Smart Building", "Landscaped Garden", "24/7 Security"],
  },
  {
    id: "c5",
    title: "Vizag Tech Park",
    propertyType: "Commercial",
    locality: "Rushikonda",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    price: "2.25",
    pricePerSqFt: "7,200",
    imageUrl:
      "https://images.unsplash.com/photo-1577760258779-e787a1733016?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    postedDate: "Dec 18, '24",
    builder: "Vizag Realty",
    featured: false,
    possession: "Ready to Move",
    area: "2000-5000 sq.ft",
    amenities: ["Sea View", "Conference Facilities", "Parking"],
  },
  {
    id: "c6",
    title: "Tirupati Commercial Complex",
    propertyType: "Commercial",
    locality: "Tiruchanur",
    city: "Tirupati",
    state: "Andhra Pradesh",
    price: "1.20",
    pricePerSqFt: "5,500",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    postedDate: "Dec 15, '24",
    builder: "Tirupati Constructions",
    featured: true,
    possession: "Q1 2025",
    area: "600-1200 sq.ft",
    amenities: ["Temple Proximity", "Tourist Footfall", "Parking"],
  },
];
