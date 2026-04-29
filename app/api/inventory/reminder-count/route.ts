import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ count: 0 });

  const in14Days = new Date();
  in14Days.setDate(in14Days.getDate() + 14);

  const count = await prisma.inventoryItem.count({
    where: {
      userId: session.user.id,
      reminderDate: { lte: in14Days },
    },
  });

  return NextResponse.json({ count });
}
