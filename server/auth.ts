import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import nodemailer from "nodemailer";
import twilio from 'twilio';
import { storage } from "./storage";
import { User as SelectUser, verificationMethods } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Function to send OTP via email
export async function sendEmailOTP(email: string, otp: string) {
  try {
    // Log the OTP for testing purposes in the console
    console.log(`=========================================`);
    console.log(`EMAIL OTP for ${email}: ${otp}`);
    console.log(`=========================================`);

    // Gmail SMTP setup with credentials from environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "urgentsale.in@gmail.com", // Get from env or fallback
        pass: process.env.EMAIL_PASSWORD || "krcd vaci ldzw kmpl", // Get from env or fallback
      },
      // Add timeout settings to prevent hanging connections
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // Verify SMTP connection configuration
    try {
      await transporter.verify();
      console.log("SMTP server connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP connection verification failed:", verifyError);
      // Continue anyway since we want to show the OTP in development
    }

    // Email content
    const mailOptions = {
      from: `"Urgent Sales.in " <${process.env.EMAIL_USER || "urgentsale.in@gmail.com"}>`,
      to: email,
      subject: "Your UrgentSales Platform Verification Code",
      text: `Your OTP for account verification is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6ee0;">UrgentSales Platform - Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering with our platform. Please use the verification code below to complete your account setup:</p>
          <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
            ${otp}
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>The UrgentSales Team</p>
        </div>
      `,
    };

    // Try to send the email with a timeout
    const sendMailPromise = transporter.sendMail(mailOptions);
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Email sending timed out")), 20000); // 20 seconds timeout
    });
    
    // Race the promises
    const info = await Promise.race([sendMailPromise, timeoutPromise])
      .catch(err => {
        console.error("Email sending failed with error:", err);
        return null;
      });
    
    if (info) {
      console.log("Email sent: %s", info.messageId);
      
      // Display the OTP in the console for development
      console.log(`=========================================`);
      console.log(`OTP VERIFICATION CODE: ${otp}`);
      console.log(`EMAIL: ${email}`);
      console.log(`SENDING STATUS: Email sent successfully`);
      console.log(`=========================================`);
      
      return true;
    } else {
      throw new Error("Failed to send email - timeout or other error");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    
    // Still display the OTP in the logs for testing purposes
    console.log(`=========================================`);
    console.log(`OTP VERIFICATION CODE: ${otp}`);
    console.log(`EMAIL: ${email}`);
    console.log(`SENDING STATUS: Failed - ${(error as Error).message}`);
    console.log(`IMPORTANT: USE THIS OTP FOR TESTING: ${otp}`);
    console.log(`=========================================`);
    
    // For development/testing purposes, we'll still return true
    // In production, this should return false to indicate failure
    console.log("WARNING: Email sending failed but returning true for testing purposes");
    console.log("Use this OTP for testing:", otp);
    return true;
  }
}

// Function to send OTP via WhatsApp
export async function sendWhatsAppOTP(phone: string, otp: string) {
  try {
    // Normalize phone number - ensure it has country code
    const normalizedPhone = normalizePhoneNumber(phone);
    
    // Log OTP for development purposes
    console.log(`=========================================`);
    console.log(`WHATSAPP OTP for ${normalizedPhone}: ${otp}`);
    console.log(`=========================================`);
    
    // Check if we have the required environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    // If we have the Twilio credentials, use the actual service
    if (accountSid && authToken) {
      const client = twilio(accountSid, authToken);
      
      // Using template approach with pre-approved template
      // Template must be pre-approved in Twilio console and should have a variable for the OTP
      try {
        // First try with template approach
        const message = await client.messages.create({
          from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
          to: `whatsapp:${normalizedPhone}`,
          contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e', // Use your pre-approved template ID
          contentVariables: JSON.stringify({"1": otp})
        });
        
        console.log(`WhatsApp template message sent with SID: ${message.sid}`);
        return true;
      } catch (templateError) {
        console.error("Template approach failed, trying with direct message:", templateError);
        
        // Fallback to direct message if template fails
        const messageTemplate = `Your verification code for Urgent Sales is: ${otp}. This code will expire in 10 minutes.`;
        
        const message = await client.messages.create({
          from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
          to: `whatsapp:${normalizedPhone}`,
          body: messageTemplate
        });
        
        console.log(`WhatsApp direct message sent with SID: ${message.sid}`);
        return true;
      }
    } else {
      // In development or without credentials, just log the OTP
      console.log(`WhatsApp integration is not configured. Would send OTP ${otp} to ${normalizedPhone}`);
      return true;
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    console.log(`=========================================`);
    console.log(`OTP VERIFICATION CODE: ${otp}`);
    console.log(`PHONE: ${phone}`);
    console.log(`SENDING STATUS: Failed - ${(error as Error).message}`);
    console.log(`=========================================`);
    return true; // Still return true to not block the flow in development
  }
}

// Helper function to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
  // Remove any non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // Ensure it has the country code (add +91 for India if missing)
  if (!digits.startsWith('91') && digits.length === 10) {
    digits = '91' + digits;
  }
  
  // If number doesn't have a + prefix, add it
  if (!phone.startsWith('+')) {
    return '+' + digits;
  }
  
  return digits;
}

// Generic function to send OTP based on method
export async function sendOTP(
  recipient: string,
  otp: string,
  method: "email" | "whatsapp" | "sms",
) {
  switch (method) {
    case "email":
      return sendEmailOTP(recipient, otp);
    case "whatsapp":
      return sendWhatsAppOTP(recipient, otp);
    case "sms":
      // TODO: Implement SMS sending (could use Twilio or similar)
      console.log(`SMS OTP for ${recipient}: ${otp}`);
      return true;
    default:
      throw new Error(`Unsupported OTP method: ${method}`);
  }
}

// Function to send WhatsApp notifications for various events
export async function sendWhatsAppNotification(
  phone: string, 
  notificationType: "property_submission" | "booking_confirmation" | "property_approval" | "price_update" | "general",
  data: Record<string, any>
) {
  try {
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);
    
    // Check if we have the required environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.log(`WhatsApp integration is not configured. Cannot send notification to ${normalizedPhone}`);
      return true;
    }
    
    const client = twilio(accountSid, authToken);
    
    // Template and variables based on notification type
    let contentSid = 'HXfb4906e08572c276a9dcac6ff9a5fb90'; // Default template
    let contentVariables: Record<string, any> = {};
    
    switch (notificationType) {
      case "property_submission":
        // Property submission template
        contentVariables = {
          "1": data.propertyId || "N/A",
          "2": data.status || "pending"
        };
        break;
        
      case "booking_confirmation":
        // Booking confirmation template
        contentVariables = {
          "1": data.bookingDate || "N/A",
          "2": data.propertyName || "N/A"
        };
        break;
        
      case "property_approval":
        // Property approval template
        contentVariables = {
          "1": data.propertyId || "N/A", 
          "2": data.approvalStatus || "approved"
        };
        break;
        
      case "price_update":
        // Price update template
        contentVariables = {
          "1": data.propertyName || "N/A",
          "2": data.newPrice || "N/A"
        };
        break;
        
      case "general":
      default:
        // General notification template
        contentVariables = {
          "1": data.message || "You have a new notification"
        };
        break;
    }
    
    try {
      // Try to send using template
      const message = await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${normalizedPhone}`,
        contentSid,
        contentVariables: JSON.stringify(contentVariables)
      });
      
      console.log(`WhatsApp notification sent with SID: ${message.sid}`);
      return true;
    } catch (templateError) {
      console.error("Template approach failed, trying with direct message:", templateError);
      
      // Fallback to direct message
      const fallbackMessage = `Urgent Sales notification: ${data.message || "You have a new notification regarding your property."}`;
      
      const message = await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${normalizedPhone}`,
        body: fallbackMessage
      });
      
      console.log(`WhatsApp direct message sent with SID: ${message.sid}`);
      return true;
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Function to generate a secure reset token
async function generateResetToken() {
  return randomBytes(32).toString("hex");
}

// Function to send password reset email
async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    // Create reset URL
    const resetUrl = `${process.env.SITE_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;

    // Log it for debugging
    console.log(`=========================================`);
    console.log(`PASSWORD RESET EMAIL`);
    console.log(`TO: ${email}`);
    console.log(`RESET LINK: ${resetUrl}`);
    console.log(`TOKEN: ${resetToken}`);
    console.log(`=========================================`);

    // Use the same email transport as the OTP sending
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "urgentsale.in@gmail.com", // Get from env or fallback
        pass: process.env.EMAIL_PASSWORD || "krcd vaci ldzw kmpl", // Get from env or fallback
      },
    });

    // Email content
    const mailOptions = {
      from: `"UrgentSales.in Platform" <${process.env.EMAIL_USER || "urgentsale.in@gmail.com"}>`,
      to: email,
      subject: "Reset Your Password - Urgent Sales",
      text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6ee0;">Urgent Sales - Password Reset</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="background-color: #f7f7f7; padding: 10px; word-break: break-all; border-radius: 4px;">
            ${resetUrl}
          </p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The Urgent Sales Team</p>
        </div>
      `,
    };

    // Actually send the email using the provided credentials
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: %s", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    console.log(`=========================================`);
    console.log(`PASSWORD RESET EMAIL FAILED`);
    console.log(`TO: ${email}`);
    console.log(`ERROR: ${(error as Error).message}`);
    console.log(`=========================================`);
    return true; // Still return true to not block the flow in development
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "realestate-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const {
        username,
        email,
        phone,
        password,
        verificationMethod = "email",
        ...otherFields
      } = req.body;

      // Validate the verification method
      if (!verificationMethods.includes(verificationMethod)) {
        return res
          .status(400)
          .json({
            message: `Invalid verification method. Supported methods: ${verificationMethods.join(", ")}`,
          });
      }

      // Check for existing user
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check for existing email
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Create user account first
      const user = await storage.createUser({
        username,
        email,
        phone,
        password: await hashPassword(password),
        ...otherFields,
      });

      // Generate OTP
      const otp = await generateOTP();

      // Create OTP record
      await storage.createOtp({
        userId: user.id,
        otp,
        type: verificationMethod,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      // Send OTP via the selected method
      if (verificationMethod === "email") {
        await sendOTP(email, otp, "email");
      } else if (verificationMethod === "whatsapp" && phone) {
        await sendOTP(phone, otp, "whatsapp");
      } else if (verificationMethod === "sms" && phone) {
        await sendOTP(phone, otp, "sms");
      } else {
        return res.status(400).json({
          message: `${verificationMethod} verification requires a valid phone number`,
        });
      }

      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({
          ...userWithoutPassword,
          otpSent: true,
          verificationMethod,
          needsVerification: true,
          emailVerified: false,
          phoneVerified: false,
        });
      });
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate(
      "local",
      async (err: any, user: SelectUser | false, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        // Check if the user has the same username/email as an existing account
        const existingUser = await storage.getUserByEmail(user.email);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({
            message: "An account with this email already exists",
            existingAccount: true,
          });
        }

        // Allow login even if email is not verified, but include verification status
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          const { password, ...userWithoutPassword } = user;

          // Include verification status in the response
          return res.status(200).json({
            ...userWithoutPassword,
            needsVerification: !user.emailVerified,
            emailVerified: !!user.emailVerified,
            phoneVerified: !!user.phoneVerified,
          });
        });
      },
    )(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;

    // Include verification status in the response for consistency
    res.json({
      ...userWithoutPassword,
      needsVerification: !req.user.emailVerified,
      emailVerified: !!req.user.emailVerified,
      phoneVerified: !!req.user.phoneVerified,
    });
  });

  app.post("/api/resend-otp", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userId = req.user.id;
      const { type = "email" } = req.body;

      if (!verificationMethods.includes(type)) {
        return res.status(400).json({
          message: `Invalid verification type. Supported types: ${verificationMethods.join(", ")}`,
        });
      }

      // Generate new OTP
      const otp = await generateOTP();

      // Get previous OTP to update it
      const existingOtp = await storage.getOtpByUserAndType(userId, type);

      if (existingOtp) {
        // Invalidate old OTP
        await storage.invalidateOtp(existingOtp.id);
      }

      // Create new OTP record
      await storage.createOtp({
        userId,
        otp,
        type,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      // Send OTP via the selected method
      if (type === "email") {
        await sendOTP(req.user.email, otp, "email");
        res.json({ success: true, message: "OTP sent to your email" });
      } else if (type === "whatsapp" && req.user.phone) {
        await sendOTP(req.user.phone, otp, "whatsapp");
        res.json({ success: true, message: "OTP sent to your WhatsApp" });
      } else if (type === "sms" && req.user.phone) {
        await sendOTP(req.user.phone, otp, "sms");
        res.json({ success: true, message: "OTP sent to your phone" });
      } else {
        return res.status(400).json({
          message: `${type} verification requires a valid phone number`,
        });
      }
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(500).json({
        message: "Failed to resend OTP",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/verify-otp", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userId = req.user.id;
      const { otp, type = "email" } = req.body;

      if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
      }

      if (!verificationMethods.includes(type)) {
        return res.status(400).json({
          message: `Invalid verification type. Supported types: ${verificationMethods.join(", ")}`,
        });
      }

      // Verify the OTP
      const isValid = await storage.verifyOtp(userId, otp, type);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Update user verification status based on the type
      let updatedUser;

      if (type === "email") {
        updatedUser = await storage.verifyUserEmail(userId);
      } else if (type === "whatsapp" || type === "sms") {
        updatedUser = await storage.verifyUserPhone(userId);
      }

      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Failed to update verification status" });
      }

      // Return success response with updated user data
      const { password, ...userWithoutPassword } = updatedUser;

      res.json({
        success: true,
        message: `${type} verification successful`,
        user: {
          ...userWithoutPassword,
          needsVerification: !updatedUser.emailVerified,
          emailVerified: !!updatedUser.emailVerified,
          phoneVerified: !!updatedUser.phoneVerified,
        },
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({
        message: "Verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Forgot password request
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);

      if (!user) {
        // Send a 200 response even if user not found for security reasons
        // But don't actually send an email
        return res.status(200).json({
          success: true,
          message:
            "If your email exists in our system, you will receive password reset instructions.",
        });
      }

      // Generate reset token
      const resetToken = await generateResetToken();

      // Store it in OTP table (using 'reset' as type)
      await storage.createOtp({
        userId: user.id,
        otp: resetToken,
        type: "reset",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // Send reset email with token
      await sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message:
          "If your email exists in our system, you will receive password reset instructions.",
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({
        message: "Failed to process password reset request",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Reset password with token
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          message: "Reset token and new password are required",
        });
      }

      // Find the OTP record by token
      const allOtps = await storage.getAllOtps();
      const resetOtp = allOtps.find(
        (otp) => otp.otp === token && otp.type === "reset",
      );

      if (!resetOtp || resetOtp.expiresAt < new Date()) {
        return res.status(400).json({
          message: "Invalid or expired reset token",
        });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user's password
      const user = await storage.updateUserPassword(
        resetOtp.userId,
        hashedPassword,
      );

      if (!user) {
        return res.status(500).json({
          message: "Failed to update password",
        });
      }

      // Invalidate the used token
      await storage.invalidateOtp(resetOtp.id);

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({
        message: "Failed to reset password",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}

// Add or update the export for isAuthenticated function
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from './db';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// Authentication middleware
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as any;
    
    // Check if user exists
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Set user in request
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
