import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const getAdPlacements = async (req: Request, res: Response) => {
  try {
    const adPlacements = await prisma.adPlacement.findMany({
      orderBy: {
        price: 'asc',
      },
    });
    
    res.json(adPlacements);
  } catch (error) {
    console.error('Error fetching ad placements:', error);
    res.status(500).json({ error: 'Failed to fetch ad placements' });
  }
};

export const createAdPlacementOrder = async (req: Request, res: Response) => {
  try {
    const { placementId, planType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get the ad placement
    const adPlacement = await prisma.adPlacement.findUnique({
      where: { id: placementId },
    });

    if (!adPlacement) {
      return res.status(404).json({ error: 'Ad placement not found' });
    }

    // Calculate price based on plan type
    let price = adPlacement.price;
    if (planType === 'premium') {
      price = adPlacement.premiumPrice || adPlacement.price * 2;
    } else if (planType === 'elite') {
      price = adPlacement.elitePrice || adPlacement.price * 3;
    }

    // Create Razorpay order
    const options = {
      amount: price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `adplacement_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order details to database
    await prisma.adPlacementOrder.create({
      data: {
        userId,
        adPlacementId: placementId,
        planType,
        amount: price,
        razorpayOrderId: order.id,
        status: 'PENDING',
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating ad placement order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyAdPlacementPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find the order in our database
    const order = await prisma.adPlacementOrder.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update order status
    await prisma.adPlacementOrder.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
    });

    // Create the ad placement subscription
    const adPlacement = await prisma.adPlacement.findUnique({
      where: { id: order.adPlacementId },
    });

    if (!adPlacement) {
      return res.status(404).json({ error: 'Ad placement not found' });
    }

    // Calculate validity period based on billing type
    let validUntil = new Date();
    if (adPlacement.billingType === 'MONTHLY') {
      validUntil.setMonth(validUntil.getMonth() + 1);
    } else if (adPlacement.billingType === 'ONE_TIME') {
      // For one-time placements, set validity to 3 months
      validUntil.setMonth(validUntil.getMonth() + 3);
    }

    // Create the subscription
    await prisma.adPlacementSubscription.create({
      data: {
        userId,
        adPlacementId: order.adPlacementId,
        planType: order.planType,
        orderId: order.id,
        startDate: new Date(),
        endDate: validUntil,
        status: 'ACTIVE',
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying ad placement payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};