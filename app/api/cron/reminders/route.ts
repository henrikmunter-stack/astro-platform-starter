import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Ugyldig nøkkel" }, { status: 401 });
  }

  const now = new Date();
  const in14Days = new Date();
  in14Days.setDate(in14Days.getDate() + 14);

  const items = await prisma.inventoryItem.findMany({
    where: {
      reminderDate: { lte: in14Days },
      reminderSentAt: null,
    },
    include: { user: { select: { email: true, name: true } } },
  });

  if (items.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  // Group by userId
  const byUser = new Map<string, { email: string; name: string | null; items: typeof items }>();
  for (const item of items) {
    if (!item.user.email) continue;
    if (!byUser.has(item.userId)) {
      byUser.set(item.userId, { email: item.user.email, name: item.user.name, items: [] });
    }
    byUser.get(item.userId)!.items.push(item);
  }

  let sent = 0;
  const sentIds: string[] = [];

  for (const { email, name, items: userItems } of Array.from(byUser.values())) {
    const overdue = userItems.filter((i) => i.reminderDate! < now);
    const upcoming = userItems.filter((i) => i.reminderDate! >= now);

    const itemRows = (list: typeof userItems, label: string) =>
      list.length === 0
        ? ""
        : `<tr><td colspan="2" style="padding: 12px 0 4px; font-weight: 600; color: #1C2833; font-size: 13px;">${label}</td></tr>` +
          list
            .map(
              (i) => `
        <tr>
          <td style="padding: 6px 0; color: #1C2833; font-size: 14px; border-bottom: 1px solid #f4f6f7;">
            ${i.name} <span style="color: #5d6b7a; font-size: 12px;">(${i.category})</span>
          </td>
          <td style="padding: 6px 0; color: #5d6b7a; font-size: 13px; text-align: right; border-bottom: 1px solid #f4f6f7;">
            ${i.reminderDate!.toLocaleDateString("nb-NO")}
          </td>
        </tr>`
            )
            .join("");

    const html = `
<!DOCTYPE html>
<html lang="nb">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f6f7; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e9ec; overflow: hidden;">
    <div style="background: #1B4F72; padding: 28px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">HjemTrygg</h1>
      <p style="color: #a8d1f0; margin: 4px 0 0; font-size: 13px;">Din digitale beredskapsportal</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1C2833; font-size: 18px; font-weight: 600; margin: 0 0 8px;">Tid for å rotere lageret ditt</h2>
      <p style="color: #5d6b7a; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Hei${name ? ` ${name.split(" ")[0]}` : ""}! Du har ${userItems.length} vare${userItems.length !== 1 ? "r" : ""} i beredskapslageret som snart må roteres eller byttes.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 0 0 8px; color: #5d6b7a; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e9ec;">Vare</th>
            <th style="text-align: right; padding: 0 0 8px; color: #5d6b7a; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e9ec;">Dato</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows(overdue, "⚠️ Forfalt")}
          ${itemRows(upcoming, "📅 Kommende (innen 14 dager)")}
        </tbody>
      </table>
      <div style="margin-top: 28px; text-align: center;">
        <a href="https://hjemtrygg.no/app/lager" style="display: inline-block; background: #1B4F72; color: #ffffff; font-weight: 600; font-size: 15px; padding: 13px 32px; border-radius: 6px; text-decoration: none;">
          Åpne lageroversikten
        </a>
      </div>
    </div>
    <div style="background: #f4f6f7; padding: 16px 32px; border-top: 1px solid #e5e9ec; text-align: center;">
      <p style="color: #9aabb8; font-size: 12px; margin: 0;">
        HjemTrygg AS &middot; <a href="https://hjemtrygg.no" style="color: #9aabb8;">hjemtrygg.no</a>
      </p>
    </div>
  </div>
</body>
</html>`.trim();

    try {
      await sendEmail({
        to: email,
        subject: "Tid for å rotere lageret ditt — HjemTrygg",
        html,
      });
      sentIds.push(...userItems.map((i) => i.id));
      sent++;
    } catch {
      // continue to next user
    }
  }

  if (sentIds.length > 0) {
    await prisma.inventoryItem.updateMany({
      where: { id: { in: sentIds } },
      data: { reminderSentAt: now },
    });
  }

  return NextResponse.json({ sent, itemsMarked: sentIds.length });
}
