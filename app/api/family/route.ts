import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFeatureLimit } from "@/lib/plans";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  role: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const meetingPointSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  priority: z.number().int().min(1).max(3).default(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const [contacts, meetingPoints] = await Promise.all([
    prisma.familyContact.findMany({ where: { userId: session.user.id }, orderBy: { name: "asc" } }),
    prisma.meetingPoint.findMany({ where: { userId: session.user.id }, orderBy: { priority: "asc" } }),
  ]);

  return NextResponse.json({ contacts, meetingPoints });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "contact";
  const body = await req.json();

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });

  if (type === "contact") {
    const limit = getFeatureLimit(subscription, "maxFamilyContacts");
    const count = await prisma.familyContact.count({ where: { userId: session.user.id } });
    if (isFinite(limit) && count >= limit) {
      return NextResponse.json({ error: `Maks ${limit} kontakter på din plan.` }, { status: 403 });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });
    const contact = await prisma.familyContact.create({
      data: { userId: session.user.id, ...parsed.data },
    });
    return NextResponse.json(contact, { status: 201 });
  }

  if (type === "meetingpoint") {
    const parsed = meetingPointSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });
    const mp = await prisma.meetingPoint.create({
      data: { userId: session.user.id, ...parsed.data },
    });
    return NextResponse.json(mp, { status: 201 });
  }

  return NextResponse.json({ error: "Ugyldig type" }, { status: 400 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") ?? "contact";
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  const body = await req.json();

  if (type === "contact") {
    const existing = await prisma.familyContact.findUnique({ where: { id } });
    if (existing?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    const parsed = contactSchema.partial().safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });
    const updated = await prisma.familyContact.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  }

  if (type === "meetingpoint") {
    const existing = await prisma.meetingPoint.findUnique({ where: { id } });
    if (existing?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    const parsed = meetingPointSchema.partial().safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });
    const updated = await prisma.meetingPoint.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Ugyldig type" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") ?? "contact";
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  if (type === "contact") {
    const existing = await prisma.familyContact.findUnique({ where: { id } });
    if (existing?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    await prisma.familyContact.delete({ where: { id } });
  } else if (type === "meetingpoint") {
    const existing = await prisma.meetingPoint.findUnique({ where: { id } });
    if (existing?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    await prisma.meetingPoint.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}
