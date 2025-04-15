import React, { useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Upload,
  MapPin,
  Home,
  Check,
  Image as ImageIcon,
  Youtube,
  Calculator,
  Info,
  Plus,
  Minus,
  Trash2,
  X,
  Star,
  Clock,
  TrendingUp,
  ShoppingBag,
  Castle,
  Briefcase,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Define the amenities list
const amenitiesList = [
  { id: "gym", label: "Gym" },
  { id: "swimming-pool", label: "Swimming Pool" },
  { id: "clubhouse", label: "Clubhouse" },
  { id: "garden", label: "Garden" },
  { id: "children-play-area", label: "Children's Play Area" },
  { id: "sports-facility", label: "Sports Facility" },
  { id: "security", label: "24x7 Security" },
  { id: "power-backup", label: "Power Backup" },
  { id: "parking", label: "Parking" },
  { id: "lift", label: "Lift" },
  { id: "jogging-track", label: "Jogging Track" },
  { id: "indoor-games", label: "Indoor Games" },
  { id: "community-hall", label: "Community Hall" },
  { id: "rainwater-harvesting", label: "Rainwater Harvesting" },
  { id: "wifi", label: "WiFi Connectivity" },
];

// Define the project categories
const projectCategories = [
  { id: "new_launch", label: "New Launch Projects", icon: Star },
  { id: "featured", label: "Featured Projects", icon: Star },
  { id: "commercial", label: "Commercial Projects", icon: ShoppingBag },
  { id: "upcoming", label: "Upcoming Projects", icon: Clock },
  { id: "luxury", label: "Luxury Projects", icon: Castle },
  { id: "affordable", label: "Affordable Projects", icon: Home },
  { id: "newly_listed", label: "Newly Listed Properties", icon: Clock },
  { id: "top_urgent", label: "Top Urgent Sales", icon: TrendingUp },
  { id: "company_projects", label: "Company Projects", icon: Briefcase },
] as const;

// Define the form schema
const projectSchema = z.object({
  // Basic info fields
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  projectAddress: z.string().min(5, "Address must be at least 5 characters"),
  reraNumber: z.string().optional(),
  projectPrice: z.string().optional(),
  aboutProject: z.string().optional(),
  developerInfo: z.string().optional(),
  offerDetails: z.string().optional(),
  projectCategory: z.string().min(1, "Please select a project category"),
  
  // File upload fields (handled separately)
  heroImageUrl: z.string().optional(), 
  galleryUrls: z.array(z.string()).optional(),
  locationMapUrl: z.string().optional(),
  masterPlanUrl: z.string().optional(),

  // Property fields
  bhk2Sizes: z.array(z.string()).optional(),
  bhk3Sizes: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),

  // Location fields
  locationAdvantages: z.string().optional(),
  youtubeUrl: z.string().optional(), // Removed URL validation to allow video file uploads

  // Financial fields
  loanAmount: z.string().optional(),
  interestRate: z.string().optional(),
  loanTenure: z.string().optional(),

  // Luxury category fields
  premiumFeatures: z.string().optional(),
  exclusiveServices: z.string().optional(),

  // Affordable category fields
  affordabilityFeatures: z.string().optional(),
  financialSchemes: z.string().optional(),

  // Commercial category fields
  commercialType: z.string().optional(),
  businessAmenities: z.string().optional(),

  // New Launch category fields
  launchDate: z.string().optional(),
  launchOffers: z.string().optional(),

  // Upcoming category fields
  expectedCompletionDate: z.string().optional(),
  constructionStatus: z.string().optional(),

  // Top Urgent category fields
  saleDeadline: z.string().optional(),
  urgencyReason: z.string().optional(),
  discountOffered: z.string().optional(),

  // Featured category fields
  highlightFeatures: z.string().optional(),
  accolades: z.string().optional(),

  // Newly Listed category fields
  listingDate: z.string().optional(),
  specialIntroOffer: z.string().optional(),

  // Company Projects category fields
  companyProfile: z.string().optional(),
  pastProjects: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function SubmitProjectPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<ProjectFormValues | null>(null);

  // Add state for hero image file
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  // State for dynamic fields
  const [bhk2Sizes, setBhk2Sizes] = useState<string[]>([""]);
  const [bhk3Sizes, setBhk3Sizes] = useState<string[]>([""]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([""]);

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Form definition with updated default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      // Basic info fields
      projectName: "",
      projectAddress: "",
      reraNumber: "",
      projectPrice: "",
      aboutProject: "",
      developerInfo: "",
      offerDetails: "",
      projectCategory: "",

      // File upload fields
      heroImageUrl: "",
      galleryUrls: [""],
      locationMapUrl: "",
      masterPlanUrl: "",

      // Property fields
      bhk2Sizes: [""],
      bhk3Sizes: [""],
      amenities: [],

      // Gallery fields
      youtubeUrl: "",

      // Location fields
      locationAdvantages: "",

      // Financial fields
      loanAmount: "",
      interestRate: "",
      loanTenure: "",

      // Luxury category fields
      premiumFeatures: "",
      exclusiveServices: "",

      // Affordable category fields
      affordabilityFeatures: "",
      financialSchemes: "",

      // Commercial category fields
      commercialType: "",
      businessAmenities: "",

      // New Launch category fields
      launchDate: "",
      launchOffers: "",

      // Upcoming category fields
      expectedCompletionDate: "",
      constructionStatus: "",

      // Top Urgent category fields
      saleDeadline: "",
      urgencyReason: "",
      discountOffered: "",

      // Featured category fields
      highlightFeatures: "",
      accolades: "",

      // Newly Listed category fields
      listingDate: "",
      specialIntroOffer: "",

      // Company Projects category fields
      companyProfile: "",
      pastProjects: "",
    },
  });

  // Hero image dropzone setup
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0];
        setHeroImage(file);

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setHeroImagePreview(previewUrl);

        // We'll upload the file when the form is submitted
        // Just set a temporary value for validation purposeswhen the form is submitted
        // Just set a temporary value for validation purposes
        form.setValue("heroImageUrl", "pending-upload");
      }
    },
    [form],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Remove hero image
  const removeHeroImage = () => {
    setHeroImage(null);
    setHeroImagePreview(null);
    form.setValue("heroImageUrl", "");
  };

  const addBhk2Size = () => {
    setBhk2Sizes([...bhk2Sizes, ""]);
    form.setValue("bhk2Sizes", [...bhk2Sizes, ""]);
  };

  const removeBhk2Size = (index: number) => {
    const newSizes = bhk2Sizes.filter((_, i) => i !== index);
    setBhk2Sizes(newSizes);
    form.setValue("bhk2Sizes", newSizes);
  };

  const addBhk3Size = () => {
    setBhk3Sizes([...bhk3Sizes, ""]);
    form.setValue("bhk3Sizes", [...bhk3Sizes, ""]);
  };

  const removeBhk3Size = (index: number) => {
    const newSizes = bhk3Sizes.filter((_, i) => i !== index);
    setBhk3Sizes(newSizes);
    form.setValue("bhk3Sizes", newSizes);
  };

  const addGalleryUrl = () => {
    if (galleryUrls.length < 25) {
      setGalleryUrls([...galleryUrls, ""]);
      form.setValue("galleryUrls", [...galleryUrls, ""]);
    } else {
      toast({
        title: "Maximum limit reached",
        description: "You can add up to 25 gallery images",
        variant: "destructive",
      });
    }
  };

  const removeGalleryUrl = (index: number) => {
    const newUrls = galleryUrls.filter((_, i) => i !== index);
    setGalleryUrls(newUrls);
    form.setValue("galleryUrls", newUrls);
  };

  // State for success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedProjectId, setSubmittedProjectId] = useState<number | null>(
    null,
  );

  // Handle form submission
  const onSubmit = async (data: ProjectFormValues) => {
    console.log("Form submission started with data:", data);
    setIsSubmitting(true);
  
    // Validate required fields
    if (!data.projectName) {
      toast({
        title: "Validation Error",
        description: "Project name is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
  
    if (!data.projectAddress) {
      toast({
        title: "Validation Error",
        description: "Project address is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
  
    if (!data.projectCategory) {
      toast({
        title: "Validation Error",
        description: "Please select a project category",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
  
    // Show submission progress toast
    toast({
      title: "Submitting Project",
      description: "Please wait while we process your submission...",
    });
  
    try {
      console.log("Validation passed, proceeding with submission");
      
      // Filter out empty values
      const filteredData = {
        ...data,
        bhk2Sizes: data.bhk2Sizes?.filter((size) => size.trim() !== "") || [],
        bhk3Sizes: data.bhk3Sizes?.filter((size) => size.trim() !== "") || [],
        galleryUrls: data.galleryUrls?.filter((url) => url.trim() !== "") || [],
      };
  
      // Prepare form data
      const formData = new FormData();
  
      // Add project data
      Object.entries(filteredData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
  
      // Add hero image
      if (heroImage) {
        console.log("Adding hero image file:", heroImage.name);
        formData.append("heroImage", heroImage);
      }
  
      // Add gallery URLs as JSON string
      if (filteredData.galleryUrls && filteredData.galleryUrls.length > 0) {
        // Clean up any URLs that might have curly braces
        const cleanedUrls = filteredData.galleryUrls.map(url => {
          if (typeof url === 'string' && url.startsWith('{') && url.endsWith('}')) {
            return url.substring(1, url.length - 1);
          }
          return url;
        });
        
        console.log('Cleaned gallery URLs:', cleanedUrls);
        
        // Add as JSON string
        formData.append('galleryUrls', JSON.stringify(cleanedUrls));
        
        // Also add individual URLs for debugging
        cleanedUrls.forEach((url, index) => {
          formData.append(`galleryUrl_${index}`, url);
        });
      }
  
      // Add user information
      if (user?.id) {
        formData.append('userId', user.id.toString());
      } else {
        formData.append('userId', "1"); // Default to admin user if not logged in
      }
  
      // Add status fields
      formData.append('status', 'upcoming');
      formData.append('approvalStatus', 'pending');
  
      // Clean up any URLs that might have curly braces
      const cleanHeroUrl = data.heroImageUrl && typeof data.heroImageUrl === 'string' && 
        data.heroImageUrl.startsWith('{') && data.heroImageUrl.endsWith('}') 
        ? data.heroImageUrl.substring(1, data.heroImageUrl.length - 1) 
        : data.heroImageUrl;
        
      const cleanGalleryUrls = (data.galleryUrls || []).map(url => {
        if (typeof url === 'string' && url.startsWith('{') && url.endsWith('}')) {
          return url.substring(1, url.length - 1);
        }
        return url;
      });
      
      // Create backup JSON data
      const jsonData = {
        title: data.projectName,
        description: data.aboutProject || "No description provided",
        location: data.projectAddress,
        city: data.projectAddress.split(",").pop()?.trim() || "Unknown",
        state: "Not specified",
        price: data.projectPrice,
        bhkConfig: `${data.bhk2Sizes?.length ? "2" : ""}${data.bhk2Sizes?.length && data.bhk3Sizes?.length ? "," : ""}${data.bhk3Sizes?.length ? "3" : ""} BHK`,
        builder: data.developerInfo || "Not specified",
        category: data.projectCategory,
        status: "upcoming",
        amenities: data.amenities || [],
        tags: [data.projectCategory],
        imageUrls: [cleanHeroUrl, ...cleanGalleryUrls].filter(url => url && url.trim() !== ""),
        contactNumber: user?.phone || "",
        userId: user?.id || 1,
        approvalStatus: "pending"
      };
  
      console.log("Submitting form data:", Object.fromEntries(formData.entries()));
      console.log("JSON backup data:", jsonData);
  
      // Submit the data to the server
      console.log("Starting fetch to /api/projects");
      let response;
      try {
        response = await fetch("/api/projects", {
          method: "POST",
          body: formData,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
  
        // Fallback to JSON if FormData fails
        if (!response.ok) {
          console.log("FormData submission failed, trying JSON approach");
          response = await fetch("/api/projects", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            body: JSON.stringify(jsonData)
          });
        }
      } catch (error) {
        console.error("Error during initial fetch:", error);
        // Fallback to JSON
        response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify(jsonData)
        });
      }
  
      console.log("Fetch completed with status:", response.status);
  
      if (!response.ok) {
        let errorMessage = "Failed to submit project";
        try {
          const errorData = await response.json();
          console.error("Server error response:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
          if (errorData.details) {
            errorMessage += ": " + errorData.details;
          }
        } catch (parseError) {
          console.error("Failed to parse error response", parseError);
        }
        throw new Error(errorMessage);
      }
  
      const result = await response.json();
      console.log("Server success response:", result);
  
      // Set the submitted project ID
      if (result.project?.id) {
        setSubmittedProjectId(result.project.id);
      } else if (result.id) {
        setSubmittedProjectId(result.id);
      }
  
      // Show success UI
      setShowSuccessDialog(true);
      toast({
        title: "Project submitted successfully",
        description: "Your project has been sent for review and approval",
      });
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error submitting project",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const onSubmit = async (data: ProjectFormValues) => {
  //   console.log("Form submission started with data:", data);
  //   setIsSubmitting(true);

  //   // Validate required fields directly
  //   if (!data.projectName) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Project name is required",
  //       variant: "destructive",
  //     });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   if (!data.projectAddress) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Project address is required",
  //       variant: "destructive",
  //     });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   if (!data.projectCategory) {
  //     toast({
  //       title: "Validation Error",
  //       description: "Please select a project category",
  //       variant: "destructive",
  //     });
  //     setIsSubmitting(false);
  //     return;
  //   }
    
  //   // Display progress toast to indicate submission is in progress
  //   toast({
  //     title: "Submitting Project",
  //     description: "Please wait while we process your submission...",
  //   });

  //   try {
  //     console.log("Validation passed, proceeding with submission");
  //     // Filter out empty values
  //     const filteredData = {
  //       ...data,
  //       bhk2Sizes: data.bhk2Sizes?.filter((size) => size.trim() !== "") || [],
  //       bhk3Sizes: data.bhk3Sizes?.filter((size) => size.trim() !== "") || [],
  //       galleryUrls: data.galleryUrls?.filter((url) => url.trim() !== "") || [],
  //     };

  //     // Prepare the data for submission according to the project schema
  //     const projectSubmissionData = {
  //       title: data.projectName,
  //       description: data.aboutProject || "No description provided",
  //       location: data.projectAddress,
  //       city: data.projectAddress.split(",").pop()?.trim() || "Unknown",
  //       state: "Not specified",
  //       price: data.projectPrice,
  //       bhkConfig: `${data.bhk2Sizes?.length ? "2" : ""}${data.bhk2Sizes?.length && data.bhk3Sizes?.length ? "," : ""}${data.bhk3Sizes?.length ? "3" : ""} BHK`,
  //       builder: data.developerInfo || "Not specified",
  //       category: data.projectCategory,
  //       status: "upcoming",
  //       amenities: data.amenities || [],
  //       tags: [data.projectCategory],
  //       // Only include valid URLs, actual files will be uploaded through formData
  //       imageUrls: [data.heroImageUrl, ...(data.galleryUrls || [])].filter(
  //         (url) => url && url.trim() !== "",
  //       ),
  //       contactNumber: user?.phone || "",
  //       userId: user?.id || 1, // Default to guest user if not logged in
  //     };

  //     // Prepare form data for file upload
  //     const formData = new FormData();

  //     // Validate arrays for debugging
  //     if (!Array.isArray(projectSubmissionData.amenities)) {
  //       console.warn(
  //         "Amenities is not an array:",
  //         projectSubmissionData.amenities,
  //       );
  //       projectSubmissionData.amenities = [];
  //     }

  //     if (!Array.isArray(projectSubmissionData.tags)) {
  //       console.warn("Tags is not an array:", projectSubmissionData.tags);
  //       projectSubmissionData.tags = [];
  //     }

  //     if (!Array.isArray(projectSubmissionData.imageUrls)) {
  //       console.warn(
  //         "ImageUrls is not an array:",
  //         projectSubmissionData.imageUrls,
  //       );
  //       projectSubmissionData.imageUrls = [];
  //     }

  //     // Add hero image file if it exists
  //     if (heroImage) {
  //       console.log("Adding hero image file:", heroImage.name);
  //       formData.append("heroImage", heroImage);
  //     }

  //     // Add all the text data
  //     Object.entries(projectSubmissionData).forEach(([key, value]) => {
  //       if (Array.isArray(value)) {
  //         // For arrays, we stringify them
  //         formData.append(key, JSON.stringify(value));
  //         console.log(`Adding array field ${key}:`, JSON.stringify(value));
          
  //         // Special handling for imageUrls to ensure proper transmission
  //         if (key === 'imageUrls') {
  //           // Add a separate field for better server compatibility
  //           formData.append('imageUrlsArray', JSON.stringify(value));
  //           console.log('Added imageUrlsArray as JSON string:', JSON.stringify(value));
  //         }
  //       } else if (value !== undefined && value !== null) {
  //         formData.append(key, value.toString());

  //         // Log important fields for debugging
  //         if (key === "category" || key === "title" || key === "userId") {
  //           console.log(`Adding field ${key}:`, value.toString());
  //         }
  //       }
  //     });

  //     // Add custom fields based on category
  //     if (data.projectCategory) {
  //       // Add category-specific data to the form
  //       switch (data.projectCategory) {
  //         case "luxury":
  //           formData.append("premiumFeatures", data.premiumFeatures || "");
  //           formData.append("exclusiveServices", data.exclusiveServices || "");
  //           break;
  //         case "affordable":
  //           formData.append(
  //             "affordabilityFeatures",
  //             data.affordabilityFeatures || "",
  //           );
  //           formData.append("financialSchemes", data.financialSchemes || "");
  //           break;
  //         case "commercial":
  //           formData.append("commercialType", data.commercialType || "");
  //           formData.append("businessAmenities", data.businessAmenities || "");
  //           break;
  //         case "new_launch":
  //           formData.append("launchDate", data.launchDate || "");
  //           formData.append("launchOffers", data.launchOffers || "");
  //           break;
  //         case "upcoming":
  //           formData.append(
  //             "expectedCompletionDate",
  //             data.expectedCompletionDate || "",
  //           );
  //           formData.append(
  //             "constructionStatus",
  //             data.constructionStatus || "",
  //           );
  //           break;
  //         case "top_urgent":
  //           formData.append("saleDeadline", data.saleDeadline || "");
  //           formData.append("urgencyReason", data.urgencyReason || "");
  //           formData.append("discountOffered", data.discountOffered || "");
  //           break;
  //         case "featured":
  //           formData.append("highlightFeatures", data.highlightFeatures || "");
  //           formData.append("accolades", data.accolades || "");
  //           break;
  //         case "newly_listed":
  //           formData.append("listingDate", data.listingDate || "");
  //           formData.append("specialIntroOffer", data.specialIntroOffer || "");
  //           break;
  //         case "company_projects":
  //           formData.append("companyProfile", data.companyProfile || "");
  //           formData.append("pastProjects", data.pastProjects || "");
  //           break;
  //       }
  //     }

  //     // Add the hero image if it exists
  //     if (heroImage) {
  //       // Explicitly set the file name to help server identify it as hero image
  //       formData.append("heroImage", heroImage);
  //     }

  //     // Helper function to add additional gallery images if they're files
  //     // This handles any gallery images that are actual files rather than URLs
  //     const addGalleryFilesToFormData = () => {
  //       // The implementation currently only accepts URL inputs for gallery images, not file uploads
  //       // The heroImage is the only file being uploaded
        
  //       // If future implementation requires file uploads for gallery images,
  //       // they would be added to formData here with unique field names
  //       // Example: galleryFiles.forEach((file, index) => formData.append(`galleryImage_${index}`, file));
  //     };

  //     // Add any additional gallery images
  //     addGalleryFilesToFormData();

  //     console.log("Submitting project data:", projectSubmissionData);

  //     // For preview, we'll set the form data first
  //     setFormData(filteredData);
      
  //     // Process amenities specially to handle form arrays
  //     if (Array.isArray(projectSubmissionData.amenities)) {
  //       // Also store as a separate JSON key for extra compatibility
  //       formData.append('amenitiesArray', JSON.stringify(projectSubmissionData.amenities));
  //       console.log('Added amenitiesArray as JSON string:', JSON.stringify(projectSubmissionData.amenities));
  //     }
      
  //     // Add category to formData again just to make sure it's properly included
  //     formData.append('category', data.projectCategory);
      
  //     // Set project name explicitly as both title and projectName
  //     formData.append('title', data.projectName);
  //     formData.append('projectName', data.projectName);
      
  //     // Add description field explicitly
  //     formData.append('description', data.aboutProject || "No description provided");
      
  //     // Add address/location information
  //     formData.append('location', data.projectAddress);
  //     formData.append('city', data.projectAddress.split(",").pop()?.trim() || "Unknown");
      
  //     // Add amenities as a stringified JSON array
  //     if (data.amenities && data.amenities.length > 0) {
  //       formData.append('amenities', JSON.stringify(data.amenities));
  //     }
      
  //     // Add price information
  //     if (data.projectPrice) {
  //       formData.append('price', data.projectPrice);
  //     }
      
  //     // Make sure userId is included
  //     if (user?.id) {
  //       formData.append('userId', user.id.toString());
  //     } else {
  //       // Default to admin user if not logged in
  //       formData.append('userId', "1");
  //     }
      
  //     // Add status and approval status
  //     formData.append('status', 'upcoming');
  //     formData.append('approvalStatus', 'pending');

  //     // Create a regular object for JSON submission as backup
  //     const jsonData = {
  //       title: data.projectName,
  //       description: data.aboutProject || "No description provided",
  //       location: data.projectAddress,
  //       city: data.projectAddress.split(",").pop()?.trim() || "Unknown",
  //       state: "Not specified",
  //       price: data.projectPrice,
  //       bhkConfig: `${data.bhk2Sizes?.length ? "2" : ""}${data.bhk2Sizes?.length && data.bhk3Sizes?.length ? "," : ""}${data.bhk3Sizes?.length ? "3" : ""} BHK`,
  //       builder: data.developerInfo || "Not specified",
  //       category: data.projectCategory,
  //       status: "upcoming",
  //       amenities: data.amenities || [],
  //       tags: [data.projectCategory],
  //       imageUrls: [data.heroImageUrl, ...(data.galleryUrls || [])].filter(url => url && url.trim() !== ""),
  //       contactNumber: user?.phone || "",
  //       userId: user?.id || 1,
  //       approvalStatus: "pending"
  //     };

  //     console.log("Submitting form data:", Object.fromEntries(formData.entries()));
  //     console.log("JSON backup data:", jsonData);

  //     // Submit the data to the server using FormData first
  //     console.log("Starting fetch to /api/projects");
  //     let response;
  //     try {
  //       response = await fetch("/api/projects", {
  //         method: "POST",
  //         body: formData, // FormData automatically sets the correct content-type
  //         // Avoid cache for this request
  //         headers: {
  //           'Cache-Control': 'no-cache',
  //           'Pragma': 'no-cache'
  //         }
  //       });
        
  //       // If FormData submission fails, try the JSON approach
  //       if (!response.ok && response.status !== 201) {
  //         console.log("FormData submission failed, trying JSON approach");
  //         response = await fetch("/api/projects", {
  //           method: "POST",
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Cache-Control': 'no-cache',
  //             'Pragma': 'no-cache'
  //           },
  //           body: JSON.stringify(jsonData)
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error during initial fetch:", error);
  //       // Try the JSON approach as fallback
  //       console.log("Error occurred, trying JSON approach as fallback");
  //       response = await fetch("/api/projects", {
  //         method: "POST",
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Cache-Control': 'no-cache',
  //           'Pragma': 'no-cache'
  //         },
  //         body: JSON.stringify(jsonData)
  //       });
  //     }
  //     console.log("Fetch completed with status:", response.status);
  //     console.log(
  //       "Server response headers:",
  //       Object.fromEntries(response.headers.entries()),
  //     );

  //     if (!response.ok) {
  //       let errorMessage = "Failed to submit project";
  //       try {
  //         const errorData = await response.json();
  //         console.error("Server error response:", errorData);
  //         errorMessage = errorData.error || errorData.message || errorMessage;

  //         if (errorData.details) {
  //           console.error("Error details:", errorData.details);
  //           errorMessage += ": " + errorData.details;
  //         }
  //       } catch (parseError) {
  //         console.error("Failed to parse error response", parseError);
  //         // Try to get the text content if JSON parsing fails
  //         try {
  //           const textContent = await response.text();
  //           console.error("Error response text:", textContent);
  //         } catch (textError) {
  //           console.error("Failed to get response text:", textError);
  //         }
  //       }
  //       throw new Error(errorMessage);
  //     }

  //     let result;
  //     try {
  //       result = await response.json();
  //       console.log("Server success response:", result);
  //     } catch (parseError) {
  //       console.error("Failed to parse success response", parseError);
  //       throw new Error("Server returned invalid response format");
  //     }

  //     // Set the submitted project ID
  //     if (result.project && result.project.id) {
  //       setSubmittedProjectId(result.project.id);
  //     }

  //     // Show success popup
  //     setShowSuccessDialog(true);

  //     // Also show toast notification
  //     toast({
  //       title: "Project submitted successfully",
  //       description: "Your project has been sent for review and approval",
  //     });
  //   } catch (error) {
  //     console.error("Error submitting project:", error);
  //     toast({
  //       title: "Error submitting project",
  //       description:
  //         error instanceof Error
  //           ? error.message
  //           : "An unexpected error occurred",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Calculate EMI for home loan
  const calculateEMI = (amount: string, rate: string, tenure: string) => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
      return 0;
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  // Handle tab navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Exit preview mode
  const exitPreview = () => {
    setPreviewMode(false);
  };

  // If in preview mode, show the project details
  if (previewMode && formData) {
    const emi = calculateEMI(
      formData.loanAmount || "0",
      formData.interestRate || "0",
      formData.loanTenure || "0",
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Preview Header */}
            <div className="bg-primary/10 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Project Preview</h2>
              <Button onClick={exitPreview} variant="outline">
                Edit Project
              </Button>
            </div>

            {/* Updated Hero Section - Styled like the reference image */}
            <div className="relative">
              {/* Hero Image */}
              <div className="relative h-[400px] w-full">
                {heroImagePreview ? (
                  <img
                    src={heroImagePreview}
                    alt={formData.projectName}
                    className="w-full h-full object-cover"
                  />
                ) : formData.heroImageUrl ? (
                  <img
                    src={formData.heroImageUrl}
                    alt={formData.projectName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No hero image provided</p>
                  </div>
                )}

                {/* Overlay with project details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                  <h1 className="text-3xl font-bold">{formData.projectName}</h1>

                  {formData.reraNumber && (
                    <p className="text-sm mt-1">
                      RERA Number: {formData.reraNumber}
                    </p>
                  )}

                  <div className="mt-2">
                    {(formData.bhk2Sizes?.length ||
                      formData.bhk3Sizes?.length) && (
                      <p className="text-lg">
                        {formData.bhk2Sizes?.length ? "2" : ""}
                        {formData.bhk2Sizes?.length &&
                        formData.bhk3Sizes?.length
                          ? " & "
                          : ""}
                        {formData.bhk3Sizes?.length ? "3" : ""} BHK Flat
                        {" | "}
                        {formData.bhk2Sizes?.[0] || ""}
                        {formData.bhk2Sizes?.length &&
                        formData.bhk3Sizes?.length
                          ? " - "
                          : ""}
                        {formData.bhk3Sizes?.[formData.bhk3Sizes.length - 1] ||
                          ""}{" "}
                        sqft
                      </p>
                    )}
                  </div>

                  {formData.projectPrice && (
                    <p className="text-2xl font-bold mt-1">
                      ₹ {formData.projectPrice} Lac
                      <span className="text-sm font-normal ml-2">
                        onwards at
                      </span>
                    </p>
                  )}

                  <p className="text-lg mt-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.projectAddress}
                  </p>

                  {/* Offer banner */}
                  {formData.offerDetails && (
                    <div className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-md inline-flex items-center">
                      <span className="font-bold mr-2">OFFER:</span>{" "}
                      {formData.offerDetails}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Properties Available */}
            {formData.bhk2Sizes?.length || formData.bhk3Sizes?.length ? (
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold mb-4">
                  Properties Available
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.bhk2Sizes?.length ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">2 BHK</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.bhk2Sizes.map((size, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-white"
                          >
                            {size} sq.ft
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {formData.bhk3Sizes?.length ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">3 BHK</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.bhk3Sizes.map((size, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-white"
                          >
                            {size} sq.ft
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Amenities */}
            {formData.amenities?.length ? (
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.amenities.map((amenity) => {
                    const amenityItem = amenitiesList.find(
                      (a) => a.id === amenity,
                    );
                    return (
                      <div key={amenity} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{amenityItem?.label || amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Gallery */}
            {formData.galleryUrls?.length ? (
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.galleryUrls.map((url, index) => (
                    <div
                      key={index}
                      className="h-48 rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* YouTube Video */}
            {formData.youtubeUrl && (
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold mb-4">Video Tour</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={formData.youtubeUrl.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-96"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Map View */}
            {(formData.locationAdvantages ||
              formData.locationMapUrl ||
              formData.masterPlanUrl) && (
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold mb-4">Map View</h2>

                {formData.locationAdvantages && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      Location Advantages
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {formData.locationAdvantages}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.locationMapUrl && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Location Map</h3>
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={formData.locationMapUrl}
                          alt="Location Map"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}

                  {formData.masterPlanUrl && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Master Plan</h3>
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={formData.masterPlanUrl}
                          alt="Master Plan"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Category-specific Details */}
            {formData.projectCategory && (
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold mb-4">
                  {formData.projectCategory.charAt(0).toUpperCase() +
                    formData.projectCategory.slice(1).replace("_", " ")}{" "}
                  Details
                </h2>

                {/* Luxury Project Details */}
                {formData.projectCategory === "luxury" && (
                  <div className="space-y-4">
                    {formData.premiumFeatures && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Premium Features
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.premiumFeatures}
                        </p>
                      </div>
                    )}
                    {formData.exclusiveServices && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Exclusive Services
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.exclusiveServices}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Affordable Housing Details */}
                {formData.projectCategory === "affordable" && (
                  <div className="space-y-4">
                    {formData.affordabilityFeatures && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Affordability Features
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.affordabilityFeatures}
                        </p>
                      </div>
                    )}
                    {formData.financialSchemes && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Financial Schemes
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.financialSchemes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Commercial Project Details */}
                {formData.projectCategory === "commercial" && (
                  <div className="space-y-4">
                    {formData.commercialType && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Commercial Type
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-base font-normal px-3 py-1"
                        >
                          {formData.commercialType === "office" &&
                            "Office Space"}
                          {formData.commercialType === "retail" &&
                            "Retail Shop"}
                          {formData.commercialType === "it-park" && "IT Park"}
                          {formData.commercialType === "mall" &&
                            "Shopping Mall"}
                          {formData.commercialType === "warehouse" &&
                            "Warehouse/Industrial"}
                          {formData.commercialType === "mixed-use" &&
                            "Mixed Use"}
                        </Badge>
                      </div>
                    )}
                    {formData.businessAmenities && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Business Amenities
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.businessAmenities}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* New Launch Details */}
                {formData.projectCategory === "new_launch" && (
                  <div className="space-y-4">
                    {formData.launchDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Launch Date
                        </h3>
                        <p className="text-gray-700">
                          {new Date(formData.launchDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {formData.launchOffers && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Launch Offers
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.launchOffers}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Upcoming Project Details */}
                {formData.projectCategory === "upcoming" && (
                  <div className="space-y-4">
                    {formData.expectedCompletionDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Expected Completion Date
                        </h3>
                        <p className="text-gray-700">
                          {new Date(
                            formData.expectedCompletionDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {formData.constructionStatus && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Construction Status
                        </h3>
                        <Badge className="text-base font-normal px-3 py-1">
                          {formData.constructionStatus === "planning" &&
                            "Planning Stage"}
                          {formData.constructionStatus === "excavation" &&
                            "Excavation Started"}
                          {formData.constructionStatus === "foundation" &&
                            "Foundation Work"}
                          {formData.constructionStatus === "superstructure" &&
                            "Superstructure"}
                          {formData.constructionStatus === "finishing" &&
                            "Finishing Work"}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Top Urgent Details */}
                {formData.projectCategory === "top_urgent" && (
                  <div className="space-y-4">
                    {formData.saleDeadline && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Sale Deadline
                        </h3>
                        <p className="text-gray-700">
                          {new Date(formData.saleDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {formData.discountOffered && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Discount Offered
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-base font-normal px-3 py-1"
                        >
                          {formData.discountOffered}
                        </Badge>
                      </div>
                    )}
                    {formData.urgencyReason && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Reason for Urgency
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.urgencyReason}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Featured Project Details */}
                {formData.projectCategory === "featured" && (
                  <div className="space-y-4">
                    {formData.highlightFeatures && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Highlight Features
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.highlightFeatures}
                        </p>
                      </div>
                    )}
                    {formData.accolades && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Awards & Recognition
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.accolades}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Newly Listed Details */}
                {formData.projectCategory === "newly_listed" && (
                  <div className="space-y-4">
                    {formData.listingDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Listing Date
                        </h3>
                        <p className="text-gray-700">
                          {new Date(formData.listingDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {formData.specialIntroOffer && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Special Introductory Offer
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.specialIntroOffer}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Company Projects Details */}
                {formData.projectCategory === "company_projects" && (
                  <div className="space-y-4">
                    {formData.companyProfile && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Company Profile
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.companyProfile}
                        </p>
                      </div>
                    )}
                    {formData.pastProjects && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Past Projects
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                          {formData.pastProjects}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Home Loan Calculator */}
            {formData.loanAmount &&
              formData.interestRate &&
              formData.loanTenure && (
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold mb-4">
                    Home Loan Calculator
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="text-lg font-medium">
                          ₹{parseInt(formData.loanAmount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="text-lg font-medium">
                          {formData.interestRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Loan Tenure</p>
                        <p className="text-lg font-medium">
                          {formData.loanTenure} years
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Monthly EMI</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{emi.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* About Us */}
            {(formData.aboutProject || formData.developerInfo) && (
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About Us</h2>

                {formData.aboutProject && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      About the Project
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {formData.aboutProject}
                    </p>
                  </div>
                )}

                {formData.developerInfo && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Developer Information
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {formData.developerInfo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/projects")}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Projects
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Submit New Project</CardTitle>
              <CardDescription>
                Fill in the details to submit a new real estate project
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
                      <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                      <TabsTrigger value="category">Category</TabsTrigger>
                      <TabsTrigger value="properties">Properties</TabsTrigger>
                      <TabsTrigger value="gallery">Gallery</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="additional">Additional</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic-info" className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="projectName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter project name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="reraNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>RERA Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., P02200007609"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="projectPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Price (in Lac)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 82.7" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="projectAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Address*</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter complete address"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="offerDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Offer</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., WIN PRIZE KING SIZE ON YOUR DREAM HOME"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Add any special offers or promotions
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="heroImageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <FormLabel className="text-base">Hero Image</FormLabel>
                                  <FormDescription>
                                    This image will be featured at the top of your project listing
                                  </FormDescription>
                                </div>
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  Required
                                </Badge>
                              </div>
                              
                              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <div
                                    {...getRootProps()}
                                    className={`relative w-full h-[240px] bg-white rounded-lg border-2 border-dashed transition-all hover:bg-gray-50/50 group ${
                                      heroImagePreview
                                        ? "border-green-500"
                                        : "border-gray-300 hover:border-primary/70"
                                    }`}
                                  >
                                    <input {...getInputProps()} />
                                    
                                    {heroImagePreview ? (
                                      <div className="relative h-full w-full">
                                        <img
                                          src={heroImagePreview}
                                          alt="Hero Preview"
                                          className="w-full h-full object-contain rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <div className="flex gap-2">
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="sm"
                                              className="h-9 px-3"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                removeHeroImage();
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4 mr-1" />
                                              Remove
                                            </Button>
                                            <Button
                                              type="button"
                                              variant="secondary"
                                              size="sm"
                                              className="h-9 px-3 bg-white/80 hover:bg-white"
                                            >
                                              <Upload className="h-4 w-4 mr-1" />
                                              Change
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                                        <div className="w-16 h-16 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                          <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <h4 className="text-base font-medium text-gray-700 group-hover:text-primary">
                                          Drag photo here or click to browse
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                          High-quality PNG, JPG or WEBP (max. 5MB)
                                        </p>
                                        <div className="mt-4">
                                          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-0">
                                            Recommended size: 1200×800px
                                          </Badge>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {heroImagePreview && (
                                    <div className="w-full mt-2 flex items-center justify-between bg-green-50 px-4 py-2 rounded-md border border-green-200">
                                      <div className="flex items-center gap-2 text-green-700">
                                        <Check className="h-4 w-4" />
                                        <span className="text-sm font-medium">Image selected and ready for upload</span>
                                      </div>
                                      <span className="text-xs text-green-600">
                                        Will be uploaded when you submit the form
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => setActiveTab("category")}
                        >
                          Next: Category
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="category" className="space-y-6">
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">
                          Project Category
                        </h3>
                        <p className="text-sm text-gray-500">
                          Select the category that best fits your project. This
                          determines where your project will appear on the site.
                        </p>

                        <FormField
                          control={form.control}
                          name="projectCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Category*</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {projectCategories.map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
                                        <div className="flex items-center">
                                          {React.createElement(category.icon, {
                                            className: "mr-2 h-4 w-4",
                                          })}
                                          <span>{category.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="mt-6">
                          <h4 className="text-md font-medium mb-3">
                            Category Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {projectCategories.map((category) => (
                              <Card
                                key={category.id}
                                className={`cursor-pointer transition-all ${
                                  form.watch("projectCategory") === category.id
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "hover:border-gray-300"
                                }`}
                                onClick={() => {
                                  form.setValue("projectCategory", category.id);
                                  setSelectedCategory(category.id);
                                }}
                              >
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-md flex items-center">
                                    {React.createElement(category.icon, {
                                      className: "mr-2 h-5 w-5",
                                    })}
                                    {category.label}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm text-gray-500">
                                  {category.id === "newly_listed" && (
                                    <p>
                                      Properties that have been recently added
                                      to the platform. These get prime
                                      visibility on the homepage.
                                    </p>
                                  )}
                                  {category.id === "top_urgent" && (
                                    <p>
                                      Properties that need to be sold quickly.
                                      These are highlighted as urgent sales on
                                      the homepage.
                                    </p>
                                  )}
                                  {category.id === "featured" && (
                                    <p>
                                      Selected premium properties that get
                                      special placement and enhanced visibility
                                      across the site.
                                    </p>
                                  )}
                                  {category.id === "commercial" && (
                                    <p>
                                      Commercial real estate projects including
                                      office spaces, retail, and industrial
                                      properties.
                                    </p>
                                  )}
                                  {category.id === "luxury" && (
                                    <p>
                                      High-end properties with premium amenities
                                      and exclusive features for luxury seekers.
                                    </p>
                                  )}
                                  {category.id === "affordable" && (
                                    <p>
                                      Budget-friendly properties ideal for
                                      first-time buyers or those seeking
                                      value-for-money options.
                                    </p>
                                  )}
                                  {category.id === "upcoming" && (
                                    <p>
                                      Properties under construction or planned
                                      for future development with pre-launch
                                      booking opportunities.
                                    </p>
                                  )}
                                  {category.id === "new_launch" && (
                                    <p>
                                      Newly launched projects that are just
                                      hitting the market with introductory
                                      offers and pricing.
                                    </p>
                                  )}
                                  {category.id === "company_projects" && (
                                    <p>
                                      Properties developed by established real
                                      estate companies with corporate backing.
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("basic-info")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            if (selectedCategory) {
                              setActiveTab("category-specific");
                            } else {
                              setActiveTab("properties");
                            }
                          }}
                        >
                          Next:{" "}
                          {selectedCategory ? "Category Details" : "Properties"}
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Category-specific fields */}
                    <TabsContent
                      value="category-specific"
                      className="space-y-6"
                    >
                      {selectedCategory === "luxury" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Luxury Project Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your luxury
                            project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="premiumFeatures"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Premium Features</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Italian marble flooring, Smart home automation, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List the luxury features that set this
                                    project apart
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="exclusiveServices"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Exclusive Services</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="24/7 concierge, Valet parking, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List the exclusive services offered to
                                    residents
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "affordable" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Affordable Housing Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your affordable
                            housing project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="affordabilityFeatures"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Affordability Features</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Government subsidies, Low-cost maintenance, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Describe what makes this project affordable
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="financialSchemes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Financial Schemes</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="PMAY subsidy, No EMI till possession, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List any financial schemes available for
                                    buyers
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "commercial" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Commercial Project Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your commercial
                            project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="commercialType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Commercial Type</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select commercial type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="office">
                                          Office Space
                                        </SelectItem>
                                        <SelectItem value="retail">
                                          Retail Shop
                                        </SelectItem>
                                        <SelectItem value="it-park">
                                          IT Park
                                        </SelectItem>
                                        <SelectItem value="mall">
                                          Shopping Mall
                                        </SelectItem>
                                        <SelectItem value="warehouse">
                                          Warehouse/Industrial
                                        </SelectItem>
                                        <SelectItem value="mixed-use">
                                          Mixed Use
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="businessAmenities"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Business Amenities</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Conference rooms, High-speed internet, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List the business amenities available
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "new_launch" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            New Launch Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your newly
                            launched project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="launchDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Launch Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="launchOffers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Launch Offers</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Pre-launch discount, Free modular kitchen, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List special offers for early buyers
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "upcoming" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Upcoming Project Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your upcoming
                            project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expectedCompletionDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Expected Completion Date
                                  </FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="constructionStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Construction Status</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="planning">
                                          Planning Stage
                                        </SelectItem>
                                        <SelectItem value="excavation">
                                          Excavation Started
                                        </SelectItem>
                                        <SelectItem value="foundation">
                                          Foundation Work
                                        </SelectItem>
                                        <SelectItem value="superstructure">
                                          Superstructure
                                        </SelectItem>
                                        <SelectItem value="finishing">
                                          Finishing Work
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "top_urgent" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Urgent Sale Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your urgent sale
                            listing
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="saleDeadline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sale Deadline</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    The deadline by which the sale needs to be
                                    completed
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="urgencyReason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reason for Urgency</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Relocation, Financial needs, etc."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Explain why this is an urgent sale (will be
                                    shown to admin only)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="discountOffered"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Discount Offered</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="e.g., 10% off market value"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Specify any discount being offered for quick
                                  sale
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {selectedCategory === "featured" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Featured Project Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your featured
                            project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="highlightFeatures"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Highlight Features</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Key features that make this project stand out..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List the main features you want to highlight
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="accolades"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Awards & Recognition</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Any awards or recognition received by this project or developer..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List any awards or recognition
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "newly_listed" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Newly Listed Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your newly
                            listed property
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="listingDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Listing Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="specialIntroOffer"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Special Introductory Offer
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Any special offers for early buyers..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Describe any introductory offers for this
                                    new listing
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCategory === "company_projects" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Company Project Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            Please provide specific details for your company
                            project
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="companyProfile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Profile</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Brief profile of the developing company..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Provide information about the developing
                                    company
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="pastProjects"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Past Projects</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="List of successful past projects by the company..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    List notable past projects by the company
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("category")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setActiveTab("properties")}
                        >
                          Next: Properties
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="properties" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">2 BHK Sizes</h3>
                        {bhk2Sizes.map((size, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`2 BHK size ${index + 1} (sq.ft)`}
                              value={size}
                              onChange={(e) => {
                                const newSizes = [...bhk2Sizes];
                                newSizes[index] = e.target.value;
                                setBhk2Sizes(newSizes);
                                form.setValue("bhk2Sizes", newSizes);
                              }}
                            />
                            {bhk2Sizes.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeBhk2Size(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBhk2Size}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add 2 BHK Size
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">3 BHK Sizes</h3>
                        {bhk3Sizes.map((size, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`3 BHK size ${index + 1} (sq.ft)`}
                              value={size}
                              onChange={(e) => {
                                const newSizes = [...bhk3Sizes];
                                newSizes[index] = e.target.value;
                                setBhk3Sizes(newSizes);
                                form.setValue("bhk3Sizes", newSizes);
                              }}
                            />
                            {bhk3Sizes.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeBhk3Size(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBhk3Size}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add 3 BHK Size
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Amenities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {amenitiesList.map((amenity) => (
                            <FormField
                              key={amenity.id}
                              control={form.control}
                              name="amenities"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        amenity.id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              amenity.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== amenity.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {amenity.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("category")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setActiveTab("gallery")}
                        >
                          Next: Gallery
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="gallery" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">Project Gallery</h3>
                            <p className="text-sm text-muted-foreground">
                              Showcase your project with high-quality images
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Up to 25 images
                          </Badge>
                        </div>
                        
                        {/* Image upload section */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="grid gap-6">
                            {/* Main upload area */}
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="relative w-full h-[240px] bg-white rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary/70 hover:bg-gray-50/50 group">
                                <input
                                  type="file"
                                  multiple
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  accept="image/jpeg,image/png,image/webp,image/jpg"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      // Create an array to hold the file objects
                                      const files = Array.from(e.target.files);
                                      
                                      // Create preview URLs and set up form data
                                      const fileUrls = files.map(file => URL.createObjectURL(file));
                                      
                                      // Update state with temporary URLs
                                      const newUrls = [...galleryUrls, ...fileUrls].slice(0, 25);
                                      setGalleryUrls(newUrls);
                                      form.setValue("galleryUrls", newUrls);
                                      
                                      // Clear the input to allow selecting the same file again
                                      e.target.value = '';
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                                  <div className="w-16 h-16 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-primary" />
                                  </div>
                                  <h4 className="text-base font-medium text-gray-700 group-hover:text-primary">
                                    Drag photos here or click to browse
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Support: JPEG, PNG, WEBP images • 5MB per image max
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Image previews */}
                            {galleryUrls.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-700 flex items-center">
                                  <ImageIcon className="h-4 w-4 mr-2 text-primary" />
                                  Selected Images ({galleryUrls.length}/25)
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                  {galleryUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                      <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                                        {url.startsWith('blob:') || url.startsWith('data:') ? (
                                          <img 
                                            src={url} 
                                            alt={`Gallery image ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <ImageIcon className="h-6 w-6" />
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => removeGalleryUrl(index)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Youtube className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-medium">Project Video</h3>
                        </div>
                        <FormField
                          control={form.control}
                          name="youtubeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Video</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    className="pl-10"
                                    placeholder="Paste YouTube or upload video file"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Add a YouTube link or upload a video file showcasing your project
                              </FormDescription>
                              <div className="mt-2">
                                <label className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="video/mp4,video/quicktime,video/webm"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        // Just add a placeholder URL for now - actual file will be handled in form submission
                                        field.onChange("UPLOADED_VIDEO_FILE");
                                        // Here you would normally upload the file and get URL, but that's handled at form submission
                                      }
                                    }}
                                  />
                                  <Upload className="h-4 w-4 text-primary" />
                                  <span className="text-sm text-gray-600">
                                    Upload video (MP4, WebM) - 20MB max
                                  </span>
                                </label>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("properties")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setActiveTab("location")}
                        >
                          Next: Location
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="locationAdvantages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location Advantages</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the location advantages..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Highlight nearby landmarks, connectivity, and
                                other advantages
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">Location Map</h3>
                          </div>
                          
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <FormField
                              control={form.control}
                              name="locationMapUrl"
                              render={({ field }) => (
                                <FormItem className="space-y-4">
                                  <div className="flex flex-col gap-1.5">
                                    <FormLabel>Location Map</FormLabel>
                                    <FormDescription>
                                      Upload a map showing the project location with nearby landmarks
                                    </FormDescription>
                                  </div>
                                  
                                  {/* Location Map Upload */}
                                  <div className="relative flex flex-col items-center justify-center gap-2">
                                    <div className="relative w-full h-[200px] bg-white rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary/70 hover:bg-gray-50/50 group overflow-hidden">
                                      <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/jpeg,image/png,image/webp,image/jpg"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const previewUrl = URL.createObjectURL(file);
                                            field.onChange(previewUrl);
                                            e.target.value = '';
                                          }
                                        }}
                                      />
                                      
                                      {field.value ? (
                                        <div className="absolute inset-0">
                                          <img 
                                            src={field.value} 
                                            alt="Location Map" 
                                            className="w-full h-full object-contain"
                                          />
                                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange("");
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                                          <div className="w-16 h-16 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                            <MapPin className="h-8 w-8 text-primary" />
                                          </div>
                                          <h4 className="text-base font-medium text-gray-700 group-hover:text-primary">
                                            Upload location map
                                          </h4>
                                          <p className="text-sm text-gray-500 mt-1">
                                            PNG, JPG or WEBP (max. 5MB)
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">Master Plan</h3>
                          </div>
                          
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <FormField
                              control={form.control}
                              name="masterPlanUrl"
                              render={({ field }) => (
                                <FormItem className="space-y-4">
                                  <div className="flex flex-col gap-1.5">
                                    <FormLabel>Project Master Plan</FormLabel>
                                    <FormDescription>
                                      Upload the architectural master plan of your project
                                    </FormDescription>
                                  </div>
                                  
                                  {/* Master Plan Upload */}
                                  <div className="relative flex flex-col items-center justify-center gap-2">
                                    <div className="relative w-full h-[200px] bg-white rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary/70 hover:bg-gray-50/50 group overflow-hidden">
                                      <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/jpeg,image/png,image/webp,image/jpg"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const previewUrl = URL.createObjectURL(file);
                                            field.onChange(previewUrl);
                                            e.target.value = '';
                                          }
                                        }}
                                      />
                                      
                                      {field.value ? (
                                        <div className="absolute inset-0">
                                          <img 
                                            src={field.value} 
                                            alt="Master Plan" 
                                            className="w-full h-full object-contain"
                                          />
                                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="icon"
                                              className="h-8 w-8"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange("");
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
                                          <div className="w-16 h-16 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Building className="h-8 w-8 text-primary" />
                                          </div>
                                          <h4 className="text-base font-medium text-gray-700 group-hover:text-primary">
                                            Upload master plan
                                          </h4>
                                          <p className="text-sm text-gray-500 mt-1">
                                            PNG, JPG or WEBP (max. 5MB)
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("gallery")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setActiveTab("additional")}
                        >
                          Next: Additional Info
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="additional" className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Home Loan Calculator
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="loanAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Loan Amount (₹)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., 5000000"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="interestRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Interest Rate (%)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 8.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="loanTenure"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Loan Tenure (years)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 20" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch("loanAmount") &&
                          form.watch("interestRate") &&
                          form.watch("loanTenure") && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Estimated Monthly EMI
                              </p>
                              <p className="text-2xl font-bold">
                                ₹
                                {calculateEMI(
                                  form.watch("loanAmount") || "0",
                                  form.watch("interestRate") || "0",
                                  form.watch("loanTenure") || "0",
                                ).toLocaleString()}
                              </p>
                            </div>
                          )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="aboutProject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About the Project</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your project in detail..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="developerInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Developer Information</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Provide information about the developer..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setActiveTab("location")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => {
                            // Using type="button" and explicit submission to avoid double submission issues
                            if (!isSubmitting) {
                              console.log("Manual submit triggered");
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Project"}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl flex flex-col items-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Check className="h-12 w-12 text-green-500" />
              </div>
              Success!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <p className="text-lg font-semibold">Your project has been submitted successfully!</p>
              <p className="mt-2">
                It will be reviewed by our team and published soon.
              </p>
              {submittedProjectId && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="font-medium">Project ID: {submittedProjectId}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col space-y-2">
            <AlertDialogAction
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
            </AlertDialogAction>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                form.reset();
                setHeroImage(null);
                setHeroImagePreview(null);
                setBhk2Sizes([""]);
                setBhk3Sizes([""]);
                setGalleryUrls([""]);
                setSelectedCategory(null);
                setActiveTab("basic-info");
              }}
              className="w-full"
            >
              Submit Another Project
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
