import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAI, TRYGGBOT_SYSTEM_PROMPT, DEMO_RESPONSES } from "@/lib/openai";
import { getFeatureLimit, getPlan } from "@/lib/plans";

export const runtime = "nodejs";

let demoResponseIndex = 0;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { message, threadId } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Meldingen er tom" }, { status: 400 });
  }

  const userId = session.user.id;

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const now = new Date();
  const resetAt = subscription?.chatMonthResetAt ?? now;
  const monthsSinceReset =
    (now.getFullYear() - resetAt.getFullYear()) * 12 +
    (now.getMonth() - resetAt.getMonth());

  let chatCount = subscription?.chatMessagesThisMonth ?? 0;
  if (monthsSinceReset >= 1) {
    chatCount = 0;
    await prisma.subscription.upsert({
      where: { userId },
      update: { chatMessagesThisMonth: 0, chatMonthResetAt: now },
      create: { userId, chatMessagesThisMonth: 0, chatMonthResetAt: now },
    });
  }

  const limit = getFeatureLimit(subscription, "chatMessagesPerMonth");
  if (isFinite(limit) && chatCount >= limit) {
    const plan = getPlan(subscription);
    return NextResponse.json(
      {
        error: `Du har brukt opp din kvote på ${limit} meldinger for denne måneden. Oppgrader til ${plan.name === "demo" ? "Basis" : plan.name === "basis" ? "Pluss" : "Premium"} for flere meldinger.`,
        limitReached: true,
      },
      { status: 429 }
    );
  }

  const openai = getOpenAI();

  if (!openai) {
    const response = DEMO_RESPONSES[demoResponseIndex % DEMO_RESPONSES.length];
    demoResponseIndex++;

    let thread = threadId
      ? await prisma.chatThread.findUnique({ where: { id: threadId, userId } })
      : null;

    if (!thread) {
      thread = await prisma.chatThread.create({
        data: { userId, title: message.slice(0, 50) },
      });
    }

    await prisma.chatMessage.createMany({
      data: [
        { threadId: thread.id, role: "user", content: message },
        { threadId: thread.id, role: "assistant", content: response },
      ],
    });

    await prisma.subscription.upsert({
      where: { userId },
      update: { chatMessagesThisMonth: chatCount + 1 },
      create: { userId, chatMessagesThisMonth: 1 },
    });

    return NextResponse.json({
      response,
      threadId: thread.id,
      messagesUsed: chatCount + 1,
      messagesLimit: limit,
    });
  }

  const [checklists, inventoryItems, familyContacts, meetingPoints] =
    await Promise.all([
      prisma.checklist.findMany({
        where: { userId },
        include: { items: true },
        take: 5,
      }),
      prisma.inventoryItem.findMany({ where: { userId }, take: 20 }),
      prisma.familyContact.findMany({ where: { userId }, take: 10 }),
      prisma.meetingPoint.findMany({ where: { userId }, take: 5 }),
    ]);

  const contextLines: string[] = [
    `Brukerens beredskapsdata:`,
    `- Sjekklister: ${checklists.length} stk`,
  ];

  for (const cl of checklists) {
    const checked = cl.items.filter((i) => i.checked).length;
    contextLines.push(`  * "${cl.title}": ${checked}/${cl.items.length} fullført`);
  }

  if (inventoryItems.length > 0) {
    contextLines.push(`- Lagerbeholdning (${inventoryItems.length} varer):`);
    for (const item of inventoryItems.slice(0, 10)) {
      contextLines.push(`  * ${item.name} (${item.category}): ${item.quantity} ${item.unit}`);
    }
  }

  if (familyContacts.length > 0) {
    contextLines.push(`- Familiekontakter: ${familyContacts.map((c) => `${c.name} (${c.role ?? "ukjent rolle"})`).join(", ")}`);
  }

  if (meetingPoints.length > 0) {
    contextLines.push(`- Møtepunkter: ${meetingPoints.map((m) => m.name).join(", ")}`);
  }

  let thread = threadId
    ? await prisma.chatThread.findUnique({
        where: { id: threadId, userId },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      })
    : null;

  if (!thread) {
    thread = await prisma.chatThread.create({
      data: { userId, title: message.slice(0, 50) },
      include: { messages: true },
    });
  }

  const previousMessages = (thread.messages ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  await prisma.chatMessage.create({
    data: { threadId: thread.id, role: "user", content: message },
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${TRYGGBOT_SYSTEM_PROMPT}\n\n${contextLines.join("\n")}`,
        },
        ...previousMessages,
        { role: "user", content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ?? "Beklager, jeg kunne ikke generere et svar akkurat nå.";

    await prisma.chatMessage.create({
      data: { threadId: thread.id, role: "assistant", content: assistantMessage },
    });

    await prisma.subscription.upsert({
      where: { userId },
      update: { chatMessagesThisMonth: chatCount + 1 },
      create: { userId, chatMessagesThisMonth: 1 },
    });

    return NextResponse.json({
      response: assistantMessage,
      threadId: thread.id,
      messagesUsed: chatCount + 1,
      messagesLimit: limit,
    });
  } catch (error) {
    console.error("OpenAI feil:", error);
    return NextResponse.json(
      { error: "Beklager, det oppsto en feil. Prøv igjen." },
      { status: 500 }
    );
  }
}
