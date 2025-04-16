import { Request, Response } from "express";
import { pool, db } from "./db";
import { projects, Project, InsertProject, projectCategories } from "../shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { storage } from "./storage";
import { sendEmail } from "./email-service";
import { logActivity, logProjectSubmission } from "./logger-service";
import { sendWhatsAppNotification } from "./auth";

// Helper function to process image URLs for projects
// Helper function to convert snake_case to camelCase
function convertSnakeToCamel(obj: any) {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => convertSnakeToCamel(item));
  }
  
  // Create a new object with camelCase keys
  const newObj: any = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Convert key from snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      
      // Recursively convert nested objects
      newObj[camelKey] = convertSnakeToCamel(obj[key]);
      
      // Also keep the original key for backward compatibility
      if (camelKey !== key) {
        newObj[key] = obj[key];
      }
    }
  }
  
  return newObj;
}

async function processProjectImageUrls(projects: any[], fullProcess = false) {
  if (!projects || projects.length === 0) return projects;
  
  const { getSignedImageUrl } = await import('./s3-service');
  
  // Convert all projects from snake_case to camelCase
  projects = projects.map(project => convertSnakeToCamel(project));
  
  for (const project of projects) {
    // Ensure imageUrls exists (for backward compatibility)
    if (project.image_urls && !project.imageUrls) {
      project.imageUrls = project.image_urls;
    }
    
    // Process main image URLs
    if (project.imageUrls && Array.isArray(project.imageUrls)) {
      if (fullProcess) {
        // Process all images for detailed views
        const processedUrls = await Promise.all(
          project.imageUrls.map(async (url: string) => {
            if (!url || url === 'pending-upload') return '';
            if (url.startsWith('http')) return url;
            
            try {
              const signedUrl = await getSignedImageUrl(url);
              return signedUrl || url;
            } catch (error) {
              console.error(`Error generating signed URL for ${url}:`, error);
              return url;
            }
          })
        );
        project.imageUrls = processedUrls.filter(Boolean);
      } else {
        // Process only the first image for listing views (performance optimization)
        if (project.imageUrls.length > 0) {
          const url = project.imageUrls[0];
          if (url && url !== 'pending-upload' && !url.startsWith('http')) {
            try {
              const signedUrl = await getSignedImageUrl(url);
              if (signedUrl) {
                project.imageUrls[0] = signedUrl;
              }
            } catch (error) {
              console.error(`Error generating signed URL for ${url}:`, error);
            }
          }
        }
      }
    }
    
    // Convert snake_case to camelCase for gallery URLs
    if (project.gallery_urls && !project.galleryUrls) {
      project.galleryUrls = project.gallery_urls;
    }
    
    // Process gallery URLs for all projects, not just full processing
    if (project.galleryUrls && Array.isArray(project.galleryUrls)) {
      const processedGalleryUrls = await Promise.all(
        project.galleryUrls.map(async (url: string) => {
          if (!url || url === 'pending-upload' || (typeof url === 'string' && url.startsWith('blob:'))) return '';
          if (url.startsWith('http')) return url;
          
          try {
            const signedUrl = await getSignedImageUrl(url);
            return signedUrl || url;
          } catch (error) {
            console.error(`Error generating signed URL for gallery image ${url}:`, error);
            return url;
          }
        })
      );
      project.galleryUrls = processedGalleryUrls.filter(Boolean);
    }
    
    // Ensure gallery_urls is also updated for backward compatibility
    if (project.galleryUrls && !project.gallery_urls) {
      project.gallery_urls = project.galleryUrls;
    }
  }
  
  return projects;
}

// Get upcoming projects
export async function getUpcomingProjects(req: Request, res: Response) {
  const client = await pool.connect();
  try {
    // Check if category parameter is provided
    const category = req.query.category as string;
    
    // Build the query based on parameters
    let query = 'SELECT * FROM projects WHERE status = $1';
    const queryParams = ['upcoming'];
    
    // If category is specified, add it to the query
    if (category) {
      query += ' AND category = $2';
      queryParams.push(category);
    }
    
    // Add approval status filter to only show approved projects
    query += ' AND approval_status = $' + (queryParams.length + 1);
    queryParams.push('approved');
    
    // Execute the query
    const result = await client.query(query, queryParams);
    
    // Log raw data for debugging
    console.log('Upcoming projects raw data:', result.rows.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      status: p.status,
      hasImageUrls: p.image_urls && p.image_urls.length > 0,
      imageUrlsLength: p.image_urls ? p.image_urls.length : 0,
      firstImageUrl: p.image_urls && p.image_urls.length > 0 ? p.image_urls[0] : null,
    })));
    
    // Convert snake_case to camelCase first
    const camelCaseProjects = result.rows.map(project => convertSnakeToCamel(project));
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(camelCaseProjects, false);
    
    // Log processed data for debugging
    console.log('Upcoming projects processed data:', camelCaseProjects.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      status: p.status,
      hasImageUrls: p.imageUrls && p.imageUrls.length > 0,
      imageUrlsLength: p.imageUrls ? p.imageUrls.length : 0,
      firstImageUrl: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : null,
    })));
    
    return res.status(200).json(camelCaseProjects);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Failed to fetch upcoming projects' });
  } finally {
    client.release();
  }
}

// Get featured projects
export async function getFeaturedProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const featuredProjects = await db.select().from(projects)
      .where(
        and(
          eq(projects.featured, true),
          eq(projects.approvalStatus, "approved")
        )
      )
      .orderBy(desc(projects.createdAt))
      .limit(limit);
      
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(featuredProjects, false);

    return res.status(200).json(featuredProjects);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return res.status(500).json({ error: "Failed to fetch featured projects" });
  }
}

// Get luxury projects
export async function getLuxuryProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const luxuryProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "luxury"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (luxuryProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(luxuryProjects, false);
    
    return res.status(200).json(luxuryProjects);
  } catch (error) {
    console.error("Error fetching luxury projects:", error);
    return res.status(500).json({ error: "Failed to fetch luxury projects" });
  }
}

// Get project by ID
export async function getProjectById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Process all image URLs with full processing (including gallery images)
    console.log(`Processing image URLs for project ${id}`);
    await processProjectImageUrls([project], true);
    console.log(`Finished processing image URLs for project ${id}`);

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
}

// Get affordable projects
export async function getAffordableProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;

    const affordableProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "affordable"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (affordableProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(affordableProjects, false);
    
    return res.status(200).json(affordableProjects);
  } catch (error) {
    console.error("Error fetching affordable projects:", error);
    return res.status(500).json({ error: "Failed to fetch affordable projects" });
  }
}

// Get commercial projects
export async function getCommercialProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const commercialProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "commercial"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (commercialProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(commercialProjects, false);
    
    return res.status(200).json(commercialProjects);
  } catch (error) {
    console.error("Error fetching commercial projects:", error);
    return res.status(500).json({ error: "Failed to fetch commercial projects" });
  }
}

// Get new launch projects
export async function getNewLaunchProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const newLaunchProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "new_launch"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (newLaunchProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(newLaunchProjects, false);
    
    return res.status(200).json(newLaunchProjects);
  } catch (error) {
    console.error("Error fetching new launch projects:", error);
    return res.status(500).json({ error: "Failed to fetch new launch projects" });
  }
}

// Get newly listed projects
export async function getNewlyListedProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const newlyListedProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "newly_listed"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (newlyListedProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(newlyListedProjects, false);
    
    return res.status(200).json(newlyListedProjects);
  } catch (error) {
    console.error("Error fetching newly listed projects:", error);
    return res.status(500).json({ error: "Failed to fetch newly listed projects" });
  }
}

// Get top urgent projects
export async function getTopUrgentProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const topUrgentProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "top_urgent"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (topUrgentProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(topUrgentProjects, false);
    
    return res.status(200).json(topUrgentProjects);
  } catch (error) {
    console.error("Error fetching top urgent projects:", error);
    return res.status(500).json({ error: "Failed to fetch top urgent projects" });
  }
}

// Get company projects
export async function getCompanyProjects(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

    const companyProjects = await db.query.projects.findMany({
      where: and(
        eq(projects.category, "company_projects"),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });

    if (companyProjects.length === 0) {
      return res.status(200).json([]);
    }
    
    // Process image URLs (only first image for listing views)
    await processProjectImageUrls(companyProjects, false);
    
    return res.status(200).json(companyProjects);
  } catch (error) {
    console.error("Error fetching company projects:", error);
    return res.status(500).json({ error: "Failed to fetch company projects" });
  }
}

// Submit a new project
export async function submitProject(req: Request, res: Response) {
  try {
    console.log("Project submission request received:", {
      body: req.body,
      files: req.files,
      file: req.file,
      user: req.user
    });
    
    // Start activity logging - record the submission attempt
    await logActivity({
      userId: req.user?.id,
      action: "project_submission_start",
      entity: "project",
      status: "pending",
      details: {
        title: req.body.title || req.body.projectName,
        category: req.body.category,
        requestType: "POST",
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });
    
    // Add more detailed logging for files
    if (req.files) {
      console.log("Received files structure:", 
        typeof req.files === 'object' 
          ? Object.keys(req.files).map(key => ({ 
              fieldname: key, 
              count: Array.isArray((req.files as any)[key]) ? (req.files as any)[key].length : 0 
            }))
          : 'Not an object'
      );
    }
    
    // Allow anonymous submissions with userId=1 (admin)
    if (!req.user && !req.body.userId) {
      req.body.userId = "1"; // Set to default admin ID
    }
    
    // Parse arrays from JSON strings
    // Check amenitiesArray first (new format)
    if (req.body.amenitiesArray) {
      try {
        if (typeof req.body.amenitiesArray === 'string') {
          const parsed = JSON.parse(req.body.amenitiesArray);
          if (Array.isArray(parsed)) {
            console.log("Using amenitiesArray (parsed):", parsed);
            req.body.amenities = parsed;
          }
        }
      } catch (e) {
        console.error("Error parsing amenitiesArray:", e);
        // Fall back to traditional method
      }
    }
    
    // Fall back to traditional amenities format if needed
    if (!req.body.amenities || !Array.isArray(req.body.amenities)) {
      if (typeof req.body.amenities === 'string') {
        try {
          // Try parsing as JSON
          req.body.amenities = JSON.parse(req.body.amenities);
          console.log("Parsed amenities from JSON string:", req.body.amenities);
        } catch (e) {
          // If not valid JSON, try splitting by comma
          try {
            req.body.amenities = req.body.amenities.split(',')
              .map((a: string) => a.trim())
              .filter((a: string) => a.length > 0);
            console.log("Split amenities from comma-separated string:", req.body.amenities);
          } catch (splitError) {
            console.error("Error splitting amenities:", splitError);
            req.body.amenities = [];
          }
        }
      } else {
        // Default to empty array if nothing worked
        console.log("Default empty amenities array");
        req.body.amenities = [];
      }
    }
    
    if (typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        req.body.tags = [];
      }
    }
    
    // Try handling imageUrls from multiple possible sources
    if (typeof req.body.imageUrlsArray === 'string') {
      // First check the dedicated imageUrlsArray field (from our special handling)
      try {
        req.body.imageUrls = JSON.parse(req.body.imageUrlsArray);
        console.log("Successfully parsed imageUrlsArray:", req.body.imageUrls);
      } catch (e) {
        console.error("Error parsing imageUrlsArray:", e);
        // Fall back to traditional format
      }
    } else if (typeof req.body.imageUrls === 'string') {
      // Fall back to the regular imageUrls field
      try {
        req.body.imageUrls = JSON.parse(req.body.imageUrls);
        console.log("Successfully parsed imageUrls:", req.body.imageUrls);
      } catch (e) {
        console.error("Error parsing imageUrls:", e);
        req.body.imageUrls = [];
      }
    }
    
    // Handle file uploads if any
    let uploadedImageUrls: string[] = [];
    
    // Import S3 upload function and getFileUrl to generate correct URLs
    const { uploadToS3 } = await import('./s3-service');
    const { getFileUrl } = await import('./file-upload');
    const fileUserId = req.user?.id || 1; // Default to admin user if no authenticated user
    
    console.log("Handling file uploads with user ID:", fileUserId);
    
    // Handle single file uploads (e.g., req.file from multer single)
    if (req.file) {
      console.log("Processing single file upload:", req.file.originalname);
      try {
        // Upload to S3 with projects folder
        const s3Key = await uploadToS3(req.file, `projects/user-${fileUserId}`);
        if (s3Key) {
          uploadedImageUrls.push(s3Key);
          console.log("Uploaded file to S3:", s3Key);
        }
      } catch (error) {
        console.error("Error uploading single file to S3:", error);
      }
    }
    
    // Handle multiple file uploads (e.g., req.files from multer array/fields)
    if (req.files) {
      console.log("Processing multiple file uploads:", 
        typeof req.files === 'object' ? Object.keys(req.files).join(', ') : 'Not object');
      
      // Check if it's an array or an object with field names
      if (Array.isArray(req.files)) {
        // It's an array of files
        console.log(`Processing ${req.files.length} files in array`);
        
        // Process each file in the array
        for (const file of req.files as Express.Multer.File[]) {
          try {
            console.log(`  - Array file: ${file.originalname}`);
            const s3Key = await uploadToS3(file, `projects/user-${fileUserId}`);
            if (s3Key) {
              uploadedImageUrls.push(s3Key);
              console.log(`    Uploaded to S3: ${s3Key}`);
            }
          } catch (error) {
            console.error(`Error uploading file ${file.originalname} to S3:`, error);
          }
        }
      } else {
        // It's an object with field names as keys
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // Iterate through each field and add all files
        for (const fieldname of Object.keys(filesObj)) {
          const fieldFiles = filesObj[fieldname];
          console.log(`Processing ${fieldFiles.length} files in field '${fieldname}'`);
          
          if (Array.isArray(fieldFiles)) {
            for (const file of fieldFiles) {
              try {
                console.log(`  - Field file: ${file.originalname} (${fieldname})`);
                const s3Key = await uploadToS3(file, `projects/user-${fileUserId}`);
                
                if (s3Key) {
                  uploadedImageUrls.push(s3Key);
                  console.log(`    Uploaded to S3: ${s3Key}`);
                  
                  // Special handling for heroImage
                  if (fieldname === 'heroImage') {
                    console.log("Setting heroImage as first in imageUrls array");
                    // Move hero image to the beginning of the array
                    uploadedImageUrls = uploadedImageUrls.filter(url => url !== s3Key);
                    uploadedImageUrls.unshift(s3Key);
                  }
                  
                  // Special handling for galleryImages
                  if (fieldname === 'galleryImages') {
                    console.log(`Adding gallery image to galleryUrls: ${s3Key}`);
                    
                    // Add to galleryUrls array if it exists
                    if (!req.body.galleryUrls) {
                      req.body.galleryUrls = [];
                    } else if (typeof req.body.galleryUrls === 'string') {
                      try {
                        req.body.galleryUrls = JSON.parse(req.body.galleryUrls);
                      } catch (e) {
                        req.body.galleryUrls = [];
                      }
                    }
                    
                    // Ensure galleryUrls is an array
                    if (!Array.isArray(req.body.galleryUrls)) {
                      req.body.galleryUrls = [];
                    }
                    
                    // Add the S3 key to galleryUrls
                    req.body.galleryUrls.push(s3Key);
                  }
                  
                  // Special handling for location map
                  if (fieldname === 'locationMap') {
                    console.log(`Setting locationMapUrl: ${s3Key}`);
                    req.body.locationMapUrl = s3Key;
                  }
                  
                  // Special handling for master plan
                  if (fieldname === 'masterPlan') {
                    console.log(`Setting masterPlanUrl: ${s3Key}`);
                    req.body.masterPlanUrl = s3Key;
                  }
                  
                  // Special handling for floor plans
                  if (fieldname === 'floorPlans') {
                    console.log(`Adding floor plan to floorPlanUrls: ${s3Key}`);
                    
                    // Add to floorPlanUrls array if it exists
                    if (!req.body.floorPlanUrls) {
                      req.body.floorPlanUrls = [];
                    } else if (typeof req.body.floorPlanUrls === 'string') {
                      try {
                        req.body.floorPlanUrls = JSON.parse(req.body.floorPlanUrls);
                      } catch (e) {
                        req.body.floorPlanUrls = [];
                      }
                    }
                    
                    // Ensure floorPlanUrls is an array
                    if (!Array.isArray(req.body.floorPlanUrls)) {
                      req.body.floorPlanUrls = [];
                    }
                    
                    // Add the S3 key to floorPlanUrls
                    req.body.floorPlanUrls.push(s3Key);
                  }
                  
                  // Special handling for specifications
                  if (fieldname === 'specifications') {
                    console.log(`Adding specification to specificationUrls: ${s3Key}`);
                    
                    // Add to specificationUrls array if it exists
                    if (!req.body.specificationUrls) {
                      req.body.specificationUrls = [];
                    } else if (typeof req.body.specificationUrls === 'string') {
                      try {
                        req.body.specificationUrls = JSON.parse(req.body.specificationUrls);
                      } catch (e) {
                        req.body.specificationUrls = [];
                      }
                    }
                    
                    // Ensure specificationUrls is an array
                    if (!Array.isArray(req.body.specificationUrls)) {
                      req.body.specificationUrls = [];
                    }
                    
                    // Add the S3 key to specificationUrls
                    req.body.specificationUrls.push(s3Key);
                  }
                }
              } catch (error) {
                console.error(`Error uploading file ${file.originalname} to S3:`, error);
              }
            }
          }
        }
      }
    }
    
    // Log all uploaded image URLs
    console.log("All uploaded image URLs:", uploadedImageUrls);
    
    // Add uploaded images to the request body
    if (uploadedImageUrls.length > 0) {
      console.log(`Adding ${uploadedImageUrls.length} uploaded images to imageUrls:`, uploadedImageUrls);
      
      // Add to existing imageUrls or create new array
      if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
        console.log(`Merging with ${req.body.imageUrls.length} existing imageUrls`);
        req.body.imageUrls = [...req.body.imageUrls, ...uploadedImageUrls];
      } else {
        req.body.imageUrls = uploadedImageUrls;
      }
      
      // Make sure galleryUrls is properly initialized
      if (!req.body.galleryUrls) {
        req.body.galleryUrls = [];
      } else if (typeof req.body.galleryUrls === 'string') {
        try {
          req.body.galleryUrls = JSON.parse(req.body.galleryUrls);
        } catch (e) {
          console.error("Error parsing galleryUrls:", e);
          req.body.galleryUrls = [];
        }
      }
      
      // Ensure galleryUrls is an array
      if (!Array.isArray(req.body.galleryUrls)) {
        req.body.galleryUrls = [];
      }
    }
    
    // Clean up imageUrls array - remove blob URLs and handle pending-upload
    if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
      req.body.imageUrls = req.body.imageUrls.map((url: string) => {
        // Handle blob URLs
        if (typeof url === 'string' && url.startsWith('blob:')) {
          console.log(`Converting blob URL to pending-upload placeholder: ${url}`);
          return 'pending-upload';
        }
        return url;
      });
      
      // If we have a heroImage in uploadedImageUrls, replace the first 'pending-upload' with it
      if (uploadedImageUrls.length > 0 && req.body.imageUrls.includes('pending-upload')) {
        console.log(`Replacing 'pending-upload' with actual S3 URL: ${uploadedImageUrls[0]}`);
        const pendingIndex = req.body.imageUrls.indexOf('pending-upload');
        if (pendingIndex !== -1) {
          req.body.imageUrls[pendingIndex] = uploadedImageUrls[0];
        } else {
          // If no 'pending-upload' found, add the S3 URL to the beginning
          req.body.imageUrls.unshift(uploadedImageUrls[0]);
        }
      }
    } else if (uploadedImageUrls.length > 0) {
      // If imageUrls doesn't exist but we have uploaded images, create it
      console.log(`Creating imageUrls array with uploaded S3 URLs: ${uploadedImageUrls}`);
      req.body.imageUrls = uploadedImageUrls;
    }
    
    // Clean up galleryUrls array - remove blob URLs and handle pending-upload
    if (req.body.galleryUrls) {
      // Parse galleryUrls if it's a string
      if (typeof req.body.galleryUrls === 'string') {
        try {
          req.body.galleryUrls = JSON.parse(req.body.galleryUrls);
        } catch (e) {
          console.error("Error parsing galleryUrls:", e);
          req.body.galleryUrls = [];
        }
      }
      
      // Handle array of strings that might be JSON strings
      if (Array.isArray(req.body.galleryUrls)) {
        req.body.galleryUrls = req.body.galleryUrls.flatMap((item: any) => {
          // If the item is a JSON string, parse it
          if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('{'))) {
            try {
              const parsed = JSON.parse(item);
              if (Array.isArray(parsed)) {
                return parsed;
              }
              return item;
            } catch (e) {
              return item;
            }
          }
          return item;
        });
        
        // Clean up blob URLs
        req.body.galleryUrls = req.body.galleryUrls.map((url: string) => {
          if (typeof url === 'string' && url.startsWith('blob:')) {
            console.log(`Converting gallery blob URL to pending-upload placeholder: ${url}`);
            return 'pending-upload';
          }
          return url;
        });
        
        // Replace 'pending-upload' placeholders with actual S3 URLs for gallery images
        // Skip the first uploaded image as it's likely the hero image
        if (uploadedImageUrls.length > 1) {
          const galleryS3Urls = uploadedImageUrls.slice(1); // Skip the first one (hero image)
          console.log(`Found ${galleryS3Urls.length} gallery S3 URLs to replace placeholders`);
          
          let replacementIndex = 0;
          req.body.galleryUrls = req.body.galleryUrls.map((url: string) => {
            if (url === 'pending-upload' && replacementIndex < galleryS3Urls.length) {
              console.log(`Replacing gallery 'pending-upload' with S3 URL: ${galleryS3Urls[replacementIndex]}`);
              return galleryS3Urls[replacementIndex++];
            }
            return url;
          });
          
          // Add any remaining S3 URLs that weren't used for replacement
          if (replacementIndex < galleryS3Urls.length) {
            const remainingUrls = galleryS3Urls.slice(replacementIndex);
            console.log(`Adding ${remainingUrls.length} remaining S3 gallery URLs`);
            req.body.galleryUrls = [...req.body.galleryUrls, ...remainingUrls];
          }
        }
      }
    } else if (uploadedImageUrls.length > 1) {
      // If galleryUrls doesn't exist but we have uploaded images beyond the hero image
      const galleryS3Urls = uploadedImageUrls.slice(1); // Skip the first one (hero image)
      console.log(`Creating galleryUrls array with ${galleryS3Urls.length} S3 URLs`);
      req.body.galleryUrls = galleryS3Urls;
    }
    
    // Clean up floorPlanUrls array
    if (req.body.floorPlanUrls) {
      // Parse floorPlanUrls if it's a string
      if (typeof req.body.floorPlanUrls === 'string') {
        try {
          req.body.floorPlanUrls = JSON.parse(req.body.floorPlanUrls);
        } catch (e) {
          console.error("Error parsing floorPlanUrls:", e);
          req.body.floorPlanUrls = [];
        }
      }
      
      // Handle array of strings that might be JSON strings
      if (Array.isArray(req.body.floorPlanUrls)) {
        req.body.floorPlanUrls = req.body.floorPlanUrls.flatMap((item: any) => {
          // If the item is a JSON string, parse it
          if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('{'))) {
            try {
              const parsed = JSON.parse(item);
              if (Array.isArray(parsed)) {
                return parsed;
              }
              return item;
            } catch (e) {
              return item;
            }
          }
          return item;
        });
        
        // Clean up blob URLs
        req.body.floorPlanUrls = req.body.floorPlanUrls.map((url: string) => {
          if (typeof url === 'string' && url.startsWith('blob:')) {
            console.log(`Converting floor plan blob URL to pending-upload placeholder: ${url}`);
            return 'pending-upload';
          }
          return url;
        });
      }
    }
    
    // Clean up specificationUrls array
    if (req.body.specificationUrls) {
      // Parse specificationUrls if it's a string
      if (typeof req.body.specificationUrls === 'string') {
        try {
          req.body.specificationUrls = JSON.parse(req.body.specificationUrls);
        } catch (e) {
          console.error("Error parsing specificationUrls:", e);
          req.body.specificationUrls = [];
        }
      }
      
      // Handle array of strings that might be JSON strings
      if (Array.isArray(req.body.specificationUrls)) {
        req.body.specificationUrls = req.body.specificationUrls.flatMap((item: any) => {
          // If the item is a JSON string, parse it
          if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('{'))) {
            try {
              const parsed = JSON.parse(item);
              if (Array.isArray(parsed)) {
                return parsed;
              }
              return item;
            } catch (e) {
              return item;
            }
          }
          return item;
        });
        
        // Clean up blob URLs
        req.body.specificationUrls = req.body.specificationUrls.map((url: string) => {
          if (typeof url === 'string' && url.startsWith('blob:')) {
            console.log(`Converting specification blob URL to pending-upload placeholder: ${url}`);
            return 'pending-upload';
          }
          return url;
        });
      }
    }
    
    // Extract category-specific fields
    const categorySpecificData: Record<string, any> = {};
    
    if (req.body.category) {
      switch (req.body.category) {
        case 'luxury':
          categorySpecificData.premiumFeatures = req.body.premiumFeatures || '';
          categorySpecificData.exclusiveServices = req.body.exclusiveServices || '';
          break;
        case 'affordable':
          categorySpecificData.affordabilityFeatures = req.body.affordabilityFeatures || '';
          categorySpecificData.financialSchemes = req.body.financialSchemes || '';
          break;
        case 'commercial':
          categorySpecificData.commercialType = req.body.commercialType || '';
          categorySpecificData.businessAmenities = req.body.businessAmenities || '';
          break;
        case 'new_launch':
          categorySpecificData.launchDate = req.body.launchDate || '';
          categorySpecificData.launchOffers = req.body.launchOffers || '';
          break;
        case 'upcoming':
          categorySpecificData.expectedCompletionDate = req.body.expectedCompletionDate || '';
          categorySpecificData.constructionStatus = req.body.constructionStatus || '';
          break;
        case 'top_urgent':
          categorySpecificData.saleDeadline = req.body.saleDeadline || '';
          categorySpecificData.urgencyReason = req.body.urgencyReason || '';
          categorySpecificData.discountOffered = req.body.discountOffered || '';
          break;
        case 'featured':
          categorySpecificData.highlightFeatures = req.body.highlightFeatures || '';
          categorySpecificData.accolades = req.body.accolades || '';
          break;
        case 'newly_listed':
          categorySpecificData.listingDate = req.body.listingDate || '';
          categorySpecificData.specialIntroOffer = req.body.specialIntroOffer || '';
          break;
        case 'company_projects':
          categorySpecificData.companyProfile = req.body.companyProfile || '';
          categorySpecificData.pastProjects = req.body.pastProjects || '';
          break;
      }
    }

    // Handle BHK config if not properly formatted
    let bhkConfig = req.body.bhkConfig;
    if (!bhkConfig && req.body.bhk2Sizes && req.body.bhk3Sizes) {
      const bhk2 = Array.isArray(req.body.bhk2Sizes) ? req.body.bhk2Sizes.length > 0 : false;
      const bhk3 = Array.isArray(req.body.bhk3Sizes) ? req.body.bhk3Sizes.length > 0 : false;
      
      bhkConfig = `${bhk2 ? '2' : ''}${bhk2 && bhk3 ? ',' : ''}${bhk3 ? '3' : ''} BHK`;
    }
    
    // Enhanced validation for required fields
    if (!req.body.title && !req.body.projectName) {
      return res.status(400).json({ error: "Project title is required" });
    }
    
    // Handle projectCategory field (from form) or category field (from API)
    if (req.body.projectCategory && !req.body.category) {
      req.body.category = req.body.projectCategory;
    }
    
    if (!req.body.category) {
      return res.status(400).json({ error: "Project category is required" });
    }
    
    // Check if the category is valid
    const validCategories = ['new_launch', 'featured', 'commercial', 'upcoming', 
                           'luxury', 'affordable', 'newly_listed', 'top_urgent', 'company_projects'];
    
    if (!validCategories.includes(req.body.category)) {
      console.error(`Invalid category provided: "${req.body.category}". Valid categories are: ${validCategories.join(', ')}`);
      return res.status(400).json({ 
        error: "Invalid project category", 
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }
    
    // Process the userId - ensure it's a number
    let submitterId;
    try {
      submitterId = req.user?.id || (req.body.userId ? parseInt(req.body.userId as string) : 1);
      if (isNaN(submitterId)) {
        console.warn("Invalid userId provided, defaulting to admin (1)");
        submitterId = 1;
      }
    } catch (e) {
      console.warn("Error parsing userId, defaulting to admin (1)", e);
      submitterId = 1;
    }
    
    // Process gallery URLs if available
    let galleryUrlsArray: string[] = [];
    if (req.body.galleryUrls) {
      if (typeof req.body.galleryUrls === 'string') {
        try {
          galleryUrlsArray = JSON.parse(req.body.galleryUrls);
        } catch (e) {
          console.error("Error parsing galleryUrls:", e);
          galleryUrlsArray = [];
        }
      } else if (Array.isArray(req.body.galleryUrls)) {
        galleryUrlsArray = req.body.galleryUrls;
      }
    }
    
    // Process each gallery URL - handle nested JSON strings and blob URLs
    galleryUrlsArray = galleryUrlsArray.map(url => {
      // If it's a string that looks like a JSON array, try to parse it
      if (typeof url === 'string' && url.startsWith('[') && url.endsWith(']')) {
        try {
          const parsed = JSON.parse(url);
          // If it's an array with one item, use that item
          if (Array.isArray(parsed) && parsed.length > 0) {
            url = parsed[0];
          }
        } catch (e) {
          console.error("Error parsing nested gallery URL JSON:", e);
        }
      }
      
      // Convert blob URLs to pending-upload placeholder
      if (typeof url === 'string' && url.startsWith('blob:')) {
        console.log(`Converting blob URL to pending-upload placeholder: ${url}`);
        return 'pending-upload';
      }
      
      return url;
    }).filter(url => url); // Remove any empty/null/undefined values
    
    console.log("Gallery URLs processed:", galleryUrlsArray);
    
    // Handle location map URL if it's a blob URL
    if (req.body.locationMapUrl && typeof req.body.locationMapUrl === 'string' && req.body.locationMapUrl.startsWith('blob:')) {
      console.log(`Converting location map blob URL to pending-upload placeholder: ${req.body.locationMapUrl}`);
      req.body.locationMapUrl = 'pending-upload';
    }
    
    // Handle master plan URL if it's a blob URL
    if (req.body.masterPlanUrl && typeof req.body.masterPlanUrl === 'string' && req.body.masterPlanUrl.startsWith('blob:')) {
      console.log(`Converting master plan blob URL to pending-upload placeholder: ${req.body.masterPlanUrl}`);
      req.body.masterPlanUrl = 'pending-upload';
    }
    
    // Prepare project data
    const projectData = {
      title: req.body.title || req.body.projectName,
      description: req.body.description || req.body.aboutProject || 'No description provided',
      location: req.body.location || req.body.projectAddress,
      city: req.body.city || req.body.location?.split(',').pop()?.trim() || 'Unknown',
      state: req.body.state || 'Not specified',
      price: req.body.price || req.body.projectPrice,
      priceRange: req.body.priceRange,
      bhkConfig: bhkConfig || 'Not specified',
      builder: req.body.builder || req.body.developerInfo || 'Not specified',
      possessionDate: req.body.possessionDate || req.body.expectedCompletionDate,
      category: req.body.category,
      status: req.body.status || 'upcoming',
      amenities: req.body.amenities || [],
      tags: req.body.tags || [req.body.category] || [],
      imageUrls: Array.isArray(req.body.imageUrls) 
        ? req.body.imageUrls.filter((url: string) => url !== 'pending-upload') // Filter out pending-upload placeholders
        : [],
      galleryUrls: Array.isArray(galleryUrlsArray) 
        ? galleryUrlsArray.filter((url: string) => url !== 'pending-upload') // Filter out pending-upload placeholders
        : [],
      featured: req.body.featured === 'true' || req.body.category === 'featured',
      rating: req.body.rating ? parseFloat(req.body.rating) : null,
      contactNumber: req.body.contactNumber || (req.user?.phone || ''),
      userId: submitterId,
      approvalStatus: 'pending',
    };
    
    // Always include uploaded images in the imageUrls array
    if (uploadedImageUrls.length > 0) {
      console.log("Adding uploaded images to imageUrls array");
      
      // Filter out any pending-upload placeholders
      const filteredExistingUrls = Array.isArray(projectData.imageUrls) 
        ? projectData.imageUrls.filter(url => url !== 'pending-upload')
        : [];
      
      // Combine existing URLs with uploaded URLs, ensuring no duplicates
      const combinedUrls = [...new Set([...filteredExistingUrls, ...uploadedImageUrls])];
      
      console.log(`Combined image URLs: ${combinedUrls.length} total (${filteredExistingUrls.length} existing, ${uploadedImageUrls.length} uploaded)`);
      projectData.imageUrls = combinedUrls;
    } else if (projectData.imageUrls.length === 0) {
      console.log("No images found in request body or uploads");
    }
    
    console.log("Project data validation passed and ready for insertion");
    
    // Log the project data before insertion
    console.log("Project data to be inserted:", {
      ...projectData,
      imageUrlsCount: projectData.imageUrls.length
    });
    
    // Create the project with metadata for category-specific fields
    let insertedProject;
    try {
      // Make sure arrays are properly formatted
      const sanitizedProjectData = {
        ...projectData,
        // Store category-specific data as a JSON string in the description field
        description: projectData.description + (Object.keys(categorySpecificData).length > 0 
          ? `\n\n<!-- Category-specific data: ${JSON.stringify(categorySpecificData)} -->`
          : ''),
        // Ensure array fields are properly formatted
        amenities: Array.isArray(projectData.amenities) ? projectData.amenities : [],
        tags: Array.isArray(projectData.tags) ? projectData.tags : [],
        imageUrls: Array.isArray(projectData.imageUrls) ? projectData.imageUrls : [],
        galleryUrls: Array.isArray(projectData.galleryUrls) ? projectData.galleryUrls : [],
        floorPlanUrls: Array.isArray(projectData.floorPlanUrls) ? projectData.floorPlanUrls : [],
        specificationUrls: Array.isArray(projectData.specificationUrls) ? projectData.specificationUrls : [],
        bhk2Sizes: Array.isArray(projectData.bhk2Sizes) ? projectData.bhk2Sizes : [],
        bhk3Sizes: Array.isArray(projectData.bhk3Sizes) ? projectData.bhk3Sizes : []
      };
      
      // Log image URLs for debugging
      console.log("Image URLs to be saved:", sanitizedProjectData.imageUrls);
      console.log("Gallery URLs to be saved:", sanitizedProjectData.galleryUrls);
      console.log("Floor Plan URLs to be saved:", sanitizedProjectData.floorPlanUrls);
      console.log("Specification URLs to be saved:", sanitizedProjectData.specificationUrls);
      
      // Print detailed debug information
      console.log("Final project data being inserted:", {
        title: sanitizedProjectData.title,
        category: sanitizedProjectData.category,
        amenities: sanitizedProjectData.amenities,
        tags: sanitizedProjectData.tags,
        imageUrls: sanitizedProjectData.imageUrls,
        galleryUrls: sanitizedProjectData.galleryUrls,
        floorPlanUrls: sanitizedProjectData.floorPlanUrls,
        specificationUrls: sanitizedProjectData.specificationUrls,
        bhk2Sizes: sanitizedProjectData.bhk2Sizes,
        bhk3Sizes: sanitizedProjectData.bhk3Sizes,
        userId: sanitizedProjectData.userId
      });
      
      // Insert the project
      insertedProject = await db.insert(projects).values(sanitizedProjectData).returning();
      
      console.log("Project inserted successfully:", insertedProject[0].id);
    } catch (dbError: unknown) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.error("Database error during project insertion:", dbError);
      console.error("Database error details:", dbError);
      return res.status(500).json({ error: `Database error: ${errorMessage}` });
    }
    
    if (!insertedProject || insertedProject.length === 0) {
      return res.status(500).json({ error: "Failed to create project - no data returned from database" });
    }
    
    // Create a summary of category-specific fields for the admin email
    let categorySpecificSummary = '';
    if (Object.keys(categorySpecificData).length > 0) {
      categorySpecificSummary = '<h3>Category-Specific Details:</h3><ul>';
      for (const [key, value] of Object.entries(categorySpecificData)) {
        if (value && value.toString().trim() !== '') {
          // Format the key for better readability
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
          
          categorySpecificSummary += `<li><strong>${formattedKey}:</strong> ${value}</li>`;
        }
      }
      categorySpecificSummary += '</ul>';
    }
    
    // Prepare admin email
    const adminNotificationHtml = `
      <h1>New Project Submission</h1>
      <p>A new project has been submitted and requires your approval.</p>
      <h2>${projectData.title}</h2>
      <p><strong>Location:</strong> ${projectData.city}</p>
      <p><strong>Category:</strong> ${projectData.category}</p>
      <p><strong>Description:</strong> ${projectData.description.split('<!--')[0]}</p>
      ${categorySpecificSummary}
      <p>Please login to the admin panel to review and approve this project.</p>
    `;
    
    // Send email to main admin email
    try {
      await sendEmail(
        "urgentsale.in@gmail.com", 
        `New Project Submission: ${projectData.title}`, 
        adminNotificationHtml
      );
    } catch (emailError: any) {
      console.error("Failed to send admin notification email:", emailError?.message || emailError);
      // Continue processing since the project was successfully inserted
    }
    
    // Send confirmation to the user if they're logged in
    if (req.user?.email) {
      try {
        const userConfirmationHtml = `
          <h1>Thank You for Your Submission</h1>
          <p>We have received your project submission for "${projectData.title}".</p>
          <p>Our team will review your submission and it will be published after approval.</p>
          <p><strong>Project ID:</strong> ${insertedProject[0].id}</p>
          <p>Thank you for choosing our platform!</p>
        `;
        
        await sendEmail(
          req.user.email,
          "Project Submission Confirmation",
          userConfirmationHtml
        );
        
        // If user has phone number, send WhatsApp notification too
        if (req.user.phone) {
          try {
            await sendWhatsAppNotification(
              req.user.phone,
              "property_submission",
              {
                propertyId: insertedProject[0].id.toString(),
                status: "pending",
                message: `Your project "${projectData.title}" has been submitted and is pending approval. Project ID: ${insertedProject[0].id}`
              }
            );
            console.log("WhatsApp project submission notification sent to user");
          } catch (whatsappError) {
            console.error("Failed to send WhatsApp notification:", whatsappError);
            // Continue processing since email was already sent
          }
        }
      } catch (emailError: any) {
        console.error("Failed to send user confirmation email:", emailError?.message || emailError);
        // Continue processing since the project was successfully inserted
      }
    }
    
    // Log successful project submission in activity logs
    await logProjectSubmission(req, insertedProject[0].id, true);
    
    // Log success using general logger as well
    await logActivity({
      userId: req.user?.id,
      action: "project_submission_complete",
      entity: "project",
      entityId: insertedProject[0].id,
      status: "success",
      details: {
        title: projectData.title,
        category: projectData.category,
        imageCount: projectData.imageUrls.length,
        responseStatus: 201,
        projectId: insertedProject[0].id,
        timestamp: new Date().toISOString()
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });
    
    // Return success response
    return res.status(201).json({
      message: "Project submitted successfully and pending approval",
      project: insertedProject[0]
    });
    
  } catch (error: any) {
    // Log failed project submission
    await logActivity({
      userId: req.user?.id,
      action: "project_submission_failed",
      entity: "project",
      status: "error",
      details: {
        title: req.body.title || req.body.projectName,
        category: req.body.category,
        errorType: error.name || "Unknown",
        timestamp: new Date().toISOString()
      },
      errorMessage: error.message || "Unknown error",
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });
    console.error("Error submitting project:", error);
    return res.status(500).json({ 
      error: "Failed to submit project", 
      details: error.message || "Unknown error"
    });
  }
}

// Get all projects with optional filter by approval status
export async function getAllProjects(req: Request, res: Response) {
  try {
    const { status } = req.query;
    const approvalStatus = status as string || undefined;
    
    let allProjects;
    
    if (approvalStatus) {
      allProjects = await db.query.projects.findMany({
        where: eq(projects.approvalStatus, approvalStatus),
        orderBy: [desc(projects.createdAt)]
      });
    } else {
      allProjects = await db.query.projects.findMany({
        orderBy: [desc(projects.createdAt)]
      });
    }
    
    return res.status(200).json(allProjects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
}

// Get projects by category
export async function getProjectsByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    // Special case for "pending" category - fetch all pending projects regardless of their category
    if (category === "pending") {
      const pendingProjects = await db.query.projects.findMany({
        where: eq(projects.approvalStatus, "pending"),
        orderBy: [desc(projects.createdAt)],
        limit: limit,
      });
      
      return res.status(200).json(pendingProjects);
    }
    
    // Regular category fetch
    if (!projectCategories.includes(category as any)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    
    const projectsList = await db.query.projects.findMany({
      where: and(
        eq(projects.category, category),
        eq(projects.approvalStatus, "approved")
      ),
      orderBy: [desc(projects.createdAt)],
      limit: limit,
    });
    
    return res.status(200).json(projectsList);
  } catch (error) {
    console.error(`Error fetching ${req.params.category} projects:`, error);
    return res.status(500).json({ error: `Failed to fetch ${req.params.category} projects` });
  }
}

// Approve a project (admin only)
export async function approveProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    // Check if project exists
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Update approval status
    await db.update(projects)
      .set({ 
        approvalStatus: "approved",
        approvalDate: new Date()
      })
      .where(eq(projects.id, projectId));
    
    // Notify the user who submitted the project
    if (project.userId) {
      const user = await storage.getUser(project.userId);
      
      if (user && user.email) {
        const approvalEmailHtml = `
          <h1>Project Approved</h1>
          <p>Good news! Your project "${project.title}" has been approved and is now live on our platform.</p>
          <p>Thank you for choosing our platform!</p>
        `;
        
        await sendEmail(
          user.email,
          "Your Project Has Been Approved",
          approvalEmailHtml
        );
        
        // Send WhatsApp notification if user has a phone number
        if (user.phone) {
          try {
            await sendWhatsAppNotification(
              user.phone,
              "property_approval",
              {
                propertyId: project.id.toString(),
                approvalStatus: "approved",
                message: `Good news! Your project "${project.title}" has been approved and is now live on our platform.`
              }
            );
            console.log("WhatsApp project approval notification sent to user");
          } catch (whatsappError) {
            console.error("Failed to send WhatsApp approval notification:", whatsappError);
            // Continue processing since email was already sent
          }
        }
      }
    }
    
    return res.status(200).json({ message: "Project approved successfully" });
  } catch (error) {
    console.error("Error approving project:", error);
    return res.status(500).json({ error: "Failed to approve project" });
  }
}

// Reject a project (admin only)
export async function rejectProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    // Check if project exists
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Update approval status
    await db.update(projects)
      .set({ 
        approvalStatus: "rejected",
        rejectionReason: reason || "Did not meet our guidelines"
      })
      .where(eq(projects.id, projectId));
    
    // Notify the user who submitted the project
    if (project.userId) {
      const user = await storage.getUser(project.userId);
      
      if (user && user.email) {
        const rejectionEmailHtml = `
          <h1>Project Not Approved</h1>
          <p>We regret to inform you that your project "${project.title}" could not be approved at this time.</p>
          <p><strong>Reason:</strong> ${reason || "Did not meet our guidelines"}</p>
          <p>Please feel free to submit a revised version addressing these concerns.</p>
          <p>Thank you for your understanding.</p>
        `;
        
        await sendEmail(
          user.email,
          "Project Submission Update",
          rejectionEmailHtml
        );
        
        // Send WhatsApp notification if user has a phone number
        if (user.phone) {
          try {
            await sendWhatsAppNotification(
              user.phone,
              "property_approval",
              {
                propertyId: project.id.toString(),
                approvalStatus: "rejected",
                message: `We regret to inform you that your project "${project.title}" could not be approved at this time. Reason: ${reason || "Did not meet our guidelines"}`
              }
            );
            console.log("WhatsApp project rejection notification sent to user");
          } catch (whatsappError) {
            console.error("Failed to send WhatsApp rejection notification:", whatsappError);
            // Continue processing since email was already sent
          }
        }
      }
    }
    
    return res.status(200).json({ message: "Project rejected successfully" });
  } catch (error) {
    console.error("Error rejecting project:", error);
    return res.status(500).json({ error: "Failed to reject project" });
  }
}

// Keep the rest of the file as is