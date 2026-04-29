import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeClient;
}

export const stripe = getStripe();

export const STRIPE_DEMO_MODE = !process.env.STRIPE_SECRET_KEY;

export const PLAN_PRICE_MAP: Record<string, string> = {
  basis: process.env.STRIPE_PRICE_ID_BASIS ?? "",
  pluss: process.env.STRIPE_PRICE_ID_PLUSS ?? "",
  premium: process.env.STRIPE_PRICE_ID_PREMIUM ?? "",
};
