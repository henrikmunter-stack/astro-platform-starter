import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFeatureLimit } from "@/lib/plans";
import { z } from "zod";

const VALID_CATEGORIES = ["mat", "vann", "medisiner", "utstyr", "sikkerhetsutstyr", "annet"] as const;

const itemSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(VALID_CATEGORIES),
  quantity: z.number().positive(),
  unit: z.enum(["liter", "stk", "kg", "dager"]),
  expiresAt: z.string().optional().nullable(),
  reminderDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const items = await prisma.inventoryItem.findMany({
    where: { userId: session.user.id },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const limit = getFeatureLimit(subscription, "maxInventoryItems");
  const currentCount = await prisma.inventoryItem.count({ where: { userId: session.user.id } });

  if (isFinite(limit) && currentCount >= limit) {
    return NextResponse.json({ error: `Du kan maks ha ${limit} lagervarer på din plan.` }, { status: 403 });
  }

  const body = await req.json();

  // Handle bulk creation for safety equipment presets
  if (Array.isArray(body)) {
    const items = await prisma.$transaction(
      body.map((rawItem) => {
        const parsed = itemSchema.safeParse(rawItem);
        if (!parsed.success) throw new Error("Ugyldig data i bulk");
        return prisma.inventoryItem.create({
          data: {
            userId: session.user.id!,
            ...parsed.data,
            expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
            reminderDate: parsed.data.reminderDate ? new Date(parsed.data.reminderDate) : null,
          },
        });
      })
    );
    return NextResponse.json(items, { status: 201 });
  }

  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig data", details: parsed.error.issues }, { status: 400 });

  const item = await prisma.inventoryItem.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      reminderDate: parsed.data.reminderDate ? new Date(parsed.data.reminderDate) : null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (existing?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });

  const body = await req.json();
  const parsed = itemSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });

  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt !== undefined ? (parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null) : undefined,
      reminderDate: parsed.data.reminderDate !== undefined ? (parsed.data.reminderDate ? new Date(parsed.data.reminderDate) : null) : undefined,
      reminderSentAt: null, // reset so a new reminder can be sent
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  const existing = await prisma.inventoryItem.findUnique({ where: { id } });
  if (existing?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });

  await prisma.inventoryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
