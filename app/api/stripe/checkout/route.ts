import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, STRIPE_DEMO_MODE } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLANS, PlanKey } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  if (STRIPE_DEMO_MODE) {
    return NextResponse.json(
      { error: "Stripe er ikke konfigurert. Legg til STRIPE_SECRET_KEY i miljøvariabler." },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;
  const { priceId, planKey } = await req.json();

  if (!priceId) {
    return NextResponse.json({ error: "Mangler priceId" }, { status: 400 });
  }

  const plan = Object.values(PLANS).find((p) => p.stripePriceId === priceId);
  if (!plan) {
    return NextResponse.json({ error: "Ugyldig plan" }, { status: 400 });
  }

  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: {
        userId: session.user.id,
        stripeCustomerId: customerId,
        plan: "demo",
        status: "free",
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/app/abonnement?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/priser`,
    metadata: { userId: session.user.id, planKey: planKey ?? "" },
    subscription_data: {
      metadata: { userId: session.user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
