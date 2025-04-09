import { Router } from 'express';
import { pool } from '../db';
import { isAuthenticated } from '../auth';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Get all ad packages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ad_packages 
      WHERE is_active = true 
      ORDER BY price ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ad packages:', error);
    res.status(500).json({ message: 'Failed to fetch ad packages' });
  }
});

// Get user's active subscription
router.get('/my-subscription', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const result = await pool.query(`
      SELECT us.*, ap.name, ap.ad_listings
      FROM user_subscriptions us
      JOIN ad_packages ap ON us.package_id = ap.id
      WHERE us.user_id = $1 AND us.is_active = true AND us.end_date > NOW()
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [userId]);
    
    if (result.rows.length === 0) {
      return res.json({ hasActiveSubscription: false });
    }
    
    const subscription = result.rows[0];
    
    res.json({
      hasActiveSubscription: true,
      subscription: {
        id: subscription.id,
        name: subscription.name,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        properties_listed: subscription.properties_listed,
        properties_remaining: subscription.properties_remaining
      }
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ message: 'Failed to fetch subscription details' });
  }
});

// Create Razorpay order
router.post('/create-order', isAuthenticated, async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user?.id;
    
    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    
    // Get package details
    const packageResult = await pool.query('SELECT * FROM ad_packages WHERE id = $1', [packageId]);
    
    if (packageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    const packageDetails = packageResult.rows[0];
    
    // Calculate amount (in paise for Razorpay)
    const basePrice = packageDetails.discounted_price > 0 ? packageDetails.discounted_price : packageDetails.price;
    const gstRate = 0.18; // 18% GST
    const gstAmount = basePrice * gstRate;
    const totalAmount = basePrice + gstAmount;
    
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        packageId: packageId
      }
    });
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      packageDetails,
      basePrice,
      gstAmount: Math.round(gstAmount),
      totalAmount: Math.round(totalAmount)
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Verify payment and activate subscription
router.post('/verify-payment', isAuthenticated, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const userId = req.user?.id;
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Get order details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const packageId = order.notes.packageId;
    
    // Get package details
    const packageResult = await pool.query('SELECT * FROM ad_packages WHERE id = $1', [packageId]);
    
    if (packageResult.rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    const packageDetails = packageResult.rows[0];
    
    // Calculate amount
    const basePrice = packageDetails.discounted_price > 0 ? packageDetails.discounted_price : packageDetails.price;
    const gstRate = 0.18; // 18% GST
    const gstAmount = basePrice * gstRate;
    const totalAmount = basePrice + gstAmount;
    
    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + packageDetails.plan_validity_months);
    
    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Deactivate any existing active subscriptions
      await client.query(`
        UPDATE user_subscriptions 
        SET is_active = false 
        WHERE user_id = $1 AND is_active = true
      `, [userId]);
      
      // Create new subscription
      const subscriptionResult = await client.query(`
        INSERT INTO user_subscriptions (
          user_id, package_id, payment_id, payment_status, 
          amount_paid, gst_amount, total_amount, 
          start_date, end_date, is_active, 
          properties_listed, properties_remaining
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `, [
        userId, packageId, razorpay_payment_id, 'completed',
        basePrice, gstAmount, totalAmount,
        startDate, endDate, true,
        0, packageDetails.ad_listings
      ]);
      
      // Update user's subscription level
      await client.query(`
        UPDATE users 
        SET subscription_level = $1 
        WHERE id = $2
      `, [packageDetails.name, userId]);
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: 'Payment verified and subscription activated',
        subscriptionId: subscriptionResult.rows[0].id
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

export default router;