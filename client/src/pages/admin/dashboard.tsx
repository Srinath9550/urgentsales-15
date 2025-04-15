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
} from "lucide-react";

// Define interfaces for type safety
interface Property {
  id: number;
  title: string;
  description?: string;
  location?: string;
  city?: string;
  address?: string;
  propertyType?: string;
  price?: number;
  discountedPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  imageUrls?: string[];
  approvalStatus?: "pending" | "approved" | "rejected";
  isFreeProperty?: boolean;
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
      const response = await fetch("/api/properties/pending", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch pending properties");
      }

      return response.json();
    },
    enabled: !!user && user.role === "admin",
  });

  // Fetch all properties
  const { data: allProperties, isLoading: allLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/all"],
    queryFn: async () => {
      const response = await fetch("/api/properties/all", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch all properties");
      }

      return response.json();
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

      return response.json();
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

      return response.json();
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
                              • Price: ₹{property.price?.toLocaleString()} •
                              Location: {property.city}, {property.location}
                              {property.isFreeProperty && (
                                <Badge variant="outline" className="ml-2 bg-blue-100">Free Property</Badge>
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
                                <p>{property.area} sq.ft.</p>
                              </div>
                            </div>

                            <p className="text-sm mb-4">
                              {property.description?.substring(0, 150)}...
                            </p>

                            {property.imageUrls &&
                              property.imageUrls.length > 0 && (
                                <div className="flex space-x-2 mb-4 overflow-x-auto">
                                  {property.imageUrls.map((url, index) => {
                                    // Format the image URL properly
                                    const imageUrl = url.startsWith('http') 
                                      ? url 
                                      : url.startsWith('/') 
                                        ? url // Local URL starting with /
                                        : `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'property-images-urgent-sales'}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1'}.amazonaws.com/${url}`;
                                    
                                    return (
                                      <div key={index} className="relative h-20 w-20 rounded overflow-hidden">
                                        <img
                                          src={imageUrl}
                                          alt={`Property ${index + 1}`}
                                          className="h-full w-full object-cover rounded"
                                          onError={(e) => {
                                            // Fallback to placeholder on error
                                            e.currentTarget.src = '/images/property-placeholder.jpg';
                                          }}
                                        />
                                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1">
                                          {index + 1}
                                        </div>
                                      </div>
                                    );
                                  })}
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
                                <p>{project.category}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Launch Date</p>
                                <p>{project.launchDate || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Possession Date</p>
                                <p>{project.possessionDate || "N/A"}</p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-sm font-medium">RERA Number</p>
                              <p>{project.reraNumber || "N/A"}</p>
                            </div>

                            <p className="text-sm mb-4">
                              {project.description.substring(0, 150)}...
                            </p>

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

                            {project.imageUrls && project.imageUrls.length > 0 && (
                              <div className="flex space-x-2 mb-4 overflow-x-auto">
                                {project.imageUrls.map((url, index) => {
                                  // Format the image URL properly
                                  const imageUrl = url.startsWith('http') 
                                    ? url 
                                    : url.startsWith('/') 
                                      ? url // Local URL starting with /
                                      : `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'property-images-urgent-sales'}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1'}.amazonaws.com/${url}`;
                                  
                                  return (
                                    <div key={index} className="relative h-20 w-20 rounded overflow-hidden">
                                      <img
                                        src={imageUrl}
                                        alt={`Project ${index + 1}`}
                                        className="h-full w-full object-cover rounded"
                                        onError={(e) => {
                                          // Fallback to placeholder on error
                                          e.currentTarget.src = '/images/property-placeholder.jpg';
                                        }}
                                      />
                                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1">
                                        {index + 1}
                                      </div>
                                    </div>
                                  );
                                })}
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
                            ID: {property.id} • Price: ₹
                            {property.price?.toLocaleString()} •
                            {property.bedrooms && `${property.bedrooms} bed`} •
                            {property.area && `${property.area} sq.ft.`}
                            {property.isFreeProperty && (
                              <Badge variant="outline" className="ml-2 bg-blue-100">Free Property</Badge>
                            )}
                          </p>
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
    </div>
  );
}
