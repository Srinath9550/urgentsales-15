import nodemailer from "nodemailer";
import { Request, Response } from "express";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srinathballa20@gmail.com', // Your email
    pass: 'veouuoapolixrlqa'         // Your app password
  }
});

// Email templates
const emailTemplates = {
  contactForm: (data: any) => ({
    subject: `Contact Form Submission: ${data.subject || "New Message"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${data.subject || "Not provided"}</p>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This message was sent from the contact form on your real estate website.</p>
      </div>
    `,
  }),

  feedbackForm: (data: any) => ({
    subject: `Website Feedback: ${data.category || "General Feedback"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - User Feedback</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Category:</strong> ${data.category || "Not categorized"}</p>
        <p><strong>Rating:</strong> ${data.rating}/5</p>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Feedback:</strong></p>
          <p>${data.feedback}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This feedback was submitted from your real estate website.</p>
      </div>
    `,
  }),

  reportProblem: (data: any) => ({
    subject: `Problem Report: ${data.category || "Website Issue"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Problem Report</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Category:</strong> ${data.category || "Uncategorized"}</p>
        <p><strong>Severity:</strong> ${data.severity || "Not specified"}</p>
        <p><strong>URL:</strong> ${data.url || "Not provided"}</p>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Description:</strong></p>
          <p>${data.description}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This problem was reported from your real estate website.</p>
      </div>
    `,
  }),

  propertyInterest: (data: any) => ({
    subject: `Property Interest: ${data.propertyTitle || "Property Inquiry"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Property Interest</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <div style="margin: 15px 0; padding: 10px; border-left: 4px solid #4a6ee0;">
          <p><strong>Property:</strong> ${data.propertyTitle || "Not specified"}</p>
          <p><strong>Property ID:</strong> ${data.propertyId || "Not specified"}</p>
          <p><strong>Price:</strong> ${data.propertyPrice || "Not specified"}</p>
          <p><strong>Location:</strong> ${data.propertyLocation || "Not specified"}</p>
          <p><strong>Approval Status:</strong> <span style="background-color: ${
            data.approvalStatus === 'approved' ? '#e6f7e6' : 
            data.approvalStatus === 'rejected' ? '#ffebeb' : 
            data.approvalStatus === 'pending' ? '#fff8e6' : '#f5f5f5'
          }; padding: 3px 8px; border-radius: 3px; font-size: 14px; color: ${
            data.approvalStatus === 'approved' ? '#2e7d32' : 
            data.approvalStatus === 'rejected' ? '#c62828' : 
            data.approvalStatus === 'pending' ? '#ef6c00' : '#757575'
          };">${data.approvalStatus ? data.approvalStatus.toUpperCase() : 'UNKNOWN'}</span></p>
        </div>
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Message:</strong></p>
          <p>${data.message || "No message provided."}</p>
        </div>
        <div style="background-color: ${
          data.approvalStatus === 'approved' ? '#e6f7e6' : 
          data.approvalStatus === 'pending' ? '#fff8e6' : '#f5f5f5'
        }; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid ${
          data.approvalStatus === 'approved' ? '#2e7d32' : 
          data.approvalStatus === 'pending' ? '#ef6c00' : '#757575'
        };">
          <p><strong>Admin Note:</strong></p>
          <p>${
            data.approvalStatus === 'approved' ? 
            'This property is approved and contact details are visible to the visitor.' : 
            data.approvalStatus === 'pending' ? 
            'This property is pending approval. The visitor has submitted their information to request contact details.' : 
            'This property has not been approved yet. The visitor has submitted their information to request contact details.'
          }</p>
        </div>
        <p style="color: #666; font-size: 12px;">This interest was submitted from your real estate website.</p>
      </div>
    `,
  }),
  
  projectSubmission: (data: any) => ({
    subject: `New Project Submission: ${data.title || "Project Submission"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - New Project Submission</h2>
        <p><strong>Submitted By:</strong> ${data.name || 'Unknown'} (${data.email || 'No email provided'})</p>
        <p><strong>Contact Phone:</strong> ${data.phone || "Not provided"}</p>
        
        <div style="margin: 15px 0; padding: 15px; border-radius: 5px; background-color: #f0f7ff; border-left: 4px solid #4a6ee0;">
          <h3 style="margin-top: 0; color: #333;">Project Details</h3>
          <p><strong>Title:</strong> ${data.title || "Not specified"}</p>
          <p><strong>Type:</strong> ${data.type || "Not specified"}</p>
          <p><strong>Category:</strong> ${data.category || "Not specified"}</p>
          <p><strong>Status:</strong> <span style="background-color: #fff8e6; padding: 3px 8px; border-radius: 3px; font-size: 14px; color: #ef6c00;">PENDING APPROVAL</span></p>
          <p><strong>Location:</strong> ${data.location || "Not specified"}</p>
          <p><strong>Price Range:</strong> ${data.priceRange || "Not specified"}</p>
          <p><strong>Completion Date:</strong> ${data.completionDate || "Not specified"}</p>
        </div>
        
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Description:</strong></p>
          <p>${data.description || "No description provided."}</p>
        </div>
        
        <div style="background-color: #f2f9ff; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #4a6ee0;">
          <p><strong>Amenities:</strong></p>
          <p>${data.amenities ? data.amenities.join(', ') : "No amenities listed."}</p>
        </div>
        
        <div style="background-color: #fff8e6; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #ef6c00;">
          <p><strong>Admin Action Required:</strong></p>
          <p>This project requires your approval before it will be visible on the website. Please review the details and take appropriate action from the admin dashboard.</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">This project was submitted from your real estate website and requires your approval.</p>
      </div>
    `,
  }),
  
  freePropertySubmission: (data: any) => ({
    subject: `New Free Property Submission: ${data.title || "Property Submission"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - Free Property Submission</h2>
        <p><strong>Submitted By:</strong> ${data.name || 'Guest User'} (${data.email || 'No email provided'})</p>
        <p><strong>Contact Phone:</strong> ${data.phone || "Not provided"}</p>
        
        <div style="margin: 15px 0; padding: 15px; border-radius: 5px; background-color: #f0f7ff; border-left: 4px solid #4a6ee0;">
          <h3 style="margin-top: 0; color: #333;">Property Details</h3>
          <p><strong>Title:</strong> ${data.title || "Not specified"}</p>
          <p><strong>Type:</strong> ${data.propertyType || "Not specified"}</p>
          <p><strong>Status:</strong> <span style="background-color: #fff8e6; padding: 3px 8px; border-radius: 3px; font-size: 14px; color: #ef6c00;">PENDING APPROVAL</span></p>
          <p><strong>Location:</strong> ${data.location || "Not specified"}</p>
          <p><strong>Price:</strong> ${data.price || "Not specified"}</p>
          <p><strong>Area:</strong> ${data.area || "Not specified"} sq ft</p>
          <p><strong>Bedrooms:</strong> ${data.bedrooms || "Not specified"}</p>
          <p><strong>Bathrooms:</strong> ${data.bathrooms || "Not specified"}</p>
        </div>
        
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Description:</strong></p>
          <p>${data.description || "No description provided."}</p>
        </div>
        
        <div style="background-color: #f2f9ff; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #4a6ee0;">
          <p><strong>Features:</strong></p>
          <p>${data.features ? data.features.join(', ') : "No features listed."}</p>
        </div>
        
        <div style="background-color: #e6f7e6; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #2e7d32;">
          <p><strong>Free Submission Note:</strong></p>
          <p>This property was submitted through the free property listing form by an unregistered user or guest. The email has been verified.</p>
        </div>
        
        <div style="background-color: #fff8e6; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #ef6c00;">
          <p><strong>Admin Action Required:</strong></p>
          <p>This property requires your approval before it will be visible on the website. Please review the details and take appropriate action from the admin dashboard.</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">This property was submitted from your real estate website's free property submission form and requires your approval.</p>
      </div>
    `,
  }),
  
  referralSubmission: (data: any) => ({
    subject: `New Referral Submission: ${data.propertyTitle || "Property Referral"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0;">Real Estate Website - New Referral Submission</h2>
        <p><strong>Referring User:</strong> ${data.referrerName || 'Unknown'} (${data.referrerEmail || 'No email provided'})</p>
        <p><strong>Referring User ID:</strong> ${data.referrerId || "Not available"}</p>
        <p><strong>Referral Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <div style="margin: 15px 0; padding: 15px; border-radius: 5px; background-color: #f0f7ff; border-left: 4px solid #4a6ee0;">
          <h3 style="margin-top: 0; color: #333;">Property Details</h3>
          <p><strong>Property:</strong> ${data.propertyTitle || "Not specified"}</p>
          <p><strong>Property ID:</strong> ${data.propertyId || "Not specified"}</p>
          <p><strong>Price:</strong> ${data.propertyPrice || "Not specified"}</p>
          <p><strong>Location:</strong> ${data.propertyLocation || "Not specified"}</p>
        </div>
        
        <div style="margin: 15px 0; padding: 15px; border-radius: 5px; background-color: #f9f0ff; border-left: 4px solid #9c27b0;">
          <h3 style="margin-top: 0; color: #333;">Referred Client Details</h3>
          <p><strong>Name:</strong> ${data.clientName || "Not provided"}</p>
          <p><strong>Email:</strong> ${data.clientEmail || "Not provided"}</p>
          <p><strong>Phone:</strong> ${data.clientPhone || "Not provided"}</p>
        </div>
        
        <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Additional Notes:</strong></p>
          <p>${data.notes || "No additional notes provided."}</p>
        </div>
        
        <div style="background-color: #fff8e6; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #ef6c00;">
          <p><strong>Admin Action Required:</strong></p>
          <p>This referral has been recorded in the system. Please follow up with the referred client and update the status in the admin dashboard when appropriate.</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">This referral was submitted through your real estate website's referral system.</p>
      </div>
    `,
  }),
};

// Generic function to send an email
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const mailOptions = {
      from: '"Real Estate Platform" <urgentsales.in@gmail.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Contact form submission handler
export async function handleContactForm(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const template = emailTemplates.contactForm({
      name,
      email,
      phone,
      subject,
      message,
    });
    await sendEmail(
      "urgentsales.in@gmail.com",
      template.subject,
      template.html,
    );

    res.json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again later.",
    });
  }
}

// Feedback form submission handler
export async function handleFeedbackForm(req: Request, res: Response) {
  try {
    const { name, email, category, rating, feedback } = req.body;

    if (!name || !email || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and feedback are required",
      });
    }

    const template = emailTemplates.feedbackForm({
      name,
      email,
      category,
      rating,
      feedback,
    });
    await sendEmail(
      "urgentsales.in@gmail.com",
      template.subject,
      template.html,
    );

    res.json({
      success: true,
      message: "Your feedback has been submitted successfully",
    });
  } catch (error) {
    console.error("Feedback form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit your feedback. Please try again later.",
    });
  }
}

// Report problem form submission handler
export async function handleReportProblem(req: Request, res: Response) {
  try {
    const { name, email, category, severity, url, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and description are required",
      });
    }

    const template = emailTemplates.reportProblem({
      name,
      email,
      category,
      severity,
      url,
      description,
    });
    await sendEmail(
      "urgentsales.in@gmail.com",
      template.subject,
      template.html,
    );

    res.json({
      success: true,
      message: "Your report has been submitted successfully",
    });
  } catch (error) {
    console.error("Report problem error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit your report. Please try again later.",
    });
  }
}

// Property interest form submission handler
export async function handlePropertyInterest(req: Request, res: Response) {
  try {
    const {
      name,
      email,
      phone,
      message,
      propertyId,
      propertyTitle,
      propertyPrice,
      propertyLocation,
    } = req.body;

    if (!name || !email || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and property details are required",
      });
    }

    // Get the property's current approval status
    let approvalStatus = "unknown";
    try {
      const property = await req.app.locals.storage.getProperty(propertyId);
      if (property) {
        approvalStatus = property.approvalStatus || "pending";
      }
    } catch (err) {
      console.error("Error fetching property status:", err);
    }

    const template = emailTemplates.propertyInterest({
      name,
      email,
      phone,
      message,
      propertyId,
      propertyTitle,
      propertyPrice,
      propertyLocation,
      approvalStatus,
    });
    await sendEmail(
      "urgentsales.in@gmail.com",
      template.subject,
      template.html,
    );

    res.json({
      success: true,
      message: "Your interest has been submitted successfully",
    });
  } catch (error) {
    console.error("Property interest error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit your interest. Please try again later.",
    });
  }
}
