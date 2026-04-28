"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Hva er DSBs anbefaling for hjemmeberedskap?",
    answer:
      "Direktoratet for samfunnssikkerhet og beredskap (DSB) anbefaler at alle husstander er selvforsynt i minst tre dager – helst en uke. Dette inkluderer mat, vann (3 liter per person per dag), medisiner og enkelt utstyr. HjemTrygg hjelper deg å sette opp en slik plan.",
  },
  {
    question: "Er dataene mine trygge hos HjemTrygg?",
    answer:
      "Ja. All data overføres kryptert med TLS 1.3 og lagres kryptert med AES-256. Vi bruker etablerte leverandører (Vercel, Supabase) med europeiske datasentre. Du kan når som helst laste ned eller slette dine data. Les mer på sikkerhetssiden vår.",
  },
  {
    question: "Kan jeg bruke HjemTrygg uten å betale?",
    answer:
      "Absolutt. Demo-planen er gratis for alltid og inkluderer én sjekkliste, opp til 10 lagervarer, 3 familiekontakter og 10 TryggBot-meldinger per måned. For full funksjonalitet kan du oppgradere til Basis, Pluss eller Premium.",
  },
  {
    question: "Hva skjer hvis jeg sier opp abonnementet?",
    answer:
      "Du beholder tilgang til dine data i Demo-planen. Abonnementet avsluttes ved slutten av faktureringsperioden. Du kan eksportere alle dataene dine som JSON eller PDF (Premium) når som helst.",
  },
  {
    question: "Fungerer HjemTrygg på mobil?",
    answer:
      "Ja, HjemTrygg er fullt responsivt og fungerer på alle enheter. Vi anbefaler å legge siden til på hjemskjermen på mobilen for raskt tilgang – spesielt nyttig i en krisesituasjon.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-[#1C2833] mb-3">Vanlige spørsmål</h2>
        </div>
        <div className="divide-y divide-[#e5e9ec]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex justify-between items-center py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72] rounded"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-[#1C2833] pr-4">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#5d6b7a] flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {openIndex === i && (
                <div className="pb-5">
                  <p className="text-[#5d6b7a] text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
