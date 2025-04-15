import { Router } from 'express';
import { pool } from '../db';
import { sendEmail } from '../email-service';

const router = Router();

// POST /api/property-interest - Submit interest in a property
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      propertyId,
      propertyTitle,
      propertyPrice,
      propertyLocation
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    console.log(`Received interest for property #${propertyId} from ${name} (${email})`);

    // 1. Save the interest to the database
    const insertQuery = `
      INSERT INTO property_interests (
        property_id, 
        user_name, 
        email, 
        phone, 
        message, 
        created_at
      ) 
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `;

    const result = await pool.query(insertQuery, [
      propertyId,
      name,
      email,
      phone,
      message || ''
    ]);

    const interestId = result.rows[0].id;

    // 2. Get property owner's email
    let ownerEmail = 'urgentsale.in@gmail.com'; // Default fallback email
    let contactName = 'Property Owner';
    
    try {
      // First try to get from regular properties table
      const propertyQuery = `
        SELECT contact_email, contact_name FROM properties 
        WHERE id = $1
      `;
      
      let propertyResult = await pool.query(propertyQuery, [propertyId]);
      
      // If not found, try free_properties table
      if (propertyResult.rows.length === 0) {
        const freePropertyQuery = `
          SELECT contact_email, contact_name FROM free_properties 
          WHERE id = $1
        `;
        
        propertyResult = await pool.query(freePropertyQuery, [propertyId]);
      }
      
      // If we found the property, get the owner's email
      if (propertyResult.rows.length > 0) {
        ownerEmail = propertyResult.rows[0].contact_email || ownerEmail;
        contactName = propertyResult.rows[0].contact_name || contactName;
      }
    } catch (error) {
      console.error('Error getting property owner email:', error);
      // Continue with the default email
    }

    // 3. Send email to property owner
    const ownerEmailSubject = `New Interest in Your Property: ${propertyTitle || `Property #${propertyId}`}`;
    const ownerEmailBody = `
      <h2>New Interest in Your Property</h2>
      <p>Someone has expressed interest in your property.</p>
      
      <h3>Property Details:</h3>
      <ul>
        <li><strong>Property ID:</strong> ${propertyId}</li>
        <li><strong>Title:</strong> ${propertyTitle || 'Not specified'}</li>
        <li><strong>Price:</strong> ${propertyPrice ? `₹${propertyPrice.toLocaleString()}` : 'Not specified'}</li>
        <li><strong>Location:</strong> ${propertyLocation || 'Not specified'}</li>
      </ul>
      
      <h3>Interested Buyer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Message:</strong> ${message || 'No message provided'}</li>
      </ul>
      
      <p>Please contact the interested buyer as soon as possible.</p>
      <p>Thank you for using our platform!</p>
    `;

    await sendEmail({
      to: ownerEmail,
      subject: ownerEmailSubject,
      html: ownerEmailBody,
      cc: 'urgentsale.in@gmail.com' // Always CC the admin
    });

    // 4. Send confirmation email to the interested buyer
    const buyerEmailSubject = `Your Interest in Property: ${propertyTitle || `Property #${propertyId}`}`;
    const buyerEmailBody = `
      <h2>Thank You for Your Interest</h2>
      <p>We have received your interest in the following property:</p>
      
      <h3>Property Details:</h3>
      <ul>
        <li><strong>Property ID:</strong> ${propertyId}</li>
        <li><strong>Title:</strong> ${propertyTitle || 'Not specified'}</li>
        <li><strong>Price:</strong> ${propertyPrice ? `₹${propertyPrice.toLocaleString()}` : 'Not specified'}</li>
        <li><strong>Location:</strong> ${propertyLocation || 'Not specified'}</li>
      </ul>
      
      <p>The property owner (${contactName}) has been notified of your interest and will contact you shortly.</p>
      
      <p>If you have any questions, please reply to this email or contact us at urgentsale.in@gmail.com.</p>
      
      <p>Thank you for using our platform!</p>
    `;

    await sendEmail({
      to: email,
      subject: buyerEmailSubject,
      html: buyerEmailBody
    });

    // 5. Return success response
    return res.status(200).json({
      success: true,
      message: 'Interest submitted successfully',
      data: {
        interestId,
        propertyId
      }
    });

  } catch (error) {
    console.error('Error submitting property interest:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit interest. Please try again later.'
    });
  }
});

export default router;