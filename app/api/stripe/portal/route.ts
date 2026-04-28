import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, STRIPE_DEMO_MODE } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  if (STRIPE_DEMO_MODE) {
    return NextResponse.json(
      { error: "Stripe er ikke konfigurert." },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Ingen Stripe-kundeID funnet." },
      { status: 404 }
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/app/abonnement`,
  });

  return NextResponse.json({ url: portalSession.url });
}
