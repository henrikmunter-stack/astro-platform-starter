import Stripe from "stripe";

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const plan = (url.searchParams.get("plan") || "Pluss").toLowerCase();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const priceMap = {
      basis: process.env.STRIPE_PRICE_BASIS,
      pluss: process.env.STRIPE_PRICE_PLUS,
      familie: process.env.STRIPE_PRICE_FAMILIE,
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      return new Response(JSON.stringify({ error: `Unknown plan: ${plan}` }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const siteUrl = (process.env.SITE_URL || "https://hjemtrygg.netlify.app").replace(/\/+$/, "");

    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/kom-i-gang?paid=1&plan=${encodeURIComponent(plan)}`,
      cancel_url: `${siteUrl}/abonnement?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

