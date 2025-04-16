import { Router } from 'express';
import { sendEmail } from '../email-service';

const router = Router();

// GET /api/email-test - Test the email service
router.get('/', async (req, res) => {
  try {
    console.log('Testing email service...');
    
    // Send a test email
    const result = await sendEmail({
      to: 'urgentsale.in@gmail.com',
      subject: 'Email Service Test',
      html: `
        <h2>Email Service Test</h2>
        <p>This is a test email to verify that the email service is working correctly.</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    });
    
    if (result.success) {
      console.log('Test email sent successfully:', result);
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        details: result
      });
    } else {
      console.error('Failed to send test email:', result);
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
        details: result
      });
    }
  } catch (error) {
    console.error('Error in email test route:', error);
    return res.status(500).json({
      success: false,
      message: 'Error in email test route',
      error: error.message
    });
  }
});

export default router;