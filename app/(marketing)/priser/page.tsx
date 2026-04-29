import type { Metadata } from "next";
import { PricingTable } from "@/components/marketing/PricingTable";
import { Check, X } from "lucide-react";
import { PLANS } from "@/lib/plans";
import Link from "next/link";
import { EnterpriseForm } from "@/components/marketing/EnterpriseForm";

export const metadata: Metadata = {
  title: "Priser og planer",
  description:
    "Se alle priser og planer for HjemTrygg. Fra gratis demo til premium med ubegrenset tilgang til beredskapsverktøy.",
  openGraph: {
    title: "Priser og planer | HjemTrygg",
    description: "Se alle priser og planer for HjemTrygg. Fra gratis demo til premium med ubegrenset tilgang.",
    url: "https://hjemtrygg.no/priser",
    siteName: "HjemTrygg",
    type: "website",
  },
};

export default function PriserPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#1C2833] mb-4">Priser og planer</h1>
          <p className="text-[#5d6b7a] text-lg max-w-2xl mx-auto">
            Velg planen som passer din families behov. Alle planer inkluderer grunnleggende beredskapsverktøy.
          </p>
        </div>

        <PricingTable />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-[#1C2833] mb-8 text-center">
            Detaljert sammenligning
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-[#e5e9ec] rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-[#F4F6F7]">
                  <th className="text-left p-4 text-sm font-semibold text-[#1C2833]">Funksjon</th>
                  <th className="text-center p-4 text-sm font-semibold text-[#1C2833]">Demo</th>
                  <th className="text-center p-4 text-sm font-semibold text-[#1C2833]">Basis</th>
                  <th className="text-center p-4 text-sm font-semibold text-[#1B4F72] bg-[#1B4F72]/5">Pluss</th>
                  <th className="text-center p-4 text-sm font-semibold text-[#1C2833]">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9ec] text-sm">
                <ComparisonRow label="Pris per mnd" values={["Gratis", "99 kr", "199 kr", "349 kr"]} />
                <ComparisonRow label="Sjekklister" values={["1", "10", "50", "Ubegrenset"]} />
                <ComparisonRow label="Lagervarer" values={["10", "200", "1 000", "Ubegrenset"]} />
                <ComparisonRow label="Familiekontakter" values={["3", "20", "50", "Ubegrenset"]} />
                <ComparisonRow label="Dokumentlagring" values={[false, false, "25 dokumenter", "Ubegrenset"]} />
                <ComparisonRow label="TryggBot meldinger/mnd" values={["10", "200", "1 000", "Ubegrenset"]} />
                <ComparisonRow label="Avanserte maler" values={[false, false, true, true]} />
                <ComparisonRow label="PDF-eksport" values={[false, false, false, true]} />
                <ComparisonRow label="Prioritert support" values={[false, false, false, true]} />
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 bg-[#F4F6F7] rounded-lg border border-[#e5e9ec] p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-[#1C2833] mb-3">
              For bedrift og kommune
            </h2>
            <p className="text-[#5d6b7a] mb-6">
              Er du interessert i HjemTrygg for din organisasjon, bedrift eller kommune?
              Vi tilbyr skreddersydde løsninger med volumpriser, brukerstyring og tilpasset opplæring.
            </p>
            <EnterpriseForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
}: {
  label: string;
  values: (string | boolean)[];
}) {
  return (
    <tr className="hover:bg-[#F4F6F7]/50">
      <td className="p-4 font-medium text-[#1C2833]">{label}</td>
      {values.map((val, i) => (
        <td key={i} className={`p-4 text-center ${i === 2 ? "bg-[#1B4F72]/3" : ""}`}>
          {typeof val === "boolean" ? (
            val ? (
              <Check size={16} className="text-[#1E8449] mx-auto" aria-label="Ja" />
            ) : (
              <X size={16} className="text-[#C0392B] mx-auto" aria-label="Nei" />
            )
          ) : (
            <span className="text-[#1C2833]">{val}</span>
          )}
        </td>
      ))}
    </tr>
  );
}
