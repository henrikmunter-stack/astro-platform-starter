import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccess } from "@/lib/plans";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { BeredskapsplanDocument } from "@/lib/pdf/BeredskapsplanDocument";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!canAccess(subscription, "canExport")) {
    return NextResponse.json(
      { error: "PDF-eksport krever Pluss- eller Premium-abonnement." },
      { status: 403 }
    );
  }

  const [checklists, inventoryItems, contacts, meetingPoints] = await Promise.all([
    prisma.checklist.findMany({
      where: { userId: session.user.id },
      include: { items: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.inventoryItem.findMany({
      where: { userId: session.user.id },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.familyContact.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.meetingPoint.findMany({
      where: { userId: session.user.id },
      orderBy: { priority: "asc" },
    }),
  ]);

  const generatedAt = new Date().toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const buffer = await renderToBuffer(
    createElement(BeredskapsplanDocument, {
      userName: session.user.name ?? null,
      generatedAt,
      checklists,
      inventoryItems,
      contacts,
      meetingPoints,
    })
  );

  const filename = `hjemtrygg-beredskapsplan-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.byteLength),
    },
  });
}
