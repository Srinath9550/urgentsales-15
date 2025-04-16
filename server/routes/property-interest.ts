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
    // Check if the user is authenticated
    const userId = req.isAuthenticated() ? req.user.id : null;
    
    // First, let's check the actual structure of the property_interests table
    let interestId;
    try {
      const tableInfoQuery = `
        SELECT column_name, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'property_interests'
        ORDER BY ordinal_position
      `;
      const tableInfo = await pool.query(tableInfoQuery);
      console.log('Property interests table structure:', tableInfo.rows);
      
      // Check if user_id column exists and if it's nullable
      const userIdColumn = tableInfo.rows.find(col => col.column_name === 'user_id');
      const userIdRequired = userIdColumn && userIdColumn.is_nullable === 'NO';
      
      console.log('User ID column info:', userIdColumn);
      console.log('User ID required:', userIdRequired);
      
      // Construct the query based on the actual table structure
      let insertQuery;
      let queryParams;
      
      if (userIdColumn) {
        // If user_id column exists
        if (userIdRequired && !userId) {
          // If user_id is required but we don't have a value, use a default value (0 for non-authenticated users)
          insertQuery = `
            INSERT INTO property_interests (
              property_id, 
              user_id,
              user_name, 
              email, 
              phone, 
              message, 
              created_at
            ) 
            VALUES ($1, 0, $2, $3, $4, $5, NOW())
            RETURNING id
          `;
          queryParams = [propertyId, name, email, phone, message || ''];
        } else {
          // If user_id is nullable or we have a value
          insertQuery = `
            INSERT INTO property_interests (
              property_id, 
              user_id,
              user_name, 
              email, 
              phone, 
              message, 
              created_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id
          `;
          queryParams = [propertyId, userId || 0, name, email, phone, message || ''];
        }
      } else {
        // If user_id column doesn't exist
        insertQuery = `
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
        queryParams = [propertyId, name, email, phone, message || ''];
      }
      
      console.log('Executing query:', insertQuery);
      console.log('With parameters:', queryParams);
      
      const insertResult = await pool.query(insertQuery, queryParams);
      interestId = insertResult.rows[0].id;
      console.log('Interest saved with ID:', interestId);
      
    } catch (error) {
      console.error('Error checking table structure or inserting interest:', error);
      throw error;
    }

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

    // 3. Send email to admin (urgentsale.in@gmail.com)
    console.log(`Sending email to admin: urgentsale.in@gmail.com`);
    const adminEmailResult = await sendEmail({
      to: 'urgentsale.in@gmail.com',
      subject: ownerEmailSubject,
      html: ownerEmailBody,
      cc: ownerEmail !== 'urgentsale.in@gmail.com' ? ownerEmail : undefined // CC the property owner if different from admin
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send email to admin:', adminEmailResult.error);
      // Continue with the process even if admin email fails
    } else {
      console.log('Successfully sent email to admin');
    }

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

    console.log(`Sending confirmation email to buyer: ${email}`);
    const buyerEmailResult = await sendEmail({
      to: email,
      subject: buyerEmailSubject,
      html: buyerEmailBody
    });

    if (!buyerEmailResult.success) {
      console.error('Failed to send confirmation email to buyer:', buyerEmailResult.error);
      // Continue with the process even if buyer email fails
    } else {
      console.log('Successfully sent confirmation email to buyer');
    }

    // 5. Return success response
    return res.status(200).json({
      success: true,
      message: 'Interest submitted successfully',
      data: {
        propertyId
      }
    });

  } catch (error) {
    console.error('Error submitting property interest:', error);
    
    // Provide more detailed error message for debugging
    let errorMessage = 'Failed to submit interest. Please try again later.';
    if (error.message && error.message.includes('Email sending failed')) {
      errorMessage = 'Your interest was recorded, but there was an issue sending email notifications. The team will still be notified of your interest.';
      
      // Log additional details for email errors
      console.error('Email error details:', error);
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

export default router;