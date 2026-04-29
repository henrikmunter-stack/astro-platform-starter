import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, checklists, inventory, contacts, meetingPoints, documents] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, createdAt: true },
      }),
      prisma.checklist.findMany({
        where: { userId },
        include: { items: true },
      }),
      prisma.inventoryItem.findMany({ where: { userId } }),
      prisma.familyContact.findMany({ where: { userId } }),
      prisma.meetingPoint.findMany({ where: { userId } }),
      prisma.document.findMany({ where: { userId } }),
    ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user,
    checklists,
    inventory,
    familyContacts: contacts,
    meetingPoints,
    documents,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="hjemtrygg-data-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
