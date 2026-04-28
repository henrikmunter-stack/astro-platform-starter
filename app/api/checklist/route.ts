import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFeatureLimit } from "@/lib/plans";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  items: z.array(z.object({ text: z.string().min(1), checked: z.boolean().optional() })).optional(),
});

const updateItemSchema = z.object({
  itemId: z.string(),
  checked: z.boolean(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const checklists = await prisma.checklist.findMany({
    where: { userId: session.user.id },
    include: { items: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(checklists);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const limit = getFeatureLimit(subscription, "maxChecklists");
  const currentCount = await prisma.checklist.count({ where: { userId: session.user.id } });

  if (isFinite(limit) && currentCount >= limit) {
    return NextResponse.json({ error: `Du kan maks ha ${limit} sjekklister på din plan.` }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });

  const checklist = await prisma.checklist.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      items: parsed.data.items
        ? {
            create: parsed.data.items.map((item, i) => ({
              text: item.text,
              checked: item.checked ?? false,
              order: i,
            })),
          }
        : undefined,
    },
    include: { items: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(checklist, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const body = await req.json();
  const parsed = updateItemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });

  const item = await prisma.checklistItem.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) return NextResponse.json({ error: "Item ikke funnet" }, { status: 404 });

  const checklist = await prisma.checklist.findUnique({ where: { id: item.checklistId } });
  if (checklist?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });

  const updated = await prisma.checklistItem.update({
    where: { id: parsed.data.itemId },
    data: { checked: parsed.data.checked },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  const checklist = await prisma.checklist.findUnique({ where: { id } });
  if (checklist?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });

  await prisma.checklist.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
