
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

export const createSubscriptionCheckout = async (level: 'paid' | 'premium') => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      level,
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
    }),
  });

  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  return stripe.redirectToCheckout({ sessionId });
};
