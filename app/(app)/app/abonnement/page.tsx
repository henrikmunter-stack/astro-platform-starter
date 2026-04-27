import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getPlan, PLANS, PlanKey } from "@/lib/plans";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Check } from "lucide-react";
import { PortalButton } from "@/components/app/PortalButton";

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const plan = getPlan(subscription);
  const isDemo = !subscription || subscription.plan === "demo";
  const messagesUsed = subscription?.chatMessagesThisMonth ?? 0;
  const messagesLimit = plan.features.chatMessagesPerMonth;

  const upgradeOptions: PlanKey[] = (["basis", "pluss", "premium"] as PlanKey[]).filter(
    (key) => key !== subscription?.plan
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1C2833]">Abonnement</h1>
        <p className="text-[#5d6b7a] text-sm mt-1">Administrer din plan og fakturering.</p>
      </div>

      {searchParams.success === "true" && (
        <div className="bg-[#1E8449]/10 border border-[#1E8449]/30 rounded-lg p-4 mb-5">
          <p className="text-sm text-[#1E8449] font-medium">Betalingen var vellykket! Abonnementet ditt er aktivert.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
          <h2 className="font-semibold text-[#1C2833] mb-4">Din plan</h2>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-semibold text-[#1B4F72]">{plan.name}</span>
            <span className="text-[#5d6b7a] text-sm">{plan.priceLabel}</span>
          </div>
          <div className="mb-3">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${
              subscription?.status === "active" ? "bg-[#1E8449]/10 text-[#1E8449]" :
              subscription?.status === "past_due" ? "bg-[#C0392B]/10 text-[#C0392B]" :
              "bg-[#D4AC0D]/10 text-[#D4AC0D]"
            }`}>
              {subscription?.status === "active" ? "Aktiv" :
               subscription?.status === "past_due" ? "Betaling forfalt" :
               subscription?.status === "canceled" ? "Kansellert" : "Gratis demo"}
            </span>
          </div>
          {subscription?.stripeCurrentPeriodEnd && (
            <p className="text-sm text-[#5d6b7a]">
              Neste fakturadato: {formatDate(subscription.stripeCurrentPeriodEnd)}
            </p>
          )}
          {!isDemo && subscription?.stripeSubscriptionId && (
            <div className="mt-4">
              <PortalButton />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
          <h2 className="font-semibold text-[#1C2833] mb-4">TryggBot-kvote</h2>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-[#5d6b7a]">Brukt denne m\xE5neden</span>
            <span className="font-semibold text-[#1C2833]">
              {messagesUsed} / {isFinite(messagesLimit) ? messagesLimit : "Ubegrenset"}
            </span>
          </div>
          {isFinite(messagesLimit) && (
            <div className="w-full bg-[#e5e9ec] rounded-full h-2 mb-2">
              <div
                className="bg-[#1B4F72] h-2 rounded-full"
                style={{ width: `${Math.min(100, (messagesUsed / messagesLimit) * 100)}%` }}
              />
            </div>
          )}
          <p className="text-xs text-[#5d6b7a]">Kvoten nullstilles 1. hver m\xE5ned</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-5">
        <h2 className="font-semibold text-[#1C2833] mb-4">Hva er inkludert</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            `${isFinite(plan.features.maxChecklists) ? plan.features.maxChecklists : "Ubegrenset"} sjekkliste(r)`,
            `${isFinite(plan.features.maxInventoryItems) ? plan.features.maxInventoryItems : "Ubegrenset"} lagervarer`,
            `${isFinite(plan.features.maxFamilyContacts) ? plan.features.maxFamilyContacts : "Ubegrenset"} kontakter`,
            plan.features.maxDocuments === 0 ? "Ingen dokumentlagring" : `${isFinite(plan.features.maxDocuments) ? plan.features.maxDocuments : "Ubegrenset"} dokumenter`,
            plan.features.advancedTemplates ? "Avanserte maler" : null,
            plan.features.canExport ? "PDF-eksport" : null,
            plan.features.prioritySupport ? "Prioritert support" : null,
          ].filter(Boolean).map((feat, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#1C2833]">
              <Check size={14} className="text-[#1E8449]" aria-hidden="true" />
              {feat}
            </li>
          ))}
        </ul>
      </div>

      {(isDemo || subscription?.plan !== "premium") && upgradeOptions.length > 0 && (
        <div className="bg-[#F4F6F7] rounded-lg border border-[#e5e9ec] p-6">
          <h2 className="font-semibold text-[#1C2833] mb-3">Oppgrader plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upgradeOptions.map((key) => {
              const upgradePlan = PLANS[key as PlanKey];
              return (
                <div key={key} className="bg-white rounded-lg border border-[#e5e9ec] p-4">
                  <div className="font-semibold text-[#1C2833]">{upgradePlan.name}</div>
                  <div className="text-[#1B4F72] font-semibold">{upgradePlan.priceLabel}</div>
                  <p className="text-xs text-[#5d6b7a] my-2">{upgradePlan.description}</p>
                  <Link
                    href="/priser"
                    className="block w-full text-center bg-[#1B4F72] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#16405e] transition-colors"
                  >
                    Velg {upgradePlan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
