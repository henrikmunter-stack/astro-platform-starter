import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFeatureLimit } from "@/lib/plans";
import { z } from "zod";

const documentSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  storageKey: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  sizeBytes: z.number().int().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const limit = getFeatureLimit(subscription, "maxDocuments");

  if (limit === 0) {
    return NextResponse.json({ error: "Dokumentlagring er ikke tilgjengelig på din plan. Oppgrader til Pluss eller Premium." }, { status: 403 });
  }

  const count = await prisma.document.count({ where: { userId: session.user.id } });
  if (isFinite(limit) && count >= limit) {
    return NextResponse.json({ error: `Maks ${limit} dokumenter på din plan.` }, { status: 403 });
  }

  const body = await req.json();
  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig data" }, { status: 400 });

  const doc = await prisma.document.create({
    data: { userId: session.user.id, ...parsed.data },
  });

  return NextResponse.json(doc, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Mangler id" }, { status: 400 });

  const doc = await prisma.document.findUnique({ where: { id } });
  if (doc?.userId !== session.user.id) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });

  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
