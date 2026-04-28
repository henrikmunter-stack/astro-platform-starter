"use client";

import { Check, X } from "lucide-react";
import { PLANS, PlanKey } from "@/lib/plans";
import Link from "next/link";

const planOrder: PlanKey[] = ["demo", "basis", "pluss", "premium"];

export function PricingTable() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {planOrder.map((key) => {
        const plan = PLANS[key];
        const isPopular = key === "pluss";
        return (
          <div
            key={key}
            className={`relative bg-white rounded-lg border shadow-sm flex flex-col ${
              isPopular ? "border-[#1B4F72] ring-2 ring-[#1B4F72]" : "border-[#e5e9ec]"
            }`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#1B4F72] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Mest populær
                </span>
              </div>
            )}
            <div className="p-6 border-b border-[#e5e9ec]">
              <h3 className="text-lg font-semibold text-[#1C2833]">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-semibold text-[#1B4F72]">
                  {plan.price === 0 ? "Gratis" : `${plan.price} kr`}
                </span>
                {plan.price > 0 && (
                  <span className="text-[#5d6b7a] text-sm">/mnd</span>
                )}
              </div>
              <p className="text-[#5d6b7a] text-sm mt-2">{plan.description}</p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-3 text-sm">
                <FeatureRow
                  label={`${plan.features.maxChecklists === Infinity ? "Ubegrenset" : plan.features.maxChecklists} sjekkliste(r)`}
                  included={true}
                />
                <FeatureRow
                  label={`${plan.features.maxInventoryItems === Infinity ? "Ubegrenset" : plan.features.maxInventoryItems} lagervarer`}
                  included={true}
                />
                <FeatureRow
                  label={`${plan.features.maxFamilyContacts === Infinity ? "Ubegrenset" : plan.features.maxFamilyContacts} familiekontakter`}
                  included={true}
                />
                <FeatureRow
                  label={
                    plan.features.maxDocuments === 0
                      ? "Ingen dokumentlagring"
                      : plan.features.maxDocuments === Infinity
                      ? "Ubegrenset dokumentlagring"
                      : `${plan.features.maxDocuments} dokumenter`
                  }
                  included={plan.features.maxDocuments > 0}
                />
                <FeatureRow
                  label={
                    plan.features.chatMessagesPerMonth === Infinity
                      ? "TryggBot – ubegrenset"
                      : `TryggBot – ${plan.features.chatMessagesPerMonth} meldinger/mnd`
                  }
                  included={plan.features.chatMessagesPerMonth > 0}
                />
                <FeatureRow
                  label="Avanserte maler"
                  included={plan.features.advancedTemplates}
                />
                <FeatureRow
                  label="PDF-eksport"
                  included={plan.features.canExport}
                />
                <FeatureRow
                  label="Prioritert support"
                  included={plan.features.prioritySupport}
                />
              </ul>
            </div>
            <div className="p-6 pt-0">
              {key === "demo" ? (
                <Link
                  href="/api/auth/signin"
                  className="block w-full text-center py-2.5 px-4 rounded-md bg-[#1B4F72] text-white font-semibold hover:bg-[#16405e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72]"
                >
                  Kom i gang gratis
                </Link>
              ) : (
                <Link
                  href={`/planer/${key}`}
                  className={`block w-full text-center py-2.5 px-4 rounded-md font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72] ${
                    isPopular
                      ? "bg-[#1B4F72] text-white hover:bg-[#16405e]"
                      : "border border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72] hover:text-white"
                  }`}
                >
                  Velg {plan.name}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeatureRow({ label, included }: { label: string; included: boolean }) {
  return (
    <li className="flex items-start gap-2">
      {included ? (
        <Check size={16} className="text-[#1E8449] mt-0.5 flex-shrink-0" aria-label="Inkludert" />
      ) : (
        <X size={16} className="text-[#C0392B] mt-0.5 flex-shrink-0" aria-label="Ikke inkludert" />
      )}
      <span className={included ? "text-[#1C2833]" : "text-[#9ca3af] line-through"}>{label}</span>
    </li>
  );
}
