import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useToast } from "@/hooks/use-toast";

const districts = {
  telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hyderabad",
    "Jagitial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal–Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ],
  andhraPradesh: [
    "Alluri Sitarama Raju",
    "Anakapalli",
    "Anantapur",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Konaseema",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
  ],
};

export default function LocationSelector() {
  const [selectedState, setSelectedState] = useState("telangana");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [cityLocation, setCityLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Set default location to Hyderabad
        setCityLocation("Hyderabad");
        setSelectedState("telangana");
        
        // Try to get more precise location if geolocation is available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                
                // First try with OpenStreetMap (free and doesn't require API key)
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                );
                
                if (response.ok) {
                  const data = await response.json();
                  const city = 
                    data.address.city || 
                    data.address.town || 
                    data.address.district || 
                    data.address.suburb || 
                    "Hyderabad";
                  
                  setCityLocation(city);
                  
                  const state = data.address.state;
                  if (state?.toLowerCase().includes("telangana")) {
                    setSelectedState("telangana");
                  } else if (state?.toLowerCase().includes("andhra pradesh")) {
                    setSelectedState("andhraPradesh");
                  }
                }
              } catch (error) {
                console.error("Error with reverse geocoding:", error);
                // Keep default location (already set above)
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              // Keep default location (already set above)
            }
          );
        }
      } finally {
        // Always set loading to false, whether we got location or not
        setIsLoading(false);
      }
    };

    detectUserLocation();
  }, []);

  // Function to handle district selection without changing the navbar display
  const handleDistrictSelect = (state: string, district: string) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    // We're not updating cityLocation here, so the navbar display remains unchanged

    // Optional: You can add logic here to use the selected district for filtering/searching
    // without changing what's displayed in the navbar
    console.log(`Selected district: ${district} in ${state}`);

    // You might want to store this selection in context or state for other components
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-accent px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate max-w-[120px] sm:max-w-[200px]">
              {isLoading ? "Detecting..." : cityLocation}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="top-15 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto z-[100] fixed sm:absolute left-0 right-0 sm:left-auto max-h-[70vh] sm:max-h-[80vh] overflow-y-auto w-full sm:w-[600px] lg:w-[900px] bg-white shadow-lg">
            <div className="p-4 space-y-4">
              {/* Telangana Districts */}
              <div>
                <h4 className="font-semibold text-sm text-primary sticky top-0 bg-white py-2">
                  Telangana
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {districts.telangana.map((district) => (
                    <button
                      key={district}
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-colors whitespace-nowrap
                        ${
                          selectedState === "telangana" &&
                          selectedDistrict === district
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      onClick={() =>
                        handleDistrictSelect("telangana", district)
                      }
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              {/* Andhra Pradesh Districts */}
              <div>
                <h4 className="font-semibold text-sm text-primary sticky top-0 bg-white py-2">
                  Andhra Pradesh
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {districts.andhraPradesh.map((district) => (
                    <button
                      key={district}
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-colors whitespace-nowrap
                        ${
                          selectedState === "andhraPradesh" &&
                          selectedDistrict === district
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      onClick={() =>
                        handleDistrictSelect("andhraPradesh", district)
                      }
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
