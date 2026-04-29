import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  if (!resend) throw new Error("RESEND_API_KEY ikke konfigurert");
  return resend.emails.send({
    from: "HjemTrygg <onboarding@resend.dev>", // TODO: Bytt til noreply@hjemtrygg.no når domenet er verifisert i Resend
    to,
    subject,
    html,
  });
}

export function magicLinkEmailHtml(url: string): string {
  return `
<!DOCTYPE html>
<html lang="nb">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f6f7; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e9ec; overflow: hidden;">
    <div style="background: #1B4F72; padding: 28px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">HjemTrygg</h1>
      <p style="color: #a8d1f0; margin: 4px 0 0; font-size: 13px;">Din digitale beredskapsportal</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #1C2833; font-size: 18px; font-weight: 600; margin: 0 0 12px;">Din innloggingslenke</h2>
      <p style="color: #5d6b7a; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        Klikk på knappen nedenfor for å logge inn på HjemTrygg. Lenken er gyldig i 24 timer og kan kun brukes én gang.
      </p>
      <div style="text-align: center; margin: 0 0 28px;">
        <a href="${url}" style="display: inline-block; background: #1B4F72; color: #ffffff; font-weight: 600; font-size: 15px; padding: 13px 32px; border-radius: 6px; text-decoration: none;">
          Logg inn på HjemTrygg
        </a>
      </div>
      <p style="color: #5d6b7a; font-size: 13px; line-height: 1.5; margin: 0;">
        Har du ikke bedt om denne lenken? Da kan du trygt ignorere denne e-posten.
      </p>
    </div>
    <div style="background: #f4f6f7; padding: 16px 32px; border-top: 1px solid #e5e9ec; text-align: center;">
      <p style="color: #9aabb8; font-size: 12px; margin: 0;">
        HjemTrygg AS &middot; Sagesundveien 133, 4904 Tvedestrand &middot;
        <a href="https://hjemtrygg.no" style="color: #9aabb8;">hjemtrygg.no</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
