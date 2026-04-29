import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = "nodejs";

function getPlanFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_ID_BASIS) return "basis";
  if (priceId === process.env.STRIPE_PRICE_ID_PLUSS) return "pluss";
  if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) return "premium";
  return "demo";
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe ikke konfigurert" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Mangler signatur" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Ugyldig signatur" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        if (!userId) break;

        const stripeSubscription = await stripe.subscriptions.retrieve(
          checkoutSession.subscription as string
        );
        const priceId = stripeSubscription.items.data[0]?.price.id ?? "";
        const plan = getPlanFromPriceId(priceId);

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            stripeCustomerId: checkoutSession.customer as string,
            status: "active",
            plan,
            stripeCurrentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
          },
          create: {
            userId,
            stripeCustomerId: checkoutSession.customer as string,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            status: "active",
            plan,
            stripeCurrentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
          },
        });

        await prisma.auditLog.create({
          data: {
            userId,
            action: "subscription.created",
            details: `Plan: ${plan}, PriceId: ${priceId}`,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan = getPlanFromPriceId(priceId);

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status === "active" ? "active" : sub.status,
            plan,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "canceled", plan: "demo" },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (subscription) {
          await prisma.auditLog.create({
            data: {
              userId: subscription.userId,
              action: "invoice.paid",
              details: `Beløp: ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency?.toUpperCase()}`,
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: { status: "past_due" },
        });

        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (subscription) {
          await prisma.auditLog.create({
            data: {
              userId: subscription.userId,
              action: "invoice.payment_failed",
              details: `Faktura-ID: ${invoice.id}`,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook feil:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
