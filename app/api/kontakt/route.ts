import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const { navn, epost, emne, melding } = body as Record<string, string>;

  if (!navn?.trim() || !epost?.trim() || !emne?.trim() || !melding?.trim()) {
    return NextResponse.json(
      { error: "Alle felt må fylles ut." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(epost)) {
    return NextResponse.json({ error: "Ugyldig e-postadresse." }, { status: 400 });
  }

  const html = `
<div style="font-family: sans-serif; max-width: 600px;">
  <h2 style="color: #1B4F72;">Ny henvendelse via kontaktskjema</h2>
  <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="padding: 8px; font-weight: bold; color: #1C2833;">Navn:</td><td style="padding: 8px; color: #5d6b7a;">${navn}</td></tr>
    <tr><td style="padding: 8px; font-weight: bold; color: #1C2833;">E-post:</td><td style="padding: 8px; color: #5d6b7a;"><a href="mailto:${epost}">${epost}</a></td></tr>
    <tr><td style="padding: 8px; font-weight: bold; color: #1C2833;">Emne:</td><td style="padding: 8px; color: #5d6b7a;">${emne}</td></tr>
  </table>
  <div style="margin-top: 16px; padding: 16px; background: #f4f6f7; border-radius: 6px;">
    <p style="font-weight: bold; color: #1C2833; margin: 0 0 8px;">Melding:</p>
    <p style="color: #5d6b7a; white-space: pre-wrap; margin: 0;">${melding}</p>
  </div>
</div>
  `.trim();

  try {
    await sendEmail({
      to: "hei@hjemtrygg.no",
      subject: `Kontaktskjema: ${emne} (fra ${navn})`,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kontaktskjema feil:", error);
    return NextResponse.json(
      { error: "Klarte ikke å sende meldingen. Prøv igjen eller send e-post direkte til hei@hjemtrygg.no." },
      { status: 500 }
    );
  }
}
