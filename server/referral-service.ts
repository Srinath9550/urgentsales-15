import { Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { insertReferralSchema } from "@shared/schema";
import { sendEmail } from "./email-service";

// Schema for creating a new referral
const createReferralSchema = z.object({
  referrerName: z.string().min(1, "Referrer name is required"),
  referrerEmail: z.string().email("Referrer email must be valid"),
  referrerPhone: z.string().min(10, "Referrer phone is required"),
  referredName: z.string().min(1, "Referred name is required"),
  referredEmail: z.string().email("Referred email must be valid"),
  referredPhone: z.string().min(10, "Referred phone is required"),
  propertyInterest: z.string().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  referrerUserId: z.number().optional(),
});

// Schema for updating a referral
const updateReferralSchema = z.object({
  status: z.enum(["pending", "contacted", "qualified", "converted", "not_interested"]),
  notes: z.string().optional(),
});

// Create a new referral
export async function createReferral(req: Request, res: Response) {
  try {
    // Validate input
    const validationResult = createReferralSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid referral data",
        errors: validationResult.error.errors,
      });
    }

    const referralData = validationResult.data;

    // Create the referral in the database
    const newReferral = await storage.createReferral({
      referrerName: referralData.referrerName,
      referrerEmail: referralData.referrerEmail,
      referrerPhone: referralData.referrerPhone,
      referredName: referralData.referredName, 
      referredEmail: referralData.referredEmail,
      referredPhone: referralData.referredPhone,
      propertyInterest: referralData.propertyInterest || '',
      budget: referralData.budget || 0,
      location: referralData.location || '',
      notes: referralData.notes || '',
      status: "pending",
      referrerUserId: referralData.referrerUserId,
    });

    // Send notification email to admin
    await sendReferralNotificationEmail(newReferral);

    // Create notification for user if they're logged in
    if (referralData.referrerUserId) {
      await storage.createNotification({
        userId: referralData.referrerUserId,
        title: "Referral Submitted",
        message: `Your referral for ${referralData.referredName} has been successfully submitted.`,
        type: "referral"
      });
    }

    res.status(201).json({
      message: "Referral created successfully",
      referral: newReferral,
    });
  } catch (error) {
    console.error("Error creating referral:", error);
    res.status(500).json({ message: "Failed to create referral" });
  }
}

// Get all referrals (admin only)
export async function getAllReferrals(req: Request, res: Response) {
  try {
    const referrals = await storage.getAllReferrals();
    res.json(referrals);
  } catch (error) {
    console.error("Error getting all referrals:", error);
    res.status(500).json({ message: "Failed to get referrals" });
  }
}

// Get referrals by user
export async function getReferralsByUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user is requesting their own referrals or is an admin
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ 
        message: "You don't have permission to view these referrals" 
      });
    }

    const referrals = await storage.getReferralsByUser(userId);
    res.json(referrals);
  } catch (error) {
    console.error("Error getting user referrals:", error);
    res.status(500).json({ message: "Failed to get referrals" });
  }
}

// Update referral status (admin only)
export async function updateReferralStatus(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid referral ID" });
    }

    // Validate input
    const validationResult = updateReferralSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid update data",
        errors: validationResult.error.errors,
      });
    }

    const { status, notes } = validationResult.data;

    // Check if referral exists
    const referral = await storage.getReferral(id);
    if (!referral) {
      return res.status(404).json({ message: "Referral not found" });
    }

    // Update referral status
    const updatedReferral = await storage.updateReferralStatus(id, status, notes);

    // Create notification for referrer if they have a user account
    if (referral.referrerUserId) {
      await storage.createNotification({
        userId: referral.referrerUserId,
        title: "Referral Status Update",
        message: `Your referral for ${referral.referredName} has been updated to: ${status.replace('_', ' ')}`,
        type: "referral"
      });
    }

    res.json({
      message: "Referral status updated successfully",
      referral: updatedReferral,
    });
  } catch (error) {
    console.error("Error updating referral status:", error);
    res.status(500).json({ message: "Failed to update referral status" });
  }
}

// Send email notification to admin about new referral
async function sendReferralNotificationEmail(referral: any) {
  const subject = "New Referral Submission";
  
  const html = `
    <h2>New Referral Submitted</h2>
    <p>A new referral has been submitted with the following details:</p>
    
    <h3>Referrer Information:</h3>
    <ul>
      <li><strong>Name:</strong> ${referral.referrerName}</li>
      <li><strong>Email:</strong> ${referral.referrerEmail}</li>
      <li><strong>Phone:</strong> ${referral.referrerPhone}</li>
    </ul>
    
    <h3>Referred Person Information:</h3>
    <ul>
      <li><strong>Name:</strong> ${referral.referredName}</li>
      <li><strong>Email:</strong> ${referral.referredEmail}</li>
      <li><strong>Phone:</strong> ${referral.referredPhone}</li>
    </ul>
    
    ${referral.propertyInterest || referral.budget || referral.location ? `
    <h3>Property Details:</h3>
    <ul>
      ${referral.propertyInterest ? `<li><strong>Property Interest:</strong> ${referral.propertyInterest}</li>` : ''}
      ${referral.budget ? `<li><strong>Budget:</strong> ₹${referral.budget}</li>` : ''}
      ${referral.location ? `<li><strong>Preferred Location:</strong> ${referral.location}</li>` : ''}
    </ul>
    ` : ''}
    
    ${referral.notes ? `
    <h3>Additional Notes:</h3>
    <p>${referral.notes}</p>
    ` : ''}
    
    <p>Please contact the referred person as soon as possible.</p>
    <p>You can manage this referral from the admin dashboard.</p>
  `;
  
  try {
    await sendEmail("urgentsale.in@gmail.com", subject, html);
  } catch (error) {
    console.error("Error sending referral notification email:", error);
  }
}