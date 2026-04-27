import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, PlanKey } from "@/lib/plans";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Planer",
  description: "Finn den riktige HjemTrygg-planen for din familie.",
};

export default function PlanerPage() {
  const planKeys: PlanKey[] = ["demo", "basis", "pluss", "premium"];
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#1C2833] mb-4">Finn din plan</h1>
          <p className="text-[#5d6b7a] text-lg">
            HjemTrygg tilbyr fire planer tilpasset ulike behov – fra gratis demo til full premium.
          </p>
        </div>
        <div className="space-y-4">
          {planKeys.map((key) => {
            const plan = PLANS[key];
            return (
              <Link
                key={key}
                href={`/planer/${key}`}
                className="flex items-center justify-between p-6 bg-white rounded-lg border border-[#e5e9ec] shadow-sm hover:border-[#1B4F72] hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-semibold text-[#1C2833]">{plan.name}</span>
                    <span className="text-sm font-medium text-[#2E86AB]">{plan.priceLabel}</span>
                  </div>
                  <p className="text-[#5d6b7a] text-sm">{plan.description}</p>
                </div>
                <ArrowRight size={20} className="text-[#1B4F72] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
