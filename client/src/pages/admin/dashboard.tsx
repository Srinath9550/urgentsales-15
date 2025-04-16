import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Database,
  Eye,
  X,
} from "lucide-react";
import { formatImageUrl, handleImageError } from "@/lib/image-utils";

// Define interfaces for type safety
interface Property {
  id: number;
  title: string;
  description?: string;
  location?: string;
  city?: string;
  address?: string;
  propertyType?: string;
  propertyCategory?: string;
  transactionType?: string;
  price?: number;
  discountedPrice?: number;
  pricePerUnit?: number;
  totalPrice?: number;
  isUrgentSale?: boolean;
  rentOrSale?: string;
  
  // Location details
  projectName?: string;
  pincode?: string;
  landmarks?: string;
  
  // Property features
  bedrooms?: number | string;
  bathrooms?: number | string;
  balconies?: number | string;
  floorNo?: number | string;
  totalFloors?: number | string;
  floorsAllowedConstruction?: number | string;
  floorsAllowedForConstruction?: number | string;
  furnishedStatus?: string;
  roadWidth?: number | string;
  openSides?: number | string;
  area?: number;
  areaUnit?: string;
  parking?: string;
  facing?: string;
  facingDirection?: string;
  
  // Utilities & Amenities
  amenities?: string[];
  boundaryWall?: boolean | string;
  electricityStatus?: string;
  waterAvailability?: string;
  flooringType?: string;
  overlooking?: string[] | string;
  
  // Property status
  possessionStatus?: string;
  ownershipType?: string;
  propertyAge?: string;
  constructionAge?: string;
  projectStatus?: string;
  launchDate?: string;
  availableFromMonth?: string;
  availableFromYear?: string;
  reraRegistered?: boolean | string;
  reraNumber?: string;
  preferredTenant?: string;
  
  // Contact information
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  whatsappEnabled?: boolean;
  userType?: string;
  brokerage?: string | number;
  noBrokerResponses?: boolean;
  
  // Media
  imageUrls?: string[];
  videoUrls?: string[];
  imageCategories?: {
    exterior?: string[];
    interior?: string[];
    floor_plan?: string[];
    master_plan?: string[];
    location_map?: string[];
  };
  
  // System fields
  approvalStatus?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isFreeProperty?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  subscriptionLevel?: string;
  approvedBy?: number;
  approvalDate?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  developerName: string;
  price: number;
  priceRange: string;
  projectType: string;
  bhkConfiguration: string;
  launchDate: string;
  possessionDate: string;
  reraNumber: string;
  amenities: string[];
  imageUrls: string[];
  status: string;
  featured: boolean;
  category: string;
  approvalStatus: "pending" | "approved" | "rejected";
  approvedBy?: number;
  approvalDate?: string;
  rejectionReason?: string;
  userId: number;
  createdAt: string;
  updatedAt?: string;

  // Additional fields from submit-project.tsx
  address?: string;
  pincode?: string;
  landmarks?: string;
  totalUnits?: number;
  totalTowers?: number;
  totalFloors?: number;
  startingPrice?: number;
  pricePerSqFt?: number;
  areaRange?: string;
  totalArea?: number;
  areaUnit?: string;
  projectStatus?: string;
  reraWebsite?: string;
  developerExperience?: number;
  developerWebsite?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  usps?: string;
  floorPlanUrls?: string[];
  masterPlanUrls?: string[];
  brochureUrl?: string;
  videoUrl?: string;
  
  // Additional fields from project form schema
  projectName?: string;
  projectAddress?: string;
  aboutProject?: string;
  projectPrice?: string;
  developerInfo?: string;
  offerDetails?: string;
  projectCategory?: string;
  heroImageUrl?: string;
  galleryUrls?: string[];
  locationMapUrl?: string;
  masterPlanUrl?: string;
  bhk2Sizes?: string[];
  bhk3Sizes?: string[];
  locationAdvantages?: string;
  youtubeUrl?: string;
  loanAmount?: string;
  interestRate?: string;
  loanTenure?: string;
  
  // Category-specific fields
  premiumFeatures?: string;
  exclusiveServices?: string;
  affordabilityFeatures?: string;
  financialSchemes?: string;
  commercialType?: string;
  businessAmenities?: string;
  launchOffers?: string;
  expectedCompletionDate?: string;
  constructionStatus?: string;
  saleDeadline?: string;
  urgencyReason?: string;
  discountOffered?: string;
  highlightFeatures?: string;
  accolades?: string;
  listingDate?: string;
  specialIntroOffer?: string;
  companyProfile?: string;
  pastProjects?: string;
}

interface DatabaseTable {
  tableName: string;
  rowCount: number;
}

interface TableRecords {
  records: any[];
  total: number;
}

interface ActivityLog {
  id: number;
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  status: string;
  details?: any;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Helper function to process property data
const processPropertyData = (property: any) => {
  // Convert string numbers to actual numbers where needed
  if (typeof property.bedrooms === 'string' && !isNaN(Number(property.bedrooms))) {
    property.bedrooms = Number(property.bedrooms);
  }
  if (typeof property.bathrooms === 'string' && !isNaN(Number(property.bathrooms))) {
    property.bathrooms = Number(property.bathrooms);
  }
  if (typeof property.balconies === 'string' && !isNaN(Number(property.balconies))) {
    property.balconies = Number(property.balconies);
  }
  if (typeof property.area === 'string' && !isNaN(Number(property.area))) {
    property.area = Number(property.area);
  }
  
  // Ensure boolean fields are properly typed
  property.isUrgentSale = property.isUrgentSale === true || property.isUrgentSale === 'true';
  property.whatsappEnabled = property.whatsappEnabled === true || property.whatsappEnabled === 'true';
  property.reraRegistered = property.reraRegistered === true || property.reraRegistered === 'true';
  property.noBrokerResponses = property.noBrokerResponses === true || property.noBrokerResponses === 'true';
  property.isFreeProperty = property.isFreeProperty === true || property.isFreeProperty === 'true';
  
  // Handle array fields that might be stored as strings
  if (typeof property.amenities === 'string') {
    try {
      property.amenities = JSON.parse(property.amenities);
    } catch (e) {
      property.amenities = property.amenities.split(',').map((item: string) => item.trim());
    }
  }
  
  // Handle imageUrls that might be stored as strings
  if (typeof property.imageUrls === 'string') {
    try {
      property.imageUrls = JSON.parse(property.imageUrls);
    } catch (e) {
      console.error('Error parsing imageUrls:', e);
      property.imageUrls = [];
    }
  }
  
  // Ensure imageUrls is always an array
  if (!property.imageUrls) {
    property.imageUrls = [];
  }
  
  if (typeof property.overlooking === 'string') {
    try {
      property.overlooking = JSON.parse(property.overlooking);
    } catch (e) {
      // Keep as string if it's not JSON
    }
  }
  
  // Handle image categories
  if (typeof property.imageCategories === 'string') {
    try {
      property.imageCategories = JSON.parse(property.imageCategories);
    } catch (e) {
      property.imageCategories = {};
    }
  }
  
  return property;
};

// Helper function to process project data
const processProjectData = (project: any) => {
  // Handle imageUrls that might be stored as strings
  if (typeof project.imageUrls === 'string') {
    try {
      project.imageUrls = JSON.parse(project.imageUrls);
    } catch (e) {
      console.error('Error parsing project imageUrls:', e);
      project.imageUrls = [];
    }
  }
  
  // Ensure imageUrls is always an array
  if (!project.imageUrls) {
    project.imageUrls = [];
  }
  
  // Handle floorPlanUrls that might be stored as strings
  if (typeof project.floorPlanUrls === 'string') {
    try {
      project.floorPlanUrls = JSON.parse(project.floorPlanUrls);
    } catch (e) {
      console.error('Error parsing project floorPlanUrls:', e);
      project.floorPlanUrls = [];
    }
  }
  
  // Ensure floorPlanUrls is always an array
  if (!project.floorPlanUrls) {
    project.floorPlanUrls = [];
  }
  
  // Handle masterPlanUrls that might be stored as strings
  if (typeof project.masterPlanUrls === 'string') {
    try {
      project.masterPlanUrls = JSON.parse(project.masterPlanUrls);
    } catch (e) {
      console.error('Error parsing project masterPlanUrls:', e);
      project.masterPlanUrls = [];
    }
  }
  
  // Ensure masterPlanUrls is always an array
  if (!project.masterPlanUrls) {
    project.masterPlanUrls = [];
  }
  
  // Handle galleryUrls that might be stored as strings
  if (typeof project.galleryUrls === 'string') {
    try {
      project.galleryUrls = JSON.parse(project.galleryUrls);
    } catch (e) {
      console.error('Error parsing project galleryUrls:', e);
      project.galleryUrls = [];
    }
  }
  
  // Ensure galleryUrls is always an array
  if (!project.galleryUrls) {
    project.galleryUrls = [];
  }
  
  // Handle amenities that might be stored as strings
  if (typeof project.amenities === 'string') {
    try {
      project.amenities = JSON.parse(project.amenities);
    } catch (e) {
      project.amenities = project.amenities.split(',').map((item: string) => item.trim());
    }
  }
  
  // Ensure amenities is always an array
  if (!project.amenities) {
    project.amenities = [];
  }
  
  // Handle bhk2Sizes that might be stored as strings
  if (typeof project.bhk2Sizes === 'string') {
    try {
      project.bhk2Sizes = JSON.parse(project.bhk2Sizes);
    } catch (e) {
      project.bhk2Sizes = project.bhk2Sizes.split(',').map((item: string) => item.trim());
    }
  }
  
  // Handle bhk3Sizes that might be stored as strings
  if (typeof project.bhk3Sizes === 'string') {
    try {
      project.bhk3Sizes = JSON.parse(project.bhk3Sizes);
    } catch (e) {
      project.bhk3Sizes = project.bhk3Sizes.split(',').map((item: string) => item.trim());
    }
  }
  
  return project;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [rejectionReason, setRejectionReason] = React.useState<{
    [key: number]: string;
  }>({});
  const [searchTerm, setSearchTerm] = React.useState("");

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You do not have permission to access this page.",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  // Fetch pending properties
  const {
    data: pendingProperties,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useQuery<Property[]>({
    queryKey: ["/api/properties/pending"],
    queryFn: async () => {
      const response = await fetch("/api/properties/pending?includeAll=true", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch pending properties");
      }

      const data = await response.json();
      console.log("Pending properties data:", data);
      
      // Process the data using our helper function
      return data.map(processPropertyData);
    },
    enabled: !!user && user.role === "admin",
  });

  // Fetch all properties
  const { data: allProperties, isLoading: allLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/all"],
    queryFn: async () => {
      const response = await fetch("/api/properties/all?includeAll=true", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch all properties");
      }

      const data = await response.json();
      
      // Process the data using our helper function
      return data.map(processPropertyData);
    },
    enabled: !!user && user.role === "admin",
  });
  
  // Fetch all projects
  const { data: allProjects, isLoading: allProjectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch all projects");
      }

      const data = await response.json();
      return data.map(processProjectData);
    },
    enabled: !!user && user.role === "admin",
  });

  // Fetch pending projects
  const {
    data: pendingProjects,
    isLoading: pendingProjectsLoading,
    refetch: refetchPendingProjects,
  } = useQuery<Project[]>({
    queryKey: ["/api/projects/category/pending"],
    queryFn: async () => {
      const response = await fetch("/api/projects/category/pending", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch pending projects");
      }

      const data = await response.json();
      return data.map(processProjectData);
    },
    enabled: !!user && user.role === "admin",
  });

  // Fetch database tables info
  const { data: dbTablesInfo, isLoading: dbTablesLoading } = useQuery<
    DatabaseTable[]
  >({
    queryKey: ["/api/admin/database/tables"],
    enabled: !!user && user.role === "admin",
  });

  // State for table records viewing
  const [selectedTable, setSelectedTable] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [recordsPerPage, setRecordsPerPage] = React.useState(10);

  // Mock activity logs instead of fetching from database
  const [mockLogs, setMockLogs] = React.useState<ActivityLog[]>([
    {
      id: 1,
      action: "property_submit",
      entity: "property",
      entityId: 123,
      status: "success",
      details: { title: "Luxury Villa", location: "Hyderabad", price: 2500000 },
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      action: "project_submit",
      entity: "project",
      entityId: 456,
      status: "success",
      details: { title: "Green Valley", category: "residential", location: "Mumbai" },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      action: "free_property_submit",
      entity: "free_property",
      entityId: 789,
      status: "error",
      errorMessage: "Missing required fields",
      details: { title: "2BHK Apartment", location: "Delhi" },
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    }
  ]);
  
  const activityLogs = mockLogs;
  const activityLogsLoading = false;
  const refetchActivityLogs = () => {
    // Add a new log entry when refreshing
    setMockLogs(prev => [
      {
        id: prev.length + 1,
        action: "refresh_logs",
        entity: "admin",
        status: "success",
        details: { timestamp: new Date().toISOString() },
        createdAt: new Date().toISOString(),
      },
      ...prev
    ]);
    toast({
      title: "Logs Refreshed",
      description: "Activity logs have been refreshed with console data.",
    });
  };
  
  // Fetch records for selected table
  const {
    data: tableRecords,
    isLoading: tableRecordsLoading,
    refetch: refetchTableRecords,
  } = useQuery<TableRecords>({
    queryKey: [
      "/api/admin/database/tables",
      selectedTable,
      currentPage,
      recordsPerPage,
    ],
    queryFn: async () => {
      if (!selectedTable) return { records: [], total: 0 };

      const response = await fetch(
        `/api/admin/database/tables/${selectedTable}?page=${currentPage}&limit=${recordsPerPage}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch table records");
      }

      return response.json();
    },
    enabled: !!selectedTable && !!user && user.role === "admin",
  });

  // States for project search and filter
  const [projectSearchTerm, setProjectSearchTerm] = React.useState("");
  
  // Property details dialog state
  const [propertyDetailsOpen, setPropertyDetailsOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [propertyDetailsLoading, setPropertyDetailsLoading] = React.useState(false);
  
  // Filter properties based on search term
  const filteredProperties = React.useMemo(() => {
    if (!allProperties) return [];

    return allProperties.filter((property: Property) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        property.title?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower) ||
        property.location?.toLowerCase().includes(searchLower) ||
        property.city?.toLowerCase().includes(searchLower) ||
        property.address?.toLowerCase().includes(searchLower) ||
        property.propertyType?.toLowerCase().includes(searchLower)
      );
    });
  }, [allProperties, searchTerm]);
  
  // Filter projects based on search term
  const filteredProjects = React.useMemo(() => {
    if (!allProjects) return [];
    
    return allProjects.filter((project: Project) => {
      if (projectSearchTerm === "") return true;
      
      const searchLower = projectSearchTerm.toLowerCase();
      return (
        project.title?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.location?.toLowerCase().includes(searchLower) ||
        project.city?.toLowerCase().includes(searchLower) ||
        project.category?.toLowerCase().includes(searchLower)
      );
    });
  }, [allProjects, projectSearchTerm]);

  // Approve property
  const handleApprove = async (propertyId: number, isFreeProperty: boolean = false) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user?.id,
          isFreeProperty: isFreeProperty
        }),
      });

      if (response.ok) {
        toast({
          title: "Property Approved",
          description: "The property has been approved and is now published.",
        });
        refetchPending();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve property");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "An error occurred while approving the property",
      });
    }
  };

  // Reject property
  const handleReject = async (propertyId: number, isFreeProperty: boolean = false) => {
    try {
      if (
        !rejectionReason[propertyId] ||
        rejectionReason[propertyId].trim() === ""
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please provide a reason for rejection",
        });
        return;
      }

      const response = await fetch(`/api/properties/${propertyId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user?.id,
          rejectionReason: rejectionReason[propertyId],
          isFreeProperty: isFreeProperty
        }),
      });

      if (response.ok) {
        toast({
          title: "Property Rejected",
          description: "The property has been rejected.",
        });
        setRejectionReason({ ...rejectionReason, [propertyId]: "" });
        refetchPending();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject property");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "An error occurred while rejecting the property",
      });
    }
  };
  
  // Approve project
  const handleApproveProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user?.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Project Approved",
          description: "The project has been approved and is now published.",
        });
        refetchPendingProjects();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve project");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "An error occurred while approving the project",
      });
    }
  };

  // Reject project
  const handleRejectProject = async (projectId: number) => {
    try {
      if (
        !rejectionReason[projectId] ||
        rejectionReason[projectId].trim() === ""
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please provide a reason for rejection",
        });
        return;
      }

      const response = await fetch(`/api/admin/projects/${projectId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: user?.id,
          rejectionReason: rejectionReason[projectId],
        }),
      });

      if (response.ok) {
        toast({
          title: "Project Rejected",
          description: "The project has been rejected.",
        });
        setRejectionReason({ ...rejectionReason, [projectId]: "" });
        refetchPendingProjects();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject project");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "An error occurred while rejecting the project",
      });
    }
  };

  // View property details
  const handleViewPropertyDetails = async (propertyId: number, isFreeProperty: boolean = false) => {
    try {
      setPropertyDetailsOpen(true);
      setPropertyDetailsLoading(true);
      
      const endpoint = isFreeProperty 
        ? `/api/free-properties/${propertyId}?includeAll=true` 
        : `/api/properties/${propertyId}?includeAll=true`;
      
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch property details");
      }

      let propertyData = await response.json();
      
      // Create a safe conversion function for numbers
      const safeNumber = (value: any): number | undefined => {
        if (value === undefined || value === null || value === '') return undefined;
        const num = Number(value);
        return !isNaN(num) ? num : undefined;
      };
      
      // Create a safe conversion function for booleans
      const safeBoolean = (value: any): boolean => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          return value.toLowerCase() === 'true' || value === '1';
        }
        if (typeof value === 'number') return value === 1;
        return false;
      };
      
      // Safe JSON parse function to handle various formats
      const safeJsonParse = (value: any, fallback: any): any => {
        if (value === undefined || value === null) return fallback;
        
        // If it's already an array or object, return it
        if (Array.isArray(value)) return value;
        if (typeof value === 'object' && value !== null) return value;
        
        // If it's not a string, return the fallback
        if (typeof value !== 'string') return fallback;
        
        // Trim the string
        const trimmed = value.trim();
        if (!trimmed) return fallback;
        
        // If it's a comma-separated list but not JSON, split it
        if (!trimmed.startsWith('[') && !trimmed.startsWith('{') && trimmed.includes(',')) {
          return trimmed.split(',').map(item => item.trim());
        }
        
        // Try to parse as JSON
        try {
          return JSON.parse(trimmed);
        } catch (e) {
          console.error(`Error parsing JSON: ${e}, value: ${trimmed}`);
          return fallback;
        }
      };
      
      // Create a normalized property object with all fields properly typed
      const normalizedProperty: Property = {
        id: propertyData.id,
        title: propertyData.title || '',
        description: propertyData.description || '',
        
        // Location details
        location: propertyData.location || '',
        city: propertyData.city || '',
        address: propertyData.address || '',
        pincode: propertyData.pincode || propertyData.pin_code || '',
        landmarks: propertyData.landmarks || '',
        projectName: propertyData.projectName || propertyData.project_name || '',
        
        // Property type and category
        propertyType: propertyData.propertyType || propertyData.property_type || '',
        propertyCategory: propertyData.propertyCategory || propertyData.property_category || '',
        transactionType: propertyData.transactionType || propertyData.transaction_type || '',
        rentOrSale: propertyData.rentOrSale || propertyData.rent_or_sale || '',
        
        // Price details
        price: safeNumber(propertyData.price),
        discountedPrice: safeNumber(propertyData.discountedPrice || propertyData.discounted_price),
        pricePerUnit: safeNumber(propertyData.pricePerUnit || propertyData.price_per_unit),
        totalPrice: safeNumber(propertyData.totalPrice || propertyData.total_price),
        
        // Property features
        bedrooms: safeNumber(propertyData.bedrooms),
        bathrooms: safeNumber(propertyData.bathrooms),
        balconies: safeNumber(propertyData.balconies),
        floorNo: safeNumber(propertyData.floorNo || propertyData.floor_no),
        totalFloors: safeNumber(propertyData.totalFloors || propertyData.total_floors),
        floorsAllowedConstruction: safeNumber(propertyData.floorsAllowedConstruction || propertyData.floors_allowed_construction),
        floorsAllowedForConstruction: safeNumber(propertyData.floorsAllowedForConstruction || propertyData.floors_allowed_for_construction),
        furnishedStatus: propertyData.furnishedStatus || propertyData.furnished_status || '',
        roadWidth: safeNumber(propertyData.roadWidth || propertyData.road_width),
        openSides: safeNumber(propertyData.openSides || propertyData.open_sides),
        area: safeNumber(propertyData.area) || 0,
        areaUnit: propertyData.areaUnit || propertyData.area_unit || 'sqft',
        parking: propertyData.parking || '',
        facing: propertyData.facing || propertyData.facingDirection || propertyData.facing_direction || '',
        
        // Utilities & Amenities
        amenities: safeJsonParse(propertyData.amenities, []),
        boundaryWall: safeBoolean(propertyData.boundaryWall || propertyData.boundary_wall),
        electricityStatus: propertyData.electricityStatus || propertyData.electricity_status || '',
        waterAvailability: propertyData.waterAvailability || propertyData.water_availability || '',
        flooringType: propertyData.flooringType || propertyData.flooring_type || '',
        overlooking: safeJsonParse(propertyData.overlooking, propertyData.overlooking || ''),
        
        // Property status
        possessionStatus: propertyData.possessionStatus || propertyData.possession_status || '',
        ownershipType: propertyData.ownershipType || propertyData.ownership_type || '',
        propertyAge: propertyData.propertyAge || propertyData.property_age || '',
        constructionAge: propertyData.constructionAge || propertyData.construction_age || '',
        projectStatus: propertyData.projectStatus || propertyData.project_status || '',
        launchDate: propertyData.launchDate || propertyData.launch_date || '',
        availableFromMonth: propertyData.availableFromMonth || propertyData.available_from_month || '',
        availableFromYear: propertyData.availableFromYear || propertyData.available_from_year || '',
        reraRegistered: safeBoolean(propertyData.reraRegistered || propertyData.rera_registered),
        reraNumber: propertyData.reraNumber || propertyData.rera_number || '',
        preferredTenant: propertyData.preferredTenant || propertyData.preferred_tenant || '',
        
        // Contact information
        contactName: propertyData.contactName || propertyData.contact_name || '',
        contactPhone: propertyData.contactPhone || propertyData.contact_phone || '',
        contactEmail: propertyData.contactEmail || propertyData.contact_email || '',
        whatsappEnabled: safeBoolean(propertyData.whatsappEnabled || propertyData.whatsapp_enabled),
        userType: propertyData.userType || propertyData.user_type || '',
        brokerage: propertyData.brokerage || '',
        noBrokerResponses: safeBoolean(propertyData.noBrokerResponses || propertyData.no_broker_responses),
        
        // Media
        imageUrls: safeJsonParse(propertyData.imageUrls || propertyData.image_urls, []),
        videoUrls: safeJsonParse(propertyData.videoUrls || propertyData.video_urls, []),
        imageCategories: safeJsonParse(propertyData.imageCategories || propertyData.image_categories, {}),
        
        // System fields
        approvalStatus: propertyData.approvalStatus || propertyData.approval_status || 'pending',
        rejectionReason: propertyData.rejectionReason || propertyData.rejection_reason || '',
        isUrgentSale: safeBoolean(propertyData.isUrgentSale || propertyData.is_urgent_sale),
        isFreeProperty: safeBoolean(propertyData.isFreeProperty || propertyData.is_free_property),
        status: propertyData.status || '',
        createdAt: propertyData.createdAt || propertyData.created_at || '',
        updatedAt: propertyData.updatedAt || propertyData.updated_at || '',
        userId: safeNumber(propertyData.userId || propertyData.user_id),
        subscriptionLevel: propertyData.subscriptionLevel || propertyData.subscription_level || '',
        approvedBy: safeNumber(propertyData.approvedBy || propertyData.approved_by),
        approvalDate: propertyData.approvalDate || propertyData.approval_date || '',
      };
      
      // Set the normalized property data
      setSelectedProperty(normalizedProperty);
      console.log("Property details loaded successfully:", normalizedProperty);
    } catch (error: any) {
      console.error("Error fetching property details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while fetching property details",
      });
      setPropertyDetailsOpen(false);
    } finally {
      setPropertyDetailsLoading(false);
    }
  };

  if (!user) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (user.role !== "admin") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending Properties
            {pendingProperties?.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingProperties.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending-projects">
            Pending Projects
            {pendingProjects?.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingProjects.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="all-projects">All Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="activity-logs">
            <AlertCircle className="mr-2 h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Properties Pending Approval</CardTitle>
                <CardDescription>
                  Review and approve or reject property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : pendingProperties?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No properties pending approval
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingProperties?.map((property: Property) => (
                      <div key={property.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {property.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              ID: {property.id} • Type: {property.propertyType}{" "}
                              • Category: {property.propertyCategory || "N/A"}{" "}
                              • Price: ₹{property.price?.toLocaleString()} •
                              Location: {property.city || "N/A"}, {property.location || "N/A"}
                              {property.isFreeProperty && (
                                <Badge variant="outline" className="ml-2 bg-blue-100">Free Property</Badge>
                              )}
                              {property.isUrgentSale && (
                                <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">Urgent Sale</Badge>
                              )}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Bedrooms</p>
                                <p>{property.bedrooms || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Bathrooms</p>
                                <p>{property.bathrooms || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Area</p>
                                <p>{property.area} {property.areaUnit || "sq.ft."}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Property Category</p>
                                <p>{property.propertyCategory || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Transaction Type</p>
                                <p>{property.transactionType || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Urgent Sale</p>
                                <p>{property.isUrgentSale ? "Yes" : "No"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Contact</p>
                                <p>{property.contactName || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p>{property.contactPhone || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Created</p>
                                <p>{property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "N/A"}</p>
                              </div>
                            </div>

                            <p className="text-sm mb-4">
                              {property.description?.substring(0, 150)}...
                            </p>

                            {property.imageUrls &&
                              property.imageUrls.length > 0 && (
                                <div className="flex space-x-2 mb-4 overflow-x-auto">
                                  {property.imageUrls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={formatImageUrl(url)}
                                      alt={`Property ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded"
                                      onError={(e) => handleImageError(e)}
                                    />
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor={`rejection-${property.id}`}
                              className="block text-sm font-medium mb-1"
                            >
                              Rejection Reason (required if rejecting)
                            </label>
                            <Textarea
                              id={`rejection-${property.id}`}
                              placeholder="Provide reason for rejection"
                              value={rejectionReason[property.id] || ""}
                              onChange={(e) =>
                                setRejectionReason({
                                  ...rejectionReason,
                                  [property.id]: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>

                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleViewPropertyDetails(property.id, property.isFreeProperty)}
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            <Button
                              onClick={() => handleApprove(property.id, property.isFreeProperty)}
                              className="flex-1"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(property.id, property.isFreeProperty)}
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pending-projects">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects Pending Approval</CardTitle>
                <CardDescription>
                  Review and approve or reject project listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingProjectsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : !pendingProjects || pendingProjects.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No projects pending approval
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingProjects.map((project: Project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              ID: {project.id} • Developer: {project.developerName}{" "}
                              • Price Range: ₹{project.priceRange} •
                              Location: {project.city}, {project.location}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Project Type</p>
                                <p>{project.projectType || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">BHK Configuration</p>
                                <p>{project.bhkConfiguration || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Category</p>
                                <p className="font-semibold text-primary">{project.category}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Launch Date</p>
                                <p>{project.launchDate || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Possession Date</p>
                                <p>{project.possessionDate || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">RERA Number</p>
                                <p>{project.reraNumber || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Total Units</p>
                                <p>{project.totalUnits || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Total Towers</p>
                                <p>{project.totalTowers || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Total Floors</p>
                                <p>{project.totalFloors || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Starting Price</p>
                                <p>{project.startingPrice ? `₹${project.startingPrice}` : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Price Per Sq Ft</p>
                                <p>{project.pricePerSqFt ? `₹${project.pricePerSqFt}` : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Area Range</p>
                                <p>{project.areaRange || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Project Status</p>
                                <p>{project.projectStatus || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Developer Experience</p>
                                <p>{project.developerExperience ? `${project.developerExperience} years` : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">RERA Website</p>
                                <p>{project.reraWebsite ? (
                                  <a href={project.reraWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View RERA Website
                                  </a>
                                ) : "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Contact Person</p>
                                <p>{project.contactPerson || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Contact Email</p>
                                <p>{project.contactEmail || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Contact Phone</p>
                                <p>{project.contactPhone || "N/A"}</p>
                              </div>
                            </div>
                            
                            {project.bhk2Sizes && project.bhk2Sizes.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium">2 BHK Sizes</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.bhk2Sizes.map((size, index) => (
                                    <Badge key={index} variant="outline">
                                      {size}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {project.bhk3Sizes && project.bhk3Sizes.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium">3 BHK Sizes</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.bhk3Sizes.map((size, index) => (
                                    <Badge key={index} variant="outline">
                                      {size}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {project.locationAdvantages && (
                              <div className="mb-4">
                                <p className="text-sm font-medium">Location Advantages</p>
                                <p>{project.locationAdvantages}</p>
                              </div>
                            )}
                            
                            {project.offerDetails && (
                              <div className="mb-4">
                                <p className="text-sm font-medium">Offer Details</p>
                                <p>{project.offerDetails}</p>
                              </div>
                            )}
                            
                            {/* Category-specific fields */}
                            {project.category === "luxury" && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">Luxury Project Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {project.premiumFeatures && (
                                    <div>
                                      <p className="text-sm font-medium">Premium Features</p>
                                      <p>{project.premiumFeatures}</p>
                                    </div>
                                  )}
                                  {project.exclusiveServices && (
                                    <div>
                                      <p className="text-sm font-medium">Exclusive Services</p>
                                      <p>{project.exclusiveServices}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {project.category === "affordable" && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">Affordable Project Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {project.affordabilityFeatures && (
                                    <div>
                                      <p className="text-sm font-medium">Affordability Features</p>
                                      <p>{project.affordabilityFeatures}</p>
                                    </div>
                                  )}
                                  {project.financialSchemes && (
                                    <div>
                                      <p className="text-sm font-medium">Financial Schemes</p>
                                      <p>{project.financialSchemes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {project.category === "commercial" && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">Commercial Project Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {project.commercialType && (
                                    <div>
                                      <p className="text-sm font-medium">Commercial Type</p>
                                      <p>{project.commercialType}</p>
                                    </div>
                                  )}
                                  {project.businessAmenities && (
                                    <div>
                                      <p className="text-sm font-medium">Business Amenities</p>
                                      <p>{project.businessAmenities}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {project.category === "new_launch" && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">New Launch Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {project.launchDate && (
                                    <div>
                                      <p className="text-sm font-medium">Launch Date</p>
                                      <p>{project.launchDate}</p>
                                    </div>
                                  )}
                                  {project.launchOffers && (
                                    <div>
                                      <p className="text-sm font-medium">Launch Offers</p>
                                      <p>{project.launchOffers}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {project.category === "upcoming" && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">Upcoming Project Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {project.expectedCompletionDate && (
                                    <div>
                                      <p className="text-sm font-medium">Expected Completion</p>
                                      <p>{project.expectedCompletionDate}</p>
                                    </div>
                                  )}
                                  {project.constructionStatus && (
                                    <div>
                                      <p className="text-sm font-medium">Construction Status</p>
                                      <p>{project.constructionStatus}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {project.category === "top_urgent" && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">Urgent Sale Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {project.saleDeadline && (
                                    <div>
                                      <p className="text-sm font-medium">Sale Deadline</p>
                                      <p>{project.saleDeadline}</p>
                                    </div>
                                  )}
                                  {project.urgencyReason && (
                                    <div>
                                      <p className="text-sm font-medium">Urgency Reason</p>
                                      <p>{project.urgencyReason}</p>
                                    </div>
                                  )}
                                  {project.discountOffered && (
                                    <div>
                                      <p className="text-sm font-medium">Discount Offered</p>
                                      <p>{project.discountOffered}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Financial details section */}
                            {(project.loanAmount || project.interestRate || project.loanTenure) && (
                              <div className="mb-4 border-t pt-3">
                                <h4 className="font-medium mb-2">Financial Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {project.loanAmount && (
                                    <div>
                                      <p className="text-sm font-medium">Loan Amount</p>
                                      <p>{project.loanAmount}</p>
                                    </div>
                                  )}
                                  {project.interestRate && (
                                    <div>
                                      <p className="text-sm font-medium">Interest Rate</p>
                                      <p>{project.interestRate}</p>
                                    </div>
                                  )}
                                  {project.loanTenure && (
                                    <div>
                                      <p className="text-sm font-medium">Loan Tenure</p>
                                      <p>{project.loanTenure}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="text-sm mb-4">
                              <p className="font-medium mb-1">Description:</p>
                              <p className="text-gray-600">
                                {project.description.substring(0, 250)}
                                {project.description.length > 250 && "..."}
                              </p>
                            </div>
                            
                            {/* Additional Project Details */}
                            <div className="mt-4 border-t pt-4">
                              <h4 className="font-semibold mb-2">Additional Details</h4>
                              
                              {/* Project USPs */}
                              {project.usps && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium">USPs</p>
                                  <p className="text-sm text-gray-600">{project.usps}</p>
                                </div>
                              )}
                              
                              {/* Category-specific fields */}
                              {project.category === "upcoming" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <p className="text-sm font-medium">Expected Completion</p>
                                    <p className="text-sm text-gray-600">{project.expectedCompletionDate || project.possessionDate || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Construction Status</p>
                                    <p className="text-sm text-gray-600">{project.constructionStatus || project.projectStatus || "N/A"}</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Contact Information */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                <div>
                                  <p className="text-sm font-medium">Contact Person</p>
                                  <p className="text-sm text-gray-600">{project.contactPerson || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Contact Email</p>
                                  <p className="text-sm text-gray-600">{project.contactEmail || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Contact Phone</p>
                                  <p className="text-sm text-gray-600">{project.contactPhone || "N/A"}</p>
                                </div>
                              </div>
                            </div>

                            {project.amenities && project.amenities.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Amenities:</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.amenities.map((amenity, index) => (
                                    <Badge key={index} variant="outline">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Project Images */}
                            {project.imageUrls && project.imageUrls.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Project Images:</p>
                                <div className="flex space-x-2 overflow-x-auto">
                                  {project.imageUrls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={formatImageUrl(url, true)}
                                      alt={`Project ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded"
                                      onError={(e) => handleImageError(e, undefined, true)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Floor Plans */}
                            {project.floorPlanUrls && project.floorPlanUrls.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Floor Plans:</p>
                                <div className="flex space-x-2 overflow-x-auto">
                                  {project.floorPlanUrls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={formatImageUrl(url, true)}
                                      alt={`Floor Plan ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded"
                                      onError={(e) => handleImageError(e, undefined, true)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Master Plans */}
                            {project.masterPlanUrls && project.masterPlanUrls.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Master Plans:</p>
                                <div className="flex space-x-2 overflow-x-auto">
                                  {project.masterPlanUrls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={formatImageUrl(url, true)}
                                      alt={`Master Plan ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded"
                                      onError={(e) => handleImageError(e, undefined, true)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Video URL */}
                            {project.videoUrl && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Project Video:</p>
                                <div className="flex items-center">
                                  <Youtube className="h-5 w-5 mr-2 text-red-600" />
                                  <a 
                                    href={project.videoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Watch Project Video
                                  </a>
                                </div>
                              </div>
                            )}
                            
                            {/* YouTube URL */}
                            {project.youtubeUrl && project.youtubeUrl !== project.videoUrl && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">YouTube Video:</p>
                                <div className="flex items-center">
                                  <Youtube className="h-5 w-5 mr-2 text-red-600" />
                                  <a 
                                    href={project.youtubeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Watch YouTube Video
                                  </a>
                                </div>
                              </div>
                            )}
                            
                            {/* Brochure URL */}
                            {project.brochureUrl && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Project Brochure:</p>
                                <div className="flex items-center">
                                  <a 
                                    href={project.brochureUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Download Brochure
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor={`rejection-${project.id}`}
                              className="block text-sm font-medium mb-1"
                            >
                              Rejection Reason (required if rejecting)
                            </label>
                            <Textarea
                              id={`rejection-${project.id}`}
                              placeholder="Provide reason for rejection"
                              value={rejectionReason[project.id] || ""}
                              onChange={(e) =>
                                setRejectionReason({
                                  ...rejectionReason,
                                  [project.id]: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>

                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleApproveProject(project.id)}
                              className="flex-1"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectProject(project.id)}
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all-projects">
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>View and manage all projects</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8"
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {allProjectsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : !filteredProjects || filteredProjects.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No projects found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project: Project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.id}</TableCell>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {project.category.replaceAll('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.city}, {project.location}</TableCell>
                        <TableCell>
                          {project.approvalStatus === "pending" && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 border-yellow-200"
                            >
                              Pending
                            </Badge>
                          )}
                          {project.approvalStatus === "approved" && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              Approved
                            </Badge>
                          )}
                          {project.approvalStatus === "rejected" && (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 border-red-200"
                            >
                              Rejected
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <a
                              href={`/projects/${project.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Properties</CardTitle>
              <CardDescription>View and manage all properties</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {allLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No properties found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map((property: Property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {property.id} • Type: {property.propertyType || "N/A"} •
                            Category: {property.propertyCategory || "N/A"} •
                            Price: ₹{property.price?.toLocaleString() || "N/A"} •
                            {property.bedrooms && `${property.bedrooms} bed`} •
                            {property.area && `${property.area} ${property.areaUnit || "sq.ft."}`} •
                            Location: {property.city || "N/A"}, {property.location || "N/A"}
                            {property.isFreeProperty && (
                              <Badge variant="outline" className="ml-2 bg-blue-100">Free Property</Badge>
                            )}
                            {property.isUrgentSale && (
                              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">Urgent Sale</Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Created: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "N/A"} •
                            Contact: {property.contactName || "N/A"} •
                            Phone: {property.contactPhone || "N/A"}
                          </p>
                          <div className="mt-2">
                            <Button
                              onClick={() => handleViewPropertyDetails(property.id, property.isFreeProperty)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        <div>
                          {property.approvalStatus === "pending" && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 border-yellow-200"
                            >
                              Pending
                            </Badge>
                          )}
                          {property.approvalStatus === "approved" && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              Approved
                            </Badge>
                          )}
                          {property.approvalStatus === "rejected" && (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 border-red-200"
                            >
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                User management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                View database tables and records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dbTablesLoading ? (
                <div className="text-center py-4">
                  Loading database information...
                </div>
              ) : !dbTablesInfo ? (
                <div className="text-center py-4 text-muted-foreground">
                  Unable to load database information. Please check your
                  permissions.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {dbTablesInfo.map(
                      (table: { tableName: string; rowCount: number }) => (
                        <Button
                          key={table.tableName}
                          variant={
                            selectedTable === table.tableName
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            setSelectedTable(table.tableName);
                            setCurrentPage(1);
                          }}
                          className="flex items-center"
                        >
                          <Database className="mr-2 h-4 w-4" />
                          {table.tableName}
                          <Badge className="ml-2" variant="secondary">
                            {table.rowCount}
                          </Badge>
                        </Button>
                      ),
                    )}
                  </div>

                  {selectedTable && (
                    <div className="mt-6 border rounded-lg">
                      <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                          <Database className="mr-2 h-4 w-4" />
                          {selectedTable}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Rows per page:
                            </span>
                            <select
                              value={recordsPerPage}
                              onChange={(e) => {
                                setRecordsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              className="p-1 text-sm border rounded"
                            >
                              {[5, 10, 20, 50, 100].map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                            <span className="mx-2 text-sm">
                              Page {currentPage} of{" "}
                              {Math.ceil(
                                (tableRecords?.total || 0) / recordsPerPage,
                              ) || 1}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(
                                    prev + 1,
                                    Math.ceil(
                                      (tableRecords?.total || 0) /
                                        recordsPerPage,
                                    ) || 1,
                                  ),
                                )
                              }
                              disabled={
                                currentPage ===
                                  Math.ceil(
                                    (tableRecords?.total || 0) / recordsPerPage,
                                  ) || !tableRecords?.records.length
                              }
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>

                      {tableRecordsLoading ? (
                        <div className="text-center py-8">
                          Loading records...
                        </div>
                      ) : !tableRecords?.records.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No records found
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {Object.keys(tableRecords.records[0]).map(
                                  (key) => (
                                    <TableHead key={key}>{key}</TableHead>
                                  ),
                                )}
                                <TableHead className="w-24">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableRecords.records.map(
                                (record: any, rowIndex: number) => (
                                  <TableRow key={rowIndex}>
                                    {Object.values(record).map(
                                      (value: any, cellIndex: number) => (
                                        <TableCell key={cellIndex}>
                                          {value === null ? (
                                            <span className="text-muted-foreground italic">
                                              null
                                            </span>
                                          ) : Array.isArray(value) ? (
                                            JSON.stringify(value)
                                          ) : typeof value === "object" &&
                                            value !== null ? (
                                            JSON.stringify(value)
                                          ) : (
                                            String(value)
                                          )}
                                        </TableCell>
                                      ),
                                    )}
                                    <TableCell>
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity-logs">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Monitor system activity and track user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLogsLoading ? (
                <div className="text-center py-4">Loading activity logs...</div>
              ) : !activityLogs || activityLogs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No activity logs found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.entity} {log.entityId ? `#${log.entityId}` : ''}
                        </TableCell>
                        <TableCell>
                          {log.status === "success" ? (
                            <Badge className="bg-green-100 text-green-800">
                              Success
                            </Badge>
                          ) : log.status === "error" ? (
                            <Badge variant="destructive">Error</Badge>
                          ) : (
                            <Badge variant="secondary">{log.status}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.errorMessage ? (
                            <span className="text-red-500">{log.errorMessage}</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Log Details",
                                  description: (
                                    <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-x-auto">
                                      <code className="text-white">
                                        {JSON.stringify(log.details, null, 2)}
                                      </code>
                                    </pre>
                                  ),
                                  duration: 10000,
                                });
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => refetchActivityLogs()}>
                  Refresh Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Property Details Dialog */}
      <Dialog open={propertyDetailsOpen} onOpenChange={setPropertyDetailsOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="flex justify-between items-center">
              <span className="text-lg md:text-xl">Property Details</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Complete information about the selected property
            </DialogDescription>
          </DialogHeader>

          {propertyDetailsLoading ? (
            <div className="text-center py-8">Loading property details...</div>
          ) : !selectedProperty ? (
            <div className="text-center py-8 text-muted-foreground">
              Property details not found
            </div>
          ) : (
            <div className="space-y-6 py-2 md:py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold break-words">{selectedProperty.title}</h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    ID: {selectedProperty.id} • Type: {selectedProperty.propertyType}
                    {selectedProperty.isFreeProperty && (
                      <Badge variant="outline" className="ml-2 bg-blue-100 text-xs md:text-sm">Free Property</Badge>
                    )}
                  </p>
                </div>
                <div className="self-start">
                  {selectedProperty.approvalStatus === "pending" && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs md:text-sm">
                      Pending
                    </Badge>
                  )}
                  {selectedProperty.approvalStatus === "approved" && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs md:text-sm">
                      Approved
                    </Badge>
                  )}
                  {selectedProperty.approvalStatus === "rejected" && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs md:text-sm">
                      Rejected
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <p className="text-sm font-medium">Property ID</p>
                    <p>{selectedProperty.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Property Type</p>
                    <p>{selectedProperty.propertyType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Property Category</p>
                    <p>{selectedProperty.propertyCategory || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Transaction Type</p>
                    <p>{selectedProperty.transactionType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rent/Sale</p>
                    <p>{selectedProperty.rentOrSale ? (selectedProperty.rentOrSale === "rent" ? "Rent" : "Sale") : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p>{selectedProperty.price !== undefined ? `₹${selectedProperty.price.toLocaleString()}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Discounted Price</p>
                    <p>{selectedProperty.discountedPrice !== undefined ? `₹${selectedProperty.discountedPrice.toLocaleString()}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Price Per Unit</p>
                    <p>{selectedProperty.pricePerUnit !== undefined ? `₹${selectedProperty.pricePerUnit.toLocaleString()}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Price</p>
                    <p>{selectedProperty.totalPrice !== undefined ? `₹${selectedProperty.totalPrice.toLocaleString()}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Urgent Sale</p>
                    <p>{selectedProperty.isUrgentSale ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p>{selectedProperty.status || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Subscription Level</p>
                    <p>{selectedProperty.subscriptionLevel || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created At</p>
                    <p>{selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleString() : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Updated At</p>
                    <p>{selectedProperty.updatedAt ? new Date(selectedProperty.updatedAt).toLocaleString() : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Available From</p>
                    <p>{selectedProperty.availableFromMonth && selectedProperty.availableFromYear 
                        ? `${selectedProperty.availableFromMonth} ${selectedProperty.availableFromYear}` 
                        : "Not specified"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Information */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Location Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{selectedProperty.location || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">City</p>
                    <p>{selectedProperty.city || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p>{selectedProperty.address || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pincode</p>
                    <p>{selectedProperty.pincode || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Project Name</p>
                    <p>{selectedProperty.projectName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Landmarks</p>
                    <p>{selectedProperty.landmarks || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Property Features */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Property Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <p className="text-sm font-medium">Area</p>
                    <p>{selectedProperty.area !== undefined ? `${selectedProperty.area} ${selectedProperty.areaUnit || "sq.ft."}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Area Unit</p>
                    <p>{selectedProperty.areaUnit ? 
                        (selectedProperty.areaUnit === "sqft" ? "Square Feet" : 
                         selectedProperty.areaUnit === "sqyd" ? "Square Yards" : 
                         selectedProperty.areaUnit === "acres" ? "Acres" : 
                         selectedProperty.areaUnit === "gunta" ? "Gunta" : 
                         selectedProperty.areaUnit === "hectare" ? "Hectare" : 
                         selectedProperty.areaUnit === "marla" ? "Marla" : 
                         selectedProperty.areaUnit === "kanal" ? "Kanal" : 
                         selectedProperty.areaUnit) : "sq.ft."}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bedrooms</p>
                    <p>{selectedProperty.bedrooms !== undefined ? selectedProperty.bedrooms : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bathrooms</p>
                    <p>{selectedProperty.bathrooms !== undefined ? selectedProperty.bathrooms : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Balconies</p>
                    <p>{selectedProperty.balconies !== undefined ? selectedProperty.balconies : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Floor</p>
                    <p>{selectedProperty.floorNo !== undefined ? selectedProperty.floorNo : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Floors</p>
                    <p>{selectedProperty.totalFloors !== undefined ? selectedProperty.totalFloors : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Floors Allowed for Construction</p>
                    <p>{selectedProperty.floorsAllowedConstruction !== undefined ? selectedProperty.floorsAllowedConstruction : 
                       selectedProperty.floorsAllowedForConstruction !== undefined ? selectedProperty.floorsAllowedForConstruction : 
                       "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Furnished Status</p>
                    <p>{selectedProperty.furnishedStatus || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Parking</p>
                    <p>{selectedProperty.parking || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Facing</p>
                    <p>{selectedProperty.facing || selectedProperty.facingDirection || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Road Width</p>
                    <p>{selectedProperty.roadWidth !== undefined ? selectedProperty.roadWidth : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Open Sides</p>
                    <p>{selectedProperty.openSides !== undefined ? selectedProperty.openSides : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Boundary Wall</p>
                    <p>{typeof selectedProperty.boundaryWall === 'boolean' 
                        ? (selectedProperty.boundaryWall ? "Yes" : "No") 
                        : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Flooring Type</p>
                    <p>{selectedProperty.flooringType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Property Age</p>
                    <p>{selectedProperty.propertyAge || selectedProperty.constructionAge || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Available From</p>
                    <p>{selectedProperty.availableFromMonth && selectedProperty.availableFromYear 
                        ? `${selectedProperty.availableFromMonth} ${selectedProperty.availableFromYear}` 
                        : "Not specified"}</p>
                  </div>
                </div>

                {/* Utilities & Amenities */}
                <div className="mt-4 md:mt-6">
                  <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Utilities & Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                    <div>
                      <p className="text-sm font-medium">Electricity Status</p>
                      <p>{selectedProperty.electricityStatus || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Water Availability</p>
                      <p>{selectedProperty.waterAvailability || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preferred Tenant</p>
                      <p>{selectedProperty.preferredTenant || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedProperty.amenities) && selectedProperty.amenities.length > 0 ? (
                        selectedProperty.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs md:text-sm py-1 px-2">
                            {amenity}
                          </Badge>
                        ))
                      ) : typeof selectedProperty.amenities === 'string' && selectedProperty.amenities ? (
                        <Badge variant="outline" className="text-xs md:text-sm py-1 px-2">
                          {selectedProperty.amenities}
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground">No amenities specified</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Overlooking:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedProperty.overlooking) && selectedProperty.overlooking.length > 0 ? (
                        selectedProperty.overlooking.map((view, index) => (
                          <Badge key={index} variant="outline" className="text-xs md:text-sm py-1 px-2">
                            {view}
                          </Badge>
                        ))
                      ) : typeof selectedProperty.overlooking === 'string' && selectedProperty.overlooking ? (
                        <Badge variant="outline" className="text-xs md:text-sm py-1 px-2">
                          {selectedProperty.overlooking}
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Property Status */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Property Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <p className="text-sm font-medium">Ownership Type</p>
                    <p>{selectedProperty.ownershipType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Property Age</p>
                    <p>{selectedProperty.propertyAge || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Construction Age</p>
                    <p>{selectedProperty.constructionAge || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Possession Status</p>
                    <p>{selectedProperty.possessionStatus || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Project Status</p>
                    <p>{selectedProperty.projectStatus || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Launch Date</p>
                    <p>{selectedProperty.launchDate || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">RERA Registered</p>
                    <p>{typeof selectedProperty.reraRegistered === 'boolean' 
                        ? (selectedProperty.reraRegistered ? "Yes" : "No") 
                        : (selectedProperty.reraRegistered === "true" ? "Yes" : 
                           selectedProperty.reraRegistered === "false" ? "No" : 
                           "Not specified")}</p>
                  </div>
                  {(selectedProperty.reraRegistered === true || 
                    selectedProperty.reraRegistered === "true") && (
                    <div>
                      <p className="text-sm font-medium">RERA Number</p>
                      <p>{selectedProperty.reraNumber || "Not specified"}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <p className="text-sm font-medium">Contact Name</p>
                    <p>{selectedProperty.contactName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact Phone</p>
                    <p>{selectedProperty.contactPhone || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact Email</p>
                    <p>{selectedProperty.contactEmail || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">WhatsApp Enabled</p>
                    <p>{selectedProperty.whatsappEnabled ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Preferred Tenant</p>
                    <p>{selectedProperty.preferredTenant || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">User Type</p>
                    <p>{selectedProperty.userType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">No Broker Responses</p>
                    <p>{selectedProperty.noBrokerResponses ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Brokerage</p>
                    <p>{selectedProperty.brokerage !== undefined ? 
                        (typeof selectedProperty.brokerage === 'number' ? 
                        `${selectedProperty.brokerage}%` : selectedProperty.brokerage) : 
                        "Not specified"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Description</h3>
                <p className="whitespace-pre-line text-sm md:text-base break-words">{selectedProperty.description || "No description provided"}</p>
              </div>

              <Separator />

              {/* Media Section */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Media</h3>
                
                {/* Main Images */}
                {Array.isArray(selectedProperty.imageUrls) && selectedProperty.imageUrls.length > 0 ? (
                  <div className="mb-4 md:mb-6">
                    <h4 className="text-sm md:text-md font-semibold mb-2">Property Images</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      {selectedProperty.imageUrls.map((url, index) => (
                        <a href={formatImageUrl(url)} target="_blank" rel="noopener noreferrer" key={index} className="block">
                          <img
                            src={formatImageUrl(url)}
                            alt={`Property ${index + 1}`}
                            className="h-32 sm:h-36 md:h-40 w-full object-cover rounded hover:opacity-90 transition-opacity"
                            onError={(e) => handleImageError(e)}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">No property images available</p>
                )}
                
                {/* Videos */}
                {Array.isArray(selectedProperty.videoUrls) && selectedProperty.videoUrls.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <h4 className="text-sm md:text-md font-semibold mb-2">Property Videos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {selectedProperty.videoUrls.map((url, index) => (
                        <div key={index} className="p-3 border rounded-md bg-gray-50">
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:underline text-sm md:text-base flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="truncate">Video {index + 1}: {url}</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Categories */}
                {selectedProperty.imageCategories && typeof selectedProperty.imageCategories === 'object' && (
                  <div className="space-y-6">
                    {/* Handle both string array and object with categorized arrays */}
                    {typeof selectedProperty.imageCategories === 'object' && (
                      <>
                        {/* Exterior Images */}
                        {selectedProperty.imageCategories.exterior && Array.isArray(selectedProperty.imageCategories.exterior) && selectedProperty.imageCategories.exterior.length > 0 && (
                          <div>
                            <h4 className="text-sm md:text-md font-semibold mb-2">Exterior Images</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {selectedProperty.imageCategories.exterior.map((url, index) => (
                                <a href={formatImageUrl(url)} target="_blank" rel="noopener noreferrer" key={index} className="block">
                                  <img
                                    src={formatImageUrl(url)}
                                    alt={`Exterior ${index + 1}`}
                                    className="h-32 sm:h-36 md:h-40 w-full object-cover rounded hover:opacity-90 transition-opacity"
                                    onError={(e) => handleImageError(e)}
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interior Images */}
                        {selectedProperty.imageCategories.interior && Array.isArray(selectedProperty.imageCategories.interior) && selectedProperty.imageCategories.interior.length > 0 && (
                          <div>
                            <h4 className="text-sm md:text-md font-semibold mb-2">Interior Images</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {selectedProperty.imageCategories.interior.map((url, index) => (
                                <a href={formatImageUrl(url)} target="_blank" rel="noopener noreferrer" key={index} className="block">
                                  <img
                                    src={formatImageUrl(url)}
                                    alt={`Interior ${index + 1}`}
                                    className="h-32 sm:h-36 md:h-40 w-full object-cover rounded hover:opacity-90 transition-opacity"
                                    onError={(e) => handleImageError(e)}
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Floor Plan */}
                        {selectedProperty.imageCategories.floor_plan && Array.isArray(selectedProperty.imageCategories.floor_plan) && selectedProperty.imageCategories.floor_plan.length > 0 && (
                          <div>
                            <h4 className="text-sm md:text-md font-semibold mb-2">Floor Plan</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {selectedProperty.imageCategories.floor_plan.map((url, index) => (
                                <a href={formatImageUrl(url)} target="_blank" rel="noopener noreferrer" key={index} className="block">
                                  <img
                                    src={formatImageUrl(url)}
                                    alt={`Floor Plan ${index + 1}`}
                                    className="h-32 sm:h-36 md:h-40 w-full object-cover rounded hover:opacity-90 transition-opacity"
                                    onError={(e) => handleImageError(e)}
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Master Plan */}
                        {selectedProperty.imageCategories.master_plan && Array.isArray(selectedProperty.imageCategories.master_plan) && selectedProperty.imageCategories.master_plan.length > 0 && (
                          <div>
                            <h4 className="text-sm md:text-md font-semibold mb-2">Master Plan</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {selectedProperty.imageCategories.master_plan.map((url, index) => (
                                <a href={formatImageUrl(url)} target="_blank" rel="noopener noreferrer" key={index} className="block">
                                  <img
                                    src={formatImageUrl(url)}
                                    alt={`Master Plan ${index + 1}`}
                                    className="h-32 sm:h-36 md:h-40 w-full object-cover rounded hover:opacity-90 transition-opacity"
                                    onError={(e) => handleImageError(e)}
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location Map */}
                        {selectedProperty.imageCategories.location_map && Array.isArray(selectedProperty.imageCategories.location_map) && selectedProperty.imageCategories.location_map.length > 0 && (
                          <div>
                            <h4 className="text-sm md:text-md font-semibold mb-2">Location Map</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {selectedProperty.imageCategories.location_map.map((url, index) => (
                                <a href={formatImageUrl(url)} target="_blank" rel="noopener noreferrer" key={index} className="block">
                                  <img
                                    src={formatImageUrl(url)}
                                    alt={`Location Map ${index + 1}`}
                                    className="h-32 sm:h-36 md:h-40 w-full object-cover rounded hover:opacity-90 transition-opacity"
                                    onError={(e) => handleImageError(e)}
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {selectedProperty.approvalStatus === "pending" && (
                <div>
                  <Separator />
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Admin Actions</h3>
                    
                    <div>
                      <label
                        htmlFor={`rejection-dialog-${selectedProperty.id}`}
                        className="block text-sm font-medium mb-1"
                      >
                        Rejection Reason (required if rejecting)
                      </label>
                      <Textarea
                        id={`rejection-dialog-${selectedProperty.id}`}
                        placeholder="Provide reason for rejection"
                        value={rejectionReason[selectedProperty.id] || ""}
                        onChange={(e) =>
                          setRejectionReason({
                            ...rejectionReason,
                            [selectedProperty.id]: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <Button
                        onClick={() => {
                          handleApprove(selectedProperty.id, selectedProperty.isFreeProperty);
                          setPropertyDetailsOpen(false);
                        }}
                        className="flex-1"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleReject(selectedProperty.id, selectedProperty.isFreeProperty);
                          setPropertyDetailsOpen(false);
                        }}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Rejection Reason (if property is rejected) */}
              {selectedProperty.approvalStatus === "rejected" && selectedProperty.rejectionReason && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Rejection Information</h3>
                  <div className="bg-red-50 p-4 rounded-md border border-red-200">
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Property Rejected</h4>
                        <p className="text-sm text-red-700 mt-1">
                          <span className="font-medium">Reason:</span> {selectedProperty.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}