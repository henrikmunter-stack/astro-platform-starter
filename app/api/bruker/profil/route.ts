import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const { name } = body as { name?: string };
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Navn kan ikke være tomt." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (body?.confirm !== "SLETT") {
    return NextResponse.json(
      { error: 'Bekreft kontosletting ved å sende { "confirm": "SLETT" }' },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
