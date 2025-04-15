import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

// Define the User interface to match what's used in the auth context
interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  subscriptionLevel?: "free" | "paid" | "premium";
  emailVerified?: boolean;
  phoneVerified?: boolean;
  needsVerification?: boolean;
  phone?: string;
}

import {
  MapPin,
  BedDouble,
  Bath,
  User as UserIcon,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Zap,
  Star,
  Check,
  MessageSquare,
  Badge,
  Square,
  Building,
  Home,
  RefreshCw,
  HardHat,
  Key,
  ClipboardList,
  Loader2,
  Navigation,
  Video,
  Map,
  Ruler,
  Layout,
  Car,
  Compass,
  Wifi,
  Tv,
  Droplets,
  Fan,
  ParkingSquare,
  Armchair,
  Sofa,
  Fence,
  TreePine,
  Landmark,
  Warehouse,
  Factory,
  Store,
  Mail,
  ShieldCheck,
  Dumbbell,
  Waves,
  Utensils,
  X,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import FileUpload, { FileWithPreview } from "@/components/upload/file-upload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OtpInput } from "@/components/ui/otp-input";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Property schema with validation
const propertySchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters" }),
  description: z.string().optional(),
  propertyType: z.string().min(1, { message: "Property type is required" }),
  propertyCategory: z.string().min(1, { message: "Property category is required" }),
  transactionType: z.string().min(1, { message: "Transaction type is required" }),
  availableFromMonth: z.string().optional(),
  availableFromYear: z.string().optional(),
  constructionAge: z.string().optional(),
  price: z.coerce.number().min(100000, { message: "Minimum price is ₹1,00,000" }),
  pricePerUnit: z.coerce.number().optional(),
  totalPrice: z.coerce.number().optional(),
  isUrgentSale: z.boolean().default(false),
  location: z.string().min(5, { message: "Location must be at least 5 characters" }),
  city: z.string().min(3, { message: "City is required" }),
  projectName: z.string().optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, { message: "Invalid pincode" }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  balconies: z.string().optional(),
  floorNo: z.string().optional(),
  totalFloors: z.string().optional(),
  floorsAllowedForConstruction: z.string().optional(),
  furnishedStatus: z.string().optional(),
  roadWidth: z.string().optional(),
  openSides: z.string().optional(),
  area: z.coerce.number().min(100, { message: "Minimum area is 100 sqft" }),
  areaUnit: z.enum(["sqft", "sqyd", "acres", "gunta", "hectare", "marla", "kanal"]),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactPhone: z.string().min(10, { message: "Valid 10-digit phone number required" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }).min(1, { message: "Email is required for OTP verification" }),
  whatsappEnabled: z.boolean().default(true),
  userType: z.enum(["owner", "agent", "builder"]),
  otp: z.string().optional(),
  parking: z.string().optional(),
  facing: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  possessionStatus: z.string().optional(),
  ownershipType: z.string().optional(),
  boundaryWall: z.string().optional(),
  electricityStatus: z.string().optional(),
  waterAvailability: z.string().optional(),
  flooringType: z.string().optional(),
  overlooking: z.string().optional(),
  preferredTenant: z.string().optional(),
  propertyAge: z.string().optional(),
  projectStatus: z.string().optional(),
  launchDate: z.string().optional(),
  reraRegistered: z.string().optional(),
  reraNumber: z.string().optional(),
  landmarks: z.string().optional(),
  brokerage: z.string().optional(),
  noBrokerResponses: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

// Utility function for ordinal suffixes
function getOrdinalSuffix(num: number) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

// Options for various form fields
const bedroomOptions = [
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5", label: "5 Bedrooms" },
  { value: "6", label: "6 Bedrooms" },
  { value: "7", label: "7 Bedrooms" },
  { value: "8", label: "8 Bedrooms" },
  { value: "9", label: "9 Bedrooms" },
  { value: "10+", label: "10+ Bedrooms" },
];

const bathroomOptions = [
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "4", label: "4 Bathrooms" },
  { value: "5+", label: "5+ Bathrooms" },
];

const balconyOptions = [
  { value: "0", label: "No Balcony" },
  { value: "1", label: "1 Balcony" },
  { value: "2", label: "2 Balconies" },
  { value: "3", label: "3 Balconies" },
  { value: "4", label: "4 Balconies" },
  { value: "5+", label: "5+ Balconies" },
];

const floorOptions = [
  { value: "lower-basement", label: "Lower Basement" },
  { value: "upper-basement", label: "Upper Basement" },
  { value: "ground", label: "Ground Floor" },
  ...Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}${getOrdinalSuffix(i + 1)} Floor`,
  })),
  { value: "penthouse", label: "Penthouse" },
];

const roadWidthOptions = [
  { value: "10", label: "10 ft" },
  { value: "20", label: "20 ft" },
  { value: "30", label: "30 ft" },
  { value: "40", label: "40 ft" },
  { value: "50", label: "50 ft" },
  { value: "60", label: "60 ft" },
  { value: "70", label: "70 ft" },
  { value: "80", label: "80 ft" },
  { value: "90", label: "90 ft" },
  { value: "100+", label: "100+ ft" },
];

const openSidesOptions = [
  { value: "1", label: "1 Side" },
  { value: "2", label: "2 Sides" },
  { value: "3", label: "3 Sides" },
  { value: "4", label: "4 Sides" },
];

const constructionAgeOptions = [
  { value: "new", label: "New Construction" },
  { value: "less-than-5", label: "Less than 5 Years" },
  { value: "5-to-10", label: "5 to 10 Years" },
  { value: "greater-than-10", label: "Greater than 10 Years" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

const furnishedStatusOptions = [
  { value: "furnished", label: "Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
];

const parkingOptions = [
  { value: "none", label: "No Parking" },
  { value: "open", label: "Open Parking" },
  { value: "covered", label: "Covered Parking" },
  { value: "basement", label: "Basement Parking" },
  { value: "multiple", label: "Multiple Parking" },
];

const facingOptions = [
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "north-east", label: "North-East" },
  { value: "north-west", label: "North-West" },
  { value: "south-east", label: "South-East" },
  { value: "south-west", label: "South-West" },
];

const amenitiesOptions = [
  { value: "power-backup", label: "Power Backup", icon: <Zap className="h-4 w-4" /> },
  { value: "lift", label: "Lift", icon: <Building className="h-4 w-4" /> },
  { value: "security", label: "24/7 Security", icon: <ShieldCheck className="h-4 w-4" /> },
  { value: "water-supply", label: "24/7 Water Supply", icon: <Droplets className="h-4 w-4" /> },
  { value: "parking", label: "Parking", icon: <ParkingSquare className="h-4 w-4" /> },
  { value: "swimming-pool", label: "Swimming Pool", icon: <Waves className="h-4 w-4" /> },
  { value: "gym", label: "Gym", icon: <Dumbbell className="h-4 w-4" /> },
  { value: "club-house", label: "Club House", icon: <Landmark className="h-4 w-4" /> },
  { value: "play-area", label: "Play Area", icon: <Landmark className="h-4 w-4" /> },
  { value: "garden", label: "Garden/Park", icon: <TreePine className="h-4 w-4" /> },
  { value: "wifi", label: "Wi-Fi", icon: <Wifi className="h-4 w-4" /> },
  { value: "modular-kitchen", label: "Modular Kitchen", icon: <Utensils className="h-4 w-4" /> },
  { value: "wardrobes", label: "Wardrobes", icon: <Armchair className="h-4 w-4" /> },
  { value: "furniture", label: "Furniture", icon: <Sofa className="h-4 w-4" /> },
];

const possessionStatusOptions = [
  { value: "ready-to-move", label: "Ready to Move" },
  { value: "under-construction", label: "Under Construction" },
  { value: "new-launch", label: "New Launch" },
];

const ownershipTypeOptions = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
  { value: "cooperative", label: "Cooperative Society" },
];

const boundaryWallOptions = [
  { value: "none", label: "No Boundary Wall" },
  { value: "partial", label: "Partial Boundary" },
  { value: "complete", label: "Complete Boundary" },
];

const electricityStatusOptions = [
  { value: "no-power", label: "No Power" },
  { value: "partial-power", label: "Partial Power" },
  { value: "full-power", label: "Full Power" },
];

const waterAvailabilityOptions = [
  { value: "no-water", label: "No Water" },
  { value: "borewell", label: "Borewell" },
  { value: "municipal", label: "Municipal Supply" },
  { value: "both", label: "Both Borewell & Municipal" },
];

const flooringTypeOptions = [
  { value: "marble", label: "Marble" },
  { value: "tiles", label: "Tiles" },
  { value: "wood", label: "Wooden" },
  { value: "granite", label: "Granite" },
  { value: "cement", label: "Cement" },
  { value: "other", label: "Other" },
];

const overlookingOptions = [
  { value: "garden", label: "Garden/Park", icon: <TreePine className="h-4 w-4" /> },
  { value: "main-road", label: "Main Road" },
  { value: "pool", label: "Swimming Pool" },
  { value: "lake", label: "Lake/River" },
  { value: "other", label: "Other" },
];

const preferredTenantOptions = [
  { value: "family", label: "Family" },
  { value: "bachelors", label: "Bachelors" },
  { value: "company", label: "Company" },
  { value: "any", label: "Anyone" },
];

const propertyAgeOptions = [
  { value: "0-1", label: "0-1 Years" },
  { value: "1-5", label: "1-5 Years" },
  { value: "5-10", label: "5-10 Years" },
  { value: "10+", label: "10+ Years" },
];

const projectStatusOptions = [
  { value: "planning", label: "Planning Stage" },
  { value: "under-construction", label: "Under Construction" },
  { value: "completed", label: "Completed" },
];

const brokerageOptions = [
  { value: "0", label: "No Brokerage" },
  { value: "0.25", label: "0.25%" },
  { value: "0.5", label: "0.5%" },
  { value: "0.75", label: "0.75%" },
  { value: "1", label: "1%" },
  { value: "1.5", label: "1.5%" },
  { value: "2", label: "2%" },
  { value: "3", label: "3%" },
  { value: "4", label: "4%" },
  { value: "5", label: "5%" },
];

// Property type options by category
const propertyTypeOptions = {
  residential: [
    { value: "flat-apartment", label: "Flat/Apartment", icon: <Building className="h-4 w-4" /> },
    { value: "residential-house", label: "Residential House", icon: <Home className="h-4 w-4" /> },
    { value: "villa", label: "Villa", icon: <Home className="h-4 w-4" /> },
    { value: "builder-floor", label: "Builder Floor Apartment", icon: <Building className="h-4 w-4" /> },
    { value: "residential-land", label: "Residential Land/Plot", icon: <Square className="h-4 w-4" /> },
    { value: "penthouse", label: "Penthouse", icon: <Building className="h-4 w-4" /> },
    { value: "studio-apartment", label: "Studio Apartment", icon: <Building className="h-4 w-4" /> },
  ],
  commercial: [
    { value: "commercial-office", label: "Commercial Office Space", icon: <Building className="h-4 w-4" /> },
    { value: "it-park-office", label: "Office in IT Park/SEZ", icon: <Building className="h-4 w-4" /> },
    { value: "commercial-shop", label: "Commercial Shop", icon: <Store className="h-4 w-4" /> },
    { value: "commercial-showroom", label: "Commercial Showroom", icon: <Store className="h-4 w-4" /> },
    { value: "commercial-land", label: "Commercial Land", icon: <Square className="h-4 w-4" /> },
    { value: "warehouse", label: "Warehouse/Godown", icon: <Warehouse className="h-4 w-4" /> },
    { value: "industrial-land", label: "Industrial Land", icon: <Square className="h-4 w-4" /> },
    { value: "industrial-building", label: "Industrial Building", icon: <Factory className="h-4 w-4" /> },
    { value: "industrial-shed", label: "Industrial Shed", icon: <Fence className="h-4 w-4" /> },
  ],
  agricultural: [
    { value: "agricultural-land", label: "Agricultural/Farm Land", icon: <Square className="h-4 w-4" /> },
    { value: "farm-house", label: "Farm House", icon: <Home className="h-4 w-4" /> },
  ],
};

// Transaction type options by user type and property type
const getTransactionTypeOptions = (userType: string, propertyType: string) => {
  const baseOptions = [
    { value: "new", label: "New Property", icon: <Home className="h-4 w-4" /> },
    { value: "resale", label: "Resale", icon: <RefreshCw className="h-4 w-4" /> },
  ];

  if (userType === "builder") {
    return [
      ...baseOptions,
      { value: "under-construction", label: "Under Construction", icon: <HardHat className="h-4 w-4" /> },
      { value: "ready-to-move", label: "Ready to Move", icon: <Key className="h-4 w-4" /> },
    ];
  }

  if (
    propertyType === "residential-land" ||
    propertyType === "commercial-land" ||
    propertyType === "agricultural-land"
  ) {
    return baseOptions.filter((opt) => opt.value !== "new");
  }

  return baseOptions;
};

// Area unit options by property type
const getAreaUnitOptions = (propertyType: string) => {
  const baseUnits = [
    { value: "sqft", label: "sq.ft" },
    { value: "sqyd", label: "sq.yd" },
  ];

  if (
    propertyType === "agricultural-land" ||
    propertyType === "residential-land" ||
    propertyType === "commercial-land"
  ) {
    return [
      ...baseUnits,
      { value: "acres", label: "acres" },
      { value: "gunta", label: "gunta" },
      { value: "hectare", label: "hectare" },
      { value: "marla", label: "marla" },
      { value: "kanal", label: "kanal" },
    ];
  }

  return baseUnits;
};

// Format price in Indian format (lakhs, crores)
const formatIndianPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
};

export default function PostPropertyFree() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [exteriorImages, setExteriorImages] = useState<FileWithPreview[]>([]);
  const [livingRoomImages, setLivingRoomImages] = useState<FileWithPreview[]>([]);
  const [kitchenImages, setKitchenImages] = useState<FileWithPreview[]>([]);
  const [bedroomImages, setBedroomImages] = useState<FileWithPreview[]>([]);
  const [bathroomImages, setBathroomImages] = useState<FileWithPreview[]>([]);
  const [floorPlanImages, setFloorPlanImages] = useState<FileWithPreview[]>([]);
  const [masterPlanImages, setMasterPlanImages] = useState<FileWithPreview[]>([]);
  const [locationMapImages, setLocationMapImages] = useState<FileWithPreview[]>([]);
  const [otherImages, setOtherImages] = useState<FileWithPreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadErrors, setUploadErrors] = useState<{[key: string]: string}>({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For OTP verification
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState("exterior");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "",
      propertyCategory: "",
      transactionType: "",
      price: 0,
      pricePerUnit: 0,
      totalPrice: 0,
      isUrgentSale: false,
      location: "",
      city: "",
      projectName: "",
      pincode: "",
      bedrooms: "",
      bathrooms: "",
      balconies: "",
      floorNo: "",
      totalFloors: "",
      floorsAllowedForConstruction: "",
      furnishedStatus: "",
      roadWidth: "",
      openSides: "",
      area: undefined,
      areaUnit: "sqft",
      contactName: user?.name || "",
      contactPhone: user?.phone || "",
      whatsappEnabled: true,
      userType: "owner",
      otp: "",
      parking: "",
      facing: "",
      amenities: [],
      possessionStatus: "",
      ownershipType: "",
      boundaryWall: "",
      electricityStatus: "",
      waterAvailability: "",
      flooringType: "",
      overlooking: "",
      preferredTenant: "",
      propertyAge: "",
      projectStatus: "",
      launchDate: "",
      reraRegistered: "",
      reraNumber: "",
      landmarks: "",
      brokerage: "0",
      noBrokerResponses: false,
    },
  });

  const userType = form.watch("userType");
  const propertyCategory = form.watch("propertyCategory");
  const propertyType = form.watch("propertyType");
  const transactionType = form.watch("transactionType");
  const area = form.watch("area");
  const price = form.watch("price");
  const pricePerUnit = form.watch("pricePerUnit");
  const totalPrice = form.watch("totalPrice");

  // Stable price calculation
  useEffect(() => {
    if (area && pricePerUnit) {
      const calculatedTotal = Math.round(pricePerUnit * area);
      form.setValue("totalPrice", calculatedTotal, { shouldValidate: true });
      form.setValue("price", calculatedTotal, { shouldValidate: true });
    }
  }, [area, pricePerUnit, form]);

  useEffect(() => {
    if (area && totalPrice) {
      const calculatedPerUnit = Math.round(totalPrice / area);
      form.setValue("pricePerUnit", calculatedPerUnit, { shouldValidate: true });
      form.setValue("price", totalPrice, { shouldValidate: true });
    }
  }, [area, totalPrice, form]);

  // Reset property type when category changes
  useEffect(() => {
    if (propertyCategory) {
      form.setValue("propertyType", "");
    }
  }, [propertyCategory, form]);

  // Restore saved image data when returning to the image upload step
  useEffect(() => {
    if (currentStep === 3) {
      try {
        const savedImageData = sessionStorage.getItem('propertyImageData');
        if (savedImageData) {
          const parsedData = JSON.parse(savedImageData);

          const restoreFiles = (key: string, setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>) => {
            if (parsedData[key] && Array.isArray(parsedData[key])) {  // Fixed: Added missing closing parenthesis
              setter(parsedData[key].map((item: any) => ({
                file: new File([], item.name, { type: item.type }),
                id: item.id,
                name: item.name,
                size: item.size,
                type: item.type,
                preview: item.preview,
                status: 'success'
              })));
            }
          };

          restoreFiles('exteriorImages', setExteriorImages);
          restoreFiles('livingRoomImages', setLivingRoomImages);
          restoreFiles('kitchenImages', setKitchenImages);
          restoreFiles('bedroomImages', setBedroomImages);
          restoreFiles('bathroomImages', setBathroomImages);
          restoreFiles('floorPlanImages', setFloorPlanImages);
          restoreFiles('masterPlanImages', setMasterPlanImages);
          restoreFiles('locationMapImages', setLocationMapImages);
          restoreFiles('otherImages', setOtherImages);
          restoreFiles('videoFiles', setVideoFiles);
        }
      } catch (error) {
        console.error("Error restoring image data:", error);
      }
    }
  }, [currentStep]);


  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      const allFiles = [
        ...exteriorImages,
        ...livingRoomImages,
        ...kitchenImages,
        ...bedroomImages,
        ...bathroomImages,
        ...floorPlanImages,
        ...masterPlanImages,
        ...locationMapImages,
        ...otherImages,
        ...videoFiles
      ];

      allFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [
    exteriorImages,
    livingRoomImages,
    kitchenImages,
    bedroomImages,
    bathroomImages,
    floorPlanImages,
    masterPlanImages,
    locationMapImages,
    otherImages,
    videoFiles
  ]);

  const sendOtp = async (email: string) => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide a contact email to continue",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSendingOtp(true);
    try {
      console.log(`Sending OTP to email: ${email}`);
      
      // Show a toast to indicate OTP is being sent
      toast({
        title: "Sending Verification Code",
        description: "Please wait while we send a verification code to your email...",
        variant: "default",
      });
      
      // Add a timeout to the fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Server might be busy or unavailable.');
        }
        throw err;
      });
      
      clearTimeout(timeoutId);

      // Check if response exists before trying to parse JSON
      if (!response) {
        throw new Error('No response received from server');
      }

      const responseData = await response.json().catch(err => {
        console.error('Error parsing JSON response:', err);
        return { success: false, message: 'Invalid server response' };
      });
      
      console.log("OTP send response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send OTP');
      }

      // Log the success in a very visible way
      console.log("========================================");
      console.log(`OTP SENT SUCCESSFULLY TO: ${email}`);
      console.log("CHECK SERVER LOGS FOR THE ACTUAL OTP CODE");
      console.log("========================================");

      toast({
        title: "Verification Code Sent",
        description: `We've sent a 6-digit code to ${email}. Please check your inbox and spam folder.`,
        variant: "default",
      });
      
      // For development purposes, show the OTP in the console
      console.log("If you're in development mode, check the server console for the OTP code");
      
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // If the error is about user not found, we'll handle it specially
      if (error instanceof Error && error.message.includes("No user found")) {
        // For free property submission, we'll create a temporary user
        toast({
          title: "Verification Required",
          description: "Please enter the verification code we just sent to your email",
          variant: "default",
        });
        return true; // Still return true to show OTP dialog
      } else {
        console.error("OTP SENDING FAILED:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        
        // Show a more detailed error message for debugging
        toast({
          title: "Technical Details",
          description: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or contact support.`,
          variant: "destructive",
          duration: 10000, // Show for longer
        });
        
        return false;
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      const email = form.getValues().contactEmail || '';
      console.log("Verifying OTP:", otp, "for email:", email);
      
      // Log verification attempt in a very visible way
      console.log("========================================");
      console.log(`VERIFYING OTP: ${otp} FOR EMAIL: ${email}`);
      console.log("========================================");
      
      // Add a timeout to the fetch to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          otp 
        }),
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Server might be busy or unavailable.');
        }
        throw err;
      });
      
      clearTimeout(timeoutId);

      // Check if response exists before trying to parse JSON
      if (!response) {
        throw new Error('No response received from server');
      }

      console.log("OTP verification response status:", response.status);
      
      // Parse the response data with error handling
      const data = await response.json().catch(err => {
        console.error('Error parsing JSON response:', err);
        return { verified: false, message: 'Invalid server response' };
      });
      
      console.log("OTP verification response data:", data);
      
      if (!response.ok) {
        console.error("OTP verification error:", data);
        throw new Error(data.message || 'Failed to verify OTP');
      }

      // If verification was successful, return true
      if (data.verified === true) {
        console.log("========================================");
        console.log("OTP VERIFICATION SUCCESSFUL!");
        console.log("========================================");
        
        toast({
          title: "Verification Successful",
          description: "Your email has been verified successfully.",
          variant: "default",
        });
        
        return true;
      } else {
        console.warn("OTP verification response did not indicate success");
        
        toast({
          title: "Verification Failed",
          description: data.message || "The verification code was not accepted. Please try again.",
          variant: "destructive",
        });
        
        return false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      console.error("========================================");
      console.error("OTP VERIFICATION FAILED:", error);
      console.error("========================================");
      
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
      
      // Show a more detailed error message for debugging
      toast({
        title: "Technical Details",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or contact support.`,
        variant: "destructive",
        duration: 10000, // Show for longer
      });
      
      return false;
    }
  };
  
  const handleOtpSubmit = async (otp: string) => {
    try {
      setIsLoading(true);
      
      // Show a toast to indicate verification is in progress
      toast({
        title: "Verifying OTP",
        description: "Please wait while we verify your OTP...",
      });
      
      // Check if we're in development mode and the OTP is "123456" (test OTP)
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      // In development mode, accept "123456" as a valid OTP for testing
      if (isDevelopment && otp === "123456") {
        console.log("DEVELOPMENT MODE: Using test OTP 123456");
        setOtpVerified(true);
        setShowOtpModal(false);
        
        toast({
          title: "Verification Successful (Dev Mode)",
          description: "Test OTP accepted. Submitting your property...",
          variant: "default",
        });
        
        console.log("About to submit form after test OTP verification");
        
        // Use setTimeout to ensure state updates have completed
        setTimeout(() => {
          console.log("Submitting form after delay");
          // Get the current form values
          const formValues = form.getValues();
          console.log("Current form values:", formValues);
          
          // Manually call onSubmit with the form values
          onSubmit(formValues, new Event('submit') as React.FormEvent);
        }, 500);
        
        return;
      }
      
      // Normal OTP verification flow
      const isVerified = await verifyOtp(otp);
      if (isVerified) {
        console.log("OTP verified successfully");
        setOtpVerified(true);
        setShowOtpModal(false);
        
        toast({
          title: "Verification Successful",
          description: "Your email has been verified. Submitting your property...",
          variant: "default",
        });
        
        console.log("About to submit form after OTP verification");
        
        // Use setTimeout to ensure state updates have completed
        setTimeout(() => {
          console.log("Submitting form after delay");
          // Get the current form values
          const formValues = form.getValues();
          console.log("Current form values:", formValues);
          
          // Manually call onSubmit with the form values
          onSubmit(formValues, new Event('submit') as React.FormEvent);
        }, 500);
      } else {
        setIsLoading(false);
        
        // Check if we're in development mode and show a special message
        if (isDevelopment) {
          toast({
            title: "Verification Failed",
            description: "The OTP you entered is invalid. In development mode, you can use '123456' as a test OTP.",
            variant: "destructive",
            duration: 10000, // Show for longer
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "Invalid OTP. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error in OTP verification:", error);
      
      // Check if we're in development mode and show a special message
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Verification Error",
          description: `${error instanceof Error ? error.message : "Failed to verify OTP"}. In development mode, you can use '123456' as a test OTP.`,
          variant: "destructive",
          duration: 10000, // Show for longer
        });
      } else {
        toast({
          title: "Verification Error",
          description: error instanceof Error ? error.message : "Failed to verify OTP",
          variant: "destructive",
        });
      }
    }
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
      return;
    }

    setIsDetectingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
      );
      const data = await response.json();

      if (data.address) {
        const { city, town, village, county, state, postcode } = data.address;
        const detectedCity = city || town || village || county;
        const detectedLocation = [
          data.address.road,
          data.address.suburb,
          detectedCity,
        ].filter(Boolean).join(", ");

        form.setValue("city", detectedCity || "");
        form.setValue("location", detectedLocation || "");
        form.setValue("pincode", postcode || "");

        toast({
          title: "Location detected",
          description: `Your location has been set to ${detectedLocation}`,
          variant: "default",
        });
      } else {
        throw new Error("Could not determine address");
      }
    } catch (error) {
      toast({
        title: "Location detection failed",
        description: "Could not determine your location. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const { mutate: submitProperty, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("Starting property submission with FormData");
      
      // Add a debug flag to log the request on the server
      formData.append('debug', 'true');
      
      // First, collect all the server URLs from uploaded images
      const imageUrls: string[] = [];
      
      // Helper function to extract server URLs from each image category
      const extractServerUrls = (images: FileWithPreview[]) => {
        return images
          .filter(img => img.serverUrl) // Only include images that have been uploaded
          .map(img => img.serverUrl as string);
      };
      
      // Extract URLs from all image categories
      imageUrls.push(...extractServerUrls(exteriorImages));
      imageUrls.push(...extractServerUrls(livingRoomImages));
      imageUrls.push(...extractServerUrls(kitchenImages));
      imageUrls.push(...extractServerUrls(bedroomImages));
      imageUrls.push(...extractServerUrls(bathroomImages));
      imageUrls.push(...extractServerUrls(floorPlanImages));
      imageUrls.push(...extractServerUrls(masterPlanImages));
      imageUrls.push(...extractServerUrls(locationMapImages));
      imageUrls.push(...extractServerUrls(otherImages));
      
      // Add the image URLs to the form data
      if (imageUrls.length > 0) {
        console.log(`Adding ${imageUrls.length} uploaded image URLs to form data`);
        
        // Clean up any URLs that might have curly braces
        const cleanedUrls = imageUrls.map(url => {
          if (typeof url === 'string' && url.startsWith('{') && url.endsWith('}')) {
            return url.substring(1, url.length - 1);
          }
          return url;
        });
        
        console.log('Cleaned image URLs:', cleanedUrls);
        
        // Add as JSON string
        formData.append('imageUrls', JSON.stringify(cleanedUrls));
        
        // Also add individual URLs for debugging
        cleanedUrls.forEach((url, index) => {
          formData.append(`imageUrl_${index}`, url);
        });
        
        // Add exterior URLs separately if available
        const exteriorUrls = extractServerUrls(exteriorImages);
        if (exteriorUrls.length > 0) {
          exteriorUrls.forEach((url, index) => {
            console.log(`Found exterior URL at index ${index}: ${url}`);
            formData.append(`exterior_urls_${index}`, url);
          });
        }
      }
      
      // Add a debug flag
      formData.append('debug', 'true');
      
      // Add a timestamp to prevent caching issues
      formData.append('timestamp', Date.now().toString());
      
      // Add a flag to indicate this is a verified submission
      formData.append('emailVerified', 'true');
      
      // Log the FormData entries for debugging
      console.log("Final FormData entries before submission:");
      for (const pair of formData.entries()) {
        if (typeof pair[1] === 'string') {
          console.log(pair[0], pair[1]);
        } else {
          console.log(pair[0], 'File object');
        }
      }
      
      try {
        // Log the form data entries for debugging
        console.log("Form data entries being sent to server:");
        for (const pair of formData.entries()) {
          console.log(pair[0], typeof pair[1] === 'string' ? pair[1] : 'File object');
        }
        
        // Don't manually set Content-Type with FormData as the browser needs to set the boundary
        const response = await fetch('/api/properties/free', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || "Failed to submit property");
          } catch (e) {
            throw new Error("Failed to submit property: " + response.status);
          }
        }
        
        const data = await response.json();
        console.log("Response data:", data);
        return data;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    
    onSuccess: (data) => {
      console.log("Property submitted successfully:", data);
      
      // Ensure loading state is turned off
      setIsLoading(false);
      
      // Invalidate cached properties to refresh listings if needed
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/free"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/premium"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties/urgent"] });
      
      // Log success in a very visible way
      console.log("========================================");
      console.log("PROPERTY SUBMISSION SUCCESSFUL!");
      console.log("Property ID:", data?.id);
      console.log("========================================");
      
      // Always show success dialog first to ensure user gets feedback
      setShowSuccessDialog(true);
      
      // After a short delay, redirect to success page if we have a property ID
      if (data && data.id) {
        setTimeout(() => {
          setLocation(`/submission-success?id=${data.id}`);
        }, 2000); // 2 second delay to ensure dialog is seen
      }
    },
    onError: (error: any) => {
      console.error("Property submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit property",
        variant: "destructive",
      });
    },
  });

  // Enhanced file upload handler with progress tracking
  const handleFileUpload = (
    files: FileWithPreview[], 
    category: string, 
    setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>
  ) => {
    setUploadErrors(prev => ({...prev, [category]: ''}));
    
    // Ensure each file has the required properties
    const currentFiles = files.map(file => {
      // Make sure we have all required properties of FileWithPreview
      console.log("Uploaded file server URLs:", file.serverUrl);
      return {
        file: file.file,
        id: file.id,
        preview: file.preview,
        serverUrl: file.serverUrl, // Include serverUrl if it exists
        status: file.status || 'success',
        name: file.file.name, // Set name from file
        size: file.file.size, // Set size from file
        type: file.file.type, // Set type from file
      };
    });
    
    setter(currentFiles);

    // Log the files for debugging
    console.log(`${category} files:`, currentFiles);
    
    // Check for serverUrls
    const serverUrls = currentFiles
      .filter(file => file.status === 'success' && file.serverUrl)
      .map(file => file.serverUrl);
    
    if (serverUrls.length > 0) {
      console.log(`${category} server URLs:`, serverUrls);
    }

    currentFiles.forEach(file => {
      const fileId = file.id;
      let progress = 0;

      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: progress
        }));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    });
  };

  // Function to remove a file with proper cleanup
  const handleFileRemove = (
    fileId: string, 
    category: string,
    files: FileWithPreview[], 
    setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>
  ) => {
    setter(files.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = {...prev};
      delete newProgress[fileId];
      return newProgress;
    });
  };

  // Function to get total image count
  const getTotalImageCount = () => {
    return [
      ...exteriorImages,
      ...livingRoomImages,
      ...kitchenImages,
      ...bedroomImages,
      ...bathroomImages,
      ...floorPlanImages,
      ...masterPlanImages,
      ...locationMapImages,
      ...otherImages,
    ].length;
  };

  const onSubmit = async (data: PropertyFormValues, event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Form submission started with data:", data);
    
    // Log the form data for debugging
    console.log("Form data to be submitted:", JSON.stringify(data, null, 2));

    // Validate email is present
    if (!data.contactEmail) {
      toast({
        title: "Email Required",
        description: "Please provide a contact email to continue",
        variant: "destructive",
      });
      return;
    }

    // If OTP is not verified, send OTP and show verification modal
    if (!otpVerified) {
      console.log("OTP not verified yet, sending OTP to:", data.contactEmail);
      toast({
        title: "Verification Required",
        description: "We need to verify your email before submitting",
        variant: "default",
      });

      setIsLoading(true); // Show loading state while sending OTP
      const otpSent = await sendOtp(data.contactEmail);
      setIsLoading(false);

      if (otpSent) {
        console.log("OTP sent successfully, showing OTP modal");
        setShowOtpModal(true);
      } else {
        console.error("Failed to send OTP");
        toast({
          title: "Error",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    // If we get here, OTP is verified, proceed with form submission
    console.log("OTP verified, proceeding with form submission");
    console.log("Form data to submit:", data);

    try {
      const formData = new FormData();

      // Map form values to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== "otp") {
          formData.append(key, value.toString());
        }
      });

      // Add images to FormData
      const addImagesToFormData = (images: FileWithPreview[], prefix: string) => {
        images.forEach((file, index) => {
          if (file.serverUrl) {
            formData.append(`${prefix}_urls_${index}`, file.serverUrl);
          } else if (file.file) {
            formData.append(`${prefix}_${index}`, file.file);
          }
        });
      };

      addImagesToFormData(exteriorImages, "exterior");
      addImagesToFormData(livingRoomImages, "livingRoom");
      addImagesToFormData(kitchenImages, "kitchen");
      addImagesToFormData(bedroomImages, "bedroom");
      addImagesToFormData(bathroomImages, "bathroom");
      addImagesToFormData(floorPlanImages, "floorPlan");
      addImagesToFormData(masterPlanImages, "masterPlan");
      addImagesToFormData(locationMapImages, "locationMap");
      addImagesToFormData(otherImages, "other");

      console.log("Submitting property with FormData:", formData);
      submitProperty(formData);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderImage = (file: FileWithPreview) => {
    return (
      <img
        key={file.id}
        src={file.serverUrl || file.preview}
        alt={file.name}
        className="w-full h-full object-cover"
      />
    );
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>

          <FormField
  control={form.control}
  name="userType"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-700">You Are*</FormLabel>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <RadioGroupItem value="owner" />
          </FormControl>
          <FormLabel className="font-normal flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Owner
          </FormLabel>
        </FormItem>
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <RadioGroupItem value="agent" />
          </FormControl>
          <FormLabel className="font-normal flex items-center gap-2">
            <Badge className="h-4 w-4" />
            Agent
          </FormLabel>
        </FormItem>
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <RadioGroupItem value="builder" />
          </FormControl>
          <FormLabel className="font-normal flex items-center gap-2">
            <Building className="h-4 w-4" />
            Builder
          </FormLabel>
        </FormItem>
      </RadioGroup>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="propertyCategory"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-700">Property Category*</FormLabel>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <RadioGroupItem value="residential" />
          </FormControl>
          <FormLabel className="font-normal flex items-center gap-2">
            <Home className="h-4 w-4" />
            Residential
          </FormLabel>
        </FormItem>
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <RadioGroupItem value="commercial" />
          </FormControl>
          <FormLabel className="font-normal flex items-center gap-2">
            <Store className="h-4 w-4" />
            Commercial
          </FormLabel>
        </FormItem>
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <RadioGroupItem value="agricultural" />
          </FormControl>
          <FormLabel className="font-normal flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Agricultural
          </FormLabel>
        </FormItem>
      </RadioGroup>
      <FormMessage />
    </FormItem>
  )}
/>

{propertyCategory && (
  <FormField
    control={form.control}
    name="propertyType"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-700">Property Type*</FormLabel>
        <RadioGroup
          onValueChange={field.onChange}
          value={field.value}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {propertyTypeOptions[
            propertyCategory as keyof typeof propertyTypeOptions
          ]?.map((option) => (
            <FormItem
              key={option.value}
              className="flex items-center gap-3"
            >
              <FormControl>
                <RadioGroupItem value={option.value} id={option.value} />
              </FormControl>
              <FormLabel
                htmlFor={option.value}
                className="font-normal flex items-center gap-2"
              >
                {option.icon || <Square className="h-4 w-4" />}
                {option.label}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
        <FormMessage />
      </FormItem>
    )}
  />
)}

{propertyType && (
  <FormField
    control={form.control}
    name="transactionType"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-700">Transaction Type*</FormLabel>
        <RadioGroup
          onValueChange={field.onChange}
          value={field.value}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {getTransactionTypeOptions(userType, propertyType).map((option) => (
            <FormItem
              key={option.value}
              className="flex items-center gap-3"
            >
              <FormControl>
                <RadioGroupItem
                  value={option.value}
                  id={`transaction-${option.value}`}
                />
              </FormControl>
              <FormLabel
                htmlFor={`transaction-${option.value}`}
                className="font-normal flex items-center gap-2"
              >
                {option.icon || <Square className="h-4 w-4" />}
                {option.label}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
        <FormMessage />
      </FormItem>
    )}
  />
)}


            {transactionType === "under-construction" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="availableFromMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Available From (Month)*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month.toLowerCase()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableFromYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Available From (Year)*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {transactionType === "ready-to-move" && (
              <FormField
                control={form.control}
                name="constructionAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Age of Construction*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select age of construction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {constructionAgeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Listing Title*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        propertyType === "flat-apartment"
                          ? "e.g. Beautiful 3BHK Apartment in Gachibowli"
                          : propertyType === "residential-land"
                            ? "e.g. Prime Residential Plot in Hitech City"
                            : propertyType === "commercial-office"
                              ? "e.g. Premium Office Space in Financial District"
                              : "e.g. Well-maintained property in prime location"
                      }
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Be specific about location and key features</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        propertyType === "flat-apartment"
                          ? "Describe the apartment layout, amenities, society features, nearby facilities..."
                          : propertyType === "residential-land"
                            ? "Describe the plot dimensions, location advantages, nearby developments..."
                            : propertyType === "commercial-office"
                              ? "Describe the office space, facilities, parking, nearby business hubs..."
                              : "Describe your property in detail..."
                      }
                      rows={5}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include amenities, nearby facilities, and unique features (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {propertyCategory === "residential" &&
              !["residential-land", "studio-apartment"].includes(propertyType) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Bedrooms*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select bedrooms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bedroomOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Bathrooms*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select bathrooms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bathroomOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="balconies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Balconies</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select balconies" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {balconyOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

            {propertyCategory === "residential" &&
              propertyType === "studio-apartment" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Studio apartments typically have 1 bathroom and no separate bedrooms.
                  </p>
                </div>
              )}

            {propertyCategory === "residential" &&
              !["residential-land", "studio-apartment"].includes(propertyType) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="floorNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Floor No.</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select floor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {floorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalFloors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Total Floors</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select total floors" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map(
                              (num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} Floors
                                </SelectItem>
                              ),
                            )}
                            <SelectItem value="20+">20+ Floors</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="furnishedStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Furnished Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {furnishedStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

            {(propertyType === "residential-land" ||
              propertyType === "commercial-land" ||
              propertyType === "agricultural-land") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="roadWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Width of Road Facing the Plot</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select road width" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roadWidthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="openSides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Number of Open Sides</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select open sides" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {openSidesOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {propertyCategory === "commercial" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="possessionStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Possession Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select possession status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {possessionStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownershipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Ownership Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select ownership type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ownershipTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {propertyCategory === "agricultural" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="boundaryWall"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Boundary Wall</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select boundary wall status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {boundaryWallOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="electricityStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Electricity Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select electricity status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {electricityStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Area*</FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 1500"
                          className="h-12 rounded-r-none"
                          {...field}
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="areaUnit"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 w-[100px] rounded-l-none border-l-0">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getAreaUnitOptions(propertyType).map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Price per Sq-ft (₹)*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 5000"
                        className="h-12"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          if (area && value) {
                            form.setValue("totalPrice", Math.round(parseFloat(value) * area), { shouldValidate: true });
                            form.setValue("price", Math.round(parseFloat(value) * area), { shouldValidate: true });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Total Price (₹)*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g. 7500000"
                          className="h-12 pr-24"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            if (area && value) {
                              form.setValue("pricePerUnit", Math.round(parseFloat(value) / area), { shouldValidate: true });
                              form.setValue("price", parseFloat(value), { shouldValidate: true });
                            }
                          }}
                        />
                        {field.value && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                            {formatIndianPrice(parseFloat(field.value))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Parking</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select parking type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parkingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="facing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Facing Direction</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select facing direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-gray-700">Amenities</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesOptions.map((amenity) => (
                  <FormField
                    key={amenity.value}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), amenity.value])
                                  : field.onChange(field.value?.filter((value) => value !== amenity.value) ?? []);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            {amenity.icon || <Square className="h-4 w-4" />}
                            {amenity.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </div>

            {userType === "agent" && (
              <div className="space-y-4">
                <FormLabel className="text-gray-700">Brokerage (Brokers only)</FormLabel>
                <RadioGroup
                  defaultValue="0"
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  onValueChange={(value) => form.setValue("brokerage", value)}
                >
                  {brokerageOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`brokerage-${option.value}`} />
                      <label htmlFor={`brokerage-${option.value}`} className="text-sm font-medium leading-none">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                <FormField
                  control={form.control}
                  name="noBrokerResponses"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I am not interested in getting responses from brokers
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {user?.subscriptionLevel === "premium" && (
              <FormField
                control={form.control}
                name="isUrgentSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-blue-50">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-semibold text-blue-800 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        Urgency Sale
                      </FormLabel>
                      <FormDescription className="text-blue-700">
                        List with a 25% discount to attract quick buyers. Your property will be highlighted in search results.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  form
                    .trigger([
                      "userType",
                      "propertyCategory",
                      "propertyType",
                      "transactionType",
                      "title",
                      "area",
                      "pricePerUnit",
                      "totalPrice",
                    ])
                    .then((isValid) => {
                      if (isValid) {
                        setCurrentStep(2);
                        formTopRef.current?.scrollIntoView({ behavior: "smooth" });
                      }
                    });
                }}
              >
                Next: Location
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">City*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city name" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === "builder" && (
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Project Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of your project" className="h-12" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of your housing project or development
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {userType !== "builder" && (
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Name of Project/Society</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of Project/Society" className="h-12" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of your housing project, society, or community
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Address*</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Textarea
                        placeholder={
                          userType === "builder"
                            ? "Project address, street, landmark..."
                            : "Building name, street, landmark..."
                        }
                        rows={3}
                        className="min-h-[100px] flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-[100px]"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                    >
                      {isDetectingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Navigation className="h-4 w-4" />
                      )}
                      <span className="ml-2">Detect</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landmarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nearby Landmarks</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Near Metro Station, Opposite Mall, etc."
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Help buyers locate your property easily</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Pincode*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 500032" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === "builder" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="projectStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Project Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reraRegistered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">RERA Registered</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Is project RERA registered?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {userType === "builder" && form.watch("reraRegistered") === "yes" && (
              <FormField
                control={form.control}
                name="reraNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">RERA Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter RERA registration number"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentStep(1);
                  formTopRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  form
                    .trigger(["city", "location", "pincode"])
                    .then((isValid) => {
                      if (isValid) {
                        setCurrentStep(3);
                        formTopRef.current?.scrollIntoView({ behavior: "smooth" });
                      }
                    });
                }}
              >
                Next: Photos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Property Media</h2>
            <p className="text-gray-600">
              High-quality photos significantly increase buyer interest. Upload clear images of your property.
            </p>
            

            <Tabs defaultValue="exterior" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-1 mb-6 h-auto">
                <TabsTrigger value="exterior" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Exterior
                  {exteriorImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{exteriorImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="livingRoom" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Living Room
                  {livingRoomImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{livingRoomImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="kitchen" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Kitchen
                  {kitchenImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{kitchenImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bedroom" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Bedroom
                  {bedroomImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{bedroomImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bathroom" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Bathroom
                  {bathroomImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{bathroomImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="floorPlan" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Floor Plan
                  {floorPlanImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{floorPlanImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                {(propertyType === "residential-land" ||
                  propertyType === "commercial-land" ||
                  propertyType === "agricultural-land") && (
                  <TabsTrigger value="masterPlan" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                    Master Plan
                    {masterPlanImages.length > 0 && (
                      <ShadcnBadge variant="secondary" className="ml-1">{masterPlanImages.length}</ShadcnBadge>
                    )}
                  </TabsTrigger>
                )}
                <TabsTrigger value="locationMap" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Location Map
                  {locationMapImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{locationMapImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="other" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Other
                  {otherImages.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{otherImages.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-xs md:text-sm py-2 px-2 md:px-3 h-auto">
                  Videos
                  {videoFiles.length > 0 && (
                    <ShadcnBadge variant="secondary" className="ml-1">{videoFiles.length}</ShadcnBadge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="border rounded-lg p-4 bg-gray-50">
                <TabsContent value="exterior">
                  <div>
                    <FormDescription className="mb-4">
                      Upload exterior/front view photos (Max 5 images)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {exteriorImages.length > 0 ? `${exteriorImages.length} of 5 images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={5}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'exterior', setExteriorImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'exterior', exteriorImages, setExteriorImages)}
                      files={exteriorImages}
                      
                    />
                    {uploadErrors.exterior && (
                      <p className="text-red-500 text-sm mt-2">{uploadErrors.exterior}</p>
                    )}

                    {exteriorImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {exteriorImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'exterior', exteriorImages, setExteriorImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {uploadProgress[file.id] && uploadProgress[file.id] < 100 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <div className="bg-white rounded-md p-2 w-4/5">
                                    <Progress value={uploadProgress[file.id]} className="h-2" />
                                    <p className="text-xs text-center mt-1">{uploadProgress[file.id]}%</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="livingRoom">
                  <div>
                    <FormDescription className="mb-4">
                      Upload living room photos (Max 3 images)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {livingRoomImages.length > 0 ? `${livingRoomImages.length} of 3 images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={3}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'livingRoom', setLivingRoomImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'livingRoom', livingRoomImages, setLivingRoomImages)}
                      files={livingRoomImages}
                      
                    />

                    {livingRoomImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {livingRoomImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'livingRoom', livingRoomImages, setLivingRoomImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="kitchen">
                  <div>
                    <FormDescription className="mb-4">
                      Upload kitchen photos (Max 3 images)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {kitchenImages.length > 0 ? `${kitchenImages.length} of 3 images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={3}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'kitchen', setKitchenImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'kitchen', kitchenImages, setKitchenImages)}
                      files={kitchenImages}
                      
                    />

                    {kitchenImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {kitchenImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'kitchen', kitchenImages, setKitchenImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bedroom">
                  <div>
                    <FormDescription className="mb-4">
                      Upload bedroom photos (Max 5 images per bedroom)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {bedroomImages.length > 0 ? `${bedroomImages.length} of ${5 * parseInt(form.getValues().bedrooms || "1")} images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={5 * parseInt(form.getValues().bedrooms || "1")}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'bedroom', setBedroomImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'bedroom', bedroomImages, setBedroomImages)}
                      files={bedroomImages}
                      
                    />

                    {bedroomImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {bedroomImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'bedroom', bedroomImages, setBedroomImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="bathroom">
                  <div>
                    <FormDescription className="mb-4">
                      Upload bathroom photos (Max 3 images per bathroom)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {bathroomImages.length > 0 ? `${bathroomImages.length} of ${3 * parseInt(form.getValues().bathrooms || "1")} images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={3 * parseInt(form.getValues().bathrooms || "1")}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'bathroom', setBathroomImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'bathroom', bathroomImages, setBathroomImages)}
                      files={bathroomImages}
                      
                    />

                    {bathroomImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {bathroomImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'bathroom', bathroomImages, setBathroomImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="floorPlan">
                  <div>
                    <FormDescription className="mb-4">
                      Upload floor plans or layout diagrams (Max 3 images)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {floorPlanImages.length > 0 ? `${floorPlanImages.length} of 3 images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={3}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'floorPlan', setFloorPlanImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'floorPlan', floorPlanImages, setFloorPlanImages)}
                      files={floorPlanImages}
                      
                    />

                    {floorPlanImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {floorPlanImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'floorPlan', floorPlanImages, setFloorPlanImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {(propertyType === "residential-land" ||
                  propertyType === "commercial-land" ||
                  propertyType === "agricultural-land") && (
                  <TabsContent value="masterPlan">
                    <div>
                      <FormDescription className="mb-4">
                        Upload master plan or site layout if available (Max 3 images)
                      </FormDescription>
                      <div className="mb-2 text-sm text-gray-600">
                        {masterPlanImages.length > 0 ? `${masterPlanImages.length} of 3 images uploaded` : "No images uploaded yet"}
                      </div>
                      <FileUpload
                        maxFiles={3}
                        maxSize={20 * 1024 * 1024}
                        accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                        onFilesSelected={(files) => handleFileUpload(files, 'masterPlan', setMasterPlanImages)}
                        onFileRemoved={(fileId) => handleFileRemove(fileId, 'masterPlan', masterPlanImages, setMasterPlanImages)}
                        files={masterPlanImages}
                        
                      />

                      {masterPlanImages.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {masterPlanImages.map((file) => (
                              <div key={file.id} className="relative group">
                                <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                  {renderImage(file)}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                  {file.name}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove(file.id, 'masterPlan', masterPlanImages, setMasterPlanImages)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Remove image"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="locationMap">
                  <div>
                    <FormDescription className="mb-4">
                      Upload location maps or nearby landmarks (Max 2 images)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {locationMapImages.length > 0 ? `${locationMapImages.length} of 2 images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={2}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'locationMap', setLocationMapImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'locationMap', locationMapImages, setLocationMapImages)}
                      files={locationMapImages}
                      
                    />

                    {locationMapImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {locationMapImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'locationMap', locationMapImages, setLocationMapImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="other">
                  <div>
                    <FormDescription className="mb-4">
                      Upload any other relevant photos (Max 10 images)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {otherImages.length > 0 ? `${otherImages.length} of 10 images uploaded` : "No images uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={10}
                      maxSize={20 * 1024 * 1024}
                      accepts={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
                      onFilesSelected={(files) => handleFileUpload(files, 'other', setOtherImages)}
                      onFileRemoved={(fileId) => handleFileRemove(fileId, 'other', otherImages, setOtherImages)}
                      files={otherImages}
                      
                    />

                    {otherImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {otherImages.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-gray-100">
                                {renderImage(file)}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(file.id, 'other', otherImages, setOtherImages)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="videos">
                  <div>
                    <FormDescription className="mb-4">
                      Upload property walkthrough videos (max 30MB each, Max 2 videos)
                    </FormDescription>
                    <div className="mb-2 text-sm text-gray-600">
                      {videoFiles.length > 0 ? `${videoFiles.length} of 2 videos uploaded` : "No videos uploaded yet"}
                    </div>
                    <FileUpload
                      maxFiles={2}
                      maxSize={30 * 1024 * 1024}
                      accepts={["video/mp4", "video/mpeg", "video/webm", "video/quicktime"]}
                      onFilesSelected={(files) => {
                        const processedFiles = files.map(file => ({
                          ...file,
                          preview: URL.createObjectURL(file.file || file),
                          name: file.name,
                          id: file.id || crypto.randomUUID()
                        }));
                        setVideoFiles(processedFiles);
                      }}
                      onFileRemoved={(fileId) => {
                        const fileToRemove = videoFiles.find(f => f.id === fileId);
                        if (fileToRemove?.preview) {
                          URL.revokeObjectURL(fileToRemove.preview);
                        }
                        setVideoFiles(prev => prev.filter(file => file.id !== fileId));
                      }}
                      files={videoFiles}
                      
                    />

                    {videoFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Uploaded Videos:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {videoFiles.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="aspect-video rounded-md overflow-hidden border bg-gray-100">
                                <video 
                                  src={file.preview} 
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (file.preview) {
                                    URL.revokeObjectURL(file.preview);
                                  }
                                  setVideoFiles(prev => prev.filter(f => f.id !== file.id));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove video"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-2">Upload Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Exterior:</span>
                  <ShadcnBadge variant={exteriorImages.length > 0 ? "default" : "outline"}>
                    {exteriorImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Living Room:</span>
                  <ShadcnBadge variant={livingRoomImages.length > 0 ? "default" : "outline"}>
                    {livingRoomImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Kitchen:</span>
                  <ShadcnBadge variant={kitchenImages.length > 0 ? "default" : "outline"}>
                    {kitchenImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Bedroom:</span>
                  <ShadcnBadge variant={bedroomImages.length > 0 ? "default" : "outline"}>
                    {bedroomImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Bathroom:</span>
                  <ShadcnBadge variant={bathroomImages.length > 0 ? "default" : "outline"}>
                    {bathroomImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Floor Plan:</span>
                  <ShadcnBadge variant={floorPlanImages.length > 0 ? "default" : "outline"}>
                    {floorPlanImages.length}
                  </ShadcnBadge>
                </div>
                {(propertyType === "residential-land" ||
                  propertyType === "commercial-land" ||
                  propertyType === "agricultural-land") && (
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span>Master Plan:</span>
                    <ShadcnBadge variant={masterPlanImages.length > 0 ? "default" : "outline"}>
                      {masterPlanImages.length}
                    </ShadcnBadge>
                  </div>
                )}
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Location Map:</span>
                  <ShadcnBadge variant={locationMapImages.length > 0 ? "default" : "outline"}>
                    {locationMapImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Other:</span>
                  <ShadcnBadge variant={otherImages.length > 0 ? "default" : "outline"}>
                    {otherImages.length}
                  </ShadcnBadge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Videos:</span>
                  <ShadcnBadge variant={videoFiles.length > 0 ? "default" : "outline"}>
                    {videoFiles.length}
                  </ShadcnBadge>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Total images: <span className="font-medium">{getTotalImageCount()}</span>
                </div>
                {getTotalImageCount() === 0 && (
                  <div className="text-amber-600 text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Please upload at least one image
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Accepted formats are .jpg, .gif, .bmp & .png.</p>
              <p>Maximum size allowed is 20 MB. Minimum dimension allowed 800*400 Pixel</p>
              <p className="mt-2">You can also email them to us for uploading at support@UrgentSales.in</p>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentStep(2);
                  formTopRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  const totalImages = getTotalImageCount();

                  if (totalImages >= 1) {
                    const imageData: Record<string, FileWithPreview[]> = {
                      exteriorImages,
                      livingRoomImages,
                      kitchenImages,
                      bedroomImages,
                      bathroomImages,
                      floorPlanImages,
                      masterPlanImages,
                      locationMapImages,
                      otherImages,
                      videoFiles
                    };

                    try {
                      sessionStorage.setItem('propertyImageData', JSON.stringify(
                        Object.entries(imageData).reduce<Record<string, any>>((acc, [key, files]) => {
                          acc[key] = files.map(file => ({
                            id: file.id,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            preview: file.preview
                          }));
                          return acc;
                        }, {})
                      ));
                    } catch (error) {
                      console.error("Error saving image data:", error);
                    }

                    setCurrentStep(4);
                    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    toast({
                      title: "Photos Required",
                      description: "Please upload at least one photo of your property",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Next: Contact Info
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
                  {user && 'avatar' in user && user.avatar && typeof user.avatar === 'string' ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <UserIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{user?.name || "Your Profile"}</h3>
                  <p className="text-gray-600 mb-2">{user?.email}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Complete your profile information below to help buyers contact you
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Your Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="10-digit mobile number" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Email Address* (for OTP verification)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        className="h-12"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We'll send an OTP to this email to verify your property submission
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whatsappEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-green-50">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-semibold text-green-800 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      Enable WhatsApp Contact
                    </FormLabel>
                    <FormDescription className="text-green-700">
                      Allow buyers to contact you directly via WhatsApp for faster communication
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentStep(3);
                  formTopRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
                onClick={() => {
                  console.log("Submit button clicked");
                  // Validate the form fields before submission
                  form.trigger(["contactName", "contactPhone", "contactEmail"]).then((isValid) => {
                    if (isValid) {
                      console.log("Form is valid, submitting...");
                      const formValues = form.getValues();
                      onSubmit(formValues, new Event('submit') as React.FormEvent);
                    } else {
                      console.log("Form validation failed");
                      toast({
                        title: "Validation Error",
                        description: "Please fill in all required fields correctly",
                        variant: "destructive",
                      });
                    }
                  });
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Property"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-4xl" ref={formTopRef}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              List Your Property for Sale
            </h1>
            <p className="mt-2 text-gray-600">
              Connect directly with buyers - No brokerage fees!
            </p>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">New Property Listing</h2>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step < currentStep
                          ? "bg-white text-blue-600"
                          : step === currentStep
                            ? "bg-blue-400 text-white"
                            : "bg-blue-700 text-blue-200"
                      }`}
                    >
                      {step < currentStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={(e) => form.handleSubmit(onSubmit)(e)} className="space-y-6">
                  {renderFormStep()}
                </form>
              </Form>
            </CardContent>
          </Card>

          <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Email OTP Verification
                </DialogTitle>
                <DialogDescription>
                  We've sent a 6-digit OTP to {form.getValues().contactEmail}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                    <p className="text-sm text-gray-600">Verifying OTP...</p>
                  </div>
                ) : (
                  <>
                    <OtpInput
                      length={6}
                      onOtpSubmit={handleOtpSubmit}
                      disabled={isLoading}
                    />
                    <div className="text-center text-sm text-gray-500">
                      Didn't receive OTP?{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => sendOtp(form.getValues().contactEmail)}
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? (
                          <span className="flex items-center">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Sending...
                          </span>
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      <AlertTriangle className="h-3 w-3 inline mr-1 text-amber-500" />
                      Please check your spam folder if you don't see the email
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Success Dialog */}
          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Property Submitted Successfully!
                </DialogTitle>
                <DialogDescription>
                  Your property listing has been submitted to our administrator for verification.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-3">
                  <p className="text-amber-800 text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <strong>Important:</strong> Your property will not be visible until approved by an administrator.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-green-800 text-sm">
                    <strong>Next Steps:</strong>
                  </p>
                  <ul className="text-green-800 text-sm mt-2 ml-5 list-disc space-y-1">
                    <li>Our admin team will review your property details</li>
                    <li>Once verified, your property will appear on the website</li>
                    <li>You'll receive an email notification once approved</li>
                    <li>This verification process typically takes 24-48 hours</li>
                  </ul>
                  <p className="text-green-800 text-sm mt-3">
                    <strong>Thank you</strong> for using our service! We've sent a confirmation to your email address.
                  </p>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => {
                    setShowSuccessDialog(false);
                    setLocation("/");
                  }}
                  className="w-full"
                >
                  Return to Home
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const corsConfig = [
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
];