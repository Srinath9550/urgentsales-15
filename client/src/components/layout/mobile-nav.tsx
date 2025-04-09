import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Home, Search, PlusCircle, Heart, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileNav() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 360);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleFavoritesClick = () => {
    if (user) {
      navigate("/dashboard?tab=saved");
    } else {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your saved properties",
        variant: "default",
      });
      navigate("/auth?redirect=/dashboard?tab=saved");
    }
  };

  // Updated nav items to match the reference image
  const navItems = [
    {
      name: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/",
      action: () => navigate("/"),
    },
    {
      name: "Search",
      icon: <Search className="h-5 w-5" />,
      path: "/properties",
      action: () => navigate("/properties"),
    },
    {
      name: "Post",
      icon: <PlusCircle className={isSmallScreen ? "h-5 w-5" : "h-6 w-6"} />,
      path: user ? "/post-property-free" : "/auth",
      action: () => {
        if (!user) {
          toast({
            title: "Login Required",
            description: "You need to login before posting a property.",
            variant: "default",
          });
          navigate("/auth");
        } else {
          navigate("/post-property-free");
        }
      },
      highlight: true,
    },
    {
      name: "Favorites",
      icon: <Heart className="h-5 w-5" />,
      path: "/dashboard?tab=saved",
      action: handleFavoritesClick,
    },
    {
      name: "Top List",
      icon: <ListFilter className="h-5 w-5" />,
      path: "/top-properties-view/10?category=top10",
      action: () => navigate("/top-properties-view/10?category=top10"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-14 sm:h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={item.action}
            className={`flex flex-col items-center justify-center w-full h-full ${
              location === item.path ? "text-primary" : "text-gray-500"
            } ${item.highlight ? "relative -mt-4 sm:-mt-5" : ""} ${
              isSmallScreen ? "px-1" : "px-2"
            }`}
          >
            {item.highlight ? (
              <div
                className={`absolute ${isSmallScreen ? "-top-4" : "-top-5"} bg-blue-500 text-white ${
                  isSmallScreen ? "p-2" : "p-3"
                } rounded-full shadow-lg`}
              >
                {item.icon}
              </div>
            ) : (
              item.icon
            )}
            <span
              className={`text-xs mt-1 ${item.highlight ? (isSmallScreen ? "mt-5" : "mt-6") : ""} ${
                isSmallScreen ? "text-[10px]" : ""
              }`}
            >
              {isSmallScreen && item.name.length > 6
                ? item.name.substring(0, 6) + "..."
                : item.name}
            </span>
          </button>
        ))}
      </div>
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area-bottom bg-white" />
    </div>
  );
}
