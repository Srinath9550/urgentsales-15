import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Building2,
  IndianRupee,
  Phone,
  Mail,
  Share2,
  Clock,
  ArrowLeft,
  Star,
  Home,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Check,
  Image,
  LayoutGrid,
  FileText,
  Map,
  Info,
  Layers,
  X,
  Download,
  Ruler,
  DollarSign,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Printer,
  FileDown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/query-client";
import { Slider } from "@/components/ui/slider";
import NotFound from "@/pages/not-found";

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  state?: string;
  price?: string;
  priceRange?: string;
  bhkConfig: string;
  builder: string;
  possessionDate?: string;
  category: string;
  status: string;
  amenities?: string[];
  tags?: string[];
  imageUrls?: string[];
  imageUrl?: string;
  featured?: boolean;
  rating?: number;
  contactNumber?: string;
  contactEmail?: string;
  userId: number;
  approvalStatus: string;
  approvedBy?: number;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
  floorPlans?: {
    id: string;
    title: string;
    image: string;
    area: string;
    bedrooms: number;
    bathrooms: number;
    price: string;
    balconies?: number;
    servantRoom?: boolean;
    pujaRoom?: boolean;
  }[];
  specifications?: {
    category: string;
    items: string[];
  }[];
  locationFeatures?: string[];
  reraNumber?: string;
  aboutProject?: string;
  developerInfo?: string;
  offerDetails?: string;
  youtubeUrl?: string;
  locationMapUrl?: string;
  masterPlanUrl?: string;
  bhk2Sizes?: string[];
  bhk3Sizes?: string[];
  locationAdvantages?: string;
  builderLogo?: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [pdfMode, setPdfMode] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    properties: true,
    amenities: true,
    gallery: true,
    specifications: true,
    location: true,
    calculator: true,
    about: true,
  });
  const [activeConfig, setActiveConfig] = useState("3bhk");
  const [activeSize, setActiveSize] = useState("");
  const [locationTab, setLocationTab] = useState<'advantages' | 'map' | 'masterplan'>('advantages');
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);
  
  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    properties: useRef<HTMLDivElement>(null),
    amenities: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    specifications: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    calculator: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
  };

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => apiRequest(`/api/projects/${id}`),
  });

  useEffect(() => {
    if (user && project) {
      // Check if project is saved by user
      apiRequest(`/api/users/${user.id}/saved-projects`)
        .then((savedProjects: Project[]) => {
          const isSaved = savedProjects.some((p) => p.id === project.id);
          setIsSaved(isSaved);
        })
        .catch((error) => {
          console.error("Error fetching saved projects:", error);
        });
    }
  }, [user, project]);

  // Set default active size when floor plans load
  useEffect(() => {
    if (project?.floorPlans?.length) {
      setActiveSize(project.floorPlans[0].area);
    }
  }, [project?.floorPlans]);

  // Enhanced project with default values for missing data
  const enhancedProject = useMemo(() => {
    if (!project) return null;
    
    return {
      ...project,
      specifications: project.specifications || [
        {
          category: "Structure",
          items: ["RCC framed structure", "Earthquake resistant design", "Quality materials"]
        },
        {
          category: "Flooring",
          items: ["Vitrified tiles in living areas", "Anti-skid ceramic tiles in bathrooms", "Wooden flooring in master bedroom"]
        }
      ],
      amenities: project.amenities || [
        "Swimming Pool", "Gym", "Children's Play Area", "Clubhouse", 
        "Landscaped Gardens", "24x7 Security", "Power Backup", "Indoor Games"
      ],
      locationFeatures: project.locationFeatures || [
        "10 mins to Metro Station", "15 mins to Shopping Mall", 
        "20 mins to Airport", "5 mins to Schools", "Hospitals nearby"
      ]
    };
  }, [project]);

  const formatIndianPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('en-IN').format(price);
  }, []);

  const calculateEMI = useCallback((principal: number, rate: number, time: number) => {
    const r = rate / 12 / 100;
    const n = time * 12;
    const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, []);

  const monthlyEMI = calculateEMI(loanAmount, interestRate, loanTenure);
  const totalAmount = monthlyEMI * loanTenure * 12;
  const totalInterest = totalAmount - loanAmount;

  const handleSaveProject = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save this project",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSaved) {
        await apiRequest(`/api/users/${user.id}/saved-projects/${project?.id}`, {
          method: "DELETE",
        });
        setIsSaved(false);
        toast({
          title: "Project Removed",
          description: "Project removed from your saved list",
        });
      } else {
        await apiRequest(`/api/users/${user.id}/saved-projects`, {
          method: "POST",
          data: { projectId: project?.id },
        });
        setIsSaved(true);
        toast({
          title: "Project Saved",
          description: "Project added to your saved list",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update saved projects",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: `Check out this property: ${project?.title}`,
        url: window.location.href,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Project link copied to clipboard",
      });
    }
  };

  const handleContactBuilder = () => {
    if (project?.contactNumber) {
      window.location.href = `tel:${project.contactNumber}`;
    } else {
      toast({
        title: "Contact Information",
        description: "Please use the enquiry form to contact the developer",
      });
    }
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = sectionRefs[section as keyof typeof sectionRefs]?.current;
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this data to your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Enquiry Submitted",
        description: "We'll get back to you shortly!",
      });
      
      // Reset form
      setEnquiryForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openImageModal = (imageUrl: string) => {
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      // Handle relative URLs by prepending the base URL if needed
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('/') && !imageUrl.startsWith(`${window.location.origin}/`)) {
        fullImageUrl = `${window.location.origin}${imageUrl}`;
        console.log(`Converting relative URL to absolute: ${fullImageUrl}`);
      }
      
      setModalImage(fullImageUrl);
      setIsImageModalOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      console.log("Invalid image URL:", imageUrl);
      toast({
        title: "Image Error",
        description: "Could not open image. The URL is invalid.",
        variant: "destructive",
      });
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const togglePdfMode = () => {
    setPdfMode(!pdfMode);
    
    if (!pdfMode) {
      // Expand all sections when entering PDF mode
      setExpandedSections({
        overview: true,
        properties: true,
        amenities: true,
        gallery: true,
        specifications: true,
        location: true,
        calculator: true,
        about: true,
      });
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };

  // Add this function with your other utility functions
  const convertToWords = (amount: number): string => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Crore`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} Lakh`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)} Thousand`;
    }
    return amount.toString();
  };

  const printDocument = () => {
    window.print();
  };

  const downloadAsPDF = () => {
    toast({
      title: "Download Started",
      description: "Your PDF is being generated",
    });
  };

  // Track scroll position for sticky sidebar and active section
  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const scrollPosition = window.scrollY;
      
      // Find the section that is currently in view
      const sections = Object.keys(sectionRefs);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = sectionRefs[section as keyof typeof sectionRefs]?.current;
        
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop - 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full h-[400px] rounded-lg mb-8">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project || !enhancedProject) {
    return <NotFound />;
  }

  // Get the main image with proper validation
  const getMainImage = () => {
    // Check if imageUrls is a valid array with at least one valid URL
    if (project.imageUrls && Array.isArray(project.imageUrls) && project.imageUrls.length > 0) {
      const validUrls = project.imageUrls.filter(url => url && typeof url === 'string' && url.trim() !== '');
      if (validUrls.length > 0) {
        return validUrls[0];
      }
    }
    
    // Fallback to imageUrl if available
    if (project.imageUrl && typeof project.imageUrl === 'string' && project.imageUrl.trim() !== '') {
      return project.imageUrl;
    }
    
    // Default placeholder
    return "/placeholder-project.jpg";
  };
  
  const mainImage = getMainImage();

  return (
    <>
      {/* PDF Mode Controls - Fixed at top when in PDF mode */}
      {pdfMode && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white shadow-md py-2 px-4 print:hidden">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">PDF Preview Mode</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={printDocument}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button size="sm" variant="outline" onClick={downloadAsPDF}>
                <FileDown className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={togglePdfMode}>
                <X className="h-4 w-4 mr-1" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Content goes here */}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className={`lg:col-span-1 ${pdfMode ? 'hidden' : ''} print:hidden`}>
            <div className="space-y-4 sm:space-y-6 sticky top-20">
              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm"
                    onClick={handleSaveProject}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                        Save Project
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm"
                    onClick={togglePdfMode}
                  >
                    <FileDown className="h-4 w-4 sm:h-5 sm:w-5" />
                    {pdfMode ? 'Exit PDF Mode' : 'View as PDF'}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Enquiry Form - Commented out for now */}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close button */}
            <button 
              onClick={closeImageModal}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image */}
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <img 
                src={modalImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  console.log("Error loading modal image:", modalImage);
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder-project.jpg";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetailPage;