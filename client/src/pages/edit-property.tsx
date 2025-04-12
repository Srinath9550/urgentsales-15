import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, Home, Check, ArrowLeft } from "lucide-react";
import FileUpload, { FileWithPreview } from "@/components/upload/file-upload";

// Define the form schema for property editing
const editPropertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  propertyType: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  area: z.coerce.number().optional(),
  rentOrSale: z.enum(["sale"]),
  imageUrlsInput: z.string().optional(),
  featured: z.boolean().optional(),
  premium: z.boolean().optional(),
});

type FormValues = z.infer<typeof editPropertyFormSchema>;

export default function EditProperty() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);

  // Define property type
  type Property = {
    id: number;
    title: string;
    description?: string;
    location?: string;
    city?: string;
    address?: string;
    propertyType?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    imageUrls?: string[];
    rentOrSale: 'sale';
    featured?: boolean;
    premium?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    userId: number;
  };
  
  // Define form values type
  type FormValues = {
    title: string;
    description: string;
    location: string;
    city: string;
    address: string;
    propertyType: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    rentOrSale: string;
    imageUrlsInput: string;
    featured: boolean;
    premium: boolean;
  };

  // Fetch property data
  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });

  // Form setup with default values from property data
  const form = useForm<FormValues>({
    resolver: zodResolver(editPropertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      city: "",
      address: "",
      propertyType: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      rentOrSale: "sale",
      imageUrlsInput: "",
      featured: false,
      premium: false,
    },
  });

  // Update form values when property data is loaded
  useEffect(() => {
    if (property) {
      // Convert image URLs array to comma-separated string
      const imageUrlsInput = property.imageUrls ? property.imageUrls.join(',') : '';
      
      // Set initial uploaded files for preview
      if (property.imageUrls && property.imageUrls.length > 0) {
        const filesList: FileWithPreview[] = property.imageUrls.map((url, index) => ({
          id: `existing-${index}`,
          name: url.split('/').pop() || `image-${index}`,
          preview: url,
          size: 0,
          type: 'image/jpeg',
          lastModified: Date.now(),
          status: 'success',
          serverUrl: url
        } as FileWithPreview));
        
        setUploadedFiles(filesList);
      }

      form.reset({
        title: property.title || "",
        description: property.description || "",
        location: property.location || "",
        city: property.city || "",
        address: property.address || "",
        propertyType: property.propertyType || "",
        price: property.price || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        rentOrSale: property.rentOrSale || "sale",
        imageUrlsInput: imageUrlsInput,
        featured: property.featured || false,
        premium: property.premium || false,
      });
    }
  }, [property, form]);

  // Update mutation for saving changes
  const updateMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      // Process the imageUrls from comma-separated string to array
      if (propertyData.imageUrlsInput) {
        const imageUrls = propertyData.imageUrlsInput
          .split(",")
          .map((url: string) => url.trim())
          .filter((url: string) => url.length > 0);

        propertyData.imageUrls = imageUrls.length > 0 ? imageUrls : undefined;
        delete propertyData.imageUrlsInput;
      }

      return await apiRequest({
        url: `/api/properties/free/${id}`,
        method: "PATCH",
        body: propertyData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/properties"] });

      toast({
        title: "Property updated successfully",
        description: "Your property listing has been updated.",
      });

      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update property",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to edit a property listing.",
        variant: "default",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  // Handle file selection for image uploads
  const handleFilesSelected = (files: FileWithPreview[]) => {
    setUploadedFiles(files);
    
    // Update the imageUrlsInput field with the new files
    const existingUrls = form.getValues("imageUrlsInput") 
      ? form.getValues("imageUrlsInput")
          .split(",")
          .map(url => url.trim())
          .filter(url => url.length > 0 && !url.startsWith("blob:"))
      : [];
    
    // Only use server URLs for files that have been successfully uploaded
    const newFileUrls = files
      .filter(file => file.status === "success" && file.serverUrl)
      .map(file => file.serverUrl || "")
      .filter(url => url && url.trim() !== '');
      
    console.log('Successfully uploaded file URLs:', newFileUrls);
    
    // Combine existing URLs with new ones and remove duplicates
    const uniqueUrls = [...existingUrls, ...newFileUrls].filter(
      (url, index, self) => self.indexOf(url) === index
    );
    form.setValue("imageUrlsInput", uniqueUrls.join(","));
  };

  const handleFileRemoved = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    
    // Update the imageUrlsInput field without the removed file
    const currentUrls = form.getValues("imageUrlsInput") 
      ? form.getValues("imageUrlsInput").split(",").map(url => url.trim())
      : [];
    
    const removedFile = uploadedFiles.find(file => file.id === fileId);
    
    if (removedFile && removedFile.serverUrl) {
      // If it's a server file, remove it from the URLs
      const updatedUrls = currentUrls.filter(url => url !== removedFile.serverUrl);
      form.setValue("imageUrlsInput", updatedUrls.join(","));
    } else if (removedFile && removedFile.preview) {
      // If it's a local file, remove it by preview URL
      const updatedUrls = currentUrls.filter(url => url !== removedFile.preview);
      form.setValue("imageUrlsInput", updatedUrls.join(","));
    }
  };

  const onSubmit = (data: FormValues) => {
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    // Process uploaded files and input data
    let processedData = { ...data };

    // Process imageUrlsInput to include only valid URLs and remove duplicates
    if (processedData.imageUrlsInput) {
      // Split by commas, trim whitespace, and filter out empty strings and blob URLs
      const urls = processedData.imageUrlsInput
        .split(",")
        .map(url => url.trim())
        .filter(url => url.length > 0 && !url.startsWith("blob:"));

      // Get serverUrls from uploaded files that have successfully completed upload
      const uploadedFileUrls = uploadedFiles
        .filter(file => file.status === "success" && file.serverUrl)
        .map(file => file.serverUrl as string)
        .filter(url => url && url.length > 0);

      console.log('Successfully uploaded file URLs for submission:', uploadedFileUrls);

      // Combine all valid URLs and remove duplicates
      const allUrls = [...urls, ...uploadedFileUrls].filter(
        (url, index, self) => url && self.indexOf(url) === index
      );
      
      // Ensure we're saving valid URLs
      processedData.imageUrlsInput = allUrls.join(",");
    }

    console.log("Submitting property with image URLs:", processedData.imageUrlsInput);
    updateMutation.mutate(processedData);
  };

  // If still loading or user not authenticated, show loading state
  if (authLoading || (isLoading && !property)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Loading property information...</p>
        </div>
      </div>
    );
  }

  // If there was an error fetching the property
  if (isError) {
    return (
      <div className="container max-w-5xl py-12 px-4 mx-auto">
        <div className="text-center py-12 border rounded-lg">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're trying to edit could not be found.</p>
          <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-12 px-4 mx-auto">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Property</h1>
          <p className="text-gray-600">Update your property listing information</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Property Details</TabsTrigger>
              <TabsTrigger value="media">Photos & Media</TabsTrigger>
              <TabsTrigger value="settings">Listing Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update the essential information about your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Modern 3-Bedroom Apartment with Ocean View"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title helps your property stand out.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your property, its features, and its surroundings..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your property to attract potential buyers or renters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Miami"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neighborhood/Area</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Downtown"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the full address of the property"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This information will only be shared with serious buyers or renters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>
                    Update specific details about your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rentOrSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="For sale" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sale">For Sale</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of bedrooms"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of bathrooms"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (sq.ft)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Total area in square feet"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Media</CardTitle>
                  <CardDescription>
                    Update photos and other media for your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Upload Photos</h3>
                      <FileUpload 
                        onFilesSelected={handleFilesSelected}
                        onFileRemoved={handleFileRemoved}
                        initialFiles={uploadedFiles}
                        maxFiles={10}
                        allowMultiple={true}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Or Enter Image URLs</h3>
                      <FormField
                        control={form.control}
                        name="imageUrlsInput"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter image URLs, separated by commas"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              If you already have images hosted elsewhere, enter their URLs here, separated by commas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Listing Settings</CardTitle>
                  <CardDescription>
                    Update listing visibility and promotion settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Listing</FormLabel>
                            <FormDescription>
                              Feature this property to increase its visibility on the homepage and search results.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="premium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Premium Listing</FormLabel>
                            <FormDescription>
                              Mark as premium to show at the top of search results and feature exclusive badge.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}