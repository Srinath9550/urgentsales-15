import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, sendEmailOTP } from "./auth";
import * as fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { uploadToS3, getSignedImageUrl } from './s3-service';
import {
  insertPropertySchema,
  insertAgentSchema,
  insertCompanySchema,
  insertInquirySchema,
  insertAgentReviewSchema,
  userRoles,
  approvalStatus,
} from "@shared/schema";
import { z } from "zod";
import * as express from "express";
import { db, pool } from "./db";
import { count, sql, and, desc, eq, or, gte, lte, like, ne, between } from "drizzle-orm";
import * as schema from "@shared/schema";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  sendRoleNotifications,
} from "./notification-service";
import { getNeighborhoodInsightsHandler } from "./neighborhood-service";
import {
  handleContactForm,
  handleFeedbackForm,
  handleReportProblem,
  handlePropertyInterest,
} from "./email-service";
import propertyInterestRoutes from "./routes/property-interest";
import s3ImageRoutes from "./routes/s3-image-routes";
import emailTestRoutes from "./routes/email-test";
import {
  getRecentLogs,
  getEntityLogs,
} from "./logger-service";
import { upload, getFileUrl, deleteFile, processS3Upload } from "./file-upload";
import {
  getUpcomingProjects,
  getFeaturedProjects,
  getLuxuryProjects,
  getProjectById,
  getAffordableProjects,
  getCommercialProjects,
  getNewLaunchProjects,
  submitProject,
  getProjectsByCategory,
  approveProject,
  rejectProject,
  getAllProjects,
} from "./projects-service";
import { handleProjectSubmission } from "./submit-project-api";
import {
  createReferral,
  getAllReferrals,
  getReferralsByUser,
  updateReferralStatus,
} from "./referral-service";

// Import upload routes - we'll import this dynamically later
// import { handlePropertyImageUpload } from './upload-routes';

//  Sub Scription Service 
import { SubscriptionService } from './services/subscription-service';

//  AD Packages 
import adPackagesRoutes from './routes/ad-packages';


// File system and path modules for serving static files
// Already imported at the top of the file

// Helper to catch errors in async routes
const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.errors,
        });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
  };

// Helper to check authentication
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this resource" });
  }
  next();
};

// Helper to check user role
const hasRole =
  (roles: string[]) => (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this resource" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };

const createCheckoutSession = async (req: Request, res: Response) => {
  // This is a placeholder.  Replace with actual Stripe checkout session creation.
  try {
    //  Your Stripe checkout session creation logic here.  This will require
    //  Stripe API calls and handling of price IDs, subscription plans etc.
    const session = { id: "temp-session-id" }; // Replace with actual session
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// Database admin endpoint
const getDatabaseTablesInfo = async (req: Request, res: Response) => {
  try {
    // Check if it's an admin user
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Get simple stats from each database table
    const userCount = (
      await db.select({ count: count() }).from(schema.users)
    )[0].count;
    const propertyCount = (
      await db.select({ count: count() }).from(schema.properties)
    )[0].count;
    const agentCount = (
      await db.select({ count: count() }).from(schema.agents)
    )[0].count;
    const companyCount = (
      await db.select({ count: count() }).from(schema.companies)
    )[0].count;
    const bookingCount = (
      await db.select({ count: count() }).from(schema.bookings)
    )[0].count;
    const inquiryCount = (
      await db.select({ count: count() }).from(schema.inquiries)
    )[0].count;
    const notificationCount = (
      await db.select({ count: count() }).from(schema.notifications)
    )[0].count;
    const otpCount = (await db.select({ count: count() }).from(schema.otps))[0]
      .count;
    const reviewCount = (
      await db.select({ count: count() }).from(schema.agentReviews)
    )[0].count;

    // Return the stats
    return res.json([
      { tableName: "users", rowCount: userCount },
      { tableName: "properties", rowCount: propertyCount },
      { tableName: "agents", rowCount: agentCount },
      { tableName: "companies", rowCount: companyCount },
      { tableName: "bookings", rowCount: bookingCount },
      { tableName: "inquiries", rowCount: inquiryCount },
      { tableName: "notifications", rowCount: notificationCount },
      { tableName: "otps", rowCount: otpCount },
      { tableName: "agent_reviews", rowCount: reviewCount },
    ]);
  } catch (error) {
    console.error("Error fetching database info:", error);
    res.status(500).json({ error: "Failed to fetch database information" });
  }
};

// Get table records with pagination
const getTableRecords = async (req: Request, res: Response) => {
  try {
    // Check if it's an admin user
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { table } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let records = [];
    let totalCount = 0;

    // Get records based on table name
    switch (table) {
      case "users":
        records = await db
          .select()
          .from(schema.users)
          .limit(limit)
          .offset(offset);
        totalCount = (await db.select({ count: count() }).from(schema.users))[0]
          .count;
        break;
      case "properties":
        records = await db
          .select()
          .from(schema.properties)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.properties)
        )[0].count;
        break;
      case "agents":
        records = await db
          .select()
          .from(schema.agents)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.agents)
        )[0].count;
        break;
      case "companies":
        records = await db
          .select()
          .from(schema.companies)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.companies)
        )[0].count;
        break;
      case "bookings":
        records = await db
          .select()
          .from(schema.bookings)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.bookings)
        )[0].count;
        break;
      case "inquiries":
        records = await db
          .select()
          .from(schema.inquiries)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.inquiries)
        )[0].count;
        break;
      case "notifications":
        records = await db
          .select()
          .from(schema.notifications)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.notifications)
        )[0].count;
        break;
      case "otps":
        records = await db
          .select()
          .from(schema.otps)
          .limit(limit)
          .offset(offset);
        totalCount = (await db.select({ count: count() }).from(schema.otps))[0]
          .count;
        break;
      case "agent_reviews":
        records = await db
          .select()
          .from(schema.agentReviews)
          .limit(limit)
          .offset(offset);
        totalCount = (
          await db.select({ count: count() }).from(schema.agentReviews)
        )[0].count;
        break;
      default:
        return res.status(404).json({ error: "Table not found" });
    }

    return res.json({
      records,
      total: totalCount,
    });
  } catch (error) {
    console.error(`Error fetching records from table:`, error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

// Get the directory name (equivalent to __dirname in CommonJS)
const getDirName = () => {
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  app.use(express.json());
  
  // Get the directory name
  const dirName = getDirName();
  
  // Serve static files from the uploads directory
  app.use('/uploads', express.static(path.join(dirName, '..', 'uploads')));
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(dirName, '..', 'uploads');
  // Use fs-extra's ensureDirSync instead of existsSync/mkdirSync
  fs.ensureDirSync(uploadsDir);
  console.log('Ensured uploads directory exists:', uploadsDir);
  
  // Register property interest routes
  app.use('/api/property-interest', propertyInterestRoutes);
  
  // Register S3 image routes
  app.use('/api', s3ImageRoutes);

  // Serve logo from root path
  // app.get('/logo.png', (req, res) => {
  //   const logoPath = path.resolve(__dirname, '..', 'client', 'public', 'logo.png');
    
  //   // Check if logo exists
  //   if (fs.existsSync(logoPath)) {
  //     res.sendFile(logoPath);
  //   } else {
  //     console.error('Logo file not found at:', logoPath);
  //     res.status(404).send('Logo not found');
  //   }
  // });

  // Database admin routes
  app.get(
    "/api/admin/database/tables",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(getDatabaseTablesInfo),
  );
  app.get(
    "/api/admin/database/tables/:table",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(getTableRecords),
  );

  app.post(
    "/api/create-checkout-session",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      await createCheckoutSession(req, res);
    }),
  );

  // =========== Upload Routes ===========

  // Check S3 configuration
  app.get("/api/s3-config", (req, res) => {
    try {
      const s3Config = {
        isConfigured: !!(process.env.AWS_BUCKET_NAME && process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY),
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_BUCKET_REGION || 'ap-south-1'
      };
      
      console.log("S3 configuration:", s3Config);
      
      res.json({
        success: true,
        data: s3Config
      });
    } catch (error) {
      console.error("Error checking S3 config:", error);
      res.status(500).json({
        success: false,
        message: "Error checking S3 configuration"
      });
    }
  });
  
  // Get a pre-signed URL for S3 objects
  app.get("/api/s3-signed-url", asyncHandler(async (req, res) => {
    try {
      const { key } = req.query;
      
      if (!key || typeof key !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Missing or invalid 'key' parameter"
        });
      }
      
      // Generate pre-signed URL
      const signedUrl = await getSignedImageUrl(key);
      
      // Check if we got a valid signed URL
      if (!signedUrl) {
        console.log(`Failed to generate pre-signed URL for key: ${key}`);
        return res.status(404).json({
          success: false,
          message: "Could not generate signed URL for the provided key",
          data: {
            originalKey: key,
            signedUrl: '' // Empty string indicates failure
          }
        });
      }
      
      console.log(`Generated pre-signed URL for key: ${key}`);
      
      res.json({
        success: true,
        data: {
          originalKey: key,
          signedUrl: signedUrl
        }
      });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({
        success: false,
        message: "Error generating pre-signed URL",
        data: {
          originalKey: req.query.key,
          signedUrl: '' // Empty string indicates failure
        }
      });
    }
  }));

  // Property image upload endpoint is defined later in the file

  // =========== Notification Routes ===========

  // Get user notifications
  app.get(
    "/api/notifications",
    isAuthenticated,
    asyncHandler(getNotifications),
  );

  // Mark a notification as read
  app.post(
    "/api/notifications/:notificationId/read",
    isAuthenticated,
    asyncHandler(markNotificationAsRead),
  );

  // Mark all notifications as read
  app.post(
    "/api/notifications/read-all",
    isAuthenticated,
    asyncHandler(markAllNotificationsAsRead),
  );

  // Create a notification (admin only)
  app.post(
    "/api/notifications",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(createNotification),
  );

  // Send role-specific notifications (admin only)
  app.post(
    "/api/notifications/role",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(sendRoleNotifications),
  );

  // =========== Property Routes ===========

  // Get all properties
  app.get(
    "/api/properties",
    asyncHandler(async (req, res) => {
      const properties = await storage.getAllProperties();

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );

      res.json(filteredProperties);
    }),
  );

  // Get top properties by category
  app.get(
    "/api/properties/top/:category",
    asyncHandler(async (req, res) => {
      const { category } = req.params;
      const { city } = req.query;

      try {
        // Determine limit based on category
        let limit = 10;
        switch (category) {
          case "top10":
            limit = 10;
            break;
          case "top20":
            limit = 20;
            break;
          case "top30":
            limit = 30;
            break;
          case "top50":
            limit = 50;
            break;
          case "top100":
            limit = 100;
            break;
          default:
            limit = 10;
        }

        // Get regular properties from storage
        const regularProperties = await storage.getTopProperties(category, city as string, limit);
        
        // Get free properties from free_properties table
        let freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE approval_status = 'approved'
        `;
        
        // Add city filter if provided
        if (city) {
          freePropertiesQuery += ` AND LOWER(city) = LOWER($1)`;
        }
        
        freePropertiesQuery += ` ORDER BY created_at DESC LIMIT $${city ? 2 : 1}`;
        
        // Execute query with appropriate parameters
        const freeResult = city 
          ? await pool.query(freePropertiesQuery, [city.toString(), limit])
          : await pool.query(freePropertiesQuery, [limit]);
        
        // Map the free properties to match the expected format
        const freeProperties = freeResult.rows.map(prop => {
          return {
            id: prop.id,
            title: prop.title || "Untitled Property",
            description: prop.description || "",
            price: parseFloat(prop.price) || 0,
            location: prop.location || "",
            city: prop.city || "",
            propertyType: prop.property_type || "",
            bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
            bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
            area: parseFloat(prop.area) || 0,
            imageUrls: prop.image_urls || [],
            premium: false,
            verified: true,
            saleType: prop.rent_or_sale === "rent" ? "Rent" : "Sale",
            isFreeProperty: true,
            amenities: prop.amenities || []
          };
        });
        
        // Combine regular and free properties
        const combinedProperties = [...regularProperties, ...freeProperties];
        
        // Sort by price (highest first) for top properties
        combinedProperties.sort((a, b) => b.price - a.price);
        
        // Apply limit
        const limitedProperties = combinedProperties.slice(0, limit);
        
        // Send the properties
        res.json(limitedProperties);
      } catch (error) {
        console.error("Error fetching top properties:", error);
        res.status(500).json({ message: "Failed to fetch top properties" });
      }
    }),
  );

  // Get featured properties
  app.get(
    "/api/properties/featured",
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const properties = await storage.getFeaturedProperties(limit);

      try {
        // Get approved free properties from free_properties table
        const freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE approval_status = 'approved'
          ORDER BY created_at DESC
          LIMIT 6
        `;
        
        const freeResult = await pool.query(freePropertiesQuery);
        
        // Map the free properties to match the expected format
        const mappedFreeProperties = freeResult.rows.map(prop => ({
          id: prop.id,
          title: prop.title,
          description: prop.description || 'No description provided',
          price: parseFloat(prop.price) || 0,
          propertyType: prop.property_type,
          propertyCategory: prop.property_category,
          location: prop.location,
          city: prop.city,
          area: parseFloat(prop.area) || 0,
          areaUnit: prop.area_unit,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          balconies: prop.balconies,
          floor: prop.floor_no,
          totalFloors: prop.total_floors,
          furnishedStatus: prop.furnished_status,
          facing: prop.facing,
          amenities: prop.amenities || [],
          userType: prop.user_type,
          contactName: prop.contact_name,
          contactPhone: prop.contact_phone,
          contactEmail: prop.contact_email,
          imageUrls: prop.image_urls || [],
          videoUrls: [],
          isUrgentSale: prop.is_urgent_sale,
          rentOrSale: prop.rent_or_sale,
          status: 'active',
          approvalStatus: 'approved',
          isFreeProperty: true, // Mark as free property
          isFeatured: true,
          isPremium: false,
          createdAt: prop.created_at,
          updatedAt: prop.updated_at || prop.created_at
        }));
        
        // Check if user is admin
        const isAdmin = req.user && req.user.role === "admin";

        // If not admin, only return approved properties
        const filteredProperties = isAdmin
          ? properties
          : properties.filter(
              (property) => property.approvalStatus === "approved",
            );

        // Combine regular properties and free properties
        const combinedProperties = [...filteredProperties, ...mappedFreeProperties];

        res.json(combinedProperties);
      } catch (error) {
        console.error("Error fetching free properties for featured listing:", error);
        
        // Check if user is admin
        const isAdmin = req.user && req.user.role === "admin";

        // If not admin, only return approved properties
        const filteredProperties = isAdmin
          ? properties
          : properties.filter(
              (property) => property.approvalStatus === "approved",
            );
            
        // Fall back to just the regular properties
        res.json(filteredProperties);
      }
    }),
  );

  // Get premium properties
  app.get(
    "/api/properties/premium",
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const properties = await storage.getPremiumProperties(limit);

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );

      res.json(filteredProperties);
    }),
  );

  // Get top properties (by category and location)
  app.get(
    "/api/properties/top",
    asyncHandler(async (req, res) => {
      const category = (req.query.category as string) || "premium";
      const location = req.query.location as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const properties = await storage.getTopProperties(
        category,
        location,
        limit,
      );

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );

      res.json(filteredProperties);
    }),
  );

  // Get all available property cities
  app.get(
    "/api/properties/cities",
    asyncHandler(async (req, res) => {
      const cities = await storage.getPropertyCities();
      res.json(cities);
    }),
  );
  
  // Get property counts by type
  app.get(
    "/api/properties/counts-by-type",
    asyncHandler(async (req, res) => {
      try {
        // Get counts from regular properties
        const regularCounts = await storage.getPropertyCountsByType();
        
        // Get counts from free properties
        const freePropertiesQuery = `
          SELECT 
            property_type as type, 
            COUNT(*) as count 
          FROM free_properties 
          WHERE approval_status = 'approved'
          GROUP BY property_type
        `;
        
        const freeResult = await pool.query(freePropertiesQuery);
        const freeCounts = freeResult.rows;
        
        // Combine the counts
        const combinedCounts = [...regularCounts];
        
        // Add free property counts to the combined counts
        freeCounts.forEach(freeCount => {
          const existingTypeIndex = combinedCounts.findIndex(
            item => item.type.toLowerCase() === freeCount.type.toLowerCase()
          );
          
          if (existingTypeIndex >= 0) {
            // Add to existing type
            combinedCounts[existingTypeIndex].count += parseInt(freeCount.count);
          } else {
            // Add new type
            combinedCounts.push({
              type: freeCount.type,
              count: parseInt(freeCount.count)
            });
          }
        });
        
        // Sort by count (highest first)
        combinedCounts.sort((a, b) => b.count - a.count);
        
        res.json(combinedCounts);
      } catch (error) {
        console.error("Error fetching property counts by type:", error);
        res.status(500).json({ message: "Failed to fetch property counts" });
      }
    }),
  );

  // Get urgent properties (properties with discounted prices)
  app.get(
    "/api/properties/urgent",
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // Use the dedicated method to get urgent properties
      const urgentProperties = await storage.getUrgentSaleProperties(limit);

      // Map to the expected format for the frontend
      const formattedProperties = urgentProperties.map((property) => ({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        discountedPrice:
          property.discountedPrice || Math.round(property.price * 0.75), // 25% discount
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        imageUrl:
          property.imageUrls && property.imageUrls.length > 0
            ? property.imageUrls[0]
            : "",
        expiresAt:
          property.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Use property expiration date or default to 7 days
      }));

      res.json(formattedProperties);
    }),
  );

  // Get recent properties
  app.get(
    "/api/properties/recent",
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const properties = await storage.getRecentProperties(limit);

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );

      res.json(filteredProperties);
    }),
  );

  // Search properties
  app.get(
    "/api/properties/search",
    asyncHandler(async (req, res) => {
      const {
        city,
        location,
        propertyType,
        minPrice,
        maxPrice,
        minBedrooms,
        maxBedrooms,
        minBathrooms,
        maxBathrooms,
        minArea,
        maxArea,
        rentOrSale,
        forSaleOrRent,
        status,
        amenities,
        sortBy,
        page = "1",
        limit = "12",
      } = req.query;

      // Build search query
      const query: any = {};

      // Handle location search (can be either city or location parameter)
      if (city) query.city = city as string;
      if (location) query.city = location as string; // Alternative param name

      // Handle property type
      if (propertyType) query.propertyType = propertyType as string;

      // Handle price range
      if (minPrice) query.minPrice = parseInt(minPrice as string);
      if (maxPrice) query.maxPrice = parseInt(maxPrice as string);

      // Handle room counts
      if (minBedrooms) query.minBedrooms = parseInt(minBedrooms as string);
      if (maxBedrooms) query.maxBedrooms = parseInt(maxBedrooms as string);
      if (minBathrooms) query.minBathrooms = parseInt(minBathrooms as string);
      if (maxBathrooms) query.maxBathrooms = parseInt(maxBathrooms as string);

      // Handle area
      if (minArea) query.minArea = parseInt(minArea as string);
      if (maxArea) query.maxArea = parseInt(maxArea as string);

      // Handle property category (rent vs sale)
      // Support both parameter names for backwards compatibility
      if (rentOrSale) query.rentOrSale = rentOrSale as string;
      if (forSaleOrRent) query.rentOrSale = forSaleOrRent as string;

      // Handle property status
      if (status) query.status = status as string;

      // Handle amenities
      if (amenities) query.amenities = (amenities as string).split(",");

      // Get properties based on search criteria
      const properties = await storage.searchProperties(query);

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );
      
      // Get free properties that match search criteria
      const includeFree = req.query.includeFree !== "false"; // Default to including free properties
      let freeProperties = [];
      
      if (includeFree) {
        try {
          // Build SQL query based on search parameters
          let sqlQuery = `
            SELECT * FROM free_properties 
            WHERE approval_status = 'approved'
          `;
          
          const sqlParams: any[] = [];
          let paramIndex = 1;
          
          // Add city/location filter
          if (query.city) {
            sqlQuery += ` AND (LOWER(city) LIKE $${paramIndex} OR LOWER(location) LIKE $${paramIndex})`;
            sqlParams.push(`%${query.city.toLowerCase()}%`);
            paramIndex++;
          }
          
          // Add property type filter
          if (query.propertyType) {
            sqlQuery += ` AND LOWER(property_type) = $${paramIndex}`;
            sqlParams.push(query.propertyType.toLowerCase());
            paramIndex++;
          }
          
          // Add price range filter
          if (query.minPrice) {
            sqlQuery += ` AND CAST(price AS NUMERIC) >= $${paramIndex}`;
            sqlParams.push(query.minPrice);
            paramIndex++;
          }
          
          if (query.maxPrice) {
            sqlQuery += ` AND CAST(price AS NUMERIC) <= $${paramIndex}`;
            sqlParams.push(query.maxPrice);
            paramIndex++;
          }
          
          // Add area range filter
          if (query.minArea) {
            sqlQuery += ` AND CAST(area AS NUMERIC) >= $${paramIndex}`;
            sqlParams.push(query.minArea);
            paramIndex++;
          }
          
          if (query.maxArea) {
            sqlQuery += ` AND CAST(area AS NUMERIC) <= $${paramIndex}`;
            sqlParams.push(query.maxArea);
            paramIndex++;
          }
          
          // Add bedrooms filter
          if (query.minBedrooms) {
            sqlQuery += ` AND CAST(bedrooms AS INTEGER) >= $${paramIndex}`;
            sqlParams.push(query.minBedrooms);
            paramIndex++;
          }
          
          // Add bathrooms filter
          if (query.minBathrooms) {
            sqlQuery += ` AND CAST(bathrooms AS INTEGER) >= $${paramIndex}`;
            sqlParams.push(query.minBathrooms);
            paramIndex++;
          }
          
          // Add rent/sale filter
          if (query.rentOrSale) {
            sqlQuery += ` AND rent_or_sale = $${paramIndex}`;
            sqlParams.push(query.rentOrSale);
            paramIndex++;
          }
          
          // Add sort logic - default newest first
          sqlQuery += ` ORDER BY created_at DESC`;
          
          // Add limit
          const limit = parseInt(req.query.limit as string) || 12;
          sqlQuery += ` LIMIT ${limit}`;
          
          const result = await pool.query(sqlQuery, sqlParams);
          
          // Map the results to match the expected format for the frontend
          freeProperties = result.rows.map(prop => ({
            id: prop.id,
            title: prop.title,
            description: prop.description || 'No description provided',
            price: parseFloat(prop.price) || 0,
            propertyType: prop.property_type,
            propertyCategory: prop.property_category,
            location: prop.location,
            city: prop.city,
            area: parseFloat(prop.area) || 0,
            areaUnit: prop.area_unit,
            bedrooms: parseInt(prop.bedrooms) || 0,
            bathrooms: parseInt(prop.bathrooms) || 0,
            balconies: prop.balconies,
            floor: prop.floor_no,
            totalFloors: prop.total_floors,
            furnishedStatus: prop.furnished_status,
            facing: prop.facing,
            amenities: prop.amenities || [],
            userType: prop.user_type,
            contactName: prop.contact_name,
            contactPhone: prop.contact_phone,
            contactEmail: prop.contact_email,
            imageUrls: prop.image_urls || [],
            videoUrls: [],
            isUrgentSale: prop.is_urgent_sale,
            rentOrSale: prop.rent_or_sale,
            status: 'active',
            approvalStatus: 'approved',
            isFeatured: false,
            isPremium: false,
            isFreeProperty: true, // Add this flag to identify free properties
            createdAt: prop.created_at,
            updatedAt: prop.updated_at || prop.created_at
          }));
        } catch (error) {
          console.error("Error searching free properties:", error);
          // Continue with regular properties even if free properties search fails
        }
      }
      
      // Combine regular and free properties
      const combinedProperties = [...filteredProperties, ...freeProperties];

      // Apply sorting if needed
      if (sortBy) {
        let sortedProperties = [...combinedProperties];

        switch (sortBy) {
          case "price_low":
            sortedProperties.sort(
              (a, b) => parseInt(a.price) - parseInt(b.price),
            );
            break;
          case "price_high":
            sortedProperties.sort(
              (a, b) => parseInt(b.price) - parseInt(a.price),
            );
            break;
          case "area_low":
            sortedProperties.sort(
              (a, b) => parseInt(a.area) - parseInt(b.area),
            );
            break;
          case "area_high":
            sortedProperties.sort(
              (a, b) => parseInt(b.area) - parseInt(b.area),
            );
            break;
          case "newest":
          default:
            // Newest first (by createdAt date)
            sortedProperties.sort((a, b) => {
              const dateA = new Date(a.createdAt || 0);
              const dateB = new Date(b.createdAt || 0);
              return dateB.getTime() - dateA.getTime();
            });
            break;
        }

        // Apply pagination
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;

        const paginatedProperties = sortedProperties.slice(
          startIndex,
          endIndex,
        );

        // Return paginated results with total count
        return res.json({
          properties: paginatedProperties,
          total: sortedProperties.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(sortedProperties.length / limitNum),
        });
      }

      // If no sorting is specified, just apply pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedProperties = combinedProperties.slice(
        startIndex,
        endIndex,
      );

      // Return paginated results
      res.json({
        properties: paginatedProperties,
        total: combinedProperties.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(combinedProperties.length / limitNum),
      });
    }),
  );

  // Get properties by type
  app.get(
    "/api/properties/type/:type",
    asyncHandler(async (req, res) => {
      try {
        // Get regular properties by type
        const properties = await storage.getPropertiesByType(req.params.type);

        // Check if user is admin
        const isAdmin = req.user && req.user.role === "admin";

        // If not admin, only return approved properties
        const filteredProperties = isAdmin
          ? properties
          : properties.filter(
              (property) => property.approvalStatus === "approved",
            );
            
        // Get free properties by type
        const freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE LOWER(property_type) = LOWER($1)
          AND approval_status = 'approved'
          ORDER BY created_at DESC
        `;
        
        const result = await pool.query(freePropertiesQuery, [req.params.type]);
        
        // Map the free properties to match the expected format
        const freeProperties = result.rows.map(prop => ({
          id: prop.id,
          title: prop.title || "Untitled Property",
          description: prop.description || "",
          price: parseFloat(prop.price) || 0,
          discountedPrice: null,
          propertyType: prop.property_type || "",
          propertyCategory: prop.property_category || "",
          transactionType: prop.transaction_type || "",
          isUrgentSale: prop.is_urgent_sale || false,
          location: prop.location || "",
          city: prop.city || "",
          address: prop.address || "",
          subscriptionLevel: "free",
          imageUrls: prop.image_urls || [],
          rentOrSale: prop.rent_or_sale || "sale",
          status: "active",
          approvalStatus: "approved",
          createdAt: prop.created_at,
          updatedAt: prop.updated_at || prop.created_at,
          bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
          bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
          area: parseFloat(prop.area) || 0,
          areaUnit: prop.area_unit || "sqft",
          contactName: prop.contact_name || "",
          contactPhone: prop.contact_phone || "",
          contactEmail: prop.contact_email || "",
          isFreeProperty: true, // Flag to identify this is from free_properties table
          amenities: prop.amenities || []
        }));
        
        // Combine regular and free properties
        const combinedProperties = [...filteredProperties, ...freeProperties];
        
        // Sort by creation date (newest first)
        combinedProperties.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        res.json(combinedProperties);
      } catch (error) {
        console.error("Error fetching properties by type:", error);
        res.status(500).json({ message: "Failed to fetch properties by type" });
      }
    }),
  );

  // Get properties by status
  app.get(
    "/api/properties/status/:status",
    asyncHandler(async (req, res) => {
      const properties = await storage.getPropertiesByStatus(req.params.status);

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );

      res.json(filteredProperties);
    }),
  );
  
  // Get urgent sales properties (limited-time deals)
  app.get(
    "/api/properties/urgent",
    asyncHandler(async (req, res) => {
      try {
        console.log("Fetching urgent sales properties");
        
        // Get properties marked as urgent sale from both tables
        const regularPropertiesQuery = `
          SELECT * FROM properties 
          WHERE is_urgent_sale = true AND approval_status = 'approved'
          ORDER BY created_at DESC
        `;
        
        const freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE is_urgent_sale = true AND approval_status = 'approved'
          ORDER BY created_at DESC
        `;
        
        // Execute both queries
        const [regularResult, freeResult] = await Promise.all([
          pool.query(regularPropertiesQuery),
          pool.query(freePropertiesQuery)
        ]);
        
        console.log(`Found ${regularResult.rowCount} regular urgent properties and ${freeResult.rowCount} free urgent properties`);
        
        // Process regular properties
        const regularProperties = regularResult.rows.map(prop => {
          // Calculate discounted price (15-25% off)
          const discountPercent = Math.floor(Math.random() * 11) + 15; // Random between 15-25%
          const originalPrice = parseFloat(prop.price) || 0;
          const discountedPrice = Math.round(originalPrice * (1 - discountPercent/100));
          
          // Calculate expiry date (1-5 days from now)
          const daysToExpire = Math.floor(Math.random() * 5) + 1;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + daysToExpire);
          
          return {
            id: prop.id,
            title: prop.title,
            location: `${prop.location}, ${prop.city}`,
            price: originalPrice,
            discountedPrice: discountedPrice,
            discountPercentage: discountPercent,
            propertyType: prop.property_type,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            area: prop.area,
            imageUrl: Array.isArray(prop.image_urls) && prop.image_urls.length > 0 
              ? prop.image_urls[0] 
              : '/placeholder-property.jpg',
            expiresAt: expiresAt
          };
        });
        
        // Process free properties
        const freeProperties = freeResult.rows.map(prop => {
          // Calculate discounted price (15-25% off)
          const discountPercent = Math.floor(Math.random() * 11) + 15; // Random between 15-25%
          const originalPrice = parseFloat(prop.price) || 0;
          const discountedPrice = Math.round(originalPrice * (1 - discountPercent/100));
          
          // Calculate expiry date (1-5 days from now)
          const daysToExpire = Math.floor(Math.random() * 5) + 1;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + daysToExpire);
          
          // Get the first image URL if available
          let imageUrl = '/placeholder-property.jpg';
          if (prop.image_urls && Array.isArray(prop.image_urls) && prop.image_urls.length > 0) {
            imageUrl = prop.image_urls[0];
          }
          
          return {
            id: prop.id,
            title: prop.title,
            location: `${prop.location}, ${prop.city}`,
            price: originalPrice,
            discountedPrice: discountedPrice,
            discountPercentage: discountPercent,
            propertyType: prop.property_type,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            area: prop.area,
            imageUrl: imageUrl,
            expiresAt: expiresAt
          };
        });
        
        // Combine and return all urgent properties
        const urgentProperties = [...regularProperties, ...freeProperties];
        res.json(urgentProperties);
        
      } catch (error) {
        console.error("Error fetching urgent properties:", error);
        res.status(500).json({ message: "Failed to fetch urgent properties" });
      }
    }),
  );

  // Get properties by rent or sale
  // Get properties by category (rent/sale)
  app.get(
    "/api/properties/category/:rentOrSale",
    asyncHandler(async (req, res) => {
      const properties = await storage.getPropertiesByRentOrSale(
        req.params.rentOrSale,
      );

      // Check if user is admin
      const isAdmin = req.user && req.user.role === "admin";

      // If not admin, only return approved properties
      const filteredProperties = isAdmin
        ? properties
        : properties.filter(
            (property) => property.approvalStatus === "approved",
          );

      res.json(filteredProperties);
    }),
  );

  // Get properties pending approval (admin only)
  app.get(
    "/api/properties/pending",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(async (req, res) => {
      try {
        // Get properties from main table
        const properties = await storage.getAllProperties();
        const pendingProperties = properties.filter(
          (property) => property.approvalStatus === "pending",
        );
        
        // Get free properties pending approval from the free_properties table
        const query = `
          SELECT * FROM free_properties 
          WHERE approval_status = 'pending'
        `;
        
        const freePropertiesResult = await pool.query(query);
        const freePendingProperties = freePropertiesResult.rows.map(prop => {
          // Convert types to match the expected Property interface
          const price = typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price;
          const area = typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area;
          
          // Transform from snake_case DB columns to camelCase for frontend
          return {
            id: prop.id,
            title: prop.title || "Untitled Property",
            description: prop.description || "",
            price: price || 0,
            discountedPrice: null,
            propertyType: prop.property_type || "",
            propertyCategory: prop.property_category || "",
            transactionType: prop.transaction_type || "",
            isUrgentSale: prop.is_urgent_sale || false,
            location: prop.location || "",
            city: prop.city || "",
            address: prop.address || "",
            subscriptionLevel: "free",
            imageUrls: prop.image_urls || [],
            rentOrSale: prop.rent_or_sale || "sale",
            status: "active",
            approvalStatus: "pending", // These are all pending properties
            createdAt: prop.created_at,
            bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
            bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
            area: area || 0,
            areaUnit: prop.area_unit || "sqft",
            contactName: prop.contact_name || "",
            contactPhone: prop.contact_phone || "",
            contactEmail: prop.contact_email || "",
            isFreeProperty: true, // Flag to identify this is from free_properties table
            amenities: prop.amenities || []
          };
        });
        
        // Combine both arrays of pending properties
        const allPendingProperties = [...pendingProperties, ...freePendingProperties];
        
        // Sort by creation date, newest first
        allPendingProperties.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        res.json(allPendingProperties);
      } catch (error) {
        console.error("Error fetching pending properties:", error);
        res.status(500).json({ message: "Failed to fetch pending properties" });
      }
    }),
  );

  // Get all properties with approval status (admin only)
  app.get(
    "/api/properties/all",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(async (req, res) => {
      try {
        // Get regular properties
        const properties = await storage.getAllProperties();
        
        // Get free properties
        const freePropertiesQuery = `SELECT * FROM free_properties`;
        const freePropertiesResult = await pool.query(freePropertiesQuery);
        
        // Convert free properties to match Property interface
        const freeProperties = freePropertiesResult.rows.map(prop => {
          // Convert types to match the expected Property interface
          const price = typeof prop.price === 'string' ? parseFloat(prop.price) : prop.price;
          const area = typeof prop.area === 'string' ? parseFloat(prop.area) : prop.area;
          
          return {
            id: prop.id,
            title: prop.title || "Untitled Property",
            description: prop.description || "",
            price: price || 0,
            discountedPrice: null,
            propertyType: prop.property_type || "",
            propertyCategory: prop.property_category || "",
            transactionType: prop.transaction_type || "",
            isUrgentSale: prop.is_urgent_sale || false,
            location: prop.location || "",
            city: prop.city || "",
            address: prop.address || "",
            subscriptionLevel: "free",
            imageUrls: prop.image_urls || [],
            rentOrSale: prop.rent_or_sale || "sale",
            status: "active",
            approvalStatus: prop.approval_status || "pending",
            createdAt: prop.created_at,
            bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
            bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
            area: area || 0,
            areaUnit: prop.area_unit || "sqft",
            contactName: prop.contact_name || "",
            contactPhone: prop.contact_phone || "",
            contactEmail: prop.contact_email || "",
            isFreeProperty: true, // Flag to identify this is from free_properties table
            amenities: prop.amenities || []
          };
        });
        
        // Combine and sort by creation date (newest first)
        const allProperties = [...properties, ...freeProperties].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        res.json(allProperties);
      } catch (error) {
        console.error("Error fetching all properties:", error);
        res.status(500).json({ message: "Failed to fetch all properties" });
      }
    }),
  );

  // This free properties endpoint has been replaced by a more efficient one earlier
  // that directly queries the free_properties table

  // Get property by ID - must be after the more specific routes
  app.get(
    "/api/properties/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      // First try to get from regular properties
      const property = await storage.getProperty(id);
      
      if (property) {
        // If user is logged in, track the view for recommendations
        if (req.isAuthenticated()) {
          await storage.addPropertyView(req.user.id, id);
        }
        
        return res.json(property);
      }
      
      // If not found in regular properties, check free_properties table
      try {
        const freePropertyQuery = `SELECT * FROM free_properties WHERE id = $1`;
        const result = await pool.query(freePropertyQuery, [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: "Property not found" });
        }
        
        const freeProperty = result.rows[0];
        
        // Check if the property is approved or if the user is the owner or admin
        const isApproved = freeProperty.approval_status === 'approved';
        const isOwner = req.isAuthenticated() && req.user.email === freeProperty.contact_email;
        const isAdmin = req.isAuthenticated() && req.user.role === 'admin';
        
        if (!isApproved && !isOwner && !isAdmin) {
          return res.status(403).json({ 
            message: "This property is pending approval and can only be viewed by the owner or admin" 
          });
        }
        
        // Map the free property to match the Property interface
        const mappedProperty = {
          id: freeProperty.id,
          title: freeProperty.title || "Untitled Property",
          description: freeProperty.description || "",
          price: parseFloat(freeProperty.price) || 0,
          discountedPrice: null,
          propertyType: freeProperty.property_type || "",
          propertyCategory: freeProperty.property_category || "",
          transactionType: freeProperty.transaction_type || "",
          isUrgentSale: freeProperty.is_urgent_sale || false,
          location: freeProperty.location || "",
          city: freeProperty.city || "",
          address: freeProperty.address || "",
          subscriptionLevel: "free",
          imageUrls: freeProperty.image_urls || [],
          videoUrls: freeProperty.video_urls || [],
          rentOrSale: freeProperty.rent_or_sale || "sale",
          status: "active",
          approvalStatus: freeProperty.approval_status || "pending",
          createdAt: freeProperty.created_at,
          updatedAt: freeProperty.updated_at || freeProperty.created_at,
          bedrooms: freeProperty.bedrooms ? parseInt(freeProperty.bedrooms) : null,
          bathrooms: freeProperty.bathrooms ? parseInt(freeProperty.bathrooms) : null,
          area: parseFloat(freeProperty.area) || 0,
          areaUnit: freeProperty.area_unit || "sqft",
          contactName: freeProperty.contact_name || "",
          contactPhone: freeProperty.contact_phone || "",
          contactEmail: freeProperty.contact_email || "",
          isFreeProperty: true,
          amenities: freeProperty.amenities || [],
          userId: -1, // Free properties don't have a user ID
          balconies: freeProperty.balconies ? parseInt(freeProperty.balconies) : null,
          floorNo: freeProperty.floor_no ? parseInt(freeProperty.floor_no) : null,
          totalFloors: freeProperty.total_floors ? parseInt(freeProperty.total_floors) : null,
          furnishedStatus: freeProperty.furnished_status || null,
          facingDirection: freeProperty.facing_direction || null,
          constructionAge: freeProperty.construction_age || null,
          pincode: freeProperty.pincode || null,
          whatsappEnabled: freeProperty.whatsapp_enabled || false
        };
        
        // If user is logged in, track the view for recommendations
        if (req.isAuthenticated()) {
          try {
            await storage.addPropertyView(req.user.id, id);
          } catch (error) {
            console.error("Error tracking property view:", error);
            // Continue even if tracking fails
          }
        }
        
        return res.json(mappedProperty);
      } catch (error) {
        console.error("Error fetching free property:", error);
        return res.status(500).json({ message: "Error fetching property details" });
      }
    }),
  );

  // Upload property images

  app.post(
    "/api/upload/property-images",
    isAuthenticated, // Added authentication middleware
    upload.array("files", 25),
    asyncHandler(async (req, res) => {
      try {
        console.log("Property image upload request received:", {
          files: req.files ? (Array.isArray(req.files) ? req.files.length : 'Not an array') : 'No files'
        });
        
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
          return res.status(400).json({ message: "No files uploaded" });
        }
  
        // Upload files to S3
        const uploadPromises = (req.files as Express.Multer.File[]).map(file => 
          uploadToS3(file, `properties/user-${req.user.id}`) // Include user ID in S3 path
        );
  
        const s3Keys = await Promise.all(uploadPromises);
        
        console.log("Files successfully uploaded to S3:", s3Keys);
  
        res.status(201).json({
          success: true,
          message: "Files uploaded successfully",
          files: s3Keys
        });
      } catch (error) {
        console.error("Error uploading files to S3:", error);
        res.status(500).json({ 
          message: "File upload failed", 
          error: error.message 
        });
      }
    })
  );

  app.get('/api/images/signed-url', asyncHandler(async (req, res) => {
    const { key } = req.query;
    
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ message: 'Image key is required' });
    }
  
    try {
      const signedUrl = await getSignedImageUrl(key);
      res.json({ url: signedUrl });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      res.status(500).json({ message: 'Failed to generate image URL' });
    }
  }));

  // app.post(
  //   "/api/upload/property-images",
  //   upload.array("files", 25),
  //   asyncHandler(async (req, res) => {
  //     try {
  //       console.log("Property image upload request received:", {
  //         files: req.files ? (Array.isArray(req.files) ? req.files.length : 'Not an array') : 'No files'
  //       });
        
  //       if (
  //         !req.files ||
  //         (Array.isArray(req.files) && req.files.length === 0)
  //       ) {
  //         return res.status(400).json({ message: "No files uploaded" });
  //       }

  //       // Generate URLs for the uploaded files
  //       let fileUrls = [];
  //       try {
  //         if (Array.isArray(req.files)) {
  //           fileUrls = req.files.map((file) => {
  //             const userId = req.user?.id || 'guest';
  //             // Use fs-extra's ensureDirSync instead of existsSync/mkdirSync
  //             const userDir = `user-${userId}`;
  //             const userDirPath = path.join(process.cwd(), 'uploads', userDir);
  //             fs.ensureDirSync(userDirPath);
              
  //             // Create the URL directly
  //             const relativePath = `/uploads/${userDir}/${file.filename}`;
  //             console.log(`Generated file URL: ${relativePath}`);
  //             return relativePath;
  //           });
  //         } else if (req.files && typeof req.files === 'object') {
  //           // Handle case where req.files is an object with file arrays
  //           Object.keys(req.files).forEach(key => {
  //             const filesArray = req.files[key];
  //             if (Array.isArray(filesArray)) {
  //               filesArray.forEach(file => {
  //                 const userId = req.user?.id || 'guest';
  //                 // Use fs-extra's ensureDirSync instead of existsSync/mkdirSync
  //                 const userDir = `user-${userId}`;
  //                 const userDirPath = path.join(process.cwd(), 'uploads', userDir);
  //                 fs.ensureDirSync(userDirPath);
                  
  //                 // Create the URL directly
  //                 const relativePath = `/uploads/${userDir}/${file.filename}`;
  //                 console.log(`Generated file URL: ${relativePath}`);
  //                 fileUrls.push(relativePath);
  //               });
  //             }
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error generating file URLs:", error);
  //         throw error;
  //       }

  //       console.log("Generated file URLs:", fileUrls);

  //       res.status(201).json({
  //         success: true,
  //         message: "Files uploaded successfully",
  //         files: fileUrls,
  //       });
  //     } catch (error) {
  //       console.error("Error uploading files:", error);
  //       res
  //         .status(500)
  //         .json({ message: "File upload failed", error: error.message });
  //     }
  //   }),
  // );

  // Create a property
  app.post(
    "/api/properties",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        console.log(
          "Property submission body:",
          JSON.stringify(req.body, null, 2),
        );

        // Check if property has discounted price (urgency sale) but user is not premium
        if (
          req.body.discountedPrice &&
          req.user.subscriptionLevel !== "premium"
        ) {
          return res.status(403).json({
            message:
              "Only premium users can create urgency sale listings with discounted prices",
            code: "PREMIUM_REQUIRED",
          });
        }

        // Check if expiresAt is set (urgency sale) but user is not premium
        if (req.body.expiresAt && req.user.subscriptionLevel !== "premium") {
          return res.status(403).json({
            message:
              "Only premium users can create urgency sale listings with expiration dates",
            code: "PREMIUM_REQUIRED",
          });
        }

        // Prepare property data with proper formatting for database
        const propertyDataToInsert = {
          ...req.body,
          userId: req.user.id,
        };

        // Ensure arrays are properly formatted
        if (!Array.isArray(propertyDataToInsert.amenities)) {
          propertyDataToInsert.amenities = [];
        }

        if (!Array.isArray(propertyDataToInsert.imageUrls)) {
          propertyDataToInsert.imageUrls = [];
        }
        
        // Validate S3 image URLs
        try {
          const { validateAndFilterImageKeys } = await import('./s3-utils');
          console.log("Raw image keys:", propertyDataToInsert.imageUrls);
          
          // Only validate S3 keys (not placeholder images)
          const s3Keys = propertyDataToInsert.imageUrls.filter(url => 
            url && typeof url === 'string' && url.includes('/') && !url.startsWith('/images/')
          );
          
          if (s3Keys.length > 0) {
            // Validate and filter S3 keys
            const validatedKeys = await validateAndFilterImageKeys(s3Keys);
            console.log("Cleaned valid image keys:", validatedKeys);
            
            // Replace the original S3 keys with validated ones
            propertyDataToInsert.imageUrls = propertyDataToInsert.imageUrls.filter(url => 
              !s3Keys.includes(url)
            );
            propertyDataToInsert.imageUrls.push(...validatedKeys);
          }
          
          // If we lost all images in validation, use placeholder
          if (propertyDataToInsert.imageUrls.length === 0) {
            const placeholderImage = '/images/property-placeholder.jpg';
            propertyDataToInsert.imageUrls.push(placeholderImage);
            console.log("Added placeholder image after validation found no valid images");
          }
        } catch (validationError) {
          console.error("Error validating S3 image keys:", validationError);
          // Continue with the unvalidated keys if validation fails
        }

        if (!Array.isArray(propertyDataToInsert.videoUrls)) {
          propertyDataToInsert.videoUrls = [];
        }

        // If expiresAt is present as a string or Date object, convert it properly
        if (propertyDataToInsert.expiresAt) {
          if (typeof propertyDataToInsert.expiresAt === "string") {
            propertyDataToInsert.expiresAt = new Date(
              propertyDataToInsert.expiresAt,
            );
          } else if (typeof propertyDataToInsert.expiresAt === "object") {
            // Already a Date object, keep it
          } else {
            // Invalid format, set to null
            propertyDataToInsert.expiresAt = null;
          }
        } else {
          propertyDataToInsert.expiresAt = null;
        }

        // Ensure numeric fields are properly converted
        if (typeof propertyDataToInsert.price === "string") {
          propertyDataToInsert.price =
            parseInt(propertyDataToInsert.price) || 0;
        }

        if (typeof propertyDataToInsert.area === "string") {
          propertyDataToInsert.area = parseInt(propertyDataToInsert.area) || 0;
        }

        if (
          propertyDataToInsert.discountedPrice !== null &&
          typeof propertyDataToInsert.discountedPrice === "string"
        ) {
          propertyDataToInsert.discountedPrice =
            parseInt(propertyDataToInsert.discountedPrice) || null;
        }

        // Ensure required fields are present
        if (!propertyDataToInsert.rentOrSale) {
          // Check if forSaleOrRent exists and use it instead
          if (propertyDataToInsert.forSaleOrRent) {
            propertyDataToInsert.rentOrSale =
              propertyDataToInsert.forSaleOrRent.toLowerCase();
          } else {
            // Default to "sale" if no value is provided
            propertyDataToInsert.rentOrSale = "sale";
          }
        }

        console.log(
          "Property data to parse:",
          JSON.stringify(propertyDataToInsert, null, 2),
        );

        try {
          const propertyData = insertPropertySchema.parse(propertyDataToInsert);
          console.log(
            "Property data after parse:",
            JSON.stringify(propertyData, null, 2),
          );
  
          const property = await storage.createProperty(propertyData);
          
          // Send notification email to admin
          try {
            // Import email service directly
            const { sendEmail } = await import('./email-service');
            
            // Safely extract property data with fallbacks
            const propertyTitle = propertyData.title || 'Untitled Property';
            const propertyLocation = propertyData.location || 'Unknown location';
            const propertyCity = propertyData.city || '';
            const propertyType = propertyData.propertyType || 'Unknown type';
            const propertyPrice = propertyData.price ? `₹${propertyData.price}` : 'Price not specified';
            
            // Use properties that actually exist in the data
            const contactName = propertyData.contactName || req.body.contactName || 'Unknown';
            const contactEmail = propertyData.contactEmail || req.body.contactEmail || 'No email provided';
            
            await sendEmail(
              "urgentsale.in@gmail.com", 
              "New Property Submission Requires Verification", 
              `
              <h1>New Property Submission</h1>
              <p>A new property has been submitted and requires your verification:</p>
              <ul>
                <li><strong>Title:</strong> ${propertyTitle}</li>
                <li><strong>Location:</strong> ${propertyLocation}, ${propertyCity}</li>
                <li><strong>Type:</strong> ${propertyType}</li>
                <li><strong>Price:</strong> ${propertyPrice}</li>
                <li><strong>Contact:</strong> ${contactName} (${contactEmail})</li>
              </ul>
              <p>Please log in to the admin panel to review and approve this property.</p>
              `
            );
            console.log("Admin notification email sent successfully");
          } catch (emailError) {
            console.error("Failed to send admin notification email:", emailError);
            // Continue with response - don't fail the submission if email fails
          }
          
          // Successful response
          res.status(201).json(property);
        } catch (schemaError) {
          console.error("Error parsing property data:", schemaError);
          res.status(400).json({
            message: "Invalid property data",
            error: schemaError instanceof Error ? schemaError.message : "Validation error"
          });
        }
      } catch (error) {
        console.error("Error creating property:", error);
        // Provide more detailed error message to the client
        if (error instanceof Error) {
          res.status(500).json({
            message: "Failed to create property",
            error: error.message,
            stack:
              process.env.NODE_ENV === "development" ? error.stack : undefined,
          });
        } else {
          res.status(500).json({ message: "Unknown error occurred" });
        }
      }
    }),
  );

  // Update a property
  app.patch(
    "/api/properties/:id",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      // First, try to get from regular properties
      const property = await storage.getProperty(id);
      
      if (property) {
        // Check if user owns this property or is an agent/admin
        if (
          property.userId !== req.user.id &&
          req.user.role !== "agent" &&
          req.user.role !== "admin" &&
          req.user.role !== "company_admin"
        ) {
          return res
            .status(403)
            .json({
              message: "You don't have permission to update this property",
            });
        }

        // Check if trying to add discounted price (urgency sale) but user is not premium
        if (
          req.body.discountedPrice &&
          !property.discountedPrice &&
          req.user.subscriptionLevel !== "premium"
        ) {
          return res.status(403).json({
            message: "Only premium users can add urgency sale discounts",
            code: "PREMIUM_REQUIRED",
          });
        }

        // Check if trying to add expiration date (urgency sale) but user is not premium
        if (
          req.body.expiresAt &&
          !property.expiresAt &&
          req.user.subscriptionLevel !== "premium"
        ) {
          return res.status(403).json({
            message: "Only premium users can add urgency sale expiration dates",
            code: "PREMIUM_REQUIRED",
          });
        }

        const updatedProperty = await storage.updateProperty(id, req.body);
        return res.json(updatedProperty);
      }
      
      // If not found in regular properties, check free_properties table
      const checkQuery = `SELECT * FROM free_properties WHERE id = $1`;
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const freeProperty = checkResult.rows[0];
      
      // Check if user has permission to update this free property
      // For free properties, we check if the contact email matches the user's email
      if (
        freeProperty.contact_email !== req.user.email &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You don't have permission to update this property",
        });
      }
      
      // Prepare update fields
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;
      
      // Map fields from req.body to database column names
      const fieldMappings: Record<string, string> = {
        title: 'title',
        description: 'description',
        price: 'price',
        propertyType: 'property_type',
        propertyCategory: 'property_category',
        transactionType: 'transaction_type',
        isUrgentSale: 'is_urgent_sale',
        location: 'location',
        city: 'city',
        address: 'address',
        pincode: 'pincode',
        bedrooms: 'bedrooms',
        bathrooms: 'bathrooms',
        balconies: 'balconies',
        floorNo: 'floor_no',
        totalFloors: 'total_floors',
        furnishedStatus: 'furnished_status',
        area: 'area',
        areaUnit: 'area_unit',
        facingDirection: 'facing_direction',
        constructionAge: 'construction_age',
        contactName: 'contact_name',
        contactPhone: 'contact_phone',
        contactEmail: 'contact_email',
        whatsappEnabled: 'whatsapp_enabled',
        imageUrls: 'image_urls',
        videoUrls: 'video_urls',
        amenities: 'amenities',
        rentOrSale: 'rent_or_sale'
      };
      
      // Build the update query dynamically
      for (const [key, value] of Object.entries(req.body)) {
        if (key in fieldMappings && value !== undefined) {
          updateFields.push(`${fieldMappings[key]} = $${paramIndex}`);
          updateValues.push(value);
          paramIndex++;
        }
      }
      
      // Add updated_at field
      updateFields.push(`updated_at = $${paramIndex}`);
      updateValues.push(new Date());
      
      // If no fields to update, return the original property
      if (updateFields.length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      // Build and execute the update query
      const updateQuery = `
        UPDATE free_properties
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex + 1}
        RETURNING *
      `;
      
      updateValues.push(id);
      
      try {
        const updateResult = await pool.query(updateQuery, updateValues);
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ message: "Property not found or update failed" });
        }
        
        const updatedFreeProperty = updateResult.rows[0];
        
        // Map the updated free property to match the Property interface
        const mappedProperty = {
          id: updatedFreeProperty.id,
          title: updatedFreeProperty.title || "Untitled Property",
          description: updatedFreeProperty.description || "",
          price: parseFloat(updatedFreeProperty.price) || 0,
          discountedPrice: null,
          propertyType: updatedFreeProperty.property_type || "",
          propertyCategory: updatedFreeProperty.property_category || "",
          transactionType: updatedFreeProperty.transaction_type || "",
          isUrgentSale: updatedFreeProperty.is_urgent_sale || false,
          location: updatedFreeProperty.location || "",
          city: updatedFreeProperty.city || "",
          address: updatedFreeProperty.address || "",
          subscriptionLevel: "free",
          imageUrls: updatedFreeProperty.image_urls || [],
          videoUrls: updatedFreeProperty.video_urls || [],
          rentOrSale: updatedFreeProperty.rent_or_sale || "sale",
          status: "active",
          approvalStatus: updatedFreeProperty.approval_status || "pending",
          createdAt: updatedFreeProperty.created_at,
          updatedAt: updatedFreeProperty.updated_at,
          bedrooms: updatedFreeProperty.bedrooms ? parseInt(updatedFreeProperty.bedrooms) : null,
          bathrooms: updatedFreeProperty.bathrooms ? parseInt(updatedFreeProperty.bathrooms) : null,
          area: parseFloat(updatedFreeProperty.area) || 0,
          areaUnit: updatedFreeProperty.area_unit || "sqft",
          contactName: updatedFreeProperty.contact_name || "",
          contactPhone: updatedFreeProperty.contact_phone || "",
          contactEmail: updatedFreeProperty.contact_email || "",
          isFreeProperty: true,
          amenities: updatedFreeProperty.amenities || [],
          userId: -1, // Free properties don't have a user ID
          balconies: updatedFreeProperty.balconies ? parseInt(updatedFreeProperty.balconies) : null,
          floorNo: updatedFreeProperty.floor_no ? parseInt(updatedFreeProperty.floor_no) : null,
          totalFloors: updatedFreeProperty.total_floors ? parseInt(updatedFreeProperty.total_floors) : null,
          furnishedStatus: updatedFreeProperty.furnished_status || null,
          facingDirection: updatedFreeProperty.facing_direction || null,
          constructionAge: updatedFreeProperty.construction_age || null,
          pincode: updatedFreeProperty.pincode || null,
          whatsappEnabled: updatedFreeProperty.whatsapp_enabled || false
        };
        
        return res.json(mappedProperty);
      } catch (error) {
        console.error("Error updating free property:", error);
        return res.status(500).json({ message: "Failed to update property" });
      }
    }),
  );

  // Delete a property
  app.delete(
    "/api/properties/:id",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      // First, try to get from regular properties
      const property = await storage.getProperty(id);
      
      if (property) {
        // Check if user owns this property or is an admin
        if (
          property.userId !== req.user.id &&
          req.user.role !== "admin" &&
          req.user.role !== "company_admin"
        ) {
          return res
            .status(403)
            .json({
              message: "You don't have permission to delete this property",
            });
        }

        // Delete the property
        const success = await storage.deleteProperty(id);
        if (!success) {
          return res.status(500).json({ message: "Error deleting property" });
        }

        // Also delete property images from uploads if they exist
        if (property.imageUrls && property.imageUrls.length > 0) {
          for (const imageUrl of property.imageUrls) {
            try {
              await deleteFile(imageUrl);
            } catch (error) {
              console.error(`Error deleting file ${imageUrl}:`, error);
              // Continue with deletion even if image deletion fails
            }
          }
        }

        return res.json({
          success: true,
          message: "Property deleted successfully",
        });
      }
      
      // If not found in regular properties, check free_properties table
      const checkQuery = `SELECT * FROM free_properties WHERE id = $1`;
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const freeProperty = checkResult.rows[0];
      
      // Check if user has permission to delete this free property
      // For free properties, we check if the contact email matches the user's email
      if (
        freeProperty.contact_email !== req.user.email &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "You don't have permission to delete this property",
        });
      }
      
      // Delete the free property
      const deleteQuery = `DELETE FROM free_properties WHERE id = $1 RETURNING *`;
      const deleteResult = await pool.query(deleteQuery, [id]);
      
      if (deleteResult.rows.length === 0) {
        return res.status(500).json({ message: "Error deleting property" });
      }
      
      // Also delete property images from uploads if they exist
      if (freeProperty.image_urls && freeProperty.image_urls.length > 0) {
        for (const imageUrl of freeProperty.image_urls) {
          try {
            await deleteFile(imageUrl);
          } catch (error) {
            console.error(`Error deleting file ${imageUrl}:`, error);
            // Continue with deletion even if image deletion fails
          }
        }
      }

      return res.json({
        success: true,
        message: "Property deleted successfully"
      });
    }),
  );

  // Delete a free property
  app.delete(
    "/api/properties/free/:id",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid property ID" });
        }
        
        // First, get the free property to check ownership
        const query = `
          SELECT * FROM free_properties 
          WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: "Free property not found" });
        }
        
        const property = result.rows[0];
        
        // Check if user is the owner (by email or phone) or an admin
        const isOwner = 
          (req.user.email && property.contact_email && 
           req.user.email.toLowerCase().trim() === property.contact_email.toLowerCase().trim()) ||
          (req.user.phone && property.contact_phone && 
           (req.user.phone.includes(property.contact_phone) || 
           property.contact_phone.includes(req.user.phone)));
        
        if (!isOwner && req.user.role !== "admin") {
          return res.status(403).json({
            message: "You don't have permission to delete this property"
          });
        }
        
        // Delete the property
        const deleteQuery = `
          DELETE FROM free_properties 
          WHERE id = $1
          RETURNING *
        `;
        
        const deleteResult = await pool.query(deleteQuery, [id]);
        
        if (deleteResult.rowCount === 0) {
          return res.status(500).json({ message: "Error deleting property" });
        }
        
        // Also delete property images from uploads if they exist
        if (property.image_urls && property.image_urls.length > 0) {
          for (const imageUrl of property.image_urls) {
            try {
              await deleteFile(imageUrl);
            } catch (error) {
              console.error(`Error deleting file ${imageUrl}:`, error);
              // Continue with deletion even if image deletion fails
            }
          }
        }
        
        return res.json({
          success: true,
          message: "Free property deleted successfully"
        });
      } catch (error) {
        console.error("Error deleting free property:", error);
        return res.status(500).json({ 
          message: "Error deleting free property",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }),
  );

  // Get current user's properties (both regular and free properties)
  app.get(
    "/api/user/properties",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        console.log(`Fetching properties for user ID: ${req.user.id}, email: ${req.user.email}, phone: ${req.user.phone || 'not provided'}`);
        
        // Get regular properties from storage
        const properties = await storage.getPropertiesByUser(req.user.id);
        console.log(`Found ${properties.length} regular properties for user`);
        
        // Get free properties from free_properties table with more flexible matching
        // We'll use ILIKE for case-insensitive matching and trim spaces
        const freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE 
            (TRIM(LOWER(contact_email)) = TRIM(LOWER($1))
            OR contact_phone = $2
            OR contact_phone LIKE '%' || $3 || '%'
            OR $4 LIKE '%' || contact_phone || '%')
          ORDER BY created_at DESC
        `;
        
        // Get user email and phone for matching
        const userEmail = req.user.email || '';
        const userPhone = req.user.phone || '';
        // Get last 10 digits of phone for partial matching
        const userPhoneLast10 = userPhone.replace(/\D/g, '').slice(-10);
        
        console.log(`Searching for free properties with email: ${userEmail}, phone: ${userPhone}, phoneLast10: ${userPhoneLast10}`);
        
        const freeResult = await pool.query(freePropertiesQuery, [
          userEmail, 
          userPhone,
          userPhoneLast10,
          userPhone
        ]);
        
        console.log(`Found ${freeResult.rowCount} free properties for user`);
        
        // If no free properties found with the above query, try a more lenient approach
        let freeProperties = [];
        if (freeResult.rowCount === 0) {
          console.log("No exact matches found, trying more lenient matching");
          
          // Try to match just the username part of the email (before the @)
          const emailUsername = userEmail.split('@')[0];
          if (emailUsername && emailUsername.length > 3) {
            const lenientQuery = `
              SELECT * FROM free_properties 
              WHERE 
                contact_email LIKE '%' || $1 || '%'
                OR contact_name LIKE '%' || $2 || '%'
              ORDER BY created_at DESC
            `;
            
            console.log(`Trying lenient match with email username: ${emailUsername}`);
            const lenientResult = await pool.query(lenientQuery, [emailUsername, req.user.name || '']);
            console.log(`Found ${lenientResult.rowCount} free properties with lenient matching`);
            
            // Map the free properties to match the expected format
            freeProperties = lenientResult.rows.map(prop => {
              console.log(`Mapping free property: ${prop.id}, ${prop.title}, email: ${prop.contact_email}`);
              return {
                id: prop.id,
                title: prop.title || "Untitled Property",
                description: prop.description || "",
                price: parseFloat(prop.price) || 0,
                discountedPrice: null,
                propertyType: prop.property_type || "",
                propertyCategory: prop.property_category || "",
                transactionType: prop.transaction_type || "",
                isUrgentSale: prop.is_urgent_sale || false,
                location: prop.location || "",
                city: prop.city || "",
                address: prop.address || "",
                subscriptionLevel: "free",
                imageUrls: prop.image_urls || [],
                rentOrSale: prop.rent_or_sale || "sale",
                status: "active",
                approvalStatus: prop.approval_status || "pending",
                createdAt: prop.created_at,
                updatedAt: prop.updated_at || prop.created_at,
                bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
                bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
                area: parseFloat(prop.area) || 0,
                areaUnit: prop.area_unit || "sqft",
                contactName: prop.contact_name || "",
                contactPhone: prop.contact_phone || "",
                contactEmail: prop.contact_email || "",
                isFreeProperty: true, // Flag to identify this is from free_properties table
                amenities: prop.amenities || []
              };
            });
          }
        } else {
          // Map the free properties to match the expected format
          freeProperties = freeResult.rows.map(prop => {
            console.log(`Mapping free property: ${prop.id}, ${prop.title}, email: ${prop.contact_email}`);
            return {
              id: prop.id,
              title: prop.title || "Untitled Property",
              description: prop.description || "",
              price: parseFloat(prop.price) || 0,
              discountedPrice: null,
              propertyType: prop.property_type || "",
              propertyCategory: prop.property_category || "",
              transactionType: prop.transaction_type || "",
              isUrgentSale: prop.is_urgent_sale || false,
              location: prop.location || "",
              city: prop.city || "",
              address: prop.address || "",
              subscriptionLevel: "free",
              imageUrls: prop.image_urls || [],
              rentOrSale: prop.rent_or_sale || "sale",
              status: "active",
              approvalStatus: prop.approval_status || "pending",
              createdAt: prop.created_at,
              updatedAt: prop.updated_at || prop.created_at,
              bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
              bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
              area: parseFloat(prop.area) || 0,
              areaUnit: prop.area_unit || "sqft",
              contactName: prop.contact_name || "",
              contactPhone: prop.contact_phone || "",
              contactEmail: prop.contact_email || "",
              isFreeProperty: true, // Flag to identify this is from free_properties table
              amenities: prop.amenities || []
            };
          });
        }
        
        // Combine and sort by creation date (newest first)
        const allProperties = [...properties, ...freeProperties].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        console.log(`Returning total of ${allProperties.length} properties (${properties.length} regular + ${freeProperties.length} free)`);
        res.json(allProperties);
      } catch (error) {
        console.error("Error fetching user properties:", error);
        res.status(500).json({ message: "Failed to fetch user properties" });
      }
    }),
  );

  // =========== Property Approval Routes ===========

  // Approve a property (admin only)
  app.post(
    "/api/properties/:id/approve",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid property ID" });
        }

        // Check if isFreeProperty flag is set (from the pending properties list)
        const isFreeProperty = req.body.isFreeProperty === true;

        if (isFreeProperty) {
          // This is a free property, use direct SQL to update it
          // Note: free_properties table does not have approved_by or approval_date columns
          const query = `
            UPDATE free_properties
            SET approval_status = 'approved',
                updated_at = $1
            WHERE id = $2
            RETURNING *;
          `;

          const result = await pool.query(query, [new Date(), id]);
          
          if (result.rows.length === 0) {
            return res.status(404).json({ message: "Free property not found" });
          }

          // Get the approved property data
          const approvedProperty = result.rows[0];
          
          // Send notification email to property owner
          try {
            const { sendEmail } = await import('./email-service');
            
            // Send email notification to the property contact
            if (approvedProperty.contact_email) {
              await sendEmail(
                approvedProperty.contact_email,
                "Your Property Listing Has Been Approved!",
                `
                <h1>Congratulations!</h1>
                <p>We're pleased to inform you that your property listing has been approved and is now live on our website.</p>
                <h2>Property Details:</h2>
                <ul>
                  <li><strong>Title:</strong> ${approvedProperty.title || 'Untitled Property'}</li>
                  <li><strong>Location:</strong> ${approvedProperty.location || 'Unknown location'}${approvedProperty.city ? ', ' + approvedProperty.city : ''}</li>
                  <li><strong>Price:</strong> ₹${approvedProperty.price ? parseFloat(approvedProperty.price).toLocaleString() : 'Not specified'}</li>
                </ul>
                <p>Your property is now visible to potential buyers and renters on our platform.</p>
                <p>Thank you for choosing our platform for your property listing needs!</p>
                `
              );
            }
          } catch (emailError) {
            console.error("Error sending approval notification email:", emailError);
            // Continue with the response even if email sending fails
          }
          
          return res.json({
            message: "Free property has been approved successfully",
            property: approvedProperty
          });
        } else {
          // This is a regular property from the main properties table
          const property = await storage.getProperty(id);
          if (!property) {
            return res.status(404).json({ message: "Property not found" });
          }

          if (property.approvalStatus === "approved") {
            return res
              .status(400)
              .json({ message: "Property is already approved" });
          }

          // Update property with approval information
          const updatedProperty = await storage.updateProperty(id, {
            approvalStatus: "approved",
            approvedBy: req.user.id,
            approvalDate: new Date(),
          });

          // Send notification email to property owner
          try {
            const { sendEmail } = await import('./email-service');
            
            // Get the user who posted this property
            const propertyOwner = await storage.getUser(property.userId);
            
            if (propertyOwner && propertyOwner.email) {
              await sendEmail(
                propertyOwner.email,
                "Your Property Listing Has Been Approved!",
                `
                <h1>Congratulations!</h1>
                <p>We're pleased to inform you that your property listing has been approved and is now live on our website.</p>
                <h2>Property Details:</h2>
                <ul>
                  <li><strong>Title:</strong> ${property.title || 'Untitled Property'}</li>
                  <li><strong>Location:</strong> ${property.location || 'Unknown location'}${property.city ? ', ' + property.city : ''}</li>
                  <li><strong>Price:</strong> ₹${property.price ? property.price.toLocaleString() : 'Not specified'}</li>
                </ul>
                <p>Your property is now visible to potential buyers and renters on our platform.</p>
                <p>Thank you for choosing our platform for your property listing needs!</p>
                `
              );
            }
          } catch (emailError) {
            console.error("Error sending approval notification email:", emailError);
            // Continue with the response even if email sending fails
          }

          return res.json({
            message: "Property has been approved successfully",
            property: updatedProperty,
          });
        }
      } catch (error) {
        console.error("Error approving property:", error);
        return res.status(500).json({ 
          message: "Failed to approve property", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }),
  );

  // Reject a property (admin only)
  app.post(
    "/api/properties/:id/reject",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid property ID" });
        }

        const { rejectionReason, isFreeProperty } = req.body;
        if (!rejectionReason || rejectionReason.trim() === "") {
          return res
            .status(400)
            .json({ message: "Rejection reason is required" });
        }

        if (isFreeProperty) {
          // This is a free property, use direct SQL to update it
          // Note: free_properties table does not have rejected_by or rejection_date columns
          // We'll store rejection reason in 'description' field and update approval_status
          const query = `
            UPDATE free_properties
            SET approval_status = 'rejected',
                description = CONCAT($1, ' - ', COALESCE(description, 'No description')),
                updated_at = $2
            WHERE id = $3
            RETURNING *;
          `;

          const result = await pool.query(query, [
            'Rejection reason: ' + rejectionReason,
            new Date(),
            id
          ]);
          
          if (result.rows.length === 0) {
            return res.status(404).json({ message: "Free property not found" });
          }

          // Get the rejected property data
          const rejectedProperty = result.rows[0];
          
          // Send notification email to property owner
          try {
            const { sendEmail } = await import('./email-service');
            
            // Send email notification to the property contact
            if (rejectedProperty.contact_email) {
              await sendEmail(
                rejectedProperty.contact_email,
                "Your Property Listing Was Not Approved",
                `
                <h1>Property Listing Not Approved</h1>
                <p>We regret to inform you that your property listing could not be approved at this time.</p>
                <h2>Property Details:</h2>
                <ul>
                  <li><strong>Title:</strong> ${rejectedProperty.title || 'Untitled Property'}</li>
                  <li><strong>Location:</strong> ${rejectedProperty.location || 'Unknown location'}${rejectedProperty.city ? ', ' + rejectedProperty.city : ''}</li>
                </ul>
                <h3>Reason for rejection:</h3>
                <p>${rejectionReason}</p>
                <p>You are welcome to submit a new listing addressing the issues mentioned above.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                `
              );
            }
          } catch (emailError) {
            console.error("Error sending rejection notification email:", emailError);
            // Continue with the response even if email sending fails
          }
          
          return res.json({
            message: "Free property has been rejected successfully",
            property: rejectedProperty
          });
        } else {
          // This is a regular property from the main properties table
          const property = await storage.getProperty(id);
          if (!property) {
            return res.status(404).json({ message: "Property not found" });
          }
        
          if (property.approvalStatus === "rejected") {
            return res
              .status(400)
              .json({ message: "Property is already rejected" });
          }
        
          // Update property with rejection information
          const updatedProperty = await storage.updateProperty(id, {
            approvalStatus: "rejected",
            approvedBy: req.user.id,
            rejectionReason: rejectionReason,
            approvalDate: new Date(),
          });

          // Send notification email to property owner
          try {
            const { sendEmail } = await import('./email-service');
            
            // Get the user who posted this property
            const propertyOwner = await storage.getUser(property.userId);
            
            if (propertyOwner && propertyOwner.email) {
              await sendEmail(
                propertyOwner.email,
                "Your Property Listing Was Not Approved",
                `
                <h1>Property Listing Not Approved</h1>
                <p>We regret to inform you that your property listing could not be approved at this time.</p>
                <h2>Property Details:</h2>
                <ul>
                  <li><strong>Title:</strong> ${property.title || 'Untitled Property'}</li>
                  <li><strong>Location:</strong> ${property.location || 'Unknown location'}${property.city ? ', ' + property.city : ''}</li>
                </ul>
                <h3>Reason for rejection:</h3>
                <p>${rejectionReason}</p>
                <p>You are welcome to submit a new listing addressing the issues mentioned above.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                `
              );
            }
          } catch (emailError) {
            console.error("Error sending rejection notification email:", emailError);
            // Continue with the response even if email sending fails
          }
        
          return res.json({
            message: "Property has been rejected",
            property: updatedProperty,
          });
        }
      } catch (error) {
        console.error("Error rejecting property:", error);
        return res.status(500).json({
          message: "Failed to reject property",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }),
  );

  // =========== Agent Routes ===========

  // Get all agents
  app.get(
    "/api/agents",
    asyncHandler(async (req, res) => {
      const agents = await storage.getAllAgents();
      res.json(agents);
    }),
  );

  // Get featured agents
  app.get(
    "/api/agents/featured",
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const agents = await storage.getFeaturedAgents(limit);
      res.json(agents);
    }),
  );

  // Search agents
  app.get(
    "/api/agents/search",
    asyncHandler(async (req, res) => {
      const { specialization, area, minExperience, minRating } = req.query;

      const query: any = {};
      if (specialization) query.specialization = specialization as string;
      if (area) query.area = area as string;
      if (minExperience)
        query.minExperience = parseInt(minExperience as string);
      if (minRating) query.minRating = parseFloat(minRating as string);

      const agents = await storage.searchAgents(query);
      res.json(agents);
    }),
  );

  // Get agent by ID
  app.get(
    "/api/agents/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }

      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      res.json(agent);
    }),
  );

  // Get agent's properties
  app.get(
    "/api/agents/:id/properties",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }

      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const properties = await storage.getPropertiesByAgent(id);
      res.json(properties);
    }),
  );

  // Get agent reviews
  app.get(
    "/api/agents/:id/reviews",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }

      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const reviews = await storage.getAgentReviews(id);
      res.json(reviews);
    }),
  );

  // Create agent profile (for existing user)
  app.post(
    "/api/agents",
    isAuthenticated,
    hasRole(["agent"]),
    asyncHandler(async (req, res) => {
      // Check if user already has an agent profile
      const existingAgent = await storage.getAgentByUserId(req.user.id);
      if (existingAgent) {
        return res
          .status(400)
          .json({ message: "You already have an agent profile" });
      }

      const agentData = insertAgentSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const agent = await storage.createAgent(agentData);
      res.status(201).json(agent);
    }),
  );

  // Update agent profile
  app.patch(
    "/api/agents/:id",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }

      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Check if user owns this agent profile or is an admin
      if (agent.userId !== req.user.id && req.user.role !== "company_admin") {
        return res
          .status(403)
          .json({
            message: "You don't have permission to update this agent profile",
          });
      }

      const updatedAgent = await storage.updateAgent(id, req.body);
      res.json(updatedAgent);
    }),
  );

  // Add a review for an agent
  app.post(
    "/api/agents/:id/reviews",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }

      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const reviewData = insertAgentReviewSchema.parse({
        ...req.body,
        agentId: id,
        userId: req.user.id,
      });

      const review = await storage.createAgentReview(reviewData);
      res.status(201).json(review);
    }),
  );

  // =========== Company Routes ===========

  // Get all companies
  app.get(
    "/api/companies",
    asyncHandler(async (req, res) => {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    }),
  );

  // Get featured companies
  app.get(
    "/api/companies/featured",
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const companies = await storage.getFeaturedCompanies(limit);
      res.json(companies);
    }),
  );

  // Search companies
  app.get(
    "/api/companies/search",
    asyncHandler(async (req, res) => {
      const { city } = req.query;

      const query: any = {};
      if (city) query.city = city as string;

      const companies = await storage.searchCompanies(query);
      res.json(companies);
    }),
  );

  // Get company by ID
  app.get(
    "/api/companies/:id",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(company);
    }),
  );

  // Get company's properties
  app.get(
    "/api/companies/:id/properties",
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const properties = await storage.getPropertiesByCompany(id);
      res.json(properties);
    }),
  );

  // Create company (for existing user)
  app.post(
    "/api/companies",
    isAuthenticated,
    hasRole(["company_admin"]),
    asyncHandler(async (req, res) => {
      const companyData = insertCompanySchema.parse({
        ...req.body,
        adminId: req.user.id,
      });

      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    }),
  );

  // Update company
  app.patch(
    "/api/companies/:id",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }

      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Check if user is the company admin
      if (company.adminId !== req.user.id) {
        return res
          .status(403)
          .json({
            message: "You don't have permission to update this company",
          });
      }

      const updatedCompany = await storage.updateCompany(id, req.body);
      res.json(updatedCompany);
    }),
  );

  // =========== User & Recommendation Routes ===========

  // Get recommended properties for current user
  app.get(
    "/api/recommendations",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        
        // Get recommended properties from storage
        const recommendations = await storage.getRecommendedProperties(
          req.user.id,
          limit,
        );
        
        // Get free properties that match user preferences
        const freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE approval_status = 'approved'
          ORDER BY created_at DESC
          LIMIT 5
        `;
        
        const freeResult = await pool.query(freePropertiesQuery);
        
        // Map the free properties to match the expected format
        const mappedFreeProperties = freeResult.rows.map(prop => ({
          id: prop.id,
          title: prop.title,
          description: prop.description || 'No description provided',
          price: parseFloat(prop.price) || 0,
          propertyType: prop.property_type,
          propertyCategory: prop.property_category,
          location: prop.location,
          city: prop.city,
          area: parseFloat(prop.area) || 0,
          areaUnit: prop.area_unit,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          balconies: prop.balconies,
          floor: prop.floor_no,
          totalFloors: prop.total_floors,
          furnishedStatus: prop.furnished_status,
          facing: prop.facing,
          amenities: prop.amenities || [],
          userType: prop.user_type,
          contactName: prop.contact_name,
          contactPhone: prop.contact_phone,
          contactEmail: prop.contact_email,
          imageUrls: prop.image_urls || [],
          videoUrls: [],
          isUrgentSale: prop.is_urgent_sale,
          rentOrSale: prop.rent_or_sale,
          status: 'active',
          approvalStatus: 'approved',
          isFreeProperty: true, // Mark as free property
          isFeatured: true,
          isPremium: false,
          createdAt: prop.created_at,
          updatedAt: prop.updated_at || prop.created_at
        }));
        
        // Combine regular recommendations and free properties
        const combinedRecommendations = [...recommendations, ...mappedFreeProperties];
        
        // Shuffle the combined recommendations to mix free and regular properties
        const shuffledRecommendations = combinedRecommendations.sort(() => Math.random() - 0.5);
        
        // Limit to the requested number
        const limitedRecommendations = shuffledRecommendations.slice(0, limit);
        
        res.json(limitedRecommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Failed to fetch recommendations" });
      }
    }),
  );

  // Get AI-powered personalized recommendations
  app.get(
    "/api/recommendations/ai",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // Import and initialize the AI recommendation service
      const { getRecommendationService } = await import(
        "./recommendation-service"
      );
      const recommendationService = getRecommendationService(storage);

      const aiRecommendations =
        await recommendationService.getPersonalizedRecommendations(
          req.user.id,
          limit,
        );
      res.json(aiRecommendations);
    }),
  );

  // Track user property interaction for improving recommendations
  app.post(
    "/api/recommendations/track",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const { propertyId, interactionType } = req.body;

      if (!propertyId || !interactionType) {
        return res
          .status(400)
          .json({ message: "Property ID and interaction type are required" });
      }

      // Validate interaction type
      if (!["view", "save", "inquiry"].includes(interactionType)) {
        return res.status(400).json({ message: "Invalid interaction type" });
      }

      // Check if property exists
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Import and initialize the AI recommendation service
      const { getRecommendationService } = await import(
        "./recommendation-service"
      );
      const recommendationService = getRecommendationService(storage);

      // Track the interaction
      await recommendationService.updateModelWithInteraction(
        req.user.id,
        propertyId,
        interactionType,
      );

      // Also record view in database if it's a view interaction
      if (interactionType === "view") {
        await storage.addPropertyView(req.user.id, propertyId);
      }
    }),
  );

  // Trigger training of the AI recommendation model
  app.post(
    "/api/recommendations/train",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      // Only admins and agents can trigger model training
      if (!["admin", "agent"].includes(req.user.role)) {
        return res
          .status(403)
          .json({
            message:
              "Permission denied. Only admins and agents can trigger model training.",
          });
      }

      // Import and initialize the AI recommendation service
      const { getRecommendationService } = await import(
        "./recommendation-service"
      );
      const recommendationService = getRecommendationService(storage);

      try {
        // Train the model asynchronously
        recommendationService.trainModel().catch((err) => {
          console.error("Error training model:", err);
        });

        res.json({ message: "Model training initiated successfully" });
      } catch (error) {
        console.error("Error initiating model training:", error);
        res.status(500).json({ message: "Error initiating model training" });
      }
    }),
  );

  // Get current user's saved properties
  app.get(
    "/api/user/saved",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const savedProperties = await storage.getSavedProperties(req.user.id);
      res.json(savedProperties);
    }),
  );

  // Save a property
  app.post(
    "/api/properties/:id/save",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      await storage.saveProperty(req.user.id, id);
      res.status(201).json({ message: "Property saved successfully" });
    }),
  );

  // Unsave a property
  app.delete(
    "/api/properties/:id/save",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      await storage.unsaveProperty(req.user.id, id);
      res.json({ message: "Property removed from saved list" });
    }),
  );

  // Get free properties
  app.get(
    "/api/properties/free",
    asyncHandler(async (req, res) => {
      try {
        // Get approved free properties directly from the free_properties table
        const result = await pool.query(`
          SELECT * FROM free_properties 
          WHERE approval_status = 'approved'
          ORDER BY created_at DESC
          LIMIT 50
        `);
        
        // Map the results to match the expected format for the frontend
        const mappedProperties = result.rows.map(prop => ({
          id: prop.id,
          title: prop.title,
          description: prop.description || 'No description provided',
          price: parseFloat(prop.price) || 0,
          propertyType: prop.property_type,
          propertyCategory: prop.property_category,
          location: prop.location,
          city: prop.city,
          area: parseFloat(prop.area) || 0,
          areaUnit: prop.area_unit,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          balconies: prop.balconies,
          floor: prop.floor_no,
          totalFloors: prop.total_floors,
          furnishedStatus: prop.furnished_status,
          facing: prop.facing,
          amenities: prop.amenities || [],
          userType: prop.user_type,
          contactName: prop.contact_name,
          contactPhone: prop.contact_phone,
          contactEmail: prop.contact_email,
          imageUrls: prop.image_urls || [],
          videoUrls: [],
          isUrgentSale: prop.is_urgent_sale,
          rentOrSale: prop.rent_or_sale,
          status: 'active',
          approvalStatus: 'approved',
          isFeatured: false,
          isPremium: false,
          createdAt: prop.created_at,
          updatedAt: prop.updated_at || prop.created_at
        }));
        
        res.json(mappedProperties);
      } catch (error) {
        console.error("Error fetching free properties:", error);
        res.status(500).json({ message: "Failed to fetch free properties" });
      }
    })
  );
  
  // Create a property without authentication (free mode)
  app.post(
    "/api/properties/free",
    upload.any(), // Accept files with any field name
    processS3Upload, // Add S3 upload middleware
    asyncHandler(async (req, res) => {
      try {
        console.log(
          "Free property submission body:", 
          JSON.stringify(req.body, null, 2)
        );
        
        console.log("Files received:", req.files ? req.files.length : 0);

        // Process image URLs from the form data
        let uploadedFiles = [];
        let videoUrls = [];
        const imageCategories = {};
        
        // Check if we have pre-uploaded image URLs
        if (req.body.imageUrls) {
          try {
            // Parse the JSON string of image URLs
            const imageUrlsJson = req.body.imageUrls;
            console.log("Received imageUrls JSON:", imageUrlsJson);
            
            if (typeof imageUrlsJson === 'string') {
              const parsedUrls = JSON.parse(imageUrlsJson);
              
              if (Array.isArray(parsedUrls)) {
                console.log(`Found ${parsedUrls.length} pre-uploaded image URLs`);
                
                // Filter out any empty strings or invalid URLs
                const validUrls = parsedUrls.filter(url => 
                  typeof url === 'string' && url.trim() !== ''
                );
                
                if (validUrls.length === 0) {
                  console.warn("No valid image URLs found in the parsed JSON");
                } else {
                  console.log(`Found ${validUrls.length} valid pre-uploaded image URLs`);
                  uploadedFiles = validUrls;
                  
                  // Add all images to a general category
                  imageCategories['uploaded'] = validUrls;
                }
              }
            }
          } catch (error) {
            console.error("Error parsing imageUrls JSON:", error);
          }
        }
        
        // Check for category-specific pre-uploaded URLs from the form
        const categoryPrefixes = ['exterior', 'livingRoom', 'kitchen', 'bedroom', 'bathroom', 'floorPlan', 'locationMap', 'other'];
        
        // Track unique image URLs to avoid duplicates
        const uniqueImageUrls = new Set(uploadedFiles);
        
        categoryPrefixes.forEach(prefix => {
          // Check for URLs in the format prefix_urls_0, prefix_urls_1, etc.
          let categoryUrls = [];
          let index = 0;
          
          // Keep checking for URLs until we don't find any more
          while (req.body[`${prefix}_urls_${index}`]) {
            const url = req.body[`${prefix}_urls_${index}`];
            console.log(`Found ${prefix} URL at index ${index}:`, url);
            
            // Handle string URLs
            if (url && typeof url === 'string') {
              // Only add if it's not already in our set
              if (!uniqueImageUrls.has(url)) {
                uniqueImageUrls.add(url);
                categoryUrls.push(url);
              }
            }
            
            // Handle array of URLs
            if (Array.isArray(url)) {
              // Filter out duplicates and only add unique URLs
              url.forEach(item => {
                if (item && typeof item === 'string' && !uniqueImageUrls.has(item)) {
                  uniqueImageUrls.add(item);
                  categoryUrls.push(item);
                }
              });
            }
            
            index++;
          }
          
          // If we found any URLs for this category, add them to the imageCategories
          if (categoryUrls.length > 0) {
            console.log(`Adding ${categoryUrls.length} unique URLs to ${prefix} category`);
            imageCategories[prefix] = categoryUrls;
          }
        });
        
        // Update the uploadedFiles array with our unique URLs
        uploadedFiles = Array.from(uniqueImageUrls);
        
        // Validate S3 image keys
        try {
          const { validateAndFilterImageKeys } = await import('./s3-utils');
          console.log("Raw image keys:", uploadedFiles);
          
          // Validate and filter S3 keys
          uploadedFiles = await validateAndFilterImageKeys(uploadedFiles);
          console.log("Cleaned valid image keys:", uploadedFiles);
        } catch (validationError) {
          console.error("Error validating S3 image keys:", validationError);
          // Continue with the unvalidated keys if validation fails
        }
        
        // Also process any files that were uploaded directly with this request
        if (req.files && Array.isArray(req.files)) {
          console.log(`Processing ${req.files.length} files uploaded with this request`);
          const guestId = Math.floor(Math.random() * 1000000); // Use a consistent ID for all files
          
          // Create the upload directory if it doesn't exist
          const uploadDir = `./public/uploads/user-${guestId}`;
          try {
            await fs.ensureDir(uploadDir);
            console.log(`Created upload directory: ${uploadDir}`);
          } catch (mkdirError) {
            console.error(`Error creating upload directory: ${uploadDir}`, mkdirError);
          }
          
          // Process each file
          for (const file of req.files) {
            try {
              // Skip invalid files
              if (!file || file.size === 0) {
                console.warn(`Skipping invalid or empty file: ${file?.originalname || 'unknown'}`);
                continue;
              }
              
              const fieldName = file.fieldname || '';
              const category = fieldName.split('_')[0] || 'other';
              
              // Check if the file has an S3 key from the middleware
              if (file.s3Key) {
                console.log(`Using S3 key from middleware: ${file.s3Key}`);
                
                // Initialize category array if it doesn't exist
                if (!imageCategories[category]) {
                  imageCategories[category] = [];
                }
                
                // Add to appropriate arrays
                if (file.mimetype.startsWith('video/') || fieldName.startsWith('video_')) {
                  videoUrls.push(file.s3Key);
                  imageCategories[category].push(file.s3Key);
                } else {
                  uploadedFiles.push(file.s3Key);
                  imageCategories[category].push(file.s3Key);
                }
                
                continue; // Skip to next file
              }
              
              // Create unique filename to prevent collisions
              const timestamp = Date.now();
              const randomId = Math.floor(Math.random() * 1000000);
              const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
              const filename = `${timestamp}-${randomId}-${sanitizedFilename}`;
              const filePath = `${uploadDir}/${filename}`;
              
              // Make sure the URL is properly formatted for web access
              // This ensures the URL starts with a slash and doesn't have double slashes
              const fileUrl = `/uploads/user-${guestId}/${filename}`;
              console.log(`Generated file URL for free property: ${fileUrl}`);
              
              // Check if buffer exists before writing
              if (!file.buffer) {
                console.error(`Missing buffer for file: ${file.originalname}`);
                
                // If we have a path property, try to read the file from disk
                if (file.path) {
                  try {
                    console.log(`Attempting to read file from path: ${file.path}`);
                    const fileContent = await fs.readFile(file.path);
                    
                    // Write the file to disk
                    await fs.writeFile(filePath, fileContent);
                    console.log(`Saved file to ${filePath} (${fileContent.length} bytes)`);
                  } catch (readError) {
                    console.error(`Failed to read file from path: ${file.path}`, readError);
                    continue;
                  }
                } else {
                  // Try to use the S3 upload directly
                  try {
                    const { uploadToS3 } = await import('./s3-service');
                    const s3Key = await uploadToS3(file, `properties/user-${guestId}`);
                    
                    if (s3Key) {
                      console.log(`Successfully uploaded file to S3: ${s3Key}`);
                      
                      // Use the S3 key directly instead of local file
                      const s3FileUrl = s3Key;
                      
                      // Initialize category array if it doesn't exist
                      if (!imageCategories[category]) {
                        imageCategories[category] = [];
                      }
                      
                      // Add to appropriate arrays
                      if (file.mimetype.startsWith('video/') || fieldName.startsWith('video_')) {
                        videoUrls.push(s3FileUrl);
                        imageCategories[category].push(s3FileUrl);
                      } else {
                        uploadedFiles.push(s3FileUrl);
                        imageCategories[category].push(s3FileUrl);
                      }
                      
                      // Skip the rest of the processing for this file
                      continue;
                    }
                  } catch (s3Error) {
                    console.error(`Failed to upload file to S3:`, s3Error);
                  }
                  
                  // If we get here, both local and S3 uploads failed
                  continue;
                }
              } else {
                // Write the file to disk using the buffer
                await fs.writeFile(filePath, file.buffer);
                console.log(`Saved file to ${filePath} (${file.size} bytes)`);
              }
              
              // Initialize category array if it doesn't exist
              if (!imageCategories[category]) {
                  imageCategories[category] = [];
              }
              
              // Check if this is a video file
              if (file.mimetype.startsWith('video/') || fieldName.startsWith('video_')) {
                videoUrls.push(fileUrl);
                
                // Also store in categories
                imageCategories[category].push(fileUrl);
              } else {
                uploadedFiles.push(fileUrl);
                
                // Also store in categories
                imageCategories[category].push(fileUrl);
              }
            } catch (fileError) {
              console.error(`Error processing file ${file.originalname}:`, fileError);
            }
          }
        }
        
        console.log(`Total images to save: ${uploadedFiles.length}, videos: ${videoUrls.length}`);
        if (uploadedFiles.length === 0) {
          console.warn("No images found for property submission!");
        }
        
        // Check if we have at least one valid image URL
        if (uploadedFiles.length === 0) {
          console.log("No valid image URLs found for property submission");
          
          // If this is a production environment, require images
          if (process.env.NODE_ENV === 'production' && !req.body.allowNoImages) {
            return res.status(400).json({
              success: false,
              message: "At least one property image is required. Please upload images before submitting."
            });
          }
          
          // Use a placeholder image
          const placeholderImage = '/images/property-placeholder.jpg';
          uploadedFiles.push(placeholderImage);
          imageCategories['placeholder'] = [placeholderImage];
          console.log("Added placeholder image since no valid images were provided");
        }
        
        // Double-check that all S3 keys are valid and exist
        try {
          const { validateAndFilterImageKeys } = await import('./s3-utils');
          
          // Only validate S3 keys (not placeholder images)
          const s3Keys = uploadedFiles.filter(url => 
            url.includes('/') && !url.startsWith('/images/')
          );
          
          if (s3Keys.length > 0) {
            console.log(`Performing final validation on ${s3Keys.length} S3 image keys`);
            const validatedKeys = await validateAndFilterImageKeys(s3Keys);
            
            // Replace the original S3 keys with validated ones
            uploadedFiles = uploadedFiles.filter(url => !s3Keys.includes(url));
            uploadedFiles.push(...validatedKeys);
            
            console.log(`Final validation complete: ${validatedKeys.length} of ${s3Keys.length} S3 keys are valid`);
            
            // If we lost all images in validation, use placeholder
            if (uploadedFiles.length === 0) {
              const placeholderImage = '/images/property-placeholder.jpg';
              uploadedFiles.push(placeholderImage);
              imageCategories['placeholder'] = [placeholderImage];
              console.log("Added placeholder image after validation found no valid images");
            }
          }
        } catch (validationError) {
          console.error("Error in final S3 key validation:", validationError);
          // Continue with the current keys if validation fails
        }
        
        // Log the final list of image URLs
        console.log(`Total images to save: ${uploadedFiles.length}, videos: ${videoUrls.length}`);
        console.log("Final image URLs:", uploadedFiles);

        // Insert directly into free_properties table using raw SQL
        const query = `
          INSERT INTO free_properties (
            title, description, price, property_type, property_category,
            transaction_type, is_urgent_sale, location, city, project_name,
            pincode, bedrooms, bathrooms, balconies, floor_no,
            total_floors, floors_allowed_construction, furnished_status, road_width, open_sides,
            area, area_unit, contact_name, contact_phone, contact_email,
            whatsapp_enabled, user_type, parking, facing, amenities,
            possession_status, ownership_type, boundary_wall, electricity_status, water_availability,
            flooring_type, overlooking, preferred_tenant, property_age, project_status,
            launch_date, rera_registered, rera_number, landmarks, brokerage,
            no_broker_responses, address, rent_or_sale, image_urls, image_categories,
            approval_status, created_at
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25,
            $26, $27, $28, $29, $30,
            $31, $32, $33, $34, $35,
            $36, $37, $38, $39, $40,
            $41, $42, $43, $44, $45,
            $46, $47, $48, $49, $50,
            $51, $52
          )
          RETURNING id;
        `;
        
        // Process amenities - handle various input formats
        let amenitiesArray = [];
        
        // Try amenitiesArray first (new format from form)
        if (req.body.amenitiesArray) {
          try {
            if (typeof req.body.amenitiesArray === 'string') {
              // It's a JSON string that needs parsing
              const parsedArray = JSON.parse(req.body.amenitiesArray);
              if (Array.isArray(parsedArray)) {
                amenitiesArray = parsedArray;
                console.log("Using parsed amenitiesArray JSON:", amenitiesArray);
              }
            } else if (Array.isArray(req.body.amenitiesArray)) {
              // It's already an array
              amenitiesArray = req.body.amenitiesArray;
              console.log("Using direct amenitiesArray:", amenitiesArray);
            }
          } catch (parseError) {
            console.error("Error parsing amenitiesArray:", parseError);
            // Fall back to traditional method below
          }
        }
        
        // Fall back to traditional amenities field if needed
        if (amenitiesArray.length === 0 && req.body.amenities) {
          if (Array.isArray(req.body.amenities)) {
            amenitiesArray = req.body.amenities;
            console.log("Using direct amenities array:", amenitiesArray);
          } else if (typeof req.body.amenities === 'string') {
            // Split by comma, trim each value, and filter out empty values
            amenitiesArray = req.body.amenities.split(',')
              .map(a => a.trim())
              .filter(a => a.length > 0);
            console.log("Using split amenities string:", amenitiesArray);
          }
        }
        
        console.log("Final processed amenities:", amenitiesArray);
        
        // Determine rent or sale value
        let rentOrSale = 'sale';
        if (req.body.transactionType) {
          rentOrSale = req.body.transactionType.toLowerCase() === 'rent' ? 'rent' : 'sale';
        } else if (req.body.rentOrSale) {
          rentOrSale = req.body.rentOrSale.toLowerCase();
        }
        
        const values = [
          req.body.title || 'Untitled Property', 
          req.body.description || 'No description provided',
          parseInt(req.body.price) || 0,
          req.body.propertyType || 'residential',
          req.body.propertyCategory || null,
          rentOrSale,
          req.body.isUrgentSale === 'true' || req.body.isUrgentSale === true || req.body.is_urgent_sale === 'true' || req.body.is_urgent_sale === true,
          req.body.location || 'Unknown location',
          req.body.city || 'Unknown city',
          req.body.projectName || null,
          req.body.pincode || null,
          parseInt(req.body.bedrooms) || null,
          parseInt(req.body.bathrooms) || null,
          parseInt(req.body.balconies) || null,
          parseInt(req.body.floorNo) || null,
          parseInt(req.body.totalFloors) || null,
          parseInt(req.body.floorsAllowedForConstruction) || null,
          req.body.furnishedStatus || null,
          req.body.roadWidth || null,
          req.body.openSides || null,
          parseInt(req.body.area) || 0,
          req.body.areaUnit || 'sqft',
          req.body.contactName || 'Anonymous',
          req.body.contactPhone || 'Not provided',
          req.body.contactEmail || 'Not provided',
          req.body.whatsappEnabled === 'true' || req.body.whatsappEnabled === true,
          req.body.userType || 'owner',
          req.body.parking || null,
          req.body.facing || null,
          amenitiesArray,
          req.body.possessionStatus || null,
          req.body.ownershipType || null,
          req.body.boundaryWall || null,
          req.body.electricityStatus || null,
          req.body.waterAvailability || null,
          req.body.flooringType || null,
          req.body.overlooking || null,
          req.body.preferredTenant || null,
          req.body.propertyAge || null,
          req.body.projectStatus || null,
          req.body.launchDate || null,
          req.body.reraRegistered === 'true' || req.body.reraRegistered === true,
          req.body.reraNumber || null,
          req.body.landmarks || null,
          parseInt(req.body.brokerage) || 0,
          req.body.noBrokerResponses === 'true' || req.body.noBrokerResponses === true,
          req.body.address || req.body.location || 'Unknown address',
          rentOrSale,
          uploadedFiles,
          JSON.stringify(imageCategories),
          'pending', // Changed from 'approved' to 'pending' to require admin approval
          new Date()
        ];
        
        // Execute the query directly with pg pool
        const result = await pool.query(query, values);
        
        // Get the ID of the newly created property
        const createdPropertyId = result.rows[0].id;
        console.log("Free property created successfully with ID:", createdPropertyId);
        
        // Send email notification to admin about new property
        try {
          // Import email service directly to avoid circular references
          const { sendEmail } = await import('./email-service');
          
          // Format price for display
          const propertyPrice = parseInt(req.body.price) ? `₹${parseInt(req.body.price).toLocaleString()}` : 'Price not specified';
          
          // Send email to admin
          const adminEmail = process.env.ADMIN_EMAIL || "urgentsale.in@gmail.com";
          console.log(`Sending admin notification to: ${adminEmail}`);
          
          const emailResult = await sendEmail({
            to: adminEmail, 
            subject: "New Free Property Submission Requires Verification", 
            html: `
            <h1>New Free Property Submission</h1>
            <p>A new property has been submitted through the free property form and requires your verification:</p>
            <ul>
              <li><strong>Title:</strong> ${req.body.title || 'Untitled Property'}</li>
              <li><strong>Location:</strong> ${req.body.location || 'Unknown location'}${req.body.city ? ', ' + req.body.city : ''}</li>
              <li><strong>Type:</strong> ${req.body.propertyType || 'Not specified'}</li>
              <li><strong>Price:</strong> ${propertyPrice}</li>
              <li><strong>Contact:</strong> ${req.body.contactName || 'Unknown'} (${req.body.contactEmail || 'No email'}, ${req.body.contactPhone || 'No phone'})</li>
              <li><strong>Images:</strong> ${uploadedFiles.length} images uploaded</li>
            </ul>
            <p>Please log in to the admin panel to review and approve this property.</p>
            `
          });
          
          if (emailResult.success) {
            console.log("Admin notification email sent successfully for free property");
          } else {
            console.warn(`Admin notification email failed: ${emailResult.error}`);
          }
          
          // Send notification to the user if they provided an email
          if (req.body.contactEmail && req.body.contactEmail.includes('@')) {
            console.log(`Sending confirmation email to: ${req.body.contactEmail}`);
            
            const userEmailResult = await sendEmail({
              to: req.body.contactEmail,
              subject: "Your Property Listing Has Been Submitted",
              html: `
              <h1>Thank You for Your Property Submission</h1>
              <p>Your property listing "${req.body.title || 'Untitled Property'}" has been submitted successfully and is pending verification by our team.</p>
              <p>We will review your listing and publish it as soon as possible. You will receive another email once your property is approved.</p>
              <p>Property details:</p>
              <ul>
                <li><strong>Title:</strong> ${req.body.title || 'Untitled Property'}</li>
                <li><strong>Location:</strong> ${req.body.location || 'Unknown location'}${req.body.city ? ', ' + req.body.city : ''}</li>
                <li><strong>Type:</strong> ${req.body.propertyType || 'Not specified'}</li>
                <li><strong>Price:</strong> ${propertyPrice}</li>
              </ul>
              <p>If you need to make any changes to your listing, please contact our support team.</p>
              <p>Thank you for choosing our platform!</p>
              `
            });
            
            if (!userEmailResult.success) {
              console.warn(`User notification email failed: ${userEmailResult.error}`);
            }
          }
        } catch (emailError) {
          console.error("Error in email notification process:", emailError);
          // Continue with response - don't fail the submission if email fails
        }

        // If we reached here, property was created successfully
        const responseProperty = {
          success: true,
          message: "Property submitted successfully and waiting for admin approval. Your property will be visible after review.",
          id: createdPropertyId
        };
        
        res.status(201).json(responseProperty);
      } catch (error) {
        console.error("Error creating free property:", error);
        // Provide more detailed error message to the client
        if (error instanceof Error) {
          res.status(500).json({
            message: "Failed to create property",
            error: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          });
        } else {
          res.status(500).json({ message: "Unknown error occurred" });
        }
      }
    }),
  );
  
  // Send OTP via email without authentication - works for both registered and non-registered users
  app.post(
    "/api/auth/send-email-otp",
    asyncHandler(async (req, res) => {
      try {
        const { email } = req.body;
        
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
        
        console.log(`=========================================`);
        console.log(`OTP REQUEST RECEIVED FOR EMAIL: ${email}`);
        console.log(`=========================================`);
        
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set expiration time to 10 minutes from now
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        
        try {
          // First, find if this user exists
          const user = await db.query.users.findFirst({
            where: eq(schema.users.email, email)
          });
          
          // Check for existing OTPs for this email and invalidate them
          try {
            if (user) {
              // For registered users, invalidate by user ID
              await db.update(schema.otps)
                .set({ verified: true }) // Mark as verified to invalidate
                .where(
                  and(
                    eq(schema.otps.userId, user.id),
                    eq(schema.otps.type, "email"),
                    eq(schema.otps.verified, false)
                  )
                );
            } else {
              // For non-registered users, invalidate by email
              await db.update(schema.otps)
                .set({ verified: true }) // Mark as verified to invalidate
                .where(
                  and(
                    eq(schema.otps.userId, -1),
                    eq(schema.otps.email, email),
                    eq(schema.otps.type, "email"),
                    eq(schema.otps.verified, false)
                  )
                );
            }
            console.log(`Previous OTPs for ${email} have been invalidated`);
          } catch (invalidateError) {
            console.error("Error invalidating previous OTPs:", invalidateError);
            // Continue anyway - this is not critical
          }
          
          // Now create a new OTP record
          if (user) {
            // If user exists, store OTP with their user ID
            console.log(`Using existing user ID ${user.id} for OTP`);
            
            // Store OTP in database with user ID association
            await db.insert(schema.otps).values({
              userId: user.id,
              otp: otp,
              type: "email",
              expiresAt: expiresAt,
              verified: false
            });
          } else {
            // For non-registered users (free property submission), create a temporary OTP record
            console.log(`No registered user found for ${email}, creating temporary OTP`);
            
            // Store OTP in database with special userId for non-registered users
            await db.insert(schema.otps).values({
              userId: -1, // Special ID for non-registered users
              email: email, // Store email directly for verification
              otp: otp,
              type: "email",
              expiresAt: expiresAt,
              verified: false
            });
          }
          
          console.log(`OTP record created in database for ${email}`);
        } catch (dbError) {
          console.error("Database error while creating OTP:", dbError);
          // Continue anyway - we'll still try to send the OTP
          // This allows the flow to work even if there's a DB issue
        }
        
        // Send OTP via email
        const sent = await sendEmailOTP(email, otp);
        
        if (sent) {
          console.log(`OTP created and sent to ${email}`);
          
          // Always return the OTP in development mode for testing
          if (process.env.NODE_ENV === 'development') {
            res.json({ 
              success: true, 
              message: "OTP sent successfully",
              devInfo: {
                otp: otp,
                note: "This OTP is only shown in development mode"
              }
            });
          } else {
            res.json({ 
              success: true, 
              message: "OTP sent successfully" 
            });
          }
        } else {
          throw new Error("Failed to send OTP");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ 
          success: false, 
          message: error instanceof Error ? error.message : "Failed to send OTP" 
        });
      }
    })
  );
  
  // Verify OTP without authentication - works for both registered and non-registered users
  app.post(
    "/api/auth/verify-otp",
    asyncHandler(async (req, res) => {
      try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
          console.log("OTP verification failed - missing email or OTP");
          return res.status(400).json({ 
            verified: false,
            message: "Email and OTP are required" 
          });
        }
        
        // Log OTP verification attempt in a very visible way
        console.log("========================================");
        console.log(`VERIFYING OTP: ${otp} FOR EMAIL: ${email}`);
        console.log("========================================");

        try {
          // Find the user by email
          const user = await db.query.users.findFirst({
            where: eq(schema.users.email, email)
          }).catch(err => {
            console.error("Error finding user:", err);
            return null;
          });
  
          let otpRecord;
          
          if (user) {
            // For registered users, find OTP by user ID
            console.log(`Found registered user with ID: ${user.id}`);
            
            otpRecord = await db.query.otps.findFirst({
              where: and(
                eq(schema.otps.userId, user.id),
                eq(schema.otps.type, "email"),
                eq(schema.otps.verified, false),
                gte(schema.otps.expiresAt, new Date())
              ),
              orderBy: [desc(schema.otps.createdAt)]
            }).catch(err => {
              console.error("Error finding OTP for registered user:", err);
              return null;
            });
          } else {
            // For non-registered users (free property submission), find OTP by email
            console.log(`No registered user found, checking for guest OTP with email: ${email}`);
            
            otpRecord = await db.query.otps.findFirst({
              where: and(
                eq(schema.otps.userId, -1), // Special ID for non-registered users
                eq(schema.otps.email, email),
                eq(schema.otps.type, "email"),
                eq(schema.otps.verified, false),
                gte(schema.otps.expiresAt, new Date())
              ),
              orderBy: [desc(schema.otps.createdAt)]
            }).catch(err => {
              console.error("Error finding OTP for guest user:", err);
              return null;
            });
          }
  
          if (!otpRecord) {
            console.log(`No valid OTP found for email: ${email}`);
            
            // For development mode, let's check if there's any OTP regardless of expiration
            if (process.env.NODE_ENV === 'development') {
              let devOtpRecord;
              
              if (user) {
                devOtpRecord = await db.query.otps.findFirst({
                  where: and(
                    eq(schema.otps.userId, user.id),
                    eq(schema.otps.type, "email"),
                    eq(schema.otps.verified, false)
                  ),
                  orderBy: [desc(schema.otps.createdAt)]
                }).catch(() => null);
              } else {
                devOtpRecord = await db.query.otps.findFirst({
                  where: and(
                    eq(schema.otps.userId, -1),
                    eq(schema.otps.email, email),
                    eq(schema.otps.type, "email"),
                    eq(schema.otps.verified, false)
                  ),
                  orderBy: [desc(schema.otps.createdAt)]
                }).catch(() => null);
              }
              
              if (devOtpRecord) {
                console.log("Found expired OTP in development mode:", devOtpRecord);
                
                // In development, if OTP matches but is expired, still accept it
                if (devOtpRecord.otp === otp) {
                  console.log("DEVELOPMENT MODE: Accepting expired OTP");
                  otpRecord = devOtpRecord;
                } else {
                  return res.status(400).json({
                    verified: false,
                    message: "Invalid OTP. Please check and try again.",
                    devInfo: {
                      note: "OTP was found but didn't match",
                      expectedOtp: devOtpRecord.otp,
                      receivedOtp: otp
                    }
                  });
                }
              } else {
                return res.status(400).json({
                  verified: false,
                  message: "No valid OTP found. Please request a new OTP.",
                  devInfo: {
                    note: "No OTP record found at all"
                  }
                });
              }
            } else {
              // In production, strictly enforce OTP validity
              return res.status(400).json({
                verified: false,
                message: "No valid OTP found. Please request a new OTP."
              });
            }
          }
  
          // Verify the OTP if we're not in development mode with an expired OTP
          if (process.env.NODE_ENV !== 'development' && otpRecord.otp !== otp) {
            console.log(`OTP mismatch for email: ${email}`);
            return res.status(400).json({
              verified: false,
              message: "Invalid OTP. Please check and try again."
            });
          }
  
          // Mark OTP as verified
          try {
            await db.update(schema.otps)
              .set({ verified: true })
              .where(eq(schema.otps.id, otpRecord.id));
            
            console.log(`OTP marked as verified in database`);
          } catch (updateError) {
            console.error("Error updating OTP status:", updateError);
            // Continue anyway - verification can still succeed
          }
  
          // If this is a registered user, also mark their email as verified
          if (user) {
            try {
              await db.update(schema.users)
                .set({ emailVerified: true })
                .where(eq(schema.users.id, user.id));
              
              console.log(`User email marked as verified in database`);
            } catch (updateError) {
              console.error("Error updating user verification status:", updateError);
              // Continue anyway - verification can still succeed
            }
          }
  
          console.log("OTP VERIFICATION SUCCESSFUL");
          
          // Return appropriate response based on whether this is a registered user or guest
          if (user) {
            res.json({ 
              verified: true, 
              message: "OTP verified successfully",
              user: {
                id: user.id,
                email: user.email,
                emailVerified: true,
                // We include other needed user properties but exclude sensitive data
                name: user.name,
                role: user.role,
                phone: user.phone,
                phoneVerified: user.phoneVerified
              }
            });
          } else {
            // For non-registered users, just return verification status
            res.json({ 
              verified: true, 
              message: "OTP verified successfully",
              isGuest: true
            });
          }
        } catch (dbError) {
          console.error("Database error during OTP verification:", dbError);
          
          // For development mode, let's provide a bypass option
          if (process.env.NODE_ENV === 'development') {
            console.log("DEVELOPMENT MODE: Bypassing OTP verification due to database error");
            
            // In development, if there's a database error, we'll still verify the OTP
            res.json({ 
              verified: true, 
              message: "OTP verified successfully (development bypass)",
              isGuest: true,
              devInfo: {
                note: "OTP verification bypassed due to database error",
                error: dbError instanceof Error ? dbError.message : "Unknown database error"
              }
            });
          } else {
            throw dbError; // Re-throw in production
          }
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ 
          verified: false, 
          message: error instanceof Error ? error.message : "Failed to verify OTP" 
        });
      }
    })
  );

  // =========== Inquiry & Messaging Routes ===========

  // Create an inquiry for a property
  app.post(
    "/api/inquiries",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const inquiryData = insertInquirySchema.parse({
        ...req.body,
        fromUserId: req.user.id,
      });

      // Check if property exists
      const property = await storage.getProperty(inquiryData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    }),
  );

  // Get inquiries for a property
  app.get(
    "/api/properties/:id/inquiries",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Check if user owns this property or is the agent/company managing it
      if (
        property.userId !== req.user.id &&
        (property.agentId === null || property.agentId !== req.user.id)
      ) {
        return res
          .status(403)
          .json({
            message: "You don't have permission to view these inquiries",
          });
      }

      const inquiries = await storage.getInquiriesByProperty(id);
      res.json(inquiries);
    }),
  );

  // Get inquiries sent by current user
  app.get(
    "/api/user/inquiries/sent",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const inquiries = await storage.getInquiriesByUser(req.user.id, false);
      res.json(inquiries);
    }),
  );

  // Get inquiries received by current user
  app.get(
    "/api/user/inquiries/received",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const inquiries = await storage.getInquiriesByUser(req.user.id, true);
      res.json(inquiries);
    }),
  );

  // Get properties for current user (both regular and free properties)
  app.get(
    "/api/user/properties",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        console.log(`Fetching properties for user ID: ${req.user.id}, email: ${req.user.email}, phone: ${req.user.phone || 'not provided'}`);
        
        // Get regular properties from storage
        const properties = await storage.getPropertiesByUser(req.user.id);
        console.log(`Found ${properties.length} regular properties for user`);
        
        // Get free properties from free_properties table with more flexible matching
        // We'll use ILIKE for case-insensitive matching and trim spaces
        const freePropertiesQuery = `
          SELECT * FROM free_properties 
          WHERE 
            (TRIM(LOWER(contact_email)) = TRIM(LOWER($1))
            OR contact_phone = $2
            OR contact_phone LIKE '%' || $3 || '%'
            OR $4 LIKE '%' || contact_phone || '%')
          ORDER BY created_at DESC
        `;
        
        // Get user email and phone for matching
        const userEmail = req.user.email || '';
        const userPhone = req.user.phone || '';
        // Get last 10 digits of phone for partial matching
        const userPhoneLast10 = userPhone.replace(/\D/g, '').slice(-10);
        
        console.log(`Searching for free properties with email: ${userEmail}, phone: ${userPhone}, phoneLast10: ${userPhoneLast10}`);
        
        const freeResult = await pool.query(freePropertiesQuery, [
          userEmail, 
          userPhone,
          userPhoneLast10,
          userPhone
        ]);
        
        console.log(`Found ${freeResult.rowCount} free properties for user`);
        
        // If no free properties found with the above query, try a more lenient approach
        let freeProperties = [];
        if (freeResult.rowCount === 0) {
          console.log("No exact matches found, trying more lenient matching");
          
          // Try to match just the username part of the email (before the @)
          const emailUsername = userEmail.split('@')[0];
          if (emailUsername && emailUsername.length > 3) {
            const lenientQuery = `
              SELECT * FROM free_properties 
              WHERE 
                contact_email LIKE '%' || $1 || '%'
                OR contact_name LIKE '%' || $2 || '%'
              ORDER BY created_at DESC
            `;
            
            console.log(`Trying lenient match with email username: ${emailUsername}`);
            const lenientResult = await pool.query(lenientQuery, [emailUsername, req.user.name || '']);
            console.log(`Found ${lenientResult.rowCount} free properties with lenient matching`);
            
            // Map the free properties to match the expected format
            freeProperties = lenientResult.rows.map(prop => {
              console.log(`Mapping free property: ${prop.id}, ${prop.title}, email: ${prop.contact_email}`);
              return {
                id: prop.id,
                title: prop.title || "Untitled Property",
                description: prop.description || "",
                price: parseFloat(prop.price) || 0,
                discountedPrice: null,
                propertyType: prop.property_type || "",
                propertyCategory: prop.property_category || "",
                transactionType: prop.transaction_type || "",
                isUrgentSale: prop.is_urgent_sale || false,
                location: prop.location || "",
                city: prop.city || "",
                address: prop.address || "",
                subscriptionLevel: "free",
                imageUrls: prop.image_urls || [],
                rentOrSale: prop.rent_or_sale || "sale",
                status: "active",
                approvalStatus: prop.approval_status || "pending",
                createdAt: prop.created_at,
                updatedAt: prop.updated_at || prop.created_at,
                bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
                bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
                area: parseFloat(prop.area) || 0,
                areaUnit: prop.area_unit || "sqft",
                contactName: prop.contact_name || "",
                contactPhone: prop.contact_phone || "",
                contactEmail: prop.contact_email || "",
                isFreeProperty: true, // Flag to identify this is from free_properties table
                amenities: prop.amenities || []
              };
            });
          }
        } else {
          // Map the free properties to match the expected format
          freeProperties = freeResult.rows.map(prop => {
            console.log(`Mapping free property: ${prop.id}, ${prop.title}, email: ${prop.contact_email}`);
            return {
              id: prop.id,
              title: prop.title || "Untitled Property",
              description: prop.description || "",
              price: parseFloat(prop.price) || 0,
              discountedPrice: null,
              propertyType: prop.property_type || "",
              propertyCategory: prop.property_category || "",
              transactionType: prop.transaction_type || "",
              isUrgentSale: prop.is_urgent_sale || false,
              location: prop.location || "",
              city: prop.city || "",
              address: prop.address || "",
              subscriptionLevel: "free",
              imageUrls: prop.image_urls || [],
              rentOrSale: prop.rent_or_sale || "sale",
              status: "active",
              approvalStatus: prop.approval_status || "pending",
              createdAt: prop.created_at,
              updatedAt: prop.updated_at || prop.created_at,
              bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
              bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
              area: parseFloat(prop.area) || 0,
              areaUnit: prop.area_unit || "sqft",
              contactName: prop.contact_name || "",
              contactPhone: prop.contact_phone || "",
              contactEmail: prop.contact_email || "",
              isFreeProperty: true, // Flag to identify this is from free_properties table
              amenities: prop.amenities || []
            };
          });
        }
        
        // Combine and sort by creation date (newest first)
        const allProperties = [...properties, ...freeProperties].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        console.log(`Returning total of ${allProperties.length} properties (${properties.length} regular + ${freeProperties.length} free)`);
        res.json(allProperties);
      } catch (error) {
        console.error("Error fetching user properties:", error);
        res.status(500).json({ message: "Failed to fetch user properties" });
      }
    }),
  );

  // Get saved properties for current user
  app.get(
    "/api/user/saved",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        console.log(`Fetching saved properties for user ID: ${req.user.id}`);
        
        // Get saved properties from database
        const savedPropertiesResult = await pool.query(`
          SELECT property_id FROM saved_properties 
          WHERE user_id = $1
        `, [req.user.id]);
        
        console.log(`Found ${savedPropertiesResult.rowCount} saved property IDs`);
        
        if (savedPropertiesResult.rowCount === 0) {
          return res.json([]);
        }
        
        // Extract property IDs
        const propertyIds = savedPropertiesResult.rows.map(row => row.property_id);
        
        // Get regular properties
        const properties = await Promise.all(
          propertyIds.map(async (id) => {
            try {
              return await storage.getProperty(id);
            } catch (error) {
              console.error(`Error fetching property ${id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null values (properties that couldn't be found)
        const validProperties = properties.filter(p => p !== null);
        console.log(`Found ${validProperties.length} valid regular properties out of ${propertyIds.length} saved IDs`);
        
        // Get saved free properties
        // First, get the IDs of free properties that have been saved
        const savedFreePropertiesResult = await pool.query(`
          SELECT free_property_id FROM saved_free_properties 
          WHERE user_id = $1
        `, [req.user.id]);
        
        console.log(`Found ${savedFreePropertiesResult.rowCount} saved free property IDs`);
        
        let freeProperties = [];
        if (savedFreePropertiesResult.rowCount > 0) {
          // Extract free property IDs
          const freePropertyIds = savedFreePropertiesResult.rows.map(row => row.free_property_id);
          
          // Get the free properties
          const freePropertiesQuery = `
            SELECT * FROM free_properties 
            WHERE id = ANY($1::int[])
            AND approval_status = 'approved'
          `;
          
          const freePropertiesResult = await pool.query(freePropertiesQuery, [freePropertyIds]);
          console.log(`Found ${freePropertiesResult.rowCount} free properties from saved IDs`);
          
          // Map the free properties to match the expected format
          freeProperties = freePropertiesResult.rows.map(prop => {
            return {
              id: prop.id,
              title: prop.title || "Untitled Property",
              description: prop.description || "",
              price: parseFloat(prop.price) || 0,
              discountedPrice: null,
              propertyType: prop.property_type || "",
              propertyCategory: prop.property_category || "",
              transactionType: prop.transaction_type || "",
              isUrgentSale: prop.is_urgent_sale || false,
              location: prop.location || "",
              city: prop.city || "",
              address: prop.address || "",
              subscriptionLevel: "free",
              imageUrls: prop.image_urls || [],
              rentOrSale: prop.rent_or_sale || "sale",
              status: "active",
              approvalStatus: prop.approval_status || "pending",
              createdAt: prop.created_at,
              updatedAt: prop.updated_at || prop.created_at,
              bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : null,
              bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : null,
              area: parseFloat(prop.area) || 0,
              areaUnit: prop.area_unit || "sqft",
              contactName: prop.contact_name || "",
              contactPhone: prop.contact_phone || "",
              contactEmail: prop.contact_email || "",
              isFreeProperty: true, // Flag to identify this is from free_properties table
              amenities: prop.amenities || []
            };
          });
        }
        
        // Combine and sort by creation date (newest first)
        const allSavedProperties = [...validProperties, ...freeProperties].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        console.log(`Returning total of ${allSavedProperties.length} saved properties`);
        res.json(allSavedProperties);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        res.status(500).json({ message: "Failed to fetch saved properties" });
      }
    }),
  );

  // Get neighborhood insights
  // =========== Email Service Routes ===========

  // Contact form endpoint
  app.post("/api/contact", asyncHandler(handleContactForm));

  // Feedback form endpoint
  app.post("/api/feedback", asyncHandler(handleFeedbackForm));

  // Report problem endpoint
  app.post("/api/report-problem", asyncHandler(handleReportProblem));

  // Property interest endpoint
  app.post("/api/property-interest", asyncHandler(handlePropertyInterest));
  
  // Email test route
  app.use("/api/email-test", emailTestRoutes);

  // =========== Referral System Routes ===========
  
  // Create a new referral
  app.post("/api/referrals", asyncHandler(createReferral));
  
  // Get all referrals (admin only)
  app.get(
    "/api/referrals",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(getAllReferrals)
  );
  
  // Get referrals by user
  app.get(
    "/api/users/:userId/referrals",
    isAuthenticated,
    asyncHandler(getReferralsByUser)
  );
  
  // Update referral status (admin only)
  app.patch(
    "/api/referrals/:id",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(updateReferralStatus)
  );

  // =========== Project Routes ===========
  
  // Submit a new project
  app.post(
    "/api/projects",
    upload.fields([
      { name: 'heroImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 20 }
    ]),
    asyncHandler(submitProject)
  );
  
  // Get all projects (with optional status filter)
  app.get(
    "/api/projects",
    asyncHandler(getAllProjects)
  );
  
  // Get all projects by category (upcoming, featured, luxury, affordable, commercial, new_launch)
  app.get(
    "/api/projects/category/:category",
    asyncHandler(getProjectsByCategory)
  );
  
  // Get upcoming projects
  app.get(
    "/api/projects/upcoming",
    asyncHandler(getUpcomingProjects)
  );
  
  // Get featured projects
  app.get(
    "/api/projects/featured",
    asyncHandler(getFeaturedProjects)
  );
  
  // Get luxury projects
  app.get(
    "/api/projects/luxury",
    asyncHandler(getLuxuryProjects)
  );
  
  // Get affordable projects
  app.get(
    "/api/projects/affordable",
    asyncHandler(getAffordableProjects)
  );
  
  // Get commercial projects
  app.get(
    "/api/projects/commercial",
    asyncHandler(getCommercialProjects)
  );
  
  // Get new launch projects
  app.get(
    "/api/projects/new-launch",
    asyncHandler(getNewLaunchProjects)
  );
  
  // Get a specific project by ID
  app.get(
    "/api/projects/:id",
    asyncHandler(getProjectById)
  );
  
  // Get a property by ID (handles both regular and free properties)
  app.get(
    "/api/properties/:id",
    asyncHandler(async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid property ID" });
        }
        
        // First, try to get from regular properties
        const property = await storage.getProperty(id);
        
        if (property) {
          // Check if user is admin or property is approved
          const isAdmin = req.user && req.user.role === "admin";
          if (isAdmin || property.approvalStatus === "approved") {
            return res.json(property);
          } else {
            // If not admin and property is not approved, check if user owns this property
            if (req.user && property.userId === req.user.id) {
              return res.json(property);
            }
            return res.status(403).json({ message: "Property not approved yet" });
          }
        }
        
        // If not found in regular properties, check free_properties table
        const freePropertyQuery = `
          SELECT * FROM free_properties WHERE id = $1
        `;
        const freePropertyResult = await pool.query(freePropertyQuery, [id]);
        
        if (freePropertyResult.rows.length === 0) {
          return res.status(404).json({ message: "Property not found" });
        }
        
        const freeProp = freePropertyResult.rows[0];
        
        // Convert types to match the expected Property interface
        const price = typeof freeProp.price === 'string' ? parseFloat(freeProp.price) : freeProp.price;
        const area = typeof freeProp.area === 'string' ? parseFloat(freeProp.area) : freeProp.area;
        
        // Map the free property to match the Property interface
        const mappedProperty = {
          id: freeProp.id,
          title: freeProp.title || "Untitled Property",
          description: freeProp.description || "",
          price: price || 0,
          discountedPrice: null,
          propertyType: freeProp.property_type || "",
          propertyCategory: freeProp.property_category || "",
          transactionType: freeProp.transaction_type || "",
          isUrgentSale: freeProp.is_urgent_sale || false,
          location: freeProp.location || "",
          city: freeProp.city || "",
          address: freeProp.address || "",
          subscriptionLevel: "free",
          imageUrls: freeProp.image_urls || [],
          videoUrls: freeProp.video_urls || [],
          rentOrSale: freeProp.rent_or_sale || "sale",
          status: "active",
          approvalStatus: freeProp.approval_status || "pending",
          createdAt: freeProp.created_at,
          updatedAt: freeProp.updated_at || freeProp.created_at,
          bedrooms: freeProp.bedrooms ? parseInt(freeProp.bedrooms) : null,
          bathrooms: freeProp.bathrooms ? parseInt(freeProp.bathrooms) : null,
          area: area || 0,
          areaUnit: freeProp.area_unit || "sqft",
          contactName: freeProp.contact_name || "",
          contactPhone: freeProp.contact_phone || "",
          contactEmail: freeProp.contact_email || "",
          isFreeProperty: true, // Flag to identify this is from free_properties table
          amenities: freeProp.amenities || [],
          userId: -1, // Free properties don't have a user ID
          balconies: freeProp.balconies ? parseInt(freeProp.balconies) : null,
          floorNo: freeProp.floor_no ? parseInt(freeProp.floor_no) : null,
          totalFloors: freeProp.total_floors ? parseInt(freeProp.total_floors) : null,
          furnishedStatus: freeProp.furnished_status || null,
          facingDirection: freeProp.facing_direction || null,
          constructionAge: freeProp.construction_age || null,
          pincode: freeProp.pincode || null,
          whatsappEnabled: freeProp.whatsapp_enabled || false
        };
        
        // Check if user is admin or property is approved
        const isAdmin = req.user && req.user.role === "admin";
        if (isAdmin || mappedProperty.approvalStatus === "approved") {
          return res.json(mappedProperty);
        } else {
          // For free properties, allow the submitter to view their property even if not approved
          // We'll use the contact email to verify ownership
          if (req.user && req.user.email === mappedProperty.contactEmail) {
            return res.json(mappedProperty);
          }
          return res.status(403).json({ message: "Property not approved yet" });
        }
        
      } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ message: "Failed to fetch property details" });
      }
    })
  );
  
  // Admin routes for project approval/rejection
  app.post(
    "/api/admin/projects/:id/approve",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(approveProject)
  );
  
  app.post(
    "/api/admin/projects/:id/reject",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(rejectProject)
  );
   
  // =========== SubScription Service ===========
  app.post(
    "/api/properties",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      try {
        // Check if user can post a property based on their subscription
        const subscriptionCheck = await SubscriptionService.canUserPostProperty(req.user.id);
        
        if (!subscriptionCheck.canPost) {
          return res.status(403).json({ message: subscriptionCheck.reason });
        }
        
        // Process imageUrls if it's a string (JSON)
        let imageUrls = [];
        if (typeof req.body.imageUrls === 'string') {
          try {
            imageUrls = JSON.parse(req.body.imageUrls);
            console.log('Successfully parsed imageUrls:', imageUrls);
          } catch (e) {
            console.error('Error parsing imageUrls:', e);
          }
        } else if (Array.isArray(req.body.imageUrls)) {
          imageUrls = req.body.imageUrls;
        }
        
        // Existing property creation logic
        const property = await storage.createProperty({
          ...req.body,
          user_id: req.user.id,
          // Add subscription-related fields if user has a subscription
          premium: subscriptionCheck.subscription ? true : false,
          verified: subscriptionCheck.subscription?.verified_tag ? true : false,
          // Ensure imageUrls is properly set as an array
          imageUrls: imageUrls,
          // Add other subscription-related fields as needed
        });
        
        // Decrement remaining properties count if user has a subscription
        await SubscriptionService.decrementRemainingProperties(req.user.id);
        
        res.status(201).json(property);
      } catch (error) {
        // ... existing error handling ...
      }
    })
  );
  // =========== AD Packages Routes ===========
  app.use('/api/ad-packages', adPackagesRoutes);

  // =========== Activity Logs Routes ===========
  // Get recent activity logs (admin only) - Now returns mock data
  app.get(
    "/api/admin/logs/recent",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      console.log(`[MOCK API] Activity logs requested with limit: ${limit}`);
      
      // Generate some mock activity logs
      const mockLogs = Array.from({ length: Math.min(20, limit) }, (_, i) => {
        const randomTime = new Date(Date.now() - (i * 3600000));
        const entityTypes = ['property', 'project', 'user', 'admin', 'free_property'];
        const actions = ['submit', 'approve', 'reject', 'view', 'update', 'delete'];
        const statuses = ['success', 'error', 'pending'];
        
        return {
          id: i + 1,
          userId: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : null,
          action: `${entityTypes[Math.floor(Math.random() * entityTypes.length)]}_${actions[Math.floor(Math.random() * actions.length)]}`,
          entity: entityTypes[Math.floor(Math.random() * entityTypes.length)],
          entityId: Math.floor(Math.random() * 1000) + 1,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          details: { timestamp: randomTime.toISOString() },
          errorMessage: Math.random() > 0.8 ? 'Mock error message' : null,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 Mock Browser',
          createdAt: randomTime.toISOString(),
          updatedAt: randomTime.toISOString()
        };
      });
      
      res.json(mockLogs);
    })
  );
  
  // Get logs for a specific entity (admin only) - Now returns mock data
  app.get(
    "/api/admin/logs/entity/:entity/:entityId",
    isAuthenticated,
    hasRole(["admin"]),
    asyncHandler(async (req, res) => {
      const { entity, entityId } = req.params;
      console.log(`[MOCK API] Entity logs requested for ${entity} ID: ${entityId}`);
      
      // Generate some mock entity-specific logs
      const mockLogs = Array.from({ length: 5 }, (_, i) => {
        const randomTime = new Date(Date.now() - (i * 7200000));
        const actions = ['create', 'update', 'view', 'approve', 'reject'];
        const statuses = ['success', 'error', 'pending'];
        
        return {
          id: i + 1,
          userId: Math.floor(Math.random() * 10) + 1,
          action: `${entity}_${actions[Math.floor(Math.random() * actions.length)]}`,
          entity,
          entityId: parseInt(entityId),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          details: { timestamp: randomTime.toISOString() },
          errorMessage: Math.random() > 0.8 ? 'Mock error message' : null,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 Mock Browser',
          createdAt: randomTime.toISOString(),
          updatedAt: randomTime.toISOString()
        };
      });
      
      res.json(mockLogs);
    })
  );
  
  // =========== Upload Routes ===========
  // Import the upload handler
  const { handlePropertyImageUpload } = await import('./upload-routes');
  
  // Property image upload route - no authentication required for property images
  app.post(
    "/api/upload/property-images",
    upload.array('files'),
    processS3Upload, // Add S3 upload middleware
    asyncHandler(handlePropertyImageUpload)
  );
  
  // =========== Property Categories Routes ===========
  
  // Get property counts by type
  app.get(
    "/api/properties/counts-by-type",
    asyncHandler(async (req, res) => {
      try {
        // Query to count properties by type
        const result = await db.select({
          type: schema.properties.propertyType,
          count: count()
        })
        .from(schema.properties)
        .where(eq(schema.properties.status, 'active'))
        .groupBy(schema.properties.propertyType);
        
        console.log("Property counts by type:", result);
        
        // Return the counts
        res.json(result);
      } catch (error) {
        console.error("Error fetching property counts by type:", error);
        res.status(500).json({ message: "Failed to fetch property counts" });
      }
    })
  );
  
  // Get commercial properties
  // app.get(
  //   "/api/properties/commercial",
  //   asyncHandler(async (req, res) => {
  //     try {
  //       // Get commercial properties from the database
  //       const commercialProperties = await db
  //         .select()
  //         .from(schema.properties)
  //         .where(and(
  //           eq(schema.properties.propertyType, 'commercial'),
  //           eq(schema.properties.approvalStatus, 'approved')
  //         ))
  //         .limit(10);
        
  //       // Map the properties to the expected format
  //       const formattedProperties = commercialProperties.map(prop => ({
  //         id: prop.id.toString(),
  //         title: prop.title,
  //         propertyType: prop.propertyType,
  //         locality: prop.location.split(',')[0] || 'Unknown',
  //         city: prop.city || 'Unknown',
  //         state: prop.state || 'Unknown',
  //         price: (prop.price / 10000000).toFixed(2), // Convert to crores
  //         pricePerSqFt: ((prop.price / prop.area) || 0).toFixed(0),
  //         imageUrl: Array.isArray(prop.imageUrls) && prop.imageUrls.length > 0 
  //           ? prop.imageUrls[0] 
  //           : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  //         postedDate: new Date(prop.createdAt).toLocaleDateString('en-US', { 
  //           month: 'short', 
  //           day: 'numeric', 
  //           year: "'yy" 
  //         }),
  //         builder: prop.builder || 'Unknown Builder',
  //         featured: prop.featured || false,
  //         possession: prop.possessionDate || 'Ready to Move',
  //         area: `${prop.area} sq.ft`,
  //         amenities: prop.amenities || []
  //       }));
        
  //       // If no properties found, return mock data
  //       if (formattedProperties.length === 0) {
  //         return res.json([
  //           {
  //             id: "c1",
  //             title: "Office Spaces, Shops & Showrooms",
  //             propertyType: "Commercial",
  //             locality: "Malkajgiri",
  //             city: "Hyderabad",
  //             state: "Telangana",
  //             price: "1.04",
  //             pricePerSqFt: "7,500",
  //             imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  //             postedDate: "Dec 31, '24",
  //             builder: "Jain Construction",
  //             featured: true,
  //             possession: "Ready to Move",
  //             area: "1200-2500 sq.ft",
  //             amenities: ["24/7 Security", "Power Backup", "Parking"]
  //           },
  //           {
  //             id: "c2",
  //             title: "Premium Retail Spaces",
  //             propertyType: "Commercial",
  //             locality: "Gachibowli",
  //             city: "Hyderabad",
  //             state: "Telangana",
  //             price: "2.15",
  //             pricePerSqFt: "9,200",
  //             imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  //             postedDate: "Dec 28, '24",
  //             builder: "Prestige Group",
  //             featured: false,
  //             possession: "Q2 2025",
  //             area: "800-1500 sq.ft",
  //             amenities: ["Food Court", "Elevator", "CCTV"]
  //           }
  //         ]);
  //       }
        
  //       res.json(formattedProperties);
  //     } catch (error) {
  //       console.error("Error fetching commercial properties:", error);
  //       res.status(500).json({ error: "Failed to fetch commercial properties" });
  //     }
  //   })
  // );
  app.get(
    "/api/properties/commercial",
    asyncHandler(async (req, res) => {
      try {
        // Get query parameters for pagination/filtering
        const { page = 1, limit = 10, minPrice, maxPrice, location } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
  
        // Base query conditions
        const baseConditions = and(
          eq(schema.properties.propertyType, 'commercial'),
          eq(schema.properties.approvalStatus, 'approved'),
          eq(schema.properties.status, 'active')
        );
  
        // Additional filters
        const priceConditions = [];
        if (minPrice) priceConditions.push(gte(schema.properties.price, Number(minPrice)));
        if (maxPrice) priceConditions.push(lte(schema.properties.price, Number(maxPrice)));
  
        const locationConditions = [];
        if (location) {
          locationConditions.push(
            or(
              ilike(schema.properties.location, `%${location}%`),
              ilike(schema.properties.city, `%${location}%`)
            )
          );
        }
  
        // Combine all conditions
        const whereConditions = and(
          baseConditions,
          ...priceConditions,
          ...locationConditions
        );
  
        // Get commercial properties with filters
        const commercialProperties = await db
          .select()
          .from(schema.properties)
          .where(whereConditions)
          .limit(Number(limit))
          .offset(offset);
  
        // Get commercial projects with similar filters
        const commercialProjectsQuery = {
          text: `
            SELECT * FROM projects 
            WHERE category = 'commercial' 
            AND status = 'approved'
            AND is_active = true
            ${minPrice ? 'AND starting_price >= $1' : ''}
            ${maxPrice ? `${minPrice ? 'AND' : 'AND'} starting_price <= $${minPrice ? 2 : 1}` : ''}
            ${location ? `${minPrice || maxPrice ? 'AND' : 'AND'} (location ILIKE $${minPrice && maxPrice ? 3 : minPrice || maxPrice ? 2 : 1} OR city ILIKE $${minPrice && maxPrice ? 3 : minPrice || maxPrice ? 2 : 1})` : ''}
            LIMIT $${minPrice && maxPrice && location ? 4 : minPrice && maxPrice || minPrice && location || maxPrice && location ? 3 : minPrice || maxPrice || location ? 2 : 1}
            OFFSET $${minPrice && maxPrice && location ? 5 : minPrice && maxPrice || minPrice && location || maxPrice && location ? 4 : minPrice || maxPrice || location ? 3 : 2}
          `,
          values: [
            ...(minPrice ? [minPrice] : []),
            ...(maxPrice ? [maxPrice] : []),
            ...(location ? [`%${location}%`, `%${location}%`] : []),
            limit,
            offset
          ].filter(Boolean)
        };
  
        const projectsResult = await pool.query(commercialProjectsQuery);
        const commercialProjects = projectsResult.rows;
  
        // Format response data consistently
        const formatProperty = (item: any, isProject = false) => ({
          id: isProject ? `proj-${item.id}` : item.id.toString(),
          title: item.title,
          propertyType: 'commercial',
          subType: isProject ? item.project_type : item.property_subtype,
          locality: item.location?.split(',')[0]?.trim() || 'Unknown',
          city: item.city || 'Unknown',
          state: item.state || 'Unknown',
          price: item.price || item.starting_price 
            ? ((item.price || item.starting_price) / 10000000).toFixed(2) 
            : '0.00',
          pricePerSqFt: item.price && item.area 
            ? Math.round(item.price / item.area).toLocaleString()
            : item.price_per_sqft?.toLocaleString() || '0',
          imageUrl: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 
            ? item.imageUrls[0] 
            : item.hero_image || "/images/default-commercial.jpg",
          postedDate: new Date(item.createdAt || item.created_at).toLocaleDateString('en-US', {
            month: 'short', 
            day: 'numeric',
            year: "'yy"
          }),
          builder: item.builder || item.developer_name || 'Unknown',
          featured: item.featured || item.is_featured || false,
          possession: item.possessionDate || item.possession_date || 'Ready to Move',
          area: item.area || item.total_area 
            ? `${item.area || item.total_area} sq.ft` 
            : 'Size not specified',
          amenities: Array.isArray(item.amenities) 
            ? item.amenities 
            : typeof item.amenities === 'string' 
              ? item.amenities.split(',') 
              : []
        });
  
        const response = {
          data: [
            ...commercialProperties.map(prop => formatProperty(prop)),
            ...commercialProjects.map(proj => formatProperty(proj, true))
          ],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: commercialProperties.length + commercialProjects.length,
            // In a real implementation, you'd get total counts from the database
            totalProperties: commercialProperties.length,
            totalProjects: commercialProjects.length
          },
          filters: {
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            location: location || undefined
          }
        };
  
        // Return mock data only if no properties or projects found (for demo purposes)
        if (response.data.length === 0 && process.env.NODE_ENV !== 'production') {
          response.data = [
            {
              id: "c1",
              title: "Office Spaces, Shops & Showrooms",
              propertyType: "Commercial",
              subType: "Office Space",
              locality: "Malkajgiri",
              city: "Hyderabad",
              state: "Telangana",
              price: "1.04",
              pricePerSqFt: "7,500",
              imageUrl: "/images/commercial-placeholder-1.jpg",
              postedDate: "Dec 31, '24",
              builder: "Jain Construction",
              featured: true,
              possession: "Ready to Move",
              area: "1200-2500 sq.ft",
              amenities: ["24/7 Security", "Power Backup", "Parking"]
            }
          ];
        }
  
        res.json(response);
      } catch (error) {
        console.error("Error fetching commercial properties:", error);
        res.status(500).json({ 
          success: false,
          error: "Failed to fetch commercial properties",
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'COMMERCIAL_PROPERTIES_FETCH_ERROR'
        });
      }
    })
  );
  // =========== Neighborhood Insights Route ===========
  app.get(
    "/api/neighborhood/insights",
    asyncHandler(getNeighborhoodInsightsHandler),
  );

  // Mark an inquiry as read
  app.patch(
    "/api/inquiries/:id/read",
    isAuthenticated,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }

      const inquiry = await storage.getInquiry(id);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      // Check if user is the recipient
      if (inquiry.toUserId !== req.user.id) {
        return res
          .status(403)
          .json({
            message: "You don't have permission to update this inquiry",
          });
      }

      const updatedInquiry = await storage.markInquiryAsRead(id);
      res.json(updatedInquiry);
    }),
  );

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
