import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Home,
  Building,
  MapPin,
  TrendingUp,
  Briefcase,
  Landmark,
  UserSquare2,
  Layers3,
  Star,
  AreaChart,
  Medal,
  CheckCircle2,
  Clock,
  ThumbsUp,
  GraduationCap,
  Award,
  MapPinned,
  LineChart,
  IndianRupee,
  Bed,
  Bath,
  Maximize,
  Shield,
  User,
  LogOut,
  Home as HomeIcon,
  PlusCircle,
  Wrench,
  LayoutDashboard,
  Megaphone,
  FileText,
  Calculator,
  MessageSquare,
  Scale,
  BarChart,
  Handshake,
  Phone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Property, Agent, Company } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

// Mega menu items for Buy Properties
const buyMenuItems = [
  {
    title: "Residential Properties",
    href: "/properties?type=residential",
    description: "Find your dream home among our residential listings",
    icon: <Home className="h-5 w-5 text-primary" />,
    query: { propertyType: "house" },
    highlights: ["Family-friendly", "Modern amenities", "Ready to move in"],
    features: ["Community living", "Security", "Parks & recreation"],
  },
  {
    title: "Apartments & Flats",
    href: "/properties?propertyType=apartment",
    description: "Modern apartments in prime locations",
    icon: <Building className="h-5 w-5 text-primary" />,
    query: { propertyType: "apartment" },
    highlights: ["Low maintenance", "Great investment", "Urban living"],
    features: ["24x7 security", "Parking", "Clubhouse"],
  },
  {
    title: "Villas & Independent Houses",
    href: "/properties?propertyType=villa",
    description: "Luxurious villas with premium amenities",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    query: { propertyType: "villa" },
    highlights: ["Luxury living", "Privacy", "Premium neighborhoods"],
    features: ["Private garden", "Swimming pools", "Spacious interiors"],
  },
  {
    title: "Plots & Land",
    href: "/properties?propertyType=plot",
    description: "Investment plots and land parcels",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: { propertyType: "plot" },
    highlights: [
      "Appreciate over time",
      "Build custom home",
      "Asset investment",
    ],
    features: ["Clear titles", "Development potential", "Prime locations"],
  },
  {
    title: "Commercial Properties",
    href: "/properties?propertyType=commercial",
    description: "Office spaces and retail properties",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    query: { propertyType: "commercial" },
    highlights: ["Business growth", "Strategic locations", "Rental income"],
    features: ["Infrastructure", "Tech-ready", "Business districts"],
  },
  {
    title: "Newly Launched Projects",
    href: "/properties?status=new_launch",
    description: "Be the first to explore latest launches",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    query: { status: "new_launch" },
    highlights: ["Pre-launch prices", "Modern designs", "Future appreciation"],
    features: ["Smart homes", "Green buildings", "Future-ready"],
  },
  {
    title: "Premium Properties",
    href: "/properties?premium=true",
    description: "High-end luxury properties and penthouses",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { premium: true },
    highlights: ["Exclusive listings", "Ultra-luxury", "Prestigious locations"],
    features: ["Concierge service", "Designer interiors", "Brand associations"],
  },
  {
    title: "Verified Properties",
    href: "/properties?verified=true",
    description: "All details verified by our team",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    query: { verified: true },
    highlights: [
      "Reliable information",
      "Legal clarity",
      "Smooth transactions",
    ],
    features: [
      "Verified documents",
      "Transparent dealings",
      "Legal assistance",
    ],
  },
];

// Mega menu items for Agents
const agentMenuItems = [
  {
    title: "Top Rated Agents",
    href: "/agents?sort=rating",
    description: "Connect with our highest rated property experts",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { sort: "rating" },
    highlights: [
      "Customer satisfaction",
      "Proven expertise",
      "Trusted service",
    ],
    features: ["5-star ratings", "Client testimonials", "Performance metrics"],
  },
  {
    title: "Featured Agents",
    href: "/agents?featured=true",
    description: "Our selected top performing agents",
    icon: <Medal className="h-5 w-5 text-primary" />,
    query: { featured: true },
    highlights: ["Editor's choice", "Premium service", "Top performers"],
    features: ["Premium service", "Curated selection", "Special incentives"],
  },
  {
    title: "Agents by Area",
    href: "/agents?view=by-area",
    description: "Find specialists in your preferred location",
    icon: <MapPinned className="h-5 w-5 text-primary" />,
    query: { view: "by-area" },
    highlights: [
      "Local expertise",
      "Area specialists",
      "Neighborhood knowledge",
    ],
    features: ["Market insights", "Local connections", "Area-specific data"],
  },
  {
    title: "Most Experienced",
    href: "/agents?sort=experience",
    description: "Agents with years of industry expertise",
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    query: { sort: "experience" },
    highlights: ["Industry veterans", "Market wisdom", "Seasoned negotiators"],
    features: [
      "Transaction history",
      "Market cycles experience",
      "Long-term clients",
    ],
  },
  {
    title: "Most Deals Closed",
    href: "/agents?sort=deals",
    description: "Agents with impressive success records",
    icon: <ThumbsUp className="h-5 w-5 text-primary" />,
    query: { sort: "deals" },
    highlights: ["Proven results", "High volume", "Efficiency"],
    features: ["Transaction analytics", "Success rate", "Fast closings"],
  },
  {
    title: "Newly Joined",
    href: "/agents?sort=newest",
    description: "Fresh talent eager to help you",
    icon: <Clock className="h-5 w-5 text-primary" />,
    query: { sort: "newest" },
    highlights: ["Fresh perspective", "Motivated service", "Extra attention"],
    features: ["Digital savvy", "Modern approach", "Special promotions"],
  },
];

// Mega menu items for Companies
const companyMenuItems = [
  {
    title: "Top Companies",
    href: "/companies?sort=rating",
    description: "Leading real estate firms with exceptional service",
    icon: <Award className="h-5 w-5 text-primary" />,
    query: { sort: "rating" },
    highlights: ["Industry leaders", "Quality standards", "Trusted brands"],
    features: [
      "Corporate guarantee",
      "Standardized process",
      "After-sales support",
    ],
  },
  {
    title: "By City",
    href: "/companies?view=by-city",
    description: "Find reputable agencies in your city",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: { view: "by-city" },
    highlights: [
      "Local presence",
      "City specialists",
      "Neighborhood expertise",
    ],
    features: ["Local offices", "City-wide network", "Community involvement"],
  },
  {
    title: "Most Listings",
    href: "/companies?sort=listings",
    description: "Companies with the largest property portfolios",
    icon: <Layers3 className="h-5 w-5 text-primary" />,
    query: { sort: "listings" },
    highlights: ["Wide selection", "Market coverage", "Diverse options"],
    features: ["Extensive inventory", "Market share", "Category leadership"],
  },
  {
    title: "Established Agencies",
    href: "/companies?sort=established",
    description: "Firms with decades of industry presence",
    icon: <Landmark className="h-5 w-5 text-primary" />,
    query: { sort: "established" },
    highlights: ["Legacy brands", "Market pioneers", "Proven stability"],
    features: [
      "Institutional knowledge",
      "Historical insights",
      "Multi-generational clients",
    ],
  },
  {
    title: "Verified Companies",
    href: "/companies?verified=true",
    description: "All credentials verified by our team",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    query: { verified: true },
    highlights: [
      "Authentic partners",
      "Legal compliance",
      "Secure transactions",
    ],
    features: ["KYC verified", "Legal documentation", "Regulatory compliance"],
  },
];

// Mega menu items for Projects
const projectMenuItems = [
  {
    title: "New Launches",
    href: "/projects/NewLaunchProjects",
    description: "Newly launched residential projects",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    highlights: [
      "Pre-launch offers",
      "Early booking discounts",
      "Special schemes",
    ],
    features: [
      "Premium locations",
      "Modern architecture",
      "Smart home features",
    ],
  },
  {
    title: "Luxury Projects",
    href: "/projects/LuxuryProjects",
    description: "Premium residential developments",
    icon: <Star className="h-5 w-5 text-primary" />,
    highlights: [
      "High-end amenities",
      "Exclusive locations",
      "Designer interiors",
    ],
    features: ["Concierge services", "Private pools", "Premium security"],
  },
  {
    title: "Affordable Housing",
    href: "/projects/AffordableProject",
    description: "Budget-friendly housing projects",
    icon: <Home className="h-5 w-5 text-primary" />,
    highlights: ["Cost-effective", "Good connectivity", "Essential amenities"],
    features: ["Government schemes", "Easy financing", "Value for money"],
  },
  // {
  //   title: "Featured Projects",
  //   href: "/projects/featured",
  //   description: "Exclusive premium residential projects",
  //   icon: <Building2 className="h-5 w-5 text-primary" />,
  //   highlights: [
  //     "Premium locations",
  //     "Luxury amenities",
  //     "Modern architecture"
  //   ],
  //   features: ["Smart home", "Premium security", "Club house"],
  // },
  {
    title: "Upcoming Projects",
    href: "/projects/UpcomingProjects",
    description: "Soon to be launched residential projects",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    highlights: [
      "Pre-launch offers",
      "Early bird discounts", 
      "Future developments"
    ],
    features: ["Smart home", "Premium security", "Club house"],
  },
  {
    title: "Commercial Projects",
    href: "/projects/CommercialProjects",
    description: "Office spaces and retail developments",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    highlights: [
      "Business hubs",
      "Strategic locations",
      "Modern infrastructure",
    ],
    features: ["Tech parks", "Corporate offices", "Retail spaces"],
  },
];

// Mega menu items for Resources
const resourceMenuItems = [
  {
    title: "Click & Earn",
    href: "/tools/click-and-earn",
    description: "Earn rewards by referring properties and clients",
    icon: <IndianRupee className="h-5 w-5 text-primary" />,
  },
  {
    title: "Our Servers",
    href: "/",
    description: "Connect with our server network for real-time updates",
    icon: <Layers3 className="h-5 w-5 text-primary" />,
    onClick: () => {
      window.location.href = "/#our-servers";
      setTimeout(() => {
        const serversSection = document.getElementById("our-servers");
        if (serversSection) {
          serversSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    },
  },
  {
    title: "EMI Calculator",
    href: "/tools/emi-calculator",
    description: "Calculate your monthly EMI payments and loan details",
    icon: <Calculator className="h-5 w-5 text-primary" />,
  },
  {
    title: "FeedBack",
    href: "/feedback",
    description: "Share your experience and help us improve",
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
  },
  {
    title: "Legal Assistance",
    href: "/services/legal-solutions",
    description: "Get expert legal advice and documentation support",
    icon: <Scale className="h-5 w-5 text-primary" />,
  },
  {
    title: "Property Insights",
    href: "/tools/property-validation",
    description: "In-depth analysis of property market",
    icon: <BarChart className="h-5 w-5 text-primary" />,
  },
  {
    title: "Buying Guide",
    href: "/guides/buying-guide",
    description: "Comprehensive guide for property buyers",
    icon: <FileText className="h-5 w-5 text-primary" />,
  },
  {
    title: "Careers",
    href: "/careers",
    description: "Join our team and grow your career with us",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
  },
  {
    title: "Partner With Us",
    href: "/partner-with-us",
    description: "Partner with us to expand your business opportunities",
    icon: <Handshake className="h-5 w-5 text-primary" />,
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with our support team for assistance",
    icon: <Phone className="h-5 w-5 text-primary" />,
  },
];

// Property mini card for menu
function PropertyMiniCard({ property }: { property: Property }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-24">
        <img
          src={
            property.imageUrls?.[0] ||
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
          }
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.premium && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-amber-500 text-white"
          >
            Premium
          </Badge>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-medium text-xs truncate">{property.title}</h3>
        <p className="text-xs text-gray-500 truncate">{property.location}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium flex items-center">
            <IndianRupee className="h-3 w-3 mr-0.5" />
            {property.price.toLocaleString("en-IN")}
          </span>
          <div className="flex items-center space-x-1">
            {property.bedrooms && (
              <span className="text-xs flex items-center" title="Bedrooms">
                <Bed className="h-3 w-3 mr-0.5" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span
                className="text-xs flex items-center ml-1"
                title="Bathrooms"
              >
                <Bath className="h-3 w-3 mr-0.5" />
                {property.bathrooms}
              </span>
            )}
            <span className="text-xs flex items-center ml-1" title="Area">
              <Maximize className="h-3 w-3 mr-0.5" />
              {property.area}m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Agent mini card for menu
function AgentMiniCard({ agent }: { agent: Agent }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow p-2 flex items-center">
      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0">
        <img
          src={`https://randomuser.me/api/portraits/men/${agent.id}.jpg`}
          alt="Agent"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-xs truncate">Agent {agent.userId}</h3>
        <p className="text-xs text-gray-500 truncate">
          {agent.specializations?.join(", ") || "Property Expert"}
        </p>
        <div className="flex items-center mt-0.5">
          <div className="flex">
            {[...Array(Math.min(5, Math.round(agent.rating || 0)))].map(
              (_, i) => (
                <Star
                  key={i}
                  className="h-2.5 w-2.5 text-amber-500 fill-amber-500"
                />
              ),
            )}
          </div>
          <span className="text-xs ml-1">{agent.reviewCount || 0} reviews</span>
        </div>
      </div>
    </div>
  );
}

// Company mini card for menu
function CompanyMiniCard({ company }: { company: Company }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow p-2 flex items-center">
      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center">
        <Building className="h-6 w-6 text-gray-500" />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-xs truncate">{company.name}</h3>
        <p className="text-xs text-gray-500 truncate">{company.city}</p>
        <div className="flex items-center mt-0.5">
          {company.verified && (
            <Badge
              variant="outline"
              className="text-[8px] h-4 border-green-500 text-green-600 flex items-center"
            >
              <Shield className="h-2 w-2 mr-0.5" /> Verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

interface MegaMenuProps {
  isMobile?: boolean;
}

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [pathname, setLocation] = useLocation(); // Using wouter's useLocation
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch featured properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
    enabled: !isMobile,
  });

  // Fetch featured agents
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents/featured"],
    enabled: !isMobile,
  });

  // Fetch featured companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies/featured"],
    enabled: !isMobile,
  });

  // Create a search URL with parameters
  const createSearchUrl = (category: any) => {
    if (!category || !category.query) return "/search-results";

    const searchParams = new URLSearchParams();

    // Add all query parameters to the search URL
    for (const [key, value] of Object.entries(category.query)) {
      searchParams.append(key, String(value));
    }

    return `/search-results?${searchParams.toString()}`;
  };

  // Filter properties based on the active category query
  const getFilteredProperties = (category: any) => {
    if (!category || !category.query) return [];

    return properties
      .filter((property) => {
        for (const [key, value] of Object.entries(category.query)) {
          if (key === "propertyType" && property.propertyType !== value)
            return false;
          if (key === "premium" && property.premium !== value) return false;
          if (key === "verified" && property.verified !== value) return false;
          if (key === "forSaleOrRent" && property.rentOrSale !== value)
            return false;
          // Add more filters as needed
        }
        return true;
      })
      .slice(0, 2); // Display only 2 properties per category
  };

  // Toggle mobile category expansion
  const toggleMobileCategory = (category: string) => {
    setExpandedMobileCategory(
      expandedMobileCategory === category ? null : category,
    );
  };

  // ... existing state
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<
    string | null
  >(null);
  const { user, logout } = useAuth(); // Add this to access user info
  const [, navigate] = useLocation();

  const navigateTo = (path: string) => {
    navigate(path);
    // Close mobile categories if needed
    setExpandedMobileCategory(null);
  };

  const handleLogout = () => {
    logout();
    setExpandedMobileCategory(null);
  };

  if (isMobile) {
    // Enhanced mobile view with expandable sections
    return (
      <div
        className="flex flex-col space-y-1 pt-2 pb-3  overflow-y-auto overscroll-contain rounded-md"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E0 #F7FAFC",
          position: "relative",
          height: "75vh",
        }}
      >
        {/* Login Button for Mobile (only show when not logged in) */}
        {!user && (
          <div className="px-3 py-2 mb-2">
            <Link
              to="/auth"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Login / Register
            </Link>
          </div>
        )}
        {/* Buyer Section */}
        {/* <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("buyer")}
          >
            <span className="text-gray-800 font-medium">For Buyers</span>
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
              className={`transition-transform ${expandedMobileCategory === "buyer" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "buyer" && (
            <div className="pl-3 mt-1 space-y-2 animate-slideDown">
              {buyMenuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div> */}
        {/* Buyer Section */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("buyer")}
          >
            <span className="text-gray-800 font-medium">For Buyers</span>
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
              className={`transition-transform ${expandedMobileCategory === "buyer" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "buyer" && (
            <div className="pl-3 mt-1 space-y-1 animate-slideDown">
              {/* Property Agency Type */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  {" "}
                  Urgency Type
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/top-properties-view/10?category=top10"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <User className="h-3 w-3 mr-1.5" />
                    Top Urgent List
                  </Link>
                  <Link
                    to="/properties/search?urgencyType=Limited-Time-Deals"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Building className="h-3 w-3 mr-1.5" />
                    Limited Time Deals
                  </Link>
                  <Link
                    to={user ? "/post-property-free" : "/auth"}
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Login Required",
                          description: "You need to login before posting a property.",
                          variant: "default",
                        });
                      } else {
                        navigateTo("/post-property-free"); 
                      }
                    }}
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Users className="h-3 w-3 mr-1.5" />
                    Ready To Move
                  </Link>
                  <Link
                    to="/properties/search?urgencyType=Newly-Launched"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Shield className="h-3 w-3 mr-1.5" />
                    Newly Launched
                  </Link>
                  <Link
                    to="/properties/search?urgencyType= Owner Properties"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <User className="h-3 w-3 mr-1.5" />
                    Owner Properties
                  </Link>
                </div>
              </div>

              {/* Property Types */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  Property Types
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/properties/search?type=residential"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Home className="h-3 w-3 mr-1.5" />
                    Residential Properties
                  </Link>
                  <Link
                    to="/properties/search?type=apartment"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Building2 className="h-3 w-3 mr-1.5" />
                    Apartments & Flats
                  </Link>
                  <Link
                    to="/properties/search?type=villa"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <HomeIcon className="h-3 w-3 mr-1.5" />
                    Villas & Independent Houses
                  </Link>
                  <Link
                    to="/properties/search?type=plot"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <MapPin className="h-3 w-3 mr-1.5" />
                    Plots & Lands
                  </Link>
                  <Link
                    to="/properties/search?type=commercial"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Briefcase className="h-3 w-3 mr-1.5" />
                    Commercial Properties
                  </Link>
                  <Link
                    to="/properties/search?type=new-launch"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Layers3 className="h-3 w-3 mr-1.5" />
                    Newly Launched Projects
                  </Link>
                  <Link
                    to="/properties/search?type=premium"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Star className="h-3 w-3 mr-1.5" />
                    Premium Properties
                  </Link>
                  <Link
                    to="/properties/search?type=verified"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Verified Properties
                  </Link>
                </div>
              </div>

              {/* Budget Range */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  Budget Range
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/properties/search?budget=under-50l"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <IndianRupee className="h-3 w-3 mr-1.5" />
                    Under ₹50 Lakhs
                  </Link>
                  <Link
                    to="/properties/search?budget=50l-1Cr"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <IndianRupee className="h-3 w-3 mr-1.5" />
                    ₹50 Lakhs - ₹ 1 Cr
                  </Link>
                  <Link
                    to="/properties/search?budget=1Cr-3Cr"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <IndianRupee className="h-3 w-3 mr-1.5" />
                    ₹1 Cr - ₹3 Cr
                  </Link>
                  <Link
                    to="/properties/search?budget=above-3cr"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <IndianRupee className="h-3 w-3 mr-1.5" />
                    Above ₹3 Crore
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seller Section for Mobile */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("seller")}
          >
            <span className="text-gray-800 font-medium">For Sellers</span>
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
              className={`transition-transform ${expandedMobileCategory === "seller" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "seller" && (
            <div className="pl-3 mt-1 space-y-1 animate-slideDown">
              {/* For Owners */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  For Owners
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <LayoutDashboard className="h-3 w-3 mr-1.5" />
                    My Dashboard
                  </Link>

                  <Link
                    to={user ? "/post-property-free" : "/auth"}
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Login Required",
                          description:
                            "You need to login before posting a property.",
                          variant: "default",
                        });
                      } else {
                        navigateTo("/post-property-free");
                      }
                    }}
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <PlusCircle className="h-3 w-3 mr-1.5" />
                    Post Property
                  </Link>
                  <Link
                    to="/owner-ad-packages"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Megaphone className="h-3 w-3 mr-1.5" />
                    Ad Packages
                  </Link>
                  <Link
                    to="/tools/property-validation"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <IndianRupee className="h-3 w-3 mr-1.5" />
                    Property Valuation
                  </Link>
                </div>
              </div>

              {/* For Builder/Developer */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  For Builder/Developer
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <LayoutDashboard className="h-3 w-3 mr-1.5" />
                    My Dashboard
                  </Link>
                  <Link
                    to={user ? "/post-property-free" : "/auth"}
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Login Required",
                          description:
                            "You need to login before posting a property.",
                          variant: "default",
                        });
                      } else {
                        navigateTo("/post-property-free");
                      }
                    }}
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <PlusCircle className="h-3 w-3 mr-1.5" />
                    Post Property
                  </Link>
                  <Link
                    to="/builder-pricing"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Megaphone className="h-3 w-3 mr-1.5" />
                    Ad Packages
                  </Link>

                  <Link
                    to="/tools/property-validation"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <IndianRupee className="h-3 w-3 mr-1.5" />
                    Property Valuation
                  </Link>
                </div>
              </div>

              {/* For Companies/Projects */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  For Companies/Projects
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <LayoutDashboard className="h-3 w-3 mr-1.5" />
                    My Dashboard
                  </Link>
                  <Link
                    to="/coming-soon"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Megaphone className="h-3 w-3 mr-1.5" />
                    Advertise Your Projects
                  </Link>
                  <Link
                    to="/coming-soon"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Megaphone className="h-3 w-3 mr-1.5" />
                    AD Packages
                  </Link>
                  <Link
                    to="/company-pricing"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Users className="h-3 w-3 mr-1.5" />
                    Invester Lounge
                  </Link>
                </div>
              </div>

              {/* For Agents */}
              <div className="mb-2">
                <div className="font-medium text-sm text-primary mb-1">
                  For Agents
                </div>
                <div className="space-y-1 pl-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <LayoutDashboard className="h-3 w-3 mr-1.5" />
                    My Dashboard
                  </Link>
                  <Link
                    to={user ? "/post-property-free" : "/auth"}
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Login Required",
                          description:
                            "You need to login before posting a property.",
                          variant: "default",
                        });
                      } else {
                        navigateTo("/post-property-free");
                      }
                    }}
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <PlusCircle className="h-3 w-3 mr-1.5" />
                    Post Property
                  </Link>
                  <Link
                    to="/agent-pricing"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <Megaphone className="h-3 w-3 mr-1.5" />
                    AD Packages
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center py-1 text-xs text-gray-600 hover:text-primary"
                  >
                    <LineChart className="h-3 w-3 mr-1.5" />
                    My Sales Enquiry
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agents Section */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("agents")}
          >
            <span className="text-gray-800 font-medium">Agents</span>
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
              className={`transition-transform ${expandedMobileCategory === "agents" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "agents" && (
            <div className="pl-3 mt-1 space-y-2 animate-slideDown">
              {agentMenuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Companies Section */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("companies")}
          >
            <span className="text-gray-800 font-medium">Companies</span>
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
              className={`transition-transform ${expandedMobileCategory === "companies" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "companies" && (
            <div className="pl-3 mt-1 space-y-2 animate-slideDown">
              {companyMenuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("projects")}
          >
            <span className="text-gray-800 font-medium">Projects</span>
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
              className={`transition-transform ${expandedMobileCategory === "projects" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "projects" && (
            <div className="pl-3 mt-1 space-y-2 animate-slideDown">
              {projectMenuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer"
            onClick={() => toggleMobileCategory("resources")}
          >
            <span className="text-gray-800 font-medium">Quick Links</span>
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
              className={`transition-transform ${expandedMobileCategory === "resources" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "resources" && (
            <div className="pl-3 mt-1 space-y-2 animate-slideDown">
              {resourceMenuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Post Property FREE Section */}
        <Link
          to={user ? "/post-property-free" : "/auth"}
          onClick={() => {
            if (!user) {
              toast({
                title: "Login Required", 
                description: "You need to login before posting a property.",
                variant: "default",
              });
            } else {
              navigateTo("/post-property-free");
            }
          }}
          className="flex items-center py-2.5 px-3 border-b border-gray-100 mb-1 bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/20 transition-colors"
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
            className="mr-2.5 text-primary"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span className="font-semibold text-primary">Post Property FREE</span>
          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
            
          </span>
        </Link>

        {/* Support Options Section */}
        <div className="border-b border-gray-100 pb-2 mb-1">
          <div
            className="flex justify-between items-center py-2 px-1 cursor-pointer bg-gradient-to-r from-[#4F46E5]/10 to-transparent hover:from-[#4F46E5]/20"
            onClick={() => toggleMobileCategory("support")}
          >
            <span className="text-[#4F46E5] font-medium">Support Options</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${expandedMobileCategory === "support" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {expandedMobileCategory === "support" && (
            <div className="pl-3 mt-1 space-y-2 animate-slideDown">
              <a
                href="tel:+91-9032561155"
                className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contact Number
              </a>
              <a
                href="mailto:support@urgentsales.in"
                className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email Support
              </a>
              <a
                href="https://wa.me/9032381155"
                className="flex items-center py-1.5 text-sm text-gray-600 hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="#25D366"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Support
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  const sellerMenuItems = [
    {
      title: "Post Property",
      href: "/post-property-free",
      description: "List your property for sale or rent",
      icon: <PlusCircle className="h-5 w-5 text-primary" />,
      highlights: ["Free listing", "Wide exposure", "Quick results"],
      features: [
        "24/7 visibility",
        "Detailed property page",
        "Contact management",
      ],
    },
    {
      title: "For Owner",
      href: "/seller/owner",
      description: "Direct selling without intermediaries",
      icon: <User className="h-5 w-5 text-primary" />,
      highlights: ["No commission", "Direct buyer contact", "Complete control"],
      features: [
        "Buyer verification",
        "Document templates",
        "Pricing assistance",
      ],
    },
    {
      title: "For Agent & Builder",
      href: "/seller/agent-builder",
      description: "Professional tools for property experts",
      icon: <Building className="h-5 w-5 text-primary" />,
      highlights: ["Bulk listings", "Client management", "Analytics dashboard"],
      features: [
        "Lead generation",
        "Performance metrics",
        "Premium visibility",
      ],
    },
    {
      title: "My Dashboard",
      href: "/dashboard",
      description: "Manage your property listings",
      icon: <HomeIcon className="h-5 w-5 text-primary" />,
      highlights: ["Track performance", "Edit listings", "Manage inquiries"],
      features: [
        "Response analytics",
        "Visitor statistics",
        "Listing optimization",
      ],
    },
    {
      title: "Selling Tools",
      href: "/seller/tools",
      description: "Resources to maximize your selling potential",
      icon: <Wrench className="h-5 w-5 text-primary" />,
      highlights: ["Valuation tools", "Market insights", "Negotiation tips"],
      features: [
        "Price calculator",
        "Comparable properties",
        "Selling checklist",
      ],
    },
  ];

  // Desktop view with complex mega menu
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              pathname.startsWith("/properties") && "text-primary font-medium",
            )}
          >
            For Buyers
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[900px] grid-cols-12 p-4">
              {/* Property Agency Type Section */}
              <div className="col-span-3 p-2 border-r border-gray-100">
                <div className="mb-2 mt-1 text-base font-medium text-primary">
                  Urgency Type
                </div>
                <div className="space-y-1">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/top-properties-view/10?category=top10"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Top Urgent List
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?urgencyType=Limited-Time-Deals"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      Limited Time Deals
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to={user ? "/post-property-free" : "/auth"}
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "Login Required",
                            description: "You need to login before posting a property.",
                            variant: "default",
                          });
                        } else {
                          navigateTo("/post-property-free");
                        }
                      }}
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      Ready To Move
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?urgencyType=Newly-Launched"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Layers3 className="h-4 w-4 mr-2 text-gray-500" />
                      Newly Launched
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?urgencyType= Owner-Properties"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Owner Properties
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>

              {/* Property Types Section */}
              <div className="col-span-5 p-2 border-r border-gray-100">
                <div className="mb-2 mt-1 text-base font-medium text-primary">
                  Property Types
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="space-y-1">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=residential"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <Home className="h-4 w-4 mr-2 text-gray-500" />
                        Residential Properties
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=apartment"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        Apartments & Flats
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=villa"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <HomeIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Villas & Independent Houses
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=plot"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        Plots & Lands
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="space-y-1">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=commercial"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                        Commercial Properties
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=new-launch"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <Layers3 className="h-4 w-4 mr-2 text-gray-500" />
                        Newly Launched Projects
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=premium"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <Star className="h-4 w-4 mr-2 text-gray-500" />
                        Premium Properties
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/properties/search?type=verified"
                        className="flex items-center text-sm hover:text-primary py-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2 text-gray-500" />
                        Verified Properties
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </div>

              {/* Budget Range Section */}
              <div className="col-span-4 p-2">
                <div className="mb-2 mt-1 text-base font-medium text-primary">
                  Budget Range
                </div>
                <div className="space-y-1">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?budget=under-50l"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                      Under ₹50 Lakhs
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?budget=50l-1 Cr"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                      ₹50 Lakhs - ₹1 Cr
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?budget=1Cr-3cr"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                      ₹1 Crore - ₹3 Crore
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/properties/search?budget=above-3cr"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                      Above ₹3 Crore
                    </Link>
                  </NavigationMenuLink>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    {properties.slice(0, 2).map((property) => (
                      <div key={property.id} className="col-span-1">
                        <Link to={`/properties/${property.id}`}>
                          <PropertyMiniCard property={property} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              (pathname === "/add-property" ||
                pathname.startsWith("/seller")) &&
                "text-primary font-medium",
            )}
          >
            For Sellers
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-4 p-4">
              {/* Section 1: For Owners */}
              <div className="p-3 border-r border-gray-100">
                <h3 className="text-base font-medium mb-3 text-primary">
                  For Owners
                </h3>
                <div className="space-y-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2 text-gray-500" />
                      My Dashboard
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to={user ? "/post-property-free" : "/auth"}
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "Login Required",
                            description:
                              "You need to login before posting a property.",
                            variant: "default",
                          });
                        } else {
                          navigateTo("/post-property-free");
                        }
                      }}
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" />
                      Post Property
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/owner-ad-packages"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Megaphone className="h-4 w-4 mr-2 text-gray-500" />
                      Ad Packages
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/tools/property-validation"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                      Property Valuation
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>

              {/* Section 2: For Builder/Developer */}
              <div className="p-3 border-r border-gray-100">
                <h3 className="text-base font-medium mb-3 text-primary">
                  For Builder/Developer
                </h3>
                <div className="space-y-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2 text-gray-500" />
                      My Dashboard
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to={user ? "/post-property-free" : "/auth"}
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "Login Required",
                            description:
                              "You need to login before posting a property.",
                            variant: "default",
                          });
                        } else {
                          navigateTo("/post-property-free");
                        }
                      }}
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" />
                      Post Property
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      to="/builder-pricing"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Megaphone className="h-4 w-4 mr-2 text-gray-500" />
                      Ad Packages
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/tools/property-validation"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                      Property Valuation
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>

              {/* Section 3: For Companies/Projects */}
              <div className="p-3 border-r border-gray-100">
                <h3 className="text-base font-medium mb-3 text-primary">
                  For Companies/Projects
                </h3>
                <div className="space-y-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2 text-gray-500" />
                      My Dashboard
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/coming-soon"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Megaphone className="h-4 w-4 mr-2 text-gray-500" />
                      Advertise Your Projects
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/company-pricing"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Megaphone className="h-4 w-4 mr-2 text-gray-500" />
                      AD Packages
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/coming-soon"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      Investor Lounge
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>

              {/* Section 4: For Agents */}
              <div className="p-3">
                <h3 className="text-base font-medium mb-3 text-primary">
                  For Agents
                </h3>
                <div className="space-y-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2 text-gray-500" />
                      My Dashboard
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to={user ? "/post-property-free" : "/auth"}
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "Login Required",
                            description:
                              "You need to login before posting a property.",
                            variant: "default",
                          });
                        } else {
                          navigateTo("/post-property-free");
                        }
                      }}
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" />
                      Post Property
                    </Link>
                  </NavigationMenuLink>
                  <Link
                    to="/agent-pricing"
                    className="flex items-center text-sm hover:text-primary py-1.5"
                  >
                    <Megaphone className="h-4 w-4 mr-2 text-gray-500" />
                    AD Packages
                  </Link>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/contact"
                      className="flex items-center text-sm hover:text-primary py-1.5"
                    >
                      <LineChart className="h-4 w-4 mr-2 text-gray-500" />
                      My Sales Enquiry
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              pathname.startsWith("/agents") && "text-primary font-medium",
            )}
          >
            Agents
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-6 p-4 md:grid-cols-6">
              <div className="col-span-2 p-2">
                <div className="mb-2 mt-1 text-base font-medium">
                  Find Agents
                </div>
                <div className="space-y-1">
                  {agentMenuItems.map((item) => (
                    <div key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link to={createSearchUrl(item)}>
                          {" "}
                          {/* Use dynamic search URL with filters */}
                          <div className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted">
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium">
                                {item.title}
                              </div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 p-2">
                <div className="mb-3 mt-1 text-base font-medium">
                  Featured Agents
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {agents.slice(0, 4).map((agent) => (
                    <div key={agent.id} className="col-span-1">
                      <Link to={`/agents/${agent.id}`}>
                        {" "}
                        {/* Changed to react-router-dom Link */}
                        <AgentMiniCard agent={agent} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              pathname.startsWith("/companies") && "text-primary font-medium",
            )}
          >
            Companies
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-6 p-4 md:grid-cols-6">
              <div className="col-span-2 p-2">
                <div className="mb-2 mt-1 text-base font-medium">
                  Find Companies
                </div>
                <div className="space-y-1">
                  {companyMenuItems.map((item) => (
                    <div key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link to={createSearchUrl(item)}>
                          {" "}
                          {/* Use dynamic search URL with filters */}
                          <div className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted">
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium">
                                {item.title}
                              </div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 p-2">
                <div className="mb-3 mt-1 text-base font-medium">
                  Featured Companies
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {companies.slice(0, 4).map((company) => (
                    <div key={company.id} className="col-span-1">
                      <Link to={`/companies/${company.id}`}>
                        {" "}
                        {/* Changed to react-router-dom Link */}
                        <CompanyMiniCard company={company} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Companies Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              pathname.startsWith("/projects") && "text-primary font-medium",
            )}
          >
            Projects
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-6 p-4 md:grid-cols-6">
              <div className="col-span-2 p-2">
                <div className="mb-2 mt-1 text-base font-medium">
                  Project Categories
                </div>
                <div className="space-y-1">
                  {projectMenuItems.map((item) => (
                    <div key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link to={item.href}>
                          <div className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted">
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium">
                                {item.title}
                              </div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 p-2">
                <div className="mb-3 mt-1 text-base font-medium">
                  Feature Projects
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {properties
                    .filter((p) => p.isProject)
                    .slice(0, 4)
                    .map((property) => (
                      <div key={property.id} className="col-span-1">
                        <Link to={`/projects/${property.id}`}>
                          <PropertyMiniCard property={property} />
                        </Link>
                      </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to="/projects"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    View all projects
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              pathname.startsWith("/resources") && "text-primary font-medium",
            )}
          >
            Quick Links
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[800px] p-2">
              <div className="grid grid-cols-3 gap-1">
                {resourceMenuItems.map((item) => (
                  <div key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link to={item.href}>
                        {" "}
                        {/* Changed to react-router-dom Link */}
                        <div className="flex cursor-pointer items-start space-x-3 rounded-md p-3 hover:bg-muted">
                          {item.icon}
                          <div>
                            <div className="text-sm font-medium">
                              {item.title}
                            </div>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
