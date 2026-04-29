import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";
import Link from "next/link";
import {
  ClipboardList,
  Package,
  Users,
  FileText,
  Bot,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/logg-inn");

  const userId = session.user.id;

  const [subscription, checklists, inventoryItems, contacts, documents] =
    await Promise.all([
      prisma.subscription.findUnique({ where: { userId } }).catch(() => null),
      prisma.checklist.findMany({ where: { userId }, include: { items: true } }).catch(() => []),
      prisma.inventoryItem.findMany({ where: { userId } }).catch(() => []),
      prisma.familyContact.findMany({ where: { userId } }).catch(() => []),
      prisma.document.findMany({ where: { userId } }).catch(() => []),
    ]);

  const plan = getPlan(subscription);

  const totalItems = checklists.flatMap((c) => c.items);
  const checkedItems = totalItems.filter((i) => i.checked);
  const completionRate =
    totalItems.length > 0
      ? Math.round((checkedItems.length / totalItems.length) * 100)
      : 0;

  const expiringCount = inventoryItems.filter((item) => {
    if (!item.expiresAt) return false;
    const daysUntil = Math.floor(
      (new Date(item.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 30;
  }).length;

  const isDemo = !subscription || subscription.plan === "demo";

  const firstName = session.user.name?.split(" ")[0] ?? "deg";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1C2833]">God dag, {firstName}</h1>
        <p className="text-[#5d6b7a] mt-1">Her er en oversikt over din beredskapsplan.</p>
      </div>

      {isDemo && (
        <div className="bg-[#D4AC0D]/10 border border-[#D4AC0D]/30 rounded-lg p-4 mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-[#1C2833] text-sm">Du er på Demo-planen</p>
            <p className="text-[#5d6b7a] text-sm">
              Oppgrader for ubegrenset tilgang til sjekklister, lagervarer og TryggBot.
            </p>
          </div>
          <Link
            href="/priser"
            className="flex-shrink-0 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
          >
            Se planer
          </Link>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#1B4F72]" aria-hidden="true" />
            <h2 className="font-semibold text-[#1C2833]">Beredskapsgrad</h2>
          </div>
          <span className="text-2xl font-semibold text-[#1B4F72]">{completionRate}%</span>
        </div>
        <div className="w-full bg-[#e5e9ec] rounded-full h-3">
          <div
            className="bg-[#1B4F72] h-3 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
            role="progressbar"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Beredskapsgrad: ${completionRate}%`}
          />
        </div>
        <p className="text-[#5d6b7a] text-sm mt-2">
          {checkedItems.length} av {totalItems.length} sjekkliste-punkter fullført
        </p>
      </div>

      {expiringCount > 0 && (
        <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#C0392B] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[#1C2833]">
            <strong>{expiringCount} vare(r)</strong> i lageret utløper innen 30 dager.{" "}
            <Link href="/app/lager" className="text-[#C0392B] underline">Sjekk lageret</Link>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            href: "/app/sjekklister",
            icon: ClipboardList,
            label: "Sjekklister",
            count: checklists.length,
            sub: `${completionRate}% fullført`,
          },
          {
            href: "/app/lager",
            icon: Package,
            label: "Mitt lager",
            count: inventoryItems.length,
            sub: "lagervarer",
          },
          {
            href: "/app/familieplan",
            icon: Users,
            label: "Familieplan",
            count: contacts.length,
            sub: "kontakter",
          },
          {
            href: "/app/dokumenter",
            icon: FileText,
            label: "Dokumenter",
            count: documents.length,
            sub: "filer lagret",
          },
        ].map(({ href, icon: Icon, label, count, sub }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-5 hover:border-[#1B4F72] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-md bg-[#1B4F72]/10 flex items-center justify-center">
                <Icon size={20} className="text-[#1B4F72]" aria-hidden="true" />
              </div>
              <span className="text-2xl font-semibold text-[#1B4F72]">{count}</span>
            </div>
            <p className="font-medium text-[#1C2833] text-sm group-hover:text-[#1B4F72]">{label}</p>
            <p className="text-[#5d6b7a] text-xs mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-[#1B4F72] rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={18} aria-hidden="true" />
              <h2 className="font-semibold">TryggBot</h2>
            </div>
            <p className="text-blue-200 text-sm">
              Din personlige beredskapsassistent. Still spørsmål om nødpreparasjon, lagring og familieplan.
            </p>
          </div>
          <Link
            href="/app/tryggbot"
            className="flex-shrink-0 bg-white text-[#1B4F72] text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Åpne chat
          </Link>
        </div>
      </div>
    </div>
  );
}
