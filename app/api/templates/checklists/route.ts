import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TEMPLATES, getTemplateQuota } from "@/lib/checklist-templates";

export async function GET() {
  const session = await auth();

  let userPlan = "demo";
  let templatesUsed = 0;

  if (session?.user?.id) {
    const subscription = await prisma.subscription
      .findUnique({ where: { userId: session.user.id } })
      .catch(() => null);
    userPlan = subscription?.plan ?? "demo";
    templatesUsed = subscription?.templatesUsed ?? 0;
  }

  const quota = getTemplateQuota(userPlan);

  return NextResponse.json({
    templates: TEMPLATES,
    userPlan,
    templatesUsed,
    quota,
  });
}
