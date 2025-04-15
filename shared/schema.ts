import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const userRoles = [
  "buyer",
  "seller",
  "agent",
  "company_admin",
  "admin",
] as const;

// Verification methods
export const verificationMethods = ["email", "sms", "whatsapp"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("buyer"),
  subscriptionLevel: text("subscription_level").default("free"),
  avatar: text("avatar"),
  bio: text("bio"),
  verified: boolean("verified").default(false),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP for verification (supports both registered users and guests)
export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // -1 for non-registered users
  email: text("email"), // Store email for non-registered users
  otp: text("otp").notNull(),
  type: text("type").notNull(), // email, sms, whatsapp, property_booking
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  verified: boolean("verified").default(false),
});

// Property Bookings for site visits and follow-ups
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(), // The user who booked
  agentId: integer("agent_id"), // Optional agent assigned to handle this booking
  bookingDate: timestamp("booking_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  bookingType: text("booking_type").notNull(), // site_visit, video_tour, follow_up
  notes: text("notes"),
  verificationCode: text("verification_code"), // For on-site verification
  createdAt: timestamp("created_at").defaultNow(),
  isVerified: boolean("is_verified").default(false),
});

// Companies (Real Estate Agencies)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo"),
  website: text("website"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().unique(),
  establishedYear: integer("established_year"),
  verified: boolean("verified").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  adminId: integer("admin_id").notNull(), // References the user who administers this company
});

// Agents
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(), // References the user entity
  companyId: integer("company_id"), // Optional company association
  licenseNumber: text("license_number").notNull().unique(),
  specializations: text("specializations").array(),
  yearsOfExperience: integer("years_of_experience").default(0),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  areas: text("areas").array(), // Areas/neighborhoods the agent specializes in
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propertyTypes = [
  "apartment",
  "house",
  "villa",
  "plot",
  "commercial",
  "office",
  "retail",
  "warehouse",
  "farmland",
] as const;

export const propertyStatus = ["for_sale", "sold", "under_contract"] as const;

export const approvalStatus = ["pending", "approved", "rejected"] as const;

export const subscriptionLevels = ["free", "paid", "premium"] as const;

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"), // For urgency sales (25% off)
  rentOrSale: text("rent_or_sale").notNull().default("sale"),
  status: text("status").notNull().default("for_sale"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area").notNull(),
  yearBuilt: integer("year_built"),
  userId: integer("user_id").notNull(), // Owner/seller
  agentId: integer("agent_id"), // Optional assigned agent
  companyId: integer("company_id"), // Optional company listing

  // Approval workflow
  approvalStatus: text("approval_status").notNull().default("pending"),
  approvedBy: integer("approved_by"), // Admin user ID who approved
  rejectionReason: text("rejection_reason"), // If rejected, reason provided by admin
  approvalDate: timestamp("approval_date"), // When property was approved/rejected

  // Subscription and promotion fields
  subscriptionLevel: text("subscription_level").notNull().default("free"),
  subscriptionAmount: integer("subscription_amount").default(0), // In INR
  subscriptionExpiresAt: timestamp("subscription_expires_at"),

  featured: boolean("featured").default(false),
  verified: boolean("verified").default(false),
  premium: boolean("premium").default(false), // Premium listing (paid promotion)

  // Media and details
  amenities: text("amenities").array(),
  imageUrls: text("image_urls").array(),
  videoUrls: text("video_urls").array(), // New field for video URLs
  virtualTourUrl: text("virtual_tour_url"),
  floorPlanUrl: text("floor_plan_url"),

  // Timestamps and geo
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

// Property Recommendations
export const propertyRecommendations = pgTable("property_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  score: doublePrecision("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),

  // contactName: text("contact_name"), // Optional contact name
  contactEmail: text("contact_email"), // Optional contact email
  contactPhone: text("contact_phone"),
});

// Property Views (for tracking user behavior and recommendations)
export const propertyViews = pgTable("property_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Saved Properties (favorites/bookmarks)
export const savedProperties = pgTable("saved_properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Property Inquiries/Messages
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews for agents
export const agentReviews = pgTable("agent_reviews", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  avatar: true,
  bio: true,
});

export const insertOtpSchema = createInsertSchema(otps).omit({
  id: true,
  createdAt: true,
  verified: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties)
  .omit({
    id: true,
    createdAt: true,
    expiresAt: true, // Exclude expiresAt from auto-validation to handle manually
  })
  .extend({
    // Add expiresAt field with custom validation that accepts date or null
    expiresAt: z.date().nullable().optional(),
    // Ensure array fields are properly validated
    amenities: z.array(z.string()).default([]),
    imageUrls: z.array(z.string()).default([]),
    videoUrls: z.array(z.string()).default([]),
    // Override rentOrSale to only allow "sale"
    rentOrSale: z.enum(["sale"]).default("sale"),
  });

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertAgentReviewSchema = createInsertSchema(agentReviews).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type Otp = typeof otps.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'inquiry', 'booking', 'property_update', 'system', etc.
  referenceId: integer("reference_id"),
  referenceType: text("reference_type"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertAgentReview = z.infer<typeof insertAgentReviewSchema>;
export type AgentReview = typeof agentReviews.$inferSelect;

export const notificationTypes = [
  "system",
  "promotion",
  "update",
  "property",
] as const;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Add this to your existing schema.ts file

// Project categories
export const projectCategories = [
  "new_launch",
  "featured",
  "commercial",
  "upcoming", 
  "luxury", 
  "affordable",
  "newly_listed",
  "top_urgent",
  "company_projects"
] as const;

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  price: text("price"),
  priceRange: text("price_range"),
  bhkConfig: text("bhk_config").notNull(),
  builder: text("builder").notNull(),
  possessionDate: text("possession_date"),
  category: text("category").notNull(),
  status: text("status").notNull().default("upcoming"),
  amenities: text("amenities").array(),
  tags: text("tags").array(),
  imageUrls: text("image_urls").array(),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  contactNumber: text("contact_number"),
  userId: integer("user_id").notNull(), // User who submitted the project
  approvalStatus: text("approval_status").notNull().default("pending"),
  approvedBy: integer("approved_by"), // Admin who approved
  approvalDate: timestamp("approval_date"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertProjectSchema = createInsertSchema(projects)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    approvalDate: true,
  })
  .extend({
    // Ensure array fields are properly validated
    amenities: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    imageUrls: z.array(z.string()).default([]),
    category: z.enum(projectCategories),
    status: z.enum(["upcoming", "ongoing", "completed"]).default("upcoming"),
  });

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Referral system for click-and-earn page
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerUserId: integer("referrer_user_id").references(() => users.id),
  referrerName: text("referrer_name").notNull(),
  referrerEmail: text("referrer_email").notNull(),
  referrerPhone: text("referrer_phone").notNull(),
  referredName: text("referred_name").notNull(),
  referredEmail: text("referred_email").notNull(),
  referredPhone: text("referred_phone").notNull(),
  propertyInterest: text("property_interest").default(""),
  budget: integer("budget").default(0),
  location: text("location").default(""),
  status: text("status").default("pending"),
  notes: text("notes").default(""),
  commission: integer("commission").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referrals)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    commission: true,
  });

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// Activity logger table for tracking form submissions and other activities
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),  // Optional: can be null for anonymous activities
  action: text("action").notNull(),  // Type of action (e.g., "project_submit", "property_view")
  entity: text("entity").notNull(),  // The entity type being affected (e.g., "project", "property")
  entityId: integer("entity_id"),    // Optional: ID of the entity if available
  status: text("status").notNull(),  // "success", "error", "pending"
  details: json("details").default({}),  // JSON details of the action
  errorMessage: text("error_message").default(""),
  ipAddress: text("ip_address").default(""),
  userAgent: text("user_agent").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs)
  .omit({
    id: true,
    createdAt: true,
  });

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
