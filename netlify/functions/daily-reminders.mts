import { schedule } from "@netlify/functions";

// 07:00 UTC = 08:00 CET (vinter) / 09:00 CEST (sommer)
export const handler = schedule("0 7 * * *", async () => {
  const baseUrl = process.env.URL ?? process.env.NEXTAUTH_URL ?? "https://hjemtrygg.no";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("CRON_SECRET er ikke satt");
    return { statusCode: 500 };
  }

  try {
    const response = await fetch(`${baseUrl}/api/cron/reminders`, {
      method: "POST",
      headers: {
        "x-cron-secret": secret,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Daglig påminnelse kjørt:", data);
    return { statusCode: 200 };
  } catch (error) {
    console.error("Feil ved kjøring av påminnelse:", error);
    return { statusCode: 500 };
  }
});
