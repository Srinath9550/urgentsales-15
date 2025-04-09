import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  PlusCircle,
  Bell,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Star,
  ChevronLeft,
  Headphones,
} from "lucide-react";
import { MegaMenu } from "./mega-menu";
import NotificationCenter from "@/components/ui/notification-center";
import LocationSelector from "./location-selector";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(location !== "/" && window.history.length > 1);
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false); // Close mobile menu on large screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false); // Close menu on logout
  };

  const navigateTo = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false); // Close menu on navigation
  };

  const goBack = () => {
    window.history.back();
    setMobileMenuOpen(false); // Close menu on back
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-1 md:px-2">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Back Button and Logo */}
          <div className="flex items-center space-x-0">
            <Link to="/" className="flex items-center">
              <div className="h-10 sm:h-12 md:h-16 w-auto min-w-[120px] flex items-center">
              <img
                src="/logo.png"
                alt="UrgentSales.in"
                className="h-10 sm:h-12 md:h-16 w-auto"
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.src = "/logo.png";
                }}
              />
              </div>
            </Link>
            <LocationSelector />

            {/* Mobile User Dashboard Icon (only when logged in) */}
            {user && (
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full p-0"
                    >
                      <User className="h-5 w-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="font-medium">
                      {user.name}
                    </DropdownMenuItem>
                    {/* Rest of dropdown content */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Rest of the navbar code remains unchanged */}
          {/* Navigation (Desktop) */}
          <div className="hidden md:flex items-center">
            <MegaMenu />
          </div>

          {/* Post Property Button and Support Icon */}
          <div className="hidden md:flex items-center space-x-0 mr-0">
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
              className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Post Property FREE
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Headphones className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  Support Options
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "tel:+91-9032561155")}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Contact Number</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = "mailto:support@urgentsales.in")
                  }
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = "https://wa.me/+91 9032381155")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="#25D366"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Support</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            {user ? (
              <>
                <NotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <User className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        onClick={() => navigateTo("/dashboard")}
                      >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/post-property-free"
                        onClick={() => navigateTo("/post-property-free")}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Add Property</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/recommendations"
                        onClick={() => navigateTo("/recommendations")}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        <span>Recommendations</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => navigateTo("/admin/dashboard")}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </Link>
              </>
            )}
          </div>

          {/* side menu button  */}
          <button
            className="md:hidden flex items-center text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
          {canGoBack && (
            <button
              onClick={goBack}
              className="w-full text-left mb-2 py-2 flex items-center text-gray-700 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="font-medium">Back</span>
            </button>
          )}
          <MegaMenu isMobile={true} />
        </div>
      )}
    </nav>
  );
}
