
import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const SUBSCRIPTION_PRICES = {
  paid: 30000, // ₹300 in paise
  premium: 50000, // ₹500 in paise
};

export async function createCheckoutSession(req: Request, res: Response) {
  const { level, successUrl, cancelUrl } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: level === 'paid' ? 'Enhanced Listing' : 'Premium Listing',
            },
            unit_amount: SUBSCRIPTION_PRICES[level],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
