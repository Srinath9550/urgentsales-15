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
    setModalImage(imageUrl);
    setIsImageModalOpen(true);
    document.body.style.overflow = 'hidden';
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

  const mainImage = project.imageUrls?.[0] || project.imageUrl || "/placeholder-project.jpg";

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

      {/* Hero Banner with Form Overlay */}
      <div className="mb-6 text-sm text-gray-500">
            <button
              onClick={() => window.history.back()}
              className="hover:text-primary focus:outline-none"
            >
              ← Back
            </button>
          </div>
      <div className="relative w-full h-[100vh] sm:h-[90vh] overflow-hidden print:h-[30vh]">
        
        <motion.img 
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          src={mainImage} 
          alt={project.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder-project.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end">
          <div className="container mx-auto px-4 flex flex-col h-full pb-8 md:pb-16">
            {/* Project Info at Top */}
            <div className="text-white mb-8">
              {project.reraNumber && (
                <div className="mb-2">
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40 text-base">
                    RERA Number: {project.reraNumber}
                  </Badge>
                </div>
              )}
              
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-base sm:text-lg text-white mb-3 sm:mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span>{project.location}, {project.city}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <p className="text-base text-white">{project.bhkConfig}</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {project.priceRange || project.price || "Price on Request"}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge className="bg-midiam hover:bg-midiam text-white text-xs">{project.category}</Badge>
                  <Badge variant="outline" className="bg-white/10 text-white text-xs">{project.status}</Badge>
                </div>
              </div>
            </div>
            
            {/* Form Below Project Info */}
            <div className="w-full max-w-xs bg-white rounded-lg shadow-lg p-2 sm:p-2 mb-2 z-5 self-start">
              <h3 className="text-base font-semibold mb-3">Get Exclusive Offers</h3>
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <div>
                  <input 
                    type="text" 
                    name="name"
                    value={enquiryForm.name}
                    onChange={handleEnquiryChange}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="email"
                    value={enquiryForm.email}
                    onChange={handleEnquiryChange}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Email Id"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-sm py-1.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Get Exclusive Offers'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Project Navigation Bar - Hidden in PDF mode */}
      {!pdfMode && (
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-900 to-blue-800 border-b shadow-md print:hidden">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="overflow-x-auto py-2 flex-1 -mx-4 px-4">
                <div className="flex space-x-4 sm:space-x-6 min-w-max">
                  {['properties', 'amenities', 'gallery', 'specifications', 'location', 'calculator', 'about'].map((section) => (
                    <button 
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className={`py-3 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors ${activeSection === section ? 'border-blue-400 text-blue-300' : 'border-transparent text-white hover:text-blue-200'}`}
                    >
                      {section === 'properties' ? 'Properties Available' : section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex items-center ml-4">
                {project.builderLogo ? (
                  <img 
                    src={project.builderLogo} 
                    alt={project.builder} 
                    className="h-8 w-auto bg-white rounded-md p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-8 flex items-center font-bold text-blue-300 text-sm">
                    <Building2 className="h-4 w-4 mr-2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - PDF-like Preview */}
          <div className={`${pdfMode ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6 sm:space-y-8`} ref={pdfPreviewRef}>
            {/* PDF Header - Only visible in print */}
            <div className="hidden print:block mb-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h1 className="text-2xl font-bold">{project.title}</h1>
                  <p className="text-gray-600">{project.location}, {project.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{project.builder}</p>
                  <p className="text-gray-600">{project.priceRange || project.price || "Price on Request"}</p>
                </div>
              </div>
            </div>

            {/* Properties Available Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              ref={sectionRefs.properties} 
              className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-6">PROPERTIES AVAILABLE</h2>
              
              {/* BHK Configuration Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.bhkConfig?.split(',').map((bhk) => {
                  const bhkValue = bhk.trim();
                  const configKey = bhkValue.toLowerCase().replace(/\s+/g, '');
                  return (
                    <Button 
                      key={configKey}
                      variant="outline" 
                      className={`rounded-full text-xs sm:text-sm ${activeConfig === configKey ? 'bg-primary text-white' : ''}`}
                      onClick={() => setActiveConfig(configKey)}
                    >
                      {bhkValue}
                    </Button>
                  );
                })}
              </div>
              
              {/* Size Options */}
              {project.floorPlans && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-center">
                  {project.floorPlans
                    .filter(plan => plan.title.toLowerCase().includes(activeConfig.replace('bhk', '')))
                    .map((plan) => (
                      <div 
                        key={plan.area}
                        className={`p-2 border rounded-md cursor-pointer ${activeSize === plan.area ? 'bg-primary/10 border-primary' : ''}`} 
                        onClick={() => setActiveSize(plan.area)}
                      >
                        <span className="block text-sm font-medium">{plan.area} sqft</span>
                      </div>
                    ))}
                </div>
              )}
              
              {/* Property Details Card */}
              {project.floorPlans?.filter(plan => 
                plan.title.toLowerCase().includes(activeConfig.replace('bhk', '')) && 
                plan.area === activeSize
              ).map((selectedPlan) => (
                <div key={selectedPlan.id} className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4">
                      <img 
                        src={selectedPlan.image || "/placeholder-floorplan.jpg"} 
                        alt="Floor Plan" 
                        className="w-full h-auto object-contain cursor-pointer"
                        onClick={() => openImageModal(selectedPlan.image || "/placeholder-floorplan.jpg")}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/placeholder-floorplan.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold">₹{selectedPlan.price}</h4>
                        <p className="text-gray-700">{selectedPlan.title}, {selectedPlan.area} sqft</p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm">{selectedPlan.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            <Home className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm">{selectedPlan.bathrooms} Baths</span>
                        </div>
                        {selectedPlan.balconies && (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-full">
                              <Home className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-sm">{selectedPlan.balconies} Balconies</span>
                          </div>
                        )}
                        {selectedPlan.servantRoom && (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-full">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-sm">Servant Room</span>
                          </div>
                        )}
                        {selectedPlan.pujaRoom && (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-full">
                              <Layers className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-sm">Puja Room</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700">Meticulously crafted.</p>
                        <p className="text-sm text-gray-700">Unmatched quality specifications</p>
                        <p className="text-sm text-gray-700">Finest fixtures.</p>
                      </div>
                      
                      <Button className="w-full sm:w-auto" onClick={handleContactBuilder}>
                        View Phone No.
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Amenities Section */}
            {enhancedProject.amenities && enhancedProject.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                ref={sectionRefs.amenities} 
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6">AMENITIES</h2>
                
                <div className="relative px-8 sm:px-10">
                  <div 
                    id="amenities-container"
                    className="overflow-x-auto pb-4 scrollbar-hide"
                  >
                    <div className="flex min-w-max">
                      <div className="grid grid-cols-4 gap-x-6 divide-x divide-gray-200">
                        {/* Column 1 */}
                        <div className="pr-6 min-w-[200px]">
                          <ul className="space-y-4">
                            {enhancedProject.amenities.slice(0, Math.ceil(enhancedProject.amenities.length / 4)).map((amenity, index) => (
                              <li key={`col1-${index}`} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                                <span className="text-sm">{amenity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Column 2 */}
                        <div className="px-6 min-w-[200px]">
                          <ul className="space-y-4">
                            {enhancedProject.amenities.slice(
                              Math.ceil(enhancedProject.amenities.length / 4),
                              Math.ceil(enhancedProject.amenities.length / 4) * 2
                            ).map((amenity, index) => (
                              <li key={`col2-${index}`} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                                <span className="text-sm">{amenity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Column 3 */}
                        <div className="px-6 min-w-[200px]">
                          <ul className="space-y-4">
                            {enhancedProject.amenities.slice(
                              Math.ceil(enhancedProject.amenities.length / 4) * 2,
                              Math.ceil(enhancedProject.amenities.length / 4) * 3
                            ).map((amenity, index) => (
                              <li key={`col3-${index}`} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                                <span className="text-sm">{amenity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Column 4 */}
                        <div className="pl-6 min-w-[200px]">
                          <ul className="space-y-4">
                            {enhancedProject.amenities.slice(
                              Math.ceil(enhancedProject.amenities.length / 4) * 3
                            ).map((amenity, index) => (
                              <li key={`col4-${index}`} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                                <span className="text-sm">{amenity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Gallery Section */}
            {project.imageUrls && project.imageUrls.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                ref={sectionRefs.gallery} 
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6">GALLERY</h2>
                
                <div className="relative">
                  {/* Scrollable Gallery Container with Touch Slide */}
                  <div 
                    id="gallery-container"
                    className="overflow-x-auto pb-4 scrollbar-hide touch-pan-x"
                    ref={(el) => {
                      if (el) {
                        // Enable auto-sliding
                        const autoSlideInterval = setInterval(() => {
                          if (el && !el.matches(':hover')) {
                            el.scrollBy({ left: 320, behavior: 'smooth' });
                            // Reset to beginning when reaching the end
                            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
                              setTimeout(() => {
                                el.scrollTo({ left: 0, behavior: 'smooth' });
                              }, 1000);
                            }
                          }
                        }, 5000);
                        
                        // Clean up interval when component unmounts
                        return () => clearInterval(autoSlideInterval);
                      }
                    }}
                  >
                    <div className="flex gap-4">
                      {project.imageUrls.map((imageUrl, index) => (
                        <div 
                          key={index} 
                          className="relative min-w-[280px] sm:min-w-[320px] aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                          onClick={() => openImageModal(imageUrl)}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`${project.title} - Image ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/placeholder-project.jpg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Navigation Indicators */}
                <div className="mt-4 flex justify-center gap-2">
                  {project.imageUrls.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300'} transition-colors duration-300`}
                      onClick={() => {
                        const container = document.getElementById('gallery-container');
                        const items = document.querySelectorAll('#gallery-container > div > div');
                        if (container && items[index]) {
                          const scrollLeft = (items[index] as HTMLElement).offsetLeft - container.offsetLeft;
                          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                        }
                      }}
                    />
                  ))}
                  {project.imageUrls.length > 5 && (
                    <span className="text-xs text-gray-500">+{project.imageUrls.length - 5}</span>
                  )}
                </div>
                
                {/* Touch Slide Hint - Only visible on mobile */}
                <div className="mt-2 text-center text-xs text-gray-500 sm:hidden">
                  <span>← Swipe to view more →</span>
                </div>
              </motion.div>
            )}

            {/* Specifications Section */}
            {enhancedProject.specifications && enhancedProject.specifications.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                ref={sectionRefs.specifications} 
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6">SPECIFICATIONS</h2>
                
                <div className="relative">
                  {/* Scrollable Specifications Container with Touch Slide */}
                  <div 
                    id="specifications-container"
                    className="overflow-x-auto pb-4 scrollbar-hide touch-pan-x"
                    ref={(el) => {
                      if (el) {
                        // Enable auto-sliding
                        const autoSlideInterval = setInterval(() => {
                          if (el && !el.matches(':hover')) {
                            el.scrollBy({ left: 300, behavior: 'smooth' });
                            // Reset to beginning when reaching the end
                            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
                              setTimeout(() => {
                                el.scrollTo({ left: 0, behavior: 'smooth' });
                              }, 1000);
                            }
                          }
                        }, 6000);
                        
                        // Clean up interval when component unmounts
                        return () => clearInterval(autoSlideInterval);
                      }
                    }}
                  >
                    <div className="flex gap-4">
                      {enhancedProject.specifications.map((spec, index) => (
                        <div 
                          key={index} 
                          className="min-w-[280px] sm:min-w-[320px] md:min-w-[400px] flex-shrink-0 border rounded-lg overflow-hidden bg-white shadow-sm"
                        >
                          <div className="bg-primary/5 p-4 border-b">
                            <h3 className="text-base sm:text-lg font-semibold text-center">{spec.category}</h3>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-3">
                              {spec.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Navigation Indicators */}
                <div className="mt-4 flex justify-center gap-2">
                  {enhancedProject.specifications.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300'} transition-colors duration-300`}
                      onClick={() => {
                        const container = document.getElementById('specifications-container');
                        const items = document.querySelectorAll('#specifications-container > div > div');
                        if (container && items[index]) {
                          const scrollLeft = (items[index] as HTMLElement).offsetLeft - container.offsetLeft;
                          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                        }
                      }}
                    />
                  ))}
                  {enhancedProject.specifications.length > 5 && (
                    <span className="text-xs text-gray-500">+{enhancedProject.specifications.length - 5}</span>
                  )}
                </div>
                
                {/* Touch Slide Hint - Only visible on mobile */}
                <div className="mt-2 text-center text-xs text-gray-500 sm:hidden">
                  <span>← Swipe to view more →</span>
                </div>
              </motion.div>
            )}

            {/* Location Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              ref={sectionRefs.location} 
              className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-6">MAP VIEW</h2>
              
              {/* Tab Navigation */}
              <div className="flex border-b mb-6">
                <button 
                  className={`py-2 px-4 sm:px-6 text-sm sm:text-base font-medium ${locationTab === 'advantages' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  onClick={() => setLocationTab('advantages')}
                >
                  Location Advantages
                </button>
                <button 
                  className={`py-2 px-4 sm:px-6 text-sm sm:text-base font-medium ${locationTab === 'map' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  onClick={() => setLocationTab('map')}
                >
                  Location Map
                </button>
                <button 
                  className={`py-2 px-4 sm:px-6 text-sm sm:text-base font-medium ${locationTab === 'masterplan' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  onClick={() => setLocationTab('masterplan')}
                >
                  Master Plan
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[300px]">
                {/* Location Advantages Tab */}
                {locationTab === 'advantages' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {enhancedProject.locationFeatures?.slice(0, Math.ceil((enhancedProject.locationFeatures?.length || 0) / 2)).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {enhancedProject.locationFeatures?.slice(Math.ceil((enhancedProject.locationFeatures?.length || 0) / 2)).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Location Map Tab */}
                {locationTab === 'map' && (
                  <div>
                    {project.locationMapUrl ? (
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <iframe 
                          src={project.locationMapUrl} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`${project.title} Location Map`}
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4 sm:p-6">
                          <Map className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm sm:text-base">Location map not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Master Plan Tab */}
                {locationTab === 'masterplan' && (
                  <div>
                    {project.masterPlanUrl ? (
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img 
                          src={project.masterPlanUrl} 
                          alt="Master Plan" 
                          className="w-full h-full object-contain"
                          onClick={() => openImageModal(project.masterPlanUrl || '')}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/placeholder-masterplan.jpg";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4 sm:p-6">
                          <Layers className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm sm:text-base">Master plan not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* EMI Calculator Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              ref={sectionRefs.calculator} 
              className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-6">HOME LOAN CALCULATOR</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Sliders */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Loan Amount Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Home Loan Amount:</label>
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{formatIndianPrice(loanAmount)}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[loanAmount]}
                        min={1000000}
                        max={20000000}
                        step={100000}
                        onValueChange={(value) => setLoanAmount(value[0])}
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>25L</span>
                        <span>50L</span>
                        <span>75L</span>
                        <span>100L</span>
                        <span>125L</span>
                        <span>150L</span>
                        <span>175L</span>
                        <span>200L</span>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm text-gray-700">{convertToWords(loanAmount)}</span>
                    </div>
                  </div>
                  
                  {/* Interest Rate Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Rate of Interest:</label>
                      <span className="text-sm font-medium">{interestRate} %</span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[interestRate]}
                        min={5}
                        max={15}
                        step={0.1}
                        onValueChange={(value) => setInterestRate(value[0])}
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5</span>
                        <span>7.5</span>
                        <span>10</span>
                        <span>12.5</span>
                        <span>15</span>
                        <span>17.5</span>
                        <span>20</span>
                        <span>22.5</span>
                        <span>25</span>
                        <span>27.5</span>
                        <span>30</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loan Tenure Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Loan Tenure:</label>
                      <span className="text-sm font-medium">{loanTenure} Yr</span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[loanTenure]}
                        min={5}
                        max={30}
                        step={1}
                        onValueChange={(value) => setLoanTenure(value[0])}
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                        <span>15</span>
                        <span>20</span>
                        <span>25</span>
                        <span>30</span>
                        <span>35</span>
                        <span>40</span>
                        <span>45</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Results */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col justify-between">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-2xl">😊</span>
                      </div>
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-sm text-primary font-medium">Yeah! You are eligible for this loan.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Monthly EMI:</p>
                        <p className="text-xl font-semibold">₹{formatIndianPrice(monthlyEMI)}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total Interest Payable:</p>
                        <p className="text-lg font-medium">₹{formatIndianPrice(totalInterest)}</p>
                      </div>
                      
                      <div className="bg-gray-100 p-3 rounded-lg text-center mt-4">
                        <p className="text-xs text-gray-600 uppercase font-medium mb-1">TOTAL AMOUNT PAYABLE:</p>
                        <p className="text-xs text-gray-500">(Principal + Interest)</p>
                        <p className="text-lg font-semibold text-primary">₹ {formatIndianPrice(totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About Us Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              ref={sectionRefs.about} 
              className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-6">ABOUT US</h2>
              
              {/* About the Project */}
              <div className="mb-8 border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <h3 className="text-lg font-semibold">About the Project - {project.title}</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Project Image */}
                    <div className="md:w-1/3 flex-shrink-0">
                      <div className="rounded-lg overflow-hidden border">
                        <img 
                          src={project.imageUrls?.[0] || '/placeholder-project.jpg'} 
                          alt={project.title} 
                          className="w-full h-auto object-cover aspect-[4/3]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/placeholder-project.jpg";
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Project Details */}
                    <div className="md:w-2/3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-4">
                        {project.size && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Project Area: {project.size}</span>
                          </div>
                        )}
                        {project.towers && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Total No. of Towers: {project.towers}</span>
                          </div>
                        )}
                        {project.floors && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Total No. of Floors: {project.floors}</span>
                          </div>
                        )}
                        {project.units && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Total Units: {project.units}</span>
                          </div>
                        )}
                        {project.approvals && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Authority Approvals: {project.approvals}</span>
                          </div>
                        )}
                        {project.launchDate && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Launch Date: {project.launchDate}</span>
                          </div>
                        )}
                        {project.possessionDate && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm">Possession Date: {project.possessionDate}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4">
                        {project.description}
                      </p>
                      
                      {/* Approved by Banks */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Approved by Banks:</h4>
                        <div className="flex flex-wrap gap-3">
                          {project.approvedBanks && project.approvedBanks.length > 0 && (
                            project.approvedBanks.map((bank, index) => (
                              <div key={index} className="h-8 bg-white rounded border p-1 flex items-center justify-center">
                                <img 
                                  src={bank.logo} 
                                  alt={bank.name} 
                                  className="max-h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "/placeholder-bank.png";
                                  }}
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>      
                    </div>
                  </div>
                </div>
              </div>
              
              {/* About the Developer */}
              <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                  <h3 className="text-lg font-semibold">About the Developer - {project.title}</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Developer Logo */}
                    <div className="md:w-1/3 flex-shrink-0">
                      <div className="bg-white rounded-lg overflow-hidden border flex items-center justify-center p-4" style={{height: '200px'}}>
                        <img 
                          src={project.builderLogo || "/placeholder-logo.png"} 
                          alt={project.builder} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/placeholder-logo.png";
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Developer Details */}
                    <div className="md:w-3/4">
                      <p className="text-sm leading-relaxed text-gray-700 mb-4">
                        {project.builder}
                      </p>                  
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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

              {/* Quick Enquiry Form */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quick Enquiry</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Fill the form for more details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-3 sm:space-y-4" onSubmit={handleEnquirySubmit}>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={enquiryForm.name}
                        onChange={handleEnquiryChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={enquiryForm.email}
                        onChange={handleEnquiryChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={enquiryForm.phone}
                        onChange={handleEnquiryChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        name="message"
                        value={enquiryForm.message}
                        onChange={handleEnquiryChange}
                        className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={3}
                        placeholder="Your message or query"
                      ></textarea>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full text-xs sm:text-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </Button>
                  </form>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProjectDetailPage;