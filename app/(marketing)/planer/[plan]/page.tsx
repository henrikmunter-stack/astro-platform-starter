import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PLANS, PlanKey } from "@/lib/plans";
import { Check, X } from "lucide-react";

export async function generateStaticParams() {
  return Object.keys(PLANS).map((key) => ({ plan: key }));
}

export async function generateMetadata({
  params,
}: {
  params: { plan: string };
}): Promise<Metadata> {
  const plan = PLANS[params.plan as PlanKey];
  if (!plan) return {};
  return {
    title: `${plan.name}-planen`,
    description: plan.description,
  };
}

export default function PlanDetailPage({ params }: { params: { plan: string } }) {
  const planKey = params.plan as PlanKey;
  const plan = PLANS[planKey];
  if (!plan) notFound();

  const features = [
    { label: `${plan.features.maxChecklists === Infinity ? "Ubegrenset antall" : plan.features.maxChecklists} sjekkliste(r)`, included: true },
    { label: `${plan.features.maxInventoryItems === Infinity ? "Ubegrenset" : plan.features.maxInventoryItems} lagervarer`, included: true },
    { label: `${plan.features.maxFamilyContacts === Infinity ? "Ubegrenset" : plan.features.maxFamilyContacts} familiekontakter`, included: true },
    {
      label:
        plan.features.maxDocuments === 0
          ? "Dokumentlagring ikke inkludert"
          : `${plan.features.maxDocuments === Infinity ? "Ubegrenset" : plan.features.maxDocuments} dokumenter`,
      included: plan.features.maxDocuments > 0,
    },
    {
      label: `TryggBot – ${plan.features.chatMessagesPerMonth === Infinity ? "ubegrenset" : plan.features.chatMessagesPerMonth} meldinger/mnd`,
      included: plan.features.chatMessagesPerMonth > 0,
    },
    { label: "Avanserte beredskaps-maler", included: plan.features.advancedTemplates },
    { label: "PDF-eksport av hele planen", included: plan.features.canExport },
    { label: "Prioritert kundestøtte", included: plan.features.prioritySupport },
  ];

  const whoIsItFor: Record<PlanKey, string> = {
    demo: "Perfekt for deg som ønsker å teste HjemTrygg uten forpliktelser. Demo-planen er gratis for alltid.",
    basis: "Ideell for den gjennomsnittlige norske husstanden. Dekker alle grunnleggende beredskapsbehov.",
    pluss: "For familier som tar beredskap på alvor. Dokumentlagring og avanserte maler gir deg full oversikt.",
    premium: "For deg som vil ha maksimal kontroll. Ubegrenset lagring, PDF-eksport og prioritert support.",
  };

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/planer" className="text-sm text-[#2E86AB] hover:underline">
            Tilbake til alle planer
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm overflow-hidden">
          <div className="bg-[#1B4F72] px-8 py-10 text-white">
            <h1 className="text-3xl font-semibold mb-2">{plan.name}</h1>
            <div className="text-4xl font-semibold">
              {plan.price === 0 ? "Gratis" : `${plan.price} kr/mnd`}
            </div>
            <p className="text-blue-200 mt-2">{plan.description}</p>
          </div>
          <div className="p-8">
            <h2 className="text-lg font-semibold text-[#1C2833] mb-4">Hva er inkludert</h2>
            <ul className="space-y-3 mb-8">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  {f.included ? (
                    <Check size={18} className="text-[#1E8449] mt-0.5 flex-shrink-0" aria-label="Inkludert" />
                  ) : (
                    <X size={18} className="text-[#C0392B] mt-0.5 flex-shrink-0" aria-label="Ikke inkludert" />
                  )}
                  <span className={f.included ? "text-[#1C2833]" : "text-gray-400 line-through"}>{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="bg-[#F4F6F7] rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-[#1C2833] mb-2">Hvem passer dette for?</h3>
              <p className="text-[#5d6b7a] text-sm">{whoIsItFor[planKey]}</p>
            </div>
            {planKey === "demo" ? (
              <Link
                href="/api/auth/signin"
                className="block w-full text-center bg-[#1B4F72] text-white font-semibold py-3 rounded-md hover:bg-[#16405e] transition-colors"
              >
                Start gratis
              </Link>
            ) : (
              <Link
                href="/priser"
                className="block w-full text-center bg-[#1B4F72] text-white font-semibold py-3 rounded-md hover:bg-[#16405e] transition-colors"
              >
                Velg {plan.name} – {plan.priceLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
